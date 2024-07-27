import AnimatePresence from '@/components/common/animation/AnimatePresence';
import Tooltip from '@/components/common/Tooltip';
import { TrashSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface IFreezeUnFreezeReportsTableActionCellProps {
	onDeleteRow: (data: Reports.IFreezeUnfreezeReports | undefined) => void;
	data: Reports.IFreezeUnfreezeReports;
}

const FreezeUnFreezeReportsTableActionCell = ({ onDeleteRow, data }: IFreezeUnFreezeReportsTableActionCellProps) => {
	const t = useTranslations();

	const [confirmDelete, setConfirmDelete] = useState(false);

	return (
		<div className='gap-16 flex-justify-center'>
			{!confirmDelete && (
				<AnimatePresence initial={{ animation: 'FadeIn' }} exit={{ animation: 'FadeOut' }}>
					<>
						<Tooltip content={t('tooltip.remove')}>
							<button
								disabled={data.requestState !== 'InProgress'}
								type='button'
								onClick={() => setConfirmDelete(true)}
								className='text-gray-700 disabled:text-gray-500'
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
						<button className='text-gray-700' type='button' onClick={() => setConfirmDelete(false)}>
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

export default FreezeUnFreezeReportsTableActionCell;
