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
		closingPrice,
	} = symbolData;

	return (
		<div className='h-full gap-16 bg-white px-16 pb-16 pt-8 flex-column'>
			<div className='flex items-start justify-between'>
				<div className='flex-1 gap-4 flex-column'>
					<div className='gap-8 flex-items-center'>
						<SymbolState state={symbolTradeState} />
						<h1 className='text-lg font-medium text-light-gray-800'>{symbolTitle}</h1>
					</div>
					<h2 className='pr-16 text-tiny text-light-gray-700'>{companyName}</h2>
				</div>

				<div className='h-fit gap-8 flex-items-center'>
					<span className='gap-4 text-base text-light-gray-800 flex-items-center'>
						<span className='flex items-center ltr'>
							({(closingPriceVarReferencePricePercent ?? 0).toFixed(2)} %)
						</span>
						{sepNumbers(String(closingPriceVarReferencePrice ?? 0))}
					</span>

					<span className='flex items-center gap-4 text-2xl font-bold text-light-gray-800'>
						{sepNumbers(String(lastTradedPrice ?? 0))}
						<span className='text-tiny font-normal text-light-gray-700'>{t('common.rial')}</span>
					</span>
				</div>
			</div>

			<div className='h-40 rounded bg-white px-8 shadow-card flex-justify-between'>
				<span className='text-light-gray-700'>{t('bs_modal.closing_price')}:</span>
				<span className='text-tiny text-light-gray-700'>
					{sepNumbers(String(closingPrice))}
					<span className='text-light-gray-500'> {t('common.rial')}</span>
				</span>
			</div>

			<Grid symbolISIN={symbolISIN} lowThreshold={lowThreshold} highThreshold={highThreshold} />
		</div>
	);
};

export default SymbolInfo;
