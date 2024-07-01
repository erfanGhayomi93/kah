import { sepNumbers } from '@/utils/helpers';

interface PositionProps extends Order.OptionOrder {}

const Position = ({ symbolTitle, lastTradedPrice, positionCount }: PositionProps) => (
	<li className='flex h-48 text-tiny text-light-gray-700 odd:bg-light-gray-100'>
		<div className='h-48 flex-1 flex-justify-center'>{symbolTitle}</div>
		<div style={{ flex: '0 0 27.5%' }} className='h-48 flex-justify-center'>
			{positionCount}
		</div>
		<div style={{ flex: '0 0 39%' }} className='h-48 flex-justify-center'>
			{sepNumbers(String(lastTradedPrice))}
		</div>
	</li>
);

export default Position;
