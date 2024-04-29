import metadata from '@/metadata';
import { getDirection } from '@/utils/helpers';

interface ILayout extends INextProps {}

const Layout = async ({ children, params: { locale = 'fa' } }: ILayout) => {
	return (
		<html lang={locale} dir={getDirection(locale)}>
			<body>{children}</body>
		</html>
	);
};

export default Layout;

export { metadata };
