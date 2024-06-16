import { numFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Progressbar from '../common/Progressbar';
import Section, { type ITabIem } from '../common/Section';

/**
 * ? حجم خرید حقوقی - حجم فروش حقوقی
 * * + خروج پول حقیقی با رنگ قرمز
 * ! - ورود پول حقیقی با رنگ سبز
 */

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

	const inflowAndOutflow = (legalBuyVolume - legalSellVolume) * symbolData.closingPrice;

	return (
		<Section name='individual_and_legal' defaultActiveTab='individual_and_legal' tabs={tabs}>
			<div className='gap-24 px-8 py-16 flex-column'>
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

				<div className='text-tiny flex-justify-between'>
					<span className={inflowAndOutflow < 0 ? 'text-light-success-100' : 'text-light-error-100'}>
						{t(inflowAndOutflow < 0 ? 'liquid_inflow' : 'liquid_outflow')}
					</span>
					<span className={inflowAndOutflow < 0 ? 'text-light-success-100' : 'text-light-error-100'}>
						{numFormatter(Math.abs(inflowAndOutflow))}
					</span>
				</div>
			</div>
		</Section>
	);
};

export default IndividualAndLegal;
