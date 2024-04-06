import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import Section, { type ITabIem } from '../../common/Section';
import ComputingInformation from './ComputingInformation';
import PriceInformation from './PriceInformation';

const OptionDetail = () => {
	const t = useTranslations();

	const [activeTab, setActiveTab] = useState('price_information');

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'price_information',
				title: t('symbol_info_panel.price_information'),
			},
			{
				id: 'computing_information',
				title: t('symbol_info_panel.computing_information'),
			},
		],
		[],
	);

	return (
		<Section name='option_detail' defaultActiveTab={activeTab} tabs={tabs} onChange={setActiveTab}>
			{activeTab === 'price_information' ? <PriceInformation /> : <ComputingInformation />}
		</Section>
	);
};

export default OptionDetail;
