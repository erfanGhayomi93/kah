import { useOptionOrdersQuery } from '@/api/queries/brokerPrivateQueries';
import Button from '@/components/common/Button';
import SymbolContextMenu from '@/components/common/Symbol/SymbolContextMenu';
import SymbolPriceSlider from '@/components/common/SymbolPriceSlider';
import Tooltip from '@/components/common/Tooltip';
import { GalaxySVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useTradingFeatures } from '@/hooks';
import { Link } from '@/navigation';
import { getColorBasedOnPercent, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
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

	const brokerURLs = useAppSelector(getBrokerURLs);

	const { addBuySellModal } = useTradingFeatures();

	const {
		data: optionOrdersData,
		refetch: refetchOptionOrdersData,
		isLoading,
	} = useOptionOrdersQuery({
		queryKey: ['optionOrdersQuery'],
		enabled: false,
	});

	const openBsModal = (side: TBsSides) => {
		addBuySellModal({
			mode: 'create',
			type: 'order',
			symbolISIN,
			symbolTitle,
			side,
		});
	};

	const isSellDisabled = useMemo(() => {
		if (!brokerURLs || !isOption || !Array.isArray(optionOrdersData)) return false;
		return optionOrdersData.findIndex((item) => item.symbolISIN === symbolISIN) === -1;
	}, [optionOrdersData, brokerURLs, isOption]);

	useEffect(() => {
		if (!brokerURLs || !isOption) return;
		refetchOptionOrdersData();
	}, [brokerURLs, isOption]);

	const saturnUrl =
		baseSymbolISIN === null
			? `/saturn?symbolISIN=${symbolISIN}`
			: `/saturn?contractISIN=${symbolISIN}&symbolISIN=${baseSymbolISIN}`;

	return (
		<div className='gap-8 overflow-hidden rounded bg-white px-8 py-16 flex-column darkBlue:bg-gray-50 dark:bg-gray-50'>
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
					<span className='whitespace-nowrap text-tiny text-gray-700'>
						{t('symbol_info_panel.last_traded_price')}:
					</span>

					<div
						className={clsx(
							'text-base font-medium ltr',
							getColorBasedOnPercent(tradePriceVarPreviousTradePercent ?? 0),
						)}
					>
						<span> {sepNumbers(String(lastTradedPrice ?? 0))} </span>
						<span>({sepNumbers(String(tradePriceVarPreviousTradePercent ?? 0))}%)</span>
					</div>
				</div>

				<div className='w-1/2 gap-8 flex-justify-end'>
					<span className='whitespace-nowrap text-tiny text-gray-700'>
						{t('symbol_info_panel.closing_price')}:
					</span>

					<div
						className={clsx(
							'text-tiny font-medium ltr',
							getColorBasedOnPercent(closingPriceVarReferencePricePercent ?? 0),
						)}
					>
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

				<Tooltip disabled={!isSellDisabled} content={t('tooltip.can_not_close_position')} placement='bottom'>
					<div className='flex-1'>
						<Button
							type='button'
							loading={isOption && isLoading}
							disabled={isSellDisabled}
							onClick={() => openBsModal('sell')}
							className='h-40 w-full rounded text-base font-medium btn-error'
						>
							{t(isOption ? 'symbol_info_panel.close_position' : 'side.sell')}
						</Button>
					</div>
				</Tooltip>
			</div>

			{!isOption && (
				<div className='pt-8'>
					<SymbolPriceSlider
						yesterdayClosingPrice={yesterdayClosingPrice ?? 0}
						thresholdData={[lowThreshold ?? 0, highThreshold ?? 0]}
						exchangeData={[closingPrice ?? 0, lastTradedPrice ?? 0]}
						boundaryData={[lowPrice ?? 0, highPrice ?? 0]}
					/>
				</div>
			)}
		</div>
	);
};

export default SymbolInformation;
