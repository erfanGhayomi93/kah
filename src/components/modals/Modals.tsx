'use client';

import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setAddNewOptionWatchlistModal,
	setAddSaturnTemplateModal,
	setAddSymbolToWatchlistModal,
	setBuySellModal,
	setChangeBrokerModal,
	setChoiceCollateralModal,
	setDepositModal,
	setFreezeModal,
	setManageOptionWatchlistListModal,
	setMoveSymbolToWatchlistModal,
	setOptionSettlementModal,
	setWithdrawalModal,
} from '@/features/slices/modalSlice';
import { cloneElement, forwardRef, Fragment, lazy, Suspense } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import AuthorizeMiddleware from '../common/Middlewares/AuthorizeMiddleware';
import AnimatePresence from '../common/animation/AnimatePresence';

const LoginModal = lazy(() => import('./LoginModal'));

const AddNewOptionWatchlist = lazy(() => import('./AddNewOptionWatchlist'));

const AddSaturnTemplate = lazy(() => import('./AddSaturnTemplate'));

const AddSymbolToWatchlist = lazy(() => import('./AddSymbolToWatchlist'));

const BlackScholes = lazy(() => import('./BlackScholes'));

const BuySellModal = lazy(() => import('./BuySellModal'));

const ChoiceBroker = lazy(() => import('./ChoiceBroker'));

const ForgetPasswordModal = lazy(() => import('./ForgetPasswordModal'));

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

const ManageDashboardLayout = lazy(() => import('./ManageDashboardLayout'));

const Description = lazy(() => import('./Description'));

const AcceptAgreement = lazy(() => import('./AcceptAgreement'));

const Analyze = lazy(() => import('./Analyze'));

const CashSettlementReportsFiltersModal = lazy(() => import('./CashSettlementReportsFiltersModal'));

const ChangeBrokerReportsFiltersModal = lazy(() => import('./ChangeBrokerReportsFiltersModal'));

const ChoiceCollateral = lazy(() => import('./ChoiceCollateral'));

const Confirm = lazy(() => import('./Confirm'));

const CoveredCallFilters = lazy(() => import('./CoveredCallFilters'));

const CreateStrategyModal = lazy(() => import('./CreateStrategyModal'));

const DepositWithReceiptFiltersModal = lazy(() => import('./DepositWithReceiptReportsFiltersModal'));

const FreezeUnFreezeReportsModal = lazy(() => import('./FreezeUnFreezeReportsModal'));

const InstantDepositReportsFiltersModal = lazy(() => import('./InstantDepositReportsFiltersModal'));

const ModalLoading = lazy(() => import('./ModalLoading'));

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

