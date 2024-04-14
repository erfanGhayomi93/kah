import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Section from '../../common/Section';
import NewAndOldTable from './NewAndOldTable';

const NewAndOld = () => {
	const t = useTranslations();

	const [type, setType] = useState<Dashboard.TNewAndOld>('FirstTradedOptionSymbol');

	return (
		<Section<string, Dashboard.TNewAndOld>
			id='new_and_old'
			title={t('home.new_and_old')}
			defaultTopActiveTab={type}
			onBottomTabChange={setType}
			tabs={{
				bottom: [
					{ id: 'FirstTradedOptionSymbol', title: t('home.tab_new_trades') },
					{ id: 'MostTradedOptionSymbol', title: t('home.tab_most_trading_day') },
				],
			}}
		>
			<div className='flex-1 overflow-hidden p-8'>
				<NewAndOldTable type={type} />
			</div>
		</Section>
	);
};

export default NewAndOld;
