import { useBaseSettlementDaysQuery, useWatchlistBySettlementDateQuery } from '@/api/queries/optionQueries';
import Checkbox from '@/components/common/Inputs/Checkbox';
import Select from '@/components/common/Inputs/Select';
import { TrashSVG } from '@/components/icons';
import dayjs from '@/libs/dayjs';
import { convertStringToInteger, copyNumberToClipboard, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo, useState } from 'react';

const initialErrors: IError = {
	settlementDay: false,
	strikePrice: false,
	quantity: false,
	price: false,
};

interface IError {
	settlementDay: boolean;
	strikePrice: boolean;
	quantity: boolean;
	price: boolean;
}

type ContractProps = IOrderBasket & {
	index: number;
	checked: boolean;
	setProperty: <T extends keyof IOrderBasket>(field: T, value: IOrderBasket[T]) => void;
	setProperties: (values: Partial<IOrderBasket>) => void;
	onSelect: (checked: boolean) => void;
	onDelete: () => void;
};

const Contract = ({
	baseSymbolISIN,
	symbolISIN,
	side,
	type,
	settlementDay,
	strikePrice,
	quantity,
	price,
	index,
	checked,
	setProperty,
	setProperties,
	onSelect,
	onDelete,
}: ContractProps) => {
	const t = useTranslations();

	const [errors, setErrors] = useState<IError>(initialErrors);

	const { data: settlementDays, isLoading: isFetchingSettlementDays } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', baseSymbolISIN],
	});

	const { data: watchlistData, isLoading: isLoadingWatchlistData } = useWatchlistBySettlementDateQuery({
		queryKey: [
			'watchlistBySettlementDateQuery',
			{
				baseSymbolISIN,
				settlementDate: settlementDay ?? '',
			},
		],
		enabled: Boolean(settlementDay),
	});

	const onClickCheckbox = () => {
		setErrors((prev) => ({
			...prev,
			settlementDay: settlementDay === null,
			price: price <= 0,
			quantity: quantity <= 0,
			strikePrice: strikePrice <= 0,
		}));
	};

	const dateFormatter = (d: string) => {
		return dayjs(d ?? '')
			.calendar('jalali')
			.locale('fa')
			.format('DD MMMM');
	};

	const setFieldError = (field: keyof IError, value: boolean) => {
		setErrors((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const onSideChange = (v: TOptionSides) => {
		if (!watchlistData) return;

		const optionType = v === 'call' ? 'Call' : 'Put';
		const symbol = watchlistData.find(
			({ symbolInfo }) => symbolInfo.optionType === optionType && strikePrice === symbolInfo.strikePrice,
		);

		if (!symbol) return;

		setProperties({
			type: v,
			symbolISIN: symbol.symbolInfo.symbolISIN,
		});
	};

	const settlementDayFormatter = useMemo<Option.BaseSettlementDays | null>(() => {
		if (!settlementDay) return null;

		return {
			baseSymbolISIN,
			contractEndDate: settlementDay,
			dueDays: -1,
			openPosition: -1,
			workingDaysLeftCount: -1,
			oneMonthTradeValue: -1,
		};
	}, [baseSymbolISIN, settlementDay]);

	const isDisabled = price <= 0 || quantity <= 0 || strikePrice <= 0 || settlementDay === null;

	useLayoutEffect(() => {
		try {
			if (!Array.isArray(watchlistData) || watchlistData.length === 0) return;

			const { symbolISIN, strikePrice } = watchlistData[0].symbolInfo;
			setProperties({
				symbolISIN,
				strikePrice,
			});
		} catch (e) {
			//
		}
	}, [watchlistData]);

	useLayoutEffect(() => {
		if (isDisabled && checked) onSelect(false);
	}, [isDisabled, checked]);

	return (
		<li
			key={symbolISIN}
			style={{
				top: `${index * 40 + index * 8}px`,
				transition: 'top 250ms ease',
			}}
			className='absolute left-0 h-40 w-full gap-8 px-16 flex-justify-start'
		>
			<div style={{ flex: '0 0 24px' }} className='h-40 flex-items-center'>
				<Checkbox disabled={isDisabled} checked={checked} onChange={onSelect} onClick={onClickCheckbox} />
			</div>

			<div style={{ flex: '0 0 40px' }}>
				<button
					onClick={() => setProperty('side', side === 'buy' ? 'sell' : 'buy')}
					type='button'
					className={clsx(
						'size-40 rounded transition-colors',
						side === 'buy' ? 'bg-success-100/10 text-success-100' : 'bg-error-100/10 text-error-100',
					)}
				>
					{side === 'buy' ? 'B' : 'S'}
				</button>
			</div>

			<div className='flex-1'>
				<Select<IBlackScholesModalStates['contractEndDate']>
					options={settlementDays ?? []}
					loading={isFetchingSettlementDays}
					defaultPopupWidth={176}
					defaultValue={settlementDayFormatter}
					getOptionId={(option) => option!.contractEndDate}
					getOptionTitle={(option) => dateFormatter(option!.contractEndDate)}
					onChange={(value) => {
						if (!value) return;

						setProperty('settlementDay', value.contractEndDate);
						setFieldError('settlementDay', false);
					}}
					classes={{
						root: '!px-8',
						border: errors.settlementDay && '!border-error-100',
						value: 'whitespace-nowrap',
					}}
				/>
			</div>

			<div style={{ flex: '0 0 86px' }} className='overflow-hidden'>
				<Select<Option.Root, number>
					loading={isLoadingWatchlistData}
					defaultValue={strikePrice}
					defaultPopupWidth={176}
					options={watchlistData ?? []}
					getOptionId={(value) => (typeof value === 'number' ? value : value.symbolInfo.symbolISIN)}
					getOptionTitle={(value) => {
						if (typeof value === 'number') return value;

						const { symbolTitle, strikePrice } = value.symbolInfo;

						return (
							<div className='w-full flex-1 flex-justify-between'>
								<span>{symbolTitle}</span>
								<span>{sepNumbers(String(strikePrice))}</span>
							</div>
						);
					}}
					getInputValue={(value) =>
						typeof value === 'number' ? value : sepNumbers(String(value.symbolInfo.strikePrice))
					}
					onChange={(v) => {
						setProperties({
							symbolISIN: v.symbolInfo.symbolISIN ?? '',
							strikePrice: v.symbolInfo.strikePrice ?? 0,
							type: v.symbolInfo.optionType === 'Call' ? 'call' : 'put',
						});
					}}
					classes={{
						root: '!px-8',
						value: '!text-base',
					}}
					disabled={settlementDay === null}
				/>
			</div>

			<div style={{ flex: '0 0 86px' }}>
				<Select<TOptionSides>
					options={['call', 'put']}
					defaultPopupWidth={120}
					defaultValue={type}
					getOptionId={(value) => value}
					getOptionTitle={(value) => t(`order_basket.${value}`)}
					onChange={(value) => value && onSideChange(value)}
					classes={{
						root: '!px-8',
						value: 'whitespace-nowrap',
					}}
					disabled={settlementDay === null || !watchlistData || watchlistData.length === 0}
				/>
			</div>

			<div style={{ flex: '0 0 64px' }}>
				<input
					onCopy={(e) => copyNumberToClipboard(e, quantity)}
					type='text'
					maxLength={6}
					inputMode='numeric'
					className={clsx(
						'h-40 w-full rounded border px-8 text-center ltr',
						errors.quantity ? '!border-error-100' : 'border-input',
					)}
					value={sepNumbers(String(quantity))}
					onChange={(e) => {
						setFieldError('quantity', false);
						setProperty('quantity', Number(convertStringToInteger(e.target.value)));
					}}
				/>
			</div>

			<div style={{ flex: '0 0 86px' }}>
				<input
					onCopy={(e) => copyNumberToClipboard(e, price)}
					type='text'
					inputMode='numeric'
					className={clsx(
						'h-40 w-full rounded border px-8 text-center ltr',
						errors.price ? '!border-error-100' : 'border-input',
					)}
					value={sepNumbers(String(price))}
					onChange={(e) => {
						setFieldError('price', false);
						setProperty('price', Number(convertStringToInteger(e.target.value)));
					}}
				/>
			</div>

			<div style={{ flex: '0 0 24px' }} className='h-40 flex-items-center'>
				<button onClick={onDelete} type='button' className='text-gray-900'>
					<TrashSVG className='2rem' height='2rem' />
				</button>
			</div>
		</li>
	);
};

export default Contract;
