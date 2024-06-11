import BuildStrategy from '@/components/pages/Strategies/BuildStrategy';
import StrategyLayout from '@/components/pages/Strategies/StrategyLayout';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => (
	<StrategyLayout isBuilding>
		<BuildStrategy />
	</StrategyLayout>
);

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('build_strategy'),
	});
};

export { generateMetadata };

export default Page;
