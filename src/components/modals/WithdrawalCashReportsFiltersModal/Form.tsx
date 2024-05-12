import { useListUserBankAccountQuery } from '@/api/queries/requests';
import ipcMain from '@/classes/IpcMain';
import AdvancedDatepicker from '@/components/common/AdvanceDatePicker';
import InputLegend from '@/components/common/Inputs/InputLegend';
import MultiSelect from '@/components/common/Inputs/MultiSelect';
import Select from '@/components/common/Inputs/Select';
import { useAppDispatch } from '@/features/hooks';
import { setTransactionsFiltersModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction } from 'react';

interface IFormProps {
	filters: Omit<WithdrawalCashReports.WithdrawalCashReportsFilters, 'pageNumber' | 'pageSize'>;
	setFilters: Dispatch<
		SetStateAction<Omit<WithdrawalCashReports.WithdrawalCashReportsFilters, 'pageNumber' | 'pageSize'>>
	>;
}

const Form = ({ filters, setFilters }: IFormProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { data: userAccountData } = useListUserBankAccountQuery({
		queryKey: ['userAccount'],
	});

	const setFilterValue = <T extends keyof WithdrawalCashReports.WithdrawalCashReportsFilters>(
		field: T,
		value: WithdrawalCashReports.WithdrawalCashReportsFilters[T],
	) => {
		setFilters((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const onClose = () => {
		dispatch(setTransactionsFiltersModal(null));
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		try {
			ipcMain.send('set_withdrawal_cash_filters', filters);
		} catch (e) {
			//
		} finally {
			onClose();
		}
	};

	const onChangeState = (option: string[]) => {
		setFilterValue('status', option);
	};

	const onChangeBanks = (options: IUserBankAccount[]) => {
		setFilterValue('banks', options);
	};

	return (
		<form onSubmit={onSubmit} method='get' className='gap-64 px-24 pb-24 flex-column'>
			<div className='gap-32 flex-column'>
				<Select<DatesFilterType>
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

				<div className=' gap-32 flex-justify-start'>
					<InputLegend
						value={filters.fromPrice}
						onChange={(v) => setFilterValue('fromPrice', Number(v))}
						placeholder={t('transactions_reports_page.from_price_type_placeholder_filter')}
						prefix={t('common.rial')}
						maxLength={10}
					/>

					<InputLegend
						value={filters.toPrice}
						onChange={(v) => setFilterValue('toPrice', Number(v))}
						placeholder={t('transactions_reports_page.to_price_type_placeholder_filter')}
						prefix={t('common.rial')}
						maxLength={10}
					/>
				</div>

				<MultiSelect<string>
					onChange={(options) => onChangeState(options)}
					options={[
						'Canceled',
						'Financial',
						'Approved',
						'Reception',
						'Returned',
						'Rejected',
						'Finished',
						'Registeration',
					]}
					getOptionId={(option) => option}
					getOptionTitle={(option) => <span>{t('states.' + option)}</span>}
					placeholder={t('withdrawal_cash_reports_page.status_placeholder_filter')}
					defaultValues={filters.status}
				/>

				<MultiSelect<IUserBankAccount>
					onChange={(options) => onChangeBanks(options)}
					options={userAccountData ?? []}
					getOptionId={(option) => option.id}
					getOptionTitle={(option) => <span>{option.bankName}</span>}
					placeholder={t('withdrawal_cash_reports_page.bank_placeholder_filter')}
					defaultValues={filters.banks}
				/>
			</div>

			<button type='submit' className='h-40 flex-1 rounded px-56 py-8 font-medium btn-primary'>
				{t('common.confirm')}
			</button>
		</form>
	);
};

export default Form;
