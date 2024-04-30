import Strategy from '@/components/pages/Strategies/Strategy';
import type { NextPage } from 'next';

// const getStrategy = async (id: string): Promise<Strategy.GetAll | undefined> => {
// 	try {
// 		const { result } = (await fetch(routes.strategy.GetAll, { method: 'get', cache: 'default' }).then((res) =>
// 			res.json(),
// 		)) as ServerResponse<Strategy.GetAll[]>;

// 		return result.find((item) => item.type === id) ?? undefined;
// 	} catch (e) {
// 		console.log(e);
// 		return undefined;
// 	}
// };

const Page: NextPage<INextStrategyProps> = async ({ params: { id } }) => {
	// const strategy = await getStrategy(id);

	// if (!strategy) {
	// 	redirect('/');
	// 	return <Loading />;
	// }

	return <Strategy id={id} />;
};

export const revalidate = 3600;

export default Page;
