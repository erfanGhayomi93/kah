import AnimatePresence from '@/components/common/animation/AnimatePresence';
import { HandWriteSVG, RefreshSVG, TrashSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface IPhysicalSettlementReportsTableActionCellProps {
	onDeleteRow: (data: Reports.IPhysicalSettlementReports | undefined) => void;
	onHistory: (data: Reports.IPhysicalSettlementReports | undefined) => void;
	onRequest: (data: Reports.IPhysicalSettlementReports | undefined) => void;
	data: Reports.IPhysicalSettlementReports;
}

const PhysicalSettlementReportsTableActionCell = ({
	onDeleteRow,
	data,
	onHistory,
	onRequest,
}: IPhysicalSettlementReportsTableActionCellProps) => {
	const t = useTranslations();

	const [confirmDelete, setConfirmDelete] = useState(false);

	const isDisabled = !data?.enabled;

	const physicalSettlementStatus = data?.status ?? undefined;

	return (
		<div className='gap-16 flex-justify-start'>
			{!confirmDelete && (
				<AnimatePresence initial={{ animation: 'FadeIn' }} exit={{ animation: 'FadeOut' }}>
					<>
						<button
							disabled={isDisabled || physicalSettlementStatus !== 'Draft' || !data?.openPositionCount}
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
								!(
									physicalSettlementStatus === 'InSendQueue' ||
									physicalSettlementStatus === 'Registered'
								)
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

export default PhysicalSettlementReportsTableActionCell;
