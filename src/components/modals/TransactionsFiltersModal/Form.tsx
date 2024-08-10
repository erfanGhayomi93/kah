import ipcMain from '@/classes/IpcMain';
import RangeDatepicker from '@/components/common/Datepicker/RangeDatepicker';
import MultiSelect from '@/components/common/Inputs/MultiSelect';
import Select from '@/components/common/Inputs/Select';
import SymbolSearch from '@/components/common/Symbol/SymbolSearch';
import { useAppDispatch } from '@/features/hooks';
import { setTransactionsFiltersModal } from '@/features/slices/modalSlice';
import { calculateDateRange } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect, type Dispatch, type SetStateAction } from 'react';

interface IFormProps {
	filters: Omit<Transaction.ITransactionsFilters, 'pageNumber' | 'pageSize'>;
	setFilters: Dispatch<SetStateAction<Omit<Transaction.ITransactionsFilters, 'pageNumber' | 'pageSize'>>>;
}

const Form = ({ filters, setFilters }: IFormProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const setFilterValue = <T extends keyof Transaction.ITransactionsFilters>(
		field: T,
		value: Transaction.ITransactionsFilters[T],
	) => {
		setFilters((prev) => ({
			...prev,
			date: field === 'fromDate' || field === 'toDate' ? 'dates.custom' : filters.date,
			[field]: value,
		}));
	};

	const onClose = () => {
		dispatch(setTransactionsFiltersModal(null));
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		try {
			ipcMain.send('set_transactions_filters', filters);
		} catch (e) {
			//
		} finally {
			onClose();
		}
	};

	const onChangeSymbol = (value: Symbol.Search) => {
		if (value) setFilterValue('symbol', value);
	};

	const onChangeTransactionType = (options: Array<{ id: Transaction.TransactionTypes; title: string }>) => {
		setFilterValue('transactionType', options);
	};

	useEffect(() => {
		if (filters.date === 'dates.custom') return;

		setFilters({
			...filters,
			...calculateDateRange(filters.date),
		});
	}, [filters.date]);

	return (
		<form onSubmit={onSubmit} method='get' className='gap-64 px-24 pb-24 flex-column'>
			<div className='gap-32 flex-column'>
				<SymbolSearch classes={{ root: 'py-12' }} value={filters.symbol} onChange={onChangeSymbol} />

				<Select<TDateRange>
					onChange={(option) => setFilterValue('date', option)}
					options={['dates.day', 'dates.week', 'dates.month', 'dates.year', 'dates.custom']}
					getOptionId={(option) => option}
					getOptionTitle={(option) => <span>{t(option)}</span>}
					placeholder={t('transactions_page.dates_placeholder_filter')}
					defaultValue={filters.date}
				/>

				<RangeDatepicker
					suppressDisableToDate={false}
					fromDate={filters.fromDate}
					onChangeFromDate={(v) => setFilterValue('fromDate', v.getTime())}
					toDate={filters.toDate}
					onChangeToDate={(v) => setFilterValue('toDate', v.getTime())}
				/>

				<MultiSelect<{ id: Transaction.TransactionTypes; title: string }>
					onChange={(options) => onChangeTransactionType(options)}
					options={[
						{ id: 'Buy', title: t('transactions_page.type_Buy') },
						{ id: 'Sell', title: t('transactions_page.type_Sell') },
						{ id: 'Deposit', title: t('transactions_page.type_Deposit') },
						{ id: 'Payment', title: t('transactions_page.type_Payment') },
					]}
					getOptionId={(option) => option.id}
					getOptionTitle={(option) => <span>{option.title}</span>}
					placeholder={t('transactions_page.actions_placeholder_filter')}
					defaultValues={filters.transactionType}
				/>

				<Select<Transaction.TransactionGroupModes>
					onChange={(option) => setFilterValue('groupMode', option)}
					options={['Flat', 'Grouped']}
					getOptionId={(option) => option}
					getOptionTitle={(option) => <span>{t(`transactions_page.display_type_group_${option}`)}</span>}
					placeholder={t('transactions_page.display_type_placeholder_filter')}
					defaultValue={filters.groupMode}
				/>
			</div>

			<button type='submit' className='h-40 flex-1 rounded px-56 py-8 font-medium btn-primary'>
				{t('common.confirm')}
			</button>
		</form>
	);
};

export default Form;
