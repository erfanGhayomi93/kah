import Loading from '@/components/common/Loading';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getSymbolInfoPanel, setSymbolInfoPanel } from '@/features/slices/panelSlice';
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import Panel from '../Panel';

const Container = dynamic(() => import('./Container'), {
	ssr: false,
	loading: () => <Loading />,
});

const SymbolInfoPanel = forwardRef<HTMLDivElement>((_, ref) => {
	const symbolInfoPanel = useAppSelector(getSymbolInfoPanel);

	const dispatch = useAppDispatch();

	const onClose = () => {
		dispatch(setSymbolInfoPanel(null));
	};

	return (
		<Panel
			ref={ref}
			onClose={onClose}
			render={() => <Container symbolISIN={symbolInfoPanel!} close={onClose} />}
			width='39.2rem'
		/>
	);
});

export default SymbolInfoPanel;
