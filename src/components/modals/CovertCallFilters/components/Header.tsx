import { EraserSVG, XSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import React from 'react';

interface HeaderProps {
	onCloseClick: () => void;
	onEraserClick: () => void;
}

const Header = ({ onCloseClick, onEraserClick }: HeaderProps) => {
	const t = useTranslations();

	return (
		<div className='grid grid-cols-3 bg-gray-200 px-24 py-18 text-gray-900 ltr'>
			<div className='flex justify-start gap-16'>
				<button onClick={onCloseClick}>
					<XSVG width='2rem' height='2rem' />
				</button>
				<button onClick={onEraserClick}>
					<EraserSVG width='2rem' height='2rem' />
				</button>
			</div>
			<div className='flex justify-center text-base font-medium'>
				<p>{t('CoveredCall.filterModalTitle')}</p>
			</div>
		</div>
	);
};

export default Header;
