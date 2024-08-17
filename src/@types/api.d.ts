declare namespace Common {
	type Time = string;
}

declare namespace Option {
	export type IOTM = 'ATM' | 'OTM' | 'ITM';

	export interface Root {
		/**
		 * اطلاعات نماد
		 */
		symbolInfo: SymbolInfo;

		/**
		 * اطلاعات اختیار نماد
		 */
		optionWatchlistData: Watchlist;
	}

	export interface SymbolInfo {
		/**
		 * آیدی نماد
		 */
		symbolISIN: string;
		/**
		 * آیدی نماد پایه
		 */
		baseSymbolISIN: string;
		/**
		 * روز‌های باقی مانده
		 */
		dueDays: number;
		insCode: string;
		/**
		 * قیمت اعمال
		 */
		strikePrice: number;
		/**
		 * نام نماد
		 */
		symbolTitle: string;
		/**
		 * نام نماد پایه
		 */
		baseSymbolTitle: string;
		/**
		 * اندازه قرارداد
		 */
		contractSize: number;
		/**
		 * تاریخ سررسید
		 */
		contractEndDate: string;
		/**
		 * نوع قرارداد
		 */
		optionType: 'Call' | 'Put';
		/**
		 * وجه تضمین اولیه
		 */
		initialMargin: number;
		/**
		 * نام صنعت
		 */
		sectorName: string;
		/**
		 * آیدی شرکت
		 */
		companyISIN: string;
		/**
		 * اسم شرکت
		 */
		companyName: string;
		/**
		 * آیدی مارکت
		 */
		marketUnit: string;
	}

	export interface Watchlist {
		/**
		 * آیدی نماد
		 */
		symbolISIN: string;
		/**
		 * آیدی شرکت
		 */
		companyISIN: string;
		/**
		 * پرمیوم / آخرین قیمت
		 */
		premium: number;
		/**
		 * درصد آخرین قیمت
		 */
		tradePriceVarPreviousTradePercent: number;
		/**
		 * درصد آخرین قیمت پایه
		 */
		baseTradePriceVarPreviousTradePercent: number;
		/**
		 * درصد قیمت پایانی پایه
		 */
		baseClosingPriceVarReferencePricePercent: number;
		/**
		 * درصد قیمت پایانی
		 */
		closingPriceVarReferencePricePercent: number;
		/**
		 * قیمت نماد پایه / آخرین قیمت پایه
		 */
		baseSymbolPrice: number;
		/**
		 * سر به سر
		 */
		breakEvenPoint: number;
		/**
		 * اهرم
		 */
		leverage: number;
		/**
		 * تعداد موقعیت‌های باز
		 */
		openPositionCount: number;
		/**
		 * نوسان پذیری ضمنی
		 */
		impliedVolatility: number;
		/**
		 * بهترین قیمت خرید
		 */
		bestBuyPrice: number;
		/**
		 * بهترین قیمت فروش
		 */
		bestSellPrice: number;
		/**
		 * قیمت پایانی
		 */
		closingPrice: number;
		/**
		 * نوسان پذیری
		 */
		historicalVolatility: number;
		/**
		 * ارزش زمانی
		 */
		timeValue: number;
		/**
		 * بلک شولز
		 */
		blackScholes: number;
		/**
		 * دلتا
		 */
		delta: number;
		/**
		 * تتا
		 */
		theta: number;
		/**
		 * رو
		 */
		rho: number;
		/**
		 * وگا
		 */
		vega: number;
		/**
		 * گاما
		 */
		gamma: number;
		/**
		 * لامبدا
		 */
		lambda: number;
		/**
		 * تعداد معاملات
		 */
		tradeCount: number;
		/**
		 * شکاف / اسپرد
		 */
		spread: number;
		/**
		 * اختلاف بلک شولز
		 */
		blackScholesDifference: number;
		/**
		 * قیمت پایانی پایه
		 */
		baseClosingPrice: number;
		/**
		 * وجه تضمین لازم
		 */
		requiredMargin: number;
		/**
		 * رشد
		 */
		growth: number;
		/**
		 * پر ارزش
		 */
		contractValueType: string;
		/**
		 * موقعیت‌های باز زیاد
		 */
		highOpenPosition: string;
		/**
		 * حجم خرید حقیقی
		 */
		individualBuyVolume: number;
		/**
		 * حجم فروش حقیقی
		 */
		individualSellVolume: number;
		/**
		 * حجم خرید حقوقی
		 */
		legalBuyVolume: number;
		/**
		 * حجم فروش حقوقی
		 */
		legalSellVolume: number;
		/**
		 * تاریخ آخرین معامله
		 */
		lastTradeDate: string;
		/**
		 * ارزش مفهومی معاملات / ارزش ذاتی
		 */
		notionalValue: number;
		/**
		 * O/I TM
		 */
		iotm: IOTM;
		/**
		 * ارزش ذاتی
		 */
		intrinsicValue: number;
		/**
		 * ارزش معاملات
		 */
		tradeValue: number;
		/**
		 * حجم معاملات
		 */
		tradeVolume: number;
	}

	export interface BaseSearch {
		symbolISIN: string;
		symbolTitle: string;
		companyISIN: string;
		companyName: string;
		insCode: null | string;
		symbolTradeState: Symbol.TradeState;
	}

	export interface Search {
		strikePrice: number;
		symbolISIN: string;
		symbolTitle: string;
		companyISIN: string;
		companyName: string;
		insCode: string;
		symbolTradeState: Symbol.TradeState;
		marketUnit: string;
		isOption: boolean;
	}

	export interface CustomWatchlistSearch {
		isInWatchlist: boolean;
		symbolISIN: string;
		symbolTitle: string;
		companyISIN: string;
		companyName: string;
		insCode: string;
		symbolTradeState: Symbol.TradeState;
		marketUnit: string;
		isOption: boolean;
	}

	export interface BaseSettlementDays {
		baseSymbolISIN: string;
		contractEndDate: string;
		dueDays: number;
		workingDaysLeftCount: number;
		tradeValue: number;
		openPosition: number;
		maxCOP: number;
		maxop: number;
		maxcaop: number;
	}

	export interface GetOpenPositionReport {
		baseSymbolISIN: string;
		date: string;
		openPositionSum: number;
	}

	export interface Column {
		id: number;
		title: OptionWatchlistColumns;
		category: string;
		isHidden: boolean;
		order: number;
	}

	export interface CalculativeInfo {
		breakEvenPoint: number;
		leverage: number;
		delta: number;
		theta: number;
		gamma: number;
		vega: number;
		requiredMargin: number;
		impliedVolatility: number;
		historicalVolatility: number;
		wiv: number;
		intrinsicValue: number;
		timeValue: number;
		iotm: IOTM;
		initialMargin: number;
	}

	export interface WatchlistList {
		id: number;
		name: string;
		isHidden: boolean;
	}

	export interface OpenPositionChart {
		saveDate: string;
		openPosition: number;
	}

	export interface BaseOpenPositionChart {
		saveDate: string;
		openPosition: number;
	}

	export interface NotionalValueChart {
		intervalDateTime: string;
		notionalValue: number;
	}
}

declare namespace Symbol {
	export type TradeState = 'NULL' | 'Reserved' | 'Suspended' | 'Open' | 'Frozen' | null;

	export interface Info {
		symbolISIN: string;
		symbolTitle: string;
		companyName: string;
		companyISIN: string;
		insCode: string;
		lastTradedPrice: number;
		tradePriceVarPreviousTrade: number;
		tradePriceVarPreviousTradePercent: number;
		closingPrice: number;
		strikePrice: null | number;
		closingPriceVarReferencePrice: number;
		closingPriceVarReferencePricePercent: number;
		lowThreshold: number;
		highThreshold: number;
		lowPrice: number;
		highPrice: number;
		tradeValue: number;
		tradeVolume: number;
		cancellationNAV: number;
		oneMonthAvgVolume: null | number;
		hv: null | number;
		avgIV: null | number;
		lastTradeDate: string;
		openPrice: number;
		baseVolume: number;
		tradeCount: number;
		eps: null | number;
		pe: null | number;
		ps: null | number;
		symbolTradeState: TradeState;
		individualBuyVolume: number;
		numberOfIndividualsBuyers: number;
		individualSellVolume: number;
		numberOfIndividualsSellers: number;
		legalBuyVolume: number;
		numberOfILegalsBuyers: number;
		legalSellVolume: number;
		numberOfLegalsSellers: number;
		baseSymbolISIN: string;
		marketUnit: string;
		notionalValue: number;
		contractEndDate: string;
		openPosition: number;
		contractSize: number;
		isOption: boolean;
		oneMonthEfficiency: null | number;
		threeMonthEfficiency: null | number;
		oneYearEfficiency: null | number;
		exchange: string;
		yesterdayClosingPrice: number;
		baseSymbolTitle: string;
		demandValueSum: number;
		supplyValueSum: number;
		orderQuantityTickSize: number;
		orderPriceTickSize: number;
		initialMargin: number;
		baseSymbolPrice: number;
		contractType: 'Call' | 'Put';
	}

