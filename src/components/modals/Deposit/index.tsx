import { useAppDispatch } from '@/features/hooks';
import { setDepositModal } from '@/features/slices/modalSlice';
import { type IDepositModal } from '@/features/slices/types/modalSlice.interfaces';
import { useInputs } from '@/hooks';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
import Modal, { Header } from '../Modal';
import { Body } from './Body';
import { HistoryDeposit } from './History';

interface DepositProps extends IDepositModal {}

const Deposit = forwardRef<HTMLDivElement, DepositProps>((props, ref) => {
	const t = useTranslations();

	const { data, activeTab } = props || {};

	const { inputs, setFieldValue } = useInputs<{ isExpand: boolean; activeTab: Payment.TDepositTab }>({
		isExpand: false,
		activeTab: activeTab ?? 'liveDepositTab',
	});

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setDepositModal(null));
	};

	const onExpanded = () => {
		setFieldValue('isExpand', !inputs.isExpand);
	};

	return (
		<Modal
			top='50%'
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			ref={ref}
			onClose={onCloseModal}
			{...props}
		>
			<Header label={t('deposit_modal.title')} onClose={onCloseModal} onExpanded={onExpanded} />

			<div
				style={{
					width: inputs.isExpand ? '1048px' : '400px',
					height: inputs.activeTab === 'liveDepositTab' ? '368px' : '608px',
				}}
				className='transition-size flex bg-white py-24 darkness:bg-gray-50'
			>
				<div
					style={{ flex: '0 0 400px' }}
					className={clsx('px-24 flex-column', inputs.isExpand && 'border-l border-gray-200')}
				>
					<Body
						dataEdit={data}
						activeTab={inputs.activeTab}
						setActiveTab={(v) => setFieldValue('activeTab', v)}
					/>
				</div>

				{inputs.isExpand && (
					<div className='flex-1 px-24 flex-column'>
						<HistoryDeposit onCloseModal={onCloseModal} activeTab={inputs.activeTab} />
					</div>
				)}
			</div>
		</Modal>
	);
});

export default Deposit;
