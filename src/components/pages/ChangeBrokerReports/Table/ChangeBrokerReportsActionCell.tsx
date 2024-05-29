import AnimatePresence from '@/components/common/animation/AnimatePresence';
import Tooltip from '@/components/common/Tooltip';
import { TrashSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface IChangeBrokerReportsTableActionCellProps {
	onDeleteRow: (data: Reports.IChangeBrokerReports | undefined) => void;
	data: Reports.IChangeBrokerReports;
}

const ChangeBrokerReportsTableActionCell = ({ onDeleteRow, data }: IChangeBrokerReportsTableActionCellProps) => {
	const t = useTranslations();

	const [confirmDelete, setConfirmDelete] = useState(false);

	return (
		<div className='gap-16 flex-justify-center'>
			{!confirmDelete && (
				<AnimatePresence initial={{ animation: 'FadeIn' }} exit={{ animation: 'FadeOut' }}>
					<>
						<Tooltip content={t('common.delete')}>
							<button
								disabled={data.lastState !== 'Draft'}
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

export default ChangeBrokerReportsTableActionCell;
