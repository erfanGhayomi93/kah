import Datepicker from '@/components/common/Datepicker';
import Input from '@/components/common/Inputs/Input';
import Select from '@/components/common/Inputs/Select';
import { FileTextSVG, XSVG } from '@/components/icons';
import { useInputs } from '@/hooks';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import num2persian from '@/utils/num2persian';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { type MouseEvent, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';


interface TSelectOptions {
	id: string;
	title: string | React.ReactNode;
}

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



	const sortingOptions = useMemo<TSelectOptions[]>(
		() => [
			{
				id: 'MaximumValue',
				title: t('old_option_chain.sort_highest_value_per_day'),
			},
			{
				id: 'ClosestSettlement',
				title: t('old_option_chain.sort_closest_due_date'),
			},
			{
				id: 'Alphabet',
				title: t('old_option_chain.sort_alphabet'),
			},
		],
		[],
	);


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

			<div className='my-24'>
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
					<Select<TSelectOptions>
						onChange={(option) => setFieldValue('accountNumber', option.id)}
						options={sortingOptions}
						getOptionId={(option) => option.id}
						getOptionTitle={(option) => option.title}
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

			{/* {inputs.image && imagePreview && ReactDOM.createPortal(<div onClick={showImageHandler} style={{ zIndex: 9999 }} className='fixed left-0 top-0 flex items-center justify-center w-screen h-screen bg-dark-secondary-100/20'>
				<div className='relative'>
					<div className='absolute left-6 top-6 p-4 bg-black/50 rounded cursor-pointer text-white'>
						<ClosePositionSVG />
					</div>
					<img
						onClick={e => e.stopPropagation()}
						style={{ maxWidth: '80vw', minWidth: '20rem', maxHeight: '80vh', minHeight: '20rem', backgroundColor: 'rgba(0,0,0,0.3)' }}
						src={URL.createObjectURL(inputs.image)}
						alt=""
					/>
				</div>
			</div>, document.body)} */}

		</div>
	);
};