const UserInprogressBarModal = lazy(() => import('./DashboardModals/UserProgressBarModal'));

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
		manageDashboardLayout,
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
		createStrategy,
		tradesReportsFilters,
		coveredCallFilters,
		manageColumns,
		marketState,
		marketView,
		best,
		userProgressBar,
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
	} = useAppSelector((state) => state.modal);

	return (
		<Fragment>
			<ModalAnimatePresence>
				{loginModal && (
					<ModalSuspense>
						<LoginModal {...loginModal} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{logout && (
					<ModalSuspense>
						<LogoutModal {...logout} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{analyze && (
					<ModalSuspense>
						<Analyze {...analyze} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{confirm && (
					<ModalSuspense>
						<Confirm {...confirm} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{acceptAgreement && (
					<ModalSuspense>
						<AcceptAgreement {...acceptAgreement} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{description && (
					<ModalSuspense>
						<Description {...description} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{symbolInfoPanelSetting && (
					<ModalSuspense>
						<SymbolInfoPanelSetting {...symbolInfoPanelSetting} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{blackScholes && (
					<ModalSuspense>
						<BlackScholes {...blackScholes} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{optionFilters && (
					<ModalSuspense>
						<OptionWatchlistFiltersModal {...optionFilters} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{selectSymbolContracts && (
					<ModalSuspense>
						<SymbolContracts {...selectSymbolContracts} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{choiceBroker && (
					<ModalSuspense>
						<ChoiceBroker {...choiceBroker} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{changeBroker && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={() => dispatch(setChangeBrokerModal(null))} broker>
							<ChangeBroker {...changeBroker} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{withdrawal && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={() => dispatch(setWithdrawalModal(null))} broker>
							<Withdrawal {...withdrawal} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{deposit && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={() => dispatch(setDepositModal(null))} broker>
							<Deposit {...deposit} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{freeze && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={() => dispatch(setFreezeModal(null))} broker>
							<Freeze {...freeze} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{optionSettlement && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={() => dispatch(setOptionSettlementModal(null))} broker>
							<OptionSettlement {...optionSettlement} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{manageDashboardLayout && (
					<ModalSuspense>
						<ManageDashboardLayout {...manageDashboardLayout} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{addSaturnTemplate && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={() => dispatch(setAddSaturnTemplateModal(null))}>
							<AddSaturnTemplate {...addSaturnTemplate} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{addNewOptionWatchlist && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={() => dispatch(setAddNewOptionWatchlistModal(null))}>
							<AddNewOptionWatchlist {...addNewOptionWatchlist} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{manageOptionWatchlistList && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={() => dispatch(setManageOptionWatchlistListModal(null))}>
							<ManageOptionWatchlistList {...manageOptionWatchlistList} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{buySell && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={() => dispatch(setBuySellModal(null))} broker>
							<BuySellModal {...buySell} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{addSymbolToWatchlist && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={() => dispatch(setAddSymbolToWatchlistModal(null))}>
							<AddSymbolToWatchlist {...addSymbolToWatchlist} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{choiceCollateral && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={() => dispatch(setChoiceCollateralModal(null))}>
							<ChoiceCollateral {...choiceCollateral} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{orderDetails && (
					<ModalSuspense>
						<OrderDetails {...orderDetails} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{moveSymbolToWatchlist && (
					<ModalSuspense>
						<AuthorizeMiddleware callback={() => dispatch(setMoveSymbolToWatchlistModal(null))}>
							<MoveSymbolToWatchlist {...moveSymbolToWatchlist} />
						</AuthorizeMiddleware>
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
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

			<ModalAnimatePresence>
				{transactionsFilters && (
					<ModalSuspense>
						<TransactionsFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{instantDepositReportsFilters && (
					<ModalSuspense>
						<InstantDepositReportsFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{depositWithReceiptReportsFilters && (
					<ModalSuspense>
						<DepositWithReceiptFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{withdrawalCashReportsFilters && (
					<ModalSuspense>
						<WithdrawalCashReportsFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{changeBrokerReportsFilters && (
					<ModalSuspense>
						<ChangeBrokerReportsFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{freezeUnfreezeReportsFilters && (
					<ModalSuspense>
						<FreezeUnFreezeReportsModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{cashSettlementReportsFilters && (
					<ModalSuspense>
						<CashSettlementReportsFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{physicalSettlementReportsFilters && (
					<ModalSuspense>
						<PhysicalSettlementReportsFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{ordersReportsFilters && (
					<ModalSuspense>
						<OrdersReportsFiltersModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{createStrategy && (
					<ModalSuspense>
						<CreateStrategyModal {...createStrategy} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{tradesReportsFilters && (
					<ModalSuspense>
						<TradesReportsFiltersModal {...tradesReportsFilters} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{coveredCallFilters && (
					<ModalSuspense>
						<CoveredCallFilters {...coveredCallFilters} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{manageColumns && (
					<ModalSuspense>
						<ManageColumnsModal {...manageColumns} />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{marketState && (
					<ModalSuspense>
						<MarketStateModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{marketView && (
					<ModalSuspense>
						<MarketViewModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{best && (
					<ModalSuspense>
						<BestModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{userProgressBar && (
					<ModalSuspense>
						<UserInprogressBarModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{compareTransactionValue && (
					<ModalSuspense>
						<CompareTransactionValueModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{optionContract && (
					<ModalSuspense>
						<OptionContractModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{optionTradeValue && (
					<ModalSuspense>
						<OptionTradeValueModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{optionMarketProcess && (
					<ModalSuspense>
						<OptionMarketProcessModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{individualAndLegal && (
					<ModalSuspense>
						<IndividualAndLegalModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{priceChangeWatchlist && (
					<ModalSuspense>
						<PriceChangeWatchlistModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{openPositionProcess && (
					<ModalSuspense>
						<OpenPositionProcessModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{meetings && (
					<ModalSuspense>
						<MeetingsModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{newAndOld && (
					<ModalSuspense>
						<NewAndOldModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{topBaseAssets && (
					<ModalSuspense>
						<TopBaseAssetsModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{recentActivities && (
					<ModalSuspense>
						<RecentActivitiesModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>

			<ModalAnimatePresence>
				{dueDates && (
					<ModalSuspense>
						<DueDatesModal />
					</ModalSuspense>
				)}
			</ModalAnimatePresence>
		</Fragment>
	);
};

const ModalSuspense = forwardRef<HTMLDivElement, { children: ReactNode }>(({ children }, ref) => (
	<Suspense fallback={<ModalLoading ref={ref} />}>{children ? cloneElement(children, { ref }) : null}</Suspense>
));

const ModalAnimatePresence = ({ children }: { children: ReactNode }) => (
	<ErrorBoundary>
		<AnimatePresence initial={{ animation: 'fadeIn' }} exit={{ animation: 'fadeOut' }}>
			{children}
		</AnimatePresence>
	</ErrorBoundary>
);

export default Modals;
