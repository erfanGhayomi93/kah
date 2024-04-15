import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';

interface SuspendProps {
	isLoading: boolean;
	isEmpty: boolean;
}

const Suspend = ({ isLoading, isEmpty }: SuspendProps) => {
	if (isLoading)
		return (
			<div className='absolute size-full bg-white center'>
				<Loading />
			</div>
		);

	if (isEmpty)
		return (
			<div className='absolute size-full bg-white center'>
				<NoData />
			</div>
		);

	return null;
};

export default Suspend;
