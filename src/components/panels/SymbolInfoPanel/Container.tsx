import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import Loading from '@/components/common/Loading';
import { SettingSliderSVG, XSVG } from '@/components/icons';
import Chart from './components/Chart';
import CoGroupSymbols from './components/CoGroupSymbols';
import Contracts from './components/Contracts';
import IndividualAndLegal from './components/IndividualAndLegal';
import MarketDepth from './components/MarketDepth';
import OpenPositions from './components/OpenPositions';
import OptionBaseSymbolInformation from './components/OptionBaseSymbolInformation';
import OptionDetails from './components/OptionDetails';
import Quotes from './components/Quotes';
import SupervisorMessages from './components/SupervisorMessages';
import SymbolDetail from './components/SymbolDetail';
import SymbolInformation from './components/SymbolInformation';

interface ContainerProps {
	symbolISIN: string;
	close: () => void;
}

const Container = ({ symbolISIN, close }: ContainerProps) => {
	const { data: symbolData, isFetching } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', symbolISIN],
	});

	const openFeatureToggler = () => {
		//
	};

	const isOption = Boolean(symbolData?.isOption);

	return (
		<div className='h-full px-16 flex-column'>
			<div style={{ flex: '0 0 5.6rem' }} className='flex-justify-between'>
				<button type='button' onClick={close}>
					<XSVG width='2rem' className='icon-hover' height='2rem' />
				</button>

				<button type='button' className='icon-hover' onClick={openFeatureToggler}>
					<SettingSliderSVG width='2.4rem' height='2.4rem' />
				</button>
			</div>

			<div className='relative flex-1 gap-16 flex-column'>
				{symbolData && (
					<>
						<SymbolInformation symbolData={symbolData} />

						{isOption ? (
							<>
								<OptionBaseSymbolInformation />
								<OptionDetails />
								<MarketDepth />
							</>
						) : (
							<>
								<SymbolDetail />
								<Contracts />
								<OpenPositions />
							</>
						)}

						<Quotes />
						<IndividualAndLegal />

						{!isOption && (
							<>
								<Chart />
								<CoGroupSymbols />
								<SupervisorMessages />
							</>
						)}
					</>
				)}

				{isFetching && (
					<div
						style={{
							left: '1.6rem',
							height: 'calc(100% - 1.6rem)',
							bottom: '1.6rem',
							width: 'calc(100% - 3.2rem)',
							backdropFilter: 'blur(2px)',
						}}
						className='absolute top-0 rounded'
					>
						<Loading />
					</div>
				)}
			</div>
		</div>
	);
};

export default Container;
