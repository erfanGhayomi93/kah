import Actions from './Actions';
import SymbolSearch from './SymbolSearch';
import WatchlistList from './WatchlistList';

const Toolbar = () => {
	return (
		<div className='gap-16 flex-column'>
			<div className='h-40 w-full flex-justify-between'>
				<SymbolSearch />
				<Actions />
			</div>

			<WatchlistList />
		</div>
	);
};

export default Toolbar;
