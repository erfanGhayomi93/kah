'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';
import { type ModalState } from './modalSlice.interfaces';

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

	// جزئیات نماد
	symbolInfoPanelSetting: null,

	// افزودن قالب جدید زحل
	addSaturnTemplate: null,

	// قراردادهای نماد
	symbolContracts: null,

	// چیدمان صفحه اصلی
	manageDashboardLayout: null,

	// تغییر کارگزار ناظر
	changeBroker: null,

	// واریز وجه
	deposit: null,

	// برداشت وجه
	withdrawal: null,
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

		setLoginModal: (state, { payload }: PayloadAction<ModalState['loginModal']>) => {
			state.loginModal = payload;
		},

		setSymbolInfoPanelSetting: (state, { payload }: PayloadAction<ModalState['symbolInfoPanelSetting']>) => {
			state.symbolInfoPanelSetting = payload;
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

		setSymbolContractsModal: (state, { payload }: PayloadAction<ModalState['symbolContracts']>) => {
			state.symbolContracts = payload;
		},

		setAddSaturnTemplate: (state, { payload }: PayloadAction<ModalState['addSaturnTemplate']>) => {
			state.addSaturnTemplate = payload;
		},

		setAddNewOptionWatchlist: (state, { payload }: PayloadAction<ModalState['addNewOptionWatchlist']>) => {
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
	},
});

export const {
	setLoginModal,
	setBuySellModal,
	setOrderDetailsModal,
	setForgetPasswordModal,
	setOptionFiltersModal,
	setLogoutModal,
	setBlackScholesModal,
	setConfirmModal,
	setSymbolInfoPanelSetting,
	setSymbolContractsModal,
	setAddSaturnTemplate,
	setAddNewOptionWatchlist,
	setChoiceBrokerModal,
	setMoveSymbolToWatchlistModal,
	setChoiceCollateralModal,
	setAddSymbolToWatchlistModal,
	setManageOptionWatchlistListModal,
	setManageDashboardLayoutModal,
	setChangeBrokerModal,
	setWithdrawalModal,
	setDepositModal,
} = modalSlice.actions;

export const getChoiceBroker = (state: RootState) => state.modal.choiceBroker;
export const getChoiceCollateral = (state: RootState) => state.modal.choiceCollateral;
export const getLoginModal = (state: RootState) => state.modal.loginModal;
export const getMoveSymbolToWatchlistModal = (state: RootState) => state.modal.moveSymbolToWatchlist;
export const getLogoutModal = (state: RootState) => state.modal.logout;
export const getBuySellModal = (state: RootState) => state.modal.buySell;
export const getConfirmModal = (state: RootState) => state.modal.confirm;
export const getBlackScholesModal = (state: RootState) => state.modal.blackScholes;
export const getForgetPasswordModal = (state: RootState) => state.modal.forgetPassword;
export const getOptionFiltersModal = (state: RootState) => state.modal.optionFilters;
export const getSymbolContractsModal = (state: RootState) => state.modal.symbolContracts;
export const getAddSaturnTemplate = (state: RootState) => state.modal.addSaturnTemplate;
export const getAddNewOptionWatchlist = (state: RootState) => state.modal.addNewOptionWatchlist;
export const getOrderDetails = (state: RootState) => state.modal.orderDetails;
export const getManageOptionWatchlistList = (state: RootState) => state.modal.manageOptionWatchlistList;
export const getAddSymbolToWatchlist = (state: RootState) => state.modal.addSymbolToWatchlist;

export default modalSlice.reducer;
