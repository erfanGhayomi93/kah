import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import Loading from '@/components/common/Loading';
import { GrowDownSVG, GrowUpSVG, MoreOptionsSVG } from '@/components/icons';
import dayjs from '@/libs/dayjs';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import NoData from './common/NoData';
import Section from './common/Section';

type TValue = string | React.ReactNode;

interface ISymbolStateStyledProps {
	$color: string;
}

interface TItem {
	id: string;
	title: string;
	valueFormatter: (() => TValue) | TValue;
}

interface SymbolInfoProps {
	selectedSymbol: null | string;
}

const pulse = ({ $color }: ISymbolStateStyledProps) => keyframes`
	0% {
		-webkit-transform: scale(0.95);
		transform: scale(0.95);
		-webkit-box-shadow: 0 0 0 0 rgba(${$color}, 0.9);
		box-shadow: 0 0 0 0 rgba(${$color}, 0.9);
	}

	50% {
		-webkit-transform: scale(1);
		transform: scale(1);
		-webkit-box-shadow: 0 0 0 8px rgba(${$color}, 0);
		box-shadow: 0 0 0 8px rgba(${$color}, 0);
	}

	100% {
		-webkit-transform: scale(0.95);
		transform: scale(0.95);
		-webkit-box-shadow: 0 0 0 0 rgba(${$color}, 0);
		box-shadow: 0 0 0 0 rgba(${$color}, 0);
	}
`;

const SymbolState = styled.span<ISymbolStateStyledProps>`
	border-radius: 50%;
	width: 0.8rem;
	height: 0.8rem;
	background-color: rgb(25, 135, 84);
	position: relative;

	&::after {
		content: '';
		position: absolute;
		top: 0%;
		left: 0%;
		width: 100%;
		height: 100%;
		animation: ${({ $color }) => pulse({ $color })} 2s infinite;
		border-radius: 50%;
	}
`;

const ListItem = ({ title, valueFormatter }: TItem) => (
	<div className='w-1/2 px-8 flex-justify-between'>
		<span className='text-gray-800 whitespace-nowrap text-base'>{title}</span>
		<span className='text-gray-1000 text-base font-medium ltr'>
			{typeof valueFormatter === 'function' ? valueFormatter() : valueFormatter}
		</span>
	</div>
);

const SymbolInfo = ({ selectedSymbol }: SymbolInfoProps) => {
	const t = useTranslations();

	const { data: symbolData, isLoading } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', selectedSymbol ?? null],
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
								{sepNumbers(String(closingPrice))}
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
						title: t('option_chain.avg_volume', { days: 30 }),
						valueFormatter: oneMonthAvgVolume ?? '−',
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

	const { closingPriceVarReferencePrice, symbolTradeState } = symbolData;

	return (
		<Section style={{ width: '41%', minWidth: '56rem', maxWidth: '64rem' }} className='relative py-12 flex-column'>
			<div className='flex justify-between'>
				<div className='justify-start px-24 text-right flex-column'>
					<div style={{ gap: '1rem' }} className='flex-items-center'>
						<SymbolState
							$color={
								symbolTradeState === 'Open'
									? '25, 135, 84'
									: symbolTradeState === 'Frozen' || symbolTradeState === 'Suspended'
										? '255, 82, 109'
										: '255, 193, 7'
							}
						/>
						<h1 className='text-gray-1000 text-3xl font-medium'>{symbolData.symbolTitle}</h1>
					</div>

					<h4 className='text-gray-1000 whitespace-nowrap pr-20 text-tiny'>{symbolData.companyName}</h4>
				</div>

				<div className='flex flex-1 items-center justify-end gap-8 pb-16 pl-16 text-left'>
					<div className='gap-8 flex-items-center'>
						<span
							className={clsx(
								'gap-4 flex-items-center',
								closingPriceVarReferencePrice >= 0 ? 'text-success-100' : 'text-error-100',
							)}
						>
							<span className='flex items-center text-tiny ltr'>
								({(closingPriceVarReferencePrice ?? 0).toFixed(2)} %)
								{closingPriceVarReferencePrice >= 0 ? (
									<GrowUpSVG width='1rem' height='1rem' />
								) : (
									<GrowDownSVG width='1rem' height='1rem' />
								)}
							</span>
							{sepNumbers(String(symbolData.closingPrice))}
						</span>

						<span className='text-gray-1000 flex items-center gap-4 text-2xl font-bold'>
							{sepNumbers(String(symbolData.lastTradedPrice))}
							<span className='text-base font-normal'>{t('common.rial')}</span>
						</span>
					</div>

					<button type='button' className='text-gray-1000 size-24'>
						<MoreOptionsSVG width='2.4rem' height='2.4rem' />
					</button>
				</div>
			</div>

			<div className='gap-16 px-24 pb-48 pt-32 flex-justify-between'>
				<button className='h-40 flex-1 rounded text-base flex-justify-center btn-success-outline' type='button'>
					{t('side.buy')}
				</button>
				<button className='h-40 flex-1 rounded text-base flex-justify-center btn-error-outline' type='button'>
					{t('side.sell')}
				</button>
			</div>

			<ul className='flex px-24 flex-column'>
				{ordersData.map(([firstItem, secondItem], i) => (
					<li key={firstItem.id} className={clsx('h-32 gap-16 flex-justify-between', i % 2 && 'bg-gray-200')}>
						<ListItem {...firstItem} />
						<ListItem {...secondItem} />
					</li>
				))}
			</ul>
		</Section>
	);
};

export default SymbolInfo;
