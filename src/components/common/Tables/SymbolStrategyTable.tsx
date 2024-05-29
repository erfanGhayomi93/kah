/* eslint-disable no-console */
import { HintSVG, InfoCircleOutlineSVG, TrashSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setOrderDetailsModal } from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { type IBaseSymbolDetails, type IOptionDetails } from '@/features/slices/types/modalSlice.interfaces';
import { useDebounce, useInputs } from '@/hooks';
import dayjs from '@/libs/dayjs';
import { convertStringToInteger, copyNumberToClipboard, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Checkbox, { type ICheckboxProps } from '../Inputs/Checkbox';
import Tooltip from '../Tooltip';
import styles from './SymbolStrategyTable.module.scss';

interface IInput {
	price: number;
	quantity: number;
}

interface OptionRendererProps extends ICheckboxProps {
	type: 'base' | 'option';
}

interface ISharedProps {
	features?: {
		withRequiredMargin: boolean;
		withTradeCommission: boolean;
		withStrikeCommission: boolean;
		withTax: boolean;
		withDefault: boolean;
		withContractSize: boolean;
	};
	showDetails?: boolean;
	onSideChange: (id: string, side: TBsSides) => void;
	onDelete: (id: string) => void;
}

type SymbolStrategyProps = ISharedProps & {
	contract: TSymbolStrategy;
	checked: boolean;
	onChange: (v: IInput) => void;
	onSelect: (checked: boolean) => void;
};

interface SymbolStrategyTableProps extends ISharedProps {
	contracts: TSymbolStrategy[];
	selectedContracts: string[];
	spacing?: string;
	onSelectionChanged: (rows: string[]) => void;
	onChange: (id: string, v: IInput) => void;
}

const SymbolStrategyTable = ({
	spacing = '8px 16px',
	selectedContracts,
	contracts,
	showDetails = true,
	features,
	onChange,
	onSideChange,
	onDelete,
	onSelectionChanged,
}: SymbolStrategyTableProps) => {
	const t = useTranslations('symbol_strategy');

	const toggleAll = () => {
		if (isAllContractsSelected) {
			onSelectionChanged([]);
		} else {
			onSelectionChanged(contracts.map((item) => item.id));
		}
	};

	const onSelect = (data: TSymbolStrategy, checked: boolean) => {
		const contracts = [...selectedContracts];
		const contractIndex = contracts.findIndex((orderId) => orderId === data.id);

		if (contractIndex === -1) {
			if (checked) contracts.push(data.id);
		} else {
			if (!checked) contracts.splice(contractIndex, 1);
		}

		onSelectionChanged(contracts);
	};

	const isContractSelected = (id: string): boolean => {
		return selectedContracts.findIndex((orderId) => orderId === id) > -1;
	};

	const isAllContractsSelected = contracts.length > 0 && selectedContracts.length === contracts.length;

	return (
		<div style={{ borderSpacing: spacing }} className={styles.table}>
			<div className={styles.thead}>
				<div className={styles.tr}>
					<div className={`${styles.th} w-24`}>
						<Checkbox
							disabled={contracts.length === 0}
							checked={isAllContractsSelected}
							onChange={toggleAll}
						/>
					</div>

					<div className={`${styles.th} w-40`}>{t('side')}</div>

					<div className={styles.th}>{t('symbol')}</div>

					<div className={`${styles.th} w-80`}>{t('type')}</div>

					<div className={`${styles.th} w-88`}>{t('end_date')}</div>

					<div className={`${styles.th} w-88`}>{t('strike_price')}</div>

					{features?.withContractSize && <div className={`${styles.th} w-88`}>{t('contract_size')}</div>}

					<div className={`${styles.th} w-88`}>
						<div className={styles.flex}>
							{t('price')}
							<Tooltip content={t('price_hint')} placement='top'>
								<span>
									<HintSVG />
								</span>
							</Tooltip>
						</div>
					</div>

					<div className={`${styles.th} w-88`}>{t('quantity')}</div>

					{features?.withRequiredMargin && (
						<div className={`${styles.th} w-88 pr-8`}>
							<Checkbox
								checked={false}
								onChange={console.log}
								label={t('required_margin')}
								classes={{ text: '!text-tiny', label: '!gap-4' }}
							/>
						</div>
					)}

					{features?.withTradeCommission && (
						<div className={`${styles.th} w-88 pr-8`}>
							<Checkbox
								checked={false}
								onChange={console.log}
								label={t('trade_commission')}
								classes={{ text: '!text-tiny', label: '!gap-4' }}
							/>
						</div>
					)}

					{features?.withStrikeCommission && (
						<div className={`${styles.th} w-88 pr-8`}>
							<Checkbox
								checked={false}
								onChange={console.log}
								label={t('strike_commission')}
								classes={{ text: '!text-tiny', label: '!gap-4' }}
							/>
						</div>
					)}

					{features?.withTax && (
						<div className={`${styles.th} w-88 pr-8`}>
							<Checkbox
								checked={false}
								onChange={console.log}
								label={t('tax')}
								classes={{ text: '!text-tiny', label: '!gap-4' }}
							/>
						</div>
					)}

					{features?.withDefault && (
						<div className={`${styles.th} w-88 pr-8`}>
							<Checkbox
								checked={false}
								onChange={console.log}
								label={t('default')}
								classes={{ text: '!text-tiny', label: '!gap-4' }}
							/>
						</div>
					)}

					<div className={`${styles.th} w-${showDetails ? '56' : '32'}`} />
				</div>
			</div>

			<div className={styles.tbody}>
				{contracts.map((c) => (
					<SymbolStrategy
						key={c.id}
						contract={c}
						checked={isContractSelected(c.id)}
						onChange={(v) => onChange(c.id, v)}
						onSideChange={onSideChange}
						onDelete={onDelete}
						onSelect={(v) => onSelect(c, v)}
						features={features}
						showDetails={showDetails}
					/>
				))}
			</div>
		</div>
	);
};

const SymbolStrategy = ({
	contract,
	features,
	checked,
	showDetails,
	onSelect,
	onChange,
	onSideChange,
	onDelete,
}: SymbolStrategyProps) => {
	const {
		id,
		type,
		side,
		symbol,
		tradeCommission,
		contractSize,
		settlementDay,
		strikePrice,
		requiredMargin,
		strikeCommission,
		tax,
		vDefault,
		price,
		quantity,
	} = contract;

	const t = useTranslations('symbol_strategy');

	const dispatch = useAppDispatch();

	const { setDebounce } = useDebounce();

	const { inputs, setFieldValue } = useInputs<IInput>({
		price,
		quantity,
	});

	const showInfo = () => {
		const symbolDetails: { base: IBaseSymbolDetails; option: IOptionDetails } = {
			base: {
				type: 'base',
				data: {
					quantity: inputs.quantity,
					price: inputs.price,
					side,
					symbolTitle: symbol.symbolTitle,
				},
			},
			option: {
				type: 'option',
				data: {
					...inputs,
					contractSize: contractSize ?? 0,
					settlementDay: settlementDay!,
					strikePrice: strikePrice!,
					requiredMargin: requiredMargin?.value ?? 0,
					strikeCommission: 0.0005,
					tradeCommission: tradeCommission?.value ?? 0,
					side,
					type: symbol.optionType!,
					symbolTitle: symbol.symbolTitle,
				},
			},
		};

		dispatch(setOrderDetailsModal(symbolDetails[type]));
	};

	const dateFormatter = () => {
		return dayjs(settlementDay).calendar('jalali').locale('fa').format('YYYY/MM/DD');
	};

	const openSymbolInfo = () => {
		dispatch(setSymbolInfoPanel(symbol.symbolISIN));
	};

	useEffect(() => {
		if (inputs.price !== price || inputs.quantity !== quantity) {
			setDebounce(() => {
				onChange(inputs);
			}, 400);
		}
	}, [inputs]);

	return (
		<div className={styles.tr}>
			<div className={styles.td}>
				<Checkbox checked={checked} onChange={onSelect} />
			</div>

			<div className={styles.td}>
				<button
					onClick={() => {
						if (type === 'option') onSideChange(id, side === 'buy' ? 'sell' : 'buy');
						else toast.warning(t('can_not_change_base_symbol_side'));
					}}
					type='button'
					className={clsx(
						'size-40 rounded font-normal transition-colors',
						type === 'base' && 'cursor-not-allowed',
						side === 'buy' ? 'bg-success-100/10 text-success-100' : 'bg-error-100/10 text-error-100',
					)}
				>
					{t(`${side}`)}
				</button>
			</div>

			<div onClick={openSymbolInfo} className={clsx(styles.td, 'cursor-pointer')}>
				<span className='text-gray-1000'>{symbol.symbolTitle}</span>
			</div>

			<div className={styles.td}>
				<span
					className={
						type === 'base'
							? 'text-gray-1000'
							: symbol.optionType === 'call'
								? 'text-success-100'
								: 'text-error-100'
					}
				>
					{t(`${type === 'base' ? 'base_symbol' : symbol.optionType}`)}
				</span>
			</div>

			<div className={styles.td}>
				<span className='text-gray-1000'>{type === 'base' ? '−' : dateFormatter()}</span>
			</div>

			<div className={styles.td}>
				<div
					onCopy={(e) => {
						if (type === 'option') copyNumberToClipboard(e, strikePrice);
					}}
					className='w-full flex-1 flex-justify-center'
				>
					<span className='text-gray-1000'>
						{type === 'base' ? '−' : sepNumbers(String(strikePrice ?? 0))}
					</span>
				</div>
			</div>

			{features?.withContractSize && (
				<div className={styles.td}>
					<span className='text-gray-1000'>{contractSize ?? 0}</span>
				</div>
			)}

			<div className={styles.td}>
				<input
					maxLength={16}
					onCopy={(e) => copyNumberToClipboard(e, inputs.price)}
					type='text'
					name='price'
					inputMode='numeric'
					className='h-40 w-full rounded border border-input px-8 text-center ltr'
					value={sepNumbers(String(inputs.price))}
					onChange={(e) => setFieldValue('price', Number(convertStringToInteger(e.target.value)))}
				/>
			</div>

			<div className={styles.td}>
				<input
					maxLength={9}
					onCopy={(e) => copyNumberToClipboard(e, inputs.quantity)}
					type='text'
					name='quantity'
					inputMode='numeric'
					className='h-40 w-full rounded border border-input px-8 text-center ltr'
					value={sepNumbers(String(inputs.quantity))}
					onChange={(e) => setFieldValue('quantity', Number(convertStringToInteger(e.target.value)))}
				/>
			</div>

			{features?.withRequiredMargin && (
				<div className={`${styles.td} pr-8`}>
					<OptionCheckbox
						type={type}
						checked={Boolean(requiredMargin?.checked)}
						disabled={!checked}
						onChange={console.log}
						label={sepNumbers(String(requiredMargin?.value))}
						classes={{ text: '!text-tiny' }}
					/>
				</div>
			)}

			{features?.withTradeCommission && (
				<div className={`${styles.td} pr-8`}>
					<OptionCheckbox
						type={type}
						checked={Boolean(tradeCommission?.checked)}
						disabled={!checked}
						onChange={console.log}
						label={sepNumbers(String(tradeCommission?.value ?? 0))}
						classes={{ text: '!text-tiny' }}
					/>
				</div>
			)}

			{features?.withStrikeCommission && (
				<div className={`${styles.td} pr-8`}>
					<OptionCheckbox
						type={type}
						checked={Boolean(strikeCommission?.checked)}
						disabled={!checked}
						onChange={console.log}
						label={String(strikeCommission?.value ?? 0)}
						classes={{ text: '!text-tiny' }}
					/>
				</div>
			)}

			{features?.withTax && (
				<div className={`${styles.td} pr-8`}>
					<OptionCheckbox
						type={type}
						checked={Boolean(tax?.checked)}
						disabled={!checked}
						onChange={console.log}
						label={String(tax?.value ?? 0)}
						classes={{ text: '!text-tiny' }}
					/>
				</div>
			)}

			{features?.withDefault && (
				<div className={`${styles.td} pr-8`}>
					<OptionCheckbox
						type={type}
						checked={Boolean(vDefault?.checked)}
						disabled={!checked}
						onChange={console.log}
						label={String(vDefault?.value ?? 0)}
						classes={{ text: '!text-tiny' }}
					/>
				</div>
			)}

			<div className={styles.td}>
				<div className='gap-8 flex-justify-center'>
					{showDetails && (
						<Tooltip placement='bottom' content={t('more_info')}>
							<button onClick={showInfo} type='button' className='size-24 flex-justify-center icon-hover'>
								<InfoCircleOutlineSVG className='2.4rem' height='2.4rem' />
							</button>
						</Tooltip>
					)}

					<Tooltip placement='bottom' content={t('remove')}>
						<button
							onClick={() => onDelete(id)}
							type='button'
							className='size-24 flex-justify-center icon-hover'
						>
							<TrashSVG className='2rem' height='2rem' />
						</button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

const OptionCheckbox = ({ type, ...props }: OptionRendererProps) => {
	if (type === 'base') return '−';
	return <Checkbox {...props} classes={{ text: '!text-tiny', root: 'mx-auto' }} />;
};

export default SymbolStrategyTable;
