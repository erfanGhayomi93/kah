import { useCommissionsQuery } from '@/api/queries/commonQueries';
import { HintSVG, InfoCircleOutlineSVG, TrashSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setOrderDetailsModal } from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { type IBaseSymbolDetails, type IOptionDetails } from '@/features/slices/types/modalSlice.interfaces';
import { useInputs } from '@/hooks';
import dayjs from '@/libs/dayjs';
import { convertStringToInteger, copyNumberToClipboard, sepNumbers, toFixed } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import Checkbox, { type ICheckboxProps } from '../Inputs/Checkbox';
import Tooltip from '../Tooltip';
import styles from './SymbolStrategyTable.module.scss';

export interface IStrategyTableInput {
	price: number;
	quantity: number;
	strikePrice: number;
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
	commission?: Commission.Row;
	onChange: (v: IStrategyTableInput) => void;
	onChecked: (name: TCheckboxes, value: boolean) => void;
	onSelect: (checked: boolean) => void;
};

interface SymbolStrategyTableProps extends ISharedProps {
	contracts: TSymbolStrategy[];
	selectedContracts: string[];
	maxHeight?: string | number;
	onSelectionChanged: (rows: string[]) => void;
	onChange: (id: string, v: IStrategyTableInput) => void;
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

	const { data: commissions } = useCommissionsQuery({
		queryKey: ['commissionQuery'],
	});

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

				if (item.type === 'option') {
					if (item.requiredMargin) checkListLength.requiredMargin++;
					if (item.tradeCommission) checkListLength.tradeCommission++;
					if (item.strikeCommission) checkListLength.strikeCommission++;
					if (item.tax) checkListLength.tax++;
					if (item.vDefault) checkListLength.vDefault++;
				}

