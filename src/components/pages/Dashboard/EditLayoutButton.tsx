import { EditFillSVG } from '@/components/icons';
import { initialDashboardLayout } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setManageColumnsModal } from '@/features/slices/modalSlice';
import { getDashboardGridLayout, setDashboardGridLayout } from '@/features/slices/uiSlice';
import { useTranslations } from 'next-intl';

const EditLayoutButton = () => {
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
		<div style={{ left: '0.8rem', bottom: '4.8rem' }} className='fixed left-8'>
			<button onClick={openDashboardLayoutManager} type='button' className='z-10 size-40 rounded btn-primary'>
				<EditFillSVG width='2rem' height='2rem' />
			</button>
		</div>
	);
};

export default EditLayoutButton;
