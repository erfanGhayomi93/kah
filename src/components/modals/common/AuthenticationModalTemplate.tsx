import { XSVG } from '@/components/icons';
import React from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

interface AuthenticationModalTemplateProps extends IBaseModalConfiguration {
	title: string | React.ReactNode;
	children: React.ReactNode;
	hideTitle?: boolean;
	description?: string;
	transparent?: boolean;
	styles?: Partial<Record<'description', React.CSSProperties>>;
	onClose: () => void;
}

const Div = styled.div`
	width: 578px;
	height: 560px;
	display: flex;
	padding: 2.4rem;
	flex-direction: column;
	border-radius: 1.6rem;
`;

const AuthenticationModalTemplate = ({
	title,
	children,
	hideTitle,
	description,
	styles,
	onClose,
	...props
}: AuthenticationModalTemplateProps) => {
	return (
		<Modal onClose={onClose} {...props}>
			<Div className='bg-white'>
				{!hideTitle && [
					<div key='close' className='absolute left-24 z-10'>
						<button onClick={onClose} type='button' className='icon-hover'>
							<XSVG width='2rem' height='2rem' />
						</button>
					</div>,

					<div key='title' className='relative mt-24 gap-24 text-center flex-column'>
						<h1 className='text-3xl font-bold text-gray-1000'>{title}</h1>
						{description && (
							<p
								style={{ maxWidth: '30rem', ...styles?.description }}
								className='mx-auto text-center text-base text-primary-400'
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
