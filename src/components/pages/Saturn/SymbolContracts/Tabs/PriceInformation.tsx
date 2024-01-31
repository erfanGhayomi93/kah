import SymbolSummary, { type ListItemProps } from '@/components/common/Symbol/SymbolSummary';
import dayjs from '@/libs/dayjs';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface PriceInformationProps {
	symbol: Symbol.Info | null;
}

const PriceInformation = ({ symbol }: PriceInformationProps) => {
	const t = useTranslations();

	const symbolDetails = useMemo<Array<[ListItemProps, ListItemProps]>>(() => {
		try {
			if (!symbol) return [];

			const {
				tradeVolume,
				oneMonthAvgVolume,
				closingPrice,
				closingPriceVarReferencePrice,
				closingPriceVarReferencePricePercent,
				tradeValue,
				tradeCount,
				lastTradeDate,
			} = symbol;

			return [
				[
					{
						id: 'tradeVolume',
						title: t('option_chain.trade_volume'),
						valueFormatter: numFormatter(tradeVolume),
					},
					{
						id: 'closingPrice',
						title: t('option_chain.closing_price'),
						valueFormatter: (
							<span
								className={clsx(
									'gap-4 flex-items-center',
									closingPriceVarReferencePricePercent >= 0 ? 'text-success-200' : 'text-error-200',
								)}
							>
								{sepNumbers(String(closingPrice))}
								<span className='text-tiny ltr'>
									{closingPriceVarReferencePrice} (
									{(closingPriceVarReferencePricePercent ?? 0).toFixed(2)} %)
								</span>
							</span>
						),
					},
				],

				[
					{
						id: 'tradeValue',
						title: t('option_chain.trade_value'),
						valueFormatter: numFormatter(tradeValue),
					},
					{
						id: 'avg30',
						title: t('option_chain.avg_volume_month'),
						valueFormatter: oneMonthAvgVolume ?? '−',
					},
				],

				[
					{
						id: 'notionalValue',
						title: t('option_chain.notional_value'),
						valueFormatter: '−',
					},
					{
						id: 'tradeCount',
						title: t('option_chain.trade_count'),
						valueFormatter: sepNumbers(String(tradeCount)),
					},
				],

				[
					{
						id: 'contractEndDate',
						title: t('option_chain.contract_end_date'),
						valueFormatter: () => '−',
					},
					{
						id: 'contractSize',
						title: t('option_chain.contract_size'),
						valueFormatter: '−',
					},
				],

				[
					{
						id: 'openPosition',
						title: t('option_chain.open_position'),
						valueFormatter: '−',
					},
					{
						id: 'lastTradeDate',
						title: t('option_chain.last_trade_date'),
						valueFormatter: dayjs(lastTradeDate).calendar('jalali').format('YYYY/MM/DD − HH:mm:ss'),
					},
				],
			];
		} catch (error) {
			console.log(error);
			return [];
		}
	}, [symbol]);

	return <SymbolSummary data={symbolDetails} />;
};

export default PriceInformation;
