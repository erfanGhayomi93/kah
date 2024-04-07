import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../../common/Section';
import SupervisorMessages from './SupervisorMessages';

interface SupervisorMessagesProps {
	symbolISIN: string;
}

const Messages = ({ symbolISIN }: SupervisorMessagesProps) => {
	const t = useTranslations();

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'supervisor_messages',
				title: t('symbol_info_panel.supervisor_message'),
			},
		],
		[],
	);

	return (
		<Section name='supervisor_messages' defaultActiveTab='supervisor_messages' tabs={tabs}>
			<SupervisorMessages symbolISIN={symbolISIN} />
		</Section>
	);
};

export default Messages;
