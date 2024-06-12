import { numFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import Progressbar from './Progressbar';

interface IndividualAndLegalProps {
	symbol: Symbol.Info;
}

const IndividualAndLegal = ({
	symbol: { legalBuyVolume, legalSellVolume, individualSellVolume, individualBuyVolume, closingPrice },
}: IndividualAndLegalProps) => {
	const t = useTranslations('saturn_page');

	const inflowAndOutflow = (legalBuyVolume - legalSellVolume) * closingPrice;

	return (
		<div className='flex w-full'>
			<div className='flex-1 gap-24 border-l border-gray-500 pl-16 flex-column'>
				<Progressbar
					buyVolume={individualBuyVolume}
					buyCount={0}
					sellVolume={individualSellVolume}
					sellCount={0}
					title={t('individual')}
					totalVolume={legalBuyVolume + individualBuyVolume}
				/>

				<Progressbar
					buyVolume={legalBuyVolume}
					buyCount={0}
					sellVolume={legalSellVolume}
					sellCount={0}
					title={t('legal')}
					totalVolume={legalSellVolume + individualSellVolume}
				/>
			</div>

			<div className='flex-1 justify-between flex-column'>
				<div className='pr-16 text-tiny flex-justify-between'>
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
