import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';
import { type ModalState } from './types/modalSlice.interfaces';

const initialState: ModalState = {
	// لاگین
	loginModal: null,

	// فیلتر صفحه دیده‌بان آپشن
	optionFilters: null,

	// گرفتن تایید از کاربر
	confirm: null,

	// انتقال نماد به دیده‌بان
	moveSymbolToWatchlist: null,

	// خروج از حساب‌کاربری
	logout: null,

	// ماشین حساب بلک‌شولز
	blackScholes: null,

	// اطلاعات سفارش
	orderDetails: null,

	// اضافه کردن نماد به دیده‌بان
	addSymbolToWatchlist: null,

	// اضافه کردن دیده‌بان جدید
	addNewOptionWatchlist: null,

	// مدیریت دیده‌بان‌های اضافه شده
	manageOptionWatchlistList: null,

	// انتخاب کارگزاری
	choiceBroker: null,

	// انتخاب نوع وثیقه آپشن
	choiceCollateral: null,

	// فراموشی رمزعبور
	forgetPassword: null,

	// خرید و فروش
	buySell: null,

	// افزودن قالب جدید زحل
	addSaturnTemplate: null,

	// قراردادهای نماد
	selectSymbolContracts: null,

	// تغییر کارگزار ناظر
	changeBroker: null,

	// تنظیمات جزئیات نماد
	symbolInfoPanelSetting: null,

	// واریز وجه
	deposit: null,

	// برداشت وجه
	withdrawal: null,

	// فریر و رفع فریز
	freeze: null,

	// تسویه اختیار
	optionSettlement: null,

	// آنالیز
	analyze: null,

	// توضیحات
	description: null,

	// فیلتر صفحه  گردش حساب
	transactionsFilters: null,

	// فیلتر صفحه گزارشات واریز آنی
	instantDepositReportsFilters: null,

	// فیلتر صفحه گزارشات واریز با فیش
	depositWithReceiptReportsFilters: null,

	// فیلتر صفحه گزارشات برداشت وجه
	withdrawalCashReportsFilters: null,

	// فیلتر صفحه گزارشات تغییر کارگزار ناظر
	changeBrokerReportsFilters: null,

	// فیلتر صفحه فریز و رفع فریز
	freezeUnfreezeReportsFilters: null,

	// فیلتر تسویه نقدی
	cashSettlementReportsFilters: null,

	// فیلتر تسویه فیزیکی
	physicalSettlementReportsFilters: null,

	// فیلتر صفحه گزارشات معاملات
	ordersReportsFilters: null,

	// فیلتر گزارش‌ها
	tradesReportsFilters: null,

	// ساخت استراتژی
	executeCoveredCallStrategyModal: null,

	// تایید توافق‌نامه
	acceptAgreement: null,

	// تنظیمات ستون
	manageColumns: null,

	// وضعیت بازار صفحه داشبورد
	marketState: null,

	// نمای بازار صفحه داشبورد
	marketView: null,

	// برترین‌ها صفحه داشبورد
	best: null,

	// کهکشان صفحه داشبورد
	userProgressBar: null,

	//  مقایسه ارزش معاملات صفحه داشبورد
	compareTransactionValue: null,

	// قراردادهای اختیار صفحه داشبورد
	optionContract: null,

	// ارزش در معاملات اختیار صفحه داشبورد
	optionTradeValue: null,

	// مدال روند بازار آپشن صفحه داشبورد
	optionMarketProcess: null,

	// مدال حقیقی و حقوقی صفحه داشبورد
	individualAndLegal: null,

	// مدال دیده بان تغییر قیمت صفحه داشبورد
	priceChangeWatchlist: null,

	// مدال روند موقعیت های باز صفحه داشبورد
	openPositionProcess: null,

	// مدال مجامع صفحه داشبورد
	meetings: null,

	// مدال جدید و قدیم صفحه داشبورد
	newAndOld: null,

	// مدال برترین دارایی‌های پایه صفحه داشبورد
	topBaseAssets: null,

	// مدال فعالیت‌های اخیر صفحه داشبورد
	recentActivities: null,

	// مدال سررسیدها صفحه داشبورد
	dueDates: null,

	// مدال فیلتر استراتژی‌ها
	strategyFilters: null,

	// تغییر روش تضمین
	changeBlockTypeModal: null,
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		setBuySellModal: (state, { payload }: PayloadAction<ModalState['buySell']>) => {
			state.buySell = payload;
		},

		setMoveSymbolToWatchlistModal: (state, { payload }: PayloadAction<ModalState['moveSymbolToWatchlist']>) => {
			state.moveSymbolToWatchlist = payload;
		},

		setOrderDetailsModal: (state, { payload }: PayloadAction<ModalState['orderDetails']>) => {
			state.orderDetails = payload;
		},

		setChoiceCollateralModal: (state, { payload }: PayloadAction<ModalState['choiceCollateral']>) => {
			state.choiceCollateral = payload;
		},

		setConfirmModal: (state, { payload }: PayloadAction<ModalState['confirm']>) => {
			state.confirm = payload;
		},

		setAcceptAgreementModal: (state, { payload }: PayloadAction<ModalState['acceptAgreement']>) => {
			state.acceptAgreement = payload;
		},

		setLoginModal: (state, { payload }: PayloadAction<ModalState['loginModal']>) => {
			state.loginModal = payload;
		},

		setForgetPasswordModal: (state, { payload }: PayloadAction<ModalState['forgetPassword']>) => {
			state.forgetPassword = payload;
		},

		setOptionFiltersModal: (state, { payload }: PayloadAction<ModalState['optionFilters']>) => {
			state.optionFilters = payload;
		},

		setLogoutModal: (state, { payload }: PayloadAction<ModalState['logout']>) => {
			state.logout = payload;
		},

		setSelectSymbolContractsModal: (state, { payload }: PayloadAction<ModalState['selectSymbolContracts']>) => {
			state.selectSymbolContracts = payload;
		},

		setAddSaturnTemplateModal: (state, { payload }: PayloadAction<ModalState['addSaturnTemplate']>) => {
			state.addSaturnTemplate = payload;
		},

		setSymbolInfoPanelSettingModal: (state, { payload }: PayloadAction<ModalState['symbolInfoPanelSetting']>) => {
			state.symbolInfoPanelSetting = payload;
		},

		setAddNewOptionWatchlistModal: (state, { payload }: PayloadAction<ModalState['addNewOptionWatchlist']>) => {
			state.addNewOptionWatchlist = payload;
		},

		setAddSymbolToWatchlistModal: (state, { payload }: PayloadAction<ModalState['addSymbolToWatchlist']>) => {
			state.addSymbolToWatchlist = payload;
		},

		setChoiceBrokerModal: (state, { payload }: PayloadAction<ModalState['choiceBroker']>) => {
			state.choiceBroker = payload;
		},

		setBlackScholesModal: (state, { payload }: PayloadAction<ModalState['blackScholes']>) => {
			state.blackScholes = payload;
		},

		setManageOptionWatchlistListModal: (
			state,
			{ payload }: PayloadAction<ModalState['manageOptionWatchlistList']>,
		) => {
			state.manageOptionWatchlistList = payload;
		},

		setChangeBrokerModal: (state, { payload }: PayloadAction<ModalState['changeBroker']>) => {
			state.changeBroker = payload;
		},

		setWithdrawalModal: (state, { payload }: PayloadAction<ModalState['withdrawal']>) => {
			state.withdrawal = payload;
		},

		setDepositModal: (state, { payload }: PayloadAction<ModalState['deposit']>) => {
			state.deposit = payload;
		},

		setFreezeModal: (state, { payload }: PayloadAction<ModalState['freeze']>) => {
			state.freeze = payload;
		},

		setOptionSettlementModal: (state, { payload }: PayloadAction<ModalState['optionSettlement']>) => {
			state.optionSettlement = payload;
		},

		setAnalyzeModal: (state, { payload }: PayloadAction<ModalState['analyze']>) => {
			state.analyze = payload;
		},

		setDescriptionModal: (state, { payload }: PayloadAction<ModalState['description']>) => {
			state.description = payload;
		},

		setTransactionsFiltersModal: (state, { payload }: PayloadAction<ModalState['transactionsFilters']>) => {
			state.transactionsFilters = payload;
		},

		setInstantDepositReportsFiltersModal: (
			state,
			{ payload }: PayloadAction<ModalState['instantDepositReportsFilters']>,
		) => {
			state.instantDepositReportsFilters = payload;
		},

		setDepositWithReceiptReportsFiltersModal: (
			state,
			{ payload }: PayloadAction<ModalState['depositWithReceiptReportsFilters']>,
		) => {
			state.depositWithReceiptReportsFilters = payload;
		},

		setWithdrawalCashReportsFiltersModal: (
			state,
			{ payload }: PayloadAction<ModalState['withdrawalCashReportsFilters']>,
		) => {
			state.withdrawalCashReportsFilters = payload;
		},

		setChangeBrokerReportsFiltersModal: (
			state,
			{ payload }: PayloadAction<ModalState['changeBrokerReportsFilters']>,
		) => {
			state.changeBrokerReportsFilters = payload;
		},

		setFreezeUnFreezeReportsFiltersModal: (
			state,
			{ payload }: PayloadAction<ModalState['freezeUnfreezeReportsFilters']>,
		) => {
			state.freezeUnfreezeReportsFilters = payload;
		},

		setCashSettlementReportsFiltersModal: (
			state,
			{ payload }: PayloadAction<ModalState['cashSettlementReportsFilters']>,
		) => {
			state.cashSettlementReportsFilters = payload;
		},

		setPhysicalSettlementReportsFiltersModal: (
			state,
			{ payload }: PayloadAction<ModalState['physicalSettlementReportsFilters']>,
		) => {
			state.physicalSettlementReportsFilters = payload;
		},

		setOrdersReportsFiltersModal: (state, { payload }: PayloadAction<ModalState['ordersReportsFilters']>) => {
			state.ordersReportsFilters = payload;
		},

		setTradesReportsFiltersModal: (state, { payload }: PayloadAction<ModalState['tradesReportsFilters']>) => {
			state.tradesReportsFilters = payload;
		},

		setExecuteCoveredCallStrategyModal: (
			state,
			{ payload }: PayloadAction<ModalState['executeCoveredCallStrategyModal']>,
		) => {
			state.executeCoveredCallStrategyModal = payload;
		},

		updateExecuteCoveredCallStrategyModal: (
			state,
			{ payload }: PayloadAction<Partial<ModalState['executeCoveredCallStrategyModal']>>,
		) => {
			if (state.executeCoveredCallStrategyModal !== null) {
				state.executeCoveredCallStrategyModal = { ...state.executeCoveredCallStrategyModal, ...payload };
			}
		},

		setManageColumnsModal: (state, { payload }: PayloadAction<ModalState['manageColumns']>) => {
			state.manageColumns = payload;
		},

		setMarketStateModal: (state, { payload }: PayloadAction<ModalState['marketState']>) => {
			state.marketState = payload;
		},

		setMarketViewModal: (state, { payload }: PayloadAction<ModalState['marketView']>) => {
			state.marketView = payload;
		},

		setBestModal: (state, { payload }: PayloadAction<ModalState['best']>) => {
			state.best = payload;
		},

		setUserProgressBarModal: (state, { payload }: PayloadAction<ModalState['userProgressBar']>) => {
			state.userProgressBar = payload;
		},

		setCompareTransactionValueModal: (state, { payload }: PayloadAction<ModalState['compareTransactionValue']>) => {
			state.compareTransactionValue = payload;
		},

		setOptionContractModal: (state, { payload }: PayloadAction<ModalState['optionContract']>) => {
			state.optionContract = payload;
		},

		setOptionTradeValueModal: (state, { payload }: PayloadAction<ModalState['optionTradeValue']>) => {
			state.optionTradeValue = payload;
		},

		setOptionMarketProcessModal: (state, { payload }: PayloadAction<ModalState['optionMarketProcess']>) => {
			state.optionMarketProcess = payload;
		},

		setIndividualAndLegalModal: (state, { payload }: PayloadAction<ModalState['individualAndLegal']>) => {
			state.individualAndLegal = payload;
		},

		setPriceChangeWatchlistModal: (state, { payload }: PayloadAction<ModalState['priceChangeWatchlist']>) => {
			state.priceChangeWatchlist = payload;
		},

		setOpenPositionProcessModal: (state, { payload }: PayloadAction<ModalState['openPositionProcess']>) => {
			state.openPositionProcess = payload;
		},

		setMeetingsModal: (state, { payload }: PayloadAction<ModalState['meetings']>) => {
			state.meetings = payload;
		},

		setNewAndOldModal: (state, { payload }: PayloadAction<ModalState['newAndOld']>) => {
			state.newAndOld = payload;
		},

		setTopBaseAssetsModal: (state, { payload }: PayloadAction<ModalState['newAndOld']>) => {
			state.topBaseAssets = payload;
		},

		setRecentActivitiesModal: (state, { payload }: PayloadAction<ModalState['recentActivities']>) => {
			state.recentActivities = payload;
		},

		setDueDatesModal: (state, { payload }: PayloadAction<ModalState['dueDates']>) => {
			state.dueDates = payload;
		},

		setStrategyFiltersModal: (state, { payload }: PayloadAction<ModalState['strategyFilters']>) => {
			state.strategyFilters = payload;
		},

		setChangeBlockTypeModal: (state, { payload }: PayloadAction<ModalState['changeBlockTypeModal']>) => {
			state.changeBlockTypeModal = payload;
		},
	},
});

