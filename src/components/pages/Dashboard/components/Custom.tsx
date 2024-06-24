import { initialDashboardLayout } from '@/constants';
import { useAppDispatch } from '@/features/hooks';
import { setManageColumnsModal } from '@/features/slices/modalSlice';
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

	const dispatch = useAppDispatch();

	const openDashboardLayoutManager = () => {
		dispatch(
			setManageColumnsModal({
				columns: initialDashboardLayout,
				title: t('manage_layout'),
				initialColumns: initialDashboardLayout,
				stream: false,
				onColumnChanged: console.log,
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
