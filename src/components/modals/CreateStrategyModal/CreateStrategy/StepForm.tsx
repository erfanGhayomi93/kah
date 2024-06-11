import BaseSymbolForm from './Forms/BaseSymbolForm';
import FreezeForm from './Forms/FreezeForm';
import OptionForm from './Forms/OptionForm';

interface StepFormProps extends Pick<CreateStrategy.CoveredCallInput, 'budget' | 'quantity'> {
	step: CreateStrategy.TCoveredCallSteps;
	pending: boolean;
	contractSize: number;
	inUseCapital: number;
	baseBestLimitPrice: number;
	optionBestLimitPrice: number;
	nextStep: () => void;
	setFieldsValue: (values: Partial<CreateStrategy.CoveredCallInput>) => void;
	setFieldValue: <K extends keyof CreateStrategy.CoveredCallInput>(
		name: K,
		value: CreateStrategy.CoveredCallInput[K],
	) => void;
}

const StepForm = ({
	baseBestLimitPrice,
	optionBestLimitPrice,
	step,
	pending,
	contractSize,
	inUseCapital,
	budget,
	quantity,
	setFieldValue,
	setFieldsValue,
	nextStep,
}: StepFormProps) => {
	if (step === 'base')
		return (
			<BaseSymbolForm
				baseBestLimitPrice={baseBestLimitPrice}
				optionBestLimitPrice={optionBestLimitPrice}
				budget={budget}
				quantity={quantity}
				useFreeStock={false}
				contractSize={contractSize}
				inUseCapital={inUseCapital}
				setFieldValue={setFieldValue}
				setFieldsValue={setFieldsValue}
				nextStep={nextStep}
				pending={pending}
			/>
		);

	if (step === 'freeze') return <FreezeForm budget={budget} nextStep={nextStep} />;

	if (step === 'option') return <OptionForm budget={budget} nextStep={nextStep} />;

	return null;
};

export default StepForm;
