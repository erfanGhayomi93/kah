import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import SymbolPriceTable from '@/components/common/Tables/SymbolPriceTable';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import Loading from '../../common/Loading';
import NoData from '../../common/NoData';

interface OptionDataProps {
	symbolISIN: string;
}

const OptionData = ({ symbolISIN }: OptionDataProps) => {
	const t = useTranslations();

	const { data: symbolData, isLoading } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', symbolISIN],
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
	} = symbolData;

	return (
		<div className='flex-1 gap-16 pt-8 flex-column'>
			<div className='gap-8 px-8 text-tiny flex-column'>
				<div className='flex-justify-between'>
					<div className='gap-8 flex-items-center'>
						<span className='text-gray-900'>{t('symbol_info_panel.last_traded_price')}:</span>
						<div className='font-medium text-gray-1000 ltr'>
							{sepNumbers(String(lastTradedPrice ?? 0)) + ' '}
							<span>({(tradePriceVarPreviousTradePercent ?? 0).toFixed(2)})%</span>
						</div>
					</div>

					<div className='gap-8 flex-items-center'>
						<span className='text-gray-900'>{t('symbol_info_panel.closing_price')}:</span>
						<div className='font-medium text-gray-1000 ltr'>
							{sepNumbers(String(closingPrice ?? 0)) + ' '}
							<span>({(closingPriceVarReferencePricePercent ?? 0).toFixed(2)})%</span>
						</div>
					</div>
				</div>

				<div className='flex-justify-between'>
					<div className='gap-8 flex-items-center'>
						<span className='text-gray-900'>{t('symbol_info_panel.trade_value')}:</span>
						<span className='font-medium text-gray-1000'>{numFormatter(tradeValue ?? 0)}</span>
					</div>

					<div className='gap-8 flex-items-center'>
						<span className='text-gray-900'>{t('symbol_info_panel.trade_volume')}:</span>
						<span className='font-medium text-gray-1000'>{numFormatter(tradeVolume ?? 0)}</span>
					</div>
				</div>
			</div>

			<div className='relative'>
				<SymbolPriceTable symbolISIN={symbolISIN} />
			</div>
		</div>
	);
};

export default OptionData;
