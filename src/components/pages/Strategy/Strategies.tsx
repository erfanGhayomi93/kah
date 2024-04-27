import { useGetAllStrategyQuery } from '@/api/queries/strategyQuery';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import StrategyItem from './StrategyItem';

const Strategies = () => {
	const { data, isLoading } = useGetAllStrategyQuery({
		queryKey: ['getAllStrategyQuery'],
	});

	if (isLoading)
		return (
			<div className='relative flex-1 rounded bg-white'>
				<Loading />
			</div>
		);

	if (!data?.length)
		return (
			<div className='flex-1 rounded bg-white'>
				<div style={{ marginTop: '9.6rem' }}>
					<NoData />
				</div>
			</div>
		);

	return (
		<div className='relative flex h-full flex-wrap rounded bg-white px-8 py-24'>
			{data.map((item) => (
				<StrategyItem key={item.id} {...item} />
			))}
		</div>
	);
};

export default Strategies;
