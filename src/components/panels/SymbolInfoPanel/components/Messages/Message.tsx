import { ArrowDownSVG, MessageCheckSVG, MessageDoubleCheckSVG } from '@/components/icons';
import dayjs from '@/libs/dayjs';
import clsx from 'clsx';
import { useMemo } from 'react';

interface MessageProps {
	id: number;
	title: string;
	body: string;
	date: string;
	isRead: boolean;
	isExpand: boolean;
	onExpand: () => void;
}

const Message = ({ title, body, date, isRead, isExpand, onExpand }: MessageProps) => {
	const dateFormatter = useMemo(() => {
		return dayjs(date).calendar('jalali').locale('fa').format('HH:mm:ss YYYY/MM/DD');
	}, [date]);

	return (
		<li
			onClick={onExpand}
			className={clsx(
				'cursor-pointer gap-8 px-8 transition-height flex-column',
				isRead || isExpand ? 'bg-gray-200' : 'bg-white',
			)}
			style={{
				height: isExpand ? '28rem' : '4rem',
			}}
		>
			<div style={{ flex: '0 0 4rem' }} className='flex-justify-between'>
				<div className='flex-1 gap-4 overflow-hidden flex-items-center'>
					<ArrowDownSVG
						style={{ transform: `rotate(${isExpand ? 180 : 0}deg)` }}
						className='min-h-16 min-w-16 text-gray-900 transition-transform'
					/>

					<span className='truncate text-tiny font-medium text-gray-1000'>{title}</span>
				</div>

				<div className='gap-8 text-gray-900 flex-items-center'>
					<span className='text-tiny'>{dateFormatter}</span>
					<span className={clsx((isRead || isExpand) && 'text-info')}>
						{isRead || isExpand ? (
							<MessageDoubleCheckSVG width='1.6rem' height='1.6rem' />
						) : (
							<MessageCheckSVG width='1.6rem' height='1.6rem' />
						)}
					</span>
				</div>
			</div>

			{body && (
				<div className='flex-1 overflow-auto'>
					<p style={{ lineHeight: 2 }} className='text-justify text-gray-900'>
						{body}
					</p>
				</div>
			)}
		</li>
	);
};

export default Message;
