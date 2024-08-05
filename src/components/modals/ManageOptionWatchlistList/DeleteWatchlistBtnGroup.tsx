import { useTranslations } from 'next-intl';

interface DeleteWatchlistBtnGroupProps {
	count: number;
	onCancel: () => void;
	onDelete: () => void;
}

const DeleteWatchlistBtnGroup = ({ count, onCancel, onDelete }: DeleteWatchlistBtnGroupProps) => {
	const t = useTranslations();

	return (
		<div className='flex gap-8 p-24 *:h-48 *:rounded *:font-medium'>
			<button type='button' onClick={onCancel} className='px-40 btn-disabled-outline'>
				{t('common.cancel')}
			</button>
			<button type='button' onClick={onDelete} className='flex-1 btn-error'>
				{t('manage_option_watchlist_modal.delete_selected_watchlists', { n: count })}
			</button>
		</div>
	);
};

export default DeleteWatchlistBtnGroup;
