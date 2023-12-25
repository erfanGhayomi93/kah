import { CheckListSVG, FileExcelSVG, FilterSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';

const Toolbar = () => {
	const t = useTranslations();

	return (
		<div className='flex-justify-between'>
			<div className='flex-shrink-0 flex-grow' />

			<div className='flex flex-grow-0 gap-8'>
				<button type='button' className='btn-primary-outline h-40 gap-8 rounded px-16'>
					<FilterSVG width='2.4rem' height='2.4rem' />
					<span className='text-base font-medium'>{t('option_page.filter')}</span>
				</button>

				<button type='button' className='btn-primary-outline h-40 gap-8 rounded px-16'>
					<FileExcelSVG width='2.4rem' height='2.4rem' />
					<span className='text-base font-medium'>{t('option_page.export_excel')}</span>
				</button>

				<button type='button' className='w-44 btn-primary-outline h-40 rounded'>
					<CheckListSVG width='2.4rem' height='2.4rem' />
				</button>
			</div>
		</div>
	);
};

export default Toolbar;
