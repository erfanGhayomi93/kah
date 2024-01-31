import { useSymbolBestLimitQuery } from '@/api/queries/symbolQuery';
import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface RowProps {
	side: 'buy' | 'sell';
	price: number;
	count: number;
	quantity: number;
	percent: number;
}

interface GridProps {
	side: 'buy' | 'sell';
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

const Grid = ({ side }: GridProps) => {
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
				<Row side={side} price={8520} quantity={1e9} count={1520} percent={20} />
				<Row side={side} price={1760} quantity={1e9} count={1520} percent={40} />
				<Row side={side} price={438} quantity={1e9} count={1520} percent={60} />
				<Row side={side} price={6400} quantity={1e9} count={1520} percent={80} />
				<Row side={side} price={761} quantity={1e9} count={1520} percent={120} />
			</div>
		</div>
	);
};

const SymbolPriceTable = ({ symbolISIN }: SymbolPriceTableProps) => {
	const { data } = useSymbolBestLimitQuery({
		queryKey: ['symbolBestLimitQuery', symbolISIN],
		enabled: Boolean(symbolISIN),
	});

	return (
		<div className='flex flex-1 gap-8'>
			<Grid side='buy' />
			<Grid side='sell' />
		</div>
	);
};

export default SymbolPriceTable;
