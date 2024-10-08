import { PlusSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import React from 'react';

interface AddNewWatchlistProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const AddNewWatchlist = (props: AddNewWatchlistProps) => {
	const t = useTranslations('move_symbol_to_watchlist');

	return (
		<div className='p-24 flex-items-center'>
			<button
				type='button'
				className='h-48 flex-1 gap-8 font-medium text-primary-100 flex-justify-center'
				{...props}
			>
				<PlusSVG width='1.8rem' height='1.8rem' />
				{t('add_to_new_watchlist')}
			</button>
		</div>
	);
};

export default AddNewWatchlist;
