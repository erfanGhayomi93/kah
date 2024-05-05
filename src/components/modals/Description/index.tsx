import { useAppDispatch } from '@/features/hooks';
import { setDescriptionModal } from '@/features/slices/modalSlice';
import { type IDescriptionModal } from '@/features/slices/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';

const Div = styled.div`
	width: 100rem;
`;

interface DescriptionProps extends IDescriptionModal {}

const Description = forwardRef<HTMLDivElement, DescriptionProps>(({ title, description, onRead, ...props }, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setDescriptionModal(null));
	};

	return (
		<Modal
			ref={ref}
			transparent
			style={{ modal: { transform: 'translate(-50%, -50%)', borderRadius: '1.6rem' } }}
			top='50%'
			onClose={onCloseModal}
			{...props}
		>
			<Div className='bg-white'>
				<Header label={title} onClose={onCloseModal} />
				{description}

				<div className='flex-justify-end'>
					<button style={{ width: '18.4rem' }} type='button' className='h-40 rounded btn-primary'>
						{t('common.read')}
					</button>
				</div>
			</Div>
		</Modal>
	);
});

export default Description;
