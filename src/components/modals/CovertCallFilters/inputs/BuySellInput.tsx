import { useTranslations } from 'next-intl';
import React from 'react';

const BuySellInput = () => {
	const t = useTranslations();

	return (
		<div className='flex gap-8 *:rounded *:px-64 *:py-8 *:btn-choose-outline'>
			<button type='button'>{t('CoveredCall.buy')}</button>
			<button type='button'>{t('CoveredCall.sell')}</button>
		</div>
	);
};

export default BuySellInput;
