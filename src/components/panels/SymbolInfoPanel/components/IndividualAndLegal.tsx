import { divide, numFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Progressbar from '../common/Progressbar';
import Section, { type ITabIem } from '../common/Section';

interface IndividualAndLegalProps {
	symbolData: Symbol.Info;
}

const IndividualAndLegal = ({ symbolData }: IndividualAndLegalProps) => {
	const { legalBuyVolume, legalSellVolume, individualBuyVolume, individualSellVolume } = symbolData;

	const t = useTranslations();

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'individual_and_legal',
				title: t('symbol_info_panel.individual_and_legal'),
			},
		],
		[],
	);

	const individualLegalSum = legalBuyVolume + legalSellVolume + individualBuyVolume + individualSellVolume;
	const buyerPercent = Math.min(
		Number((divide(legalBuyVolume + individualBuyVolume, individualLegalSum) * 100).toFixed(2)),
		100,
	);
	const sellerPercent = Math.min(
		Number((divide(legalSellVolume + individualSellVolume, individualLegalSum) * 100).toFixed(2)),
		100,
	);

	const isNoData = buyerPercent - sellerPercent === 0;

	return (
		<Section name='individual_and_legal' defaultActiveTab='individual_and_legal' tabs={tabs}>
			<div className='gap-8 px-8 py-12 flex-column'>
				<div className='gap-4 pb-40 flex-column'>
					<div className='flex-justify-between'>
						<span className='text-tiny text-success-100'>
							{t('symbol_info_panel.buyer')} {buyerPercent}%
						</span>
						<span className='text-tiny text-error-100'>
							{t('symbol_info_panel.seller')} {sellerPercent}%
						</span>
					</div>

					<div className='relative flex-justify-between'>
						<div style={{ width: `${buyerPercent}%` }} className='h-4 rounded-r bg-success-100' />
						<div
							style={{
								left: `calc(${isNoData ? 50 : sellerPercent}% - 2px)`,
								transform: 'skew(40deg, 0deg)',
								width: '6px',
							}}
							className='absolute h-4 bg-white'
						/>
						<div style={{ width: `${sellerPercent}%` }} className='h-4 rounded-l bg-error-100' />
					</div>
				</div>

				<div className='gap-24 flex-column'>
					<Progressbar
						buyVolume={individualBuyVolume}
						buyCount={0}
						sellVolume={individualSellVolume}
						sellCount={0}
						title={t('symbol_info_panel.individual')}
					/>
					<Progressbar
						buyVolume={legalBuyVolume}
						buyCount={0}
						sellVolume={legalSellVolume}
						sellCount={0}
						title={t('symbol_info_panel.legal')}
					/>
				</div>

				<div className='text-tiny flex-justify-between'>
					<span className='text-gray-900'>{t('symbol_info_panel.individual_cash_inflow')}</span>
					<span className='text-gray-700'>{numFormatter(individualBuyVolume + individualSellVolume)}</span>
				</div>
			</div>
		</Section>
	);
};

export default IndividualAndLegal;
