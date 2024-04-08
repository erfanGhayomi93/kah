interface PositionProps extends Order.OptionOrder {}

const Position = ({ symbolTitle, finalPrice, positionCount }: PositionProps) => {
	return (
		<li className='flex h-48 text-tiny text-gray-900 odd:bg-gray-200'>
			<div className='h-48 flex-1 flex-justify-center'>{symbolTitle}</div>
			<div style={{ flex: '0 0 27.5%' }} className='h-48 flex-justify-center'>
				{positionCount}
			</div>
			<div style={{ flex: '0 0 39%' }} className='h-48 flex-justify-center'>
				{finalPrice}
			</div>
		</li>
	);
};

export default Position;
