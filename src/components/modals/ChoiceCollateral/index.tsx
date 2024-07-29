import { PayMoneySVG, SnowFlakeSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setChoiceCollateralModal } from '@/features/slices/modalSlice';
import { type IChoiceCollateral } from '@/features/slices/types/modalSlice.interfaces';
import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';

const Div = styled.div`
	width: 456px;
	height: 424px;
	position: relative;
`;

interface ChoiceCollateralProps extends IChoiceCollateral {}

const ChoiceCollateral = forwardRef<HTMLDivElement, ChoiceCollateralProps>(({ order, ...props }, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [value, setValue] = useState<TBlockType>(order.blockType);

	const onCloseModal = () => {
		dispatch(setChoiceCollateralModal(null));
	};

	const onSubmit = () => {
		const isDisabled = Boolean(order.side === 'Buy' || order.isFreeze);
		if (isDisabled) return;
	};

	return (
		<Modal moveable transparent onClose={onCloseModal} {...props} ref={ref}>
			<Div className='darkBlue:bg-gray-50 justify-between bg-white flex-column dark:bg-gray-50'>
				<Header label={t('choice_collateral_modal.title')} onClose={onCloseModal} />

				<div className='flex-1 justify-between p-16 pt-40 flex-column'>
					<div className='flex-1 items-center gap-24 text-center flex-column'>
						<span className='text-base text-gray-700 transition-colors'>
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
										? 'border-primary-100 bg-secondary-200 text-primary-100'
										: 'border-gray-200 text-gray-700',
								)}
							>
								<PayMoneySVG width='4rem' height='4rem' />
								<span
									className={clsx(
										'text-lg',
										value === 'Account' ? 'text-primary-100' : 'text-gray-700',
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
										? 'border-primary-100 bg-secondary-200 text-primary-100'
										: 'border-gray-200 text-gray-700',
								)}
							>
								<SnowFlakeSVG width='4rem' height='4rem' />
								<span
									className={clsx(
										'text-lg',
										value === 'Portfolio' ? 'text-primary-100' : 'text-gray-700',
									)}
								>
									{t('choice_collateral_modal.stock_collateral')}
								</span>
							</button>
						</div>

						<span className='text-base text-gray-700 transition-colors'>
							{t.rich('choice_collateral_modal.collateral_details', {
								price: sepNumbers(String(5000000)),
								title: order.symbolTitle,
								p: (chunk) => <span className='text-lg font-medium text-primary-100'>{chunk}</span>,
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
});

export default ChoiceCollateral;
