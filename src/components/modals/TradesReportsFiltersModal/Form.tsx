import { useUserInfoQuery } from '@/api/queries/brokerPrivateQueries';
import ipcMain from '@/classes/IpcMain';
import RangeDatepicker from '@/components/common/Datepicker/RangeDatepicker';
import Select from '@/components/common/Inputs/Select';
import SymbolSearch from '@/components/common/Symbol/SymbolSearch';
import { useAppDispatch } from '@/features/hooks';
import { setTradesReportsFiltersModal } from '@/features/slices/modalSlice';
import { calculateDateRange } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect, type Dispatch, type SetStateAction } from 'react';

interface IFormProps {
	filters: Omit<TradesReports.ITradesReportsFilters, 'pageNumber' | 'pageSize'>;
	setFilters: Dispatch<SetStateAction<Omit<TradesReports.ITradesReportsFilters, 'pageNumber' | 'pageSize'>>>;
}

const Form = ({ filters, setFilters }: IFormProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const setFilterValue = <T extends keyof TradesReports.ITradesReportsFilters>(
		field: T,
		value: TradesReports.ITradesReportsFilters[T],
	) => {
		setFilters((prev) => ({
			...prev,
			date: field === 'fromDate' || field === 'toDate' ? 'dates.custom' : filters.date,
			[field]: value,
		}));
	};

	const { data: userData } = useUserInfoQuery({ queryKey: ['userInfoQuery'] });

	const onClose = () => {
		dispatch(setTradesReportsFiltersModal(null));
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		try {
			ipcMain.send('set_trades_reports_filters', filters);
		} catch (e) {
			//
		} finally {
			onClose();
		}
	};

	const onChangeSymbol = (value: Symbol.Search) => {
		if (value) setFilterValue('symbol', value);
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
					placeholder={t('trades_reports_page.dates_placeholder_filter')}
					defaultValue={filters.date}
				/>

				<RangeDatepicker
					fromDate={filters.fromDate}
					onChangeFromDate={(v) => setFilterValue('fromDate', v.getTime())}
					toDate={filters.toDate}
					onChangeToDate={(v) => setFilterValue('toDate', v.getTime())}
				/>

				<Select<OrdersReports.IOrdersReportsFilters['side']>
					onChange={(option) => setFilterValue('side', option)}
					options={
						userData?.isOption
							? [
									'All',
									'Buy',
									'Sell',
									'BuyIncremental',
									'BuyDecremental',
									'SellIncremental',
									'SellDecremental',
								]
							: ['All', 'Buy', 'Sell']
					}
					getOptionId={(option) => option}
					getOptionTitle={(option) => <span>{t(`orders_reports_page.side_${option}`)}</span>}
					placeholder={t('orders_reports_page.side_filters_placeholder_filter')}
					defaultValue={filters.side}
				/>
			</div>

			<button type='submit' className='h-40 flex-1 rounded px-56 py-8 font-medium btn-primary'>
				{t('common.confirm')}
			</button>
		</form>
	);
};

export default Form;
