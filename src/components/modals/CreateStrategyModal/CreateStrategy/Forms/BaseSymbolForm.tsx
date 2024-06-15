import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Inputs/Checkbox';
import InputLegend from '@/components/common/Inputs/InputLegend';
import Tooltip from '@/components/common/Tooltip';
import { QuestionCircleOutlineSVG, XCircleSVG } from '@/components/icons';
import { convertStringToInteger, divide } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface BaseSymbolFormProps extends Pick<CreateStrategy.CoveredCallInput, 'useFreeStock' | 'budget' | 'quantity'> {
	contractSize: number;
	inUseCapital: number;
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
	baseBestLimitPrice,
	optionBestLimitPrice,
	contractSize,
	inUseCapital,
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
		// ? orderQuantity = budget / inUseCapital
		const quantity = Math.floor(divide(v, inUseCapital)) * contractSize;

		setFieldsValue({
			budget: v,
			quantity,
		});
	};

	const onChangeQuantity = (v: number) => {
		// ? budget = orderQuantity * (contractSize * (baseBestSellLimitPrice - optionBestBuyLimitPrice))
		const budget = v * (contractSize * (baseBestLimitPrice - optionBestLimitPrice));

		setFieldsValue({
			quantity: v,
			budget,
		});
	};

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
				/>

				<div className='gap-8 flex-column'>
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

					<div className='h-20 text-light-error-100 flex-items-center'>
						{isQuantityTouched && isQuantityInvalid && (
							<>
								<XCircleSVG width='2rem' height='2rem' />
								<span className='text-tiny'>
									{t('create_strategy.strategy_quantity_invalid', { n: contractSize })}
								</span>
							</>
						)}
					</div>
				</div>

				<div className='text-tiny text-light-gray-700 flex-justify-between'>
					<span>{t('create_strategy.free_stock_quantity')}:</span>
					<span className='flex gap-4 text-light-gray-500'>
						<span className='font-medium text-light-gray-800'>10</span>
						{t('create_strategy.stock')}
					</span>
				</div>

				<Checkbox
					checked={useFreeStock}
					label={t('create_strategy.buy_assets_by_free_stock')}
					onChange={(v) => setFieldValue('useFreeStock', v)}
				/>
			</div>

			<div className='w-full gap-8 flex-column'>
				<div className='h-24 text-tiny text-light-gray-700 flex-justify-between'>
					<span>{t('create_strategy.remain_quantities')}:</span>
					<span className='flex gap-4 text-light-gray-500'>
						<span className='font-medium text-light-gray-800'>90</span>
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
