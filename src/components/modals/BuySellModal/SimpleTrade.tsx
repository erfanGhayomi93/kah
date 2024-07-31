import { useGlPositionExtraInfoQuery, useUserRemainQuery } from '@/api/queries/brokerPrivateQueries';
import Button from '@/components/common/Button';
import RangeSlider from '@/components/common/Slider/RangeSlider';
import SwitchTab from '@/components/common/Tabs/SwitchTab';
import { LockSVG, UnlockSVG, XCircleSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setChangeBlockTypeModal } from '@/features/slices/modalSlice';
import { cn, sepNumbers } from '@/utils/helpers';
import { getAccountBlockTypeValue, getPortfolioBlockTypeValue } from '@/utils/Math/order';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useMemo, useRef, useState } from 'react';
import Input from './common/Input';
import TotalTradeValueInput from './common/TotalTradeValueInput';
import ValidityDate from './common/ValidityDate';

interface IPortfolioBlockType {
	type: 'Portfolio';
}

interface IAccountBlockType {
	type: 'Account';
}

interface IPositionBlockType {
	type: 'Position';
	value: IAvailableContractInfo;
}

interface SummaryItemProps {
	title: React.ReactNode;
	value: React.ReactNode;
}

interface ErrorMessageProps {
	children: React.ReactNode;
}

interface SimpleTradeProps extends IBsModalInputs {
	id: number | undefined;
	symbolData: Symbol.Info | null;
	submitting: boolean;
	symbolType: TBsSymbolTypes;
	type: TBsTypes;
	mode: TBsModes;
	switchable: boolean;
	isLoadingBestLimit: boolean;
	userRemain: Broker.Remain | null;
	setInputValue: TSetBsModalInputs;
	setMinimumValue: () => void;
	createDraft: () => void;
	onSubmit: () => void;
}

