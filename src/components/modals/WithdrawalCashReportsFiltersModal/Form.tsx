import { userCashWithdrawalStatusesQuery } from '@/api/queries/reportsQueries';
import { useListUserBankAccountQuery } from '@/api/queries/requests';
import ipcMain from '@/classes/IpcMain';
import AdvancedDatepicker from '@/components/common/AdvanceDatePicker';
import InputLegend from '@/components/common/Inputs/InputLegend';
import MultiSelect from '@/components/common/Inputs/MultiSelect';
import Select from '@/components/common/Inputs/Select';
import { useAppDispatch } from '@/features/hooks';
import { setWithdrawalCashReportsFiltersModal } from '@/features/slices/modalSlice';
import { calculateDateRange, convertStringToInteger } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect, type Dispatch, type SetStateAction } from 'react';

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

	const { data: userStatusesData } = userCashWithdrawalStatusesQuery({ queryKey: ['userOnlineDepositStatuses'] });

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
		dispatch(setWithdrawalCashReportsFiltersModal(null));
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		try {
			ipcMain.send('set_withdrawal_cash_reports_filters', filters);
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

	useEffect(() => {
		if (filters.date === 'dates.custom') return;

		setFilters({
			...filters,
			...calculateDateRange(filters.date)
		});
	}, [filters.date]);

	return (
		<form onSubmit={onSubmit} method='get' className='gap-64 px-24 pb-24 flex-column'>
			<div className='gap-32 flex-column'>
				<Select<TDateRange>
					onChange={(option) => setFilterValue('date', option)}
					options={['dates.day', 'dates.week', 'dates.month', 'dates.year', 'dates.custom']}
					getOptionId={(option) => option}
					getOptionTitle={(option) => <span>{t(option)}</span>}
					placeholder={t('withdrawal_cash_reports_page.time_placeholder_filter')}
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
						onChange={(v) => setFilterValue('fromPrice', Number(convertStringToInteger(v)))}
						placeholder={t('withdrawal_cash_reports_page.from_price_placeholder_filter')}
						prefix={t('common.rial')}
						maxLength={10}
					/>

					<InputLegend
						value={filters.toPrice}
						onChange={(v) => setFilterValue('toPrice', Number(convertStringToInteger(v)))}
						placeholder={t('withdrawal_cash_reports_page.to_price_placeholder_filter')}
						prefix={t('common.rial')}
						maxLength={10}
					/>
				</div>

				<MultiSelect<string>
					onChange={(options) => onChangeState(options)}
					options={userStatusesData ?? []}
					getOptionId={(option) => option}
					getOptionTitle={(option) => <span>{t('states.state_' + option)}</span>}
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
