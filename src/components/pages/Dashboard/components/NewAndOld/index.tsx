import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const NewAndOldTable = dynamic(() => import('./NewAndOldTable'));

const NewAndOld = () => {
	const t = useTranslations();

	const [type, setType] = useState<Dashboard.TNewAndOld>('FirstTradedOptionSymbol');

	return (
		<Section<string, Dashboard.TNewAndOld>
			id='new_and_old'
			title={t('home.new_and_old')}
			info={t('tooltip.new_and_old_section')}
			defaultTopActiveTab={type}
			onBottomTabChange={setType}
			tabs={{
				bottom: [
					{ id: 'FirstTradedOptionSymbol', title: t('home.tab_new_trades') },
					{ id: 'MostTradedOptionSymbol', title: t('home.tab_most_trading_day') },
				],
			}}
		>
			<NewAndOldTable type={type} />
		</Section>
	);
};

export default NewAndOld;
