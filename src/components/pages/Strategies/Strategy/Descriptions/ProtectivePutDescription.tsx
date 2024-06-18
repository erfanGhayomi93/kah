import { useTranslations } from 'next-intl';
import DetailPart from '../components/DetailPart';

const ProtectivePutDescription = () => {
	const t = useTranslations('ProtectivePut');

	return (
		<div className='text-light-gray-700 gap-8 text-base leading-loose flex-column'>
			<DetailPart title={t('modal_description_1')} items={[t('modal_description_2'), t('modal_description_3')]} />
		</div>
	);
};

export default ProtectivePutDescription;
