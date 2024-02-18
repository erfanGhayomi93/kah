import { AngleLeftCircle } from '@/components/icons';
import { useTranslations } from 'next-intl';

interface HeaderProps {
	symbolTitle: string;
}

const Header = ({ symbolTitle }: HeaderProps) => {
	const t = useTranslations();

	return (
		<div className='moveable relative h-48 border-b border-b-gray-500 bg-white flex-justify-center'>
			<h2 className='text-lg font-medium text-gray-1000'>{t('bs_modal.title', { symbolTitle })}</h2>
			<button type='button' className='absolute left-16 top-1/2 -translate-y-1/2 transform'>
				<span className='size-24 text-gray-900 flex-justify-center'>
					<AngleLeftCircle width='2.4rem' height='2.4rem' />
				</span>
			</button>
		</div>
	);
};

export default Header;
