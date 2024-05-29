import '@/assets/styles/app.scss';
import '@/assets/styles/libs.scss';
import Providers from '@/components/common/Providers';
import Wrapper from '@/components/layout/Wrapper';
import { getDirection } from '@/utils/helpers';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import metadata from '../metadata';

const Modals = dynamic(() => import('@/components/modals/Modals'));

const Panels = dynamic(() => import('@/components/panels/Panels'));

interface ILayout extends INextProps {}

const Layout = async ({ children }: ILayout) => {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} dir={getDirection(locale)}>
			<body>
				<NextIntlClientProvider messages={messages}>
					<Providers>
						<Wrapper>{children}</Wrapper>
						<Modals />
						<Panels />
					</Providers>
				</NextIntlClientProvider>

				<div id='__tooltip' />

				{typeof process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID === 'string' && (
					<Script id='clarity-script' strategy='afterInteractive'>
						{`!function(e,t,n,s,c,r,a){e[n]=e[n]||function(){(e[n].q=e[n].q||[]).push(arguments)},(r=t.createElement(s)).async=1,r.src="https://www.clarity.ms/tag/"+c,(a=t.getElementsByTagName(s)[0]).parentNode.insertBefore(r,a)}(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");`}
					</Script>
				)}
			</body>
		</html>
	);
};

export { metadata };

export default Layout;
