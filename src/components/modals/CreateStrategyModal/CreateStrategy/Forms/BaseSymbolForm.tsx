import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Inputs/Checkbox';
import InputLegend from '@/components/common/Inputs/InputLegend';
import { ArrowLeftSVG } from '@/components/icons';
import { convertStringToInteger } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface BaseSymbolFormProps extends CreateStrategy.IBaseSymbol {
	pending: boolean;
	nextStep: () => void;
	onChange: <T extends keyof CreateStrategy.IBaseSymbol>(name: T, value: CreateStrategy.IBaseSymbol[T]) => void;
}

const BaseSymbolForm = ({
	quantity,
	estimatedBudget,
	buyAssetsBySymbol,
	pending,
	nextStep,
	onChange,
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

	return (
		<form onSubmit={onSubmit} className='flex-1 flex-column flex-justify-between' method='get'>
			<div className='w-full flex-1 gap-16 flex-column'>
				<InputLegend
					type='text'
					value={estimatedBudget}
					onChange={(v) => onChange('estimatedBudget', Number(convertStringToInteger(v)))}
					placeholder={t('create_strategy.estimated_budget')}
					prefix={t('common.rial')}
					maxLength={16}
				/>

				<InputLegend
					type='text'
					value={quantity}
					onChange={(v) => onChange('quantity', Number(convertStringToInteger(v)))}
					placeholder={t('create_strategy.required_quantity')}
					prefix={t('create_strategy.stock')}
					separator={false}
					maxLength={10}
				/>

				<div className='text-tiny text-gray-900 flex-justify-between'>
					<span>{t('create_strategy.free_stock_quantity')}:</span>
					<span className='flex gap-4 text-gray-700'>
						<span className='font-medium text-gray-1000'>10</span>
						{t('create_strategy.stock')}
					</span>
				</div>

				<Checkbox
					checked={buyAssetsBySymbol}
					label={t('create_strategy.buy_assets_by_free_stock')}
					onChange={(v) => onChange('buyAssetsBySymbol', v)}
				/>
			</div>

			<div className='w-full gap-8 flex-column'>
				<div className='h-24 text-tiny text-gray-900 flex-justify-between'>
					<span>{t('create_strategy.remain_quantities')}:</span>
					<span className='flex gap-4 text-gray-700'>
						<span className='font-medium text-gray-1000'>90</span>
						{t('create_strategy.stock')}
					</span>
				</div>

				<Button disabled={pending} type='submit' className='h-48 rounded text-lg shadow btn-success'>
					{t('side.buy')}
					<ArrowLeftSVG />
				</Button>
			</div>
		</form>
	);
};

export default BaseSymbolForm;
