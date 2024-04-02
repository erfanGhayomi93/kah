'use client';

import { useAppSelector } from '@/features/hooks';
import { cloneElement, forwardRef, Fragment, lazy, Suspense } from 'react';
import AnimatePresence from '../common/animation/AnimatePresence';
import ErrorBoundary from '../common/ErrorBoundary';
import PanelLoading from './PanelLoading';

const ManageWatchlistColumnsPanel = lazy(() => import('./ManageWatchlistColumnsPanel'));

const SymbolInfoPanel = lazy(() => import('./SymbolInfoPanel'));

const SavedTemplatesPanel = lazy(() => import('./SavedTemplatesPanel'));

const Panels = () => {
	const { symbolInfoPanel, savedTemplates, manageWatchlistColumns } = useAppSelector((state) => state.panel);

	return (
		<Fragment>
			<PanelAnimatePresence>
				{symbolInfoPanel !== null && (
					<PanelSuspense>
						<SymbolInfoPanel />
					</PanelSuspense>
				)}
			</PanelAnimatePresence>

			<PanelAnimatePresence>
				{manageWatchlistColumns && (
					<PanelSuspense>
						<ManageWatchlistColumnsPanel />
					</PanelSuspense>
				)}
			</PanelAnimatePresence>

			<PanelAnimatePresence>
				{savedTemplates && (
					<PanelSuspense>
						<SavedTemplatesPanel />
					</PanelSuspense>
				)}
			</PanelAnimatePresence>
		</Fragment>
	);
};

const PanelSuspense = forwardRef<HTMLDivElement, { children: ReactNode }>(({ children }, ref) => (
	<Suspense fallback={<PanelLoading />}>{children ? cloneElement(children, { ref }) : null}</Suspense>
));

const PanelAnimatePresence = ({ children }: { children: ReactNode }) => (
	<ErrorBoundary>
		<AnimatePresence
			initial={{ animation: 'slideInLeft', duration: 750 }}
			exit={{ animation: 'slideOutLeft', duration: 600 }}
		>
			{children}
		</AnimatePresence>
	</ErrorBoundary>
);

export default Panels;
