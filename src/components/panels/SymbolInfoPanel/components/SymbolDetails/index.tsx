import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../../common/Section';
import BaseSymbolDetail from './BaseSymbolDetail';

interface SymbolDetailProps {
	symbolData: Symbol.Info;
	setHeight: (h: number) => void;
}

const SymbolDetail = ({ symbolData, setHeight }: SymbolDetailProps) => {
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
		<Section name='symbol_detail' defaultActiveTab='symbol_detail' tabs={tabs}>
			<BaseSymbolDetail symbolData={symbolData} setHeight={setHeight} />
		</Section>
	);
};

export default SymbolDetail;
