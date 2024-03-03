'use client';

import Panel from '@/components/common/Panel';
import { XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getSavedSaturnTemplates, toggleSavedSaturnTemplates } from '@/features/slices/uiSlice';
import { useTranslations } from 'next-intl';
import Templates from './Templates';

const SavedTemplates = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const isEnabled = useAppSelector(getSavedSaturnTemplates);

	const onClose = () => {
		dispatch(toggleSavedSaturnTemplates(false));
	};

	return (
		<Panel isEnable={isEnabled} onClose={onClose} width='42rem' height='calc(100dvh - 8rem)'>
			<div className='sticky top-0 z-10 h-56 w-full bg-gray-200 px-24 flex-justify-between'>
				<h1 className='text-xl font-medium text-gray-900'>{t('saved_saturn_templates.title')}</h1>

				<div className='flex gap-24'>
					<button className='icon-hover' type='button' onClick={onClose}>
						<XSVG width='2rem' height='2rem' />
					</button>
				</div>
			</div>

			<Templates />
		</Panel>
	);
};

export default SavedTemplates;
