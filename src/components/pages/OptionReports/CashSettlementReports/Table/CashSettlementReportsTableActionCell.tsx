import Tooltip from '@/components/common/Tooltip';
import { HandWriteSVG, TrashSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ICashSettlementReportsTableActionCellProps {
	onDeleteRow: (data: Reports.ICashSettlementReports | undefined) => void;
	onRequest: (data: Reports.ICashSettlementReports | undefined) => void;
	data: Reports.ICashSettlementReports;
}

const CashSettlementReportsTableActionCell = ({
	onDeleteRow,
	data,
	onRequest,
}: ICashSettlementReportsTableActionCellProps) => {
	const t = useTranslations();

	const [confirmDelete, setConfirmDelete] = useState(false);

	const onDelete = () => {
		onDeleteRow(data);
		setConfirmDelete(false);
	};

	const isDisabled = !data?.enabled;

	const cashSettlementStatus = data?.status ?? undefined;

	const isDeleteDisabled =
		isDisabled || !(cashSettlementStatus === 'InSendQueue' || cashSettlementStatus === 'Registered');

	const isRequestDisabled = isDisabled || cashSettlementStatus !== 'Draft' || !data?.openPositionCount;

	return (
		<div className='gap-16 flex-justify-center'>
			{!confirmDelete && (
				<>
					<Tooltip content={t(isRequestDisabled ? 'tooltip.request_disabled' : 'tooltip.request')}>
						<span>
							<button
								disabled={isRequestDisabled}
								type='button'
								className='text-gray-700 disabled:text-gray-500'
								onClick={() => onRequest(data)}
							>
								<HandWriteSVG width='2rem' height='2rem' />
							</button>
						</span>
					</Tooltip>
					<Tooltip content={t(isDeleteDisabled ? 'delete_disabled' : 'tooltip.delete')}>
						<span>
							<button
								disabled={isDeleteDisabled}
								type='button'
								onClick={() => setConfirmDelete(true)}
								className='text-gray-700 disabled:text-gray-500'
							>
								<TrashSVG width='2rem' height='2rem' />
							</button>
						</span>
					</Tooltip>
				</>
			)}

			{confirmDelete && (
				<div className='gap-16 flex-justify-start'>
					<button className='text-gray-700' type='button' onClick={() => setConfirmDelete(false)}>
						{t('common.cancel')}
					</button>
					<button className='text-error-100' type='button' onClick={onDelete}>
						{t('common.delete')}
					</button>
				</div>
			)}
		</div>
	);
};

export default CashSettlementReportsTableActionCell;
