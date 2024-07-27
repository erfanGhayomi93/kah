import DesigningPage from '@/components/common/DesigningPage';
import Main from '@/components/layout/Main';
import { getMetadata } from '@/metadata';
import { type NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return (
		<Main className='flex-column-justify-center rounded-md'>
			<div className='darkBlue:bg-gray-50 flex-1 bg-white flex-justify-center dark:bg-gray-50'>
				<DesigningPage />
			</div>
		</Main>
	);
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('technical'),
	});
};

export { generateMetadata };

export default Page;
