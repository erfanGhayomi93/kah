import { forwardRef } from 'react';

const PanelLoading = forwardRef<HTMLDivElement>((_, ref) => (
	<div
		ref={ref}
		style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', zIndex: 99 }}
		className='fixed left-0 top-0 size-full flex-justify-center'
	>
		<div className='size-48 spinner' />
	</div>
));

export default PanelLoading;
