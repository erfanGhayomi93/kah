import metadata from '@/metadata';
import { getDirection } from '@/utils/helpers';

interface ILayout extends INextProps {
	children: React.ReactNode;
}

const Layout = async ({ children, params: { locale = 'fa' } }: ILayout) => {
	return (
		<html lang={locale} dir={getDirection(locale)}>
			<body>{children}</body>
		</html>
	);
};

export default Layout;

export { metadata };
