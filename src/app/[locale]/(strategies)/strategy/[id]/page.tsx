import routes from '@/api/routes';
import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import Descriptions from '@/components/pages/Strategies/Strategy/Descriptions';
import Table from '@/components/pages/Strategies/Strategy/Table';
import { redirect } from '@/navigation';
import type { NextPage } from 'next';

const getStrategy = async (id: string): Promise<Strategy.GetAll | undefined> => {
	try {
		const { result } = (await fetch(routes.strategy.GetAll, { method: 'get', cache: 'force-cache' }).then((res) =>
			res.json(),
		)) as ServerResponse<Strategy.GetAll[]>;

		return result.find((item) => item.type === id) ?? undefined;
	} catch (e) {
		return undefined;
	}
};

const Page: NextPage<INextStrategyProps> = async ({ params: { id } }) => {
	const strategy = await getStrategy(id);

	if (!strategy) {
		redirect('/');
		return <Loading />;
	}

	return (
		<Main className='!px-8'>
			<Descriptions strategy={strategy} />
			<Table strategy={strategy} />
		</Main>
	);
};

export const revalidate = 3600;

export default Page;
