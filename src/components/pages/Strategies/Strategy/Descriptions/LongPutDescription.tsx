import { useTranslations } from 'next-intl';
import DetailPart from '../components/DetailPart';

const LongPutDescription = () => {
	const t = useTranslations('LongPut');

	return (
		<div className='text-gray-700 gap-32 text-base leading-loose flex-column'>
			<DetailPart title={t('modal_description_1')} />
		</div>
	);
};

export default LongPutDescription;
