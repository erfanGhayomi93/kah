import BaseSymbolForm from './Forms/BaseSymbolForm';

interface StepFormProps {
	step: CreateStrategy.Input;
	nextStep: () => void;
}

const StepForm = ({ step, nextStep }: StepFormProps) => {
	if (step.type === 'base') return <BaseSymbolForm nextStep={nextStep} {...step} />;
	return null;
};

export default StepForm;
