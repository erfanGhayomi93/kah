import ipcMain from '@/classes/IpcMain';
import RangeDatepicker from '@/components/common/Datepicker/RangeDatepicker';
import InputLegend from '@/components/common/Inputs/InputLegend';
import MultiSelect from '@/components/common/Inputs/MultiSelect';
import Select from '@/components/common/Inputs/Select';
import { useAppDispatch } from '@/features/hooks';
import { setDepositWithReceiptReportsFiltersModal } from '@/features/slices/modalSlice';
import { calculateDateRange, convertStringToInteger } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect, type Dispatch, type SetStateAction } from 'react';

interface IFormProps {
	filters: Omit<DepositWithReceiptReports.DepositWithReceiptReportsFilters, 'pageNumber' | 'pageSize'>;
	setFilters: Dispatch<
		SetStateAction<Omit<DepositWithReceiptReports.DepositWithReceiptReportsFilters, 'pageNumber' | 'pageSize'>>
	>;
}

const Form = ({ filters, setFilters }: IFormProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const setFilterValue = <T extends keyof DepositWithReceiptReports.DepositWithReceiptReportsFilters>(
		field: T,
		value: DepositWithReceiptReports.DepositWithReceiptReportsFilters[T],
	) => {
		setFilters((prev) => ({
			...prev,
			date: field === 'fromDate' || field === 'toDate' ? 'dates.custom' : filters.date,
			[field]: value,
		}));
	};

	const onClose = () => {
		dispatch(setDepositWithReceiptReportsFiltersModal(null));
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		try {
			ipcMain.send('set_deposit_with_receipt_filters', filters);
		} catch (e) {
			//
		} finally {
			onClose();
		}
	};

	const onChangeState = (option: string[]) => {
		setFilterValue('status', option);
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
				<Select<TDateRange>
					onChange={(option) => setFilterValue('date', option)}
					options={['dates.day', 'dates.week', 'dates.month', 'dates.year', 'dates.custom']}
					getOptionId={(option) => option}
					getOptionTitle={(option) => <span>{t(option)}</span>}
					placeholder={t('deposit_with_receipt_reports_page.time_placeholder_filter')}
					defaultValue={filters.date}
				/>

				<RangeDatepicker
					fromDate={filters.fromDate}
					onChangeFromDate={(v) => setFilterValue('fromDate', v.getTime())}
					toDate={filters.toDate}
					onChangeToDate={(v) => setFilterValue('toDate', v.getTime())}
				/>

				<div className=' gap-32 flex-justify-start'>
					<InputLegend
						value={filters.fromPrice}
						onChange={(v) => setFilterValue('fromPrice', Number(convertStringToInteger(v)))}
						placeholder={t('deposit_with_receipt_reports_page.from_price_placeholder_filter')}
						prefix={t('common.rial')}
						maxLength={10}
					/>

					<InputLegend
						value={filters.toPrice}
						onChange={(v) => setFilterValue('toPrice', Number(convertStringToInteger(v)))}
						placeholder={t('deposit_with_receipt_reports_page.to_price_placeholder_filter')}
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
					getOptionTitle={(option) => <span>{t('states.state_' + option)}</span>}
					placeholder={t('deposit_with_receipt_reports_page.status_placeholder_filter')}
					defaultValues={filters.status}
				/>

				<div className=' gap-32 flex-justify-start'>
					<InputLegend
						value={filters.receiptNumber}
						onChange={(v) => setFilterValue('receiptNumber', convertStringToInteger(v))}
						placeholder={t('deposit_with_receipt_reports_page.receipt_number_placeholder_filter')}
						maxLength={48}
					/>
				</div>
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
					getOptionTitle={(option) => <span>{t(`deposit_with_receipt_reports_page.${option.label}`)}</span>}
					placeholder={t('deposit_with_receipt_reports_page.attachment_placeholder_filter')}
				/>
			</div>

			<button type='submit' className='h-40 flex-1 rounded px-56 py-8 font-medium btn-primary'>
				{t('common.confirm')}
			</button>
		</form>
	);
};

export default Form;
