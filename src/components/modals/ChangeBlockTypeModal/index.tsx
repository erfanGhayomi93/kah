import { useAppDispatch } from '@/features/hooks';
import { setChangeBlockTypeModal } from '@/features/slices/modalSlice';
import { type IChangeBlockTypeModal } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import RequestForm from './RequestForm';

const Div = styled.div`
	width: 500px;
	min-height: 504px;
	position: relative;
`;

interface ChangeBlockTypeModalProps extends IChangeBlockTypeModal {}

const ChangeBlockTypeModal = forwardRef<HTMLDivElement, ChangeBlockTypeModalProps>(
	({ symbolData, price, quantity, callback, ...props }, ref) => {
		const t = useTranslations('change_block_type_modal');

		const dispatch = useAppDispatch();

		const onCloseModal = () => {
			dispatch(setChangeBlockTypeModal(null));
		};

		const onSubmit = (blockType: TBlockType, selectedPosition: IAvailableContractInfo | null) => {
			callback(blockType, selectedPosition);
			onCloseModal();
		};

		return (
			<Modal
				onClose={onCloseModal}
				{...props}
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				top='50%'
				ref={ref}
			>
				<Div className='justify-between bg-white flex-column darkBlue:bg-gray-50 dark:bg-gray-50'>
					<Header
						label={
							<>
								{t('title') + ' - '}
								<span className='text-info-100'>{symbolData.symbolTitle}</span>
							</>
						}
						onClose={onCloseModal}
					/>

					<RequestForm price={price} quantity={quantity} symbolData={symbolData} onSubmit={onSubmit} />
				</Div>
			</Modal>
		);
	},
);

export default ChangeBlockTypeModal;
