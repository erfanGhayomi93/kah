import ipcMain from '@/classes/IpcMain';
import AdvancedDatepicker from '@/components/common/AdvanceDatePicker';
import MultiSelect from '@/components/common/Inputs/MultiSelect';
import Select from '@/components/common/Inputs/Select';
import SymbolSearch from '@/components/common/Symbol/SymbolSearch';
import { useAppDispatch } from '@/features/hooks';
import { setCashSettlementReportsFiltersModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction } from 'react';

interface IFormProps {
	filters: Omit<CashSettlementReports.ICashSettlementReportsFilters, 'pageNumber' | 'pageSize'>;
	setFilters: Dispatch<SetStateAction<Omit<CashSettlementReports.ICashSettlementReportsFilters, 'pageNumber' | 'pageSize'>>>;
}

const Form = ({ filters, setFilters }: IFormProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const setFilterValue = <T extends keyof CashSettlementReports.ICashSettlementReportsFilters>(
		field: T,
		value: CashSettlementReports.ICashSettlementReportsFilters[T],
	) => {
		setFilters((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const onClose = () => {
		dispatch(setCashSettlementReportsFiltersModal(null));
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		try {
			ipcMain.send('set_cash_settlement_reports_filters', filters);
		} catch (e) {
			//
		} finally {
			onClose();
		}
	};

	const onChangeSymbol = (value: Symbol.Search) => {
		if (value) setFilterValue('symbol', value);
	};

	const onChangeRequestStatus = (options: Array<{
		id: CashSettlementReports.TRequestStatusType;
		title: string;
	}>) => {
		setFilterValue('requestStatus', options);
	};

	const onChangeSettlementRequestType = (options: Array<{
		id: CashSettlementReports.TSettlementRequestTypeCashType;
		title: string;
	}>) => {
		setFilterValue('settlementRequestType', options);
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


				<Select<'Profit' | 'Loss' | 'Indifferent' | 'All'>
					onChange={(option) => setFilterValue('contractStatus', option)}
					options={['Profit', 'Loss', 'Indifferent', 'All']}
					getOptionId={(option) => option}
					getOptionTitle={(option) => (
						<span>{t(`cash_settlement_reports_page.type_contract_status_${option}`)}</span>
					)}
					placeholder={t('freeze_and_unfreeze_reports_page.status_placeholder_filter')}
					defaultValue={filters.contractStatus}
				/>




				<MultiSelect<{ id: CashSettlementReports.TSettlementRequestTypeCashType, title: string }>
					onChange={(options) => onChangeSettlementRequestType(options)}
					options={[
						{ id: 'MaximumStrike', title: t('cash_settlement_reports_page.type_request_settlement_MaximumStrike') },
						{ id: 'PartialStrike', title: t('cash_settlement_reports_page.type_request_settlement_PartialStrike') },
					]}
					getOptionId={(option) => option.id}
					getOptionTitle={(option) => <span>{t(`cash_settlement_reports_page.type_request_settlement_${option.id}`)}</span>}
					placeholder={t('cash_settlement_reports_page.request_type_placeholder_filter')}
					defaultValues={filters.settlementRequestType}
				/>

				<MultiSelect<{ id: CashSettlementReports.TRequestStatusType, title: string }>
					onChange={(options) => onChangeRequestStatus(options)}
					options={[
						{ id: 'Registered', title: t('cash_settlement_reports_page.type_status_Registered') },
						{ id: 'Draft', title: t('cash_settlement_reports_page.type_status_Draft') }
					]}
					getOptionId={(option) => option.id}
					getOptionTitle={(option) => <span>{t(`cash_settlement_reports_page.type_status_${option.id}`)}</span>}
					placeholder={t('cash_settlement_reports_page.request_status_type_placeholder_filter')}
					defaultValues={filters.requestStatus}
				/>


			</div>

			<button type='submit' className='h-40 flex-1 rounded px-56 py-8 font-medium btn-primary'>
				{t('common.confirm')}
			</button>
		</form>
	);
};

export default Form;
