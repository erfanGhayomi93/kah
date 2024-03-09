import Click from '@/components/common/Click';
import SwitchTab from '@/components/common/Tabs/SwitchTab';
import Tooltip from '@/components/common/Tooltip';
import {
	ArrowDownSVG,
	ArrowUpSVG,
	InfoCircleSVG,
	LockSVG,
	PayMoneySVG,
	SnowFlakeSVG,
	UnlockSVG,
} from '@/components/icons';
import { cn, rialToToman, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import Input from './common/Input';

interface PercentsProps {
	side: TBsSides;
	onClick: (p: number) => void;
}

const Percents = ({ side, onClick }: PercentsProps) => {
	const t = useTranslations();

	const percents = useMemo(() => [100, 75, 50, 25], []);

	return (
		<div className='flex gap-8'>
			{percents.map((p) => (
				<Tooltip
					key={p}
					placement='bottom'
					content={t(`bs_modal.${side === 'buy' ? 'purchase_power_value' : 'asset_value'}`, {
						v: `${p}%`,
					})}
				>
					<button
						key={p}
						type='button'
						className='h-28 flex-1 leading-8 text-gray-1000 flex-justify-center gray-box'
						onClick={() => onClick(p)}
					>
						{p}%
					</button>
				</Tooltip>
			))}
		</div>
	);
};

interface SimpleTradeProps extends IBsModalInputs {
	symbolType: TBsSymbolTypes;
	setInputValue: TSetBsModalInputs;
	createDraft: () => void;
	onSubmit: () => void;
}

const SimpleTrade = ({
	price,
	quantity,
	symbolType,
	validityDate,
	side,
	priceLock,
	expand,
	holdAfterOrder,
	collateral,
	createDraft,
	setInputValue,
	onSubmit,
}: SimpleTradeProps) => {
	const t = useTranslations();

	const [showValidityDates, setShowValidityDates] = useState(false);

	const onSubmitForm = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit();
	};

	const onClickPercentage = (percent: number) => {
		//
	};

	const TABS = useMemo(
		() => [
			{
				id: 'buy',
				title: t('side.buy'),
			},
			{
				id: 'sell',
				title: t('side.sell'),
			},
		],
		[],
	);

	const VALIDITY_DATES: Array<{ id: TBsValidityDates; title: string }> = useMemo(
		() => [
			{
				id: 'Day',
				title: t('bs_modal.validity_date_day'),
			},
			{
				id: 'Week',
				title: t('bs_modal.validity_date_week'),
			},
			{
				id: 'Month',
				title: t('bs_modal.validity_date_month'),
			},
			{
				id: 'GoodTillDate',
				title: t('bs_modal.validity_date_good_till_date'),
			},
			{
				id: 'GoodTillCancelled',
				title: t('bs_modal.validity_date_good_till_cancelled'),
			},
			{
				id: 'FillAndKill',
				title: t('bs_modal.validity_date_fill_and_kill'),
			},
		],
		[],
	);

	const validityDateTitle = useMemo(
		() => VALIDITY_DATES.find((item) => item.id === validityDate)?.title ?? '−',
		[validityDate],
	);

	return (
		<form method='get' onSubmit={onSubmitForm} className='w-full flex-1 justify-between gap-24 flex-column'>
			<div className='gap-24 flex-column'>
				<SwitchTab
					data={TABS}
					defaultActiveTab={side}
					classes={{
						root: 'bg-white',
						rect: side === 'buy' ? 'bg-success-100' : 'bg-error-100',
					}}
					onChangeTab={(tabId) => setInputValue('side', tabId as TBsSides)}
					renderTab={(item, activeTab) => (
						<button
							className={cn(
								'h-full flex-1 transition-colors',
								item.id === activeTab ? 'font-medium text-white' : 'text-gray-700',
							)}
							type='button'
						>
							{item.title}
						</button>
					)}
				/>

				<div className='gap-8 flex-column'>
					<Input
						autoFocus
						label={t('bs_modal.quantity_label')}
						value={quantity}
						onChange={(value) => setInputValue('quantity', value)}
						prepend={
							<div
								style={{
									flex: '0 0 4rem',
									gap: '0.2rem',
								}}
								className='h-full flex-column'
							>
								<button type='button' className='flex-1 rounded-sm flex-justify-center gray-box'>
									<ArrowUpSVG width='1.2rem' height='1.2rem' />
								</button>
								<button type='button' className='flex-1 rounded-sm flex-justify-center gray-box'>
									<ArrowDownSVG width='1.2rem' height='1.2rem' />
								</button>
							</div>
						}
					/>

					{side === 'sell' && <Percents side={side} onClick={onClickPercentage} />}
				</div>

				<Input
					label={t('bs_modal.price_label')}
					value={price}
					onChange={(value) => setInputValue('price', value)}
					prepend={
						<button
							style={{
								flex: '0 0 4rem',
							}}
							className={cn(
								'h-full rounded border transition-colors flex-justify-center',
								priceLock
									? 'border-primary-400 bg-secondary-100 text-primary-400'
									: 'border-gray-500 bg-white text-gray-900 hover:bg-primary-100',
							)}
							type='button'
							onClick={() => setInputValue('priceLock', !priceLock)}
						>
							{priceLock ? (
								<LockSVG width='2rem' height='2rem' />
							) : (
								<UnlockSVG width='2rem' height='2rem' />
							)}
						</button>
					}
				/>

				<div className='gap-8 flex-column'>
					<div className='h-40 gap-8 px-8 flex-justify-between gray-box'>
						<span className='whitespace-nowrap text-base text-gray-900'>
							{t('bs_modal.trade_value_label')}
						</span>

						<span className='truncate whitespace-nowrap text-left text-tiny text-gray-900'>
							<span className='pl-4 text-base font-medium text-gray-1000 ltr'>
								{sepNumbers(String(BigInt(price * quantity)))}
							</span>
							{t('common.rial')}
						</span>
					</div>

					{side === 'buy' && <Percents side={side} onClick={onClickPercentage} />}
				</div>

				{symbolType === 'option' && (
					<div className='h-40 gap-8 flex-items-center'>
						{side === 'sell' && (
							<>
								<button
									type='button'
									className={cn(
										'h-full flex-1 gap-8 transition-colors flex-justify-center gray-box',
										collateral === 'stock'
											? '!border-primary-400 bg-secondary-100 text-primary-400'
											: 'text-gray-900 hover:bg-primary-100',
									)}
								>
									<SnowFlakeSVG width='2rem' height='2rem' />
									{t('bs_modal.stock_collateral')}
								</button>
								<button
									type='button'
									className={cn(
										'h-full flex-1 gap-8 transition-colors flex-justify-center gray-box',
										collateral === 'cash'
											? '!border-primary-400 bg-secondary-100 text-primary-400'
											: 'text-gray-900 hover:bg-primary-100',
									)}
								>
									<PayMoneySVG width='2rem' height='2rem' />
									{t('bs_modal.cash_collateral')}
								</button>
							</>
						)}
					</div>
				)}

				{symbolType === 'base' && (
					<Click enabled onClickOutside={() => setShowValidityDates(false)}>
						<div className='relative'>
							<div
								onClick={() => setShowValidityDates(!showValidityDates)}
								className='h-40 cursor-pointer select-none gap-8 px-8 flex-justify-between gray-box'
							>
								<span className='whitespace-nowrap text-base text-gray-900'>
									{t('bs_modal.validity_date')}
								</span>

								<span className='gap-8 text-tiny text-primary-400 flex-items-center'>
									<span className='h-24 rounded border border-primary-400 bg-secondary-100 px-8 text-primary-400 flex-items-center'>
										{validityDateTitle}
									</span>
									<span className='text-gray-900'>
										<ArrowUpSVG width='1.2rem' height='1.2rem' />
									</span>
								</span>
							</div>

							{showValidityDates && (
								<ul
									style={{ top: 'calc(100% + 0.8rem)' }}
									className='absolute left-0 w-full flex-wrap gap-8 py-16 flex-justify-center gray-box'
								>
									{VALIDITY_DATES.map((item) => (
										<li style={{ flex: '0 0 8.8rem' }} key={item.id}>
											<button
												type='button'
												onClick={() => {
													setInputValue('validityDate', item.id);
													setShowValidityDates(false);
												}}
												className={cn(
													'h-32 w-full flex-1 rounded border transition-colors flex-justify-center',
													item.id === validityDate
														? 'border-primary-400 bg-secondary-100 text-primary-400'
														: 'border-gray-500 text-gray-1000 hover:bg-primary-100',
												)}
											>
												{item.title}
											</button>
										</li>
									))}
								</ul>
							)}
						</div>
					</Click>
				)}
			</div>

			<div className='gap-24 flex-column'>
				<div className='flex-justify-between'>
					<span className='gap-8 text-base text-gray-900 flex-items-center'>
						{t('bs_modal.total_amount')}:
						<InfoCircleSVG className='text-secondary-300' width='1.6rem' height='1.6rem' />
					</span>

					<span className='truncate whitespace-nowrap text-left text-tiny text-gray-900'>
						<span className='pl-4 text-base font-medium text-gray-1000 ltr'>
							{sepNumbers(String(rialToToman(price * quantity)))}
						</span>
						{t('common.toman')}
					</span>
				</div>

				<div className='flex gap-8'>
					<button
						type='submit'
						className={cn(
							'h-40 flex-1 rounded text-base font-medium',
							side === 'buy' ? 'btn-success' : 'btn-error',
						)}
					>
						{t(`side.${side}`)}
					</button>

					<button
						onClick={createDraft}
						type='button'
						className='h-40 rounded border border-secondary-300 bg-white px-16 text-base text-secondary-300'
					>
						{t('bs_modal.draft')}
					</button>
				</div>
			</div>
		</form>
	);
};

export default SimpleTrade;
