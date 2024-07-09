import Click from '@/components/common/Click';
import Checkbox from '@/components/common/Inputs/Checkbox';
import KeyDown from '@/components/common/KeyDown';
import { DragSVG, EditSVG, EyeSVG, EyeSlashSVG, TrashSVG } from '@/components/icons';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect, useState, type LiHTMLAttributes } from 'react';

interface WatchlistProps extends LiHTMLAttributes<HTMLLIElement> {
	watchlist: Option.WatchlistList;
	isEditing: boolean;
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
	watchlist,
	isEditing,
	checked,
	onEditStart,
	onSelect,
	onEditEnd,
	onEditCancel,
	onDelete,
	onChecked,
	onVisibilityChange,
	...props
}: WatchlistProps) => {
	const t = useTranslations();

	const [isDeleting, setIsDeleting] = useState(false);

	const [name, setName] = useState('');

	const onKeyDown = (key: string) => {
		if (isDeleting) {
			if (key === 'Escape') {
				setIsDeleting(false);
			} else if (key === 'Enter') {
				onDeleteWatchlist();
			}

			return;
		}

		if (isEditing) {
			if (key === 'Escape') {
				onEditCancel();
			} else if (key === 'Enter') {
				onEditEnd(name);
			}

			return;
		}
	};

	const onDeleteWatchlist = () => {
		onDelete();
		setIsDeleting(false);
	};

	useEffect(() => {
		setName('');
	}, [isEditing]);

	useEffect(() => {
		setIsDeleting(false);
		onEditCancel();
	}, [checked === undefined]);

	const hasNotCheckbox = checked === undefined;

	const isActive = !watchlist.isHidden;

	return (
		<li {...props}>
			<Click enabled={isEditing} onClickOutside={onEditCancel}>
				<div className='flex items-center'>
					<div className='w-28'>
						{hasNotCheckbox ? (
							<button type='button' className='h-16 grow-0 text-light-gray-200 flex-justify-start'>
								<DragSVG width='2.4rem' height='2.4rem' />
							</button>
						) : (
							<Checkbox
								checked={Boolean(checked)}
								onChange={onChecked}
								classes={{
									checkbox: '!size-20 focus:!border-light-error-100 hover:!border-light-error-100',
									checked: '!bg-light-error-100 !border-light-error-100',
								}}
							/>
						)}
					</div>

					{hasNotCheckbox && isEditing ? (
						<div className='h-48 flex-1 gap-8 rounded border border-light-primary-100 px-16 transition-colors flex-justify-start'>
							<input
								autoFocus
								type='text'
								maxLength={36}
								className='h-full flex-1 bg-transparent'
								placeholder={t('manage_option_watchlist_modal.new_watchlist_name')}
								value={name}
								onChange={(e) => {
									const { value } = e.target;
									if (value.length <= 36) setName(value);
								}}
							/>
						</div>
					) : (
						<div
							onClick={(e) => {
								e.stopPropagation();
								onVisibilityChange();
							}}
							className='h-48 flex-1 cursor-pointer gap-8 overflow-hidden rounded border border-light-gray-200 bg-light-gray-100 px-16 transition-colors flex-justify-start hover:btn-hover'
						>
							<button type='button' className={isActive ? 'text-light-gray-800' : 'text-light-gray-500'}>
								{watchlist.isHidden ? (
									<EyeSlashSVG width='2rem' height='2rem' />
								) : (
									<EyeSVG width='2rem' height='2rem' />
								)}
							</button>
							<h3
								className={cn(
									'truncate text-base',
									isActive ? 'text-light-gray-800' : 'text-light-gray-500',
								)}
							>
								{watchlist.name}
							</h3>
						</div>
					)}

					<KeyDown
						enabled={isEditing || isDeleting}
						dependencies={[name]}
						keys={['Enter', 'Escape']}
						onKeyDown={onKeyDown}
					>
						<div style={{ flex: '0 0 10.4rem' }} className='gap-16 pr-16 flex-justify-end'>
							{hasNotCheckbox &&
								isEditing &&
								!isDeleting && [
									<button
										key='cancel-edit'
										onClick={onEditCancel}
										type='button'
										className='text-light-gray-700 flex-justify-center'
									>
										{t('common.cancel')}
									</button>,
									<button
										key='edit'
										onClick={() => onEditEnd(name)}
										disabled={name.length === 0}
										type='button'
										className='font-medium text-light-primary-100 flex-justify-center disabled:opacity-50'
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
										className='text-light-gray-700 flex-justify-center'
									>
										{t('common.cancel')}
									</button>,

									<button
										key='delete'
										onClick={onDeleteWatchlist}
										type='button'
										className='font-medium text-light-error-100 flex-justify-center'
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
										className='text-light-gray-800 flex-justify-center'
									>
										<EditSVG width='2rem' height='2rem' />
									</button>,

									<button
										key='delete-req'
										onClick={() => setIsDeleting(true)}
										type='button'
										className='text-light-gray-800 flex-justify-center'
									>
										<TrashSVG width='2rem' height='2rem' />
									</button>,
								]}
						</div>
					</KeyDown>
				</div>
			</Click>
		</li>
	);
};

export default Watchlist;
