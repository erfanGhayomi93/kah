const Plus = () => (
	<svg width='12.4rem' height='12.4rem' viewBox='0 0 124 124' fill='none' xmlns='http://www.w3.org/2000/svg'>
		<rect
			x='0.5'
			y='0.5'
			width='123'
			height='123'
			rx='15.5'
			fill='white'
			stroke='currentColor'
			strokeDasharray='17 17'
		/>
		<path d='M62 50L62 74' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
		<path d='M74 62L50 62' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
	</svg>
);

const Custom = () => {
	return (
		<div className='size-full rounded bg-white px-8 pb-16 pt-8 flex-justify-center'>
			<button
				type='button'
				style={{ width: '12.4rem', height: '12.4rem' }}
				className='rounded text-gray-800 flex-justify-center'
			>
				<Plus />
			</button>
		</div>
	);
};

export default Custom;
