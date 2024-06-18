import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import SymbolState from '@/components/common/SymbolState';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import Grid from './Grid';

interface SymbolInfoProps {
	symbolData: Symbol.Info | null;
	isLoading: boolean;
}

const SymbolInfo = ({ symbolData, isLoading }: SymbolInfoProps) => {
	const t = useTranslations();

	if (isLoading) return <Loading />;

	if (!symbolData) return <NoData />;

	const {
		symbolTradeState,
		symbolTitle,
		symbolISIN,
		companyName,
		lastTradedPrice,
		closingPriceVarReferencePrice,
		closingPriceVarReferencePricePercent,
		lowThreshold,
		highThreshold,
	} = symbolData;

	return (
		<div className='h-full justify-between px-16 pb-16 pt-24 flex-column'>
			<div className='flex items-start justify-between'>
				<div className='flex-1 gap-4 flex-column'>
					<div className='gap-8 flex-items-center'>
						<SymbolState state={symbolTradeState} />
						<h1 className='text-light-gray-800 text-lg font-medium'>{symbolTitle}</h1>
					</div>
					<h2 className='text-light-gray-700 pr-16 text-tiny'>{companyName}</h2>
				</div>

				<div className='h-fit gap-8 flex-items-center'>
					<span className='text-light-gray-800 gap-4 text-base flex-items-center'>
						<span className='flex items-center ltr'>
							({(closingPriceVarReferencePricePercent ?? 0).toFixed(2)} %)
						</span>
						{sepNumbers(String(closingPriceVarReferencePrice ?? 0))}
					</span>

					<span className='text-light-gray-800 flex items-center gap-4 text-2xl font-bold'>
						{sepNumbers(String(lastTradedPrice ?? 0))}
						<span className='text-light-gray-700 text-tiny font-normal'>{t('common.rial')}</span>
					</span>
				</div>
			</div>

			<Grid symbolISIN={symbolISIN} lowThreshold={lowThreshold} highThreshold={highThreshold} />
		</div>
	);
};

export default SymbolInfo;
