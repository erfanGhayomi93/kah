import { XSVG } from '@/components/icons';
import React from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

interface AuthenticationModalTemplateProps {
	title: string | React.ReactNode;
	children: React.ReactNode;
	hideTitle?: boolean;
	description?: string;
	onClose: () => void;
}

const Div = styled.div`
	width: 578px;
	height: 560px;
`;

const AuthenticationModalTemplate = ({
	title,
	children,
	hideTitle,
	description,
	onClose,
}: AuthenticationModalTemplateProps) => {
	return (
		<Modal onClose={onClose}>
			<Div className='rounded-md bg-white p-24 flex-column'>
				{!hideTitle && [
					<div key='close' className='absolute left-24 z-10'>
						<button onClick={onClose} type='button' className='text-gray-100'>
							<XSVG />
						</button>
					</div>,

					<div key='title' style={{ height: '8.8rem' }} className='relative mt-48 text-center'>
						<h1 className='text-3xl font-bold text-gray-100'>{title}</h1>
						{description && (
							<p
								style={{ maxWidth: '30rem' }}
								className='mx-auto pt-24 text-center text-base text-primary-300'
							>
								{description}
							</p>
						)}
					</div>,
				]}

				{children}
			</Div>
		</Modal>
	);
};

export default AuthenticationModalTemplate;
