import { useListBrokerBankAccountQuery } from '@/api/queries/requests';
import Datepicker from '@/components/common/Datepicker';
import Input from '@/components/common/Inputs/Input';
import Select from '@/components/common/Inputs/Select';
import { FileTextSVG, XSVG } from '@/components/icons';
import { useInputs } from '@/hooks';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import num2persian from '@/utils/num2persian';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { type MouseEvent, useRef } from 'react';
import { toast } from 'react-toastify';


interface inputType {
	receipt: string;
	price: string;
	accountNumber: string
	date: number | null,
	image: File | null
}

export const ReceiptDepositTab = () => {

	const t = useTranslations();

	const inputRef = useRef<HTMLInputElement>(null);

	const { data: brokerAccountOption } = useListBrokerBankAccountQuery({
		queryKey: ['brokerAccount']
	});



	const { inputs, setFieldValue } = useInputs<inputType>({
		receipt: '',
		price: '',
		accountNumber: '',
		date: null,
		image: null
	});

	const resetInput = () => {
		if (inputRef.current) inputRef.current.files = new DataTransfer().files;
	};

	const onClearImage = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();

		setFieldValue('image', null);
		resetInput();
	};


	const onUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const files = e.target.files;
			if (!files || files.length === 0) return setFieldValue('image', null);

			const activeFile = files[0];
			if (activeFile.type === 'image/gif') throw new Error('file type is invalid.');

			const fileType = activeFile.type.slice(0, 5);
			if (fileType !== 'image') throw new Error('file type is invalid.');

			if (activeFile.size >= 1E6) {
				toast.error(t('common.file_size_must_be_less_than', { v: '1MB' }));
				throw new Error('file size must be less than 2MB.');
			}
			setFieldValue('image', activeFile);
			resetInput();
		} catch (e) {
			setFieldValue('image', null);
		}
	};



	return (
		<div className='mt-24'>
			<div>
				<Input
					value={inputs.receipt}
					onChange={(e) => setFieldValue('receipt', e.target.value)}
					type='text'
					placeholder={t('deposit_modal.receipt_value_placeholder')}
					classInput="placeholder:text-right"
					inputMode='numeric'
				/>
			</div>

			<div className='mt-24 mb-32'>
				<Input
					value={sepNumbers((String(inputs.price)))}
					onChange={(e) => setFieldValue('price', convertStringToInteger(e.target.value))}
					type='text'
					prefix={t('common.rial')}
					placeholder={t('deposit_modal.placeholderDepositInput')}
					classInput="placeholder:text-right"
					inputMode='numeric'
					maxLength={25}
					num2persianValue={num2persian((String(inputs.price)))}
				/>
			</div>

			<div className='flex gap-x-8'>
				<div className='flex-1'>
					<Select<Payment.IBrokerAccount>
						onChange={(option) => setFieldValue('accountNumber', option.id)}
						options={brokerAccountOption || []}
						getOptionId={(option) => option.id}
						getOptionTitle={(option) => (
							<div className='flex-justify-between w-full'>
								<span>{option.bankName}</span>
								<span>{option.accountNumber}</span>
							</div>
						)}
						placeholder={t('deposit_modal.account_number_placeholder')}
					/>
				</div>
				<div className='w-2/5'>
					<Datepicker
						value={inputs.date}
						onChange={(value) => setFieldValue('date', value)}
					/>
				</div>
			</div>

			<div
				className='my-24  border border-dashed border-gray-500'
				onClick={() => inputRef.current?.click()}
			>
				<input ref={inputRef} onChange={onUploadFile} accept="image/*" type='file' className="absolute invisible" />

				{
					!inputs.image ? (
						<div className='flex flex-column items-center gap-y-8 cursor-pointer p-24 h-[153px]'>

							<FileTextSVG />

							<p className='text-gray-900 text-tiny'>
								تصویر فیش بانکی خود را اینجا رها کنید یا بارگذاری کنید(اختیاری)
							</p>

							<p className='text-gray-700'>
								{t('deposit_modal.receipt_upload_size')}
							</p>
						</div>
					) : (
						<div className='h-[153px] flex justify-center relative'>
							<div className='absolute top-0 left-0 p-8 cursor-pointer' onClick={onClearImage}>
								<XSVG width='2rem' height='2rem' />
							</div>
							<Image src={URL.createObjectURL(inputs.image)} alt='' height={153} width={200} />
						</div>
					)
				}


			</div>

			<div>
				<button
					className='h-48 btn-primary rounded w-full font-medium gap-8 flex-justify-center text-'
					type='button'
				>

					{t('deposit_modal.state_Request')}

				</button>
			</div>

		</div>
	);
};
