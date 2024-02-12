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
				style={{ maxWidth: '14rem', minWidth: '6.4rem' }}
				className={clsx(
					'h-40 truncate rounded px-16 font-medium',
					isActive ? 'btn-primary' : 'btn-primary-outline',
				)}
			>
				{name}
			</button>
		</li>
	);
};

export default Watchlist;
