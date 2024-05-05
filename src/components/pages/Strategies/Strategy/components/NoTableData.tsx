import NoData from '@/components/common/NoData';

const NoTableData = () => {
	return (
		<div style={{ height: 'calc(100% - 8rem)', top: '8rem' }} className='pointer-events-none absolute size-full'>
			<NoData />
		</div>
	);
};

export default NoTableData;
