import ipcMain from '@/classes/IpcMain';
import AdvancedDatepicker from '@/components/common/AdvanceDatePicker';
import MultiSelect from '@/components/common/Inputs/MultiSelect';
import Select from '@/components/common/Inputs/Select';
import SymbolSearch from '@/components/common/Symbol/SymbolSearch';
import { useAppDispatch } from '@/features/hooks';
import { setChangeBrokerReportsFiltersModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction } from 'react';

interface IFormProps {
	filters: Omit<ChangeBrokerReports.IChangeBrokerReportsFilters, 'pageNumber' | 'pageSize'>;
	setFilters: Dispatch<SetStateAction<Omit<ChangeBrokerReports.IChangeBrokerReportsFilters, 'pageNumber' | 'pageSize'>>>
}

const Form = ({ filters, setFilters }: IFormProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const setFilterValue = <T extends keyof ChangeBrokerReports.IChangeBrokerReportsFilters>(
		field: T,
		value: ChangeBrokerReports.IChangeBrokerReportsFilters[T],
	) => {
		setFilters((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const onClose = () => {
		dispatch(setChangeBrokerReportsFiltersModal(null));
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		try {
			ipcMain.send('set_changeBroker_reports_filters', filters);
		} catch (e) {
			//
		} finally {
			onClose();
		}
	};

	const onChangeSymbol = (value: Symbol.Search) => {
		if (value) setFilterValue('symbol', value);
	};

	const onChangeStatus = (options: string[]) => {
		setFilterValue('status', options);
	};

	return (
		<form onSubmit={onSubmit} method='get' className='gap-64 px-24 pb-24 flex-column'>
			<div className='gap-32 flex-column'>
				<SymbolSearch classes={{ root: 'py-12' }} value={filters.symbol} onChange={onChangeSymbol} />

				<Select<TDateRange>
					onChange={(option) => setFilterValue('date', option)}
					options={['dates.day', 'dates.week', 'dates.month', 'dates.year', 'dates.custom']}
					getOptionId={(option) => option}
					getOptionTitle={(option) => <span>{t(option)}</span>}
					placeholder={t('transactions_reports_page.dates_placeholder_filter')}
					defaultValue={filters.date}
				/>

				<div className='flex-1 gap-16 flex-justify-start'>
					<div className='flex-1'>
						<AdvancedDatepicker
							value={filters.fromDate}
							onChange={(v) => setFilterValue('fromDate', v.getTime())}
						/>
					</div>
					<div className='flex-1'>
						<AdvancedDatepicker
							value={filters.toDate}
							onChange={(v) => setFilterValue('toDate', v.getTime())}
						/>
					</div>
				</div>

				<MultiSelect<string>
					onChange={(options) => onChangeStatus(options)}
					options={[
						'Reception',
						'CancellByCustomer',
						'InProgress',
						'Done',
						'BankingAction',
						'Draft'
					]}
					getOptionId={(option) => option}
					getOptionTitle={(option) => <span>{t(`states.state_${option}`)}</span>}
					placeholder={t('change_broker_reports_page.status_placeholder_filter')}
					defaultValues={filters.status}
				/>

				<Select<{
					id: number;
					label: string;
				}>
					onChange={(option) => setFilterValue('attachment', Boolean(option.id))}
					options={[
						{ id: 0, label: 'has_not_attachment' },
						{ id: 1, label: 'has_attachment' },
					]}
					getOptionId={(option) => option.id}
					getOptionTitle={(option) => <span>{t(`deposit_with_receipt_page.${option.label}`)}</span>}
					placeholder={t('deposit_with_receipt_page.attachment_placeholder_filter')}
				/>

			</div>

			<button type='submit' className='h-40 flex-1 rounded px-56 py-8 font-medium btn-primary'>
				{t('common.confirm')}
			</button>
		</form>
	);
};

export default Form;
