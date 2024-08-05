'use client';

import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setAcceptAgreementModal,
	setAddNewOptionWatchlistModal,
	setAddSaturnTemplateModal,
	setAddSymbolToWatchlistModal,
	setAnalyzeModal,
	setBestModal,
	setBlackScholesModal,
	setBuySellModal,
	setCashSettlementReportsFiltersModal,
	setChangeBlockTypeModal,
	setChangeBrokerModal,
	setChangeBrokerReportsFiltersModal,
	setChoiceBrokerModal,
	setChoiceCollateralModal,
	setCompareTransactionValueModal,
	setConfirmModal,
	setDepositModal,
	setDepositWithReceiptReportsFiltersModal,
	setDescriptionModal,
	setDueDatesModal,
	setExecuteCoveredCallStrategyModal,
	setForgetPasswordModal,
	setFreezeModal,
	setFreezeUnFreezeReportsFiltersModal,
	setIndividualAndLegalModal,
	setInstantDepositReportsFiltersModal,
	setLoginModal,
	setLogoutModal,
	setManageColumnsModal,
	setManageOptionWatchlistListModal,
	setMarketStateModal,
	setMarketViewModal,
	setMeetingsModal,
	setMoveSymbolToWatchlistModal,
	setNewAndOldModal,
	setOpenPositionProcessModal,
	setOptionContractModal,
	setOptionFiltersModal,
	setOptionMarketProcessModal,
	setOptionSettlementModal,
	setOptionTradeValueModal,
	setOrderDetailsModal,
	setOrdersReportsFiltersModal,
	setPhysicalSettlementReportsFiltersModal,
	setPriceChangeWatchlistModal,
	setRecentActivitiesModal,
	setSelectSymbolContractsModal,
	setStrategyFiltersModal,
	setSymbolInfoPanelSettingModal,
	setTopBaseAssetsModal,
	setTradesReportsFiltersModal,
	setTransactionsFiltersModal,
	setWithdrawalCashReportsFiltersModal,
	setWithdrawalModal,
} from '@/features/slices/modalSlice';
import { cloneElement, forwardRef, Fragment, lazy, Suspense } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import AuthorizeMiddleware from '../common/Middlewares/AuthorizeMiddleware';
import AnimatePresence from '../common/animation/AnimatePresence';
import ModalLoading from './ModalLoading';

const LoginModal = lazy(() => import('./LoginModal'));

const AddNewOptionWatchlist = lazy(() => import('./AddNewOptionWatchlist'));

const AddSaturnTemplate = lazy(() => import('./AddSaturnTemplate'));

const AddSymbolToWatchlist = lazy(() => import('./AddSymbolToWatchlist'));

const BlackScholes = lazy(() => import('./BlackScholes'));

const BuySellModal = lazy(() => import('./BuySellModal'));

const ChoiceBroker = lazy(() => import('./ChoiceBroker'));

const ForgetPasswordModal = lazy(() => import('./ForgetPasswordModal'));

const ChangeBlockTypeModal = lazy(() => import('./ChangeBlockTypeModal'));

const LogoutModal = lazy(() => import('./LogoutModal'));

const ManageOptionWatchlistList = lazy(() => import('./ManageOptionWatchlistList'));

const OptionWatchlistFiltersModal = lazy(() => import('./OptionWatchlistFiltersModal'));

const SymbolContracts = lazy(() => import('./SelectSymbolContracts'));

const OrderDetails = lazy(() => import('./OrderDetails'));

const MoveSymbolToWatchlist = lazy(() => import('./MoveSymbolToWatchlist'));

const Withdrawal = lazy(() => import('./Withdrawal'));

const Deposit = lazy(() => import('./Deposit'));

const Freeze = lazy(() => import('./Freeze'));

const OptionSettlement = lazy(() => import('./OptionSettlement'));

const ChangeBroker = lazy(() => import('./ChangeBroker'));

