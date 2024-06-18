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
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import Checkbox, { type ICheckboxProps } from '../Inputs/Checkbox';
import Tooltip from '../Tooltip';
import styles from './SymbolStrategyTable.module.scss';

interface IInput {
	price: number;
	quantity: number;
	side: TBsSides;
}

interface IContractCheckList {
	symbol: boolean;
	requiredMargin?: boolean;
	tradeCommission?: boolean;
	strikeCommission?: boolean;
	tax?: boolean;
	vDefault?: boolean;
}

interface IFeatures {
	requiredMargin: boolean;
	tradeCommission: boolean;
	strikeCommission: boolean;
	tax: boolean;
	vDefault: boolean;
	contractSize: boolean;
}

export type TCheckboxes = Exclude<keyof IFeatures, 'contractSize'>;

interface OptionRendererProps extends ICheckboxProps {
	type: 'base' | 'option';
}

interface ISharedProps {
	features?: IFeatures;
	showDetails?: boolean;
	onDelete: (id: string) => void;
}

type SymbolStrategyProps = ISharedProps & {
	contract: TSymbolStrategy;
	checkList: IContractCheckList;
	onChange: (v: IInput) => void;
	onChecked: (name: TCheckboxes, value: boolean) => void;
	onSelect: (checked: boolean) => void;
};

interface SymbolStrategyTableProps extends ISharedProps {
	contracts: TSymbolStrategy[];
	selectedContracts: string[];
	maxHeight?: string | number;
	onSelectionChanged: (rows: string[]) => void;
	onChange: (id: string, v: IInput) => void;
	onToggleAll?: (name: TCheckboxes, value: boolean) => void;
	onChecked?: (id: string, name: TCheckboxes, value: boolean) => void;
}

