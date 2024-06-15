import { AngleLeftCircleSVG, XSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';

interface HeaderProps {
	symbolTitle: string;
	expand: boolean;
	onToggle: () => void;
	onClose: () => void;
}

const Header = ({ symbolTitle, expand, onToggle, onClose }: HeaderProps) => {
	const t = useTranslations();

	return (
		<div className='moveable relative h-48 border-b border-b-light-gray-200 bg-white flex-justify-center'>
			<button type='button' className='absolute right-16 top-1/2 -translate-y-1/2' onClick={onToggle}>
				<span className='size-24 text-light-gray-700 flex-justify-center'>
					<AngleLeftCircleSVG
						width='2.4rem'
						height='2.4rem'
						style={{ transform: `rotate(${expand ? 0 : 180}deg)`, transition: 'transform 250ms' }}
					/>
				</span>
			</button>

			<h2 className='text-lg font-medium text-light-gray-800'>{t('bs_modal.title', { symbolTitle })}</h2>

			<button type='button' className='absolute left-16 top-1/2 -translate-y-1/2' onClick={onClose}>
				<span className='size-24 text-light-gray-700 flex-justify-center'>
					<XSVG width='2rem' height='2rem' />
				</span>
			</button>
		</div>
	);
};

export default Header;
