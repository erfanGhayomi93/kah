import Loading from '@/components/common/Loading';
import { RefreshSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getManageOptionColumns, toggleManageOptionColumns } from '@/features/slices/uiSlice';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useDebounce, useWatchlistColumns } from '@/hooks';
import { createSelector } from '@reduxjs/toolkit';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ $enabled: number }>`
	position: fixed;
	width: 47.2rem;
	height: calc(100% - 11.6rem);
	top: 7.2rem;
	left: 0;
	gap: 1.6rem;
	display: flex;
	flex-direction: column;
	border-radius: 0 1.6rem 1.6rem 0;
	padding: 0 0 1.6rem 0;
	z-index: 9;
	box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.2);
	animation: ${({ $enabled }) =>
		`${$enabled ? 'left-to-right' : 'right-to-left'} ease-in-out ${
			$enabled ? '700ms' : '600ms'
		} 1 alternate forwards`};
`;

const Button = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 12rem;
	font-weight: 500;
	height: 4rem;
	border-radius: 0.8rem;
	transition:
		color 250ms,
		background-color 250ms;
	-webkit-transition:
		color 250ms,
		background-color 250ms;
	-moz-transition:
		color 250ms,
		background-color 250ms;
`;

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isEnable: getManageOptionColumns(state),
		isLoggedIn: getIsLoggedIn(state),
	}),
);

const ManageWatchlistColumns = () => {
	const controllerRef = useRef<AbortController | null>(null);

	const wrapperRef = useRef<HTMLDivElement>(null);

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { isEnable } = useAppSelector(getStates);

	const [rendered, setRendered] = useState(isEnable);

	const [resetting, setResetting] = useState(false);

	const { setDebounce } = useDebounce();

	const { data: watchlistColumns, resetColumns, setHiddenColumn } = useWatchlistColumns();

	const onClose = () => {
		abort();
		dispatch(toggleManageOptionColumns(false));
	};

	const onRefresh = () => {
		try {
			setResetting(true);

			setDebounce(() => {
				resetColumns().finally(() => setResetting(false));
			}, 500);
		} catch (e) {
			//
		}
	};

	const abort = () => {
		if (controllerRef.current) controllerRef.current.abort();
	};

	const onDocumentClick = (e: MouseEvent) => {
		const eTarget = e.target as HTMLDivElement;
		const eWrapper = wrapperRef.current;
		if (!eWrapper || !eTarget) return;

		if (eTarget.isEqualNode(eWrapper) || eWrapper.contains(eTarget)) return;

		onClose();
		abort();
	};

	const categories = useMemo(() => {
		const modifiedColumns: Record<string, Option.Column[]> = {};

		try {
			if (!watchlistColumns) throw new Error();

			for (let i = 0; i < watchlistColumns.length; i++) {
				const item = watchlistColumns[i];

				if (!(item.category in modifiedColumns)) modifiedColumns[item.category] = [];

				modifiedColumns[item.category].push(item);
			}

			return modifiedColumns;
		} catch (e) {
			return modifiedColumns;
		}
	}, [watchlistColumns]);

	useEffect(() => {
		const eWrapper = wrapperRef.current;
		if (!eWrapper || !isEnable) return;

		controllerRef.current = new AbortController();
		document.addEventListener('click', onDocumentClick, {
			signal: controllerRef.current.signal,
		});
	}, [wrapperRef.current, rendered]);

	useEffect(() => {
		let timer: NodeJS.Timeout | null = null;

		if (!isEnable) timer = setTimeout(() => setRendered(false), 600);
		else setRendered(true);

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [isEnable]);

	if (!rendered) return null;

	return (
		<Wrapper $enabled={Number(isEnable)} ref={wrapperRef} className='overflow-auto bg-white'>
			<div className='sticky top-0 z-10 w-full bg-white px-32 pt-16'>
				<div className='border-b border-b-gray-400 pb-16 flex-justify-between'>
					<h1 className='text-gray-1000 text-2xl font-bold'>{t('manage_option_watchlist_columns.title')}</h1>

					<div className='flex gap-24'>
						<button className='text-gray-1000' type='button' onClick={onRefresh}>
							<RefreshSVG width='2.4rem' height='2.4rem' />
						</button>
						<button className='text-gray-1000' type='button' onClick={onClose}>
							<XSVG width='1.6rem' height='1.6rem' />
						</button>
					</div>
				</div>
			</div>

			<div className='relative h-full gap-16 px-32 flex-column'>
				{resetting && <Loading />}

				{Object.keys(categories).map((category, categoryIndex) => (
					<div
						key={category}
						className={clsx(
							'gap-16 pb-16 flex-column',
							resetting && 'pointer-events-none opacity-0',
							categoryIndex < 2 && 'border-b border-b-gray-400',
						)}
					>
						<h2 className='text-gray-1000 text-lg font-medium'>
							{t(`manage_option_watchlist_columns.${category}`)}
						</h2>

						<div className='flex-wrap gap-16 flex-justify-between'>
							{categories[category].map((column) => (
								<Button
									onClick={() => setHiddenColumn(column.id, !column.isHidden)}
									type='button'
									key={column.id}
									className={clsx(
										column.isHidden
											? 'text-gray-900 hover:shadow-none bg-white shadow-sm hover:bg-primary-100'
											: 'bg-primary-400 text-white hover:bg-primary-300',
									)}
								>
									{t(`manage_option_watchlist_columns.column_${column.title}`)}
								</Button>
							))}

							{[
								...Array(
									(Math.floor(categories[category].length / 3) + (categories[category].length % 3)) *
										3 -
										categories[category].length,
								),
							].map((_, index) => (
								<div className='flex-1' key={index} />
							))}
						</div>
					</div>
				))}
			</div>
		</Wrapper>
	);
};

export default ManageWatchlistColumns;
