import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import SymbolMarketDepth from '@/components/common/Tables/SymbolMarketDepth';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import NoData from '../../../../common/NoData';
import Loading from '../../common/Loading';

interface OptionDataProps {
	symbolISIN: string;
	baseSymbolISIN: string;
}

const OptionData = ({ symbolISIN, baseSymbolISIN }: OptionDataProps) => {
	const t = useTranslations();

	const { data: symbolData, isLoading } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', baseSymbolISIN],
	});

	if (isLoading) return <Loading />;

	if (!symbolData) return <NoData />;

	const {
		lastTradedPrice,
		tradePriceVarPreviousTradePercent,
		closingPrice,
		closingPriceVarReferencePricePercent,
		tradeValue,
		tradeVolume,
		lowThreshold,
		highThreshold,
	} = symbolData;

	return (
		<div className='flex-1 gap-16 pt-8 flex-column'>
			<div className='gap-8 px-8 text-tiny flex-column'>
				<div className='flex-justify-between'>
					<div className='gap-8 flex-items-center'>
						<span className='text-light-gray-700'>{t('symbol_info_panel.last_traded_price')}:</span>
						<div className='text-light-gray-800 font-medium ltr'>
							{sepNumbers(String(lastTradedPrice ?? 0)) + ' '}
							<span>({(tradePriceVarPreviousTradePercent ?? 0).toFixed(2)})%</span>
						</div>
					</div>

					<div className='gap-8 flex-items-center'>
						<span className='text-light-gray-700'>{t('symbol_info_panel.closing_price')}:</span>
						<div className='text-light-gray-800 font-medium ltr'>
							{sepNumbers(String(closingPrice ?? 0)) + ' '}
							<span>({(closingPriceVarReferencePricePercent ?? 0).toFixed(2)})%</span>
						</div>
					</div>
				</div>

				<div className='flex-justify-between'>
					<div className='gap-8 flex-items-center'>
						<span className='text-light-gray-700'>{t('symbol_info_panel.trade_value')}:</span>
						<span className='text-light-gray-800 font-medium'>{numFormatter(tradeValue ?? 0)}</span>
					</div>

					<div className='gap-8 flex-items-center'>
						<span className='text-light-gray-700'>{t('symbol_info_panel.trade_volume')}:</span>
						<span className='text-light-gray-800 font-medium'>{numFormatter(tradeVolume ?? 0)}</span>
					</div>
				</div>
			</div>

			<div className='relative'>
				<SymbolMarketDepth
					symbolISIN={baseSymbolISIN}
					lowThreshold={lowThreshold}
					highThreshold={highThreshold}
				/>
			</div>
		</div>
	);
};

export default OptionData;
