import { initialDashboardLayout } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setManageColumnsModal } from '@/features/slices/modalSlice';
import { getDashboardGridLayout, setDashboardGridLayout } from '@/features/slices/uiSlice';
import { useTranslations } from 'next-intl';

const Plus = () => (
	<svg width='12.4rem' height='12.4rem' viewBox='0 0 124 124' fill='none' xmlns='http://www.w3.org/2000/svg'>
		<rect
			x='0.5'
			y='0.5'
			width='123'
			height='123'
			rx='15.5'
			fill='white'
			stroke='currentColor'
			strokeDasharray='17 17'
		/>
		<path d='M62 50L62 74' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
		<path d='M74 62L50 62' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
	</svg>
);

const Custom = () => {
	const t = useTranslations('home');

	const gridLayout = useAppSelector(getDashboardGridLayout);

	const dispatch = useAppDispatch();

	const getSectionVisibilities = () => {
		const result: Partial<Record<TDashboardSections, boolean>> = {};

		try {
			for (let i = 0; i < gridLayout.length; i++) {
				const item = gridLayout[i];
				result[item.id] = item.hidden;
			}
		} catch (e) {
			//
		}

		return result;
	};

	const onColumnChanged = (cols: Array<IManageColumn<TDashboardSections>>) => {
		try {
			const result: Partial<Record<TDashboardSections, boolean>> = {};

			for (let i = 0; i < cols.length; i++) {
				const col = cols[i];
				result[col.id] = col.hidden;
			}

			dispatch(
				setDashboardGridLayout(
					gridLayout.map((s) => ({
						...s,
						hidden: result[s.id] ?? false,
					})),
				),
			);
		} catch (e) {
			//
		}
	};

	const openDashboardLayoutManager = () => {
		const columnsVisibility = getSectionVisibilities();
		const columns = initialDashboardLayout.map((col) => ({
			...col,
			hidden: columnsVisibility[col.id] ?? false,
		}));

		dispatch(
			setManageColumnsModal({
				columns,
				title: t('manage_layout'),
				initialColumns: initialDashboardLayout,
				stream: false,
				onColumnChanged: (cols) => onColumnChanged(cols as Array<IManageColumn<TDashboardSections>>),
			}),
		);
	};

	return (
		<div className='size-full rounded bg-white px-8 pb-16 pt-8 flex-justify-center'>
			<button
				type='button'
				onClick={openDashboardLayoutManager}
				style={{ width: '12.4rem', height: '12.4rem' }}
				className='rounded text-light-gray-700 flex-justify-center'
			>
				<Plus />
			</button>
		</div>
	);
};

export default Custom;
