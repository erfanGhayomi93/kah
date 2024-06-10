import BaseSymbolForm from './Forms/BaseSymbolForm';

interface StepFormProps {
	step: CreateStrategy.Step;
	pending: boolean;
	nextStep: () => void;
	onChange: <T extends keyof CreateStrategy.IBaseSymbol>(name: T, value: CreateStrategy.IBaseSymbol[T]) => void;
}

const StepForm = ({ step, pending, onChange, nextStep }: StepFormProps) => {
	if (step.type === 'base')
		return <BaseSymbolForm {...step} onChange={onChange} nextStep={nextStep} pending={pending} />;
	return null;
};

export default StepForm;
