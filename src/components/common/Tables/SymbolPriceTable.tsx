import { useSymbolBestLimitQuery } from '@/api/queries/symbolQuery';
import { useSubscription } from '@/hooks';
import { cn, sepNumbers } from '@/utils/helpers';
import { subscribeSymbolInfo } from '@/utils/subscriptions';
import { useQueryClient } from '@tanstack/react-query';
import { type ItemUpdate } from 'lightstreamer-client-web';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo } from 'react';

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
	length?: number;
}

const SymbolPriceTable = ({ symbolISIN, length }: SymbolPriceTableProps) => {
	const queryClient = useQueryClient();

	const { subscribe, unsubscribe } = useSubscription();

	const { data } = useSymbolBestLimitQuery({
		queryKey: ['symbolBestLimitQuery', symbolISIN],
		enabled: Boolean(symbolISIN),
	});

	const onItemUpdate = (updateInfo: ItemUpdate) => {
		try {
			const queryKey = ['symbolBestLimitQuery', symbolISIN];
			const visualData = JSON.parse(JSON.stringify(queryClient.getQueryData(queryKey))) as Symbol.BestLimit[];

			if (!visualData) return;

			updateInfo.forEachChangedField((fieldName, _b, value) => {
				try {
					if (value) {
						const valueAsNumber = Number(value);
						const lastWord = fieldName.slice(-10).split('_');
						const fieldIndex = Number(lastWord[1]);
						const fieldType = lastWord[0];

						if (isNaN(fieldIndex) || isNaN(valueAsNumber)) return;

						const side = fieldName.includes('Buy') ? 'buy' : 'sell';
						const type: 'count' | 'price' | 'quantity' =
							fieldType === 'mitPrice' ? 'price' : fieldType === 'Quantity' ? 'quantity' : 'count';

						const field: Record<string, keyof Omit<Symbol.BestLimit, 'symbolISIN' | 'rowIndex'>> = {
							sell_price: 'bestSellLimitPrice',
							sell_count: 'numberOfOrdersAtBestSell',
							sell_quantity: 'bestSellLimitQuantity',
							buy_price: 'bestBuyLimitPrice',
							buy_count: 'numberOfOrdersAtBestBuy',
							buy_quantity: 'bestBuyLimitQuantity',
						};

						visualData[fieldIndex][field[`${side}_${type}`]] = valueAsNumber;
					}
				} catch (e) {
					//
				}
			});

			queryClient.setQueryData(queryKey, visualData);
		} catch (e) {
			//
		}
	};

	const dataModify: Record<'buy' | 'sell', IRowData[]> = useMemo(() => {
		const marketData: Record<'buy' | 'sell', IRowData[]> = { buy: [], sell: [] };

		let sumBuyQuantity = 0;
		let sumSellQuantity = 0;

		try {
			if (!Array.isArray(data)) throw new Error();

			const l = length ? Math.min(length, data.length) : data.length;

			for (let i = 0; i < l; i++) {
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

			for (let i = 0; i < l; i++) {
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

	useLayoutEffect(() => {
		if (!symbolISIN) {
			unsubscribe();
			return;
		}

		const sub = subscribeSymbolInfo(symbolISIN, 'ordersData');
		sub.addEventListener('onItemUpdate', onItemUpdate);
		sub.start();

		subscribe(sub);
	}, [symbolISIN]);

	return (
		<div className='flex flex-1 gap-8'>
			<Grid side='buy' data={dataModify.buy} />
			<Grid side='sell' data={dataModify.sell} />
		</div>
	);
};

const Row = ({ side, price, count, quantity, percent }: RowProps) => (
	<div
		className={cn(
			'relative h-32 flex-justify-between *:text-base *:text-gray-900',
			side === 'sell' && 'flex-row-reverse',
		)}
	>
		<div
			style={{ width: `${Math.min(percent, 100)}%`, height: '2.8rem', borderRadius: '2px' }}
			className={cn(
				'pointer-events-none absolute top-1/2 -translate-y-1/2 transform',
				side === 'buy' ? 'left-0 bg-success-200/10' : 'right-0 bg-error-200/10',
			)}
		/>

		<div style={{ flex: '0 0 25%', maxWidth: '7.2rem' }} className='text-center'>
			{sepNumbers(String(count))}
		</div>
		<div style={{ flex: '0 0 50%' }} className='px-8 text-center'>
			{sepNumbers(String(quantity))}
		</div>
		<div style={{ flex: '0 0 25%' }} className={cn(side === 'sell' ? 'pr-8 text-right' : 'pl-8 text-left')}>
			{sepNumbers(String(price))}
		</div>
	</div>
);

const Grid = ({ side, data }: GridProps) => {
	const t = useTranslations();

	return (
		<div style={{ flex: '0 0 calc(50% - 0.4rem)' }} className='gap-8 overflow-hidden flex-column'>
			<div
				className={cn(
					'flex-justify-between *:text-base *:text-gray-900',
					side === 'sell' && 'flex-row-reverse',
				)}
			>
				<div style={{ flex: '0 0 25%', maxWidth: '7.2rem' }} className='text-center'>
					{t('market_depth.count_column')}
				</div>
				<div style={{ flex: '0 0 50%' }} className='text-center'>
					{t('market_depth.quantity_column')}
				</div>
				<div style={{ flex: '0 0 25%' }} className={cn(side === 'sell' ? 'pr-8 text-right' : 'pl-8 text-left')}>
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

export default SymbolPriceTable;
