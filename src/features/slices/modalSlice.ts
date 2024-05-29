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

	// چیدمان صفحه اصلی
	manageDashboardLayout: null,

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
	createStrategy: null,

	// فیلتر کاورد کال
	coveredCallFilters: null,
	// تایید توافق‌نامه
	acceptAgreement: null,

	// تنظیمات ستون
	manageColumns: null,
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

		setManageDashboardLayoutModal: (state, { payload }: PayloadAction<ModalState['manageDashboardLayout']>) => {
			state.manageDashboardLayout = payload;
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

		setCreateStrategyModal: (state, { payload }: PayloadAction<ModalState['createStrategy']>) => {
			state.createStrategy = payload;
		},

		setCoveredCallFiltersModal: (state, { payload }: PayloadAction<ModalState['coveredCallFilters']>) => {
			state.coveredCallFilters = payload;
		},

		setManageColumnsModal: (state, { payload }: PayloadAction<ModalState['manageColumns']>) => {
			state.manageColumns = payload;
		},
	},
});

export const {
	setLoginModal,
	setBuySellModal,
	setOrderDetailsModal,
	setSymbolInfoPanelSettingModal,
	setForgetPasswordModal,
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
	setManageDashboardLayoutModal,
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
	setCreateStrategyModal,
	setCoveredCallFiltersModal,
	setAcceptAgreementModal,
	setManageColumnsModal,
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
export const getGetStrategyModal = (state: RootState) => state.modal.createStrategy;
export const getSymbolInfoPanelSettingModal = (state: RootState) => state.modal.symbolInfoPanelSetting;

export default modalSlice.reducer;
