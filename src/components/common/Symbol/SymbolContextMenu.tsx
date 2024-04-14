import Popup from '@/components/common/Popup';
import { MoreOptionsSVG } from '@/components/icons';
import { getCodalLink, getTSELink } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface SymbolContextMenuProps {
	symbol: Symbol.Info | null;
	svgSize?: number;
}

const SymbolContextMenu = ({ symbol, svgSize = 24 }: SymbolContextMenuProps) => {
	const t = useTranslations();

	return (
		<Popup
			defaultPopupWidth={160}
			renderer={() => (
				<ul style={{ width: '16rem' }} className='overflow-hidden rounded bg-white shadow-tooltip flex-column'>
					<li>
						<a
							href={getTSELink(symbol?.insCode)}
							target='_blank'
							className='h-48 gap-16 px-16 text-base text-gray-900 transition-colors flex-justify-start hover:bg-secondary-100'
						>
							<Image width='18' height='18' src='/static/images/tsetmc.png' alt='' />
							{t('common.tse')}
						</a>
					</li>
					{!symbol?.isOption && (
						<li>
							<a
								href={getCodalLink(symbol?.symbolTitle)}
								target='_blank'
								className='h-48 gap-16 px-16 text-base text-gray-900 transition-colors flex-justify-start hover:bg-secondary-100'
							>
								<Image width='18' height='18' src='/static/images/codal.png' alt='' />
								{t('common.codal')}
							</a>
						</li>
					)}
				</ul>
			)}
		>
			{({ setOpen, open }) => (
				<button
					onClick={() => setOpen(!open)}
					className={`size-${svgSize} flex-justify-center icon-hover`}
					type='button'
				>
					<MoreOptionsSVG />
				</button>
			)}
		</Popup>
	);
};

export default SymbolContextMenu;
