import { useMemo } from 'react';
import StepForm from './StepForm';
import Steps from './Steps';

interface CreateStrategyProps {
	inputs: CreateStrategy.Input[];
	setInputs: React.Dispatch<React.SetStateAction<CreateStrategy.Input[]>>;
}

const CreateStrategy = ({ inputs, setInputs }: CreateStrategyProps) => {
	const nextStep = () => {
		//
	};

	const setProperties = (values: Partial<CreateStrategy.Input>) => {
		setInputs((prev) => ({
			...prev,
			...values,
		}));
	};

	const todo = useMemo(() => inputs.find((item) => item.status === 'TODO')!, [inputs]);

	return (
		<div className='flex gap-24'>
			<Steps steps={inputs} />
			<StepForm step={todo} setProperties={setProperties} nextStep={nextStep} />
		</div>
	);
};

export default CreateStrategy;
