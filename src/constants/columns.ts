export const defaultTransactionColumns: Array<IManageColumn<Transaction.TTransactionColumns>> = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
		tag: 'Transaction',
	},
	{
		id: 'date',
		title: 'زمان',
		hidden: false,
		tag: 'Transaction',
	},
	{
		id: 'transactionType',
		title: 'عملیات',
		hidden: false,
		tag: 'Transaction',
	},
	{
		id: 'description',
		title: 'شرح تراکنش',
		hidden: false,
		tag: 'Transaction',
	},
	{
		id: 'debit',
		title: 'بدهکار',
		hidden: false,
		tag: 'Transaction',
	},
	{
		id: 'credit',
		title: 'بستانکار',
		hidden: false,
		tag: 'Transaction',
	},
	{
		id: 'remaining',
		title: 'مانده',
		hidden: false,
		tag: 'Transaction',
	},
	{
		id: 'station',
		title: 'ایستگاه معاملاتی',
		hidden: false,
		tag: 'Transaction',
	},
];
export const defaultInstantDepositReportsColumn: Array<
	IManageColumn<InstantDepositReports.TInstantDepositReportsColumns>
> = [
	{
		id: 'id',
		title: 'شماره ردیف',
		hidden: false,
		tag: 'InstantDepositReports',
	},
	{
		id: 'saveDate',
		title: 'زمان',
		hidden: false,
		tag: 'InstantDepositReports',
	},
	{
		id: 'providerType',
		title: 'درگاه',
		hidden: false,
		tag: 'InstantDepositReports',
	},
	{
		id: 'reservationNumber',
		title: 'شماره پیگیری',
		hidden: false,
		tag: 'InstantDepositReports',
	},
	{
		id: 'amount',
		title: 'مقدار',
		hidden: false,
		tag: 'InstantDepositReports',
	},
	{
		id: 'state',
		title: 'وضعیت',
		hidden: false,
		tag: 'InstantDepositReports',
	},
];

export const defaultDepositWithReceiptReportsColumn: Array<
	IManageColumn<DepositWithReceiptReports.TDepositWithReceiptColumns>
> = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
		tag: 'DepositWithReceiptReports',
	},
	{
		id: 'receiptDate',
		title: 'زمان',
		hidden: false,
		tag: 'DepositWithReceiptReports',
	},
	{
		id: 'providerType',
		title: 'بانک کارگزاری',
		hidden: false,
		tag: 'DepositWithReceiptReports',
	},
	{
		id: 'receiptNumber',
		title: 'شماره فیش',
		hidden: false,
		tag: 'DepositWithReceiptReports',
	},
	{
		id: 'amount',
		title: 'مبلغ',
		hidden: false,
		tag: 'DepositWithReceiptReports',
	},
	{
		id: 'state',
		title: 'وضعیت',
		hidden: false,
		tag: 'DepositWithReceiptReports',
	},
	{
		id: 'action',
		title: 'عملیات',
		hidden: false,
		tag: 'DepositWithReceiptReports',
	},
];

export const defaultWithdrawalCashReportsColumn: Array<
	IManageColumn<WithdrawalCashReports.TWithdrawalCashReportsColumns>
> = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
	{
		id: 'saveDate',
		title: 'زمان درخواست',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
	{
		id: 'requestDate',
		title: 'موعد پرداخت',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
	{
		id: 'customerBank',
		title: 'بانک',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
	{
		id: 'requestAmount',
		title: 'مبلغ',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
	{
		id: 'channel',
		title: 'سامانه',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
	{
		id: 'state',
		title: 'وضعیت',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
	{
		id: 'action',
		title: 'عملیات',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
];

export const defaultChangeBrokerReportsColumns: Array<IManageColumn<ChangeBrokerReports.TChangeBrokerReportsColumns>> =
	[
		{
			id: 'id',
			title: 'ردیف',
			hidden: false,
			tag: 'ChangeBrokerReports',
		},
		{
			id: 'saveDate',
			title: 'زمان',
			hidden: false,
			tag: 'ChangeBrokerReports',
		},
		{
			id: 'gateway',
			title: 'سامانه',
			hidden: false,
			tag: 'ChangeBrokerReports',
		},
		{
			id: 'symbolTitle',
			title: 'نماد',
			hidden: false,
			tag: 'ChangeBrokerReports',
		},
		{
			id: 'lastState',
			title: 'وضعیت',
			hidden: false,
			tag: 'ChangeBrokerReports',
		},
		{
			id: 'action',
			title: 'عملیات',
			hidden: false,
			tag: 'ChangeBrokerReports',
		},
	];

export const defaultFreezeUnFreezeReportsColumns: Array<
	IManageColumn<FreezeUnFreezeReports.TFreezeUnFreezeReportsColumns>
> = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
		tag: 'FreezeUnFreezeReports',
	},
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
		tag: 'FreezeUnFreezeReports',
	},
	{
		id: 'confirmedOn',
		title: 'تاریخ درخواست',
		hidden: false,
		tag: 'FreezeUnFreezeReports',
	},
	{
		id: 'requestState',
		title: 'وضعیت',
		hidden: false,
		tag: 'FreezeUnFreezeReports',
	},
	{
		id: 'action',
		title: 'عملیات',
		hidden: false,
		tag: 'FreezeUnFreezeReports',
	},
];

export const defaultCashSettlementReportsColumns: Array<
	IManageColumn<CashSettlementReports.TCashSettlementReportsColumns>
> = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'side',
		title: 'سمت',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'openPositionCount',
		title: 'تعداد موقعیت باز',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'cashSettlementDate',
		title: 'تاریخ تسویه نقدی',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'pandLStatus',
		title: 'وضعیت قرارداد',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'settlementRequestType',
		title: 'نوع اعمال',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'incomeValue',
		title: 'مبلغ تسویه',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'requestCount',
		title: 'تعداد درخواست برای تسویه',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'doneCount',
		title: 'تعداد تسویه شده',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'userType',
		title: 'درخواست کننده',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'status',
		title: 'وضعیت',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'action',
		title: 'عملیات',
		hidden: false,
		tag: 'CashSettlementReports',
	},
];

export const defaultPhysicalSettlementReportsColumns: Array<
	IManageColumn<PhysicalSettlementReports.TPhysicalSettlementReportsColumns>
> = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'side',
		title: 'سمت',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'openPositionCount',
		title: 'تعداد موقعیت باز',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'cashSettlementDate',
		title: 'تاریخ تسویه نقدی',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'pandLStatus',
		title: 'وضعیت قرارداد',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'settlementRequestType',
		title: 'نوع اعمال',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'incomeValue',
		title: 'مبلغ تسویه',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'requestCount',
		title: 'تعداد درخواست برای تسویه',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'doneCount',
		title: 'تعداد پذیرفته شده',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'penValue',
		title: 'تعداد نکول',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'penVolume',
		title: 'مبلغ نکول',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'userType',
		title: 'درخواست کننده',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'status',
		title: 'وضعیت',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'action',
		title: 'عملیات',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
];

export const defaultOrdersReportsColumns: Array<IManageColumn<OrdersReports.TOrdersReportsColumns>> = [
	{
		id: 'orderId',
		title: 'ردیف',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'orderSide',
		title: 'سمت',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'orderDateTime',
		title: 'زمان',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'quantity',
		title: 'حجم کل',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'price',
		title: 'قیمت',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'sumExecuted',
		title: 'حجم انجام شده',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'lastErrorCode',
		title: 'وضعیت گزارش',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'validity',
		title: 'اعتبار',
		hidden: false,
		tag: 'OrdersReports',
	},
];

export const defaultTradesReportsColumns: Array<IManageColumn<TradesReports.TTradesReportsColumns>> = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
		tag: 'TradesReports',
	},
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
		tag: 'TradesReports',
	},
	{
		id: 'orderSide',
		title: 'سمت',
		hidden: false,
		tag: 'TradesReports',
	},

	{
		id: 'tradedQuantity',
		title: 'تعداد انجام شده',
		hidden: false,
		tag: 'TradesReports',
	},
	{
		id: 'tradePrice',
		title: 'قیمت',
		hidden: false,
		tag: 'TradesReports',
	},
	{
		id: 'totalQuota',
		title: 'کارمزد',
		hidden: false,
		tag: 'TradesReports',
	},
	{
		id: 'total',
		title: 'ارزش معامله',
		hidden: false,
		tag: 'TradesReports',
	},
	{
		id: 'tradeDate',
		title: 'زمان',
		hidden: false,
		tag: 'TradesReports',
	},
];

export const initialColumnsOptionChain: Array<IManageColumn<string>> = [
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
		tag: 'PanelDetail',
		disabled: true,
	},
	{
		id: 'tradeValue',
		title: 'ارزش روز',
		hidden: false,
		tag: 'PanelDetail',
	},
	{
		id: 'openPositionCount',
		title: 'موقعیت‌های باز',
		hidden: false,
		tag: 'PanelDetail',
	},
	{
		id: 'iotm',
		title: 'وضعیت',
		hidden: false,
		tag: 'PanelDetail',
	},
	{
		id: 'bestBuyPrice',
		title: 'بهترین خرید',
		hidden: false,
		tag: 'PanelDetail',
	},
	{
		id: 'bestSellPrice',
		title: 'بهترین فروش',
		hidden: false,
		tag: 'PanelDetail',
	},
	{
		id: 'strikePrice',
		title: 'اعمال',
		hidden: false,
		tag: 'PanelDetail',
	},
];