	export interface Search {
		symbolISIN: string;
		symbolTitle: string;
		companyISIN: string;
		isOption: boolean;
		isFreeze?: boolean;
		marketUnit: string;
		companyName: string;
		insCode: null | string;
		symbolTradeState: Symbol.TradeState;
	}

	export interface BestLimit {
		symbolISIN: string;
		rowIndex: number;
		bestBuyLimitPrice: number;
		bestSellLimitPrice: number;
		bestBuyLimitQuantity: number;
		bestSellLimitQuantity: number;
		numberOfOrdersAtBestBuy: number;
		numberOfOrdersAtBestSell: number;
	}

	export interface SameSector {
		insCode: string;
		companyISIN: string;
		symbolTitle: string;
		symbolISIN: string;
		marketCode: string;
		companyName: string;
		enCompanyName: string;
		highestTradePriceOfTradingDay: number;
		lowestTradePriceOfTradingDay: number;
		closingPrice: number;
		openPrice: number;
		yesterdayClosingPrice: number;
		highThreshold: number;
		lowThreshold: number;
		totalNumberOfSharesTraded: number;
		totalNumberOfTrades: number;
		totalTradeValue: number;
		lastTradedPrice: number;
		lastTradedDate: string;
		lastTradeDateTime: string;
		firstTradedPrice: number;
		preClosingPrice: number;
		lastTradedPriceVar: number;
		lastTradedPriceVarPercent: number;
		closingPriceVar: number;
		closingPriceVarPercent: number;
		symbolGroupCode: string;
		bestBuyLimitQuantity: number;
		bestSellLimitQuantity: number;
		minTradeQuantity: number;
		maxTradeQuantity: number;
		numberOfOrdersAtBestBuy: number;
		numberOfOrdersAtBestSell: number;
		bestBuyPrice: number;
		bestBuyLimitPrice_1: number;
		bestSellPrice: number;
		bestSellLimitPrice_1: number;
		sectorCode: string;
		unitCount: number;
		orderPriceTickSize: number;
		baseVolume: number;
		floatFree: number;
		pe: number;
		oneMonthEfficiency: number;
		sixMonthEfficiency: number;
		threeMonthEfficiency: number;
		oneYearEfficiency: number;
		eps: number;
		threeMonthTradeVolume: number;
		ps: number;
		marketUnit: string;
		symbolOrderState: string;
		symbolTradeState: Symbol.TradeState;
		groupState: string;
		symbolState: string;
		companyCode: string;
		tickPrice: number;
		tickQuantity: number;
		sectorPE: string;
		floatingStock: string;
		estimatedEPS: string;
		fiscalYear: string;
		symbolType: string;
		bourseKey: string;
		exchange: string;
		isOption: boolean;
		isBaseFreezed: boolean;
		symbolTag: string;
		navIssueDate: string;
		navIssuePrice: number;
		navCancellationPrice: number;
		contractSize: number;
		isValid: boolean;
		initialMargin: number;
		requiredMargin: number;
		isIpo: boolean;
		isFreeze: boolean;
		openPosition: number;
		totalPosition: number;
		baseSymbolISIN: string;
		baseSymbolTitle: string;
	}

	export interface ChartData {
		o: number;
		h: number;
		l: number;
		c: number;
		x: number;
		v: number;
	}

	export interface SymbolType {
		insCode: string;
		companyISIN: string;
		symbolTitle: string;
		companyName: string;
		enCompanyName: string;
		highestTradePriceOfTradingDay: number;
		lowestTradePriceOfTradingDay: number;
		closingPrice: number;
		openPrice: number;
		highThreshold: number;
		lowThreshold: number;
		totalNumberOfSharesTraded: number;
		totalNumberOfTrades: number;
		totalTradeValue: number;
		lastTradedPrice: number;
		lastTradedDate: string;
		firstTradedPrice: number;
		preClosingPrice: number;
		lastTradedPriceVar: number;
		lastTradedPriceVarPercent: number;
		closingPriceVar: number;
		closingPriceVarPercent: number;
		symbolGroupCode: number | string;
		bestBuyLimitQuantity_1: number;
		bestSellLimitQuantity_1: number;
		numberOfOrdersAtBestBuy_1: number;
		numberOfOrdersAtBestSell_1: number;
		bestBuyLimitPrice_1: number;
		bestSellLimitPrice_1: number;
		sectorCode: string;
		unitCount: number;
		marketUnit: MarketUnit;
		orderPriceTickSize: number;
		baseVolume: number;
		symbolOrderState: string;
		symbolTradeState: string;
		groupState: string;
		symbolState: string;
	}
}

declare namespace OAuthAPI {
	declare interface ILoginFirstStep {
		state: 'NewUser' | 'OTP' | 'TooManyRequest' | 'HasPassword' | 'Fail';
		otpRemainSecond: number;
		nextStepToken: string | null;
	}

	declare interface ISendPasslessOTP {
		state: 'NewUser' | 'OTP' | 'TooManyRequest' | 'HasPassword' | 'Fail';
		otpRemainSecond: number;
		nextStepToken: string | null;
	}

	declare interface IForgetPasswordFirstStep {
		otpRemainSecond: number;
		nextStepToken: string;
	}

	declare interface IValidateForgetPasswordOtp {
		nextStepToken: string;
		responseMessage: string;
	}

	declare type IChangePassword = string;

	declare interface IPasswordLogin {
		message: string;
		token: string | null;
	}

	declare interface IChangeForgottenPassword {
		result: string;
	}

	declare interface ISignUp {
		message: string;
		token: string | null;
	}

	declare interface IOtpLogin {
		message: string;
		token: string | null;
	}
}

declare namespace User {
	interface IUserInformation {
		hasPassword: boolean;
		mobile: string;
		saveDate: string;
	}

	interface Broker {
		id: number;
		brokerCode: string | number;
		name: string;
		shortName: string;
		description: string;
		logo: null | string;
		ssoUrl: string;
	}
}

declare namespace Saturn {
	type SymbolTab = 'tab_market_depth' | 'tab_chart' | 'tab_my_asset';

	type OptionTab = 'price_information' | 'computing_information' | 'market_depth' | 'open_position' | 'tab_chart';

	interface Template {
		id: number;
		name: string;
		content: string;
		isPinned: boolean;
	}

	interface ContentOption {
		symbolTitle: string;
		symbolISIN: string;
		activeTab: OptionTab;
	}

	interface Content {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		activeTab: SymbolTab;
		options: ContentOption[];
	}
}

declare namespace Broker {
	export type TRemainStatus = 'Normal' | 'AtRisk' | 'CallMargin';

