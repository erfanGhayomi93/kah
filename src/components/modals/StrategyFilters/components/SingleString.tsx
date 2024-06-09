import { type NStrategyFilter } from '@/features/slices/types/modalSlice.interfaces';

type TValue = string | null;

interface SingleStringProps extends NStrategyFilter.ISingleString {
	value: TValue;
	onChange: (v: TValue) => void;
}

const SingleString = (props: SingleStringProps) => {
	return <div />;
};

export default SingleString;
