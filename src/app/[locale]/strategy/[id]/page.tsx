export const dynamicParams = false;

export async function generateStaticParams() {
	return [{ id: '1' }, { id: '2' }, { id: '3' }];
	// try {
	// 	const response = await fetch(routes.strategy.GetAll);
	// 	const { result } = (await response.json()) as ServerResponse<Strategy.GetAll[]>;

	// 	return result.map((item) => ({
	// 		slug: String(item.id),
	// 	}));
	// } catch (e) {
	// 	return [];
	// }
}

export default function Page({ params }: { params: { id: string } }) {
	const { id } = params;
	return <h1>Hello {id}</h1>;
}
