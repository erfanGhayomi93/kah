import {
	useAvailableContractInfoQuery,
	useGlPositionExtraInfoQuery,
	useUserRemainQuery,
} from '@/api/queries/brokerPrivateQueries';
import { BoxSVG, PayMoneySVG, SnowFlakeSVG } from '@/components/icons';
import { sepNumbers } from '@/utils/helpers';
import { getAccountBlockTypeValue } from '@/utils/math/order';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Card from './Card';
import Positions from './Positions';

interface RequestFormProps {
	price: number;
	quantity: number;
	symbolData: Symbol.Info;
	onSubmit: (blockType: TBlockType, selectedPosition: IAvailableContractInfo | null) => void;
}

const RequestForm = ({ symbolData, price, quantity, onSubmit }: RequestFormProps) => {
	const t = useTranslations();

	const [blockType, setBlockType] = useState<TBlockType>('Portfolio');

	const [selectedPosition, setSelectedPosition] = useState<IAvailableContractInfo | null>(null);

	const { data: userRemain = null } = useUserRemainQuery({
		queryKey: ['userRemainQuery'],
		enabled: blockType === 'Account',
	});

	const { data: baseSymbolExtraInfo = null } = useGlPositionExtraInfoQuery({
		queryKey: ['glPositionExtraInfoQuery', symbolData.baseSymbolISIN],
		enabled: blockType === 'Portfolio',
	});

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

	const onPositionClicked = () => {
		if (data.length === 0) {
			toast.warning(t('change_block_type_modal.no_position_exists'), {
				toastId: 'no_position_exists',
			});
			return;
		}

		setBlockType('Position');
	};

	const isDisabled = useMemo<boolean>(() => {
		if (blockType === 'Portfolio') return Number(baseSymbolExtraInfo?.asset ?? 0) < portfolioValue;

		if (blockType === 'Account') return Number(userRemain?.purchasePower ?? 0) < accountValue;

		return selectedPosition === null || selectedPosition.customersOpenPositions === 0;
	}, [blockType, userRemain, baseSymbolExtraInfo, selectedPosition]);

	return (
		<form method='get' className='h-full justify-between gap-48 p-24 flex-column'>
			<div className='flex-1 gap-16 flex-column *:select-none *:rounded *:shadow-sm *:flex-column'>
				<Card
					isActive={blockType === 'Portfolio'}
					title={t('change_block_type_modal.block_type_portfolio')}
					prefix={t('change_block_type_modal.stock')}
					icon={<SnowFlakeSVG width='1.6rem' height='1.6rem' />}
					value={portfolioValue}
					description={t.rich('change_block_type_modal.block_type_portfolio_description', {
						chunk: () => (
							<span className='font-medium text-gray-800'>{sepNumbers(String(portfolioValue))}</span>
						),
					})}
					error={
						Number(baseSymbolExtraInfo?.asset ?? 0) < portfolioValue
							? t('change_block_type_modal.block_type_portfolio_error', {
									baseSymbolTitle: symbolData.baseSymbolTitle,
									symbolTitle: symbolData.symbolTitle,
								})
							: undefined
					}
					onClick={() => setBlockType('Portfolio')}
				/>

				<Card
					isActive={blockType === 'Account'}
					title={t('change_block_type_modal.block_type_account')}
					prefix={t('common.rial')}
					icon={<PayMoneySVG width='1.6rem' height='1.6rem' />}
					value={accountValue}
					description={t.rich('change_block_type_modal.block_type_account_description', {
						chunk: () => (
							<span className='font-medium text-gray-800'>{sepNumbers(String(accountValue))}</span>
						),
					})}
					error={
						Number(userRemain?.purchasePower ?? 0) < accountValue
							? t('change_block_type_modal.block_type_account_error', {
									symbolTitle: symbolData.symbolTitle,
								})
							: undefined
					}
					onClick={() => setBlockType('Account')}
				/>

				<Card
					isActive={blockType === 'Position'}
					title={t('change_block_type_modal.block_type_position')}
					prefix={t('change_block_type_modal.position')}
					icon={<BoxSVG width='1.6rem' height='1.6rem' />}
					value={quantity}
					description={t.rich('change_block_type_modal.block_type_position_description', {
						chunk: () => <span className='font-medium text-gray-800'>{sepNumbers(String(quantity))}</span>,
					})}
					error={
						(selectedPosition &&
							selectedPosition.customersOpenPositions === 0 &&
							t('change_block_type_modal.block_type_position_error', {
								position: selectedPosition.symbolTitle,
								symbolTitle: symbolData.symbolTitle,
							})) ||
						undefined
					}
					onClick={onPositionClicked}
				>
					<Positions
						data={data}
						selectedPosition={selectedPosition}
						setSelectedPosition={setSelectedPosition}
						quantity={quantity}
					/>
				</Card>
			</div>

			<button
				disabled={isDisabled}
				className='h-40 rounded btn-primary'
				type='button'
				onClick={() => onSubmit(blockType, selectedPosition)}
			>
				{t('common.confirm')}
			</button>
		</form>
	);
};

export default RequestForm;
