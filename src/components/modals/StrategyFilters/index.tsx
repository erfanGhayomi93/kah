import { useAppDispatch } from '@/features/hooks';
import { setCoveredCallFiltersModal, setStrategyFiltersModal } from '@/features/slices/modalSlice';
import { type NStrategyFilter } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
import Modal, { Header } from '../Modal';

interface StrategyFiltersProps extends NStrategyFilter.IFilters {}

const StrategyFilters = forwardRef<HTMLDivElement, StrategyFiltersProps>(
	({ initialFilters, filters, onSubmit, ...props }, ref) => {
		const t = useTranslations('strategy_filters');

		const dispatch = useAppDispatch();

		const onCloseModal = () => {
			dispatch(setCoveredCallFiltersModal(null));
		};

		const submit = (e: React.FormEvent) => {
			e.preventDefault();

			try {
				onSubmit();
			} catch (e) {
				//
			} finally {
				dispatch(setStrategyFiltersModal(null));
			}
		};

		return (
			<Modal
				top='50%'
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				onClose={onCloseModal}
				ref={ref}
				{...props}
			>
				<div style={{ width: '70rem' }}>
					<Header label={t('title')} onClose={onCloseModal} />

					<form onSubmit={submit} className='bg-white p-24'>
						<ul className='gap-32 flex-column'></ul>

						<div className='flex-justify-end'>
							<button type='submit' className='w-1/2 rounded py-8 btn-primary'>
								{t('apply_filters')}
							</button>
						</div>
					</form>
				</div>
			</Modal>
		);
	},
);

export default StrategyFilters;
