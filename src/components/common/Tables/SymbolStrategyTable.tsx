import { InfoCircleOutlineSVG, TrashSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useDebounce, useInputs } from '@/hooks';
import dayjs from '@/libs/dayjs';
import { convertStringToInteger, copyNumberToClipboard, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import Checkbox from '../Inputs/Checkbox';
import Tooltip from '../Tooltip';
import styles from './SymbolStrategyTable.module.scss';

interface IInput {
	price: number;
	quantity: number;
}

interface ISharedProps {
	withContractSize?: boolean;
	onSideChange: (id: string, side: TBsSides) => void;
	onDelete: (id: string) => void;
}

type SymbolStrategyProps = ISharedProps &
	TSymbolStrategy & {
		checked: boolean;
		onChange: (v: IInput) => void;
		onSelect: (checked: boolean) => void;
	};

interface SymbolStrategyTableProps extends ISharedProps {
	withRequiredMargin?: boolean;
	withCommission?: boolean;
	contracts: TSymbolStrategy[];
	selectedContracts: string[];
	spacing?: string;
	onSelectionChanged: (rows: string[]) => void;
	onChange: (id: string, v: IInput) => void;
}

const SymbolStrategyTable = ({
	spacing,
	selectedContracts,
	contracts,
	withCommission,
	withRequiredMargin,
	withContractSize,
	onChange,
	onSideChange,
	onDelete,
	onSelectionChanged,
}: SymbolStrategyTableProps) => {
	const t = useTranslations();

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
		<table style={{ borderSpacing: spacing ?? '8px 16px' }} className={styles.table}>
			<thead className={styles.thead}>
				<tr className={styles.tr}>
					<th className={styles.th} style={{ width: '2.4rem' }}>
						<Checkbox
							disabled={contracts.length === 0}
							checked={isAllContractsSelected}
							onChange={toggleAll}
						/>
					</th>
					<th className={styles.th} style={{ width: '4rem' }}>
						{t('symbol_strategy.side')}
					</th>
					<th className={styles.th} style={{ width: '12rem' }}>
						{t('symbol_strategy.symbol')}
					</th>
					<th style={{ width: '8rem' }} className={styles.th}>
						{t('symbol_strategy.type')}
					</th>
					<th className={styles.th}>{t('symbol_strategy.end_date')}</th>
					<th className={styles.th}>{t('symbol_strategy.strike_price')}</th>
					{withContractSize && <th className={styles.th}>{t('symbol_strategy.contract_size')}</th>}
					<th className={styles.th}>{t('symbol_strategy.price')}</th>
					<th className={styles.th}>{t('symbol_strategy.quantity')}</th>
					{withRequiredMargin && <th className={styles.th}>{t('symbol_strategy.required_margin')}</th>}

					{withCommission && <th className={styles.th}>{t('symbol_strategy.commission')}</th>}

					<th className={styles.th} style={{ width: '5.6rem' }} />
				</tr>
			</thead>
			<tbody className={styles.tbody}>
				{contracts.map((item) => (
					<SymbolStrategy
						key={item.id}
						{...item}
						checked={isContractSelected(item.id)}
						withContractSize={Boolean(withContractSize)}
						onChange={(v) => onChange(item.id, v)}
						onSideChange={onSideChange}
						onDelete={onDelete}
						onSelect={(v) => onSelect(item, v)}
					/>
				))}
			</tbody>
		</table>
	);
};

const SymbolStrategy = ({
	id,
	type,
	quantity,
	price,
	strikePrice,
	settlementDay,
	contractSize,
	side,
	symbol,
	commission,
	requiredMargin,
	withContractSize,
	checked,
	onSelect,
	onChange,
	onSideChange,
	onDelete,
}: SymbolStrategyProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { setDebounce } = useDebounce();

	const { inputs, setFieldValue } = useInputs<IInput>({
		price,
		quantity,
	});

	const showInfo = () => {
		// dispatch(
		// 	setOrderDetailsModal({
		// 		type: type === 'base' ? 'order' : 'option',
		// 		data: {
		// 			...inputs,
		// 			contractSize,
		// 			settlementDay,
		// 			strikePrice,
		// 			requiredMargin: requiredMargin.value,
		// 			strikeCommission: 0.0005,
		// 			tradeCommission: commission.value,
		// 			side,
		// 			type: symbol.optionType,
		// 			symbolTitle: symbol.symbolTitle,
		// 		},
		// 	}),
		// );
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
		<tr className={styles.tr}>
			<td className={styles.td}>
				<Checkbox checked={checked} onChange={onSelect} />
			</td>

			<td className={styles.td}>
				<button
					onClick={() => onSideChange(id, side === 'buy' ? 'sell' : 'buy')}
					type='button'
					className={clsx(
						'size-40 rounded font-normal transition-colors',
						side === 'buy' ? 'bg-success-100/10 text-success-100' : 'bg-error-100/10 text-error-100',
					)}
				>
					{t(`side.${side}`)}
				</button>
			</td>

			<td onClick={openSymbolInfo} className={clsx(styles.td, 'cursor-pointer')}>
				<span className='text-gray-1000'>{symbol.symbolTitle}</span>
			</td>

			<td className={styles.td}>
				<span
					className={
						type === 'base'
							? 'text-gray-1000'
							: symbol.optionType === 'call'
								? 'text-success-100'
								: 'text-error-100'
					}
				>
					{t(`symbol_strategy.${type === 'base' ? 'base_symbol' : symbol.optionType}`)}
				</span>
			</td>

			<td className={styles.td}>
				<span className='text-gray-1000'>{type === 'base' ? '−' : dateFormatter()}</span>
			</td>

			<td className={styles.td}>
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
			</td>

			{withContractSize && (
				<td className={styles.td}>
					<span className='text-gray-1000'>{contractSize}</span>
				</td>
			)}

			<td className={styles.td}>
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
			</td>

			<td className={styles.td}>
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
			</td>

			{requiredMargin?.checked && <td className={styles.td} />}

			{commission?.checked && <td className={styles.td} />}

			<td style={{ flex: '0 0 5.6rem' }} className={styles.td}>
				<div className='gap-8 flex-justify-center'>
					<Tooltip placement='bottom' content={t('tooltip.more_info')}>
						<button onClick={showInfo} type='button' className='icon-hover'>
							<InfoCircleOutlineSVG className='2.4rem' height='2.4rem' />
						</button>
					</Tooltip>

					<Tooltip placement='bottom' content={t('tooltip.remove')}>
						<button onClick={() => onDelete(id)} type='button' className='icon-hover'>
							<TrashSVG className='2rem' height='2rem' />
						</button>
					</Tooltip>
				</div>
			</td>
		</tr>
	);
};

export default SymbolStrategyTable;