const SymbolStrategyTable = ({
	selectedContracts,
	contracts,
	showDetails = true,
	maxHeight,
	features,
	onToggleAll,
	onChange,
	onChecked,
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

	const [symbolsChecklist, symbolsChecklistLength] = useMemo(() => {
		const symbols: Record<string, IContractCheckList> = {};
		const checkListLength: Record<Required<Exclude<keyof IContractCheckList, 'symbol'>>, number> = {
			requiredMargin: 0,
			tradeCommission: 0,
			strikeCommission: 0,
			tax: 0,
			vDefault: 0,
		};
		const l = contracts.length;

		try {
			for (let i = 0; i < l; i++) {
				const item = contracts[i];

				if (item.requiredMargin?.checked) checkListLength.requiredMargin++;
				if (item.tradeCommission?.checked) checkListLength.tradeCommission++;
				if (item.strikeCommission?.checked) checkListLength.strikeCommission++;
				if (item.tax?.checked) checkListLength.tax++;
				if (item.vDefault?.checked) checkListLength.vDefault++;

				symbols[item.symbol.symbolISIN] = {
					requiredMargin: Boolean(item.requiredMargin?.checked),
					tradeCommission: Boolean(item.tradeCommission?.checked),
					strikeCommission: Boolean(item.strikeCommission?.checked),
					tax: Boolean(item.tax?.checked),
					vDefault: Boolean(item.vDefault?.checked),
					symbol: selectedContracts.includes(item.id),
				};
			}
		} catch (e) {
			//
		}

		return [symbols, checkListLength];
	}, [contracts, selectedContracts]);

	const isAllContractsSelected = contracts.length > 0 && selectedContracts.length === contracts.length;

	return (
		<div className={styles.wrapper} style={{ maxHeight }}>
			<table className={styles.table}>
				<thead className={styles.thead}>
					<tr className={styles.tr}>
						<th className={`${styles.th} w-24 min-w-24`}>
							<Checkbox
								disabled={contracts.length === 0}
								checked={isAllContractsSelected}
								onChange={toggleAll}
							/>
						</th>

						<th className={`${styles.th} w-40 min-w-40`}>{t('side')}</th>

						<th className={styles.th}>{t('symbol')}</th>

						<th className={styles.th}>{t('type')}</th>

						<th className={styles.th}>{t('end_date')}</th>

						<th className={styles.th}>{t('strike_price')}</th>

						{features?.contractSize && <th className={styles.th}>{t('contract_size')}</th>}

						<th className={`${styles.th} w-96 min-w-88`}>
							<div className={styles.flex}>
								{t('price')}
								<Tooltip content={t('price_hint')} placement='top'>
									<span>
										<HintSVG />
									</span>
								</Tooltip>
							</div>
						</th>

						<th className={`${styles.th} w-96 min-w-88`}>{t('quantity')}</th>

						{features?.requiredMargin && (
							<th className={`${styles.th} w-104 pr-8`}>
								<Checkbox
									checked={symbolsChecklistLength.requiredMargin === contracts.length}
									onChange={() =>
										onToggleAll?.(
											'requiredMargin',
											symbolsChecklistLength.requiredMargin !== contracts.length,
										)
									}
									label={t('required_margin')}
									classes={{ text: '!text-tiny', label: '!gap-4' }}
								/>
							</th>
						)}

						{features?.tradeCommission && (
							<th className={`${styles.th} w-104 pr-8`}>
								<Checkbox
									checked={symbolsChecklistLength.tradeCommission === contracts.length}
									onChange={() =>
										onToggleAll?.(
											'tradeCommission',
											symbolsChecklistLength.tradeCommission !== contracts.length,
										)
									}
									label={t('trade_commission')}
									classes={{ text: '!text-tiny', label: '!gap-4' }}
								/>
							</th>
						)}

						{features?.strikeCommission && (
							<th className={`${styles.th} w-104 pr-8`}>
								<Checkbox
									checked={symbolsChecklistLength.strikeCommission === contracts.length}
									onChange={() =>
										onToggleAll?.(
											'strikeCommission',
											symbolsChecklistLength.strikeCommission !== contracts.length,
										)
									}
									label={t('strike_commission')}
									classes={{ text: '!text-tiny', label: '!gap-4' }}
								/>
							</th>
						)}

						{features?.tax && (
							<th className={`${styles.th} w-104 pr-8`}>
								<Checkbox
									checked={symbolsChecklistLength.tax === contracts.length}
									onChange={() =>
										onToggleAll?.('tax', symbolsChecklistLength.tax !== contracts.length)
									}
									label={t('tax')}
									classes={{ text: '!text-tiny', label: '!gap-4' }}
								/>
							</th>
						)}

						{features?.vDefault && (
							<th className={`${styles.th} w-104 pr-8`}>
								<Checkbox
									checked={symbolsChecklistLength.vDefault === contracts.length}
									onChange={() =>
										onToggleAll?.('vDefault', symbolsChecklistLength.vDefault !== contracts.length)
									}
									label={t('default')}
									classes={{ text: '!text-tiny', label: '!gap-4' }}
								/>
							</th>
						)}

						<th style={{ width: `${showDetails ? 56 : 32}px` }} className={styles.th} />
					</tr>
				</thead>

				<tbody className={styles.tbody}>
					{contracts.map((c) => (
						<SymbolStrategy
							key={c.id}
							contract={c}
							onDelete={onDelete}
							onChecked={(n, v) => onChecked?.(c.id, n, v)}
							onChange={(v) => onChange(c.id, v)}
							onSelect={(v) => onSelect(c, v)}
							features={features}
							showDetails={showDetails}
							checkList={symbolsChecklist[c.symbol.symbolISIN]}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};

const SymbolStrategy = ({
	contract,
	features,
	checkList,
	showDetails,
	onSelect,
	onChecked,
	onChange,
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
		side,
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

	const onSideChange = () => {
		if (type === 'option') setFieldValue('side', inputs.side === 'buy' ? 'sell' : 'buy');
		else
			toast.warning(t('can_not_change_base_symbol_side'), {
				toastId: 'can_not_change_base_symbol_side',
			});
	};

	useEffect(() => {
		if (inputs.price !== price || inputs.quantity !== quantity) {
			setDebounce(() => {
				onChange(inputs);
			}, 400);
		}
	}, [inputs]);

	return (
		<tr className={styles.tr}>
			<td className={styles.td}>
				<Checkbox checked={checkList.symbol} onChange={onSelect} />
			</td>

			<td className={styles.td}>
				<button
					onClick={onSideChange}
					type='button'
					className={clsx(
						'size-40 rounded font-normal transition-colors',
						type === 'base' && 'cursor-not-allowed',
						inputs.side === 'buy'
							? 'bg-light-success-100/10 text-light-success-100'
							: 'bg-light-error-100/10 text-light-error-100',
					)}
				>
					{t(`${inputs.side}`)}
				</button>
			</td>

			<td onClick={openSymbolInfo} className={clsx(styles.td, 'cursor-pointer')}>
				<span className='text-light-gray-800'>{symbol.symbolTitle}</span>
			</td>

			<td className={styles.td}>
				<span
					className={
						type === 'base'
							? 'text-light-gray-800'
							: symbol.optionType === 'call'
								? 'text-light-success-100'
								: 'text-light-error-100'
					}
				>
					{t(`${type === 'base' ? 'base_symbol' : symbol.optionType}`)}
				</span>
			</td>

			<td className={styles.td}>
				<span className='text-light-gray-800'>{type === 'base' ? '−' : dateFormatter()}</span>
			</td>

			<td className={styles.td}>
				<div
					onCopy={(e) => {
						if (type === 'option') copyNumberToClipboard(e, strikePrice);
					}}
					className='w-full flex-1 flex-justify-center'
				>
					<span className='text-light-gray-800'>
						{type === 'base' ? '−' : sepNumbers(String(strikePrice ?? 0))}
					</span>
				</div>
			</td>

			{features?.contractSize && (
				<td className={styles.td}>
					<span className='text-light-gray-800'>{sepNumbers(String(contractSize ?? 0))}</span>
				</td>
			)}

			<td className={styles.td}>
				<input
					maxLength={16}
					onCopy={(e) => copyNumberToClipboard(e, inputs.price)}
					type='text'
					name='price'
					inputMode='numeric'
					className='h-40 w-full rounded border border-light-gray-200 px-8 text-center ltr'
					value={sepNumbers(String(inputs.price))}
					onChange={(e) => setFieldValue('price', Number(convertStringToInteger(e.target.value)))}
				/>
			</td>

			<td className={styles.td}>
				<input
					maxLength={9}
					onCopy={(e) => copyNumberToClipboard(e, inputs.quantity)}
					type='text'
					name='quantity'
					inputMode='numeric'
					className='h-40 w-full rounded border border-light-gray-200 px-8 text-center ltr'
					value={sepNumbers(String(inputs.quantity))}
					onChange={(e) => setFieldValue('quantity', Number(convertStringToInteger(e.target.value)))}
				/>
			</td>

			{features?.requiredMargin && (
				<td className={`${styles.td} pr-8`}>
					<OptionCheckbox
						type={type}
						checked={Boolean(checkList?.requiredMargin)}
						disabled={!checkList.symbol}
						onChange={(v) => onChecked('requiredMargin', v)}
						label={sepNumbers(String(requiredMargin?.value))}
						classes={{ text: '!text-tiny' }}
					/>
				</td>
			)}

			{features?.tradeCommission && (
				<td className={`${styles.td} pr-8`}>
					<OptionCheckbox
						type={type}
						checked={Boolean(checkList?.tradeCommission)}
						disabled={!checkList.symbol}
						onChange={(v) => onChecked('tradeCommission', v)}
						label={sepNumbers(String(tradeCommission?.value ?? 0))}
						classes={{ text: '!text-tiny' }}
					/>
				</td>
			)}

			{features?.strikeCommission && (
				<td className={`${styles.td} pr-8`}>
					<OptionCheckbox
						type={type}
						checked={Boolean(checkList?.strikeCommission)}
						disabled={!checkList.symbol}
						onChange={(v) => onChecked('strikeCommission', v)}
						label={String(strikeCommission?.value ?? 0)}
						classes={{ text: '!text-tiny' }}
					/>
				</td>
			)}

			{features?.tax && (
				<td className={`${styles.td} pr-8`}>
					<OptionCheckbox
						type={type}
						checked={Boolean(checkList?.tax)}
						disabled={!checkList.symbol}
						onChange={(v) => onChecked('tax', v)}
						label={String(tax?.value ?? 0)}
						classes={{ text: '!text-tiny' }}
					/>
				</td>
			)}

			{features?.vDefault && (
				<td className={`${styles.td} pr-8`}>
					<OptionCheckbox
						type={type}
						checked={Boolean(checkList?.vDefault)}
						disabled={!checkList.symbol}
						onChange={(v) => onChecked('vDefault', v)}
						label={String(vDefault?.value ?? 0)}
						classes={{ text: '!text-tiny' }}
					/>
				</td>
			)}

			<td className={styles.td}>
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
			</td>
		</tr>
	);
};

const OptionCheckbox = ({ type, ...props }: OptionRendererProps) => {
	if (type === 'base') return '−';
	return <Checkbox {...props} classes={{ text: '!text-tiny', root: 'mx-auto' }} />;
};

export default SymbolStrategyTable;
