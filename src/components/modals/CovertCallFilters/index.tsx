import React, { forwardRef, useMemo } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import { useTranslations } from 'next-intl';
import { useAppDispatch } from '@/features/hooks';
import { setCoveredCallFilters } from '@/features/slices/modalSlice';
import Header from './components/Header';
import Tabs from '@/components/common/Tabs/Tabs';
import Simple from './tabs/Simple';
import { cn } from '@/utils/helpers';

const Div = styled.div`
	width: 600px;
	border-radius: 16px;
`;

interface ICovertCallFilters extends IBaseModalConfiguration {}

const CoveredCallFilters = forwardRef<HTMLDivElement, ICovertCallFilters>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setCoveredCallFilters(null));
	};

	const TABS = useMemo(
		() => [
			{
				id: 'normal',
				title: t('CoveredCall.simple_filters'),
				render: () => <Simple />,
			},
			{
				id: 'strategy',
				title: t('CoveredCall.conditional_filters'),
				render: null,
				disabled: true,
			},
		],
		[],
	);

	return (
		<Modal onClose={onCloseModal} {...props} ref={ref}>
			<Div>
				<Header onCloseClick={onCloseModal} onEraserClick={() => {}} />
				<div className='bg-white p-24'>
					<Tabs
						data={TABS}
						defaultActiveTab='normal'
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
			</Div>
		</Modal>
	);
});

export default CoveredCallFilters;
