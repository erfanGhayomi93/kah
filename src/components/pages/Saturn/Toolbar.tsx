import { BookmarkSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSavedTemplatesPanel } from '@/features/slices/panelSlice';
import { useTranslations } from 'next-intl';

interface ToolbarProps {
	saveTemplate: () => void;
}

const Toolbar = ({ saveTemplate }: ToolbarProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const openSavedTemplates = () => {
		dispatch(setSavedTemplatesPanel(true));
	};

	return (
		<div className='pl-8'>
			<div className='darkBlue:bg-gray-50 h-56 w-full gap-8 overflow-hidden rounded border border-gray-200 bg-white px-16 flex-justify-end dark:bg-gray-50'>
				<button onClick={saveTemplate} type='button' className='h-40 rounded px-32 btn-primary'>
					{t('common.save')}
				</button>
				<button
					type='button'
					className='darkBlue:bg-gray-50 size-40 rounded border border-gray-200 bg-white text-primary-100 transition-colors flex-justify-center btn-primary-hover dark:bg-gray-50'
					onClick={openSavedTemplates}
				>
					<BookmarkSVG />
				</button>
			</div>
		</div>
	);
};

export default Toolbar;