				symbols[item.symbol.symbolISIN] = {
					requiredMargin: Boolean(item.requiredMargin),
					tradeCommission: Boolean(item.tradeCommission),
					strikeCommission: Boolean(item.strikeCommission),
					tax: Boolean(item.tax),
					vDefault: Boolean(item.vDefault),
					symbol: selectedContracts.includes(item.id),
				};
			}
		} catch (e) {
			//
		}

		return [symbols, checkListLength];
	}, [contracts, selectedContracts]);

	const sortedContracts = useMemo(
		() => [...contracts].sort((a, b) => a.symbol.symbolTitle.localeCompare(b.symbol.symbolTitle)),
		[contracts],
	);

	const isAllContractsSelected = contracts.length > 0 && selectedContracts.length === contracts.length;

	const optionContractsLength = contracts.length > 0 && contracts.filter((item) => item.type === 'option').length;

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

						<th className={`${styles.th} w-96 min-w-88`}>{t('strike_price')}</th>

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
									checked={symbolsChecklistLength.requiredMargin === optionContractsLength}
									onChange={() =>
										onToggleAll?.(
											'requiredMargin',
											symbolsChecklistLength.requiredMargin !== optionContractsLength,
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
									checked={symbolsChecklistLength.tradeCommission === optionContractsLength}
									onChange={() =>
										onToggleAll?.(
											'tradeCommission',
											symbolsChecklistLength.tradeCommission !== optionContractsLength,
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
									checked={symbolsChecklistLength.strikeCommission === optionContractsLength}
									onChange={() =>
										onToggleAll?.(
											'strikeCommission',
											symbolsChecklistLength.strikeCommission !== optionContractsLength,
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
									checked={symbolsChecklistLength.tax === optionContractsLength}
									onChange={() =>
										onToggleAll?.('tax', symbolsChecklistLength.tax !== optionContractsLength)
									}
									label={t('tax')}
									classes={{ text: '!text-tiny', label: '!gap-4' }}
								/>
							</th>
						)}

						{features?.vDefault && (
							<th className={`${styles.th} w-104 pr-8`}>
								<Checkbox
									checked={symbolsChecklistLength.vDefault === optionContractsLength}
									onChange={() =>
										onToggleAll?.(
											'vDefault',
											symbolsChecklistLength.vDefault !== optionContractsLength,
										)
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
					{sortedContracts.map((contract) => (
						<SymbolStrategy
							key={contract.id}
							contract={contract}
							onDelete={onDelete}
							onChecked={(n, v) => onChecked?.(contract.id, n, v)}
							onChange={(v) => onChange(contract.id, v)}
							onSelect={(v) => onSelect(contract, v)}
							features={features}
							showDetails={showDetails}
							commission={commissions?.[contract.marketUnit]}
							checkList={symbolsChecklist[contract.symbol.symbolISIN]}
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
	commission,
	onSelect,
	onChecked,
	onChange,
	onDelete,
}: SymbolStrategyProps) => {
	const t = useTranslations('symbol_strategy');

	const dispatch = useAppDispatch();

	const { inputs, setFieldValue, setFieldsValue } = useInputs<IStrategyTableInput>({
		price: contract.price,
		quantity: contract.quantity,
		side: contract.side,
		strikePrice: contract.symbol.strikePrice ?? 0,
	});

	const showInfo = () => {
		const symbol = contract.symbol;

		const symbolDetails: { base: IBaseSymbolDetails; option: IOptionDetails } = {
			base: {
				type: 'base',
				data: {
					quantity: inputs.quantity,
					price: inputs.price,
					side: contract.side,
					symbolTitle: contract.symbol.symbolTitle,
				},
			},
			option: {
				type: 'option',
				data: {
					...inputs,
					contractSize: symbol.contractSize!,
					settlementDay: symbol.settlementDay!,
					strikePrice: symbol.strikePrice!,
					requiredMargin: symbol.requiredMargin!,
					strikeCommission: 0.0005,
					tradeCommission: Math.round(
						(!commission
							? 0
							: contract.price *
								contract.quantity *
								(contract.side === 'buy' ? commission.buyCommission : -commission.sellCommission)) *
							(symbol.contractSize ?? 0),
					),
					side: contract.side,
					type: symbol.optionType!,
					symbolTitle: symbol.symbolTitle,
				},
			},
		};

		dispatch(setOrderDetailsModal(symbolDetails[contract.type]));
	};

	const dateFormatter = () => {
		return dayjs(contract.symbol.settlementDay).calendar('jalali').locale('fa').format('YYYY/MM/DD');
	};

	const openSymbolInfo = () => {
		dispatch(setSymbolInfoPanel(contract.symbol.symbolISIN));
	};

	const onSideChange = () => {
		setFieldValue('side', inputs.side === 'buy' ? 'sell' : 'buy');
	};

	useEffect(() => {
		setFieldsValue({
			price: contract.price,
			quantity: contract.quantity,
			side: contract.side,
		});
	}, [contract.price, contract.quantity, contract.side]);

	useEffect(() => {
		onChange(inputs);
	}, [JSON.stringify(inputs)]);

	const amount = contract.price * contract.quantity;
	const contractSize = contract.type === 'base' ? 1 : contract.symbol.contractSize ?? 0;
	const tax = contract.side === 'buy' ? commission?.buyTax ?? 0 : commission?.sellTax ?? 0;
	const tradeCommission =
		(contract.side === 'buy' ? commission?.buyCommission ?? 0 : -(commission?.sellCommission ?? 0)) - tax;
	const strikeCommission =
		contract.side === 'buy' ? commission?.strikeBuyCommission ?? 0 : commission?.strikeSellCommission ?? 0;

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
						inputs.side === 'buy' ? 'bg-success-100/10 text-success-100' : 'bg-error-100/10 text-error-100',
					)}
				>
					{t(`${inputs.side}`)}
				</button>
			</td>

			<td onClick={openSymbolInfo} className={clsx(styles.td, 'cursor-pointer')}>
				<span className='text-gray-800'>{contract.symbol.symbolTitle}</span>
			</td>

			<td className={styles.td}>
				<span
					className={
						contract.type === 'base'
							? 'text-gray-800'
							: contract.symbol.optionType === 'call'
								? 'text-success-100'
								: 'text-error-100'
					}
				>
					{t(`${contract.type === 'base' ? 'base_symbol' : contract.symbol.optionType}`)}
				</span>
			</td>

			<td className={styles.td}>
				<span className='text-gray-800'>{contract.type === 'base' ? '−' : dateFormatter()}</span>
			</td>

			<td className={styles.td}>
				{contract.type === 'base' ? (
					'−'
				) : (
					<input
						maxLength={16}
						onCopy={(e) => copyNumberToClipboard(e, inputs.strikePrice)}
						type='text'
						name='price'
						inputMode='numeric'
						className='h-40 w-full rounded border border-gray-200 px-8 text-center ltr'
						value={sepNumbers(String(inputs.strikePrice))}
						onChange={(e) => setFieldValue('strikePrice', Number(convertStringToInteger(e.target.value)))}
					/>
				)}
			</td>

			{features?.contractSize && (
				<td
					className={styles.td}
					onCopy={(e) => {
						if (contract.type === 'option') copyNumberToClipboard(e, contract.symbol.contractSize);
					}}
				>
					{contract.type === 'base' ? (
						'−'
					) : (
						<span className='text-gray-800'>{sepNumbers(String(contract.symbol.contractSize ?? 0))}</span>
					)}
				</td>
			)}

			<td className={styles.td}>
				<input
					maxLength={16}
					onCopy={(e) => copyNumberToClipboard(e, inputs.price)}
					type='text'
					name='price'
					inputMode='numeric'
					className='h-40 w-full rounded border border-gray-200 px-8 text-center ltr'
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
					className='h-40 w-full rounded border border-gray-200 px-8 text-center ltr'
					value={sepNumbers(String(inputs.quantity))}
					onChange={(e) => setFieldValue('quantity', Number(convertStringToInteger(e.target.value)))}
				/>
			</td>

			{features?.requiredMargin && (
				<td className={`${styles.td} ${styles.right} pr-8`}>
					{contract.type === 'base' ? (
						'−'
					) : (
						<OptionCheckbox
							type={contract.type}
							checked={Boolean(checkList?.requiredMargin)}
							disabled={!checkList.symbol}
							onChange={(v) => onChecked('requiredMargin', v)}
							label={
								contract.side === 'buy' ? '0' : sepNumbers(String(contract.symbol.requiredMargin ?? 0))
							}
							classes={{ text: '!text-tiny' }}
						/>
					)}
				</td>
			)}

			{features?.tradeCommission && (
				<td className={`${styles.td} ${styles.right} pr-8`}>
					<OptionCheckbox
						type={contract.type}
						checked={Boolean(checkList?.tradeCommission)}
						disabled={!checkList.symbol}
						onChange={(v) => onChecked('tradeCommission', v)}
						label={toFixed(Math.abs(Math.round(amount * tradeCommission * contractSize)))}
						classes={{ text: '!text-tiny' }}
					/>
				</td>
			)}

			{features?.strikeCommission && (
				<td className={`${styles.td} ${styles.right} pr-8`}>
					{contract.type === 'base' ? (
						'−'
					) : (
						<OptionCheckbox
							type={contract.type}
							checked={Boolean(checkList?.strikeCommission)}
							disabled={!checkList.symbol}
							onChange={(v) => onChecked('strikeCommission', v)}
							label={Math.round(
								contract.quantity * contract.symbol.strikePrice * strikeCommission * contractSize,
							)}
							classes={{ text: '!text-tiny' }}
						/>
					)}
				</td>
			)}

			{features?.tax && (
				<td className={`${styles.td} ${styles.right} pr-8`}>
					<OptionCheckbox
						type={contract.type}
						checked={Boolean(checkList?.tax)}
						disabled={!checkList.symbol}
						onChange={(v) => onChecked('tax', v)}
						label={sepNumbers(String(Math.ceil(tax * amount * contractSize)))}
						classes={{ text: '!text-tiny' }}
					/>
				</td>
			)}

			{features?.vDefault && (
				<td className={`${styles.td} ${styles.right} pr-8`}>
					<OptionCheckbox
						type={contract.type}
						checked={Boolean(checkList?.vDefault)}
						disabled={!checkList.symbol}
						onChange={(v) => onChecked('vDefault', v)}
						label={String(0)}
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
							onClick={() => onDelete(contract.id)}
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
	return <Checkbox {...props} classes={{ text: 'ltr !text-tiny', root: 'mx-auto' }} />;
};

export default SymbolStrategyTable;
