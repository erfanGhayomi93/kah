import { divide, numFormatter } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface ProgressbarProps {
	title: string;
	sellVolume: number;
	sellCount: number;
	buyVolume: number;
	buyCount: number;
}

interface PartProps {
	side: TBsSides;
	percent: number;
	topRight?: React.ReactNode;
	topLeft?: React.ReactNode;
	bottomRight?: React.ReactNode;
	bottomLeft?: React.ReactNode;
}

const Progressbar = ({ title, sellVolume, sellCount, buyVolume, buyCount }: ProgressbarProps) => {
	const t = useTranslations();

	const sum = sellVolume + buyVolume;
	const buyPercent = Number((divide(buyVolume, sum) * 100).toFixed(2));
	const sellPercent = Number((divide(sellVolume, sum) * 100).toFixed(2));

	return (
		<div className='flex gap-8'>
			<Part
				side='buy'
				percent={buyPercent}
				topRight={<span className='text-gray-1000'>{title}</span>}
				bottomRight={numFormatter(buyVolume)}
				topLeft={<span className='block rtl'>{`${buyCount} ${t('symbol_info_panel.person')}`}</span>}
				bottomLeft={<span className='text-success-100'>{buyPercent}%</span>}
			/>

			<Part
				side='sell'
				percent={sellPercent}
				bottomRight={<span className='text-error-100'>{sellPercent}%</span>}
				topLeft={<span className='block rtl'>{`${sellCount} ${t('symbol_info_panel.person')}`}</span>}
				bottomLeft={numFormatter(sellVolume)}
			/>
		</div>
	);
};

const Part = ({ percent, side, topRight, topLeft, bottomRight, bottomLeft }: PartProps) => (
	<div className='flex-1 gap-4 flex-column'>
		<div className='text-tiny text-gray-700 ltr flex-justify-between'>
			<span>{topLeft}</span>
			<span>{topRight}</span>
		</div>

		<div className='rounded-sm bg-gray-500'>
			<div
				className={clsx('h-4 rounded-sm', side === 'buy' ? 'bg-success-100' : 'bg-error-100')}
				style={{ width: `${Math.min(percent, 100)}%` }}
			/>
		</div>

		<div className='text-tiny text-gray-700 ltr flex-justify-between'>
			<span>{bottomLeft}</span>
			<span>{bottomRight}</span>
		</div>
	</div>
);

export default Progressbar;
