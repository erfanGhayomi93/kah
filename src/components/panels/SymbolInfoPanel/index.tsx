import Loading from '@/components/common/Loading';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getSymbolInfoPanel, setSymbolInfoPanel } from '@/features/slices/panelSlice';
import dynamic from 'next/dynamic';
import PanelLoading from '../PanelLoading';

const Panel = dynamic(() => import('../Panel'), {
	ssr: false,
	loading: () => <PanelLoading />,
});

const Container = dynamic(() => import('./Container'), {
	ssr: false,
	loading: () => <Loading />,
});

const SymbolInfoPanel = () => {
	const symbolInfoPanel = useAppSelector(getSymbolInfoPanel);

	const dispatch = useAppDispatch();

	const onClose = () => {
		dispatch(setSymbolInfoPanel(null));
	};

	return (
		<Panel
			isEnable={Boolean(symbolInfoPanel)}
			onClose={onClose}
			render={() => <Container symbolISIN={symbolInfoPanel!} close={onClose} />}
			width='39.2rem'
		/>
	);
};

export default SymbolInfoPanel;
