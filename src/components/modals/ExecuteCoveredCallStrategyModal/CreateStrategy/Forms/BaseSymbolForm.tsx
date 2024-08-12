import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Inputs/Checkbox';
import InputLegend from '@/components/common/Inputs/InputLegend';
import Tooltip from '@/components/common/Tooltip';
import { InfoCircleSVG, QuestionCircleOutlineSVG, XCircleSVG } from '@/components/icons';
import { convertStringToInteger, copyNumberToClipboard, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface BaseSymbolFormProps extends Pick<CreateStrategy.CoveredCallInput, 'useFreeStock' | 'budget' | 'quantity'> {
	asset: number;
	contractSize: number;
	pending: boolean;
	baseBestLimitPrice: number;
	optionBestLimitPrice: number;
	baseSymbolCommission: number;
	optionCommission: number;
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
	baseSymbolCommission,
	optionCommission,
	useFreeStock,
	pending,
	nextStep,
	setFieldValue,
	setFieldsValue,
}: BaseSymbolFormProps) => {
	const t = useTranslations();

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
		// ? quantity = budget / ((baseBestLimitPrice + (baseBestLimitPrice * commission)) - (optionBestLimitPrice + (optionBestLimitPrice * commission)));
		// ? quantity = budget / (baseBestLimitPrice + (baseBestLimitPrice * commission));

		const quantity = Math.floor(v / (baseBestLimitPrice + baseBestLimitPrice * baseSymbolCommission));
		setFieldsValue({
			budget: v,
			quantity,
		});
	};

	const onChangeQuantity = (v: number) => {
		// ? budget = quantity * ((baseBestLimitPrice + (baseBestLimitPrice * commission)) - (optionBestLimitPrice + (optionBestLimitPrice * commission)));
		// ? budget = baseBestLimitPrice * quantity + (baseBestLimitPrice * quantity * commission);

		const budget = Math.ceil(baseBestLimitPrice * v * (1 + baseSymbolCommission));
		setFieldsValue({
			quantity: v,
			budget,
		});
	};

	const validateQuantity = () => {
		// ? budget = baseBestLimitPrice * quantity * (1 + commission);

		const newQuantity = Math.max(contractSize, Math.round(quantity / contractSize) * contractSize);
		const newBudget = baseBestLimitPrice * newQuantity * (1 + baseSymbolCommission);

		setFieldsValue({
			quantity: newQuantity,
			budget: Math.ceil(newBudget),
		});
	};

	const remainsQuantity = useFreeStock ? Math.max(0, quantity - asset) : quantity;

	const isQuantityInvalid = quantity % contractSize !== 0;

	return (
		<form onSubmit={onSubmit} className='flex-1 flex-column flex-justify-between' method='get'>
			<div className='w-full flex-1 gap-16 flex-column'>
				<div className='gap-8 flex-column'>
					<InputLegend
						type='text'
						value={budget}
						onCopy={(e) => copyNumberToClipboard(e, budget)}
						onChange={(v) => onChangeBudget(Number(convertStringToInteger(v)))}
						placeholder={
							<>
								{t('create_strategy.overall_budget')}
								<Tooltip placement='top' content='Tooltip'>
									<QuestionCircleOutlineSVG width='1.6rem' height='1.6rem' />
								</Tooltip>
							</>
						}
						prefix={t('common.rial')}
						maxLength={16}
						legendWidth={120}
						autoTranslateLegend
						classes={{
							prefix: 'w-40',
						}}
						onBlur={validateQuantity}
					/>

					{Boolean(budget) && (
						<div className='h-32 gap-8 rounded bg-info-50 pr-16 text-info-100 flex-justify-start'>
							<InfoCircleSVG width='1.6rem' height='1.6rem' />
							{t.rich('create_strategy.overall_amount', {
								chunk: () => (
									<span className='text-gray-800 ltr'>
										{sepNumbers(
											String(
												Math.ceil(
													quantity *
														Math.max(
															baseBestLimitPrice +
																baseBestLimitPrice * baseSymbolCommission -
																(optionBestLimitPrice +
																	optionBestLimitPrice * optionCommission),
															0,
														),
												),
											),
										)}
									</span>
								),
							})}
						</div>
					)}
				</div>

				<div className={clsx('flex-column', isQuantityInvalid ? 'gap-8' : 'gap-16')}>
					<div className='gap-4 flex-column'>
						<InputLegend
							type='text'
							value={quantity}
							onCopy={(e) => copyNumberToClipboard(e, quantity)}
							onChange={(v) => onChangeQuantity(Number(convertStringToInteger(v)))}
							placeholder={t('create_strategy.required_quantity')}
							prefix={t('create_strategy.stock')}
							maxLength={10}
							autoTranslateLegend
							hasError={isQuantityInvalid}
							onBlur={validateQuantity}
							classes={{
								prefix: 'w-40',
							}}
						/>

						{isQuantityInvalid && (
							<div className='gap-6 text-error-100 flex-items-center'>
								<XCircleSVG width='1.6rem' height='1.6rem' />
								<span className='text-tiny'>
									{t('create_strategy.strategy_quantity_invalid', { n: contractSize })}
								</span>
							</div>
						)}
					</div>

					<div className='text-tiny text-gray-700 flex-justify-between'>
						<span>{t('create_strategy.free_stock_quantity')}:</span>
						<span className='flex gap-4 text-gray-500'>
							<span className='font-medium text-gray-800'>{sepNumbers(String(asset))}</span>
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
				<div className='h-24 text-tiny text-gray-700 flex-justify-between'>
					<span>{t('create_strategy.remain_quantities')}:</span>
					<span className='flex gap-4 text-gray-500'>
						<span className='font-medium text-gray-800'>{sepNumbers(String(remainsQuantity))}</span>
						{t('create_strategy.stock')}
					</span>
				</div>

				<Button
					afterArrow
					disabled={pending || quantity === 0 || budget === 0 || isQuantityInvalid}
					type='submit'
					className={clsx(
						'h-48 rounded text-lg shadow',
						remainsQuantity === 0 ? 'btn-primary' : 'btn-success',
					)}
				>
					{t(remainsQuantity === 0 ? 'common.continue' : 'side.buy')}
				</Button>
			</div>
		</form>
	);
};

export default BaseSymbolForm;
