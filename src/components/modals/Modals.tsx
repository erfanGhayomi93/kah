'use client';

import { useAppSelector } from '@/features/hooks';
import { Fragment } from 'react';
import AddNewOptionWatchlist from './AddNewOptionWatchlist';
import AddSaturnTemplate from './AddSaturnTemplate';
import AddSymbolToWatchlist from './AddSymbolToWatchlist';
import BuySellModal from './BuySellModal';
import ChooseBroker from './ChooseBroker';
import ForgetPasswordModal from './ForgetPasswordModal';
import LoginModal from './LoginModal';
import LogoutModal from './Logout';
import ManageOptionWatchlistList from './ManageOptionWatchlistList';
import OptionWatchlistFiltersModal from './OptionWatchlistFiltersModal';
import SymbolContracts from './SymbolContracts';

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
	} = useAppSelector((state) => state.modal);

	return (
		<Fragment>
			{loginModal && <LoginModal {...loginModal} />}
			{logout && <LogoutModal {...logout} />}
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