const Description = lazy(() => import('./Description'));

const AcceptAgreement = lazy(() => import('./AcceptAgreement'));

const Analyze = lazy(() => import('./Analyze'));

const CashSettlementReportsFiltersModal = lazy(() => import('./CashSettlementReportsFiltersModal'));

const ChangeBrokerReportsFiltersModal = lazy(() => import('./ChangeBrokerReportsFiltersModal'));

const ChoiceCollateral = lazy(() => import('./ChoiceCollateral'));

const Confirm = lazy(() => import('./Confirm'));

const ExecuteCoveredCallStrategyModal = lazy(() => import('./ExecuteCoveredCallStrategyModal'));

const DepositWithReceiptFiltersModal = lazy(() => import('./DepositWithReceiptReportsFiltersModal'));

const FreezeUnFreezeReportsModal = lazy(() => import('./FreezeUnFreezeReportsModal'));

const InstantDepositReportsFiltersModal = lazy(() => import('./InstantDepositReportsFiltersModal'));

const OrdersReportsFiltersModal = lazy(() => import('./OrdersReportsFiltersModal'));

const PhysicalSettlementReportsFiltersModal = lazy(() => import('./PhysicalSettlementReportsFiltersModal'));

const SymbolInfoPanelSetting = lazy(() => import('./SymbolInfoPanelSetting'));

const TradesReportsFiltersModal = lazy(() => import('./TradesReportsFiltersModal'));

const TransactionsFiltersModal = lazy(() => import('./TransactionsFiltersModal'));

const WithdrawalCashReportsFiltersModal = lazy(() => import('./WithdrawalCashReportsFiltersModal'));

const ManageColumnsModal = lazy(() => import('./ManageColumnsModal'));

const MarketStateModal = lazy(() => import('./DashboardModals/MarketStateModal'));

const MarketViewModal = lazy(() => import('./DashboardModals/MarketViewModal'));

const BestModal = lazy(() => import('./DashboardModals/BestModal'));

// const UserInprogressBarModal = lazy(() => import('./DashboardModals/UserProgressBarModal')); //

const CompareTransactionValueModal = lazy(() => import('./DashboardModals/CompareTransactionValueModal'));

const OptionContractModal = lazy(() => import('./DashboardModals/OptionContractModal'));

const OptionTradeValueModal = lazy(() => import('./DashboardModals/OptionTradeValueModal'));

const OptionMarketProcessModal = lazy(() => import('./DashboardModals/OptionMarketProcessModal'));

const IndividualAndLegalModal = lazy(() => import('./DashboardModals/IndividualAndLegalModal'));

const PriceChangeWatchlistModal = lazy(() => import('./DashboardModals/PriceChangeWatchlistModal'));

const OpenPositionProcessModal = lazy(() => import('./DashboardModals/OpenPositionProcessModal'));

const MeetingsModal = lazy(() => import('./DashboardModals/MeetingsModal'));

const NewAndOldModal = lazy(() => import('./DashboardModals/NewAndOldModal'));

const TopBaseAssetsModal = lazy(() => import('./DashboardModals/TopBaseAssetsModal'));

const RecentActivitiesModal = lazy(() => import('./DashboardModals/RecentActivitiesModal'));

const DueDatesModal = lazy(() => import('./DashboardModals/DueDatesModal'));

const StrategyFilters = lazy(() => import('./StrategyFilters'));

