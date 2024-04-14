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
	symbolData: Symbol.Info;
}

const PriceInformation = ({ symbolData }: PriceInformationProps) => {
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
				title: t('symbol_info_panel.open_position'),
				value: numFormatter(openPosition),
			},

			{
				id: 'closingPrice',
				title: t('symbol_info_panel.closing_price'),
				value: (
					<span
						className={clsx(
							'gap-4 flex-items-center',
							closingPriceVarReferencePricePercent >= 0 ? 'text-success-200' : 'text-error-200',
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

	return (
		<div className='px-8 pb-8 pt-16 flex-column'>
			<ul className='flex-column'>
				{items.map((item) => (
					<li
						style={{ flex: '0 0 40px' }}
						className='rounded-sm px-8 text-base flex-justify-between even:bg-gray-200'
						key={item.id}
					>
						<span className='text-gray-900'>{item.title}:</span>
						<span className='text-gray-1000 ltr'>{item.value}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default PriceInformation;
