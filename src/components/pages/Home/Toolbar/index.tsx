import { CheckListSVG, FileExcelSVG, FilterSVG, MoreOptionsSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleOptionFiltersModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';

const Toolbar = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const showOptionFilters = () => {
		dispatch(toggleOptionFiltersModal(true));
	};

	return (
		<div className='flex-justify-between'>
			<ul className='flex-shrink-0 flex-grow gap-8 flex-items-center'>
				<li>
					<button type='button' className='btn-primary-outline h-40 w-36 gap-8 rounded font-medium'>
						<MoreOptionsSVG width='2.4rem' height='2.4rem' />
					</button>
				</li>

				<li>
					<button type='button' className='h-40 gap-8 rounded px-16 font-medium btn-primary'>
						{t('option_page.market_overview')}
					</button>
				</li>
			</ul>

			<div className='flex flex-grow-0 gap-8'>
				<button onClick={showOptionFilters} type='button' className='btn-primary-outline h-40 gap-8 rounded px-16'>
					<FilterSVG width='2.4rem' height='2.4rem' />
					<span className='text-base font-medium'>{t('option_page.filter')}</span>
				</button>

				<button type='button' className='btn-primary-outline h-40 gap-8 rounded px-16'>
					<FileExcelSVG width='2.4rem' height='2.4rem' />
					<span className='text-base font-medium'>{t('option_page.export_excel')}</span>
				</button>

				<button type='button' className='btn-primary-outline h-40 w-44 rounded'>
					<CheckListSVG width='2.4rem' height='2.4rem' />
				</button>
			</div>
		</div>
	);
};

export default Toolbar;
