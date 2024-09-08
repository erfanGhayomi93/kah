import { useGlPositionExtraInfoQuery } from '@/api/queries/brokerPrivateQueries';
import Button from '@/components/common/Button';
import RangeSlider from '@/components/common/Slider/RangeSlider';
import SwitchTab from '@/components/common/Tabs/SwitchTab';
import Tooltip from '@/components/common/Tooltip';
import { InfoCircleSVG, LockSVG, UnlockSVG, XCircleSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setChangeBlockTypeModal } from '@/features/slices/modalSlice';
import { sepNumbers } from '@/utils/helpers';
import { getAccountBlockTypeValue, getPortfolioBlockTypeValue } from '@/utils/math/order';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useMemo, useRef, useState } from 'react';
import Input from './common/Input';
import TotalTradeValueInput from './common/TotalTradeValueInput';
import ValidityDate from './common/ValidityDate';

interface SummaryItemProps {
	title: React.ReactNode;
	tooltip?: React.ReactNode;
	value: React.ReactNode;
}

interface ErrorMessageProps {
	children: React.ReactNode;
}

interface SimpleTradeProps extends IBsModalInputs {
	id: number | undefined;
	orderingPurchasePower: number;
	purchasePower: number;
	symbolAssets: number;
	symbolData: Symbol.Info | null;
	submitting: boolean;
	symbolType: TBsSymbolTypes;
	type: TBsTypes;
	mode: TBsModes;
	switchable: boolean;
	isLoadingBestLimit: boolean;
	userRemain: Broker.Remain | null;
	totalAmountTooltip: Record<'requiredMargin' | 'commission' | 'netValue', number>;
	setInputValue: TSetBsModalInputs;
	setMinimumValue: () => void;
	rearrangeValue: () => void;
	createDraft: () => void;
	onSubmit: () => void;
}