export const {
	setLoginModal,
	setBuySellModal,
	setChangeBlockTypeModal,
	setOrderDetailsModal,
	setSymbolInfoPanelSettingModal,
	setForgetPasswordModal,
	setExecuteCoveredCallStrategyModal,
	updateExecuteCoveredCallStrategyModal,
	setOptionFiltersModal,
	setLogoutModal,
	setBlackScholesModal,
	setConfirmModal,
	setSelectSymbolContractsModal,
	setAddSaturnTemplateModal,
	setAddNewOptionWatchlistModal,
	setChoiceBrokerModal,
	setMoveSymbolToWatchlistModal,
	setChoiceCollateralModal,
	setAddSymbolToWatchlistModal,
	setManageOptionWatchlistListModal,
	setChangeBrokerModal,
	setWithdrawalModal,
	setDepositModal,
	setFreezeModal,
	setOptionSettlementModal,
	setDescriptionModal,
	setAnalyzeModal,
	setTransactionsFiltersModal,
	setInstantDepositReportsFiltersModal,
	setDepositWithReceiptReportsFiltersModal,
	setWithdrawalCashReportsFiltersModal,
	setChangeBrokerReportsFiltersModal,
	setFreezeUnFreezeReportsFiltersModal,
	setCashSettlementReportsFiltersModal,
	setPhysicalSettlementReportsFiltersModal,
	setOrdersReportsFiltersModal,
	setTradesReportsFiltersModal,
	setAcceptAgreementModal,
	setManageColumnsModal,
	setMarketStateModal,
	setMarketViewModal,
	setBestModal,
	setUserProgressBarModal,
	setCompareTransactionValueModal,
	setOptionContractModal,
	setOptionTradeValueModal,
	setOptionMarketProcessModal,
	setIndividualAndLegalModal,
	setPriceChangeWatchlistModal,
	setOpenPositionProcessModal,
	setMeetingsModal,
	setNewAndOldModal,
	setTopBaseAssetsModal,
	setRecentActivitiesModal,
	setDueDatesModal,
	setStrategyFiltersModal,
} = modalSlice.actions;

