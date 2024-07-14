import { useDebounce, useInputs } from '@/hooks';
import { convertStringToInteger, copyNumberToClipboard, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

type TPriceRange = Record<'dueDays' | 'minPrice' | 'maxPrice', number | null>;

interface AnalyzeInputsProps extends TPriceRange {
	onChange: (values: TPriceRange) => void;
}

const AnalyzeInputs = ({ maxPrice, minPrice, dueDays, onChange }: AnalyzeInputsProps) => {
	const t = useTranslations('analyze_modal');

	const { setDebounce } = useDebounce();

	const { inputs, setFieldValue } = useInputs<TPriceRange>({
		minPrice,
		dueDays,
		maxPrice,
	});

	useEffect(() => {
		setDebounce(() => onChange(inputs), 500);
	}, [inputs]);

	useEffect(() => {
		setFieldValue('minPrice', minPrice);
	}, [minPrice]);

	useEffect(() => {
		setFieldValue('maxPrice', maxPrice);
	}, [maxPrice]);

	return (
		<div style={{ flex: '0 0 4rem' }} className='relative z-10 gap-24 flex-justify-between'>
			<div className='flex gap-16 flex-items-center'>
				<span className='text-tiny text-light-gray-700'>{t('input_due_days')}:</span>

				<input
					maxLength={4}
					type='text'
					name='due-days'
					placeholder={t('to_price')}
					className='h-40 w-96 rounded border border-light-gray-200 px-8'
					value={inputs.dueDays === null ? '' : sepNumbers(String(inputs.dueDays))}
					onCopy={(e) => copyNumberToClipboard(e, inputs.dueDays ?? 0)}
					onChange={(e) => setFieldValue('dueDays', Number(convertStringToInteger(e.target.value)))}
				/>
			</div>

			<div className='flex gap-16 flex-items-center'>
				<span className='text-tiny text-light-gray-700'>{t('input_price_range')}:</span>

				<div className='flex gap-8'>
					<input
						maxLength={10}
						type='text'
						name='min-price'
						placeholder={t('from_price')}
						className='h-40 w-96 rounded border border-light-gray-200 px-8'
						value={inputs.minPrice === null ? '' : sepNumbers(String(inputs.minPrice))}
						onCopy={(e) => copyNumberToClipboard(e, inputs.minPrice ?? 0)}
						onChange={(e) => setFieldValue('minPrice', Number(convertStringToInteger(e.target.value)))}
					/>
					<input
						maxLength={10}
						type='text'
						name='max-price'
						placeholder={t('to_price')}
						className='h-40 w-96 rounded border border-light-gray-200 px-8'
						value={inputs.maxPrice === null ? '' : sepNumbers(String(inputs.maxPrice))}
						onCopy={(e) => copyNumberToClipboard(e, inputs.maxPrice ?? 0)}
						onChange={(e) => setFieldValue('maxPrice', Number(convertStringToInteger(e.target.value)))}
					/>
				</div>
			</div>
		</div>
	);
};

export default AnalyzeInputs;