	export type UrlKey =
		| 'OverallRemain'
		| 'TvChartSave'
		| 'MarketMapSectors'
		| 'TvChartStudyTemplate'
		| 'PortfolioSymbols'
		| 'WatchListList'
		| 'OrderGetToday'
		| 'SettingSessionEnd'
		| 'AccountOfflineDepositPdf'
		| 'TradeExport'
		| 'TvChartSymbols'
		| 'Logout'
		| 'WatchListDefaultSymbols'
		| 'AccountOnlineDepositStatus'
		| 'PortfolioGetOptionBaseAsset'
		| 'WatchListDelete'
		| 'AccountOfflineDepositExcel'
		| 'OrderDraftCreate'
		| 'RecentSelectedSymbolsAdd'
		| 'OrderExport'
		| 'AccountSettingGet'
		| 'AccountWithdrawalRecentHistory'
		| 'AgreementsOtp'
		| 'AccountChangeUsername'
		| 'AccountChangeBrokerDelete'
		| 'AccountWithdrawalGetBank'
		| 'SymbolNoteGet'
		| 'PortfolioManageMeetingSymbolExcel'
		| 'MessagesSupervisorRead'
		| 'VirtualPortfoliosStrategyUpdate'
		| 'PortfolioManageGetSidebar'
		| 'AccountOnlineDepositPdf'
		| 'IpoUpdateOfflineRequest'
		| 'OptionEditRequestPhysicalSettlement'
		| 'VirtualPortfoliosUpdate'
		| 'VirtualPortfoliosDelete'
		| 'AccountWithdrawalExcel'
		| 'OptionOrderValues'
		| 'PortfolioManagePortfolioPerformanceShare'
		| 'FreezeCreateFreeze'
		| 'VirtualPortfoliosGetPortfolioStrategy'
		| 'ContractsGet'
		| 'ChartRemainLastMonthRemainChart'
		| 'OptionEditRequestCashSettlement'
		| 'GLPortfolio'
		| 'FreezeRecentFreezeRequest'
		| 'AccountChangeBrokerExcel'
		| 'BankCreate'
		| 'PortfolioManageGetMeetingSymbol'
		| 'AccountTransactionsGet'
		| 'FreezeDelete'
		| 'OptionDeleteRequestPhysicalSettlement'
		| 'RecentSelectedSymbolsHistory'
		| 'SymbolTopAttractiveSymbols'
		| 'WatchListSymbolGet'
		| 'OrderDraftGet'
		| 'ChangeBrokerCreate'
		| 'WatchListDefaultGet'
		| 'AccountWithdrawalGetStatus'
		| 'SymbolSectorSearch'
		| 'AccountInformation'
		| 'OrderDraftGroupDelete'
		| 'ChartRemainLastYearRemainChart'
		| 'OrderGetFairPrices'
		| 'MessagesAdminHistory'
		| 'PortfolioManagePerformanceSymbolExcel'
		| 'IpoUpdate'
		| 'FreezeFreezedSymbols'
		| 'VirtualPortfoliosStrategyAddOptionsToStrategy'
		| 'OptionGetSettlementResultHistory'
		| 'PortfolioManagePortfolioPerformancePDF'
		| 'PortfolioManageEditManualTrade'
		| 'ChartSymbol'
		| 'IpoGet'
		| 'PortfolioManagePortfolioPerformanceExcel'
		| 'OptionPositionHistoryArchiveCSV'
		| 'ChartPortfolioValue'
		| 'TvChartSymbolsHistoryAdd'
		| 'TvChartConfig'
		| 'TvChartHistory'
		| 'AccountWithdrawalPdf'
		| 'TvChartSymbolsHistoryDelete'
		| 'MessagesSupervisorGetPortfolio'
		| 'OrderDraftDelete'
		| 'WatchListSymbolAdd'
		| 'SettingSessionGet'
		| 'AccountOfflineDepositStatus'
		| 'WatchListUpdate'
		| 'MessagesSupervisorHistory'
		| 'WithdrawalRequestPayFast'
		| 'SymbolSectorGet'
		| 'OrderGetOption'
		| 'OrderOfflineDelete'
		| 'OrderGetBlockedMoney'
		| 'AccountTransactionsExcel'
		| 'OrderSwap'
		| 'WithdrawalLimitDates'
		| 'SettingSessionExport'
		| 'WithdrawalRequestAdd'
		| 'OrderAvailableContractInfo'
		| 'SymbolSectorAttractiveSymbols'
		| 'OrderDelete'
		| 'SymbolSetSymbolLimit'
		| 'OrderUpdate'
		| 'OrderHistory'
		| 'OrderOfflineCreate'
		| 'AccountOnlineDepositProviders'
		| 'IndicesImportantSymbols'
		| 'MessagesSupervisorGet'
		| 'IndicesHistory'
		| 'AccountOfflineDepositEdit'
		| 'AccountOfflineDepositGet'
		| 'RecentSelectedSymbolsDelete'
		| 'VirtualPortfoliosStrategyCreate'
		| 'AccountOfflineDepositCancel'
		| 'PortfolioManagePerformanceSymbolPDF'
		| 'PortfolioManageGetSymbolThreshold'
		| 'TvChartLoadOne'
		| 'MessagesAdminRead'
		| 'OptionPositionHistoryCSV'
		| 'AccountOfflineDepositGetById'
		| 'GLOptionOrders'
		| 'SymbolNoteSave'
		| 'AccountTransactionsPdf'
		| 'DepositOfflineHistory'
		| 'OrderGetOpen'
		| 'ContractsGetFile'
		| 'IpoOfflineRequest'
		| 'OptionCreateRequestCashSettlement'
		| 'ChangeBrokerDelete'
		| 'WithdrawalGet'
		| 'DepositOfflineEdit'
		| 'OrderGroupDelete'
		| 'WatchListSymbolDelete'
		| 'SymbolOptionInformation'
		| 'SymbolSearch'
		| 'DepositOnlineCreate'
		| 'MessagesAdminGet'
		| 'OrderCount'
		| 'WatchListSymbolsInWatchlist'
		| 'TradeHistory'
		| 'OrderOfflineGet'
		| 'ContractsOtp'
		| 'VirtualPortfoliosCreate'
		| 'VirtualPortfoliosStrategyDeleteOptionStrategy'
		| 'AccountRemain'
		| 'PortfolioManageGetAssetStatusChart'
		| 'ChangeBrokerGet'
		| 'PortfolioManageGetManualTrade'
		| 'OptionDeleteRequestCashSettlement'
		| 'IpoGetSymbol'
		| 'OptionGetBlockedValue'
		| 'PortfolioManageConvertChangeBrokerToShareBonus'
		| 'OptionCreateRequestPhysicalSettlement'
		| 'AccountChangeBrokerHistory'
		| 'PortfolioManageMeetingSymbolPDF'
		| 'VirtualPortfoliosStrategyGet'
		| 'BankDelete'
		| 'OptionPositionHistory'
		| 'FreezeExportExcel'
		| 'PortfolioManageGetPerformanceSymbol'
		| 'OptionGetRemain'
		| 'GLPositionExtraInfo'
		| 'PortfolioManageGetPerformanceChartFooter'
		| 'PortfolioManageDeleteManualTrade'
		| 'FreezeConfirmData'
		| 'ChartRemainLastThreeMonthRemainChart'
		| 'OptionPositionHistoryArchive'
		| 'SymbolInformation'
		| 'ChartPortfolioPoint'
		| 'PortfolioManageSetHasReceivedDPS'
		| 'EventGet'
		| 'PortfolioManageDeleteShareBonusRecord'
		| 'ChartRemainWeeklyRemainChart'
		| 'ContractsAccept'
		| 'FreezeHistory'
		| 'VirtualPortfoliosStrategyDelete'
		| 'BankBrokerAccounts'
		| 'VirtualPortfoliosStrategyGetOptions'
		| 'VirtualPortfoliosGet'
		| 'OptionGetPhysicalSettlementHistory'
		| 'PortfolioManageEditFinalPriceChangeBroker'
		| 'OptionStrategiesReport'
		| 'PortfolioHideSymbol'
		| 'TvChartLoadAll'
		| 'MarketViewBuySellRate'
		| 'TvChartSearch'
		| 'TvChartSetActiveSymbol'
		| 'PortfolioMiniPortfo'
		| 'WatchListAdd'
		| 'TvChartMarks'
		| 'TvChartDelete'
		| 'Commission'
		| 'MarketGetMarketTimings'
		| 'MarketViewIncomingMoney'
		| 'MarketMapGet'
		| 'MarketViewIndices'
		| 'TvChartIndex'
		| 'MarketDepth'
		| 'AllSymbols'
		| 'MarketViewQueueStatus'
		| 'TvChartSymbolsHistoryGet'
		| 'SymbolTags'
		| 'OrderOfflineExportExcel'
		| 'DepositOfflineCreate'
		| 'OrderCreate'
		| 'TvChartCharts'
		| 'AccountWithdrawalCancel'
		| 'AccountOnlineDepositExcel'
		| 'OrderOfflineUpdate'
		| 'OrderDraftUpdate'
		| 'DepositOnlineHistory'
		| 'WithdrawalRequestEdit'
		| 'AccountSettingSet'
		| 'PortfolioManageAddManualTrade'
		| 'VirtualPortfoliosGetAllCustomerStrategyOptions'
		| 'FreezeRecentUnFreezeRequest'
		| 'BankGet'
		| 'PortfolioManageSaveDDNFile'
		| 'PortfolioManageGetSymbolPerformanceFooter'
		| 'OrderCheckTrade'
		| 'OrderGetDone'
		| 'AgreementsGet'
		| 'EventGetAttachment'
		| 'OptionGetCashSettlementHistory'
		| 'SymbolSectorSameGroup'
		| 'BankDefault'
		| 'AccountOnlineDepositGet'
		| 'AccountWithdrawalHistory'
		| 'AgreementsAccept'
		| 'PortfolioManageGetAssetStatusSidebar'
		| 'IndicesSymbols'
		| 'SymbolNoteDelete';

	type URL = Record<UrlKey, string>;

	export interface Remain {
		remainT1: number;
		remainT2: number;
		blockValue: number;
		purchasePower: number;
		credit: number;
	}

	export interface Status {
		remainStatus: TRemainStatus;
		remainAsset: number;
		marginValue: number;
		variationMargin: number | null;
	}

