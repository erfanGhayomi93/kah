import { useTranslations } from 'next-intl';
import DetailPart from '../components/DetailPart';

const CoveredCallDescription = () => {
	const t = useTranslations('CoveredCall');

	return (
		<div className='text-gray-700 gap-32 text-base leading-loose flex-column'>
			<DetailPart title={t('modal_description_1')} items={[t('modal_description_2'), t('modal_description_3')]} />
			<DetailPart title={t('modal_description_4')} items={[t('modal_description_5'), t('modal_description_6')]} />
		</div>
	);
};

export default CoveredCallDescription;
