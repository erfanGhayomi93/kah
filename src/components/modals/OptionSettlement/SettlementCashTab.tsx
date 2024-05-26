import { useCashSettlementReportsQuery } from '@/api/queries/reportsQueries';
import { HandWriteSVG } from '@/components/icons';
import { dateFormatter } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
// import { useRouter } from 'next/router';
import { type FC } from 'react';

interface SettlementCashTabProps {
	onCloseModal: () => void;
	clickItemSettlement: (item: Reports.TCashOrPhysicalSettlement) => void;
}

export const SettlementCashTab: FC<SettlementCashTabProps> = ({ onCloseModal, clickItemSettlement }) => {

	const t = useTranslations();

	const { data } = useCashSettlementReportsQuery({
		queryKey: ['cashSettlementReports', {}]
	});



	return (
		<div
			className='my-24 flex flex-col gap-y-16 overflow-y-auto'
		>
			{
				data?.result.map((item, ind) => (
					<div
						key={ind}
						className='shadow p-16 flex gap-x-16 rounded cursor-pointer'
						onClick={() => clickItemSettlement({ ...item, from: 'cash' })}
					>
						<div className='flex gap-x-24 flex-1'>
							<div>
								<div>
									<span className={clsx({
										'text-success-100': item.side === 'Buy',
										'text-error-100': item.side === 'Sell',
									})}>
										{t('side.' + item.side?.toLowerCase())}
									</span>
									<span className='font-medium pr-4'>{item.symbolTitle}</span>
								</div>
								<div className='mt-16'>
									<span className='pl-4 font-medium'>{item.openPositionCount}</span>
									<span className='text-gray-900'>{t('home.tab_option_position')}</span>
								</div>
							</div>

							<div>
								<div>
									<span className='text-gray-900 pl-4'>{t('optionSettlementModal.settlement_date')}:</span>
									<span className='text-gray-1000'>{dateFormatter(item.cashSettlementDate, 'date')}</span>
								</div>
								<div className='mt-16'>
									<span className='pl-4 text-gray-900'>{t('optionSettlementModal.status_contract')}:</span>
									<span
										className={clsx({
											'text-success-100': item.pandLStatus === 'Profit',
											'text-error-100': item.pandLStatus === 'Loss',
										})}>
										{t('cash_settlement_reports_page.type_contract_status_' + item.pandLStatus)}
									</span>
								</div>
							</div>
						</div>

						<div>
							<HandWriteSVG />
						</div>
					</div>
				))
			}

		</div>
	);
};
