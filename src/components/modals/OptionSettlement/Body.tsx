import { type FC } from 'react';
import { type TModePage } from '.';
import { PrimarySettlementTab } from './PrimarySettlementTab';
import { SecondarySettlementDetail } from './SecondarySettlementDetail';
import TertiarySettlementRequest from './TertiarySettlementRequest';

interface BodyOptionSettlementProps {
	onCloseModal: () => void;
	modePage: TModePage;
	clickItemSettlement: (item?: Reports.TCashOrPhysicalSettlement) => void;
	dataSecondaryDetails?: Reports.TCashOrPhysicalSettlement
}

const Body: FC<BodyOptionSettlementProps> = ({ onCloseModal, modePage, clickItemSettlement, dataSecondaryDetails }) => {

	return (
		<div className='h-full'>
			{
				modePage === 'primary' && <PrimarySettlementTab
					onCloseModal={onCloseModal}
					clickItemSettlement={clickItemSettlement}
				/>
			}

			{
				modePage === 'secondary' && <SecondarySettlementDetail
					dataSecondaryDetails={dataSecondaryDetails}
					clickItemSettlement={clickItemSettlement}
				/>
			}

			{
				modePage === 'tertiary' && <TertiarySettlementRequest
					dataSecondaryDetails={dataSecondaryDetails}
					onCloseModal={onCloseModal}
				/>
			}
		</div>
	);

};



export default Body;
