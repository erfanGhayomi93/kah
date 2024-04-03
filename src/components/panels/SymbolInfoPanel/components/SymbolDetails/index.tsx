import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../../common/Section';
import BaseSymbolDetail from './BaseSymbolDetail';

interface SymbolDetailProps {
	symbolData: Symbol.Info;
	onToggleSymbolDetail: (isExpand: boolean) => void;
}

const SymbolDetail = ({ symbolData, onToggleSymbolDetail }: SymbolDetailProps) => {
	const t = useTranslations();

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'symbol_detail',
				title: t('symbol_info_panel.symbol_detail'),
			},
		],
		[],
	);

	return (
		<Section defaultActiveTab='symbol_detail' tabs={tabs}>
			<BaseSymbolDetail symbolData={symbolData} onToggleSymbolDetail={onToggleSymbolDetail} />
		</Section>
	);
};

export default SymbolDetail;
