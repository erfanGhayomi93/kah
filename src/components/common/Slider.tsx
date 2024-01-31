interface SliderProps {
	value: number;
	min: number;
	max: number;
	onChange: (value: number) => void;
}

const Slider = (props: SliderProps) => {
	return <div>Slider</div>;
};

export default Slider;
