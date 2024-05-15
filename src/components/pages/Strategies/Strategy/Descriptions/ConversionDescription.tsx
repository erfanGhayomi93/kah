import { useTranslations } from 'next-intl';
import DetailPart from '../components/DetailPart';

const ConversionDescription = () => {
	const t = useTranslations('Conversion');

	return (
		<div className='gap-32 text-base leading-loose text-gray-900 flex-column'>
			<DetailPart title={t('modal_description_1')} />
		</div>
	);
};

export default ConversionDescription;
