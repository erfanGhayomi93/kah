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
				style={{ maxWidth: '14rem', minWidth: '6.4rem' }}
				className={cn(
					'h-40 gap-4 truncate rounded px-8 font-medium transition-colors flex-justify-center',
					isActive ? 'no-hover btn-select' : 'bg-gray-100 text-gray-700 hover:btn-hover',
				)}
			>
				{star && <StarFillSVG width='1.4rem' height='1.4rem' className='text-warning-100' />}
				{name}
			</button>
		</li>
	);
};

export default Watchlist;
