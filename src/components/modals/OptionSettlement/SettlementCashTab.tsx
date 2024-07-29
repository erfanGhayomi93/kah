import { useCashSettlementReportsQuery } from '@/api/queries/reportsQueries';
import NoData from '@/components/common/NoData';
import { HandWriteSVG } from '@/components/icons';
import { dateFormatter } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
// import { useRouter } from 'next/router';
import { type FC } from 'react';

interface SettlementCashTabProps {
	clickItemSettlement: (item: Reports.TCashOrPhysicalSettlement) => void;
}

export const SettlementCashTab: FC<SettlementCashTabProps> = ({ clickItemSettlement }) => {
	const t = useTranslations();

	const { data } = useCashSettlementReportsQuery({
		queryKey: ['cashSettlementReports', {}],
	});

	return (
		<>
			{data?.result.length === 0 && <NoData />}

			<div className='my-24 flex flex-col gap-y-16 overflow-y-auto'>
				{data?.result.map((item, ind) => (
					<div
						key={ind}
						className='flex cursor-pointer gap-x-16 rounded p-16 shadow'
						onClick={() => clickItemSettlement({ ...item, from: 'cash' })}
					>
						<div className='flex flex-1 gap-x-24'>
							<div>
								<div>
									<span
										className={clsx({
											'text-success-100': item.side === 'Buy',
											'text-error-100': item.side === 'Sell',
										})}
									>
										{t('side.' + item.side?.toLowerCase())}
									</span>
									<span className='pr-4 font-medium'>{item.symbolTitle}</span>
								</div>
								<div className='mt-16'>
									<span className='pl-4 font-medium'>{item.openPositionCount}</span>
									<span className='text-gray-700'>{t('home.tab_option_position')}</span>
								</div>
							</div>

							<div>
								<div>
									<span className='text-gray-700 pl-4'>
										{t('optionSettlementModal.settlement_date')}:
									</span>
									<span className='text-gray-800'>
										{dateFormatter(item.cashSettlementDate, 'date')}
									</span>
								</div>
								<div className='mt-16'>
									<span className='text-gray-700 pl-4'>
										{t('optionSettlementModal.status_contract')}:
									</span>
									<span
										className={clsx({
											'text-success-100': item.pandLStatus === 'Profit',
											'text-error-100': item.pandLStatus === 'Loss',
										})}
									>
										{t('cash_settlement_reports_page.type_contract_status_' + item.pandLStatus)}
									</span>
								</div>
							</div>
						</div>

						<div>
							<HandWriteSVG className='text-primary-100' />
						</div>
					</div>
				))}
			</div>
		</>
	);
};
