export const defaultSymbolISIN = 'IRO1IKCO0001';

export const broadcastChannel = 'tUFN1pQ1Ry';

export const watchlistPriceBasis: TPriceBasis[] = ['LastTradePrice', 'ClosingPrice', 'BestLimitPrice'];

export const watchlistSymbolBasis: TStrategySymbolBasis[] = ['All', 'BestLimit'];

export const dateTypesAPI: Record<
	'daily' | 'weekly' | 'monthly' | 'yearly',
	'Today' | 'Weekly' | 'Monthly' | 'Yearly'
> = {
	daily: 'Today',
	weekly: 'Weekly',
	monthly: 'Monthly',
	yearly: 'Yearly',
};

export const editableOrdersStatus = ['OnBoardModify', 'OnBoard', 'PartOfTheOrderDone'];

export const initialDashboardLayout: Array<IManageColumn<TDashboardSections>> = [
	{
		id: 'market_state',
		title: 'وضعیت بازار',
		hidden: false,
	},
	{
		id: 'market_view',
		title: 'نمای بازار',
		hidden: false,
	},
	{
		id: 'best',
		title: 'برترین‌ها',
		hidden: false,
	},
	{
		id: 'option_contracts',
		title: 'قراردادهای اختیار',
		hidden: false,
	},
	{
		id: 'compare_transaction_value',
		title: 'مقایسه ارزش معاملات',
		hidden: false,
	},
	{
		id: 'option_market_process',
		title: 'روند بازار آپشن',
		hidden: false,
	},
	{
		id: 'option_trades_value',
		title: 'ارزش در معاملات اختیار',
		hidden: false,
	},
	{
		id: 'open_positions_process',
		title: 'روند موقعیت‌های باز',
		hidden: false,
	},
	{
		id: 'individual_and_legal',
		title: 'حقیقی و حقوقی',
		hidden: false,
	},
	{
		id: 'price_changes_watchlist',
		title: 'دیده بان تغییر قیمت - سهام',
		hidden: false,
	},
	{
		id: 'new_and_old',
		title: 'جدید و قدیم',
		hidden: false,
	},
	{
		id: 'top_base_assets',
		title: 'برترین دارایی‌های پایه',
		hidden: false,
	},
	{
		id: 'due_dates',
		title: 'سررسیدها',
		hidden: false,
	},
];

export const weekDaysName = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export const yearMonthsName = [
	'فروردین',
	'اردیبهشت',
	'خرداد',
	'تیر',
	'مرداد',
	'شهریور',
	'مهر',
	'آبان',
	'آذر',
	'دی',
	'بهمن',
	'اسفند',
];

export const getDateMilliseconds = {
	Day: 864e5,
	Week: 6048e5,
	Month: 2592e6,
	Year: 31536e6,
};
