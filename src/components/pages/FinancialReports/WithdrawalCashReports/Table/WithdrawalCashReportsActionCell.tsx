import AnimatePresence from '@/components/common/animation/AnimatePresence';
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
		<div className='gap-16 flex-justify-start'>
			{!confirmDelete && (
				<AnimatePresence initial={{ animation: 'FadeIn' }} exit={{ animation: 'FadeOut' }}>
					<>
						<button
							className='text-gray-900 disabled:text-gray-700'
							disabled={data.state !== 'Registeration'}
							type='button'
							onClick={() => onEditRow(data)}
						>
							<EditSVG width='2rem' height='2rem' />
						</button>
						<button
							disabled={data.state !== 'Registeration'}
							className='text-gray-900 disabled:text-gray-700'
							type='button'
							onClick={() => setConfirmDelete(true)}
						>
							<TrashSVG className='text-gray-900' width='2rem' height='2rem' />
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

export default WithdrawalCashReportsActionCell;
