import { type NStrategyFilter } from '@/features/slices/types/modalSlice.interfaces';

type TValue = [Date | null, Date | null];

interface RangeDateProps extends NStrategyFilter.IRangeDate {
	value: TValue;
	onChange: (v: TValue) => void;
}

const RangeDate = (props: RangeDateProps) => {
	return <div />;
};

export default RangeDate;
