import clsx from 'clsx';

interface WatchlistProps extends Option.WatchlistList {
	isActive: boolean;
	onSelect: () => void;
}

const Watchlist = ({ onSelect, isActive, name, isHidden }: WatchlistProps) => {
	if (isHidden) return null;

	return (
		<li>
			<button
				onClick={onSelect}
				type='button'
				className={clsx('h-40 rounded px-16 font-medium', isActive ? 'btn-primary' : 'btn-primary-outline')}
			>
				{name}
			</button>
		</li>
	);
};

export default Watchlist;
