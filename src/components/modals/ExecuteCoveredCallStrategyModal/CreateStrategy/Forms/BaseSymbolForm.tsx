import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Inputs/Checkbox';
import InputLegend from '@/components/common/Inputs/InputLegend';
import Tooltip from '@/components/common/Tooltip';
import { QuestionCircleOutlineSVG, XCircleSVG } from '@/components/icons';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface BaseSymbolFormProps extends Pick<CreateStrategy.CoveredCallInput, 'useFreeStock' | 'budget' | 'quantity'> {
	asset: number;
	contractSize: number;
	pending: boolean;
	baseBestLimitPrice: number;
	optionBestLimitPrice: number;
	nextStep: () => void;
	setFieldsValue: (values: Partial<CreateStrategy.CoveredCallInput>) => void;
	setFieldValue: <K extends keyof CreateStrategy.CoveredCallInput>(
		name: K,
		value: CreateStrategy.CoveredCallInput[K],
	) => void;
}

const BaseSymbolForm = ({
	asset,
	baseBestLimitPrice,
	optionBestLimitPrice,
	contractSize,
	quantity,
	budget,
	useFreeStock,
	pending,
	nextStep,
	setFieldValue,
	setFieldsValue,
}: BaseSymbolFormProps) => {
	const t = useTranslations();

	const [isQuantityTouched, setIsQuantityTouched] = useState(false);

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (pending) throw new Error();
			nextStep();
		} catch (e) {
			//
		}
	};

	const onChangeBudget = (v: number) => {
		// ? quantity = budget / (contractSize * (baseBestLimitPrice - optionBestLimitPrice));

		const q = v / (contractSize * (baseBestLimitPrice - optionBestLimitPrice));
		setFieldsValue({
			budget: v,
			quantity: Math.floor(q),
		});
	};

	const onChangeQuantity = (v: number) => {
		// ? budget = quantity * contractSize * (baseBestLimitPrice - optionBestLimitPrice);

		const b = v * contractSize * (baseBestLimitPrice - optionBestLimitPrice);
		setFieldsValue({
			quantity: v,
			budget: Math.ceil(b),
		});
	};

	const validateQuantity = () => {
		const b = quantity * contractSize * (baseBestLimitPrice - optionBestLimitPrice);
		setFieldValue('budget', Math.ceil(b));
	};

	const remainsQuantity = useFreeStock ? Math.max(0, quantity - asset) : quantity;

	const isQuantityInvalid = quantity % contractSize !== 0;

	return (
		<form onSubmit={onSubmit} className='flex-1 flex-column flex-justify-between' method='get'>
			<div className='w-full flex-1 gap-16 flex-column'>
				<InputLegend
					type='text'
					value={budget}
					onChange={(v) => onChangeBudget(Number(convertStringToInteger(v)))}
					placeholder={
						<>
							{t('create_strategy.estimated_budget')}
							<Tooltip placement='top' content='Tooltip'>
								<QuestionCircleOutlineSVG width='1.6rem' height='1.6rem' />
							</Tooltip>
						</>
					}
					prefix={t('common.rial')}
					maxLength={16}
					legendWidth={96}
					autoTranslateLegend
					classes={{
						prefix: 'w-40',
					}}
					onBlur={validateQuantity}
				/>

				<div className={clsx('flex-column', isQuantityTouched && isQuantityInvalid ? 'gap-8' : 'gap-16')}>
					<div className='gap-4 flex-column'>
						<InputLegend
							type='text'
							value={quantity}
							onChange={(v) => onChangeQuantity(Number(convertStringToInteger(v)))}
							placeholder={t('create_strategy.required_quantity')}
							prefix={t('create_strategy.stock')}
							maxLength={10}
							autoTranslateLegend
							onBlur={() => setIsQuantityTouched(true)}
							hasError={isQuantityTouched && isQuantityInvalid}
							classes={{
								prefix: 'w-40',
							}}
						/>

						{isQuantityTouched && isQuantityInvalid && (
							<div className='gap-6 text-light-error-100 flex-items-center'>
								<XCircleSVG width='1.6rem' height='1.6rem' />
								<span className='text-tiny'>
									{t('create_strategy.strategy_quantity_invalid', { n: contractSize })}
								</span>
							</div>
						)}
					</div>

					<div className='text-tiny text-light-gray-700 flex-justify-between'>
						<span>{t('create_strategy.free_stock_quantity')}:</span>
						<span className='flex gap-4 text-light-gray-500'>
							<span className='font-medium text-light-gray-800'>{sepNumbers(String(asset))}</span>
							{t('create_strategy.stock')}
						</span>
					</div>
				</div>

				<Checkbox
					disabled={asset === 0}
					checked={asset === 0 ? false : useFreeStock}
					label={t('create_strategy.buy_assets_by_free_stock')}
					onChange={(v) => setFieldValue('useFreeStock', v)}
				/>
			</div>

			<div className='w-full gap-8 flex-column'>
				<div className='h-24 text-tiny text-light-gray-700 flex-justify-between'>
					<span>{t('create_strategy.remain_quantities')}:</span>
					<span className='flex gap-4 text-light-gray-500'>
						<span className='font-medium text-light-gray-800'>{sepNumbers(String(remainsQuantity))}</span>
						{t('create_strategy.stock')}
					</span>
				</div>

				<Button
					afterArrow
					disabled={pending || quantity === 0 || budget === 0 || isQuantityInvalid}
					type='submit'
					className='h-48 rounded text-lg shadow btn-success'
				>
					{t('side.buy')}
				</Button>
			</div>
		</form>
	);
};

export default BaseSymbolForm;
