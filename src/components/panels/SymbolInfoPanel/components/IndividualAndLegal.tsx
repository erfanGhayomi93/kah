import QueueValueProgressbar from '@/components/common/Symbol/IndividualAndLegalProgressbar/QueueValueProgressbar';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Progressbar from '../common/Progressbar';
import Section, { type ITabIem } from '../common/Section';

interface IndividualAndLegalProps {
	symbolData: Symbol.Info;
}

const IndividualAndLegal = ({ symbolData }: IndividualAndLegalProps) => {
	const {
		legalBuyVolume,
		legalSellVolume,
		individualBuyVolume,
		individualSellVolume,
		numberOfILegalsBuyers,
		numberOfIndividualsBuyers,
		numberOfIndividualsSellers,
		numberOfLegalsSellers,
		supplyValueSum,
		demandValueSum,
	} = symbolData;

	const t = useTranslations('symbol_info_panel');

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'individual_and_legal',
				title: t('individual_and_legal'),
			},
		],
		[],
	);

	const isOption = Boolean(symbolData?.isOption);

	return (
		<Section
			name={isOption ? 'option_individual_and_legal' : 'individual_and_legal'}
			defaultActiveTab='individual_and_legal'
			tabs={tabs}
		>
			<div className='gap-24 px-8 py-16 flex-column'>
				{!isOption && (
					<QueueValueProgressbar
						buyQueueValue={demandValueSum}
						sellQueueValue={supplyValueSum}
						sum={supplyValueSum + demandValueSum}
					/>
				)}

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
		</Section>
	);
};

export default IndividualAndLegal;
