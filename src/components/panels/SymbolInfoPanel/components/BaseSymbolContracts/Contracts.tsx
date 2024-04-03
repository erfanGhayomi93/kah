import { useBaseSettlementDaysQuery } from '@/api/queries/optionQueries';
import Loading from '@/components/common/Loading';
import NoData from '../../common/NoData';
import Contract from './Contract';

interface ContractsProps {
	symbolISIN: string;
}

const Contracts = ({ symbolISIN }: ContractsProps) => {
	const { data: baseSettlementDays, isFetching } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', symbolISIN],
	});

	if (isFetching)
		return (
			<div className='relative flex-1'>
				<Loading />
			</div>
		);

	const data = baseSettlementDays ?? [];

	if (!isFetching && data.length === 0) return <NoData />;

	return (
		<div className='h-full overflow-auto'>
			<ul className='overflow-hidden flex-column'>
				{data.map((item) => (
					<Contract key={item.contractEndDate} {...item} />
				))}
			</ul>
		</div>
	);
};

export default Contracts;
