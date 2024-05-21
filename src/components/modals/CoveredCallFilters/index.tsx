import Tabs from '@/components/common/Tabs/Tabs';
import { useAppDispatch } from '@/features/hooks';
import { setCoveredCallFiltersModal } from '@/features/slices/modalSlice';
import { type ICavertCallFiltersModal } from '@/features/slices/types/modalSlice.interfaces';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { forwardRef, useMemo } from 'react';
import Modal, { Header } from '../Modal';
import SimpleFilter from './Tabs/SimpleFilter';

interface CoveredCallFiltersProps extends ICavertCallFiltersModal {}

const CoveredCallFilters = forwardRef<HTMLDivElement, CoveredCallFiltersProps>(
	({ initialFilters, onSubmit, ...props }, ref) => {
		const t = useTranslations('strategy_filters');

		const dispatch = useAppDispatch();

		const onCloseModal = () => {
			dispatch(setCoveredCallFiltersModal(null));
		};

		const onClear = () => {
			//
		};

		const TABS = useMemo(
			() => [
				{
					id: 'simple',
					title: t('simple_filters'),
					render: () => <SimpleFilter />,
				},
				{
					id: 'conditional',
					title: t('conditional_filters'),
					render: null,
					disabled: true,
				},
			],
			[],
		);

		return (
			<Modal
				top='50%'
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				onClose={onCloseModal}
				ref={ref}
				{...props}
			>
				<div style={{ width: '70rem' }}>
					<Header label={t('title')} onClose={onCloseModal} onClear={onClear} />

					<div className='bg-white p-24'>
						<Tabs
							data={TABS}
							defaultActiveTab='simple'
							renderTab={(item, activeTab) => (
								<button
									className={cn(
										'flex-1 p-8 transition-colors',
										item.id === activeTab ? 'font-medium text-gray-900' : 'text-gray-700',
									)}
									type='button'
									disabled={item?.disabled}
								>
									{item.title}
								</button>
							)}
						/>
					</div>
				</div>
			</Modal>
		);
	},
);

export default CoveredCallFilters;