	export interface User {
		bourseCode: string;
		customerTitle: string;
		email: string;
		mobilePhone: string;
		userName: string;
		twoFactor: boolean;
		sendMail: boolean;
		sendSms: boolean;
		nationalCode: string;
		userID: number;
		customerISIN: string;
		brokerCode: string;
		isOption: boolean;
		isOffline: boolean;
		customerTags: string;
		ipLocation: string;
	}

	export interface OrdersCount {
		openOrderCnt: number;
		todayOrderCnt: number;
		executedOrderCnt: number;
		orderDraftCnt: number;
		orderOptionCount: number;
	}
}

declare namespace Order {
	export type StatusType =
		| 'InOMSQueu'
		| 'OnSending'
		| 'Error'
		| 'DeleteByEngine'
		| 'OnBoard'
		| 'Canceled'
		| 'OnModifyFrom'
		| 'OnModifyTo'
		| 'Modified'
		| 'OnBoardModify'
		| 'PartOfTheOrderDone'
		| 'OrderDone'
		| 'OnCanceling'
		| 'OnModifyError'
		| 'OnCancelError'
		| 'Expired'
		| 'RejectByGAP'
		| 'OnCancelingWithBroker'
		| 'TradeCancel';

	export type FormType = 'Web' | 'Mobile' | 'BrokerTrader' | 'ClientApi' | 'MarketMaker' | 'Admin' | 'Supervisor';

	export type Types = 'MarketOrder' | 'LimitOrder' | 'MarketToLimitOrder' | 'MarketOnOpeningOrder' | 'StopOrder';

	export type ActionType = 'CreateOrder' | 'ModifyOrder' | 'CancelOrder' | 'ExpireOrder';

	export type Side = 'Buy' | 'Sell';

	type TDataTab<
		T extends Extract<TOrdersTab, 'open_orders' | 'executed_orders' | 'today_orders'> =
			| 'open_orders'
			| 'executed_orders'
			| 'today_orders',
	> = T extends 'open_orders'
		? Order.OpenOrder
		: T extends 'executed_orders'
			? Order.ExecutedOrder
			: Order.TodayOrder;

	export type TradeDetailsType =
		| null
		| {
				tradedQuantity: number;
				tradePrice: number;
				remainingQuantityOrder: number;
				tradeDate: string;
				tradeNumber: string;
				total: number;
		  }[];

	export interface Response {
		clientKey: string;
		response: string;
	}

	export interface OptionOrder {
		orderId: number;
		side: 'Buy' | 'Sell';
		contractType: 'Call' | 'Put';
		customerISIN: string;
		symbolISIN: string;
		baseSymbolISIN: string;
		positionCount: number;
		blockedMargin: number;
		blockedAsset: number;
		physicalSettlementDate: string;
		cashSettlementDate: string;
		contractSize: number;
		strikePrice: number;
		remainDays: number;
		symbolTitle: string;
		companyISIN: string;
		positionBlockISIN: string;
		canClosePosition: boolean;
		availableClosePosition: number;
		variationMargin: null;
		requiredMargin: number;
		isFreeze: boolean;
		isSwapped: boolean;
		blockCount: number;
		blockType: strTBlockTypeing;
		sumPayment: number;
		sumReceived: number;
		sumAmount: number;
		avgBuyPrice: number;
		avgSellPrice: number;
		buyCost: number;
		sellCost: number;
		actual_Profit_Loss: number;
		total_Actual_Profit_Loss: number;
		bestBuyLimitPrice_1: number;
		bestSellLimitPrice_1: number;
		closingPrice: number;
		lastTradedPrice: number;
		closingPriceVarPercent: number;
		lastTradedPriceVarPercent: number;
		lowThreshold: number;
		highThreshold: number;
	}

	export interface DraftOrder {
		id: number;
		symbolISIN: string;
		symbolTitle: string;
		price: number;
		quantity: number;
		side: Order.Side;
		validity: TBsValidityDates;
		validityDate: string;
		date: string;
		isLoading?: boolean;
		sent?: 'yes' | 'no';
		blockType?: TBlockType;
	}

	export type OpenOrder = {
		orderId: number;
		userName: null | string;
		customerISIN: string;
		marketUnit: string;
		symbolISIN: string;
		price: number;
		orderVolume: number;
		triggerPrice: number;
		orderPlaceInPrice?: null | number;
		orderVolumeInPrice?: null | number;
		quantity: number;
		orderSide: Order.Side;
		orderOrigin: string;
		parentOrderId: number;
		orderType: Types;
		validity: TBsValidityDates;
		validityDate: string;
		orderFrom: FormType;
		orderAction: ActionType | 0;
		orderMinimumQuantity: number;
		orderDateTime: string;
		hostOrderNumber: null | string;
		expectedRemainingQuantity: number;
		sumExecuted: number;
		symbolTitle: string;
		position: number;
		valuePosition: number;
		lastTradePrice: number;
		orderStatus: StatusType;
		lastErrorCode: string | null;
		customErrorMsg: string | null;
		orderPlaceInPrice?: null | number;
		orderVolumeInPrice?: null | number;
		tradeDetails: TradeDetailsType;
		isEditable: boolean;
		blockType: TBlockType;
		blockedPositionISIN?: string;
		blockedPositionTitle?: string;
	};

	export interface ExecutedOrder {
		id: string;
		customerISIN: string;
		symbolISIN: string;
		symbolTitle: string;
		orderSide: Order.Side;
		tradeDate: string;
		tradeQuantity: number;
		tradePrice: number;
		totalPrice: number;
		totalCommission: number;
		branchName: string;
		traderId: string;
		branchName: string;
	}

	export type TodayOrder = OpenOrder & {
		clientKey: string;
	};

	export type TOrder =
		| Order.OpenOrder
		| Order.TodayOrder
		| Order.ExecutedOrder
		| Order.DraftOrder
		| Order.OptionOrder;
}

declare namespace Message {
	export type MessageType = 'Oppening' | 'Stop' | 'Limitation' | 'Information';

	export interface Supervisor {
		id: number;
		messageTitle: string;
		messageBody: string;
		symbolISINs: string[];
		dateOfEvent: string;
		read: boolean;
		type: string;
	}
}

declare namespace Dashboard {
	export type TMarketStateExchange = 'Bourse' | 'FaraBourse' | 'Option';

	export type TIndex = 'Overall' | 'EqualWeightOverall' | 'RetailTrades';

	export type TTopSymbols = 'Option' | 'BaseSymbol' | 'Symbol';

	export type TOptionSide = 'Call' | 'Put';

	export type TInterval = 'Today' | 'Week' | 'Month' | 'ThreeMonths' | 'Year';

	export type TNewAndOld = 'FirstTradedOptionSymbol' | 'MostTradedOptionSymbol';

	export type TTopSymbol = GetTopSymbols.BaseSymbol.Type | GetTopSymbols.Symbol.Type | GetTopSymbols.Option.Type;

	export interface GetIndexDetails {
		overallValue: number;
		overallValuePercent: number;
		equalWeightOverallValue: number;
		equalWeightOverallPercent: number;
		retailTradesValue: number;
		retailTradesPercent: number;
	}

	export namespace GetMarketState {
		export type All = GetMarketState.Bourse | GetMarketState.FaraBourse | GetMarketState.Option;
		export interface Bourse {
			index: number;
			tradeVolume: number | null;
			tradeValue: number | null;
			marketValue: number;
			tradeCount: number;
		}

		export interface FaraBourse extends GetMarketState.Bourse {}

		export interface Option {
			tradeVolume: number | null;
			tradeValue: number | null;
			putValue: number;
			callValue: number;
		}
	}

	export namespace GetIndex {
		export interface Overall {
			symbolTitle: null;
			date: string;
			time: string;
			dateTime: string;
			lastIndexValueInDay: number;
			changePercentDuringDayComparedToPreviousDay: number;
		}

		export interface EqualWeightOverall {
			symbolTitle: null;
			date: string;
			time: string;
			dateTime: string;
			lastIndexValueInDay: number;
			changePercentDuringDayComparedToPreviousDay: number;
		}

		export type RetailTrades = Record<string, number>;
	}

	export namespace GetTopSymbols {
		export type Data = Option.Data | BaseSymbol.Data | Symbol.Data;

		export namespace Option {
			export type Type =
				| 'OptionValue'
				| 'OptionOpenPosition'
				| 'OptionVolatility'
				| 'OptionTradeCount'
				| 'OptionYesterdayDiff'
				| 'OptionVolume';

			export type All = Value | OpenPosition | Volatility | TradeCount | YesterdayDiff | Volume;

			export type ORecord<T> = Record<TOptionSides, T>;

			export type Data = Array<ORecord<All>>;

