import { useLocalstorage } from '@/hooks';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../../common/Section';
import ComputingInformation from './ComputingInformation';
import PriceInformation from './PriceInformation';

type TTab = 'price_information' | 'computing_information';

interface OptionDetailProps {
	symbolData: Symbol.Info;
	onExpand: (expand: boolean) => void;
}

const OptionDetail = ({ symbolData, onExpand }: OptionDetailProps) => {
	const t = useTranslations();

	const [activeTab, setActiveTab] = useLocalstorage<TTab>('syodat', 'price_information');

	const onTabChanges = (tab: TTab) => {
		setActiveTab(tab);
		onExpand(tab !== 'price_information');
	};

	const tabs: Array<ITabIem<TTab>> = useMemo(
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
		<Section name='option_detail' defaultActiveTab={activeTab} tabs={tabs} onChange={onTabChanges}>
			{activeTab === 'price_information' ? (
				<PriceInformation symbolData={symbolData} />
			) : (
				<ComputingInformation symbolISIN={symbolData.symbolISIN} />
			)}
		</Section>
	);
};

export default OptionDetail;
