import { InfoCircleOutlineSVG, TrashSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import dayjs from '@/libs/dayjs';
import { convertStringToInteger, copyNumberToClipboard, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Checkbox from '../Inputs/Checkbox';
import styles from './SymbolStrategyTable.module.scss';

interface ISharedProps {
	withContractSize?: boolean;
	onChangePrice: (id: string, v: number) => void;
	onChangeQuantity: (id: string, v: number) => void;
	onSideChange: (id: string, side: TBsSides) => void;
	onDelete: (id: string) => void;
}

interface SymbolStrategyProps extends ISharedProps, ISymbolStrategyContract {
	checked: boolean;
	onSelect: (checked: boolean) => void;
}

interface SymbolStrategyTableProps extends ISharedProps {
	withRequiredMargin?: boolean;
	withCommission?: boolean;
	contracts: ISymbolStrategyContract[];
	selectedContracts: ISymbolStrategyContract[];
	spacing?: string;
	onSelectionChanged: (rows: ISymbolStrategyContract[]) => void;
}

const SymbolStrategyTable = ({
	spacing,
	selectedContracts,
	contracts,
	withCommission,
	withRequiredMargin,
	withContractSize,
	onChangePrice,
	onChangeQuantity,
	onSideChange,
	onDelete,
	onSelectionChanged,
}: SymbolStrategyTableProps) => {
	const t = useTranslations();

	const toggleAll = () => {
		if (isAllContractsSelected) {
			onSelectionChanged([]);
		} else {
			onSelectionChanged(contracts);
		}
	};

	const onSelect = (data: ISymbolStrategyContract, checked: boolean) => {
		const contracts = [...selectedContracts];
		const contractIndex = contracts.findIndex((item) => item.id === data.id);

		if (contractIndex === -1) {
			if (checked) contracts.push(data);
		} else {
			if (!checked) contracts.splice(contractIndex, 1);
		}

		onSelectionChanged(contracts);
	};

	const isContractSelected = (id: string): boolean => {
		return selectedContracts.findIndex((item) => item.id === id) > -1;
	};

	const isAllContractsSelected = selectedContracts.length === contracts.length;

	return (
		<table style={{ borderSpacing: spacing ?? '8px 16px' }} className={styles.table}>
			<thead className={styles.thead}>
				<tr className={styles.tr}>
					<th className={styles.th} style={{ width: '2.4rem' }}>
						<Checkbox checked={isAllContractsSelected} onChange={toggleAll} />
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
						onChangePrice={onChangePrice}
						onChangeQuantity={onChangeQuantity}
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
	quantity,
	price,
	strikePrice,
	settlementDay,
	contractSize,
	type,
	side,
	symbol,
	commission,
	requiredMargin,
	withContractSize,
	checked,
	onSelect,
	onChangePrice,
	onChangeQuantity,
	onSideChange,
	onDelete,
}: SymbolStrategyProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const dateFormatter = () => {
		return dayjs(settlementDay).calendar('jalali').locale('fa').format('YYYY/MM/DD');
	};

	const openSymbolInfo = () => {
		dispatch(setSymbolInfoPanel(symbol.symbolISIN));
	};

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
				<span className='text-gray-1000'>{t(`symbol_strategy.${type}`)}</span>
			</td>

			<td className={styles.td}>
				<span className='text-gray-1000'>{dateFormatter()}</span>
			</td>

			<td className={styles.td}>
				<div className='w-full flex-1 flex-justify-center'>
					<span className='text-gray-1000'>{sepNumbers(String(strikePrice ?? 0))}</span>
				</div>
			</td>

			{withContractSize && (
				<td className={styles.td}>
					<span className='text-gray-1000'>{contractSize}</span>
				</td>
			)}

			<td className={styles.td}>
				<input
					onCopy={(e) => copyNumberToClipboard(e, price)}
					type='text'
					name='price'
					inputMode='numeric'
					className='h-40 w-full rounded border border-input px-8 text-center ltr'
					value={sepNumbers(String(price))}
					onChange={(e) => onChangePrice(id, Number(convertStringToInteger(e.target.value)))}
				/>
			</td>

			<td className={styles.td}>
				<input
					onCopy={(e) => copyNumberToClipboard(e, quantity)}
					type='text'
					name='quantity'
					inputMode='numeric'
					className='h-40 w-full rounded border border-input px-8 text-center ltr'
					value={sepNumbers(String(quantity))}
					onChange={(e) => onChangeQuantity(id, Number(convertStringToInteger(e.target.value)))}
				/>
			</td>

			{requiredMargin && <td className={styles.td} />}

			{commission && <td className={styles.td} />}

			<td style={{ flex: '0 0 5.6rem' }} className={styles.td}>
				<div className='gap-8 flex-justify-center'>
					<button type='button' className='icon-hover'>
						<InfoCircleOutlineSVG className='2.4rem' height='2.4rem' />
					</button>
					<button onClick={() => onDelete(id)} type='button' className='icon-hover'>
						<TrashSVG className='2rem' height='2rem' />
					</button>
				</div>
			</td>
		</tr>
	);
};

export default SymbolStrategyTable;
