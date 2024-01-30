import { useSymbolBestLimitQuery } from '@/api/queries/symbolQuery';
import { useTranslations } from 'next-intl';

interface SymbolPriceTableProps {
	symbolISIN: string;
}

const SymbolPriceTable = ({ symbolISIN }: SymbolPriceTableProps) => {
	const t = useTranslations();

	const { data } = useSymbolBestLimitQuery({
		queryKey: ['symbolBestLimitQuery', symbolISIN],
		enabled: Boolean(symbolISIN),
	});

	return (
		<div className='flex flex-1 gap-8'>
			<div style={{ flex: '0 0 calc(50% - 0.4rem)' }} className='gap-8 flex-column'>
				<div className='*:text-gray-900 flex-justify-between *:text-base'>
					<div style={{ flexBasis: '0 0 25%' }} className='pl-8 pr-16 text-right'>
						{t('market_depth.count_column')}
					</div>
					<div style={{ flexBasis: '0 0 50%' }} className='px-8 text-center'>
						{t('market_depth.quantity_column')}
					</div>
					<div style={{ flexBasis: '0 0 25%' }} className='pl-16 pr-8 text-left'>
						{t('market_depth.price_column')}
					</div>
				</div>
			</div>

			<div style={{ flex: '0 0 calc(50% - 0.4rem)' }} />
		</div>
	);
};

export default SymbolPriceTable;
