import DesigningPage from '@/components/common/DesigningPage';
import Main from '@/components/layout/Main';
import { getMetadata } from '@/metadata';
import { type NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return (
		<Main className='flex-column-justify-center rounded-md !px-8'>
			<div className='flex-1 bg-white flex-justify-center'>
				<DesigningPage />
			</div>
		</Main>
	);
};

const generateMetadata = () => {
	return getMetadata({
		title: ' تکنیکال - کهکشان',
	});
};

export { generateMetadata };

export default Page;