			export type FakeData = ORecord<All[]>;

			export type Value = {
				totalTradeValue: number;
				lastTradedPrice: number;
				symbolTitle: string;
				symbolISIN: string;
				dueDays: number;
				optionType: TOptionSide;
			};

			export type OpenPosition = {
				openPositionCount: number;
				openPositionVarPercent: number;
				openPositionCountDiff: number;
				symbolTitle: string;
				symbolISIN: string;
				dueDays: number;
				optionType: TOptionSide;
			};

			export type Volatility = {
				volatilityPercent: number;
				volatility: number;
				symbolTitle: string;
				symbolISIN: string;
				dueDays: number;
				optionType: TOptionSide;
			};

			export type TradeCount = {
				totalNumberOfTradesVarPercent: number;
				totalNumberOfTrades: number;
				symbolTitle: string;
				symbolISIN: string;
				dueDays: number;
				optionType: TOptionSide;
			};

			export type YesterdayDiff = {
				closingPriceVarReferencePrice: number;
				closingPriceVarReferencePricePercent: number;
				symbolTitle: string;
				symbolISIN: string;
				dueDays: number;
				optionType: TOptionSide;
			};

			export type Volume = {
				totalNumberOfSharesTradedVarPercent: number;
				totalNumberOfSharesTraded: number;
				symbolTitle: string;
				symbolISIN: string;
				dueDays: number;
				optionType: TOptionSide;
			};
		}

		export namespace BaseSymbol {
			export type Data = Value[] | PutOpenPosition[] | CallOpenPosition[] | OpenPosition[] | Volume[];

			export type Type =
				| 'BaseSymbolValue'
				| 'BaseSymbolPutOpenPosition'
				| 'BaseSymbolCallOpenPosition'
				| 'BaseSymbolOpenPosition'
				| 'BaseSymbolVolume';

			export interface Value {
				symbolTitle: string;
				symbolISIN: string;
				totalTradeValue: number;
				thirtyDayValue: number;
				ninetyDayValue: number;
				lastTradedPrice: number;
				tradePriceVarPreviousTradePercent: number;
			}

			export interface PutOpenPosition {
				baseSymbolTitle: string;
				baseSymbolISIN: string;
				openPosition: number;
				openPositionVarPercent: number;
				contractCount: number;
				closestEndDate: string;
			}

			export interface CallOpenPosition {
				baseSymbolTitle: string;
				baseSymbolISIN: string;
				openPosition: number;
				openPositionVarPercent: number;
				contractCount: number;
				closestEndDate: string;
			}

			export interface OpenPosition {
				baseSymbolTitle: string;
				baseSymbolISIN: string;
				openPosition: number;
				openPositionVarPercent: number;
				contractCount: number;
				closestEndDate: string;
			}

			export interface Volume {
				symbolTitle: string;
				baseSymbolISIN: string;
				totalNumberOfSharesTraded: number;
				thirtyDayVolume: number;
				ninetyDayVolume: number;
				lastTradedPrice: number;
				tradePriceVarPreviousTradePercent: number;
			}
		}

		export namespace Symbol {
			export type Data = Value[] | Volume[];

			export type Type = 'SymbolValue' | 'SymbolVolume';

			export interface Value {
				symbolTitle: string;
				symbolISIN: string;
				totalTradeValue: number;
				thirtyDayValue: number;
				ninetyDayValue: number;
				lastTradedPrice: number;
				tradePriceVarPreviousTradePercent: number;
			}

			export interface Volume {
				symbolTitle: string;
				symbolISIN: string;
				totalNumberOfSharesTraded: number;
				thirtyDayVolume: number;
				ninetyDayVolume: number;
				lastTradedPrice: number;
				tradePriceVarPreviousTradePercent: number;
			}
		}
	}

	export namespace GetOptionContractAdditionalInfo {
		export type All = IOTM[] | ContractType[];

		export type Basis = 'Volume' | 'Value';

		export type Type = 'IOTM' | 'ContractType';

		export type DataPoint = null | 'atm' | 'otm' | 'itm' | 'call' | 'put';

		export interface IOTM {
			iotm: 'ATM' | 'OTM' | 'ITM';
			tradeValue: number;
			valuePercentageOfTotal: number;
			tradeVolume: number;
			volumePercentageOfTotal: number;
		}

		export interface ContractType {
			contractType: TOptionSide;
			tradeValue: number;
			valuePercentageOfTotal: number;
			tradeVolume: number;
			volumePercentageOfTotal: number;
		}
	}

	export namespace GetOptionMarketComparison {
		export type TChartType = 'OptionToMarket' | 'OptionBuyToMarket' | 'OptionSellToMarket';

		export type Data = Record<string, number>;
	}

	export namespace GetMarketProcessChart {
		export type TChartType = 'Value' | 'Volume' | 'NotionalValue';

		export type Data = Record<string, number>;
	}

	export namespace GetOptionTradeProcess {
		export type TChartType = 'Process' | 'PutToCall';

		export interface Data {
			intervalDateTime: string;
			callValue: number;
			putValue: number;
		}
	}

	export namespace GetOptionWatchlistPriceChangeInfo {
		export interface Data {
			count: number;
			state: string;
		}
	}

	export namespace GetOpenPositionProcess {
		export type TChartType = 'Aggregated' | 'Separated';

		export interface Aggregated {
			dateTime: string;
			openPosition: number;
		}

		export interface Separated {
			dateTime: string;
			callOpenPosition: number;
			putOpenPosition: number;
		}

		export type Data = Dashboard.GetOpenPositionProcess.Aggregated[] | Dashboard.GetOpenPositionProcess.Separated[];
	}

	export namespace GetAnnualReport {
		export type Type = 'FundIncrease' | 'Other';

		export interface Data {
			symbolTitle: string;
			symbolISIN: string;
			dateTime: string;
			title: string;
		}
	}

	export namespace GetFirstTradedOptionSymbol {
		export interface Data {
			symbolISIN: string;
			contractEndDate: string;
			symbolTitle: string;
			firstTradeDate: string;
			numberOfDaysUntilNow: number;
		}
	}

	export namespace GetMostTradedOptionSymbol {
		export interface Data {
			symbolISIN: string;
			contractEndDate: string;
			symbolTitle: string;
			workingDaysTradedCount: number;
		}
	}

	export namespace GetTopOptionBaseSymbolValue {
		export interface Data {
			todayTopOptionBaseSymbolValues: GetTopOptionBaseSymbolValue.Symbol[];
			weekTopOptionBaseSymbolValues: GetTopOptionBaseSymbolValue.Symbol[];
			monthTopOptionBaseSymbolValues: GetTopOptionBaseSymbolValue.Symbol[];
		}

		export interface Symbol {
			symbolISIN: string;
			symbolTitle: string;
			todayValue: number;
		}
	}

	export namespace GetOptionSettlementInfo {
		export type Type = 'MostRecent' | 'Closest';

		export type Data = GetOptionSettlementInfo.MostRecentData | GetOptionSettlementInfo.ClosestData;

		export interface MostRecentData {
			symbolTitle: string;
			symbolISIN: string;
			mostRecentPassedDays: number;
			totalTradeValue: number;
			totalTradeVolume: number;
		}

		export interface ClosestData {
			symbolTitle: string;
			symbolISIN: string;
			closestDueDays: number;
			totalTradeValue: number;
			totalTradeVolume: number;
		}
	}

	export namespace GetIndividualLegalInfo {
		export type SymbolType = 'Option' | 'BaseSymbol';

		export type Type = 'Individual' | 'Legal';

		export type Data = GetIndividualLegalInfo.Individual | GetIndividualLegalInfo.Legal;

		export interface Individual {
			dateTime: string;
			individualBuyAverage: number;
			individualSellAverage: number;
		}

		export interface Legal {
			dateTime: string;
			sumOfLegalsBuyVolume: number;
			sumOfLegalsSellVolume: number;
		}
	}
}

declare namespace Settings {
	export interface IBrokerCustomerSettings {
		id: number;
		configKey:
			| 'confirmBeforeDelete'
			| 'confirmBeforeSendOrder'
			| 'defaultBuyVolume'
			| 'defaultSellVolume'
			| 'sendSupervisorMarketMessage'
			| 'showSymbolDetailsInBuySellModal'
			| 'breakEvenPoint';
		configValue: string;
		saveDate: string;
	}

	export type IFormattedBrokerCustomerSettings = Record<IBrokerCustomerSettings['configKey'], string | boolean>;

	export interface IAgreements {
		agreementId: number;
		title: string;
		state: 'NotSpecified' | 'Accepted' | 'NotAccepted';
		changeDate: string;
		description: string;
		type: string;
		canChangeByCustomer: boolean;
		approveBySMS: boolean;
		attachmentUrl: string | null;
	}

