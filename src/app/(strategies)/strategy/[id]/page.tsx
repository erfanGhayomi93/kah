import { ssrRoutes } from '@/api/routes';
import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import Strategy from '@/components/pages/Strategies/Strategy';
import { redirect } from '@/navigation';
import type { NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const getStrategy = (id: string) =>
	new Promise<Strategy.GetAll | undefined>(async (resolve) => {
		try {
			const { result } = (await fetch(ssrRoutes.strategy.GetAll, {
				method: 'get',
				cache: 'default',
			}).then((res) => res.json())) as ServerResponse<Strategy.GetAll[]>;

			resolve(result.find((item) => item.type === id) ?? undefined);
		} catch (e) {
			resolve(undefined);
		}
	});

const Page: NextPage<INextStrategyProps> = async ({ params: { id } }) => {
	const strategy = await getStrategy(id);

	if (!strategy) {
		redirect('/');
		return <Loading />;
	}

	return (
		<Main className='!px-8'>
			<Strategy {...strategy} />
		</Main>
	);
};

const generateMetadata = async ({ params: { id } }: INextStrategyProps) => {
	const t = await getTranslations(id);
	return {
		title: `استراتژی ${t('title')} - کهکشان`,
	};
};

export { generateMetadata };

export const revalidate = 3600;

export default Page;