export const getChoiceBrokerModal = (state: RootState) => state.modal.choiceBroker;
export const getChoiceCollateral = (state: RootState) => state.modal.choiceCollateral;
export const getLoginModal = (state: RootState) => state.modal.loginModal;
export const getMoveSymbolToWatchlistModal = (state: RootState) => state.modal.moveSymbolToWatchlist;
export const getLogoutModal = (state: RootState) => state.modal.logout;
export const getBuySellModal = (state: RootState) => state.modal.buySell;
export const getConfirmModal = (state: RootState) => state.modal.confirm;
export const getAcceptAgreement = (state: RootState) => state.modal.acceptAgreement;
export const getBlackScholesModal = (state: RootState) => state.modal.blackScholes;
export const getForgetPasswordModal = (state: RootState) => state.modal.forgetPassword;
export const getOptionFiltersModal = (state: RootState) => state.modal.optionFilters;
export const getSelectSymbolContractsModal = (state: RootState) => state.modal.selectSymbolContracts;
export const getAddSaturnTemplateModal = (state: RootState) => state.modal.addSaturnTemplate;
export const getAddNewOptionWatchlistModal = (state: RootState) => state.modal.addNewOptionWatchlist;
export const getOrderDetailsModal = (state: RootState) => state.modal.orderDetails;
export const getManageOptionWatchlistListModal = (state: RootState) => state.modal.manageOptionWatchlistList;
export const getAddSymbolToWatchlistModal = (state: RootState) => state.modal.addSymbolToWatchlist;
export const getAnalyzeModal = (state: RootState) => state.modal.analyze;
export const getDescriptionModal = (state: RootState) => state.modal.description;
export const getOptionSettlementModal = (state: RootState) => state.modal.optionSettlement;
export const getTransactionsFiltersModal = (state: RootState) => state.modal.transactionsFilters;
export const getInstantDepositReportsFiltersModal = (state: RootState) => state.modal.instantDepositReportsFilters;
export const getDepositWithReceiptReportsFiltersModal = (state: RootState) =>
	state.modal.depositWithReceiptReportsFilters;
