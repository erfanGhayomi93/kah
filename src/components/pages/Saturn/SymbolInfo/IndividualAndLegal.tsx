import InflowAndOutflow from '@/components/common/Symbol/IndividualAndLegalProgressbar/InflowAndOutflow';
import Progressbar from '@/components/common/Symbol/IndividualAndLegalProgressbar/Progressbar';
import QueueValueProgressbar from '@/components/common/Symbol/IndividualAndLegalProgressbar/QueueValueProgressbar';
import { useTranslations } from 'next-intl';

interface IndividualAndLegalProps {
	symbol: Symbol.Info;
}

const IndividualAndLegal = ({
	symbol: {
		legalBuyVolume,
		legalSellVolume,
		individualSellVolume,
		individualBuyVolume,
		numberOfILegalsBuyers,
		numberOfIndividualsBuyers,
		numberOfIndividualsSellers,
		numberOfLegalsSellers,
		supplyValueSum,
		demandValueSum,
		closingPrice,
	},
}: IndividualAndLegalProps) => {
	const t = useTranslations('saturn_page');

	const inflowAndOutflow = (legalBuyVolume - legalSellVolume) * closingPrice;

	return (
		<div className='flex w-full'>
			<div className='flex-1 gap-24 border-l border-gray-200 pl-8 flex-column'>
				<Progressbar
					buyVolume={individualBuyVolume}
					buyCount={numberOfIndividualsBuyers}
					sellVolume={individualSellVolume}
					sellCount={numberOfIndividualsSellers}
					title={t('individual')}
					totalVolume={legalBuyVolume + individualBuyVolume}
				/>

				<Progressbar
					buyVolume={legalBuyVolume}
					buyCount={numberOfILegalsBuyers}
					sellVolume={legalSellVolume}
					sellCount={numberOfLegalsSellers}
					title={t('legal')}
					totalVolume={legalSellVolume + individualSellVolume}
				/>
			</div>

			<div className='flex-1 justify-between gap-24 pr-8 flex-column'>
				<QueueValueProgressbar
					buyQueueValue={supplyValueSum}
					sellQueueValue={demandValueSum}
					sum={supplyValueSum + demandValueSum}
				/>

				<InflowAndOutflow value={inflowAndOutflow} />
			</div>
		</div>
	);
};

export default IndividualAndLegal;
