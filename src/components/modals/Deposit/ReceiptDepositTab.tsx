import brokerAxios from '@/api/brokerAxios';
import { useListBrokerBankAccountQuery } from '@/api/queries/requests';
import AdvancedDatepicker from '@/components/common/AdvanceDatePicker';
import Input from '@/components/common/Inputs/Input';
import Select from '@/components/common/Inputs/Select';
import { FileTextSVG, XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setDepositModal } from '@/features/slices/modalSlice';
import { useBrokerQueryClient } from '@/hooks';
import { convertStringToInteger, sepNumbers, toISOStringWithoutChangeTime } from '@/utils/helpers';
import num2persian from '@/utils/num2persian';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { type FC, type MouseEvent, useEffect, useMemo, useRef } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface ReceiptDepositTabProps {
	dataEdit?: Reports.IDepositWithReceipt;
}
interface inputType {
	receipt: string;
	price: string;
	account: Payment.IBrokerAccount | null;
	date: Date | null;
	image: File | null;
}

export const ReceiptDepositTab: FC<ReceiptDepositTabProps> = ({ dataEdit }) => {
	const t = useTranslations();

	const { receiptNumber, amount, bankAccountId, receiptDate, base64Image, id } = dataEdit || {};

	const inputRef = useRef<HTMLInputElement>(null);

	const url = useSelector(getBrokerURLs);

	const queryClient = useBrokerQueryClient();

	const userInfo: Broker.User | undefined = queryClient.getQueryData(['userInfoQuery']);

	const dispatch = useAppDispatch();

	const { data: brokerAccountOption } = useListBrokerBankAccountQuery({
		queryKey: ['brokerAccount'],
	});

	const findBankAccountSelect = useMemo(() => {
		if (!brokerAccountOption) return null;
		else if (!dataEdit) return brokerAccountOption[0];
		else return brokerAccountOption?.find((item) => String(item.id) === String(bankAccountId));
	}, [brokerAccountOption, bankAccountId]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
		watch,
	} = useForm<inputType>({
		defaultValues: {
			receipt: receiptNumber ?? '',
			price: amount ? String(amount) : '',
			account: null,
			date: receiptDate ? new Date(receiptDate) : new Date(),
			image: base64Image ?? null,
		},
		mode: 'onChange',
	});

	useEffect(() => {
		findBankAccountSelect && setValue('account', findBankAccountSelect, { shouldValidate: true });
	}, [findBankAccountSelect]);

	const resetInput = () => {
		if (inputRef.current) inputRef.current.files = new DataTransfer().files;
	};

	const onClearImage = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();

		setValue('image', null);
		resetInput();
	};

	const onUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const files = e.target.files;
			if (!files || files.length === 0) return setValue('image', null);

			const activeFile = files[0];
			if (activeFile.type === 'image/gif') throw new Error('file type is invalid.');

			const fileType = activeFile.type.slice(0, 5);
			if (fileType !== 'image') throw new Error('file type is invalid.');

			if (activeFile.size >= 1e6) {
				toast.error(t('common.file_size_must_be_less_than', { n: '1MB' }));
				throw new Error('file size must be less than 2MB.');
			}
			setValue('image', activeFile);
			resetInput();
		} catch (e) {
			setValue('image', null);
		}
	};

	const onSubmit: SubmitHandler<inputType> = async (inputs) => {
		try {
			const fd = new FormData();
			const { account, image, price, receipt, date } = inputs;

			if (!url || !userInfo || !account || !date) return;

			fd.append('BankAccountId', account.id);
			fd.append('AccountNumber', account?.accountNumber);
			fd.append('CustomerISIN', userInfo.customerISIN);
			fd.append('Amount', convertStringToInteger(price));
			fd.append('ReceiptNumber', receipt);
			fd.append('ReceiptDate', toISOStringWithoutChangeTime(new Date(date)));
			id && fd.append('Id', String(id));
			!dataEdit && fd.append('NationalCode', userInfo?.nationalCode);
			image && fd.append('File', image ?? '');

			const response = await brokerAxios.post(
				!dataEdit ? url.completeRequestReceipt : url.ReceiptEditRequest,
				fd,
			);

			const { data } = response;
			if (data.succeeded) {
				toast.success(t(!dataEdit ? 'alerts.offline_deposit_succeeded' : 'offline_deposit_succeeded_edited'), {
					toastId: 'offline_deposit_succeeded',
				});

				queryClient.refetchQueries({ queryKey: ['userRemainQuery'] });
				queryClient.refetchQueries({ queryKey: ['depositHistoryOnline'] });
			} else {
				toast.error(t('alerts.offline_deposit_failed'), {
					toastId: 'offline_deposit_succeeded',
				});
			}

			dispatch(setDepositModal(null));
		} catch (err) {
			//
		}
	};

	return (
		<div className='mt-24'>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<Input
						{...register('receipt', {
							required: {
								value: true,
								message: t('deposit_modal.receipt_value_placeholder'),
							},
						})}
						error={errors.receipt?.message}
						type='text'
						placeholder={t('deposit_modal.receipt_value_placeholder')}
						classInput='placeholder:text-right'
						inputMode='numeric'
					/>
				</div>

				<div className='mb-32 mt-24'>
					<Input
						{...register('price', {
							required: {
								value: true,
								message: t('deposit_modal.placeholderDepositInput'),
							},
						})}
						value={sepNumbers(String(getValues('price')))}
						onChange={(e) =>
							setValue('price', convertStringToInteger(e.target.value), { shouldValidate: true })
						}
						type='text'
						prefix={t('common.rial')}
						placeholder={t('deposit_modal.placeholderDepositInput')}
						classInput='placeholder:text-right'
						inputMode='numeric'
						maxLength={25}
						num2persianValue={num2persian(String(getValues('price')))}
						error={errors.price?.message}
					/>
				</div>

				<div className='flex gap-x-8'>
					<div className='flex-1'>
						<Select<Payment.IBrokerAccount>
							onChange={(option) => setValue('account', option)}
							options={brokerAccountOption || []}
							getOptionId={(option) => option.id}
							getOptionTitle={(option) => (
								<div className='w-full flex-justify-between'>
									<span>{option.bankName}</span>
									<span>{option.accountNumber}</span>
								</div>
							)}
							placeholder={t('deposit_modal.account_number_placeholder')}
							defaultValue={findBankAccountSelect}
						/>
					</div>
					<div className='w-2/5'>
						<AdvancedDatepicker
							value={getValues('date')}
							onChange={(value) => {
								setValue('date', value, { shouldValidate: true });
							}}
						/>
					</div>
				</div>

				<div className='my-24  border border-dashed border-gray-500' onClick={() => inputRef.current?.click()}>
					<input
						ref={inputRef}
						onChange={onUploadFile}
						accept='image/*'
						type='file'
						className='invisible absolute'
					/>

					{!watch('image') ? (
						<div
							style={{ height: '15.3rem' }}
							className='flex cursor-pointer items-center gap-y-8 p-24 flex-column'
						>
							<FileTextSVG />

							<p className='text-tiny text-gray-900'>
								تصویر فیش بانکی خود را اینجا رها کنید یا بارگذاری کنید(اختیاری)
							</p>

							<p className='text-gray-700'>{t('deposit_modal.receipt_upload_size')}</p>
						</div>
					) : (
						<div className='relative flex justify-center'>
							<div className='absolute left-0 top-0 cursor-pointer p-8' onClick={onClearImage}>
								<XSVG width='2rem' height='2rem' />
							</div>
							<Image
								src={URL.createObjectURL(getValues('image') as Blob | MediaSource)}
								alt=''
								height={153}
								width={200}
							/>
						</div>
					)}
				</div>

				<div>
					<button
						className='text- h-48 w-full gap-8 rounded font-medium flex-justify-center btn-primary'
						type='submit'
					>
						{t('deposit_modal.state_Request')}
					</button>
				</div>
			</form>
		</div>
	);
};
