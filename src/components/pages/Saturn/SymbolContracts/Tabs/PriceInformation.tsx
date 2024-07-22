import SymbolSummary, { type ListItemProps } from '@/components/common/Symbol/SymbolSummary';
import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
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
				contractEndDate,
				openPosition,
				notionalValue,
				contractSize,
				lastTradeDate,
			} = symbol;

			return [
				[
					{
						id: 'tradeVolume',
						title: t('old_option_chain.trade_volume'),
						valueFormatter: numFormatter(tradeVolume),
					},
					{
						id: 'closingPrice',
						title: t('old_option_chain.closing_price'),
						valueFormatter: (
							<span
								className={clsx(
									'gap-4 flex-items-center',
									closingPriceVarReferencePricePercent >= 0
										? 'text-light-success-100'
										: 'text-light-error-100',
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
						title: t('old_option_chain.trade_value'),
						valueFormatter: numFormatter(tradeValue),
					},
					{
						id: 'avg30',
						title: t('old_option_chain.avg_volume_month'),
						valueFormatter: sepNumbers(String(oneMonthAvgVolume ?? 0)),
					},
				],

				[
					{
						id: 'notionalValue',
						title: t('old_option_chain.notional_value'),
						valueFormatter: numFormatter(notionalValue),
					},
					{
						id: 'tradeCount',
						title: t('old_option_chain.trade_count'),
						valueFormatter: sepNumbers(String(tradeCount)),
					},
				],

				[
					{
						id: 'contractEndDate',
						title: t('old_option_chain.contract_end_date'),
						valueFormatter: dateFormatter(contractEndDate, 'date'),
					},
					{
						id: 'contractSize',
						title: t('old_option_chain.contract_size'),
						valueFormatter: numFormatter(contractSize),
					},
				],

				[
					{
						id: 'openPosition',
						title: t('old_option_chain.open_position'),
						valueFormatter: numFormatter(openPosition),
					},
					{
						id: 'lastTradeDate',
						title: t('old_option_chain.last_trade_date'),
						valueFormatter: dateFormatter(lastTradeDate, 'datetime'),
					},
				],
			];
		} catch (error) {
			return [];
		}
	}, [symbol]);

	return <SymbolSummary data={symbolDetails} />;
};

export default PriceInformation;
