import { type NStrategyFilter } from '@/features/slices/types/modalSlice.interfaces';
import clsx from 'clsx';

type TValue = Array<string | null>;

interface ArrayStringProps extends NStrategyFilter.IArrayString {
	value: TValue;
	onChange: (v: TValue) => void;
}

const ArrayString = ({ value, data, initialValue, onChange }: ArrayStringProps) => {
	const isExists = (v: string) => {
		return value.includes(v);
	};

	const onClick = (v: string, exists: boolean) => {
		onChange(exists ? value.filter((item) => item !== v) : [...value, v]);
	};

	return data.map((item) => {
		const exists = isExists(item.value);

		return (
			<button
				onClick={() => onClick(item.value, exists)}
				key={item.value}
				type='button'
				className={clsx(
					'flex-1 gap-8 rounded !border font-medium',
					!item?.className
						? exists
							? 'btn-primary'
							: 'btn-primary-outline'
						: exists
							? item.className.enable
							: item.className.disabled,
				)}
			>
				{item?.icon}
				{item.title}
			</button>
		);
	});
};

export default ArrayString;
