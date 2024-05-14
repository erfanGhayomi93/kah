import Loading from '@/components/common/Loading';
import { useAppDispatch } from '@/features/hooks';
import { setDescriptionModal } from '@/features/slices/modalSlice';
import { type IDescriptionModal } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef, Suspense } from 'react';
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
			style={{ modal: { transform: 'translate(-50%, -50%)', borderRadius: '1.6rem' } }}
			top='50%'
			onClose={onCloseModal}
			{...props}
		>
			<Div className='bg-white'>
				<Header label={title} onClose={onCloseModal} />

				<div className='justify-between gap-24 p-24 flex-column'>
					<div style={{ minHeight: '6.4rem', maxHeight: '80dvh' }} className='flex-1 text-right rtl'>
						<Suspense fallback={<Loading />}>{description()}</Suspense>
					</div>

					<div className='flex-justify-end'>
						<button
							onClick={onRead}
							style={{ width: '18.4rem' }}
							type='button'
							className='h-40 rounded btn-primary'
						>
							{t('common.read')}
						</button>
					</div>
				</div>
			</Div>
		</Modal>
	);
});

export default Description;
