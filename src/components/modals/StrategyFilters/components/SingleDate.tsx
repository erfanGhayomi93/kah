import { type NStrategyFilter } from '@/features/slices/types/modalSlice.interfaces';

type TValue = Date | null;

interface SingleDateProps extends NStrategyFilter.ISingleDate {
	value: TValue;
	onChange: (v: TValue) => void;
}

const SingleDate = (props: SingleDateProps) => {
	return <div />;
};

export default SingleDate;
