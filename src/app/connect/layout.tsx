import metadata from '@/metadata';

interface ILayout extends INextProps {
	children: React.ReactNode;
	params: {
		locale: string;
	};
}

const Layout = async ({ children }: ILayout) => {
	return (
		<html>
			<body>{children}</body>
		</html>
	);
};

export default Layout;

export { metadata };
