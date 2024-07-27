'use client';

import Filters from './Filters';
import PageTabs from './PageTabs';

const Toolbar = () => (
	<div
		style={{ flex: '0 0 5.6rem' }}
		className='darkBlue:bg-gray-50 flex-1 gap-24 overflow-hidden rounded bg-white px-16 flex-justify-between dark:bg-gray-50'
	>
		<PageTabs />
		<Filters />
	</div>
);

export default Toolbar;
