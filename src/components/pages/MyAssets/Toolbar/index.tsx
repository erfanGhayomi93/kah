'use client';

import Filters from './Filters';
import PageTabs from './PageTabs';

const Toolbar = () => {
	return (
		<div
			style={{ flex: '0 0 5.6rem' }}
			className='flex-1 gap-24 overflow-hidden rounded bg-white px-16 flex-justify-between'
		>
			<PageTabs />
			<Filters />
		</div>
	);
};

export default Toolbar;
