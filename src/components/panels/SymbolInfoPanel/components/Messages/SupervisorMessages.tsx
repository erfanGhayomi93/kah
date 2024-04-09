import { useSupervisorMessagesQuery } from '@/api/queries/symbolQuery';
import { useState } from 'react';
import NoData from '../../../../common/NoData';
import Loading from '../../common/Loading';
import Message from './Message';

interface SupervisorMessagesProps {
	symbolISIN: string;
}

const SupervisorMessages = ({ symbolISIN }: SupervisorMessagesProps) => {
	const [expandedMessageId, setExpandedMessageId] = useState(-1);

	const { data, isLoading } = useSupervisorMessagesQuery({
		queryKey: ['supervisorMessagesQuery', symbolISIN],
	});

	if (isLoading) return <Loading />;

	if (!Array.isArray(data) || data.length === 0) return <NoData />;

	return (
		<div className='h-full overflow-auto'>
			<ul className='overflow-hidden flex-column'>
				{data.map((item) => (
					<Message
						key={item.id}
						id={item.id}
						title={item.messageTitle}
						body={item.messageBody}
						date={item.dateOfEvent}
						isRead={item.read}
						isExpand={expandedMessageId === item.id}
						onExpand={() => setExpandedMessageId(expandedMessageId === item.id ? -1 : item.id)}
					/>
				))}
			</ul>
		</div>
	);
};

export default SupervisorMessages;
