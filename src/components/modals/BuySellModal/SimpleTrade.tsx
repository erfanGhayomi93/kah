import { useGlPositionExtraInfoQuery, useUserRemainQuery } from '@/api/queries/brokerPrivateQueries';
import Button from '@/components/common/Button';
import RangeSlider from '@/components/common/Slider/RangeSlider';
import SwitchTab from '@/components/common/Tabs/SwitchTab';
import { LockSVG, UnlockSVG } from '@/components/icons';
import { cn, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import Input from './common/Input';
import TotalTradeValueInput from './common/TotalTradeValueInput';
import ValidityDate from './common/ValidityDate';

interface SummaryItemProps {
	title: React.ReactNode;
	value: React.ReactNode;
}

interface SimpleTradeProps extends IBsModalInputs {
	id: number | undefined;
	symbolTitle: string;
	submitting: boolean;
	isLoadingBestLimit: boolean;
	highThreshold: number;
	lowThreshold: number;
	symbolType: TBsSymbolTypes;
	type: TBsTypes;
	mode: TBsModes;
	priceTickSize: number;
	quantityTickSize: number;
	switchable: boolean;
	isOption: boolean;
	userRemain: Broker.Remain | null;
	setInputValue: TSetBsModalInputs;
	setMinimumValue: () => void;
	createDraft: () => void;
	onSubmit: () => void;
}

const SimpleTrade = ({
	price,
	quantity,
	isOption,
	priceTickSize,
	quantityTickSize,
	symbolType,
	symbolTitle,
	validity,
	switchable,
	isLoadingBestLimit,
	value,
	submitting,
	highThreshold,
	lowThreshold,
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

	const { data: symbolExtraInfo } = useGlPositionExtraInfoQuery({
		queryKey: ['glPositionExtraInfoQuery'],
	});

	const { data: userRemain } = useUserRemainQuery({
		queryKey: ['userRemainQuery'],
	});

	const onSubmitForm = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit();
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

	const assets = symbolExtraInfo?.asset ?? 0;

	return (
		<form method='get' onSubmit={onSubmitForm} className='w-full flex-1 gap-24 flex-column'>
			<SwitchTab
				data={TABS}
				defaultActiveTab={side}
				classes={{
					root: '!border-light-gray-400',
					rect: side === 'buy' ? 'bg-light-success-100' : 'bg-light-error-100',
				}}
				onChangeTab={(tabId) => setInputValue('side', tabId as TBsSides)}
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'h-full flex-1 font-medium transition-colors',
							item.id === activeTab ? 'text-white' : 'text-light-gray-700',
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
							label={t('bs_modal.quantity_label')}
							value={quantity}
							onChange={(value) => setInputValue('quantity', value)}
							tickSize={quantityTickSize}
							low={1}
							high={1e5}
						/>

						{side === 'sell' && (
							<>
								<div className='text-tiny flex-justify-between'>
									<span className='text-light-gray-700'>{t('bs_modal.assets')}:</span>
									<span className='text-light-gray-800'>
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
							autoFocus
							label={t('bs_modal.price_label')}
							value={price}
							onChange={(value) => setInputValue('price', value)}
							tickSize={priceTickSize}
							high={highThreshold}
							low={lowThreshold}
							prefix={
								<>
									{isLoadingBestLimit ? (
										<div className='size-24 spinner' />
									) : (
										<button
											type='button'
											className={clsx(
												'size-24 transition-colors',
												priceLock ? 'text-light-primary-100' : 'text-light-gray-700',
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
							title={t.rich('bs_modal.cash_guarantee', {
								chunk: () => <span className='text-light-gray-800'>{sepNumbers(String(4e6))}</span>,
							})}
							value={
								<button type='button' className='text-light-info-100'>
									{t('bs_modal.change_guarantee_method')}
								</button>
							}
						/>
					)}

					{symbolType === 'base' && (
						<ValidityDate value={validity} onChange={(v) => setInputValue('validity', v)} />
					)}
				</div>

				<div className='w-full gap-16 border-t border-light-gray-200 pt-16 flex-column'>
					<div className='gap-12 flex-column'>
						{symbolType === 'option' && side === 'sell' && (
							<SummaryItem
								title={t('bs_modal.validity_date') + ':'}
								value={
									<span className='text-light-gray-800'>
										1<span className='text-light-gray-700'>{' ' + t('bs_modal.day')}</span>
									</span>
								}
							/>
						)}

						<SummaryItem
							title={t('bs_modal.total_amount') + ':'}
							value={
								<span className='text-light-gray-800'>
									{sepNumbers(String(value))}
									<span className='text-light-gray-700'>{' ' + t('common.toman')}</span>
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
		<span className='text-light-gray-700'>{title}</span>

		{value}
	</div>
);

export default SimpleTrade;
