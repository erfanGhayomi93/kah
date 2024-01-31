import PriceSlider from '@/components/common/PriceSlider';

interface ContractSizeInputProps {
	value: IOptionWatchlistFilters['contractSize'];
	onChange: (value: IOptionWatchlistFilters['contractSize']) => void;
}

const ContractSizeInput = ({ value: [fromValue, toValue], onChange }: ContractSizeInputProps) => {
	return <PriceSlider min={1} max={365} showAvg={false} onChange={console.log} value={[-0.5, 0.5]} />;
};

export default ContractSizeInput;
