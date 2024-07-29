import { numFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import Progressbar from './Progressbar';
import QueueValue from './QueueValue';

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
		buyQueueValue,
		sellQueueValue,
		closingPrice,
	},
}: IndividualAndLegalProps) => {
	const t = useTranslations('saturn_page');

	const inflowAndOutflow = (legalBuyVolume - legalSellVolume) * closingPrice;

	return (
		<div className='flex w-full'>
			<div className='border-gray-200 flex-1 gap-24 border-l pl-8 flex-column'>
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
				<QueueValue
					buyQueueValue={buyQueueValue}
					sellQueueValue={sellQueueValue}
					sum={buyQueueValue + sellQueueValue}
				/>

				<div className='h-48 text-tiny flex-justify-between'>
					<span className={inflowAndOutflow < 0 ? 'text-success-100' : 'text-error-100'}>
						{t(inflowAndOutflow < 0 ? 'liquid_inflow' : 'liquid_outflow')}
					</span>
					<span className={inflowAndOutflow < 0 ? 'text-success-100' : 'text-error-100'}>
						{numFormatter(Math.abs(inflowAndOutflow))}
					</span>
				</div>
			</div>
		</div>
	);
};

export default IndividualAndLegal;
