import { type BodyScrollEvent } from '@ag-grid-community/core';

export const onBodyScroll = ({ api, direction, left }: BodyScrollEvent) => {
	if (direction !== 'horizontal') return;

	try {
		const eGrid = document.querySelector<HTMLDivElement>(`.ag-root-wrapper[grid-id="${api.getGridId()}"]`)!;
		const eRightScrollbar = eGrid.querySelector<HTMLDivElement>('.ag-pinned-right-cols-container')!;
		const eHorizontalScrollbar = eGrid.querySelector<HTMLDivElement>('.ag-body-horizontal-scroll-viewport')!;
		const eCenterColsViewport = eGrid.querySelector<HTMLDivElement>('.ag-center-cols-viewport')!;
		const eLeftScrollbar = eGrid.querySelector<HTMLDivElement>('.ag-pinned-left-cols-container')!;

		const hasReachedToTheEnd = eHorizontalScrollbar.scrollWidth - left === eCenterColsViewport.offsetWidth;

		eRightScrollbar.classList[left === 0 ? 'add' : 'remove']('scroll-end');
		eLeftScrollbar.classList[hasReachedToTheEnd ? 'add' : 'remove']('scroll-end');
	} catch (e) {
		//
	}
};
