import Click from '@/components/common/Click';
import Checkbox from '@/components/common/Inputs/Checkbox';
import KeyDown from '@/components/common/KeyDown';
import { CheckSVG, DragSVG, EditSVG, EyeSlashSVG, EyeSVG, TrashSVG, XCircleSVG, XSVG } from '@/components/icons';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';

interface WatchlistProps extends Option.WatchlistList {
	checked: boolean;
	editing: boolean;
	hideCheckbox: boolean;
	cancelEdit: () => void;
	applyEdit: (n: string) => void;
	onEdit: () => void;
	onDelete: () => void;
	onToggleVisibility: () => void;
	onChange: (v: boolean) => void;
}

const Watchlist = ({
	isHidden,
	name,
	checked,
	editing,
	hideCheckbox,
	cancelEdit,
	applyEdit,
	onEdit,
	onDelete,
	onToggleVisibility,
	onChange,
}: WatchlistProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const [term, setTerm] = useState('');

	const onClear = () => {
		setTerm('');
		inputRef.current?.focus();
	};

	useEffect(() => setTerm(name), [editing]);

	return (
		<div className={clsx('gap-16 flex-justify-between', styles.watchlist)}>
			{editing ? (
				<KeyDown keys={['Escape']} onKeyDown={cancelEdit}>
					<Click onClickOutside={cancelEdit}>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								applyEdit(term);
							}}
							method='get'
							className='flex flex-1 overflow-hidden rounded'
						>
							<div className='h-48 flex-1 overflow-hidden rounded-r border border-l-0 flex-items-center input-group'>
								<input
									autoFocus
									ref={inputRef}
									type='text'
									className='flex-1 px-8 text-gray-800 darkness:text-white'
									value={term}
									onChange={(e) => setTerm(e.target.value)}
								/>
								{term.length > 1 && (
									<button
										type='button'
										onClick={onClear}
										className='size-24 rounded-circle text-gray-700 flex-justify-center'
									>
										<XCircleSVG width='1.6rem' height='1.6rem' />
									</button>
								)}
							</div>

							<button
								type='submit'
								disabled={!term.length}
								className='size-48 flex-justify-center btn-success'
							>
								<CheckSVG width='32px' height='32px' />
							</button>
						</form>
					</Click>
				</KeyDown>
			) : (
				<div className='flex-1 gap-8 flex-justify-start'>
					<Checkbox
						checked={checked}
						onChange={hideCheckbox ? undefined : onChange}
						classes={{
							root: clsx(styles.visibility, hideCheckbox && styles.hidden, checked && styles.active),
						}}
					/>

					<button type='button' className={clsx('drag-handler', styles.drag)}>
						<DragSVG />
					</button>

					<span className='text-base text-gray-800'>{name}</span>
				</div>
			)}

			<div className='gap-8 flex-justify-end'>
				{editing ? (
					<button onClick={cancelEdit} type='button' className={clsx('!text-error-100', styles.btn)}>
						<XSVG width='20px' height='20px' />
					</button>
				) : (
					<>
						<div onClick={onEdit} className={clsx(styles.btn, styles.visibility)}>
							<EditSVG width='18px' height='18px' />
						</div>

						<div onClick={onDelete} className={clsx(styles.btn, styles.visibility)}>
							<TrashSVG width='18px' height='18px' />
						</div>

						<div
							onClick={onToggleVisibility}
							className={clsx(styles.btn, styles.visibility, isHidden && styles.active)}
						>
							{isHidden ? (
								<EyeSlashSVG width='24px' height='24px' />
							) : (
								<EyeSVG width='24px' height='24px' />
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Watchlist;
