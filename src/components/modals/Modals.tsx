'use client';

import { useAppSelector } from '@/features/hooks';
import dynamic from 'next/dynamic';
import { Fragment } from 'react';
import ChoiceCollateral from './ChoiceCollateral';
import Confirm from './Confirm';

const AddNewOptionWatchlist = dynamic(() => import('./AddNewOptionWatchlist'), {
	ssr: false,
});

const AddSaturnTemplate = dynamic(() => import('./AddSaturnTemplate'), {
	ssr: false,
});

const AddSymbolToWatchlist = dynamic(() => import('./AddSymbolToWatchlist'), {
	ssr: false,
});

const BlackScholes = dynamic(() => import('./BlackScholes'), {
	ssr: false,
	loading: () => <h1>Loading</h1>,
});

const BuySellModal = dynamic(() => import('./BuySellModal'), {
	ssr: false,
});

const ChoiceBroker = dynamic(() => import('./ChoiceBroker'), {
	ssr: false,
});

const ForgetPasswordModal = dynamic(() => import('./ForgetPasswordModal'), {
	ssr: false,
});

const LoginModal = dynamic(() => import('./LoginModal'), {
	ssr: false,
});

const LogoutModal = dynamic(() => import('./LogoutModal'), {
	ssr: false,
});

const ManageOptionWatchlistList = dynamic(() => import('./ManageOptionWatchlistList'), {
	ssr: false,
});

const OptionWatchlistFiltersModal = dynamic(() => import('./OptionWatchlistFiltersModal'), {
	ssr: false,
});

const SymbolContracts = dynamic(() => import('./SymbolContracts'), {
	ssr: false,
});

const OrderDetails = dynamic(() => import('./OrderDetails'), {
	ssr: false,
});

const MoveSymbolToWatchlist = dynamic(() => import('./MoveSymbolToWatchlist'), {
	ssr: false,
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
