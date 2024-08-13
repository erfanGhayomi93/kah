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

	const onDelete = () => {
		onDeleteRow(data);
		setConfirmDelete(false);
	};

	const isDisabled = data.state !== 'Registeration';

	return (
		<div className='gap-16 flex-justify-center'>
			{!confirmDelete && (
				<>
					<Tooltip content={t(isDisabled ? 'tooltip.edit_disabled' : 'tooltip.edit')}>
						<span>
							<button
								disabled={isDisabled}
								type='button'
								onClick={() => onEditRow(data)}
								className='text-gray-700 disabled:text-gray-500'
							>
								<EditSVG width='2rem' height='2rem' />
							</button>
						</span>
					</Tooltip>
					<Tooltip content={t(isDisabled ? 'tooltip.remove_disabled' : 'tooltip.remove')}>
						<span>
							<button
								disabled={isDisabled}
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

export default DepositWithReceiptReportsActionCell;
