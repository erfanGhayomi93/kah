import routes from '@/api/routes';
import Main from '@/components/layout/Main';
import type { NextPage } from 'next';

export async function generateStaticParams() {
	try {
		const { result } = (await fetch(routes.strategy.GetAll, { method: 'get', cache: 'default' }).then((res) =>
			res.json(),
		)) as ServerResponse<Strategy.GetAll[]>;

		return result.map((item) => ({
			id: item.type,
		}));
	} catch (e) {
		return [];
	}
}

const Page: NextPage<INextStrategyProps> = async ({ params: { id } }) => {
	return (
		<Main className='gap-16 !px-8'>
			<div className='flex-1 overflow-hidden rounded bg-white px-16'></div>
			<div className='flex-1 overflow-hidden rounded bg-white px-16'></div>
		</Main>
	);
};

export const dynamicParams = false;

export default Page;
