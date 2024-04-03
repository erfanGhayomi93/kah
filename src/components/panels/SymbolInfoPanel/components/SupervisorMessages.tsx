import { useMemo } from 'react';
import NoData from '../common/NoData';
import Section, { type ITabIem } from '../common/Section';

const SupervisorMessages = () => {
	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'supervisor_messages',
				title: 'پیام ناظر',
			},
		],
		[],
	);

	return (
		<Section defaultActiveTab='supervisor_messages' tabs={tabs}>
			<NoData />
		</Section>
	);
};

export default SupervisorMessages;
