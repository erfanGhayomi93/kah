import { useServerDatetime } from '@/hooks';
import dayjs from '@/libs/dayjs';
import { useMemo } from 'react';

const ServerDateTime = () => {
	const { timestamp } = useServerDatetime();

	const [serverTime, serverDate] = useMemo(() => {
		return dayjs(timestamp).calendar('jalali').format('HH:mm:ss YYYY/MM/DD').split(' ');
	}, [timestamp]);

	return (
		<div className='h-full gap-12 ltr flex-justify-start'>
			<span style={{ width: '6.6rem' }} className='text-gray-700 text-left text-base'>
				{serverDate}
			</span>
			<span style={{ width: '5.2rem' }} className='text-gray-700 text-left text-base'>
				{serverTime}
			</span>
		</div>
	);
};

export default ServerDateTime;
