interface EndDateInputProps {
	value: IOptionWatchlistFilters['endDate'];
	onChange: (value: IOptionWatchlistFilters['endDate']) => void;
}

const EndDateInput = ({ value, onChange }: EndDateInputProps) => (
	<ul className='flex-justify-end flex-1 gap-8 *:flex-1'>
		<li></li>
	</ul>
);

export default EndDateInput;
