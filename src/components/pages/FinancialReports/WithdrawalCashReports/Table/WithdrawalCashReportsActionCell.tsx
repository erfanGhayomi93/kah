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
								className='text-gray-700'
								disabled={isDisabled}
								type='button'
								onClick={() => onEditRow(data)}
							>
								<EditSVG width='2rem' height='2rem' />
							</button>
						</span>
					</Tooltip>

					<Tooltip content={t(isDisabled ? 'tooltip.remove_disabled' : 'tooltip.remove')}>
						<span>
							<button
								disabled={isDisabled}
								className='text-gray-700'
								type='button'
								onClick={() => setConfirmDelete(true)}
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

export default WithdrawalCashReportsActionCell;
