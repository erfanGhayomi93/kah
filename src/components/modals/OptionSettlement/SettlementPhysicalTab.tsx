import { usePhysicalSettlementReportsQuery } from '@/api/queries/reportsQueries';
import { HandWriteSVG, InfoCircleSVG } from '@/components/icons';
import { dateFormatter } from '@/utils/helpers';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { type FC } from 'react';

interface SettlementPhysicalTabProps {
	onCloseModal: () => void;
	clickItemSettlement: (item: Reports.TCashOrPhysicalSettlement) => void;
}

export const SettlementPhysicalTab: FC<SettlementPhysicalTabProps> = ({ onCloseModal, clickItemSettlement }) => {
	const t = useTranslations();

	const { data } = usePhysicalSettlementReportsQuery({
		queryKey: ['physicalSettlementReports', { side: 'Buy' }],
	});

	return (
		<div className='mb-40 h-full flex-column'>
			<div className='my-24 mt-16 flex items-center gap-4'>
				<InfoCircleSVG className='text-info' width='2rem' height='2rem' />
				<span className='text-tiny tracking-normal text-info'>
					{t('optionSettlementModal.notice_attention')}
				</span>
			</div>

			<div className='mb-36 flex flex-1 flex-col gap-y-16 overflow-y-auto'>
				{data?.result.map((item, ind) => (
					<div
						key={ind}
						className='flex cursor-pointer gap-x-16 rounded p-16 shadow'
						onClick={() => clickItemSettlement({ ...item, from: 'physical' })}
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
									<span className='text-gray-900'>{t('home.tab_option_position')}</span>
								</div>
							</div>

							<div>
								<div>
									<span className='pl-4 text-gray-900'>
										{t('optionSettlementModal.settlement_date')}:
									</span>
									<span className='text-gray-1000'>
										{dateFormatter(item.cashSettlementDate, 'date')}
									</span>
								</div>
								<div className='mt-16'>
									<span className='pl-4 text-gray-900'>
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
							<HandWriteSVG className='text-primary-300' />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
