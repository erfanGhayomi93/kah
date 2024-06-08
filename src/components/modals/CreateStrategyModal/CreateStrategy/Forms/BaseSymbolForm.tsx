import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Inputs/Checkbox';
import InputLegend from '@/components/common/Inputs/InputLegend';
import { AngleLeftSVG } from '@/components/icons';
import { convertStringToInteger } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type TEditableInput = Pick<CreateStrategy.IBaseSymbol, 'quantity' | 'estimatedBudget' | 'buyAssetsBySymbol'>;

interface BaseSymbolFormProps extends CreateStrategy.IBaseSymbol {
	nextStep: () => void;
}

const BaseSymbolForm = ({
	type,
	symbolTitle,
	symbolISIN,
	quantity,
	estimatedBudget,
	buyAssetsBySymbol,
	orderPrice,
	orderQuantity,
	status,
	nextStep,
}: BaseSymbolFormProps) => {
	const t = useTranslations();

	const [inputs, setInputs] = useState<TEditableInput>({
		quantity,
		estimatedBudget,
		buyAssetsBySymbol,
	});

	const setProperty = <T extends keyof TEditableInput>(name: T, value: CreateStrategy.IBaseSymbol[T]) => {
		setInputs((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<form onSubmit={onSubmit} className='flex-1 flex-column flex-justify-between' method='get'>
			<div className='w-full flex-1 gap-16 flex-column'>
				<InputLegend
					type='text'
					value={inputs.estimatedBudget}
					onChange={(v) => setProperty('estimatedBudget', Number(convertStringToInteger(v)))}
					placeholder={t('create_strategy.estimated_budget')}
					prefix={t('common.rial')}
					maxLength={16}
				/>

				<InputLegend
					type='text'
					value={inputs.quantity}
					onChange={(v) => setProperty('quantity', Number(convertStringToInteger(v)))}
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
					checked={inputs.buyAssetsBySymbol}
					label={t('create_strategy.buy_assets_by_free_stock')}
					onChange={(v) => setProperty('buyAssetsBySymbol', v)}
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

				<Button type='submit' className='h-48 rounded text-lg shadow btn-success'>
					{t('side.buy')}
					<AngleLeftSVG />
				</Button>
			</div>
		</form>
	);
};

export default BaseSymbolForm;