	export interface IMobileOTP {
		expireDate: number;
		retryToken: string;
		starredMessage: string;
		state: boolean;
	}
}

declare namespace Payment {
	export type THistoryState =
		| 'Request'
		| 'RequestBankToken'
		| 'RequestBankTokenOk'
		| 'RequestBankTokenError'
		| 'RedirectToBank'
		| 'OkBeforeVerify'
		| 'VerifyCheck'
		| 'VerifyCheckFailed'
		| 'Verify'
		| 'DoubleSpendingCheckFailed'
		| 'DoubleSpendingCheckedOk'
		| 'Done'
		| 'CanceledByUser'
		| 'Failed'
		| 'SessionIsNull'
		| 'InvalidParameters'
		| 'MerchantIpAddressIsInvalid'
		| 'TokenNotFound'
		| 'TokenRequired'
		| 'TerminalNotFound';

	type TFreezeRequestState = 'Deleted' | 'Done' | 'InProgress' | 'NotApprove';

	type TDepositTab = 'receiptDepositTab' | 'liveDepositTab';

	export type TRemainsWithDay = Record<
		't1' | 't2',
		{
			date: number;
			valid: boolean;
			amount: string;
		}
	>;

	export interface IDepositResponse {
		bankToken: string;
		amount: number;
		merchantId: null;
		reservationNumber: string;
		redirectUrl: string | null;
		wage: number;
		errorMessage: string | null;
		isSuccessful: boolean;
		mobilePhone: number;
	}

	export interface IDepositHistoryList {
		reservationNumber: number;
		saveDate: string;
		amount: number;
		providerType: string;
		state: THistoryState;
	}

	export interface IReceiptHistoryList {
		id: number;
		nationalCode: string;
		customerISIN: string;
		date: string;
		bankAccountId: string;
		amount: number;
		receiptNumber: string;
		base64Image: string;
		comment: string;
		receiptDate: string;
		accountCode: string;
		state: 'InOMSQueue' | 'OrderDone' | 'Error' | 'Modified' | 'Expired' | 'Canceled';
		providerType: string;
	}

	export interface IChangeBrokerList {
		id: number;
		saveDate: string;
		symbolISIN: string;
		lastState: string;
		attachmentId: number;
		symbolTitle: string;
		hasAttachment: boolean;
	}

	export interface IBrokerAccount {
		id: string;
		bankName: string;
		bankBranch: string;
		accountType: string;
		accountNumber: string;
		permittedToPay: boolean;
		permittedToReceive: boolean;
	}

	export interface IUserBankAccount {
		id: number;
		shaba: string;
		accountNumber: string;
		bankName: string;
		isDefault: number;
	}

	export interface IWithdrawalForm {
		bankAccount: IUserBankAccount | null;
		withdrawalType: string | null;
		amount: string;
	}

	export interface IWithdrawalHistoryList {
		id: number;
		accountNumber: string;
		bankAccountId: number;
		branchId: number;
		comment: string;
		customerAccountId: number;
		customerBank: string;
		customerISIN: string;
		errorMessage: string;
		channel: string;
		id: number;
		nationalCode: string;
		requestDate: string;
		requestAmount: number;
		saveDate: string;
		state: string;
	}

	export interface IRecentFreezeList {
		saveDate: string;
		symbolISIN: string;
		symbolTitle: string;
		requestState: TFreezeRequestState;
	}

	export interface ICountFreeze {
		symbolISIN: string;
		symbolTitle: string;
		count: number;
	}
}

declare namespace Strategy {
	declare type Cheap =
		| 'HighRisk'
		| 'LowRisk'
		| 'NoRisk'
		| 'ModerateRisk'
		| 'LimitedInterest'
		| 'UnlimitedInterest'
		| 'LimitedLoss'
		| 'NoLimit'
		| 'UnlimitedLoss'
		| 'BullishMarket'
		| 'BearishMarket'
		| 'NeutralMarket'
		| 'AllMarket'
		| 'DirectionalMarket';

	declare type Type =
		| 'CoveredCall'
		| 'LongCall'
		| 'LongPut'
		| 'ProtectivePut'
		| 'BullCallSpread'
		| 'LongStraddle'
		| 'BearPutSpread'
		| 'Conversion';

	declare type AllStrategies =
		| CoveredCall
		| LongCall
		| LongPut
		| LongStraddle
		| Conversion
		| BullCallSpread
		| ProtectivePut
		| BearPutSpread;

	export interface GetAll {
		id: number;
		title: string;
		type: Type;
		tags: Cheap[];
	}

	export interface CoveredCall {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		symbolISIN: string;
		symbolTitle: string;
		strikePrice: number;
		openPositionCount: number;
		iotm: Option.IOTM;
		premium: number;
		tradePriceVarPreviousTradePercent: number;
		optionBestBuyLimitQuantity: number;
		optionBestBuyLimitPrice: number;
		contractSize: number;
		baseBestSellLimitPrice: number;
		baseBestBuyLimitPrice: number;
		optionBestSellLimitPrice: number;
		optionBestSellLimitQuantity: number;
		baseClosingPrice: number;
		tradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseLastTradedDate: string;
		coveredCallBEP: number;
		maxProfit: number;
		maxProfitPercent: number;
		inUseCapital: number;
		nonExpiredProfit: number;
		nonExpiredProfitPercent: number;
		ytm: number;
		nonExpiredYTM: number;
		bepDifference: number;
		riskCoverage: number;
		baseMarketUnit: string;
		marketUnit: string;
		historicalVolatility: number;
		requiredMargin: number;
		contractEndDate: string;
		withCommission: boolean;
	}

	export interface LongCall {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		symbolISIN: string;
		symbolTitle: string;
		strikePrice: number;
		openPositionCount: number;
		iotm: Option.IOTM;
		premium: number;
		tradePriceVarPreviousTradePercent: number;
		optionBestSellLimitPrice: number;
		optionBestSellLimitQuantity: number;
		longCallBEP: number;
		profitAmount: number;
		profitPercent: number;
		blackScholes: number;
		bepDifference: number;
		timeValue: number;
		intrinsicValue: number;
		optionBestBuyLimitPrice: number;
		optionBestBuyLimitQuantity: number;
		tradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseLastTradedDate: string;
		baseMarketUnit: string;
		marketUnit: string;
		historicalVolatility: number;
		requiredMargin: number;
		contractEndDate: string;
		contractSize: number;
		withCommission: boolean;
	}

	export interface LongPut {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		symbolISIN: string;
		symbolTitle: string;
		strikePrice: number;
		openPositionCount: number;
		iotm: Option.IOTM;
		premium: number;
		tradePriceVarPreviousTradePercent: number;
		optionBestSellLimitPrice: number;
		optionBestSellLimitQuantity: number;
		longPutBEP: number;
		profitAmount: number;
		profitPercent: number;
		blackScholes: number;
		bepDifference: number;
		timeValue: number;
		intrinsicValue: number;
		optionBestBuyLimitPrice: number;
		optionBestBuyLimitQuantity: number;
		tradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseLastTradedDate: string;
		ytm: number;
		baseMarketUnit: string;
		marketUnit: string;
		historicalVolatility: number;
		requiredMargin: number;
		contractEndDate: string;
		contractSize: number;
		withCommission: boolean;
	}

	export interface LongStraddle {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		strikePrice: number;
		callSymbolISIN: string;
		callSymbolTitle: string;
		callBestSellLimitPrice: number;
		callBestSellLimitQuantity: number;
		putSymbolISIN: string;
		putSymbolTitle: string;
		putBestSellLimitPrice: number;
		putBestSellLimitQuantity: number;
		callOpenPositionCount: number;
		putOpenPositionCount: number;
		callIOTM: string;
		putIOTM: string;
		callPremium: number;
		callPremiumPercent: number;
		putPremium: number;
		putPremiumPercent: number;
		lowBEP: number;
		highBEP: number;
		maxLoss: number;
		inUseCapital: number;
		callTimeValue: number;
		putTimeValue: number;
		callIntrinsicValue: number;
		putIntrinsicValue: number;
		callTradeValue: number;
		putTradeValue: number;
		callBestBuyLimitPrice: number;
		callBestBuyLimitQuantity: number;
		putBestBuyLimitPrice: number;
		putBestBuyLimitQuantity: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseLastTradeDate: string;
		baseMarketUnit: string;
		marketUnit: string;
		historicalVolatility: number;
		callRequiredMargin: number;
		putRequiredMargin: number;
		contractEndDate: string;
		contractSize: number;
		withCommission: boolean;
	}

