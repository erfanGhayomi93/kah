import { useDebounce, useInputs } from '@/hooks';
import { convertStringToInteger, copyNumberToClipboard, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

interface PriceRangeProps extends Pick<IAnalyzeInputs, 'minPrice' | 'maxPrice'> {
	onChange: (values: Partial<Pick<IAnalyzeInputs, 'minPrice' | 'maxPrice'>>) => void;
}

const PriceRange = ({ maxPrice, minPrice, onChange }: PriceRangeProps) => {
	const t = useTranslations();

	const { setDebounce } = useDebounce();

	const { inputs, setFieldValue } = useInputs({
		minPrice,
		maxPrice,
	});

	useEffect(() => {
		setDebounce(() => {
			onChange(inputs);
		}, 500);
	}, [inputs]);

	useEffect(() => {
		setFieldValue('minPrice', minPrice);
	}, [minPrice]);

	useEffect(() => {
		setFieldValue('maxPrice', maxPrice);
	}, [maxPrice]);

	return (
		<div style={{ flex: '0 0 4rem' }} className='relative z-10 gap-16 flex-items-center'>
			<span className='text-tiny text-light-gray-700'>{t('analyze_modal.base_symbol_price_range')}:</span>

			<div className='flex gap-8'>
				<input
					maxLength={10}
					type='text'
					name='min-price'
					placeholder={t('analyze_modal.from_price')}
					className='h-40 w-96 rounded border border-light-gray-200 px-8'
					value={!inputs.minPrice ? '' : sepNumbers(String(inputs.minPrice))}
					onCopy={(e) => copyNumberToClipboard(e, inputs.minPrice ?? 0)}
					onChange={(e) => setFieldValue('minPrice', Number(convertStringToInteger(e.target.value)))}
				/>
				<input
					maxLength={10}
					type='text'
					name='max-price'
					placeholder={t('analyze_modal.to_price')}
					className='h-40 w-96 rounded border border-light-gray-200 px-8'
					value={!inputs.maxPrice ? '' : sepNumbers(String(inputs.maxPrice))}
					onCopy={(e) => copyNumberToClipboard(e, inputs.maxPrice ?? 0)}
					onChange={(e) => setFieldValue('maxPrice', Number(convertStringToInteger(e.target.value)))}
				/>
			</div>
		</div>
	);
};

export default PriceRange;
