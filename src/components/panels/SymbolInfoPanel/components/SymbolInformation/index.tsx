import SymbolContextMenu from '@/components/common/Symbol/SymbolContextMenu';
import SymbolPriceSlider from '@/components/common/SymbolPriceSlider';
import { GalaxySVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useTradingFeatures } from '@/hooks';
import { Link } from '@/navigation';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import SymbolSearchToggler from './SymbolSearchToggler';

interface SymbolInformationProps {
	symbolData: Symbol.Info;
}

const SymbolInformation = ({ symbolData }: SymbolInformationProps) => {
	const {
		baseSymbolISIN,
		symbolTitle,
		symbolISIN,
		isOption,
		lastTradedPrice,
		tradePriceVarPreviousTradePercent,
		closingPrice,
		yesterdayClosingPrice,
		closingPriceVarReferencePricePercent,
		lowThreshold,
		highThreshold,
		highPrice,
		lowPrice,
	} = symbolData;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { addBuySellModal } = useTradingFeatures();

	const openBsModal = (side: TBsSides) => {
		addBuySellModal({
			mode: 'create',
			type: 'order',
			symbolISIN,
			symbolTitle,
			symbolType: isOption ? 'option' : 'base',
			side,
		});
	};

	const saturnUrl =
		baseSymbolISIN === null
			? `/saturn?symbolISIN=${symbolISIN}`
			: `/saturn?contractISIN=${symbolISIN}&symbolISIN=${baseSymbolISIN}`;

	return (
		<div className='gap-8 overflow-hidden rounded bg-white px-8 py-16 flex-column'>
			<div className='flex items-start justify-between'>
				<SymbolSearchToggler symbolData={symbolData} />

				<div className='gap-8 overflow-hidden flex-items-center'>
					<Link
						target='_blank'
						href={saturnUrl}
						onClick={() => dispatch(setSymbolInfoPanel(null))}
						className='size-20 icon-hover'
					>
						<GalaxySVG width='2rem' height='2rem' />
					</Link>

					<SymbolContextMenu symbol={symbolData} svgSize={20} />
				</div>
			</div>

			<div className='h-40 gap-8 flex-justify-between'>
				<div className='w-1/2 gap-8 flex-justify-start'>
					<span className='whitespace-nowrap text-tiny text-light-gray-700'>
						{t('symbol_info_panel.last_traded_price')}:
					</span>

					<div className='text-base font-medium text-light-gray-800 ltr'>
						<span> {sepNumbers(String(lastTradedPrice ?? 0))} </span>
						<span>({sepNumbers(String(tradePriceVarPreviousTradePercent ?? 0))}%)</span>
					</div>
				</div>

				<div className='w-1/2 gap-8 flex-justify-end'>
					<span className='whitespace-nowrap text-tiny text-light-gray-700'>
						{t('symbol_info_panel.closing_price')}:
					</span>

					<div className='text-tiny font-medium text-light-gray-800 ltr'>
						<span>{sepNumbers(String(closingPrice ?? 0))} </span>
						<span>({sepNumbers(String(closingPriceVarReferencePricePercent ?? 0))}%)</span>
					</div>
				</div>
			</div>

			<div className='flex gap-8'>
				<button
					onClick={() => openBsModal('buy')}
					type='button'
					className='h-40 flex-1 rounded text-base font-medium btn-success'
				>
					{t(isOption ? 'symbol_info_panel.new_position' : 'side.buy')}
				</button>
				<button
					onClick={() => openBsModal('sell')}
					type='button'
					className='h-40 flex-1 rounded text-base font-medium btn-error'
				>
					{t(isOption ? 'symbol_info_panel.close_position' : 'side.sell')}
				</button>
			</div>

			{!isOption && (
				<div className='pt-8'>
					<SymbolPriceSlider
						yesterdayClosingPrice={yesterdayClosingPrice ?? 0}
						thresholdData={[lowThreshold ?? 0, highThreshold ?? 0]}
						exchangeData={[20000, 21000]}
						boundaryData={[lowPrice ?? 0, highPrice ?? 0]}
					/>
				</div>
			)}
		</div>
	);
};

export default SymbolInformation;
