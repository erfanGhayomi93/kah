import Radiobox from '@/components/common/Inputs/Radiobox';
import { useTranslations } from 'next-intl';

interface PositionsProps {
	data: IAvailableContractInfo[];
	selectedPosition: IAvailableContractInfo | null;
	setSelectedPosition: (v: IAvailableContractInfo) => void;
	quantity: number;
}

interface PositionProps extends IAvailableContractInfo {
	isActive: boolean;
	selectable: boolean;
	onClick: () => void;
}

const Positions = ({ data, quantity, selectedPosition, setSelectedPosition }: PositionsProps) => {
	const sortedData = [...data];
	sortedData.sort((a, b) => b.customersOpenPositions - a.customersOpenPositions);

	return (
		<div className='relative overflow-hidden rounded px-16 shadow-sm'>
			<ul className='bg-white flex-column darkness:bg-gray-50'>
				{sortedData.map((item) => (
					<Position
						key={item.symbolISIN}
						{...item}
						isActive={selectedPosition?.symbolISIN === item.symbolISIN}
						selectable={item.customersOpenPositions >= quantity}
						onClick={() => setSelectedPosition(item)}
					/>
				))}
			</ul>
		</div>
	);
};

const Position = ({ symbolTitle, customersOpenPositions, isActive, selectable, onClick }: PositionProps) => {
	const t = useTranslations();

	return (
		<li className='flex-48 flex-justify-between'>
			<Radiobox label={symbolTitle} checked={isActive} onChange={onClick} />

			{selectable && (
				<span className='text-gray-500'>
					{t('change_block_type_modal.free_position', { n: customersOpenPositions })}
				</span>
			)}
		</li>
	);
};

export default Positions;
