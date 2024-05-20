import NoData from '@/components/common/NoData';
import StrategyLayout from '@/components/pages/Strategies/StrategyLayout';
import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';

const Page: NextPage<INextProps> = async () => {
	const t = useTranslations('build_strategy');

	return (
		<StrategyLayout isBuilding>
			<div className='relative flex flex-1 rounded bg-white px-8 py-24'>
				<div className='flex-1 rounded bg-white'>
					<div style={{ marginTop: '9.6rem' }}>
						<NoData text={t('no_data')} />
					</div>
				</div>
			</div>
		</StrategyLayout>
	);
};

export default Page;
