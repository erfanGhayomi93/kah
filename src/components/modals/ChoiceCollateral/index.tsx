import { PayMoneySVG, SnowFlakeSVG, XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleChoiceCollateralModal, type IChoiceCollateral } from '@/features/slices/modalSlice';
import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

const Div = styled.div`
	width: 456px;
	height: 424px;
	position: relative;
`;

interface ChoiceCollateralProps extends IChoiceCollateral {}

const ChoiceCollateral = ({ order, ...props }: ChoiceCollateralProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [value, setValue] = useState<Order.OrderSourceType>(order.blockType);

	const onCloseModal = () => {
		dispatch(toggleChoiceCollateralModal(null));
	};

	const onSubmit = () => {
		const isDisabled = Boolean(order.side === 'Call' || order.isFreeze);
		if (isDisabled) return;
	};

	return (
		<Modal moveable transparent onClose={onCloseModal} {...props}>
			<Div className='justify-between bg-white flex-column'>
				<div className='relative h-56 bg-gray-200 flex-justify-center'>
					<h2 className='text-xl font-medium text-gray-1000'>{t('choice_collateral_modal.title')}</h2>

					<button
						onClick={onCloseModal}
						style={{ left: '1.6rem' }}
						type='button'
						className='absolute top-1/2 -translate-y-1/2 transform p-8 icon-hover'
					>
						<XSVG width='2rem' height='2rem' />
					</button>
				</div>

				<div className='flex-1 justify-between p-16 pt-40 flex-column'>
					<div className='flex-1 items-center gap-24 text-center flex-column'>
						<span className='text-base text-gray-900 transition-colors'>
							{t('choice_collateral_modal.select_collateral')}
						</span>

						<div style={{ height: '12rem' }} className='gap-24 flex-justify-center'>
							<button
								onClick={() => setValue('Account')}
								style={{ width: '12rem' }}
								type='button'
								className={clsx(
									'h-full flex-col gap-16 rounded border transition-colors flex-justify-center',
									value === 'Account'
										? 'border-primary-400 bg-secondary-100 text-primary-400'
										: 'border-gray-500 text-gray-800',
								)}
							>
								<PayMoneySVG width='4rem' height='4rem' />
								<span
									className={clsx(
										'text-lg',
										value === 'Account' ? 'text-primary-400' : 'text-gray-900',
									)}
								>
									{t('choice_collateral_modal.cash_collateral')}
								</span>
							</button>
							<button
								onClick={() => setValue('Portfolio')}
								style={{ width: '12rem' }}
								type='button'
								className={clsx(
									'h-full flex-col gap-16 rounded border transition-colors flex-justify-center',
									value === 'Portfolio'
										? 'border-primary-400 bg-secondary-100 text-primary-400'
										: 'border-gray-500 text-gray-800',
								)}
							>
								<SnowFlakeSVG width='4rem' height='4rem' />
								<span
									className={clsx(
										'text-lg',
										value === 'Portfolio' ? 'text-primary-400' : 'text-gray-900',
									)}
								>
									{t('choice_collateral_modal.stock_collateral')}
								</span>
							</button>
						</div>

						<span className='text-base text-gray-900 transition-colors'>
							{t.rich('choice_collateral_modal.collateral_details', {
								price: sepNumbers(String(5000000)),
								title: order.symbolTitle,
								p: (chunk) => <span className='text-lg font-medium text-primary-400'>{chunk}</span>,
								t: (chunk) => <span className='font-medium'>{chunk}</span>,
							})}
						</span>
					</div>

					<div className='gap-8 flex-justify-end'>
						<button
							onClick={onCloseModal}
							type='button'
							style={{ flex: '0 0 12rem' }}
							className='h-40 rounded text-lg btn-disabled-outline'
						>
							{t('common.cancel')}
						</button>
						<button
							type='button'
							onClick={onSubmit}
							style={{ flex: '0 0 12rem' }}
							className='h-40 rounded text-lg btn-primary'
						>
							{t('common.confirm')}
						</button>
					</div>
				</div>
			</Div>
		</Modal>
	);
};

export default ChoiceCollateral;
