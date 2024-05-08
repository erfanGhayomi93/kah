import { RefreshSVG, XSVG } from '@/components/icons';
import { useAppSelector } from '@/features/hooks';
import { getManageColumnsPanel } from '@/features/slices/panelSlice';
import clsx from 'clsx';
import { useState } from 'react';

interface ColumnsProps {
	close: () => void;
}

const Columns = ({ close }: ColumnsProps) => {
	const manageColumns = useAppSelector(getManageColumnsPanel);

	const [columns, setColumns] = useState(manageColumns?.columns ?? []);

	const onColumnChanged = (updatedCol: IManageStrategyColumn) => {
		try {
			const newColumns = columns.map((col) => ({
				...col,
				hidden: Boolean(col.id === updatedCol.id ? !col.hidden : col.hidden),
			}));

			setColumns(newColumns);
			manageColumns?.onColumnChanged(updatedCol, newColumns);
		} catch (e) {
			//
		}
	};

	return (
		<>
			<div className='sticky top-0 z-10 h-56 w-full bg-gray-200 px-24 flex-justify-between'>
				<h1 className='text-xl font-medium text-gray-900'>{manageColumns?.title}</h1>

				<div className='flex gap-24'>
					<button className='icon-hover' type='button' onClick={manageColumns?.onReset}>
						<RefreshSVG width='2.4rem' height='2.4rem' />
					</button>
					<button className='icon-hover' type='button' onClick={close}>
						<XSVG width='2rem' height='2rem' />
					</button>
				</div>
			</div>

			<ul className='flex flex-wrap gap-x-16 gap-y-24 px-24'>
				{columns.map((col) => (
					<li key={col.id}>
						<button
							onClick={() => onColumnChanged(col)}
							type='button'
							style={{ width: '14.4rem' }}
							className={clsx(
								'h-40 rounded transition-colors flex-justify-center',
								col.hidden
									? 'bg-white text-gray-900 shadow-sm hover:shadow-none hover:btn-hover'
									: 'bg-primary-400 text-white hover:bg-primary-300',
							)}
						>
							{col.title}
						</button>
					</li>
				))}
			</ul>
		</>
	);
};

export default Columns;
