import { MoreOptionsSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';

const WatchlistList = () => {
	const t = useTranslations();
	return (
		<ul className='flex-shrink-0 flex-grow gap-8 flex-items-center'>
			<li>
				<button type='button' className='h-40 gap-8 rounded px-16 font-medium btn-primary'>
					{t('option_page.market_overview')}
				</button>
			</li>

			<li>
				<button type='button' className='h-40 w-36 gap-8 rounded font-medium btn-primary-outline'>
					<MoreOptionsSVG width='2.4rem' height='2.4rem' />
				</button>
			</li>
		</ul>
	);
};

export default WatchlistList;
