import { StarFillSVG } from '@/components/icons';
import { cn } from '@/utils/helpers';

interface WatchlistProps extends Option.WatchlistList {
	star: boolean;
	isActive: boolean;
	onSelect: () => void;
}

const Watchlist = ({ onSelect, star, isActive, name, isHidden }: WatchlistProps) => {
	if (isHidden) return null;

	return (
		<li>
			<button
				onClick={onSelect}
				type='button'
				style={{ maxWidth: '16rem' }}
				title={name}
				className={cn(
					'h-40 min-w-64 gap-4 rounded px-8 font-medium transition-colors flex-justify-center',
					isActive ? 'no-hover btn-select' : 'bg-gray-100 text-gray-700 hover:btn-hover',
				)}
			>
				{star && <StarFillSVG width='1.4rem' height='1.4rem' className='text-warning-100' />}
				<span className='truncate'>{name}</span>
			</button>
		</li>
	);
};

export default Watchlist;
