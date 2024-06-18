import Checkbox from '@/components/common/Inputs/Checkbox';
import clsx from 'clsx';
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
			onClick={() => onChecked(!checked)}
			style={{ width: '132px', height: '124px' }}
			className={clsx(
				'cursor-pointer items-center justify-center gap-8 rounded shadow-card transition-colors flex-column',
				checked ? 'bg-white' : 'bg-light-gray-100',
			)}
		>
			<div className='select-none gap-8 flex-items-center'>
				<Checkbox checked={checked} />
				<span className='text-light-gray-700 text-tiny'>{title}</span>
			</div>

			<Image width='96' height='60' alt='Favicon' src={imgSrc} />
		</li>
	);
};

export default Section;
