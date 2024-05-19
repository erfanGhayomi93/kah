import Strategies from '@/components/pages/Strategies/List';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = async () => {
	return (
		<div className='relative flex flex-1 flex-wrap content-start gap-y-8 rounded bg-white px-8 py-24'>
			<Strategies />
		</div>
	);
};

export default Page;