const SimpleTrade = ({
	symbolData,
	price,
	quantity,
	symbolType,
	validity,
	blockType,
	validityDate,
	switchable,
	isLoadingBestLimit,
	value,
	orderingPurchasePower,
	purchasePower,
	symbolAssets,
	submitting,
	side,
	priceLock,
	type,
	mode,
	totalAmountTooltip,
	setInputValue,
	setMinimumValue,
	createDraft,
	onSubmit,
	rearrangeValue,
}: SimpleTradeProps) => {
	const t = useTranslations();

	const priceRef = useRef<HTMLInputElement>(null);

	const quantityRef = useRef<HTMLInputElement>(null);

	const [error, setError] = useState<'price' | 'quantity' | null>(null);

	const dispatch = useAppDispatch();

	const { data: baseSymbolExtraInfo = null } = useGlPositionExtraInfoQuery({
		queryKey: ['glPositionExtraInfoQuery', symbolData?.baseSymbolISIN ?? ''],
		enabled: Boolean(symbolData) && blockType?.type === 'Portfolio',
	});

	const onSubmitForm = (e: React.FormEvent) => {
		e.preventDefault();
		if (isFormDisabled) return;

		onSubmit();
	};

	const onBlockTypeChanged = (type: TBlockType, selectedPosition: IAvailableContractInfo | null) => {
		if (type === 'Position') {
			setInputValue('blockType', { type, value: selectedPosition! });
		} else {
			setInputValue('blockType', { type });
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
			if (!symbolData || !isOption || debtQuantity < 0) return;

			validation();

			dispatch(
				setChangeBlockTypeModal({
					price,
					quantity: debtQuantity,
					symbolData,
					callback: onBlockTypeChanged,
				}),
			);
		} catch (e) {
			//
		}
	};

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
			v: () => <span className='text-gray-800'>{sepNumbers(String(quantity))}</span>,
		});
	};

	const blockTypeErrorMessage = () => {
		if (side === 'buy' || !blockType) return null;

		if (isAccountBlockTypeInvalid) {
			return <ErrorMessage>{t('bs_modal.account_block_type_error')}</ErrorMessage>;
		}

		if (isPortfolioBlockTypeInvalid) {
			return <ErrorMessage>{t('bs_modal.portfolio_block_type_error')}</ErrorMessage>;
		}

		if (isPositionBlockTypeInvalid) {
			return <ErrorMessage>{t('bs_modal.position_block_type_error')}</ErrorMessage>;
		}

		return null;
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

	const isShortCall = side === 'sell' && symbolType === 'option';

	const isClosingPosition = isShortCall && quantity - symbolAssets <= 0;

	const debtQuantity = isShortCall ? quantity : Math.max(quantity - symbolAssets, 0);

	const blockTypeAccountValue = getAccountBlockTypeValue({
		initialRequiredMargin: symbolData?.initialMargin ?? 0,
		contractSize: symbolData?.contractSize ?? 0,
		quantity: debtQuantity,
		price,
	});

	const blockTypePortfolioValue = getPortfolioBlockTypeValue({
		contractSize: symbolData?.contractSize ?? 0,
		quantity: debtQuantity,
	});

	const isAccountBlockTypeInvalid =
		blockType?.type === 'Account' && blockTypeAccountValue > Number(purchasePower ?? 0);

	const isPortfolioBlockTypeInvalid =
		blockType?.type === 'Portfolio' && blockTypePortfolioValue > Number(baseSymbolExtraInfo?.asset ?? 0);

	const isPositionBlockTypeInvalid =
		blockType?.type === 'Position' && quantity > Number(blockType.value.customersOpenPositions ?? 0);

	const isBlockTypeInvalid =
		!blockType || isAccountBlockTypeInvalid || isPortfolioBlockTypeInvalid || isPositionBlockTypeInvalid;

	const isFormDisabled = !price || !quantity || (isShortCall && quantity - symbolAssets > 0 && isBlockTypeInvalid);

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
										{symbolAssets > 0 && (
											<span className='text-tiny'>{sepNumbers(String(symbolAssets)) + ' '}</span>
										)}
										{symbolAssets === 0
											? isOption
												? t('bs_modal.no_positions')
												: t('bs_modal.no_stocks')
											: isOption
												? t('bs_modal.exists_positions', { n: symbolTitle })
												: t('bs_modal.exists_stocks', { n: symbolTitle })}
									</span>
								</div>

								<RangeSlider
									disabled={symbolAssets === 0}
									max={symbolAssets}
									value={symbolAssets === 0 ? 0 : quantity}
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
						purchasePower={purchasePower}
						max={side === 'buy' ? orderingPurchasePower : null}
						value={value}
						setToMinimum={isOption ? undefined : setMinimumValue}
						onChange={(v) => setInputValue('value', v)}
						onBlur={rearrangeValue}
					/>

					{isShortCall && quantity - symbolAssets > 0 && (
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
						<ValidityDate
							date={validityDate}
							onChangeDate={(v) => setInputValue('validityDate', v)}
							value={validity}
							onChange={(v) => setInputValue('validity', v)}
						/>
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
							tooltip={
								<div
									style={{ width: '280px' }}
									className='bg-tooltip gap-8 rounded p-8 flex-column *:flex-wrap *:text-white'
								>
									{isOption && side === 'sell' && (
										<div className='flex-justify-between *:text-tiny'>
											<span>{t('bs_modal.required_margin')}:</span>
											<span className='flex-1 text-left'>
												{sepNumbers(String(totalAmountTooltip.requiredMargin))}
											</span>
										</div>
									)}
									<div className='flex-justify-between *:text-tiny'>
										<span>{t('bs_modal.commission')}:</span>
										<span className='flex-1 text-left'>
											{sepNumbers(String(totalAmountTooltip.commission))}
										</span>
									</div>
									<div className='flex-justify-between *:text-tiny'>
										<span>
											{t(
												isOption
													? 'bs_modal.option_net_value_label'
													: 'bs_modal.base_net_value_label',
											)}
											:
										</span>
										<span className='flex-1 text-left'>
											{sepNumbers(String(totalAmountTooltip.netValue))}
										</span>
									</div>

									<span className='h-1 bg-white' />

									<div className='flex-justify-between *:text-tiny'>
										<span>{t('bs_modal.total_amount')}:</span>
										<span className='flex-1 text-left'>{sepNumbers(String(value))}</span>
									</div>
								</div>
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
							disabled={isFormDisabled}
							type='submit'
							className={clsx(
								'not h-40 flex-1 rounded text-base font-medium',
								side === 'buy' ? 'btn-success' : 'btn-error',
							)}
							loading={submitting}
						>
							{t(isClosingPosition ? 'bs_modal.close_position' : `bs_modal.${mode}_${type}_${side}`)}
						</Button>
					</div>
				</div>
			</div>
		</form>
	);
};

const SummaryItem = ({ tooltip, title, value }: SummaryItemProps) => (
	<div className='h-20 flex-justify-between *:text-tiny'>
		<div className='gap-4 flex-items-center'>
			<span className='text-gray-700'>{title}</span>
			{Boolean(tooltip) && (
				<Tooltip arrow={false} className='!bg-transparent !p-0' placement='bottom' content={tooltip}>
					<span className='text-info-100'>
						<InfoCircleSVG width='1.6rem' height='1.6rem' />
					</span>
				</Tooltip>
			)}
		</div>

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
