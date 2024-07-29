import AnimatePresence from '@/components/common/animation/AnimatePresence';
import Tooltip from '@/components/common/Tooltip';
import { EditSVG, TrashSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface IWithdrawalCashReportsActionCellProps {
	onDeleteRow: (data: Reports.IWithdrawal | undefined) => void;
	onEditRow: (data: Reports.IWithdrawal | undefined) => void;
	data: Reports.IWithdrawal;
}

const WithdrawalCashReportsActionCell = ({ onDeleteRow, onEditRow, data }: IWithdrawalCashReportsActionCellProps) => {
	const t = useTranslations();

	const [confirmDelete, setConfirmDelete] = useState(false);

	return (
		<div className='gap-16 flex-justify-center'>
			{!confirmDelete && (
				<AnimatePresence initial={{ animation: 'FadeIn' }} exit={{ animation: 'FadeOut' }}>
					<>
						<Tooltip content={t('tooltip.edit')}>
							<button
								className='text-gray-700 disabled:text-gray-500'
								disabled={data.state !== 'Registeration'}
								type='button'
								onClick={() => onEditRow(data)}
							>
								<EditSVG width='2rem' height='2rem' />
							</button>
						</Tooltip>
						<Tooltip content={t('tooltip.remove')}>
							<button
								disabled={data.state !== 'Registeration'}
								className='text-gray-700 disabled:text-gray-500'
								type='button'
								onClick={() => setConfirmDelete(true)}
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

export default WithdrawalCashReportsActionCell;
