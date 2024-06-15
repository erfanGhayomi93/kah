import { ArrowDownSVG } from '@/components/icons';
import { useLocalstorage } from '@/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import Section, { type ITabIem } from '../../common/Section';
import ComputingInformation from './ComputingInformation';
import PriceInformation from './PriceInformation';

type TTab = 'price_information' | 'computing_information';

interface OptionDetailProps {
	symbolData: Symbol.Info;
	setHeight: (h: number) => void;
}

const OptionDetail = ({ symbolData, setHeight }: OptionDetailProps) => {
	const t = useTranslations();

	const [activeTab, setActiveTab] = useLocalstorage<TTab>('syodat', 'price_information');

	const [isExpand, setIsExpand] = useLocalstorage('oio', false);

	const onTabChanges = (tab: TTab) => {
		setActiveTab(tab);
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

	useEffect(() => {
		if (activeTab === 'price_information') {
			setHeight(isExpand ? 328 : 492);
		} else if (activeTab === 'computing_information') {
			setHeight(isExpand ? 328 : 652);
		}
	}, [activeTab, isExpand]);

	return (
		<Section name='option_detail' defaultActiveTab={activeTab} tabs={tabs} onChange={onTabChanges}>
			<div className='px-8 pb-8 pt-16 flex-column'>
				{activeTab === 'price_information' ? (
					<PriceInformation isExpand={isExpand} symbolData={symbolData} />
				) : (
					<ComputingInformation isExpand={isExpand} symbolISIN={symbolData.symbolISIN} />
				)}
			</div>

			<button
				type='button'
				onClick={() => setIsExpand(!isExpand)}
				className='text-light-gray-700 size-24 w-full flex-justify-center'
			>
				<ArrowDownSVG
					width='1.4rem'
					height='1.4rem'
					className='transition-transform'
					style={{ transform: `rotate(${isExpand ? 0 : 180}deg)` }}
				/>
			</button>
		</Section>
	);
};

export default OptionDetail;
