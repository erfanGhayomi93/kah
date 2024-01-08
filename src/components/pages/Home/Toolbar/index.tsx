import { CheckListSVG, FileExcelSVG, FilterSVG, ManageSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleOptionFiltersModal } from '@/features/slices/modalSlice';
import { toggleManageOptionColumns } from '@/features/slices/uiSlice';
import { useTranslations } from 'next-intl';

const Toolbar = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const showWatchlistFilters = () => {
		dispatch(toggleOptionFiltersModal(true));
	};

	const showWatchlistColumnsManager = () => {
		dispatch(toggleManageOptionColumns(true));
	};

	return (
		<div className='flex-justify-between'>
			<ul className='flex-shrink-0 flex-grow gap-8 flex-items-center'>
				<li>
					<button type='button' className='h-40 gap-8 rounded px-16 font-medium btn-primary'>
						{t('option_page.market_overview')}
					</button>
				</li>

				<li>
					<button type='button' className='h-40 w-36 gap-8 rounded font-medium btn-primary-outline'>
						<ManageSVG width='2.4rem' height='2.4rem' />
					</button>
				</li>
			</ul>

			<div className='flex flex-grow-0 gap-8'>
				<button onClick={showWatchlistFilters} type='button' className='h-40 gap-8 rounded px-16 btn-primary-outline'>
					<FilterSVG width='2.4rem' height='2.4rem' />
					<span className='text-base font-medium'>{t('option_page.filter')}</span>
				</button>

				<button type='button' className='h-40 gap-8 rounded px-16 btn-primary-outline'>
					<FileExcelSVG width='2.4rem' height='2.4rem' />
					<span className='text-base font-medium'>{t('option_page.export_excel')}</span>
				</button>

				<button onClick={showWatchlistColumnsManager} type='button' className='h-40 w-44 rounded btn-primary-outline'>
					<CheckListSVG width='2.4rem' height='2.4rem' />
				</button>
			</div>
		</div>
	);
};

export default Toolbar;
