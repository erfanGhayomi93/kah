import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import Loading from '@/components/common/Loading';
import { GrowDownSVG, GrowUpSVG, MoreOptionsSVG } from '@/components/icons';
import dayjs from '@/libs/dayjs';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import styled from 'styled-components';
import NoData from './common/NoData';
import Section from './common/Section';

type TValue = string | React.ReactNode;

interface TItem {
	id: string;
	title: string;
	valueFormatter: (() => TValue) | TValue;
}

interface SymbolInfoProps {
	selectedSymbol: null | Option.SymbolSearch;
}

const SymbolState = styled.span`
	border-radius: 50%;
	width: 0.8rem;
	height: 0.8rem;
	outline: 4px solid rgba(25, 135, 84, 0.2);
	background-color: rgb(25, 135, 84);
	animation: outline 1s ease-in-out infinite;
`;

const ListItem = ({ title, valueFormatter }: TItem) => (
	<div className='w-1/2 px-8 flex-justify-between'>
		<span className='whitespace-nowrap text-base text-gray-200'>{title}</span>
		<span className='text-base font-medium text-gray-100 ltr'>
			{typeof valueFormatter === 'function' ? valueFormatter() : valueFormatter}
		</span>
	</div>
);

const SymbolInfo = ({ selectedSymbol }: SymbolInfoProps) => {
	const t = useTranslations();

	const { data: symbolData, isLoading } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', selectedSymbol?.symbolISIN ?? null],
	});

	const ordersData = useMemo<Array<[TItem, TItem]>>(() => {
		try {
			if (!symbolData) throw new Error();

			const {
				tradeVolume,
				oneMonthAvgVolume,
				closingPrice,
				closingPriceVarReferencePrice,
				closingPriceVarReferencePricePercent,
				tradeValue,
				tradeCount,
				lastTradeDate,
				avgIV,
				hv,
			} = symbolData;

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
							<span className='gap-4 flex-items-center'>
								<span
									className={clsx(
										'text-tiny ltr',
										closingPriceVarReferencePricePercent >= 0
											? 'text-success-200'
											: 'text-error-100',
									)}
								>
									{closingPriceVarReferencePrice} (
									{(closingPriceVarReferencePricePercent ?? 0).toFixed(2)} %)
								</span>
								{sepNumbers(String(closingPrice))}
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
						id: 'tradeCount',
						title: t('option_chain.trade_count'),
						valueFormatter: sepNumbers(String(tradeCount)),
					},
				],
				[
					{
						id: 'avg30',
						title: t('option_chain.avg_volume', { days: oneMonthAvgVolume }),
						valueFormatter: '−',
					},
					{
						id: 'lastTradeDate',
						title: t('option_chain.last_trade_date'),
						valueFormatter: dayjs(lastTradeDate).calendar('jalali').format('HH:mm:ss'),
					},
				],
				[
					{
						id: 'avgIV',
						title: t('option_chain.avg_iv'),
						valueFormatter: () => {
							const valueAsNumber = Number(avgIV);
							if (isNaN(valueAsNumber)) return '−';

							return sepNumbers(valueAsNumber.toFixed(2));
						},
					},
					{
						id: 'hv',
						title: t('option_chain.hv'),
						valueFormatter: sepNumbers(hv?.toFixed(2)),
					},
				],
			];
		} catch (error) {
			return [];
		}
	}, [symbolData]);

	if (!selectedSymbol)
		return (
			<Section style={{ width: '41%', minWidth: '56rem', maxWidth: '64rem' }} className='flex-justify-center'>
				<NoData text={t('option_chain.select_symbol_from_right_list')} />
			</Section>
		);

	if (isLoading)
		return (
			<Section style={{ width: '41%', minWidth: '56rem', maxWidth: '64rem' }} className='relative'>
				<Loading />
			</Section>
		);

	if (!symbolData || typeof symbolData !== 'object')
		return (
			<Section style={{ width: '41%', minWidth: '56rem', maxWidth: '64rem' }} className='relative'>
				<span className='absolute text-base font-medium text-gray-200 center'>
					{t('option_chain.no_data_found')}
				</span>
			</Section>
		);

	const { closingPriceVarReferencePrice } = symbolData;

	return (
		<Section
			style={{ width: '41%', minWidth: '56rem', maxWidth: '64rem' }}
			className='relative px-16 py-12 flex-column'
		>
			<div className='flex justify-between'>
				<div className='justify-start text-right flex-column'>
					<div style={{ gap: '1rem' }} className='flex-items-center'>
						<SymbolState />
						<h1 className='text-3xl font-medium text-gray-100'>{symbolData.symbolTitle}</h1>
					</div>

					<h4 className='whitespace-nowrap text-tiny text-gray-100'>{symbolData.companyName}</h4>
				</div>

				<div className='justify-end gap-16 text-left flex-items-center'>
					<div className='gap-8 flex-items-center'>
						<span
							className={clsx(
								'gap-4 flex-items-center',
								closingPriceVarReferencePrice >= 0 ? 'text-success-200' : 'text-error-100',
							)}
						>
							<span className='flex items-center text-tiny ltr'>
								{symbolData.closingPriceVarReferencePrice} (
								{(closingPriceVarReferencePrice ?? 0).toFixed(2)} %)
								{closingPriceVarReferencePrice >= 0 ? (
									<GrowUpSVG width='1rem' height='1rem' />
								) : (
									<GrowDownSVG width='1rem' height='1rem' />
								)}
							</span>
							{sepNumbers(String(symbolData.closingPrice))}
						</span>

						<span className='flex items-center gap-4 text-2xl font-bold text-gray-100'>
							{sepNumbers(String(symbolData.lastTradedPrice))}
							<span className='text-base font-normal'>{t('common.rial')}</span>
						</span>
					</div>

					<button type='button' className='size-24 text-gray-100'>
						<MoreOptionsSVG width='2.4rem' height='2.4rem' />
					</button>
				</div>
			</div>

			<div className='gap-16 pb-48 pt-32 flex-justify-between'>
				<button className='h-40 flex-1 rounded text-base flex-justify-center btn-success-outline' type='button'>
					{t('side.buy')}
				</button>
				<button className='h-40 flex-1 rounded text-base flex-justify-center btn-error-outline' type='button'>
					{t('side.sell')}
				</button>
			</div>

			<ul className='flex flex-column'>
				{ordersData.map(([firstItem, secondItem], i) => (
					<li key={firstItem.id} className={clsx('h-32 gap-16 flex-justify-between', i % 2 && 'bg-gray-600')}>
						<ListItem {...firstItem} />
						<ListItem {...secondItem} />
					</li>
				))}
			</ul>
		</Section>
	);
};

export default SymbolInfo;
