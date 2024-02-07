'use client';

import { XSVG } from '@/components/icons';
import Panel from '@/components/panels/Panel';
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
		<Panel isEnable={isEnabled} onClose={onClose} width='42rem' height='calc(100vh - 8rem)'>
			<div className='sticky top-0 z-10 w-full bg-white px-24 pt-16'>
				<div className='border-b border-b-gray-400 pb-16 flex-justify-between'>
					<h1 className='text-2xl font-bold text-gray-1000'>{t('saved_saturn_templates.title')}</h1>

					<div className='flex gap-24'>
						<button className='icon-hover' type='button' onClick={onClose}>
							<XSVG width='1.6rem' height='1.6rem' />
						</button>
					</div>
				</div>
			</div>

			<Templates />
		</Panel>
	);
};

export default SavedTemplates;
