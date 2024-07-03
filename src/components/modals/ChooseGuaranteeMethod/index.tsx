import { useAppDispatch } from '@/features/hooks';
import { setChooseGuaranteeMethodModal } from '@/features/slices/modalSlice';
import { type IChooseGuaranteeMethodModal } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';

const Div = styled.div`
	width: 500px;
	height: 504px;
	position: relative;
`;

interface ChooseGuaranteeMethodProps extends IChooseGuaranteeMethodModal {}

const ChooseGuaranteeMethod = forwardRef<HTMLDivElement, ChooseGuaranteeMethodProps>(
	({ baseSymbolTitle, baseSymbolISIN, symbolTitle, symbolISIN, callback, ...props }, ref) => {
		const t = useTranslations();

		const dispatch = useAppDispatch();

		const onCloseModal = () => {
			dispatch(setChooseGuaranteeMethodModal(null));
		};

		return (
			<Modal onClose={onCloseModal} {...props} ref={ref}>
				<Div className='justify-between bg-white flex-column'>
					<Header
						label={
							<>
								{t('choose_guarantee_method_modal.title') + ' - '}
								<span className='text-light-info-100'>{symbolTitle}</span>
							</>
						}
						onClose={onCloseModal}
					/>

					<form method='get' className='justify-between gap-16 p-24 flex-column'>
						<div className='text-tiny text-light-gray-700 flex-justify-between'>
							<span>{t('choose_guarantee_method_modal.block_type')}</span>
							<span>
								{t('choose_guarantee_method_modal.total_count') + ': '}
								<span className='font-medium text-light-gray-800'>10</span>
							</span>
						</div>

						<button disabled className='h-40 rounded btn-primary' type='submit'>
							{t('common.submit')}
						</button>
					</form>
				</Div>
			</Modal>
		);
	},
);

export default ChooseGuaranteeMethod;
