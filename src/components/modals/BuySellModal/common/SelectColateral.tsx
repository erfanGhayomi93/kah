import { PayMoneySVG, SnowFlakeSVG } from '@/components/icons';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface SelectCollateralProps {
	value: TBsCollaterals | null;
	onChange: (v: TBsCollaterals) => void;
}

const SelectCollateral = ({ value, onChange }: SelectCollateralProps) => {
	const t = useTranslations();

	return (
		<>
			<button
				onClick={() => onChange('stock')}
				type='button'
				className={cn(
					'h-full flex-1 gap-8 transition-colors flex-justify-center',
					value === 'stock'
						? 'rounded border !border-primary-400 bg-secondary-100 text-primary-400'
						: 'hover:btn-hover text-gray-900 gray-box',
				)}
			>
				<SnowFlakeSVG width='2rem' height='2rem' />
				{t('bs_modal.stock_collateral')}
			</button>
			<button
				onClick={() => onChange('cash')}
				type='button'
				className={cn(
					'h-full flex-1 gap-8 transition-colors flex-justify-center',
					value === 'cash'
						? 'rounded border !border-primary-400 bg-secondary-100 text-primary-400'
						: 'hover:btn-hover text-gray-900 gray-box',
				)}
			>
				<PayMoneySVG width='2rem' height='2rem' />
				{t('bs_modal.cash_collateral')}
			</button>
		</>
	);
};

export default SelectCollateral;