const SimpleTrade = ({
	symbolData,
	price,
	quantity,
	symbolType,
	validity,
	switchable,
	isLoadingBestLimit,
	value,
	submitting,
	side,
	priceLock,
	type,
	mode,
	setInputValue,
	setMinimumValue,
	createDraft,
	onSubmit,
}: SimpleTradeProps) => {
	const t = useTranslations();

	const priceRef = useRef<HTMLInputElement>(null);

	const quantityRef = useRef<HTMLInputElement>(null);

	const [error, setError] = useState<'price' | 'quantity' | null>(null);

	const [blockType, setBlockType] = useState<IPortfolioBlockType | IAccountBlockType | IPositionBlockType | null>(
		null,
	);

	const dispatch = useAppDispatch();

	const { data: symbolExtraInfo } = useGlPositionExtraInfoQuery({
		queryKey: ['glPositionExtraInfoQuery', symbolData?.symbolISIN ?? ''],
		enabled: Boolean(symbolData),
	});

	const { data: userRemain } = useUserRemainQuery({
		queryKey: ['userRemainQuery'],
	});

	const { data: baseSymbolExtraInfo = null } = useGlPositionExtraInfoQuery({
		queryKey: ['glPositionExtraInfoQuery', symbolData?.baseSymbolISIN ?? ''],
		enabled: Boolean(symbolData) && blockType?.type === 'Portfolio',
	});

	const onSubmitForm = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit();
	};

	const onBlockTypeChanged = (type: TBlockType, selectedPosition: IAvailableContractInfo | null) => {
		if (type === 'Position') {
			setBlockType({ type, value: selectedPosition! });
		} else {
			setBlockType({ type });
		}
	};

	const validation = () => {
		if (!quantity) {
			quantityRef.current?.focus();
			setError('quantity');

			throw new Error();
		}

		if (!price) {
			priceRef.current?.focus();
			setError('price');

			throw new Error();
		}
	};

	const changeBlockType = () => {
		try {
			if (!symbolData || !symbolData.isOption) return;

			validation();

			dispatch(
				setChangeBlockTypeModal({
					price,
					quantity,
					symbolData,
					callback: onBlockTypeChanged,
				}),
			);
		} catch (e) {
			//
		}
	};

	const TABS = useMemo(
		() => [
			{
				id: 'buy',
				title: t('side.buy'),
				disabled: !switchable && side === 'sell',
			},
			{
				id: 'sell',
				title: t('side.sell'),
				disabled: !switchable && side === 'buy',
			},
		],
		[],
	);

	const symbolTitle = symbolData?.symbolTitle ?? '';

	const isOption = Boolean(symbolData?.isOption);

	const assets = symbolExtraInfo?.asset ?? 0;

	const blockTypeTitle = () => {
		if (!blockType) {
			return t('bs_modal.select_block_type');
		}

		if (blockType.type === 'Account') {
			return t.rich('bs_modal.account_block_type', {
				v: () => <span className='text-gray-800'>{sepNumbers(String(blockTypeAccountValue))}</span>,
			});
		}

		if (blockType.type === 'Portfolio') {
			return t.rich('bs_modal.portfolio_block_type', {
				v: () => <span className='text-gray-800'>{sepNumbers(String(blockTypePortfolioValue))}</span>,
			});
		}

		return t.rich('bs_modal.position_block_type', {
			n: () => <span className='text-gray-800'>{blockType.value.symbolTitle}</span>,
			v: () => <span className='text-gray-800'>{sepNumbers(String(blockTypePortfolioValue))}</span>,
		});
	};

	const blockTypeErrorMessage = () => {
		if (!blockType || blockType.type === 'Position') return null;

		if (blockType.type === 'Account' && blockTypeAccountValue > Number(userRemain?.purchasePower ?? 0)) {
			return <ErrorMessage>{t('bs_modal.account_block_type_error')}</ErrorMessage>;
		}

		if (blockType.type === 'Portfolio' && blockTypePortfolioValue > Number(baseSymbolExtraInfo?.asset ?? 0)) {
			return <ErrorMessage>{t('bs_modal.portfolio_block_type_error')}</ErrorMessage>;
		}

		return null;
	};

	const blockTypeAccountValue = getAccountBlockTypeValue({
		initialRequiredMargin: symbolData?.initialMargin ?? 0,
		contractSize: symbolData?.contractSize ?? 0,
		price,
		quantity,
	});

	const blockTypePortfolioValue = getPortfolioBlockTypeValue({
		contractSize: symbolData?.contractSize ?? 0,
		quantity,
	});

	return (
		<form method='get' onSubmit={onSubmitForm} className='w-full flex-1 gap-24 flex-column'>
			<SwitchTab
				data={TABS}
				defaultActiveTab={side}
				classes={{
					root: '!border-gray-400',
					rect: side === 'buy' ? 'bg-success-100' : 'bg-error-100',
				}}
				onChangeTab={(tabId) => setInputValue('side', tabId as TBsSides)}
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'h-full flex-1 font-medium transition-colors',
							item.id === activeTab ? 'text-white' : 'text-gray-700',
						)}
						type='button'
						disabled={item.disabled}
					>
						{item.title}
					</button>
				)}
			/>

			<div className='flex-1 flex-col gap-12 flex-justify-between'>
				<div className='flex-column'>
					<div className='gap-4 pb-16 flex-column'>
						<Input
							autoFocus
							ref={quantityRef}
							label={t('bs_modal.quantity_label')}
							value={quantity}
							onChange={(value) => {
								setInputValue('quantity', value);
								if (error === 'quantity') setError(null);
							}}
							tickSize={symbolData?.orderQuantityTickSize ?? 0}
							low={1}
							high={1e5}
							hasError={error === 'quantity'}
						/>

						{side === 'sell' && (
							<>
								<div className='text-tiny flex-justify-between'>
									<span className='text-gray-700'>{t('bs_modal.assets')}:</span>
									<span className='text-gray-800'>
										{assets > 0 && (
											<span className='text-tiny'>{sepNumbers(String(assets)) + ' '}</span>
										)}
										{assets === 0
											? isOption
												? t('bs_modal.no_positions')
												: t('bs_modal.no_stocks')
											: isOption
												? t('bs_modal.exists_positions', { n: symbolTitle })
												: t('bs_modal.exists_stocks', { n: symbolTitle })}
									</span>
								</div>

								<RangeSlider
									disabled={assets === 0}
									max={assets}
									value={assets === 0 ? 0 : quantity}
									onChange={(value) => setInputValue('quantity', value)}
								/>
							</>
						)}
					</div>

					<div className='gap-4 pb-16 flex-column'>
						<Input
							ref={priceRef}
							label={t('bs_modal.price_label')}
							value={price}
							onChange={(value) => {
								setInputValue('price', value);
								if (error === 'price') setError(null);
							}}
							tickSize={symbolData?.orderPriceTickSize ?? 0}
							high={symbolData?.highThreshold ?? 0}
							low={symbolData?.lowThreshold ?? 0}
							hasError={error === 'price'}
							prefix={
								<>
									{isLoadingBestLimit ? (
										<div className='size-24 spinner' />
									) : (
										<button
											type='button'
											className={clsx(
												'size-24 transition-colors',
												priceLock ? 'text-primary-100' : 'text-gray-700',
											)}
											onClick={() => setInputValue('priceLock', !priceLock)}
										>
											{priceLock ? (
												<LockSVG width='2.4rem' height='2.4rem' />
											) : (
												<UnlockSVG width='2.4rem' height='2.4rem' />
											)}
										</button>
									)}
								</>
							}
						/>
					</div>

					<TotalTradeValueInput
						purchasePower={side === 'buy' ? Math.max(userRemain?.purchasePower ?? 0, 0) : null}
						value={value}
						setToMinimum={isOption ? undefined : setMinimumValue}
						onChange={(v) => setInputValue('value', v)}
					/>

					{side === 'sell' && symbolType === 'option' && (
						<SummaryItem
							title={blockTypeTitle()}
							value={
								<button onClick={changeBlockType} type='button' className='text-info-100'>
									{t('bs_modal.change_block_type')}
								</button>
							}
						/>
					)}

					{blockTypeErrorMessage()}

					{symbolType === 'base' && (
						<ValidityDate value={validity} onChange={(v) => setInputValue('validity', v)} />
					)}
				</div>

				<div className='w-full gap-16 border-t border-gray-200 pt-16 flex-column'>
					<div className='gap-12 flex-column'>
						{symbolType === 'option' && (
							<SummaryItem
								title={t('bs_modal.validity_date') + ':'}
								value={
									<span className='text-gray-800'>
										<span className='font-medium'>1</span>
										<span className='text-gray-700'>{' ' + t('bs_modal.day')}</span>
									</span>
								}
							/>
						)}

						<SummaryItem
							title={t('bs_modal.total_amount') + ':'}
							value={
								<span className='text-gray-800'>
									<span className='font-medium'>{sepNumbers(String(value))}</span>
									<span className='text-gray-700'>{' ' + t('common.rial')}</span>
								</span>
							}
						/>
					</div>

					<div className='flex gap-8'>
						{mode === 'create' && type === 'order' && (
							<button
								type='button'
								onClick={createDraft}
								className='h-40 rounded px-16 text-base btn-secondary-outline'
							>
								{t('bs_modal.draft')}
							</button>
						)}

						<Button
							disabled={!blockType}
							type='submit'
							className={cn(
								'not h-40 flex-1 rounded text-base font-medium',
								side === 'buy' ? 'btn-success' : 'btn-error',
							)}
							loading={submitting}
						>
							{t(`bs_modal.${mode}_${type}_${side}`)}
						</Button>
					</div>
				</div>
			</div>
		</form>
	);
};

const SummaryItem = ({ title, value }: SummaryItemProps) => (
	<div className='h-20 flex-justify-between *:text-tiny'>
		<span className='text-gray-700'>{title}</span>

		{value}
	</div>
);

const ErrorMessage = ({ children }: ErrorMessageProps) => (
	<div className='h-28 gap-8 pt-8 text-error-100 flex-items-center'>
		<XCircleSVG width='1.6rem' height='1.6rem' />
		<span className='text-tiny'>{children}</span>
	</div>
);

export default SimpleTrade;
