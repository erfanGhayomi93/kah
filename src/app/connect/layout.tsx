import metadata from '@/metadata';

interface IRootLayout extends INextProps {
	children: React.ReactNode;
	params: {
		locale: string;
	};
}

const RootLayout = async ({ children }: IRootLayout) => {
	return (
		<html>
			<body>{children}</body>
		</html>
	);
};

export default RootLayout;

export { metadata };
