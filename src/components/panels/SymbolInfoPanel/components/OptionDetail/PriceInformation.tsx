import { numFormatter as bigNumFormatter, dateFormatter, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface IOptionItem {
	id: string;
	title: string;
	value: React.ReactNode;
}

interface PriceInformationProps {
	isExpand: boolean;
	symbolData: Symbol.Info;
}

const PriceInformation = ({ isExpand, symbolData }: PriceInformationProps) => {
	const t = useTranslations();

	const numFormatter = (v: string | number | null) => {
		if (v === null) return '−';
		return sepNumbers(String(v ?? 0));
	};

	const items = useMemo<IOptionItem[]>(() => {
		const {
			tradeVolume,
			oneMonthAvgVolume,
			closingPrice,
			closingPriceVarReferencePrice,
			closingPriceVarReferencePricePercent,
			tradeValue,
			tradeCount,
			contractEndDate,
			openPosition,
			notionalValue,
			contractSize,
			strikePrice = 0,
			lastTradeDate,
		} = symbolData;

		return [
			{
				id: 'strikePrice',
				title: t('symbol_info_panel.strike_price'),
				value: bigNumFormatter(strikePrice ?? 0),
			},

			{
				id: 'tradeVolume',
				title: t('symbol_info_panel.trade_volume'),
				value: bigNumFormatter(tradeVolume),
			},

			{
				id: 'tradeValue',
				title: t('symbol_info_panel.trade_value'),
				value: bigNumFormatter(tradeValue),
			},

			{
				id: 'notionalValue',
				title: t('symbol_info_panel.notional_value'),
				value: numFormatter(notionalValue),
			},

			{
				id: 'contractEndDate',
				title: t('symbol_info_panel.contract_end_date'),
				value: dateFormatter(contractEndDate, 'date'),
			},

			{
				id: 'openPosition',
				title: t('symbol_info_panel.open_positions'),
				value: sepNumbers(String(openPosition ?? 0)),
			},

			{
				id: 'closingPrice',
				title: t('symbol_info_panel.closing_price'),
				value: (
					<span
						className={clsx(
							'gap-4 flex-items-center',
							closingPriceVarReferencePricePercent >= 0 ? 'text-success-100' : 'text-error-100',
						)}
					>
						{sepNumbers(String(closingPrice ?? 0))}
						<span className='text-tiny ltr'>
							{closingPriceVarReferencePrice} ({(closingPriceVarReferencePricePercent ?? 0).toFixed(2)} %)
						</span>
					</span>
				),
			},

			{
				id: 'avg30',
				title: t('symbol_info_panel.avg_volume_month'),
				value: oneMonthAvgVolume ?? '−',
			},

			{
				id: 'tradeCount',
				title: t('symbol_info_panel.trade_count'),
				value: sepNumbers(String(tradeCount)),
			},

			{
				id: 'contractSize',
				title: t('symbol_info_panel.contract_size'),
				value: sepNumbers(String(contractSize ?? 0)),
			},

			{
				id: 'lastTradeDate',
				title: t('symbol_info_panel.last_trade_date'),
				value: dateFormatter(lastTradeDate, 'datetime'),
			},
		];
	}, [symbolData]);

	const rows = useMemo(() => {
		if (!isExpand) return items;
		return items.slice(0, 6);
	}, [items, isExpand]);

	return (
		<ul className='flex-column' style={{ height: `${rows.length * 40}px`, transition: 'height 200ms ease-in' }}>
			{rows.map((row) => (
				<li
					key={row.id}
					style={{ flex: '0 0 40px' }}
					className='rounded-sm px-8 text-base flex-justify-between odd:bg-gray-100'
				>
					<span className='text-gray-700'>{row.title}:</span>
					<span className='text-gray-800 ltr'>{row.value}</span>
				</li>
			))}
		</ul>
	);
};

export default PriceInformation;
