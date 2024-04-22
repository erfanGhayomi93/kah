'use client';

import Loading from '@/components/common/Loading';
import { RefreshSVG, XSVG } from '@/components/icons';
import { defaultOptionWatchlistColumns } from '@/constants';
import { useAppDispatch } from '@/features/hooks';
import { setOptionWatchlistColumns } from '@/features/slices/tableSlice';
import { useDebounce, useWatchlistColumns } from '@/hooks';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import styled from 'styled-components';

interface ContainerProps {
	close: () => void;
}

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

const Container = ({ close }: ContainerProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { setDebounce } = useDebounce();

	const { data: watchlistColumns, resetColumns, setHiddenColumn } = useWatchlistColumns();

	const [resetting, setResetting] = useState(false);

	const onRefresh = () => {
		try {
			setResetting(true);

			setDebounce(() => {
				dispatch(setOptionWatchlistColumns(defaultOptionWatchlistColumns));
				resetColumns().finally(() => setResetting(false));
			}, 500);
		} catch (e) {
			//
		}
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

	return (
		<>
			<div className='sticky top-0 z-10 h-56 w-full bg-gray-200 px-24 flex-justify-between'>
				<h1 className='text-xl font-medium text-gray-900'>{t('manage_option_watchlist_columns.title')}</h1>

				<div className='flex gap-24'>
					<button className='icon-hover' type='button' onClick={onRefresh}>
						<RefreshSVG width='2.4rem' height='2.4rem' />
					</button>
					<button className='icon-hover' type='button' onClick={close}>
						<XSVG width='2rem' height='2rem' />
					</button>
				</div>
			</div>

			<div className='relative h-full gap-16 overflow-auto px-32 flex-column'>
				{resetting && <Loading />}

				{Object.keys(categories).map((category, categoryIndex) => (
					<div
						key={category}
						className={cn(
							'gap-16 pb-16 flex-column',
							resetting && 'pointer-events-none opacity-0',
							categoryIndex < 2 && 'border-b border-b-gray-400',
						)}
					>
						<h2 className='text-lg font-medium text-gray-1000'>
							{t(`manage_option_watchlist_columns.${category}`)}
						</h2>

						<div className='flex-wrap gap-16 flex-justify-between'>
							{categories[category].map((column) => (
								<Button
									onClick={() => setHiddenColumn(column.id, !column.isHidden)}
									type='button'
									key={column.id}
									className={cn(
										column.isHidden
											? 'bg-white text-gray-900 shadow-sm hover:shadow-none hover:btn-hover'
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
		</>
	);
};

export default Container;
