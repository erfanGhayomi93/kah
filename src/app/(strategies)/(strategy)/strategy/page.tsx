import Strategies from '@/components/pages/Strategies/List';
import StrategyLayout from '@/components/pages/Strategies/StrategyLayout';
import StrategiesToolbar from '@/components/pages/Strategies/Toolbar';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return (
		<StrategyLayout headerRenderer={<StrategiesToolbar />}>
			<div className='darkBlue:bg-gray-50 relative flex flex-1 flex-wrap content-start gap-y-8 rounded bg-white px-8 py-24 dark:bg-gray-50'>
				<Strategies />
			</div>
		</StrategyLayout>
	);
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('strategies'),
	});
};

export { generateMetadata };

export default Page;
