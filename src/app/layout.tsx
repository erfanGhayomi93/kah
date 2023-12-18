import '@/assets/styles/app.scss';
import ReduxToolkitRegistry from '@/components/common/ReduxToolkitRegistry';
import StyledComponentsRegistry from '@/components/common/StyledComponentsRegistry';
import Wrapper from '@/components/layout/Wrapper';
import { getDirection } from '@/utils/helpers';
import metadata from '../metadata';

interface IRootLayout extends INextProps {
	children: React.ReactNode;
}

const RootLayout = async ({ children }: IRootLayout) => {
	return (
		<html lang='fa' dir={getDirection('fa')}>
			<body>
				<StyledComponentsRegistry>
					<ReduxToolkitRegistry>
						<Wrapper>{children}</Wrapper>
					</ReduxToolkitRegistry>
				</StyledComponentsRegistry>

				<div id='__tooltip' />
			</body>
		</html>
	);
};

export default RootLayout;

export { metadata };
