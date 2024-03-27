'use client';

import { useAppSelector } from '@/features/hooks';
import dynamic from 'next/dynamic';
import { Fragment } from 'react';
import AuthorizeMiddleware from '../common/Middlewares/AuthorizeMiddleware';
import AnimatePresence from '../common/animation/AnimatePresence';
import ChoiceCollateral from './ChoiceCollateral';
import Confirm from './Confirm';
import ModalLoading from './ModalLoading';

const AddNewOptionWatchlist = dynamic(() => import('./AddNewOptionWatchlist'), {
	ssr: false,
	loading: () => <ModalLoading />,
});

const AddSaturnTemplate = dynamic(() => import('./AddSaturnTemplate'), {
	ssr: false,
	loading: () => <ModalLoading />,
});

const AddSymbolToWatchlist = dynamic(() => import('./AddSymbolToWatchlist'), {
	ssr: false,
	loading: () => <ModalLoading />,
});

const BlackScholes = dynamic(() => import('./BlackScholes'), {
	ssr: false,
	loading: () => <ModalLoading />,
});

const BuySellModal = dynamic(() => import('./BuySellModal'), {
	ssr: false,
	loading: () => <ModalLoading />,
});

const ChoiceBroker = dynamic(() => import('./ChoiceBroker'), {
	ssr: false,
	loading: () => <ModalLoading />,
});

const ForgetPasswordModal = dynamic(() => import('./ForgetPasswordModal'), {
	ssr: false,
	loading: () => <ModalLoading />,
});

const LoginModal = dynamic(() => import('./LoginModal'), {
	ssr: false,
	loading: () => <ModalLoading />,
});

const LogoutModal = dynamic(() => import('./LogoutModal'), {
	ssr: false,
	loading: () => <ModalLoading />,
});

const ManageOptionWatchlistList = dynamic(() => import('./ManageOptionWatchlistList'), {
	ssr: false,
	loading: () => <ModalLoading />,
});

const OptionWatchlistFiltersModal = dynamic(() => import('./OptionWatchlistFiltersModal'), {
	ssr: false,
	loading: () => <ModalLoading />,
});

const SymbolContracts = dynamic(() => import('./SymbolContracts'), {
	ssr: false,
	loading: () => <ModalLoading />,
});

const OrderDetails = dynamic(() => import('./OrderDetails'), {
	ssr: false,
	loading: () => <ModalLoading />,
});

const MoveSymbolToWatchlist = dynamic(() => import('./MoveSymbolToWatchlist'), {
	ssr: false,
	loading: () => <ModalLoading />,
});

const Modals = () => {
	const {
		loginModal,
		logout,
		optionFilters,
		forgetPassword,
		symbolContracts,
		addSaturnTemplate,
		addNewOptionWatchlist,
		manageOptionWatchlistList,
		buySell,
		addSymbolToWatchlist,
		choiceBroker,
		confirm,
		choiceCollateral,
		blackScholes,
		moveSymbolToWatchlist,
		orderDetails,
	} = useAppSelector((state) => state.modal);

	return (
		<Fragment>
			<AnimatePresence isEnable={Boolean(loginModal)}>
				{(isEnable) => <LoginModal isEnable={isEnable} {...loginModal!} />}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(logout)}>
				{(isEnable) => <LogoutModal isEnable={isEnable} {...logout!} />}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(confirm)}>
				{(isEnable) => <Confirm isEnable={isEnable} {...confirm!} />}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(blackScholes)}>
				{(isEnable) => <BlackScholes isEnable={isEnable} {...blackScholes!} />}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(optionFilters)}>
				{(isEnable) => <OptionWatchlistFiltersModal isEnable={isEnable} {...optionFilters!} />}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(symbolContracts)}>
				{(isEnable) => <SymbolContracts isEnable={isEnable} {...symbolContracts!} />}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(choiceBroker)}>
				{(isEnable) => <ChoiceBroker isEnable={isEnable} {...choiceBroker!} />}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(addSaturnTemplate)}>
				{(isEnable) => (
					<AuthorizeMiddleware>
						<AddSaturnTemplate isEnable={isEnable} {...addSaturnTemplate!} />
					</AuthorizeMiddleware>
				)}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(addNewOptionWatchlist!)}>
				{(isEnable) => (
					<AuthorizeMiddleware>
						<AddNewOptionWatchlist isEnable={isEnable} {...addNewOptionWatchlist!} />
					</AuthorizeMiddleware>
				)}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(manageOptionWatchlistList)}>
				{(isEnable) => (
					<AuthorizeMiddleware>
						<ManageOptionWatchlistList isEnable={isEnable} {...manageOptionWatchlistList!} />
					</AuthorizeMiddleware>
				)}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(buySell)}>
				{(isEnable) => (
					<AuthorizeMiddleware broker>
						<BuySellModal isEnable={isEnable} {...buySell!} />
					</AuthorizeMiddleware>
				)}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(addSymbolToWatchlist)}>
				{(isEnable) => (
					<AuthorizeMiddleware>
						<AddSymbolToWatchlist isEnable={isEnable} {...addSymbolToWatchlist!} />
					</AuthorizeMiddleware>
				)}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(choiceCollateral)}>
				{(isEnable) => (
					<AuthorizeMiddleware>
						<ChoiceCollateral isEnable={isEnable} {...choiceCollateral!} />
					</AuthorizeMiddleware>
				)}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(orderDetails)}>
				{(isEnable) => (
					<AuthorizeMiddleware broker>
						<OrderDetails isEnable={isEnable} {...orderDetails!} />
					</AuthorizeMiddleware>
				)}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(moveSymbolToWatchlist)}>
				{(isEnable) => (
					<AuthorizeMiddleware>
						<MoveSymbolToWatchlist isEnable={isEnable} {...moveSymbolToWatchlist!} />
					</AuthorizeMiddleware>
				)}
			</AnimatePresence>

			<AnimatePresence isEnable={Boolean(forgetPassword)}>
				{(isEnable) => (
					<ForgetPasswordModal
						isEnable={isEnable}
						phoneNumber={
							forgetPassword && typeof forgetPassword === 'object'
								? forgetPassword?.phoneNumber
								: undefined
						}
					/>
				)}
			</AnimatePresence>
		</Fragment>
	);
};

export default Modals;
