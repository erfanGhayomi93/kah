import { useTranslations } from 'next-intl';
import DetailPart from '../components/DetailPart';

const BearPutSpreadDescription = () => {
	const t = useTranslations('BearPutSpread');

	return (
		<div className='text-light-gray-700 gap-32 text-base leading-loose flex-column'>
			<DetailPart title={t('modal_description_1')} />
		</div>
	);
};

export default BearPutSpreadDescription;
