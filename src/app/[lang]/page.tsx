import { getOptionData } from '@/api/queries/optionQueries';
import Home from '@/components/pages/Home';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = async () => {
	const data = await getOptionData();

	return <Home data={data} />;
};

export default Page;
