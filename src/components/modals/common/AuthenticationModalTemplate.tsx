import { XSVG } from '@/components/icons';
import React, { forwardRef } from 'react';
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

const AuthenticationModalTemplate = forwardRef<HTMLDivElement, AuthenticationModalTemplateProps>(
	({ title, children, hideTitle, description, styles, onClose, ...props }, ref) => {
		return (
			<Modal onClose={onClose} {...props} ref={ref}>
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
									style={{ maxWidth: '39.2rem', top: '6rem', ...styles?.description }}
									className='center-x absolute w-full text-center text-base font-bold text-gray-1000'
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
	},
);

export default AuthenticationModalTemplate;
