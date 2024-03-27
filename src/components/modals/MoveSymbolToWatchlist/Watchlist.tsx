import { EyeSVG, EyeSlashSVG } from '@/components/icons';

interface WatchlistProps {
	top: number;
	watchlist: Option.WatchlistList;
	onSelect: () => void;
}

const Watchlist = ({ top, watchlist, onSelect }: WatchlistProps) => {
	return (
		<li
			style={{ top: `${top}rem`, width: 'calc(100% - 4.8rem)' }}
			onClick={onSelect}
			className='hover:btn-hover absolute h-48 cursor-pointer gap-4 rounded border border-gray-500 bg-gray-200 px-8 transition-colors flex-justify-start'
		>
			<span className={watchlist.isHidden ? 'text-gray-700' : 'text-gray-1000'}>
				{watchlist.isHidden ? (
					<EyeSlashSVG width='2rem' height='2rem' />
				) : (
					<EyeSVG width='2rem' height='2rem' />
				)}
			</span>

			<span className={watchlist.isHidden ? 'text-gray-700' : 'text-gray-1000'}>{watchlist.name}</span>
		</li>
	);
};

export default Watchlist;
