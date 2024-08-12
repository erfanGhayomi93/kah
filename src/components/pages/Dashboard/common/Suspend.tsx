import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';

interface SuspendProps {
	isLoading?: boolean;
	isEmpty?: boolean;
}

const Suspend = ({ isLoading, isEmpty }: SuspendProps) => {
	if (isLoading)
		return (
			<div className='absolute size-full bg-white center darkBlue:bg-gray-50 dark:bg-gray-50'>
				<Loading />
			</div>
		);

	if (isEmpty)
		return (
			<div className='absolute size-full bg-white rtl center darkBlue:bg-gray-50 dark:bg-gray-50'>
				<NoData />
			</div>
		);

	return null;
};

export default Suspend;
