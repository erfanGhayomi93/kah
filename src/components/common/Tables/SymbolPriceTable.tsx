import { useSymbolBestLimitQuery } from '@/api/queries/symbolQuery';
import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface IRowData {
	price: number;
	count: number;
	quantity: number;
	percent: number;
}

interface RowProps extends IRowData {
	side: 'buy' | 'sell';
}

interface GridProps {
	side: 'buy' | 'sell';
	data: IRowData[];
}

interface SymbolPriceTableProps {
	symbolISIN: string;
}

const Row = ({ side, price, count, quantity, percent }: RowProps) => (
	<div
		className={clsx(
			'*:text-gray-900 relative h-32 flex-justify-between *:text-base',
			side === 'sell' && 'flex-row-reverse',
		)}
	>
		<div
			style={{ width: `${Math.min(percent, 100)}%`, height: '2.8rem', borderRadius: '2px' }}
			className={clsx(
				'pointer-events-none absolute top-1/2 -translate-y-1/2 transform',
				side === 'buy' ? 'left-0 bg-success-200/10' : 'bg-error-200/10 right-0',
			)}
		/>

		<div
			style={{ flex: '0 0 25%' }}
			className={clsx(side === 'sell' ? 'pl-16 pr-8 text-left' : 'pl-8 pr-16 text-right')}
		>
			{sepNumbers(String(count))}
		</div>
		<div style={{ flex: '0 0 50%' }} className='px-8 text-center'>
			{sepNumbers(String(quantity))}
		</div>
		<div
			style={{ flex: '0 0 25%' }}
			className={clsx(side === 'sell' ? 'pl-8 pr-16 text-right' : 'pl-16 pr-8 text-left')}
		>
			{sepNumbers(String(price))}
		</div>
	</div>
);

const Grid = ({ side, data }: GridProps) => {
	const t = useTranslations();

	return (
		<div style={{ flex: '0 0 calc(50% - 0.4rem)' }} className='gap-8 overflow-hidden flex-column'>
			<div
				className={clsx(
					'*:text-gray-900 flex-justify-between *:text-base',
					side === 'sell' && 'flex-row-reverse',
				)}
			>
				<div
					style={{ flex: '0 0 25%' }}
					className={clsx(side === 'sell' ? 'pl-16 pr-8 text-left' : 'pl-8 pr-16 text-right')}
				>
					{t('market_depth.count_column')}
				</div>
				<div style={{ flex: '0 0 50%' }} className='px-8 text-center'>
					{t('market_depth.quantity_column')}
				</div>
				<div
					style={{ flex: '0 0 25%' }}
					className={clsx(side === 'sell' ? 'pl-8 pr-16 text-right' : 'pl-16 pr-8 text-left')}
				>
					{t('market_depth.price_column')}
				</div>
			</div>

			<div className='w-full gap-4 flex-column'>
				{data.map(({ percent, price, quantity, count }, i) => (
					<Row key={i} side={side} price={price} quantity={quantity} count={count} percent={percent} />
				))}
			</div>
		</div>
	);
};

const SymbolPriceTable = ({ symbolISIN }: SymbolPriceTableProps) => {
	const { data } = useSymbolBestLimitQuery({
		queryKey: ['symbolBestLimitQuery', symbolISIN],
		enabled: Boolean(symbolISIN),
	});

	const dataModify: Record<'buy' | 'sell', IRowData[]> = useMemo(() => {
		const marketData: Record<'buy' | 'sell', IRowData[]> = { buy: [], sell: [] };

		let sumBuyQuantity = 0;
		let sumSellQuantity = 0;

		try {
			if (!Array.isArray(data)) throw new Error();

			for (let i = 0; i < data.length; i++) {
				const item = data[i];

				// Buy
				marketData.buy.push({
					count: item.numberOfOrdersAtBestBuy,
					price: item.bestBuyLimitPrice,
					quantity: item.bestBuyLimitQuantity,
					percent: 0,
				});

				sumBuyQuantity += item.bestBuyLimitQuantity;

				// Sell
				marketData.sell.push({
					count: item.numberOfOrdersAtBestSell,
					price: item.bestSellLimitPrice,
					quantity: item.bestSellLimitQuantity,
					percent: 0,
				});

				sumSellQuantity += item.bestSellLimitQuantity;
			}

			for (let i = 0; i < data.length; i++) {
				const bItem = marketData.buy[i];
				const sItem = marketData.sell[i];

				if (bItem) {
					const percent = (bItem.quantity * 100) / sumBuyQuantity;
					if (!isNaN(percent)) marketData.buy[i].percent = percent;
				}

				if (sItem) {
					const percent = (sItem.quantity * 100) / sumSellQuantity;
					if (!isNaN(percent)) marketData.sell[i].percent = percent;
				}
			}

			return marketData;
		} catch (e) {
			return marketData;
		}
	}, [data]);

	return (
		<div className='flex flex-1 gap-8'>
			<Grid side='buy' data={dataModify.buy} />
			<Grid side='sell' data={dataModify.sell} />
		</div>
	);
};

export default SymbolPriceTable;
