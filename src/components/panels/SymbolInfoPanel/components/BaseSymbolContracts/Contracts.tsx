import { useBaseSettlementDaysQuery } from '@/api/queries/optionQueries';
import NoData from '../../../../common/NoData';
import Loading from '../../common/Loading';
import Contract from './Contract';

interface ContractsProps {
	symbolISIN: string;
}

const Contracts = ({ symbolISIN }: ContractsProps) => {
	const { data: baseSettlementDays, isLoading } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', symbolISIN],
	});

	if (isLoading) return <Loading />;

	const data = baseSettlementDays ?? [];

	if (!isLoading && data.length === 0) return <NoData />;

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
