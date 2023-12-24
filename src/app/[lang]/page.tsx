import Home from '@/components/pages/Home';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = async () => {
	return (
		<div className='flex flex-col h-full w-full'>
			<Home />
		</div>
	);
};

export default Page;
