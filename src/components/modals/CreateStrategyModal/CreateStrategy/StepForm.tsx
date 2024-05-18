import BaseSymbolForm from './Forms/BaseSymbolForm';

interface StepFormProps {
	step: CreateStrategy.Input;
	setProperties: (values: Partial<CreateStrategy.Input>) => void;
	nextStep: () => void;
}

const StepForm = ({ step, setProperties, nextStep }: StepFormProps) => {
	if (step.type === 'base') return <BaseSymbolForm setProperties={setProperties} nextStep={nextStep} {...step} />;
	return null;
};

export default StepForm;
