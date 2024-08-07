import Radiobox from '@/components/common/Inputs/Radiobox';
import { useTranslations } from 'next-intl';

interface PositionsProps {
	data: IAvailableContractInfo[];
	selectedPosition: IAvailableContractInfo | null;
	setSelectedPosition: (v: IAvailableContractInfo) => void;
}

interface PositionProps extends IAvailableContractInfo {
	isActive: boolean;
	onClick: () => void;
}

const Positions = ({ data, selectedPosition, setSelectedPosition }: PositionsProps) => (
	<div className='relative overflow-hidden rounded px-16 shadow-sm'>
		<ul className='bg-white flex-column darkness:bg-gray-50'>
			{data.map((item) => (
				<Position
					key={item.symbolISIN}
					{...item}
					isActive={selectedPosition?.symbolISIN === item.symbolISIN}
					onClick={() => setSelectedPosition(item)}
				/>
			))}
		</ul>
	</div>
);

const Position = ({ symbolTitle, customersOpenPositions, isActive, onClick }: PositionProps) => {
	const t = useTranslations();

	return (
		<li className='flex-48 flex-justify-between'>
			<Radiobox label={symbolTitle} checked={isActive} onChange={onClick} />

			{customersOpenPositions === 0 ? (
				<button type='button' className='font-medium text-success-100 transition-color hover:text-success-200'>
					{t('side.buy')}
				</button>
			) : (
				<span className='text-gray-500'>
					{t('change_block_type_modal.free_position', { n: customersOpenPositions })}
				</span>
			)}
		</li>
	);
};

export default Positions;
