import { type Dispatch, type FC, type SetStateAction } from 'react';
import { type TModePage } from '.';
import { PrimarySettlementTab } from './PrimarySettlementTab';
import { SecondarySettlementDetail } from './SecondarySettlementDetail';
import TertiarySettlementRequest from './TertiarySettlementRequest';

interface BodyOptionSettlementProps {
	onCloseModal: () => void;
	modePage: TModePage;
	clickItemSettlement: (item?: Reports.TCashOrPhysicalSettlement) => void;
	dataSecondaryDetails?: Reports.TCashOrPhysicalSettlement;
	tabSelected: string;
	setTabSelected: Dispatch<SetStateAction<string>>;
}

const Body: FC<BodyOptionSettlementProps> = ({
	onCloseModal,
	modePage,
	clickItemSettlement,
	dataSecondaryDetails,
	tabSelected,
	setTabSelected,
}) => {
	if (modePage === 'primary') {
		return (
			<PrimarySettlementTab
				onCloseModal={onCloseModal}
				clickItemSettlement={clickItemSettlement}
				modePage={modePage}
				tabSelected={tabSelected}
				setTabSelected={setTabSelected}
			/>
		);
	}

	if (modePage === 'secondary') {
		return (
			<SecondarySettlementDetail
				dataSecondaryDetails={dataSecondaryDetails}
				clickItemSettlement={clickItemSettlement}
			/>
		);
	}

	if (modePage === 'tertiary') {
		return <TertiarySettlementRequest dataSecondaryDetails={dataSecondaryDetails} onCloseModal={onCloseModal} />;
	}

	return null;
};

export default Body;
