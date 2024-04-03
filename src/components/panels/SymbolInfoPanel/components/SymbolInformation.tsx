import SymbolContextMenu from '@/components/common/Symbol/SymbolContextMenu';
import SymbolState from '@/components/common/SymbolState';
import { GalaxySVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useTradingFeatures } from '@/hooks';
import { Link } from '@/navigation';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface SymbolInformationProps {
	symbolData: Symbol.Info;
}

const SymbolInformation = ({ symbolData }: SymbolInformationProps) => {
	const {
		symbolTradeState,
		symbolTitle,
		symbolISIN,
		companyName,
		isOption,
		lastTradedPrice,
		tradePriceVarPreviousTradePercent,
		closingPrice,
		closingPriceVarReferencePricePercent,
	} = symbolData;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { addBuySellModal } = useTradingFeatures();

	const openBsModal = (side: TBsSides) => {
		dispatch(setSymbolInfoPanel(null));

		addBuySellModal({
			mode: 'create',
			type: 'order',
			symbolISIN,
			symbolTitle,
			symbolType: isOption ? 'option' : 'base',
			side,
		});
	};

	return (
		<div className='gap-8 rounded bg-white px-8 py-16 flex-column'>
			<div className='flex items-start justify-between'>
				<div className='flex-1 gap-4 flex-column'>
					<div className='gap-8 flex-items-center'>
						<SymbolState state={symbolTradeState} />
						<h1 className='text-lg font-medium text-gray-1000'>{symbolTitle}</h1>
					</div>
					<h2 className='pr-16 text-tiny text-gray-900'>{companyName}</h2>
				</div>

				<div className='gap-8 flex-items-center'>
					<Link href='/' className='size-20 icon-hover'>
						<GalaxySVG width='2rem' height='2rem' />
					</Link>

					<SymbolContextMenu symbol={symbolData} svgSize={20} />
				</div>
			</div>

			<div className='h-40 gap-8 flex-justify-between'>
				<div className='w-1/2 gap-8 flex-justify-start'>
					<span className='whitespace-nowrap text-tiny text-gray-900'>
						{t('symbol_info_panel.last_traded_price')}:
					</span>

					<div className='text-base font-medium text-gray-1000 ltr'>
						<span> {sepNumbers(String(lastTradedPrice ?? 0))} </span>
						<span>({sepNumbers(String(tradePriceVarPreviousTradePercent ?? 0))}%)</span>
					</div>
				</div>

				<div className='w-1/2 gap-8 flex-justify-end'>
					<span className='whitespace-nowrap text-tiny text-gray-900'>
						{t('symbol_info_panel.closing_price')}:
					</span>

					<div className='text-tiny font-medium text-gray-1000 ltr'>
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

			<div className='pt-24' />
		</div>
	);
};

export default SymbolInformation;
