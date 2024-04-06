import Checkbox from '@/components/common/Inputs/Checkbox';
import Image from 'next/image';

interface SectionProps {
	title: string;
	imgSrc: string;
	checked: boolean;
	onChecked: (checked: boolean) => void;
}

const Section = ({ title, checked, imgSrc, onChecked }: SectionProps) => {
	return (
		<li
			style={{ width: '132px', height: '124px' }}
			className='items-center justify-center gap-8 rounded bg-white shadow-card flex-column'
		>
			<div className='gap-8 flex-items-center'>
				<Checkbox checked={checked} onChange={onChecked} />
				<span className='text-tiny text-gray-900'>{title}</span>
			</div>

			<Image width='96' height='60' alt='Favicon' src={imgSrc} />
		</li>
	);
};

export default Section;
