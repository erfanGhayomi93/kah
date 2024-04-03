import Loading from '@/components/common/Loading';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import Panel from '../Panel';

const Container = dynamic(() => import('./Container'), {
	ssr: false,
	loading: () => <Loading />,
});

interface SymbolInfoPanelProps {
	symbolISIN: string;
}

const SymbolInfoPanel = forwardRef<HTMLDivElement, SymbolInfoPanelProps>(({ symbolISIN }, ref) => {
	const dispatch = useAppDispatch();

	const onClose = () => {
		dispatch(setSymbolInfoPanel(null));
	};

	return (
		<Panel
			ref={ref}
			onClose={onClose}
			render={() => <Container symbolISIN={symbolISIN} close={onClose} />}
			width='400px'
			classes={{
				wrapper: '!bg-gray-300',
			}}
		/>
	);
});

export default SymbolInfoPanel;