	export interface Conversion {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		strikePrice: number;
		callSymbolISIN: string;
		callSymbolTitle: string;
		callBestSellLimitPrice: number;
		callBestSellLimitQuantity: number;
		callBestBuyLimitPrice: number;
		callBestBuyLimitQuantity: number;
		callPremium: number;
		callPremiumPercent: number;
		callIOTM: string;
		callOpenPositionCount: number;
		putSymbolISIN: string;
		putSymbolTitle: string;
		putBestSellLimitPrice: number;
		putBestSellLimitQuantity: number;
		putBestBuyLimitPrice: number;
		putBestBuyLimitQuantity: number;
		putOpenPositionCount: number;
		putIOTM: string;
		putPremium: number;
		putPremiumPercent: number;
		profit: number;
		profitPercent: number;
		inUseCapital: number;
		callTimeValue: number;
		putTimeValue: number;
		callIntrinsicValue: number;
		putIntrinsicValue: number;
		callTradeValue: number;
		putTradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseLastTradeDate: string;
		baseMarketUnit: string;
		marketUnit: string;
		historicalVolatility: number;
		callRequiredMargin: number;
		putRequiredMargin: number;
		contractEndDate: string;
		ytm: number;
		requiredMargin: number;
		ytmWithCommission: number;
		contractSize: number;
		withCommission: boolean;
	}

	export interface BullCallSpread {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		lspSymbolISIN: string;
		lspSymbolTitle: string;
		lspStrikePrice: number;
		lspBestSellLimitPrice: number;
		lspBestSellLimitQuantity: number;
		lspBestBuyLimitPrice: number;
		lspBestBuyLimitQuantity: number;
		hspSymbolISIN: string;
		hspSymbolTitle: string;
		hspStrikePrice: number;
		hspBestBuyLimitPrice: number;
		hspBestBuyLimitQuantity: number;
		hspBestSellLimitPrice: number;
		hspBestSellLimitQuantity: number;
		lspOpenPositionCount: number;
		hspOpenPositionCount: number;
		lspiotm: Option.IOTM;
		hspiotm: Option.IOTM;
		lspPremium: number;
		lspPremiumPercent: number;
		hspPremium: number;
		hspPremiumPercent: number;
		bullCallSpreadBEP: number;
		maxProfit: number;
		maxProfitPercent: number;
		maxLoss: number;
		inUseCapital: number;
		lspTimeValue: number;
		hspTimeValue: number;
		lspIntrinsicValue: number;
		hspIntrinsicValue: number;
		lspTradeValue: number;
		hspTradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseLastTradedDate: string;
		ytm: number;
		baseMarketUnit: string;
		marketUnit: string;
		historicalVolatility: number;
		lspRequiredMargin: number;
		hspRequiredMargin: number;
		contractEndDate: string;
		contractSize: number;
		requiredMargin: number;
		withCommission: boolean;
	}

	export interface ProtectivePut {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		symbolISIN: string;
		symbolTitle: string;
		strikePrice: number;
		openPositionCount: number;
		iotm: Option.IOTM;
		premium: number;
		premiumPercent: number;
		optionBestBuyLimitQuantity: number;
		optionBestBuyLimitPrice: number;
		contractSize: number;
		baseBestSellLimitPrice: number;
		baseBestBuyLimitPrice: number;
		optionBestSellLimitPrice: number;
		optionBestSellLimitQuantity: number;
		protectivePutBEP: number;
		maxLoss: number;
		maxLossPercent: number;
		profitAmount: number;
		profitPercent: number;
		inUseCapital: number;
		bepDifference: number;
		baseMarketUnit: string;
		marketUnit: string;
		historicalVolatility: number;
		requiredMargin: number;
		contractEndDate: string;
		timeValue: number;
		intrinsicValue: number;
		optionBestLimitPrice: number;
		optionBestLimitVolume: number;
		tradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		blackScholes: number;
		baseLastTradedDate: string;
		ytm: number;
		ytmWithCommission: number;
		withCommission: boolean;
	}

	export interface BearPutSpread {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		lspSymbolISIN: string;
		lspSymbolTitle: string;
		lspStrikePrice: number;
		lspBestSellLimitPrice: number;
		lspBestSellLimitQuantity: number;
		lspBestBuyLimitPrice: number;
		lspBestBuyLimitQuantity: number;
		hspSymbolISIN: string;
		hspSymbolTitle: string;
		hspStrikePrice: number;
		hspBestBuyLimitPrice: number;
		hspBestBuyLimitQuantity: number;
		hspBestSellLimitPrice: number;
		hspBestSellLimitQuantity: number;
		lspOpenPositionCount: number;
		hspOpenPositionCount: number;
		lspiotm: Option.IOTM;
		hspiotm: Option.IOTM;
		lspPremium: number;
		lspPremiumPercent: number;
		hspPremium: number;
		hspPremiumPercent: number;
		bearPutSpreadBEP: number;
		maxProfit: number;
		maxProfitPercent: number;
		maxLoss: number;
		inUseCapital: number;
		lspTimeValue: number;
		hspTimeValue: number;
		lspIntrinsicValue: number;
		hspIntrinsicValue: number;
		lspTradeValue: number;
		hspTradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseLastTradedDate: string;
		ytm: number;
		baseMarketUnit: string;
		marketUnit: string;
		historicalVolatility: number;
		lspRequiredMargin: number;
		hspRequiredMargin: number;
		contractEndDate: string;
		contractSize: number;
		withCommission: boolean;
	}
}

declare namespace Reports {
	export type TstatusSettlement =
		| 'Registered'
		| 'Sent'
		| 'Sending'
		| 'Settled'
		| 'Settling'
		| 'Expired'
		| 'Draft'
		| 'SendToBourse'
		| 'InSendQueue';
	export interface TCashOrPhysicalSettlement {
		symbolTitle: string;
		cashSettlementDate: string;
		side: 'Buy' | 'Sell';
		openPositionCount: pandLStatus;
		pandLStatus: string;
		from: 'cash' | 'physical';
		doneCount: number;
		symbolISIN: string;
		enabled: boolean;
		status: TstatusSettlement;
	}
	export interface ITransactions {
		tradeDate: string;
		amount: number;
		credit: number;
		debit: number;
		remaining: number;
		branchName: string;
		description: string;
		quantity: number;
		price: number;
		symbolTitle: string;
		branchId: number;
		turnOverTransactionType: string;
		turnOverTransactionTypeName: string;
		symbolISIN: string;
		rowOrder: string;
		fcKey: string;
	}

	export interface IInstantDeposit {
		reservationNumber: number;
		referenceNumber: string;
		saveDate: string;
		amount: number;
		providerType: string;
		state:
			| 'CanceledByUser'
			| 'Done'
			| 'DoubleSpendingCheckedOk'
			| 'DoubleSpendingCheckFailed'
			| 'RedirectToBank'
			| 'Request'
			| 'RequestBankToken'
			| 'RequestBankTokenError'
			| 'Verify'
			| 'VerifyCheck'
			| 'VerifyCheckFailed'
			| 'OkBeforeVerifys';
		errorMessage: string;
	}

	export interface IDepositWithReceipt {
		id: number;
		nationalCode: string;
		customerISIN: string;
		date: string;
		bankAccountId: string;
		amount: number;
		receiptNumber: string;
		comment: string;
		receiptDate: string;
		accountCode: string;
		state: 'InOMSQueue' | 'OrderDone' | 'Error' | 'Modified' | 'Expired' | 'Canceled' | 'Registeration';
		providerType: string;
		base64Image: File | null;
	}

	export interface IWithdrawal {
		id: number;
		accountNumber: string;
		bankAccountId: number;
		branchId: number;
		comment: string;
		customerAccountId: number;
		customerBank: string;
		customerISIN: string;
		errorMessage: string;
		channel: string;
		id: number;
		nationalCode: string;
		requestDate: string;
		requestAmount: number;
		saveDate: string;
		state: string;
	}

	export interface IChangeBrokerReports {
		id: number;
		saveDate: string;
		symbolISIN: string;
		lastState: string;
		attachmentId: number;
		symbolTitle: string;
		hasAttachment: boolean;
	}

	export interface IFreezeUnfreezeReports {
		symbolISIN: string;
		symbolTitle: string;
		requestType: 'Freeze' | 'UnFreeze';
		requestState: string;
		description: string | null;
		confirmed: boolean;
		confirmedOn: string;
	}

	export interface ICashSettlementReports {
		id: number;
		symbolTitle: string;
		symbolISIN: string;
		symbolTitle: string;
		openPositionCount: number;
		cashSettlementDate: string;
		side: 'Buy' | 'Sell';
		settlementRequestType: 'MaximumStrike' | 'PartialStrike' | null;
		requestCount: number;
		enabled: boolean;
		status: TstatusSettlement;
		doneCount: number;
		pandLStatus: string;
		history: IOptionHistory[];
		userType: 'System' | 'UserTitle' | 'Backoffice';
		userName: string;
		updatedAt: string | null;
		incomeValue: number;
	}

