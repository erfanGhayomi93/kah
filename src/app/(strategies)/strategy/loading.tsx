import PageLoading from '@/components/common/Loading';

const Loading = () => {
	return (
		<div className='size-full p-8'>
			<div className='darkBlue:bg-gray-50 size-full rounded bg-white flex-justify-center dark:bg-gray-50'>
				<PageLoading />
			</div>
		</div>
	);
};

export default Loading;
