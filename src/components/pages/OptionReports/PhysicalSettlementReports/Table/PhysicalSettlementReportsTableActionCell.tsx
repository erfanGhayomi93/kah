import AnimatePresence from '@/components/common/animation/AnimatePresence';
import Tooltip from '@/components/common/Tooltip';
import { HandWriteSVG, TrashSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface IPhysicalSettlementReportsTableActionCellProps {
	onDeleteRow: (data: Reports.IPhysicalSettlementReports | undefined) => void;
	onRequest: (data: Reports.IPhysicalSettlementReports | undefined) => void;
	data: Reports.IPhysicalSettlementReports;
}

const PhysicalSettlementReportsTableActionCell = ({
	onDeleteRow,
	data,
	onRequest,
}: IPhysicalSettlementReportsTableActionCellProps) => {
	const t = useTranslations();

	const [confirmDelete, setConfirmDelete] = useState(false);

	const isDisabled = !data?.enabled;

	const physicalSettlementStatus = data?.status ?? undefined;

	return (
		<div className='gap-16 flex-justify-center'>
			{!confirmDelete && (
				<AnimatePresence initial={{ animation: 'FadeIn' }} exit={{ animation: 'FadeOut' }}>
					<>
						<Tooltip content={t('tooltip.request')}>
							<button
								disabled={
									isDisabled || physicalSettlementStatus !== 'Draft' || !data?.openPositionCount
								}
								type='button'
								className='text-gray-900 disabled:text-gray-700'
								onClick={() => onRequest(data)}
							>
								<HandWriteSVG width='2rem' height='2rem' />
							</button>
						</Tooltip>

						<Tooltip content={t('tooltip.remove')}>
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
						</Tooltip>
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
