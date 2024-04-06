import Checkbox from '@/components/common/Inputs/Checkbox';
import { DragSVG } from '@/components/icons';
import Image from 'next/image';

interface SectionProps {
	title: string;
	imgSrc: string;
	checked: boolean;
	onChecked: (checked: boolean) => void;
}

const Section = ({ title, checked, imgSrc, onChecked }: SectionProps) => {
	return (
		<div className='flex-justify-between'>
			<div className='gap-8 flex-items-center'>
				<button type='button' className='drag-handler text-gray-700'>
					<DragSVG width='2rem' height='2rem' />
				</button>

				<Checkbox checked={checked} onChange={onChecked} />

				<span className='text-base text-gray-900'>{title}</span>
			</div>

			<Image width='96' height='60' alt='Favicon' src={imgSrc} />
		</div>
	);
};

export default Section;
