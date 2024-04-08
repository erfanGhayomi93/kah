import Loading from '@/components/common/Loading';
import SymbolState from '@/components/common/SymbolState';
import NoData from '@/components/panels/SymbolInfoPanel/common/NoData';
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
		closingPrice,
		closingPriceVarReferencePrice,
	} = symbolData;

	return (
		<div className='h-full justify-between px-16 py-8 flex-column'>
			<div className='flex items-start justify-between'>
				<div className='flex-1 gap-4 flex-column'>
					<div className='gap-8 flex-items-center'>
						<SymbolState state={symbolTradeState} />
						<h1 className='text-lg font-medium text-gray-1000'>{symbolTitle}</h1>
					</div>
					<h2 className='pr-16 text-tiny text-gray-900'>{companyName}</h2>
				</div>

				<div className='h-fit gap-8 flex-items-center'>
					<span className='gap-4 text-base text-gray-1000 flex-items-center'>
						<span className='flex items-center ltr'>
							({(closingPriceVarReferencePrice ?? 0).toFixed(2)} %)
						</span>
						{sepNumbers(String(closingPrice ?? 0))}
					</span>

					<span className='flex items-center gap-4 text-2xl font-bold text-gray-1000'>
						{sepNumbers(String(lastTradedPrice ?? 0))}
						<span className='text-tiny font-normal text-gray-900'>{t('common.rial')}</span>
					</span>
				</div>
			</div>

			<Grid symbolISIN={symbolISIN} />
		</div>
	);
};

export default SymbolInfo;
