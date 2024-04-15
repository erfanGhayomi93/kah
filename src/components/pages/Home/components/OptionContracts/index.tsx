import Loading from '@/components/common/Loading';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const OptionContractsContainer = dynamic(() => import('./OptionContractsContainer'), {
	loading: () => <Loading />,
});

interface DefaultActiveTab {
	top: Dashboard.GetOptionContractAdditionalInfo.Basis;
	bottom: Dashboard.GetOptionContractAdditionalInfo.Type;
}

const OptionContracts = () => {
	const t = useTranslations();

	const [defaultTab, setDefaultTab] = useState<DefaultActiveTab>({
		top: 'Volume',
		bottom: 'ContractType',
	});

	const setDefaultTabByPosition = <T extends keyof DefaultActiveTab>(position: T, value: DefaultActiveTab[T]) => {
		setDefaultTab((prev) => ({
			...prev,
			[position]: value,
		}));
	};

	return (
		<Section<DefaultActiveTab['top'], DefaultActiveTab['bottom']>
			id='option_contracts'
			title={t('home.option_contracts')}
			defaultTopActiveTab={defaultTab.top}
			defaultBottomActiveTab={defaultTab.bottom}
			onTopTabChange={(v) => setDefaultTabByPosition('top', v)}
			onBottomTabChange={(v) => setDefaultTabByPosition('bottom', v)}
			tabs={{
				top: [
					{ id: 'Volume', title: t('home.tab_volume') },
					{ id: 'Value', title: t('home.tab_value') },
				],
				bottom: [
					{ id: 'ContractType', title: t('home.tab_contract_type') },
					{ id: 'IOTM', title: t('home.tab_in_profit') },
				],
			}}
		>
			<OptionContractsContainer type={defaultTab.bottom} basis={defaultTab.top} />
		</Section>
	);
};

export default OptionContracts;
