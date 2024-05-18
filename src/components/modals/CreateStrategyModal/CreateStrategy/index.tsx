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

	const todo = useMemo(() => inputs.find((item) => item.status === 'TODO')!, [inputs]);

	return (
		<div className='flex gap-24'>
			<Steps steps={inputs} />
			<StepForm step={todo} nextStep={nextStep} />
		</div>
	);
};

export default CreateStrategy;
