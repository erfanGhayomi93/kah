import { useTranslations } from 'next-intl';
import DetailPart from '../components/DetailPart';

const ProtectivePutDescription = () => {
	const t = useTranslations('ProtectivePut');

	return (
		<div className='gap-8 text-base leading-loose text-gray-900 flex-column'>
			<DetailPart title={t('modal_description_1')} items={[t('modal_description_2'), t('modal_description_3')]} />
		</div>
	);
};

export default ProtectivePutDescription;
