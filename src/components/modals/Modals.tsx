'use client';

import { useAppSelector } from '@/features/hooks';
import dynamic from 'next/dynamic';
import { Fragment } from 'react';
import ChoiceCollateral from './ChoiceCollateral';
import Confirm from './Confirm';
import Loading from './Loading';

const AddNewOptionWatchlist = dynamic(() => import('./AddNewOptionWatchlist'), {
	ssr: false,
	loading: () => <Loading />,
});

const AddSaturnTemplate = dynamic(() => import('./AddSaturnTemplate'), {
	ssr: false,
	loading: () => <Loading />,
});

const AddSymbolToWatchlist = dynamic(() => import('./AddSymbolToWatchlist'), {
	ssr: false,
	loading: () => <Loading />,
});

const BlackScholes = dynamic(() => import('./BlackScholes'), {
	ssr: false,
	loading: () => <Loading />,
});

const BuySellModal = dynamic(() => import('./BuySellModal'), {
	ssr: false,
	loading: () => <Loading />,
});

const ChoiceBroker = dynamic(() => import('./ChoiceBroker'), {
	ssr: false,
	loading: () => <Loading />,
});

const ForgetPasswordModal = dynamic(() => import('./ForgetPasswordModal'), {
	ssr: false,
	loading: () => <Loading />,
});

const LoginModal = dynamic(() => import('./LoginModal'), {
	ssr: false,
	loading: () => <Loading />,
});

const LogoutModal = dynamic(() => import('./LogoutModal'), {
	ssr: false,
	loading: () => <Loading />,
});

const ManageOptionWatchlistList = dynamic(() => import('./ManageOptionWatchlistList'), {
	ssr: false,
	loading: () => <Loading />,
});

const OptionWatchlistFiltersModal = dynamic(() => import('./OptionWatchlistFiltersModal'), {
	ssr: false,
	loading: () => <Loading />,
});

const SymbolContracts = dynamic(() => import('./SymbolContracts'), {
	ssr: false,
	loading: () => <Loading />,
});

const OrderDetails = dynamic(() => import('./OrderDetails'), {
	ssr: false,
	loading: () => <Loading />,
});

const MoveSymbolToWatchlist = dynamic(() => import('./MoveSymbolToWatchlist'), {
	ssr: false,
	loading: () => <Loading />,
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
			{loginModal && <LoginModal {...loginModal} />}

			{logout && <LogoutModal {...logout} />}

			{blackScholes && <BlackScholes {...blackScholes} />}

			{optionFilters && <OptionWatchlistFiltersModal {...optionFilters} />}

			{symbolContracts && <SymbolContracts {...symbolContracts} />}

			{addSaturnTemplate !== null && <AddSaturnTemplate {...addSaturnTemplate} />}

			{addNewOptionWatchlist && <AddNewOptionWatchlist {...addNewOptionWatchlist} />}

			{manageOptionWatchlistList && <ManageOptionWatchlistList {...manageOptionWatchlistList} />}

			{buySell && <BuySellModal {...buySell} />}

			{addSymbolToWatchlist && <AddSymbolToWatchlist {...addSymbolToWatchlist} />}

			{choiceBroker && <ChoiceBroker {...choiceBroker} />}

			{choiceCollateral && <ChoiceCollateral {...choiceCollateral} />}

			{confirm && <Confirm {...confirm} />}

			{orderDetails && <OrderDetails {...orderDetails} />}

			{moveSymbolToWatchlist && <MoveSymbolToWatchlist {...moveSymbolToWatchlist} />}

			{forgetPassword && (
				<ForgetPasswordModal
					phoneNumber={
						forgetPassword && typeof forgetPassword === 'object' ? forgetPassword?.phoneNumber : undefined
					}
				/>
			)}
		</Fragment>
	);
};

export default Modals;
