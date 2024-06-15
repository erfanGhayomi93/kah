import dayjs from '@/libs/dayjs';
import { numFormatter as bigNumFormatter, sepNumbers } from '@/utils/helpers';
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

	const dateFormatter = (v: string | number | null) => {
		if (!v) return '−';
		return dayjs(v).calendar('jalali').format('YYYY/MM/DD − HH:mm:ss');
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
			lastTradeDate,
		} = symbolData;

		return [
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
				value: dateFormatter(contractEndDate),
			},

			{
				id: 'openPosition',
				title: t('symbol_info_panel.open_positions'),
				value: numFormatter(openPosition),
			},

			{
				id: 'closingPrice',
				title: t('symbol_info_panel.closing_price'),
				value: (
					<span
						className={clsx(
							'gap-4 flex-items-center',
							closingPriceVarReferencePricePercent >= 0
								? 'text-light-success-100'
								: 'text-light-error-100',
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
				value: numFormatter(contractSize),
			},

			{
				id: 'lastTradeDate',
				title: t('symbol_info_panel.last_trade_date'),
				value: dateFormatter(lastTradeDate),
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
					className='rounded-sm px-8 text-base flex-justify-between odd:bg-light-gray-100'
				>
					<span className='text-light-gray-700'>{row.title}:</span>
					<span className='text-light-gray-800 ltr'>{row.value}</span>
				</li>
			))}
		</ul>
	);
};

export default PriceInformation;
