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
						? 'bg-light-secondary-200 !border-light-primary-100 text-light-primary-100 rounded border'
						: 'text-light-gray-700 gray-box hover:btn-hover',
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
						? 'bg-light-secondary-200 !border-light-primary-100 text-light-primary-100 rounded border'
						: 'text-light-gray-700 gray-box hover:btn-hover',
				)}
			>
				<PayMoneySVG width='2rem' height='2rem' />
				{t('bs_modal.cash_collateral')}
			</button>
		</>
	);
};

export default SelectCollateral;
