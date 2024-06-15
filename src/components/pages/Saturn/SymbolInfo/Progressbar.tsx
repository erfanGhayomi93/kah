import { divide, numFormatter } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface ProgressbarProps {
	title: string;
	sellVolume: number;
	sellCount: number;
	buyVolume: number;
	buyCount: number;
	totalVolume: number;
}

interface PartProps {
	side: TBsSides;
	percent: number;
	topRight?: React.ReactNode;
	topLeft?: React.ReactNode;
	bottomRight?: React.ReactNode;
	bottomLeft?: React.ReactNode;
}

const Progressbar = ({ title, sellVolume, sellCount, buyVolume, buyCount, totalVolume }: ProgressbarProps) => {
	const t = useTranslations();

	const buyPercent = Number((divide(buyVolume, totalVolume) * 100).toFixed(2));
	const sellPercent = Number((divide(sellVolume, totalVolume) * 100).toFixed(2));

	return (
		<div className='flex gap-8'>
			<Part
				side='buy'
				percent={buyPercent}
				topRight={<span className='text-light-gray-800'>{title}</span>}
				bottomRight={numFormatter(buyVolume)}
				topLeft={<span className='block rtl'>{`${buyCount} ${t('symbol_info_panel.person')}`}</span>}
				bottomLeft={<span className='text-light-success-100'>{buyPercent}%</span>}
			/>

			<Part
				side='sell'
				percent={sellPercent}
				bottomRight={<span className='text-light-error-100'>{sellPercent}%</span>}
				topLeft={<span className='block rtl'>{`${sellCount} ${t('symbol_info_panel.person')}`}</span>}
				bottomLeft={numFormatter(sellVolume)}
			/>
		</div>
	);
};

const Part = ({ percent, side, topRight, topLeft, bottomRight, bottomLeft }: PartProps) => (
	<div className='flex-1 gap-4 flex-column'>
		<div className='text-tiny text-light-gray-500 ltr flex-justify-between'>
			<span>{topLeft}</span>
			<span>{topRight}</span>
		</div>

		<div className='rounded-sm bg-light-gray-200'>
			<div
				className={clsx('h-4 rounded-sm', side === 'buy' ? 'bg-light-success-100' : 'bg-light-error-100')}
				style={{ width: `${Math.min(percent, 100)}%` }}
			/>
		</div>

		<div className='text-tiny text-light-gray-500 ltr flex-justify-between'>
			<span>{bottomLeft}</span>
			<span>{bottomRight}</span>
		</div>
	</div>
);

export default Progressbar;
