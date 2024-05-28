import AnimatePresence from '@/components/common/animation/AnimatePresence';
import { HandWriteSVG, RefreshSVG, TrashSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ICashSettlementReportsTableActionCellProps {
	onDeleteRow: (data: Reports.ICashSettlementReports | undefined) => void;
	onHistory: (data: Reports.ICashSettlementReports | undefined) => void;
	onRequest: (data: Reports.ICashSettlementReports | undefined) => void;
	data: Reports.ICashSettlementReports;
}

const CashSettlementReportsTableActionCell = ({
	onDeleteRow,
	data,
	onHistory,
	onRequest,
}: ICashSettlementReportsTableActionCellProps) => {
	const t = useTranslations();

	const [confirmDelete, setConfirmDelete] = useState(false);

	const isDisabled = !data?.enabled;

	const cashSettlementStatus = data?.status ?? undefined;

	return (
		<div className='gap-16 flex-justify-start'>
			{!confirmDelete && (
				<AnimatePresence initial={{ animation: 'FadeIn' }} exit={{ animation: 'FadeOut' }}>
					<>
						<button
							disabled={isDisabled || cashSettlementStatus !== 'Draft' || !data?.openPositionCount}
							type='button'
							className='text-gray-900 disabled:text-gray-700'
							onClick={() => onRequest(data)}
						>
							<HandWriteSVG width='2rem' height='2rem' />
						</button>
						<button
							onClick={() => onHistory(data)}
							type='button'
							className='text-gray-900 disabled:text-gray-700'
						>
							<RefreshSVG width='2rem' height='2rem' />
						</button>

						<button
							disabled={
								isDisabled ||
								!(cashSettlementStatus === 'InSendQueue' || cashSettlementStatus === 'Registered')
							}
							type='button'
							onClick={() => setConfirmDelete(true)}
							className='text-gray-900 disabled:text-gray-700'
						>
							<TrashSVG width='2rem' height='2rem' />
						</button>
					</>
				</AnimatePresence>
			)}

			{confirmDelete && (
				<AnimatePresence initial={{ animation: 'FadeIn' }} exit={{ animation: 'FadeOut' }}>
					<div className='gap-16 flex-justify-start'>
						<button className='text-gray-900' type='button' onClick={() => setConfirmDelete(false)}>
							{t('common.cancel')}
						</button>
						<button className='text-error-100' type='button' onClick={() => onDeleteRow(data)}>
							{t('common.delete')}
						</button>
					</div>
				</AnimatePresence>
			)}
		</div>
	);
};

export default CashSettlementReportsTableActionCell;
