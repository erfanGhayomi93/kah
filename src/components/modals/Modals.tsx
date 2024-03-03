'use client';

import { useAppSelector } from '@/features/hooks';
import dynamic from 'next/dynamic';
import { Fragment } from 'react';

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
});

const BuySellModal = dynamic(() => import('./BuySellModal'), {
	ssr: false,
});

const ChooseBroker = dynamic(() => import('./ChooseBroker'), {
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
		chooseBroker,
		blackScholes,
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

			{chooseBroker && <ChooseBroker {...chooseBroker} />}

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
