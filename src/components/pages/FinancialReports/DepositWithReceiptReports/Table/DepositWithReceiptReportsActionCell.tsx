import AnimatePresence from '@/components/common/animation/AnimatePresence';
import Tooltip from '@/components/common/Tooltip';
import { EditSVG, TrashSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface IDepositWithReceiptReportsActionCellProps {
	onDeleteRow: (data: Reports.IDepositWithReceipt | undefined) => void;
	onEditRow: (data: Reports.IDepositWithReceipt | undefined) => void;
	data: Reports.IDepositWithReceipt;
}

const DepositWithReceiptReportsActionCell = ({
	onDeleteRow,
	onEditRow,
	data,
}: IDepositWithReceiptReportsActionCellProps) => {
	const t = useTranslations();

	const [confirmDelete, setConfirmDelete] = useState(false);

	return (
		<div className='gap-16 flex-justify-center'>
			{!confirmDelete && (
				<AnimatePresence initial={{ animation: 'FadeIn' }} exit={{ animation: 'FadeOut' }}>
					<>
						<Tooltip content={t('common.edit')}>
							<button
								disabled={data.state !== 'Registeration'}
								type='button'
								onClick={() => onEditRow(data)}
								className='text-gray-900 disabled:text-gray-700'
							>
								<EditSVG width='2rem' height='2rem' />
							</button>
						</Tooltip>
						<Tooltip content={t('common.delete')}>
							<button
								disabled={data.state !== 'Registeration'}
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

export default DepositWithReceiptReportsActionCell;
