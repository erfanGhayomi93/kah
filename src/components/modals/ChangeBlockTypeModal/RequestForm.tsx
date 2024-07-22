import { useAvailableContractInfoQuery } from '@/api/queries/brokerPrivateQueries';
import Radiobox from '@/components/common/Inputs/Radiobox';
import { BoxSVG, PayMoneySVG, SnowFlakeSVG } from '@/components/icons';
import { sepNumbers } from '@/utils/helpers';
import { getAccountBlockTypeValue } from '@/utils/Math/order';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface RequestFormProps {
	price: number;
	quantity: number;
	symbolData: Symbol.Info;
	onSubmit: (blockType: TBlockType, selectedPosition: IAvailableContractInfo | null) => void;
}

interface CardProps {
	isActive: boolean;
	description: React.ReactNode;
	icon: React.ReactNode;
	value: number;
	title: string;
	prefix: string;
	children?: React.ReactNode;
	onClick: () => void;
}

const RequestForm = ({ symbolData, price, quantity, onSubmit }: RequestFormProps) => {
	const t = useTranslations();

	const [blockType, setBlockType] = useState<TBlockType>('Portfolio');

	const [selectedPosition, setSelectedPosition] = useState<IAvailableContractInfo | null>(null);

	const { data = [] } = useAvailableContractInfoQuery({
		queryKey: ['availableContractInfoQuery', symbolData.symbolISIN],
	});

	const initialRequiredMargin = symbolData?.initialMargin ?? 0;

	const contractSize = symbolData?.contractSize ?? 0;

	const portfolioValue = quantity * contractSize;

	const accountValue = getAccountBlockTypeValue({
		initialRequiredMargin,
		contractSize: symbolData.contractSize,
		price,
		quantity,
	});

	return (
		<form method='get' className='h-full justify-between gap-48 p-24 flex-column'>
			<div className='flex-1 gap-16 flex-column *:select-none *:rounded *:shadow-card *:flex-column'>
				<Card
					isActive={blockType === 'Portfolio'}
					title={t('change_block_type_modal.block_type_portfolio')}
					prefix={t('change_block_type_modal.stock')}
					icon={<SnowFlakeSVG width='1.6rem' height='1.6rem' />}
					value={portfolioValue}
					description={t.rich('change_block_type_modal.block_type_portfolio_description', {
						chunk: () => (
							<span className='font-medium text-light-gray-800'>
								{sepNumbers(String(portfolioValue))}
							</span>
						),
					})}
					onClick={() => setBlockType('Portfolio')}
				/>

				<Card
					isActive={blockType === 'Account'}
					title={t('change_block_type_modal.block_type_account')}
					prefix={t('common.rial')}
					icon={<PayMoneySVG width='1.6rem' height='1.6rem' />}
					value={accountValue}
					description={t.rich('change_block_type_modal.block_type_portfolio_account', {
						chunk: () => (
							<span className='font-medium text-light-gray-800'>{sepNumbers(String(accountValue))}</span>
						),
					})}
					onClick={() => setBlockType('Account')}
				/>

				<Card
					isActive={blockType === 'Position'}
					title={t('change_block_type_modal.block_type_position')}
					prefix={t('change_block_type_modal.position')}
					icon={<BoxSVG width='1.6rem' height='1.6rem' />}
					value={quantity}
					description={t.rich('change_block_type_modal.block_type_portfolio_position', {
						chunk: () => (
							<span className='font-medium text-light-gray-800'>{sepNumbers(String(quantity))}</span>
						),
					})}
					onClick={() => {
						if (data.length === 0) {
							toast.warning(t('change_block_type_modal.no_position_exists'), {
								toastId: 'no_position_exists',
							});
							return;
						}

						setBlockType('Position');
					}}
				>
					<div className='relative overflow-auto p-16'>
						<ul className='bg-white shadow-card flex-column'>
							{data.map((item) => (
								<li key={item.symbolISIN} className='flex-48 gap-4 flex-items-center'>
									<Radiobox
										checked={selectedPosition?.symbolISIN === item.symbolISIN}
										onChange={() => setSelectedPosition(item)}
									/>
									<span className='text-light-gray-700'>{item.symbolTitle}</span>
								</li>
							))}
						</ul>
					</div>
				</Card>
			</div>

			<button
				disabled
				className='h-40 rounded btn-primary'
				type='button'
				onClick={() => onSubmit(blockType, selectedPosition)}
			>
				{t('common.confirm')}
			</button>
		</form>
	);
};

const Card = ({ isActive, description, icon, value, title, prefix, children, onClick }: CardProps) => (
	<div
		className={clsx(
			'transition-bg pt-16 flex-column',
			isActive ? 'bg-white' : 'bg-light-gray-100',
			!children && 'pb-16',
		)}
	>
		<div onClick={onClick} className='flex-48 cursor-pointer px-16 flex-justify-between'>
			<div
				className={clsx(
					'transition-color flex-1 gap-8 text-base flex-justify-start',
					isActive ? 'text-light-primary-100' : 'text-light-gray-700',
				)}
			>
				<Radiobox checked={isActive} onChange={onClick} />

				{icon}

				<span>{title}</span>
			</div>

			<div className='flex-1 gap-8 flex-justify-end'>
				<span
					className={clsx(
						'transition-color',
						isActive ? 'font-medium text-light-gray-800' : 'text-light-gray-700',
					)}
				>
					{sepNumbers(String(value))}
				</span>
				<span className='text-tiny text-light-gray-700'>{prefix}</span>
			</div>
		</div>

		<div
			className={clsx(
				'flex-1 overflow-hidden px-16 text-tiny text-light-gray-700 transition-all',
				isActive ? 'pt-8 opacity-100' : 'p-0 opacity-0',
			)}
			style={{
				flexBasis: isActive ? '2.8rem' : '0',
			}}
		>
			{description}
		</div>

		{Boolean(children) && (
			<div
				className={clsx(
					'flex-1 overflow-hidden px-16 pt-16 transition-all flex-column',
					isActive ? 'opacity-100' : 'opacity-0',
				)}
				style={{
					maxHeight: isActive ? '28.4rem' : '0',
				}}
			>
				<div className='flex-1 overflow-hidden border-t border-t-light-gray-200'>{children}</div>
			</div>
		)}
	</div>
);

export default RequestForm;
