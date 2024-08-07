'use client';

import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import Table from './Table';

const Strategy = () => {
	const t = useTranslations();

	return (
		<div className='flex-1 gap-16 rounded bg-white p-16 flex-column darkness:bg-gray-50'>
			<div className='h-64 rounded px-8 shadow-sm'>
				<div className='size-full flex-justify-between xl:w-1/4'>
					<span className='text-base text-gray-700'>{t('my_assets.total_value')}:</span>
					<div className='flex gap-8 text-base'>
						<span className='text-gray-700'>
							<span className='font-medium text-gray-800'>{sepNumbers(String(263e3))} </span>
							{t('common.rial')}
						</span>
					</div>
				</div>
			</div>

			<Table />
		</div>
	);
};

export default Strategy;
