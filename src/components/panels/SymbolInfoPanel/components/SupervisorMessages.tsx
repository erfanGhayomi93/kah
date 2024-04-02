import { useMemo } from 'react';
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
			<div className='px-8 py-16' />
		</Section>
	);
};

export default SupervisorMessages;
