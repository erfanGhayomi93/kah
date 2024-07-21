import BaseSymbolForm from './Forms/BaseSymbolForm';
import FreezeForm from './Forms/FreezeForm';
import OptionForm from './Forms/OptionForm';

interface StepFormProps extends Pick<CreateStrategy.CoveredCallInput, 'budget' | 'quantity'> {
	step: CreateStrategy.TCoveredCallSteps;
	pending: boolean;
	asset: number;
	contractSize: number;
	optionQUantity: number;
	baseBestLimitPrice: number;
	optionBestLimitPrice: number;
	useFreeStock: boolean;
	nextStep: () => void;
	setFieldsValue: (values: Partial<CreateStrategy.CoveredCallInput>) => void;
	setFieldValue: <K extends keyof CreateStrategy.CoveredCallInput>(
		name: K,
		value: CreateStrategy.CoveredCallInput[K],
	) => void;
}

const StepForm = ({
	asset,
	baseBestLimitPrice,
	optionBestLimitPrice,
	optionQUantity,
	step,
	pending,
	contractSize,
	budget,
	quantity,
	useFreeStock,
	setFieldValue,
	setFieldsValue,
	nextStep,
}: StepFormProps) => {
	if (step === 'base') {
		return (
			<BaseSymbolForm
				asset={asset}
				baseBestLimitPrice={baseBestLimitPrice}
				optionBestLimitPrice={optionBestLimitPrice}
				budget={budget}
				quantity={quantity}
				useFreeStock={useFreeStock}
				contractSize={contractSize}
				setFieldValue={setFieldValue}
				setFieldsValue={setFieldsValue}
				nextStep={nextStep}
				pending={pending}
			/>
		);
	}

	if (step === 'freeze') return <FreezeForm budget={budget} nextStep={nextStep} />;

	if (step === 'option')
		return <OptionForm quantity={optionQUantity} contractSize={contractSize} budget={budget} nextStep={nextStep} />;

	return null;
};

export default StepForm;
