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

	const onDelete = () => {
		onDeleteRow(data);
		setConfirmDelete(false);
	};

	const isDisabled = data.requestState !== 'InProgress';

	return (
		<div className='gap-16 flex-justify-center'>
			{!confirmDelete && (
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

export default FreezeUnFreezeReportsTableActionCell;
