'use client';

import { useAppSelector } from '@/features/hooks';
import dynamic from 'next/dynamic';
import { Fragment } from 'react';
import AnimatePresence from '../common/animation/AnimatePresence';
import ManageWatchlistColumnsPanel from './ManageWatchlistColumnsPanel';
import Loading from './PanelLoading';

const SymbolInfoPanel = dynamic(() => import('./SymbolInfoPanel'), {
	ssr: false,
	loading: () => <Loading />,
});

const SavedTemplatesPanel = dynamic(() => import('./SavedTemplatesPanel'), {
	ssr: false,
	loading: () => <Loading />,
});

const Panels = () => {
	const { symbolInfoPanel, savedTemplates, manageWatchlistColumns } = useAppSelector((state) => state.panel);

	return (
		<Fragment>
			<AnimatePresence duration={600} isEnable={Boolean(symbolInfoPanel)}>
				{() => <SymbolInfoPanel />}
			</AnimatePresence>

			<AnimatePresence duration={600} isEnable={manageWatchlistColumns}>
				{() => <ManageWatchlistColumnsPanel />}
			</AnimatePresence>

			<AnimatePresence duration={600} isEnable={savedTemplates}>
				{() => <SavedTemplatesPanel />}
			</AnimatePresence>
		</Fragment>
	);
};

export default Panels;
