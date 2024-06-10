import { useSymbolBestLimitQuery } from '@/api/queries/symbolQuery';
import { useSubscription } from '@/hooks';
import { cn, copyNumberToClipboard, isBetween, sepNumbers } from '@/utils/helpers';
import { subscribeSymbolInfo } from '@/utils/subscriptions';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { type ItemUpdate } from 'lightstreamer-client-web';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';

interface IRowData {
	price: number;
	count: number;
	quantity: number;
	percent: number;
}

interface RowProps extends IRowData {
	side: 'buy' | 'sell';
	disabled: boolean;
	rowHeight: number;
}

interface GridProps {
	side: 'buy' | 'sell';
	data: IRowData[];
	lowThreshold: number;
	highThreshold: number;
	rowHeight: number;
}

interface SymbolMarketDepthProps {
	symbolISIN: string;
	lowThreshold: number;
	highThreshold: number;
	length?: number;
	rowHeight?: number;
}

const SymbolMarketDepth = ({
	symbolISIN,
	rowHeight = 32,
	lowThreshold,
	highThreshold,
	length,
}: SymbolMarketDepthProps) => {
	const queryClient = useQueryClient();

	const { subscribe, unsubscribe } = useSubscription();

	const { data } = useSymbolBestLimitQuery({
		queryKey: ['symbolBestLimitQuery', symbolISIN],
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
						const rowIndex = Number(lastWord[1]) - 1;
						const fieldType = lastWord[0];

						if (isNaN(rowIndex) || rowIndex === -1 || isNaN(valueAsNumber)) return;

						const side = fieldName.includes('Buy') ? 'buy' : 'sell';
						const type =
							fieldType === 'mitPrice' ? 'price' : fieldType === 'Quantity' ? 'quantity' : 'count';

						const field: Record<string, keyof Omit<Symbol.BestLimit, 'symbolISIN' | 'rowIndex'>> = {
							sell_price: 'bestSellLimitPrice',
							sell_count: 'numberOfOrdersAtBestSell',
							sell_quantity: 'bestSellLimitQuantity',
							buy_price: 'bestBuyLimitPrice',
							buy_count: 'numberOfOrdersAtBestBuy',
							buy_quantity: 'bestBuyLimitQuantity',
						};

						visualData[rowIndex][field[`${side}_${type}`]] = valueAsNumber;
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

	useEffect(() => {
		if (!symbolISIN) {
			unsubscribe();
			return;
		}

		const sub = subscribeSymbolInfo(symbolISIN, 'ordersData');
		sub.addEventListener('onItemUpdate', onItemUpdate);

		subscribe(sub);
	}, [symbolISIN]);

	return (
		<div className='flex flex-1 gap-8'>
			<Grid
				side='buy'
				rowHeight={rowHeight}
				data={dataModify.buy}
				lowThreshold={lowThreshold}
				highThreshold={highThreshold}
			/>
			<Grid
				side='sell'
				rowHeight={rowHeight}
				data={dataModify.sell}
				lowThreshold={lowThreshold}
				highThreshold={highThreshold}
			/>
		</div>
	);
};

const Row = ({ price = 0, count = 0, quantity = 0, side, percent, rowHeight, disabled }: RowProps) => (
	<div
		style={{ height: `${rowHeight}px` }}
		className={clsx(
			'relative flex-justify-between *:text-base *:text-gray-900',
			side === 'sell' && 'flex-row-reverse',
			disabled && 'cursor-default opacity-50',
		)}
	>
		<div
			onCopy={(e) => copyNumberToClipboard(e, count)}
			style={{ flex: '0 0 30%', maxWidth: '7.2rem' }}
			className='relative z-10 text-center'
		>
			{sepNumbers(String(count))}
		</div>
		<div
			onCopy={(e) => copyNumberToClipboard(e, quantity)}
			style={{ flex: '0 0 40%' }}
			className='relative z-10 text-center'
		>
			{sepNumbers(String(quantity))}
		</div>
		<div
			onCopy={(e) => copyNumberToClipboard(e, price)}
			style={{ flex: '0 0 30%' }}
			className={clsx('relative z-10', side === 'sell' ? 'pr-8 text-right' : 'pl-8 text-left')}
		>
			{sepNumbers(String(price))}
		</div>

		{!disabled && (
			<div
				style={{ width: `${Math.min(percent, 100)}%`, height: `${rowHeight - 4}px` }}
				className={clsx(
					'pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-sm',
					side === 'buy' ? 'left-0 bg-success-100/10' : 'right-0 bg-error-100/10',
				)}
			/>
		)}
	</div>
);

const Grid = ({ side, data, lowThreshold, highThreshold, rowHeight = 40 }: GridProps) => {
	const t = useTranslations();

	return (
		<div style={{ flex: '0 0 calc(50% - 0.4rem)' }} className='gap-8 overflow-hidden flex-column'>
			<div
				className={cn(
					'flex-justify-between *:text-base *:text-gray-900',
					side === 'sell' && 'flex-row-reverse',
				)}
			>
				<div style={{ flex: '0 0 30%', maxWidth: '7.2rem' }} className='text-center'>
					{t('market_depth.count_column')}
				</div>
				<div style={{ flex: '0 0 40%' }} className='text-center'>
					{t('market_depth.quantity_column')}
				</div>
				<div style={{ flex: '0 0 30%' }} className={cn(side === 'sell' ? 'pr-8 text-right' : 'pl-8 text-left')}>
					{t('market_depth.price_column')}
				</div>
			</div>

			<div className='w-full gap-4 flex-column'>
				{data.map(({ percent, price, quantity, count }, i) => (
					<Row
						key={i}
						side={side}
						price={price}
						quantity={quantity}
						count={count}
						percent={percent}
						rowHeight={rowHeight}
						disabled={!isBetween(lowThreshold, price, highThreshold)}
					/>
				))}
			</div>
		</div>
	);
};

export default SymbolMarketDepth;
