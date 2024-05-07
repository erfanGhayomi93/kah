import { RefreshSVG, XSVG } from '@/components/icons';
import { useAppSelector } from '@/features/hooks';
import { getManageColumnsPanel } from '@/features/slices/panelSlice';

interface ColumnsProps {
	close: () => void;
}

const Columns = ({ close }: ColumnsProps) => {
	const manageColumns = useAppSelector(getManageColumnsPanel);

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
		</>
	);
};

export default Columns;
