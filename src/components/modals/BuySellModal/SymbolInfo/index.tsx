import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import SymbolPriceSlider from '@/components/common/SymbolPriceSlider';
import SymbolState from '@/components/common/SymbolState';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import Grid from './Grid';

interface SymbolInfoProps {
	symbolData: Symbol.Info | null;
	isLoading: boolean;
	setInputValue: TSetBsModalInputs;
}

const SymbolInfo = ({ symbolData, isLoading, setInputValue }: SymbolInfoProps) => {
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
		yesterdayClosingPrice,
		highPrice,
		lowPrice,
	} = symbolData;

	return (
		<div className='darkBlue:bg-gray-50 h-full gap-16 bg-white px-16 pb-16 pt-8 flex-column dark:bg-gray-50'>
			<div className='flex items-start justify-between'>
				<div className='flex-1 gap-4 flex-column'>
					<div className='gap-8 flex-items-center'>
						<SymbolState state={symbolTradeState} />
						<h1 className='whitespace-nowrap text-lg font-medium text-gray-800'>{symbolTitle}</h1>
					</div>
					<h2 className='whitespace-nowrap pr-16 text-tiny text-gray-700'>{companyName}</h2>
				</div>

				<div className='h-fit gap-8 flex-items-center'>
					<span className='gap-4 text-base text-gray-800 ltr flex-items-center'>
						{sepNumbers(String(closingPriceVarReferencePrice ?? 0))}
						<span className='flex items-center ltr'>
							({(closingPriceVarReferencePricePercent ?? 0).toFixed(2)} %)
						</span>
					</span>

					<span
						onClick={() => setInputValue('price', lastTradedPrice)}
						className='flex cursor-pointer items-center gap-4 text-2xl font-bold text-gray-800'
					>
						{sepNumbers(String(lastTradedPrice ?? 0))}
						<span className='whitespace-nowrap text-tiny font-normal text-gray-700'>
							{t('common.rial')}
						</span>
					</span>
				</div>
			</div>

			<div className='darkBlue:bg-gray-50 h-40 rounded bg-white px-8 shadow-card flex-justify-between dark:bg-gray-50'>
				<span className='text-gray-700'>{t('bs_modal.closing_price')}:</span>
				<span
					onClick={() => setInputValue('price', closingPrice)}
					className='cursor-pointer text-tiny text-gray-700'
				>
					{sepNumbers(String(closingPrice))}
					<span className='text-gray-500'> {t('common.rial')}</span>
				</span>
			</div>

			<div className='darkBlue:bg-gray-50 rounded bg-white px-8 py-16 shadow-card dark:bg-gray-50'>
				<SymbolPriceSlider
					yesterdayClosingPrice={yesterdayClosingPrice ?? 0}
					thresholdData={[lowThreshold ?? 0, highThreshold ?? 0]}
					exchangeData={[closingPrice ?? 0, lastTradedPrice ?? 0]}
					boundaryData={[lowPrice ?? 0, highPrice ?? 0]}
					onClick={(price) => setInputValue('price', price)}
				/>
			</div>

			<Grid
				yesterdayClosingPrice={yesterdayClosingPrice}
				symbolISIN={symbolISIN}
				lowThreshold={lowThreshold}
				highThreshold={highThreshold}
				setInputValue={setInputValue}
			/>
		</div>
	);
};

export default SymbolInfo;
