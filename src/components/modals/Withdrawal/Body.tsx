import brokerAxios from '@/api/brokerAxios';
import { useListUserBankAccountQuery, useRemainsWithDateQuery } from '@/api/queries/requests';
import Input from '@/components/common/Inputs/Input';
import Select from '@/components/common/Inputs/Select';
import { InfoCircleSVG } from '@/components/icons';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useBrokerQueryClient } from '@/hooks';
import { convertStringToInteger, sepNumbers, toISOStringWithoutChangeTime } from '@/utils/helpers';
import num2persian from '@/utils/num2persian';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { WithdrawalItem } from './WithdrawalItem';

interface WithdrawalBodyProps {
	onClose: () => void;
	editData?: Payment.IWithdrawalHistoryList;
}

export const Body = ({ onClose, editData }: WithdrawalBodyProps) => {
	const t = useTranslations();

	const url = useAppSelector(getBrokerURLs);

	const queryClient = useBrokerQueryClient();

	const userInfo: Broker.User | undefined = queryClient.getQueryData(['userInfoQuery']);

	const { customerAccountId, requestAmount, saveDate, id } = editData || {};

	const { data: userAccountOptions } = useListUserBankAccountQuery({
		queryKey: ['userAccount'],
	});

	const { data: remainsWithDate } = useRemainsWithDateQuery({
		queryKey: ['remainsWithDay'],
		select(data) {
			if (data?.t1 && data?.t2) {
				return {
					t1: {
						...data?.t1,
						date: new Date(data?.t1.date).getTime(),
					},
					t2: {
						...data?.t2,
						date: new Date(data?.t2.date).getTime(),
					},
				};
			}
			return data;
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		setValue,
	} = useForm<Payment.IWithdrawalForm>({
		defaultValues: {
			amount: '',
			bankAccount: null,
			withdrawalType: 't1',
		},
		mode: 'onChange',
	});

	const defaultOptionAccount = () => {
		if (editData) return userAccountOptions?.find((item) => item.id === customerAccountId);
		else if (userAccountOptions) return userAccountOptions[0];
	};

	const onChangeDate = (type: 't1' | 't2') => {
		try {
			const data = type === 't2' ? remainsWithDate?.t2 : remainsWithDate?.t1;

			if (!data?.valid) {
				toast.error(t('withdrawal_modal.withdrawal_not_allowed_datetime'), {
					toastId: 'withdrawal_not_allowed_datetime',
				});
				return;
			}

			setValue('amount', data.amount, { shouldValidate: true });
			setValue('withdrawalType', type, { shouldValidate: true });
		} catch (err) {
			//
		}
	};

	const onSubmit: SubmitHandler<Payment.IWithdrawalForm> = async (value) => {
		try {
			const withdrawalData = value.withdrawalType === 't2' ? remainsWithDate?.t2 : remainsWithDate?.t1;

			if (!url || !userInfo || !withdrawalData) return;

			const payload = {
				comment: '',
				customerAccountId: String(value.bankAccount?.id),
				customerISIN: userInfo.customerISIN,
				nationalCode: userInfo.nationalCode,
				[!editData ? 'requestAmount' : 'Amount']: convertStringToInteger(String(value.amount)),
				requestDate: toISOStringWithoutChangeTime(new Date(withdrawalData?.date)),
				id: id ?? undefined,
			};

			const response = await brokerAxios.post(
				!editData ? url?.WithdrawalRequestAdd : url?.WithdrawalRequestEdit,
				payload,
			);
			const data = response.data;

			if (!data.succeeded) {
				toast.error(t('i_errors.withdrawal_' + data.errors?.[0]));
			} else {
				!editData
					? toast.success(t('alerts.drawal_offline_successFully'))
					: toast.success(t('alerts.drawal_offline_successFully_edited'));
				onClose();

				queryClient.refetchQueries({ queryKey: ['withdrawalCashReports'], exact: false });
			}
		} catch (err) {
			toast.error(t('alerts.invalid_inputs'));
		}
	};

	useEffect(() => {
		if (userAccountOptions) {
			setValue('bankAccount', defaultOptionAccount() ?? null, { shouldValidate: true });
		}
	}, [userAccountOptions]);

	useEffect(() => {
		if (remainsWithDate && !editData) {
			setValue('amount', remainsWithDate.t1.valid ? remainsWithDate.t1.amount : remainsWithDate.t2.amount, {
				shouldValidate: true,
			});
			setValue('withdrawalType', remainsWithDate.t1.valid ? 't1' : 't2', { shouldValidate: true });
		} else if (editData) {
			setValue('amount', String(requestAmount), { shouldValidate: true });
			const isT1 = dayjs(remainsWithDate?.t1.date).isAfter(dayjs(saveDate));
			setValue('withdrawalType', isT1 ? 't1' : 't2', { shouldValidate: true });
		}
	}, [remainsWithDate]);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className='flex h-full flex-column'>
				<div>
					<Select<Payment.IUserBankAccount>
						onChange={(option) => setValue('bankAccount', option, { shouldValidate: true })}
						options={userAccountOptions || []}
						getOptionId={(option) => option.id}
						getOptionTitle={(option) => (
							<div className='w-full flex-justify-between'>
								<span>{option.bankName}</span>
								<span>{option.accountNumber}</span>
							</div>
						)}
						placeholder={t('withdrawal_modal.account_number_placeholder')}
						defaultValue={defaultOptionAccount()}
					/>
				</div>

				<div className='my-24 shadow-sm'>
					<div className='p-8'>
						<p className='mb-16 text-gray-500'>{t('withdrawal_modal.receive_date_placeholder')}</p>

						<ul className='flex flex-col gap-8 text-gray-800'>
							{remainsWithDate?.t1 && (
								<WithdrawalItem
									checked={getValues('withdrawalType') === 't1'}
									onChecked={() => onChangeDate('t1')}
									{...{ ...remainsWithDate.t1 }}
								/>
							)}

							{remainsWithDate?.t2 && (
								<WithdrawalItem
									checked={getValues('withdrawalType') === 't2'}
									onChecked={() => onChangeDate('t2')}
									{...{ ...remainsWithDate.t2 }}
								/>
							)}
						</ul>

						<div className='mt-16 flex items-center gap-4'>
							<InfoCircleSVG className='text-info-100' width='2rem' height='2rem' />
							<span className='text-tiny tracking-normal text-info-100'>
								{t('withdrawal_modal.day_attention')}
							</span>
						</div>
					</div>
				</div>

				<div>
					<Input
						{...register('amount', {
							required: {
								value: true,
								message: t('deposit_modal.placeholderDepositInput'),
							},
						})}
						value={sepNumbers(String(getValues('amount')))}
						onChange={(e) =>
							setValue('amount', convertStringToInteger(e.target.value), { shouldValidate: true })
						}
						type='text'
						prefix={t('common.rial')}
						placeholder={t('deposit_modal.placeholderDepositInput')}
						classInput='placeholder:text-right'
						inputMode='numeric'
						maxLength={25}
						num2persianValue={num2persian(String(getValues('amount')))}
						error={errors.amount?.message}
					/>
				</div>

				<div className='mt-48'>
					<button
						type='submit'
						className='text- h-48 w-full gap-8 rounded font-medium flex-justify-center btn-primary'
					>
						{!editData ? t('common.create_request') : t('common.edit')}
					</button>
				</div>
			</div>
		</form>
	);
};
