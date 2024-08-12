import { useDebounce, useInputs } from '@/hooks';
import { convertStringToInteger, copyNumberToClipboard, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import KeyDown from '../KeyDown';

type TPriceRange = Record<'dueDays' | 'minPrice' | 'maxPrice', number | null>;

interface AnalyzeInputsProps extends TPriceRange {
	onChange: (values: TPriceRange) => void;
}

const AnalyzeInputs = ({ maxPrice, minPrice, dueDays, onChange }: AnalyzeInputsProps) => {
	const t = useTranslations('analyze_modal');

	const { setDebounce, clearDebounce } = useDebounce();

	const { inputs, setFieldValue, setFieldsValue } = useInputs<TPriceRange>({
		minPrice,
		dueDays,
		maxPrice,
	});

	const onKeyDown = () => {
		try {
			clearDebounce();
			onChange(inputs);
		} catch (e) {
			//
		}
	};

	useEffect(() => {
		setDebounce(() => onChange(inputs), 1e3);
	}, [inputs]);

	useEffect(() => {
		clearDebounce();
		setFieldsValue({ maxPrice, minPrice, dueDays });
	}, [maxPrice, minPrice, dueDays]);

	return (
		<KeyDown keys={['Enter']} onKeyDown={onKeyDown} dependencies={[inputs]}>
			<div style={{ flex: '0 0 4rem' }} className='relative z-10 gap-24 flex-justify-between'>
				<div className='flex gap-16 flex-items-center'>
					<span className='text-tiny text-gray-700'>{t('input_due_days')}:</span>

					<input
						maxLength={4}
						type='text'
						name='due-days'
						placeholder={t('to_price')}
						className='h-40 w-96 rounded border border-gray-200 px-8'
						value={inputs.dueDays === null ? '' : sepNumbers(String(inputs.dueDays))}
						onCopy={(e) => copyNumberToClipboard(e, inputs.dueDays ?? 0)}
						onChange={(e) => setFieldValue('dueDays', Number(convertStringToInteger(e.target.value)))}
					/>
				</div>

				<div className='flex gap-16 flex-items-center'>
					<span className='text-tiny text-gray-700'>{t('input_price_range')}:</span>

					<div className='flex gap-8'>
						<input
							maxLength={10}
							type='text'
							name='min-price'
							placeholder={t('from_price')}
							className='h-40 w-96 rounded border border-gray-200 px-8'
							value={inputs.minPrice === null ? '' : sepNumbers(String(inputs.minPrice))}
							onCopy={(e) => copyNumberToClipboard(e, inputs.minPrice ?? 0)}
							onChange={(e) => setFieldValue('minPrice', Number(convertStringToInteger(e.target.value)))}
						/>
						<input
							maxLength={10}
							type='text'
							name='max-price'
							placeholder={t('to_price')}
							className='h-40 w-96 rounded border border-gray-200 px-8'
							value={inputs.maxPrice === null ? '' : sepNumbers(String(inputs.maxPrice))}
							onCopy={(e) => copyNumberToClipboard(e, inputs.maxPrice ?? 0)}
							onChange={(e) => setFieldValue('maxPrice', Number(convertStringToInteger(e.target.value)))}
						/>
					</div>
				</div>
			</div>
		</KeyDown>
	);
};

export default AnalyzeInputs;