	export interface IPhysicalSettlementReports {
		id: number;
		symbolISIN: string;
		symbolTitle: string;
		openPositionCount: number;
		cashSettlementDate: string;
		side: 'Buy' | 'Sell';
		settlementRequestType: 'MaximumStrike' | 'PartialStrike' | null;
		requestCount: number;
		status: TstatusSettlement;
		doneCount: number;
		pandLStatus: 'Profit' | 'Loss';
		penCount: number;
		penValue: string;
		history: IOptionHistory[];
		requestForLostOrProfit: boolean;
		enabled: boolean;
		userType: 'System' | 'UserTitle' | 'Backoffice';
		userName: string;
		updatedAt: string | null;
		incomeValue: number;
		penVolume: number;
		peValue: number;
	}

	export interface IOrdersReports {
		orderId: number;
		userName: null | string;
		customerISIN: string;
		marketUnit: string;
		symbolISIN: string;
		price: number;
		orderVolume: number;
		triggerPrice: number;
		orderPlaceInPrice?: null | number;
		orderVolumeInPrice?: null | number;
		quantity: number;
		orderSide: TOrdersSide;
		orderOrigin: string;
		parentOrderId: number;
		orderType: TOrdersTypes;
		validity: TOrdersValidity;
		validityDate: string;
		orderFrom: TOrdersForm;
		orderAction: TOrdersAction | 0;
		orderMinimumQuantity: number;
		orderDateTime: string;
		hostOrderNumber: null | string;
		expectedRemainingQuantity: number;
		sumExecuted: number;
		symbolTitle: string;
		position: number;
		valuePosition: number;
		lastTradePrice: number;
		orderStatus: TOrdersStatus;
		lastErrorCode: string | null;
		customErrorMsg: string | null;
		orderPlaceInPrice?: null | number;
		orderVolumeInPrice?: null | number;
		tradeDetails: TTradeDetails;
		isEditable: boolean;
		blockType: TBlockType;
	}

	export interface ITradesReports {
		orderSide: 'Sell' | 'Buy';
		remainingQuantityOrder: number;
		symbolTitle: string;
		total: number;
		totalQuota: number;
		tradeDate: string;
		tradeNumber: number;
		tradePrice: number;
		tradeTime: string;
		tradedQuantity: number;
	}
}

declare namespace MarketMap {
	export interface Root {
		title: string;
		/**
		 * Sectors
		 */
		s: MarketMap.Sector[];
	}

	export interface Sector {
		/**
		 * Sector Code
		 */
		sc: string;
		/**
		 * Sector name
		 */
		sn: string;
		/**
		 * Symbols
		 */
		s: MarketMap.Symbol[];
	}

	export interface TWatchlist {
		id: number;
		createDate: string;
		watchListName: string;
		isPinned: boolean;
	}

	export interface Symbol {
		/**
		 * SymbolISIN
		 */
		si: string;
		/**
		 * Symbol Title
		 */
		st: string;
		/**
		 * Company Name
		 */
		cn: string;
		/**
		 * Sector Code
		 */
		sc: string;
		/**
		 * Last Traded Price
		 */
		l: number;
		/**
		 * Closing Price
		 */
		c: number;
		/**
		 * Closing Price Var Reference Price Percent
		 */
		cpp: number;
		/**
		 * Trade Price Var Previous Trade Percent
		 */
		lpp: number;
		/**
		 * Last Trade Price Vs Reference Price
		 */
		lp: number;
		/**
		 * Total Trade Value
		 */
		t: number;
		/**
		 * Total Number Of Trades
		 */
		tt: number;
		/**
		 * Number Of ILegals Buyers
		 */
		nlb: number;
		/**
		 * Number Of Individuals Sellers
		 */
		nis: number;
		/**
		 * Number Of Individuals Buyers
		 */
		nib: number;
		/**
		 * Number Of Legals Sellers
		 */
		nls: number;
		/**
		 * Sum Of Individuals Buy Volume
		 */
		sibv: number;
		/**
		 * Sum Of Individuals Sell Volume
		 */
		sisv: number;
		/**
		 * Sum Of Legals Buy Volume
		 */
		slbv: number;
		/**
		 * Sum Of Legals Sell Volume
		 */
		slsv: number;
		/**
		 * Market Cap
		 */
		mCap: number;
		marketUnit: string;
		symbolTag: null;
		symbolType: string;
		marketCode: null;
		exchange: null;
	}

	export interface SectorAPI {
		id: string;
		title: string;
	}
}

declare type LimitSymbol = {
	watchlistId: number;
	customerISIN: string;
	symbolISIN: string;
	symbolTitle: string;
	takeProfit: number;
	stopLoss: number;
	closingPrice: number;
};

declare namespace Portfolio {
	export interface GlPortfolio {
		customerISIN: string;
		symbolISIN: string;
		symbolTitle: string;
		marketUnit: string;
		asset: number;
		paidValue: number;
		avgBuyPrice: number;
		price: number;
		priceChangePercent: number;
		sellNetValueWithoutCommission: number;
		sellNetValue: number;
		buyPriceBEP: number;
		todayPNL: number;
		todayPNLPercent: number;
		previousPNL: number;
		remainingPNL: number;
		blockVolume: number;
		remainingPNLPercent: number;
		totalPNL: number;
		totalPNLPercent: number;
		percentageOfTotalPortfo: number;
		buyQuantity: number;
		sellQuantity: number;
		buyValue: number;
		sellValue: number;
		dps: number;
		dpsPercent: number;
		lastDPS: number;
	}
}

declare namespace GLOptionOrder {
	export interface Root {
		buyPositions: BuyPosition[];
		sellPositions: SellPosition[];
	}

	export interface BuyPosition {
		customerISIN: string;
		symbolISIN: string;
		symbolTitle: string;
		positionCount: number;
		paidValue: number;
		avgBuyPrice: number;
		price: number;
		priceChangePercent: number;
		sellNetValueWithoutCommission: number;
		sellNetValue: number;
		sellBEP: number;
		todayPNL: number;
		todayPNLPercent: number;
		previousPNL: number;
		remainingPNL: number;
		blockedPositionCount: number;
		remainingPNLPercent: number;
		totalPNL: number;
		totalPNLPercent: number;
		percentageOfTotalPortfo: number;
		buyQuantity: number;
		sellQuantity: number;
		buyValue: number;
		sellValue: number;
		dueDays: number;
		contractSize: number;
		physicalSettlementDate: string;
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseSymbolPrice: number;
		baseSymbolPriceChangePercent: number;
	}

	export interface SellPosition {
		customerISIN: string;
		symbolISIN: string;
		symbolTitle: string;
		positionCount: number;
		paidValue: number;
		avgSellPrice: number;
		price: number;
		priceChangePercent: number;
		buyNetValueWithoutCommission: number;
		buyNetValue: number;
		blockedPositionCount: number;
		buyBEP: number;
		todayPNL: number;
		todayPNLPercent: number;
		previousPNL: number;
		remainingPNL: number;
		remainingPNLPercent: number;
		totalPNL: number;
		totalPNLPercent: number;
		percentageOfTotalPortfo: number;
		buyQuantity: number;
		sellQuantity: number;
		buyValue: number;
		sellValue: number;
		dueDays: number;
		contractSize: number;
		physicalSettlementDate: string;
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseSymbolPrice: number;
		baseSymbolPriceChangePercent: number;
	}
}

declare namespace Commission {
	interface Root {
		marketTitle: string;
		marketUnitTitle: string;
		commissionType: string;
		totalBuyCommission: number;
		totalSellCommission: number;
		buyTax: number;
		sellTax: number;
	}

	interface Row {
		marketTitle: string;
		marketUnitTitle: string;
		commissionType: string;
		buyCommission: number;
		sellCommission: number;
		strikeBuyCommission: number;
		strikeSellCommission: number;
		buyTax: number;
		sellTax: number;
	}

	type Data = Record<string, Row>;
}

declare interface GlPositionExtraInfo {
	symbolISIN: string;
	asset: number;
	isFreeze: boolean;
	blockVolume: number;
}

declare interface IAvailableContractInfo {
	companyISIN: string;
	symbolISIN: string;
	symbolTitle: string;
	baseCompanyISIN: string | null;
	baseSymbolISIN: string | null;
	baseSymbolTitle: string | null;
	contractType: 'Call' | 'Put';
	strikePrice: number;
	openPosition: number;
	customersOpenPositions: number;
	allPositionCount: number;
	usedPositions: number;
}
