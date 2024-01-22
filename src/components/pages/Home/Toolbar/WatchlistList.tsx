import { MoreOptionsSVG, PlusSVG } from '@/components/icons';
import { useDebounce } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

const WatchlistList = () => {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const { setDebounce } = useDebounce();

	const onReloadMArketView = () => {
		setDebounce(() => {
			queryClient.refetchQueries({
				queryKey: ['optionWatchlistQuery'],
				type: 'active',
				exact: false,
			});
		}, 300);
	};

	const onAddNewWatchlist = () => {
		//
	};

	return (
		<ul className='flex-shrink-0 flex-grow gap-8 flex-items-center'>
			<li>
				<button
					onClick={onReloadMArketView}
					type='button'
					className='h-40 gap-8 rounded px-16 font-medium btn-primary'
				>
					{t('option_page.market_overview')}
				</button>
			</li>

			<li>
				<button
					type='button'
					className='size-40 gap-8 rounded font-medium btn-primary-outline'
					onClick={onAddNewWatchlist}
				>
					<PlusSVG width='2.4rem' height='2.4rem' />
				</button>
			</li>

			<li>
				<button type='button' className='size-40 gap-8 rounded font-medium btn-primary-outline'>
					<MoreOptionsSVG width='2.4rem' height='2.4rem' />
				</button>
			</li>
		</ul>
	);
};

export default WatchlistList;
