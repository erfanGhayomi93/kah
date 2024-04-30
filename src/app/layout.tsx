import metadata from '@/metadata';
import { getDirection } from '@/utils/helpers';
import Script from 'next/script';

interface ILayout extends INextProps {
	children: React.ReactNode;
}

const Layout = async ({ children, params: { locale = 'fa' } }: ILayout) => {
	return (
		<html lang={locale} dir={getDirection(locale)}>
			<body>
				{children}

				{typeof process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID === 'string' && (
					<Script id='clarity-script' strategy='afterInteractive'>
						{`!function(e,t,n,s,c,r,a){e[n]=e[n]||function(){(e[n].q=e[n].q||[]).push(arguments)},(r=t.createElement(s)).async=1,r.src="https://www.clarity.ms/tag/"+c,(a=t.getElementsByTagName(s)[0]).parentNode.insertBefore(r,a)}(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");`}
					</Script>
				)}
			</body>
		</html>
	);
};

export default Layout;

export { metadata };