export const getWithdrawalCashReportsFiltersModal = (state: RootState) => state.modal.withdrawalCashReportsFilters;
export const getChangeBrokerReportsFiltersModal = (state: RootState) => state.modal.changeBrokerReportsFilters;
export const getFreezeUnFreezeReportsFiltersModal = (state: RootState) => state.modal.freezeUnfreezeReportsFilters;
export const getCashSettlementReportsFiltersModal = (state: RootState) => state.modal.cashSettlementReportsFilters;
export const getPhysicalSettlementReportsFiltersModal = (state: RootState) =>
	state.modal.physicalSettlementReportsFilters;
export const getOrdersReportsFiltersModal = (state: RootState) => state.modal.ordersReportsFilters;
export const getTradesReportsFiltersModal = (state: RootState) => state.modal.tradesReportsFilters;
export const getExecuteCoveredCallStrategyModal = (state: RootState) => state.modal.executeCoveredCallStrategyModal;
export const getSymbolInfoPanelSettingModal = (state: RootState) => state.modal.symbolInfoPanelSetting;
export const getMarketStateModal = (state: RootState) => state.modal.marketState;
export const getMarketViewModal = (state: RootState) => state.modal.marketView;
export const getBestModal = (state: RootState) => state.modal.best;
export const getUserProgressBarModal = (state: RootState) => state.modal.userProgressBar;
export const getCompareTransactionValueModal = (state: RootState) => state.modal.compareTransactionValue;
export const getOptionContractModal = (state: RootState) => state.modal.optionContract;
export const getOptionTradeValueModal = (state: RootState) => state.modal.optionTradeValue;
export const getOptionMarketProcessModal = (state: RootState) => state.modal.optionMarketProcess;
export const getIndividualAndLegalModal = (state: RootState) => state.modal.individualAndLegal;
export const getPriceChangeWatchlistModal = (state: RootState) => state.modal.priceChangeWatchlist;
export const getOpenPositionProcessModal = (state: RootState) => state.modal.openPositionProcess;
export const getMeetingModal = (state: RootState) => state.modal.meetings;
export const getNewAndOldModal = (state: RootState) => state.modal.newAndOld;
export const getTopBaseAssetsModal = (state: RootState) => state.modal.topBaseAssets;
export const getRecentActivitiesModal = (state: RootState) => state.modal.recentActivities;
export const getDueDatesModal = (state: RootState) => state.modal.dueDates;
export const getStrategyFiltersModal = (state: RootState) => state.modal.strategyFilters;
export const getChangeBlockTypeModal = (state: RootState) => state.modal.changeBlockTypeModal;

export default modalSlice.reducer;
