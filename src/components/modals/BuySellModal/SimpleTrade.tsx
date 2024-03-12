import SwitchTab from '@/components/common/Tabs/SwitchTab';
import Tooltip from '@/components/common/Tooltip';
import { ArrowDownSVG, ArrowUpSVG, InfoCircleSVG, LockSVG, UnlockSVG } from '@/components/icons';
import { cn, rialToToman, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Input from './common/Input';
import SelectCollateral from './common/SelectColateral';
import ValidityDate from './common/ValidityDate';

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
						onClick={() => onClick(p / 100)}
					>
						{p}%
					</button>
				</Tooltip>
			))}
		</div>
	);
};

interface SimpleTradeProps extends IBsModalInputs {
	id: number | undefined;
	symbolType: TBsSymbolTypes;
	type: TBsTypes;
	mode: TBsModes;
	switchable: boolean;
	commission: Record<'buy' | 'sell' | 'default', number>;
	userRemain: Broker.Remain | null;
	setInputValue: TSetBsModalInputs;
	createDraft: () => void;
	onSubmit: () => void;
}

const SimpleTrade = ({
	id,
	price,
	quantity,
	symbolType,
	validity,
	switchable,
	value,
	validityDate,
	commission,
	userRemain,
	side,
	priceLock,
	type,
	mode,
	expand,
	holdAfterOrder,
	collateral,
	createDraft,
	setInputValue,
	onSubmit,
}: SimpleTradeProps) => {
	const t = useTranslations();

	const onSubmitForm = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit();
	};

	const onClickPercentage = (percent: number) => {
		try {
			if (side === 'buy') {
				if (userRemain) setInputValue('value', userRemain.purchasePower * percent);
				return;
			}

			if (side === 'sell') {
				// TODO: Calculate
			}
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
							disabled={item.disabled}
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
								{sepNumbers(String(value))}
							</span>
							{t('common.rial')}
						</span>
					</div>

					{side === 'buy' && <Percents side={side} onClick={onClickPercentage} />}
				</div>

				{symbolType === 'option' && (
					<div className='h-40 gap-8 flex-items-center'>
						{side === 'sell' && (
							<SelectCollateral value={collateral} onChange={(v) => setInputValue('collateral', v)} />
						)}
					</div>
				)}

				{symbolType === 'base' && (
					<ValidityDate value={validity} onChange={(v) => setInputValue('validity', v)} />
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
					{mode === 'create' && type === 'order' && (
						<button
							onClick={createDraft}
							type='button'
							className='h-40 rounded border border-secondary-300 bg-white px-16 text-base text-secondary-300'
						>
							{t('bs_modal.draft')}
						</button>
					)}

					<button
						type='submit'
						className={cn(
							'h-40 flex-1 rounded text-base font-medium',
							side === 'buy' ? 'btn-success' : 'btn-error',
						)}
					>
						{t(`bs_modal.${mode}_${type}_${side}`)}
					</button>
				</div>
			</div>
		</form>
	);
};

export default SimpleTrade;
