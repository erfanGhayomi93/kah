import type { NextPage } from 'next';

// export const getStaticPaths = (async () => {
// 	return {
// 		paths: [
// 			{
// 				params: {
// 					id: '1',
// 					locale: 'fa',
// 				},
// 			}, // See the "paths" section below
// 		],
// 		fallback: false, // false or "blocking"
// 	};
// }) satisfies GetStaticPaths;

const Page: NextPage<INextProps> = async () => {
	return <h1>Hello World</h1>;
};

export default Page;
