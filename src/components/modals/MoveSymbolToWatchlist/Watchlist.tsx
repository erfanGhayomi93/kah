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
			className='bg-gray-100 border-gray-200 absolute h-48 cursor-pointer gap-4 rounded border px-8 transition-colors flex-justify-start hover:btn-hover'
		>
			<span className={watchlist.isHidden ? 'text-gray-500' : 'text-gray-800'}>
				{watchlist.isHidden ? (
					<EyeSlashSVG width='2rem' height='2rem' />
				) : (
					<EyeSVG width='2rem' height='2rem' />
				)}
			</span>

			<span className={watchlist.isHidden ? 'text-gray-500' : 'text-gray-800'}>{watchlist.name}</span>
		</li>
	);
};

export default Watchlist;
