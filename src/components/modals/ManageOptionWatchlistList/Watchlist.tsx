import Checkbox from '@/components/common/Inputs/Checkbox';
import OutsidePointerDetector from '@/components/common/OutsidePointerDetector';
import { DragSVG, EditSVG, EyeSVG, EyeSlashSVG, TrashSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useState } from 'react';

interface WatchlistProps {
	watchlist: Option.WatchlistList;
	top: number;
	isEditing: boolean;
	isActive: boolean;
	checked: boolean | undefined;
	onSelect: () => void;
	onEditStart: () => void;
	onEditCancel: () => void;
	onDelete: () => void;
	onChecked: (checked: boolean) => void;
	onVisibilityChange: () => void;
	onEditEnd: (name: string) => void;
}

const Watchlist = ({
	top,
	watchlist,
	isActive,
	isEditing,
	checked,
	onEditStart,
	onSelect,
	onEditEnd,
	onEditCancel,
	onDelete,
	onChecked,
	onVisibilityChange,
}: WatchlistProps) => {
	const t = useTranslations();

	const [isDeleting, setIsDeleting] = useState(false);

	const [name, setName] = useState('');

	useLayoutEffect(() => {
		setName('');
	}, [isEditing]);

	useLayoutEffect(() => {
		setIsDeleting(false);
		onEditCancel();
	}, [checked === undefined]);

	const hasNotCheckbox = checked === undefined;

	return (
		<li
			style={{ top: `${top}rem`, transition: 'top 250ms ease-in-out' }}
			className='absolute left-0 h-48 w-full px-24'
		>
			<OutsidePointerDetector enabled={isEditing} onClickOutside={onEditCancel}>
				<div className='flex items-center'>
					<div className='w-28'>
						{hasNotCheckbox ? (
							<button type='button' className='h-16 flex-grow-0 text-gray-600 flex-justify-start'>
								<DragSVG width='2.4rem' height='2.4rem' />
							</button>
						) : (
							<Checkbox
								checked={checked}
								onChange={onChecked}
								classes={{
									checkbox: '!size-20 focus:!border-error-100 hover:!border-error-100',
									checked: '!bg-error-100 !border-error-100',
								}}
							/>
						)}
					</div>

					{hasNotCheckbox && isEditing ? (
						<div className='h-48 flex-1 gap-8 rounded border border-primary-300 px-16 transition-colors flex-justify-start'>
							<input
								autoFocus
								type='text'
								className='h-full flex-1 bg-transparent'
								placeholder={t('manage_option_watchlist_modal.new_watchlist_name')}
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
					) : (
						<div
							onClick={onSelect}
							className={clsx(
								'h-48 flex-1 cursor-pointer gap-8 rounded border px-16 transition-colors flex-justify-start',
								isActive
									? 'border-primary-400 bg-primary-400 hover:bg-primary-300'
									: 'border-gray-500 bg-gray-200 transition-colors hover:bg-primary-100',
							)}
						>
							<button
								onClick={(e) => {
									e.stopPropagation();
									onVisibilityChange();
								}}
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

					<div style={{ flex: '0 0 10.4rem' }} className='gap-16 pr-16 flex-justify-end'>
						{hasNotCheckbox &&
							isEditing &&
							!isDeleting && [
								<button
									key='cancel-edit'
									onClick={onEditCancel}
									type='button'
									className='text-gray-800 flex-justify-center'
								>
									{t('common.cancel')}
								</button>,
								<button
									key='edit'
									onClick={() => onEditEnd(name)}
									type='button'
									className='font-medium text-primary-400 flex-justify-center'
								>
									{t('common.register')}
								</button>,
							]}

						{hasNotCheckbox &&
							!isEditing &&
							isDeleting && [
								<button
									key='cancel-delete'
									onClick={() => setIsDeleting(false)}
									type='button'
									className='text-gray-800 flex-justify-center'
								>
									{t('common.cancel')}
								</button>,

								<button
									key='delete'
									onClick={onDelete}
									type='button'
									className='font-medium text-error-200 flex-justify-center'
								>
									{t('common.delete')}
								</button>,
							]}

						{hasNotCheckbox &&
							!isDeleting &&
							!isEditing && [
								<button
									key='edit-req'
									onClick={onEditStart}
									type='button'
									className='text-gray-1000 flex-justify-center'
								>
									<EditSVG width='2rem' height='2rem' />
								</button>,

								<button
									key='delete-req'
									onClick={() => setIsDeleting(true)}
									type='button'
									className='text-gray-1000 flex-justify-center'
								>
									<TrashSVG width='2rem' height='2rem' />
								</button>,
							]}
					</div>
				</div>
			</OutsidePointerDetector>
		</li>
	);
};

export default Watchlist;
