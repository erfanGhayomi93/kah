import React from 'react';
import BaseSymbolSearch from '../../inputs/BaseSymbolSearch';
import { useTranslations } from 'next-intl';
import BuySellInput from '../../inputs/BuySellInput';
import StatusInput from '../../inputs/StatusInput';

const Simple = () => {
	const t = useTranslations();

	return (
		<form onSubmit={() => {}} method='get' className='gap-32 pt-32 flex-column'>
			<BaseSymbolSearch values={[]} onChange={(values) => {}} />
			<ul className='gap-32 flex-column'>
				<li className=' flex-justify-between'>
					<span className='flex-1 font-medium text-gray-1000'>{t('نوع')}:</span>

					<BuySellInput />
				</li>
				<li className='h-40 flex-justify-between'>
					<span className='flex-1 font-medium text-gray-1000'>{t('وضعیت')}:</span>

					<StatusInput />
				</li>
			</ul>
			<div className='flex-justify-end'>
				<button className='w-1/2 rounded py-8 btn-primary'>{t('اعمال فیلتر')}</button>
			</div>
		</form>
	);
};

export default Simple;
