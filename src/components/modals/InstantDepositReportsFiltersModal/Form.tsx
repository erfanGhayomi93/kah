import { userOnlineDepositProvidersQuery, userOnlineDepositStatusesQuery } from '@/api/queries/reportsQueries';
import ipcMain from '@/classes/IpcMain';
import AdvancedDatepicker from '@/components/common/AdvanceDatePicker';
import InputLegend from '@/components/common/Inputs/InputLegend';
import MultiSelect from '@/components/common/Inputs/MultiSelect';
import Select from '@/components/common/Inputs/Select';
import { useAppDispatch } from '@/features/hooks';
import { setInstantDepositReportsFiltersModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction } from 'react';

interface IFormProps {
	filters: Omit<InstantDepositReports.IInstantDepositReportsFilters, 'pageNumber' | 'pageSize'>;
	setFilters: Dispatch<
		SetStateAction<Omit<InstantDepositReports.IInstantDepositReportsFilters, 'pageNumber' | 'pageSize'>>
	>;
}

const Form = ({ filters, setFilters }: IFormProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const setFilterValue = <T extends keyof InstantDepositReports.IInstantDepositReportsFilters>(
		field: T,
		value: InstantDepositReports.IInstantDepositReportsFilters[T],
	) => {
		setFilters((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const { data: userStatusesData } = userOnlineDepositStatusesQuery({ queryKey: ['userOnlineDepositStatuses'] });

	const { data: userProvidersData } = userOnlineDepositProvidersQuery({
		queryKey: ['userOnlineDepositProviders']
	});


	const onClose = () => {
		dispatch(setInstantDepositReportsFiltersModal(null));
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		try {
			ipcMain.send('set_instant_deposit_reports_filters', filters);
		} catch (e) {
			//
		} finally {
			onClose();
		}
	};

	const onChangeProvider = (options: string[]) => {
		setFilterValue('providers', options);
	};

	const onChangeState = (options: string[]) => {
		setFilterValue('status', options);
	};

	return (
		<form onSubmit={onSubmit} method='get' className='gap-64 px-24 pb-24 flex-column'>
			<div className='gap-32 flex-column'>
				<Select<TDateRange>
					onChange={(option) => setFilterValue('date', option)}
					options={['dates.day', 'dates.week', 'dates.month', 'dates.year', 'dates.custom']}
					getOptionId={(option) => option}
					getOptionTitle={(option) => <span>{t(option)}</span>}
					placeholder={t('instant_deposit_reports_page.dates_placeholder_filter')}
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
						placeholder={t('instant_deposit_reports_page.from_price_placeholder_filter')}
						prefix={t('common.rial')}
						maxLength={10}
					/>

					<InputLegend
						value={filters.toPrice}
						onChange={(v) => setFilterValue('toPrice', Number(v))}
						placeholder={t('instant_deposit_reports_page.to_price_placeholder_filter')}
						prefix={t('common.rial')}
						maxLength={10}
					/>
				</div>

				<MultiSelect<string>
					onChange={(options) => onChangeProvider(options)}
					options={userProvidersData ?? []}
					getOptionId={(option) => option}
					getOptionTitle={(option) => <span>{t('bank_accounts.' + option)}</span>}
					placeholder={t('instant_deposit_reports_page.bank_placeholder_filter')}
					defaultValues={filters.providers}
				/>

				<MultiSelect<string>
					onChange={(options) => onChangeState(options)}
					options={userStatusesData ?? []}
					getOptionId={(option) => option}
					getOptionTitle={(option) => <span>{t(`states.state_${option}`)}</span>}
					placeholder={t('instant_deposit_reports_page.status_placeholder_filter')}
					defaultValues={filters.status}
				/>
			</div>

			<button type='submit' className='h-40 flex-1 rounded px-56 py-8 font-medium btn-primary'>
				{t('common.confirm')}
			</button>
		</form>
	);
};

export default Form;
