import {
	type BodyScrollEndEvent,
	type BodyScrollEvent,
	type ColumnVisibleEvent,
	type GridReadyEvent,
} from '@ag-grid-community/core';

export const handleTableShadow = (
	params: GridReadyEvent | ColumnVisibleEvent | BodyScrollEvent | BodyScrollEndEvent,
) => {
	if ('direction' in params && params.direction !== 'horizontal') return;

	try {
		const eGrid = document.querySelector<HTMLDivElement>(`.ag-root-wrapper[grid-id="${params.api.getGridId()}"]`)!;
		const eRightScrollbar = eGrid.querySelector<HTMLDivElement>('.ag-pinned-right-cols-container')!;
		const eHorizontalScrollbar = eGrid.querySelector<HTMLDivElement>('.ag-body-horizontal-scroll-viewport')!;
		const eCenterColsViewport = eGrid.querySelector<HTMLDivElement>('.ag-center-cols-viewport')!;
		const eLeftScrollbar = eGrid.querySelector<HTMLDivElement>('.ag-pinned-left-cols-container')!;

		const offsetLeft = Math.max('direction' in params ? params.left : eHorizontalScrollbar.scrollLeft);
		const offsetRight = Math.max(
			0,
			eHorizontalScrollbar.scrollWidth - (offsetLeft + eCenterColsViewport.offsetWidth),
		);

		if (offsetLeft === 0) {
			eRightScrollbar.classList.add('scroll-end');
			if (offsetRight > 0) eLeftScrollbar.classList.remove('scroll-end');
		}

		if (offsetRight === 0) {
			eLeftScrollbar.classList.add('scroll-end');
			if (offsetLeft > 0) eRightScrollbar.classList.remove('scroll-end');
		}
	} catch (e) {
		//
	}
};
