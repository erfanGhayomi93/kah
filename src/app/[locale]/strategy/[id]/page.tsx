import { type GetStaticPaths } from 'next';

export const getStaticPaths = (async () => {
	return {
		paths: [
			{
				params: {
					id: '1',
					locale: 'fa',
				},
			}, // See the "paths" section below
		],
		fallback: false, // false or "blocking"
	};
}) satisfies GetStaticPaths;

const Page = async ({ params: { id } }: INextStrategyProps) => {
	return <h1>Hello {id}</h1>;
};

export default Page;
