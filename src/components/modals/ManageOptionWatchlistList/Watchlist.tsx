import { DragSVG, EditSVG, EyeSVG, EyeSlashSVG, TrashSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useState } from 'react';

interface WatchlistProps {
	watchlist: Option.WatchlistList;
	top: number;
	isEditing: boolean;
	isActive: boolean;
	onEditStart: () => void;
	onEditCancel: () => void;
	onDelete: () => void;
	onVisibilityChange: () => void;
	onEditEnd: (name: string) => void;
}

const Watchlist = ({
	top,
	watchlist,
	isActive,
	isEditing,
	onEditStart,
	onEditEnd,
	onEditCancel,
	onDelete,
	onVisibilityChange,
}: WatchlistProps) => {
	const t = useTranslations();

	const [isDeleting, setIsDeleting] = useState(false);

	const [name, setName] = useState('');

	useLayoutEffect(() => {
		setName('');
	}, [isEditing]);

	return (
		<li
			style={{ top: `${top}rem`, transition: 'top 250ms ease-in-out' }}
			className='absolute left-0 h-48 w-full px-24'
		>
			<div className='flex items-center'>
				<button type='button' className='h-16 w-24 flex-grow-0 text-gray-700 flex-justify-start'>
					<DragSVG width='1.6rem' height='1.6rem' />
				</button>

				{isEditing ? (
					<div className='h-48 flex-1 gap-8 rounded border border-primary-300 px-16 transition-colors flex-justify-start'>
						<input
							autoFocus
							type='text'
							className='h-full bg-transparent'
							placeholder={t('manage_option_watchlist_modal.new_watchlist_name')}
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
				) : (
					<div
						className={clsx(
							'h-48 flex-1 gap-8 rounded border px-16 transition-colors flex-justify-start',
							isActive
								? 'border-primary-400 bg-primary-400 hover:bg-primary-300'
								: 'border-gray-500 bg-gray-200 transition-colors hover:bg-primary-100',
						)}
					>
						<button
							onClick={onVisibilityChange}
							type='button'
							className={isActive ? 'text-white' : 'text-gray-900'}
						>
							{watchlist.isHidden ? (
								<EyeSlashSVG width='2rem' height='2rem' />
							) : (
								<EyeSVG width='2rem' height='2rem' />
							)}
						</button>
						<h3
							className={clsx(
								'select-none truncate text-base',
								isActive ? 'text-white' : 'text-gray-900',
							)}
						>
							{watchlist.name}
						</h3>
					</div>
				)}

				{isEditing && (
					<div style={{ flex: '0 0 9.6rem' }} className='gap-16 pr-16 flex-justify-end'>
						<button onClick={onEditCancel} type='button' className='text-gray-800 flex-justify-center'>
							{t('common.cancel')}
						</button>

						<button
							onClick={() => onEditEnd(name)}
							type='button'
							className='font-medium text-primary-400 flex-justify-center'
						>
							{t('common.register')}
						</button>
					</div>
				)}

				{isDeleting && (
					<div style={{ flex: '0 0 9.6rem' }} className='gap-16 pr-16 flex-justify-end'>
						<button
							onClick={() => setIsDeleting(false)}
							type='button'
							className='text-gray-800 flex-justify-center'
						>
							{t('common.cancel')}
						</button>

						<button
							onClick={onDelete}
							type='button'
							className='font-medium text-error-200 flex-justify-center'
						>
							{t('common.delete')}
						</button>
					</div>
				)}

				{!isDeleting && !isEditing && (
					<div style={{ flex: '0 0 9.6rem' }} className='gap-16 pr-16 flex-justify-end'>
						<button onClick={onEditStart} type='button' className='text-gray-1000 flex-justify-center'>
							<EditSVG width='2rem' height='2rem' />
						</button>

						<button
							onClick={() => setIsDeleting(true)}
							type='button'
							className='text-gray-1000 flex-justify-center'
						>
							<TrashSVG width='2rem' height='2rem' />
						</button>
					</div>
				)}
			</div>
		</li>
	);
};

export default Watchlist;
