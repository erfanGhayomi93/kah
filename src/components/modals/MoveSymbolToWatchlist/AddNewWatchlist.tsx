import { PlusSquareSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import React from 'react';

interface AddNewWatchlistProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const AddNewWatchlist = (props: AddNewWatchlistProps) => {
	const t = useTranslations('manage_option_watchlist_modal');

	return (
		<div className='h-64 gap-8 border-t border-t-gray-200 pl-24 flex-items-center'>
			<button
				type='button'
				className='h-40 gap-8 pr-24 font-medium text-primary-100 flex-items-center'
				{...props}
			>
				<span className='size-16 rounded-sm text-current flex-justify-center'>
					<PlusSquareSVG width='1.6rem' height='1.6rem' />
				</span>
				{t('create_new_watchlist')}
			</button>
		</div>
	);
};

export default AddNewWatchlist;