const Modals = () => {
	const dispatch = useAppDispatch();

	const {
		loginModal,
		logout,
		optionFilters,
		forgetPassword,
		selectSymbolContracts,
		addSaturnTemplate,
		addNewOptionWatchlist,
		manageOptionWatchlistList,
		buySell,
		changeBlockTypeModal,
		addSymbolToWatchlist,
		choiceBroker,
		confirm,
		acceptAgreement,
		symbolInfoPanelSetting,
		choiceCollateral,
		blackScholes,
		moveSymbolToWatchlist,
		orderDetails,
		changeBroker,
		deposit,
		freeze,
		optionSettlement,
		withdrawal,
		analyze,
		transactionsFilters,
		instantDepositReportsFilters,
		depositWithReceiptReportsFilters,
		withdrawalCashReportsFilters,
		changeBrokerReportsFilters,
		freezeUnfreezeReportsFilters,
		description,
		cashSettlementReportsFilters,
		physicalSettlementReportsFilters,
		ordersReportsFilters,
		executeCoveredCallStrategyModal,
		tradesReportsFilters,
		manageColumns,
		marketState,
		marketView,
		best,
		compareTransactionValue,
		optionContract,
		optionTradeValue,
		optionMarketProcess,
		individualAndLegal,
		priceChangeWatchlist,
		openPositionProcess,
		meetings,
		newAndOld,
		topBaseAssets,
		recentActivities,
		dueDates,
		strategyFilters,
	} = useAppSelector((state) => state.modal);

	const closeLoginModalModal = () => {
		dispatch(setLoginModal(null));
	};

	const closeLogoutModal = () => {
		dispatch(setLogoutModal(null));
	};

	const closeOptionFiltersModal = () => {
		dispatch(setOptionFiltersModal(null));
	};

	const closeForgetPasswordModal = () => {
		dispatch(setForgetPasswordModal(null));
	};

	const closeSelectSymbolContractsModal = () => {
		dispatch(setSelectSymbolContractsModal(null));
	};

	const closeAddSaturnTemplateModal = () => {
		dispatch(setAddSaturnTemplateModal(null));
	};

	const closeAddNewOptionWatchlistModal = () => {
		dispatch(setAddNewOptionWatchlistModal(null));
	};

	const closeManageOptionWatchlistListModal = () => {
		dispatch(setManageOptionWatchlistListModal(null));
	};

	const closeBuySellModal = () => {
		dispatch(setBuySellModal(null));
	};

	const closeChangeBlockTypeModalModal = () => {
		dispatch(setChangeBlockTypeModal(null));
	};

	const closeAddSymbolToWatchlistModal = () => {
		dispatch(setAddSymbolToWatchlistModal(null));
	};

	const closeChoiceBrokerModal = () => {
		dispatch(setChoiceBrokerModal(null));
	};

	const closeConfirmModal = () => {
		dispatch(setConfirmModal(null));
	};

	const closeAcceptAgreementModal = () => {
		dispatch(setAcceptAgreementModal(null));
	};

	const closeSymbolInfoPanelSettingModal = () => {
		dispatch(setSymbolInfoPanelSettingModal(null));
	};

	const closeChoiceCollateralModal = () => {
		dispatch(setChoiceCollateralModal(null));
	};

	const closeBlackScholesModal = () => {
		dispatch(setBlackScholesModal(null));
	};

	const closeMoveSymbolToWatchlistModal = () => {
		dispatch(setMoveSymbolToWatchlistModal(null));
	};

	const closeOrderDetailsModal = () => {
		dispatch(setOrderDetailsModal(null));
	};

	const closeChangeBrokerModal = () => {
		dispatch(setChangeBrokerModal(null));
	};

	const closeDepositModal = () => {
		dispatch(setDepositModal(null));
	};

	const closeFreezeModal = () => {
		dispatch(setFreezeModal(null));
	};

	const closeOptionSettlementModal = () => {
		dispatch(setOptionSettlementModal(null));
	};

	const closeWithdrawalModal = () => {
		dispatch(setWithdrawalModal(null));
	};

	const closeAnalyzeModal = () => {
		dispatch(setAnalyzeModal(null));
	};

	const closeTransactionsFiltersModal = () => {
		dispatch(setTransactionsFiltersModal(null));
	};

	const closeInstantDepositReportsFiltersModal = () => {
		dispatch(setInstantDepositReportsFiltersModal(null));
	};

	const closeDepositWithReceiptReportsFiltersModal = () => {
		dispatch(setDepositWithReceiptReportsFiltersModal(null));
	};

	const closeWithdrawalCashReportsFiltersModal = () => {
		dispatch(setWithdrawalCashReportsFiltersModal(null));
	};

	const closeChangeBrokerReportsFiltersModal = () => {
		dispatch(setChangeBrokerReportsFiltersModal(null));
	};

	const closeFreezeUnfreezeReportsFiltersModal = () => {
		dispatch(setFreezeUnFreezeReportsFiltersModal(null));
	};

	const closeDescriptionModal = () => {
		dispatch(setDescriptionModal(null));
	};

	const closeCashSettlementReportsFiltersModal = () => {
		dispatch(setCashSettlementReportsFiltersModal(null));
	};

	const closePhysicalSettlementReportsFiltersModal = () => {
		dispatch(setPhysicalSettlementReportsFiltersModal(null));
	};

	const closeOrdersReportsFiltersModal = () => {
		dispatch(setOrdersReportsFiltersModal(null));
	};

	const closeExecuteCoveredCallStrategyModalModal = () => {
		dispatch(setExecuteCoveredCallStrategyModal(null));
	};

	const closeTradesReportsFiltersModal = () => {
		dispatch(setTradesReportsFiltersModal(null));
	};

	const closeManageColumnsModal = () => {
		dispatch(setManageColumnsModal(null));
	};

	const closeMarketStateModal = () => {
		dispatch(setMarketStateModal(null));
	};

	const closeMarketViewModal = () => {
		dispatch(setMarketViewModal(null));
	};

	const closeBestModal = () => {
		dispatch(setBestModal(null));
	};

	const closeCompareTransactionValueModal = () => {
		dispatch(setCompareTransactionValueModal(null));
	};

	const closeOptionContractModal = () => {
		dispatch(setOptionContractModal(null));
	};

	const closeOptionTradeValueModal = () => {
		dispatch(setOptionTradeValueModal(null));
	};

	const closeOptionMarketProcessModal = () => {
		dispatch(setOptionMarketProcessModal(null));
	};

	const closeIndividualAndLegalModal = () => {
		dispatch(setIndividualAndLegalModal(null));
	};

	const closePriceChangeWatchlistModal = () => {
		dispatch(setPriceChangeWatchlistModal(null));
	};

	const closeOpenPositionProcessModal = () => {
		dispatch(setOpenPositionProcessModal(null));
	};

	const closeMeetingsModal = () => {
		dispatch(setMeetingsModal(null));
	};

	const closeNewAndOldModal = () => {
		dispatch(setNewAndOldModal(null));
	};

	const closeTopBaseAssetsModal = () => {
		dispatch(setTopBaseAssetsModal(null));
	};

	const closeRecentActivitiesModal = () => {
		dispatch(setRecentActivitiesModal(null));
	};

	const closeDueDatesModal = () => {
		dispatch(setDueDatesModal(null));
	};

	const closeStrategyFiltersModal = () => {
		dispatch(setStrategyFiltersModal(null));
	};

	return (
		<Fragment>
			<ModalAnimatePresence fallback={closeLoginModalModal}>
				{loginModal && (
					<ModalSuspense>
						<LoginModal {...loginModal} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeLogoutModal}>
				{logout && (
					<ModalSuspense>
						<LogoutModal {...logout} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeOptionFiltersModal}>
				{analyze && (
					<ModalSuspense>
						<Analyze {...analyze} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeForgetPasswordModal}>
				{confirm && (
					<ModalSuspense>
						<Confirm {...confirm} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeSelectSymbolContractsModal}>
				{acceptAgreement && (
					<ModalSuspense>
						<AcceptAgreement {...acceptAgreement} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeAddSaturnTemplateModal}>
				{description && (
					<ModalSuspense>
						<Description {...description} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeAddNewOptionWatchlistModal}>
				{symbolInfoPanelSetting && (
					<ModalSuspense>
						<SymbolInfoPanelSetting {...symbolInfoPanelSetting} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeManageOptionWatchlistListModal}>
				{blackScholes && (
					<ModalSuspense>
						<BlackScholes {...blackScholes} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeBuySellModal}>
				{optionFilters && (
					<ModalSuspense>
						<OptionWatchlistFiltersModal {...optionFilters} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeChangeBlockTypeModalModal}>
				{selectSymbolContracts && (
					<ModalSuspense>
						<SymbolContracts {...selectSymbolContracts} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeAddSymbolToWatchlistModal}>
				{choiceBroker && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeAddSymbolToWatchlistModal}>
							<ChoiceBroker {...choiceBroker} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeChoiceBrokerModal}>
				{changeBroker && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeChoiceBrokerModal} broker>
							<ChangeBroker {...changeBroker} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeConfirmModal}>
				{withdrawal && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeConfirmModal} broker>
							<Withdrawal {...withdrawal} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeAcceptAgreementModal}>
				{deposit && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeAcceptAgreementModal} broker>
							<Deposit {...deposit} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeSymbolInfoPanelSettingModal}>
				{freeze && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeSymbolInfoPanelSettingModal} broker>
							<Freeze {...freeze} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeChoiceCollateralModal}>
				{optionSettlement && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeChoiceCollateralModal} broker>
							<OptionSettlement {...optionSettlement} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeBlackScholesModal}>
				{addSaturnTemplate && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeBlackScholesModal}>
							<AddSaturnTemplate {...addSaturnTemplate} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeMoveSymbolToWatchlistModal}>
				{addNewOptionWatchlist && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeMoveSymbolToWatchlistModal}>
							<AddNewOptionWatchlist {...addNewOptionWatchlist} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeOrderDetailsModal}>
				{manageOptionWatchlistList && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeOrderDetailsModal}>
							<ManageOptionWatchlistList {...manageOptionWatchlistList} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeChangeBrokerModal}>
				{buySell && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeChangeBrokerModal} broker>
							<BuySellModal {...buySell} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeDepositModal}>
				{changeBlockTypeModal && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeDepositModal} broker>
							<ChangeBlockTypeModal {...changeBlockTypeModal} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeFreezeModal}>
				{addSymbolToWatchlist && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeFreezeModal}>
							<AddSymbolToWatchlist {...addSymbolToWatchlist} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeOptionSettlementModal}>
				{choiceCollateral && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeOptionSettlementModal}>
							<ChoiceCollateral {...choiceCollateral} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeWithdrawalModal}>
				{orderDetails && (
					<ModalSuspense>
						<OrderDetails {...orderDetails} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeAnalyzeModal}>
				{moveSymbolToWatchlist && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeAnalyzeModal}>
							<MoveSymbolToWatchlist {...moveSymbolToWatchlist} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeTransactionsFiltersModal}>
				{forgetPassword && (
					<ModalSuspense>
						<ForgetPasswordModal
							phoneNumber={
								forgetPassword && typeof forgetPassword === 'object'
									? forgetPassword?.phoneNumber
									: undefined
							}
						/>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeInstantDepositReportsFiltersModal}>
				{transactionsFilters && (
					<ModalSuspense>
						<TransactionsFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeDepositWithReceiptReportsFiltersModal}>
				{instantDepositReportsFilters && (
					<ModalSuspense>
						<InstantDepositReportsFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeWithdrawalCashReportsFiltersModal}>
				{depositWithReceiptReportsFilters && (
					<ModalSuspense>
						<DepositWithReceiptFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeChangeBrokerReportsFiltersModal}>
				{withdrawalCashReportsFilters && (
					<ModalSuspense>
						<WithdrawalCashReportsFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeFreezeUnfreezeReportsFiltersModal}>
				{changeBrokerReportsFilters && (
					<ModalSuspense>
						<ChangeBrokerReportsFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeDescriptionModal}>
				{freezeUnfreezeReportsFilters && (
					<ModalSuspense>
						<FreezeUnFreezeReportsModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeCashSettlementReportsFiltersModal}>
				{cashSettlementReportsFilters && (
					<ModalSuspense>
						<CashSettlementReportsFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closePhysicalSettlementReportsFiltersModal}>
				{physicalSettlementReportsFilters && (
					<ModalSuspense>
						<PhysicalSettlementReportsFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeOrdersReportsFiltersModal}>
				{ordersReportsFilters && (
					<ModalSuspense>
						<OrdersReportsFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeExecuteCoveredCallStrategyModalModal}>
				{executeCoveredCallStrategyModal && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={closeExecuteCoveredCallStrategyModalModal} broker>
							<ExecuteCoveredCallStrategyModal {...executeCoveredCallStrategyModal} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeTradesReportsFiltersModal}>
				{tradesReportsFilters && (
					<ModalSuspense>
						<TradesReportsFiltersModal {...tradesReportsFilters} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeManageColumnsModal}>
				{manageColumns && (
					<ModalSuspense>
						<ManageColumnsModal {...manageColumns} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeMarketStateModal}>
				{marketState && (
					<ModalSuspense>
						<MarketStateModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeMarketViewModal}>
				{marketView && (
					<ModalSuspense>
						<MarketViewModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeBestModal}>
				{best && (
					<ModalSuspense>
						<BestModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeCompareTransactionValueModal}>
				{compareTransactionValue && (
					<ModalSuspense>
						<CompareTransactionValueModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeOptionContractModal}>
				{optionContract && (
					<ModalSuspense>
						<OptionContractModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeOptionTradeValueModal}>
				{optionTradeValue && (
					<ModalSuspense>
						<OptionTradeValueModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeOptionMarketProcessModal}>
				{optionMarketProcess && (
					<ModalSuspense>
						<OptionMarketProcessModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeIndividualAndLegalModal}>
				{individualAndLegal && (
					<ModalSuspense>
						<IndividualAndLegalModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closePriceChangeWatchlistModal}>
				{priceChangeWatchlist && (
					<ModalSuspense>
						<PriceChangeWatchlistModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeOpenPositionProcessModal}>
				{openPositionProcess && (
					<ModalSuspense>
						<OpenPositionProcessModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeMeetingsModal}>
				{meetings && (
					<ModalSuspense>
						<MeetingsModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeNewAndOldModal}>
				{newAndOld && (
					<ModalSuspense>
						<NewAndOldModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeTopBaseAssetsModal}>
				{topBaseAssets && (
					<ModalSuspense>
						<TopBaseAssetsModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeRecentActivitiesModal}>
				{recentActivities && (
					<ModalSuspense>
						<RecentActivitiesModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeDueDatesModal}>
				{dueDates && (
					<ModalSuspense>
						<DueDatesModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence fallback={closeStrategyFiltersModal}>
				{strategyFilters && (
					<ModalSuspense>
						<StrategyFilters {...strategyFilters} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>
		</Fragment>
	);
};

const ModalSuspense = forwardRef<HTMLDivElement, { children: ReactNode }>(({ children }, ref) => (
	<Suspense fallback={<ModalLoading ref={ref} />}>{children ? cloneElement(children, { ref }) : null}</Suspense>
));

const ModalAnimatePresence = ({ children, fallback }: { children: ReactNode; fallback: () => void }) => (
	<ErrorBoundary fallback={fallback}>
		<AnimatePresence initial={{ animation: 'fadeIn' }} exit={{ animation: 'fadeOut' }}>
			{children}
		</AnimatePresence>
	</ErrorBoundary>
);

export default Modals;
