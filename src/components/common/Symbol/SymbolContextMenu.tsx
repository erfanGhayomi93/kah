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
			zIndex={99999}
			defaultPopupWidth={160}
			className='symbol-menu'
			renderer={({ setOpen }) => (
				<ul
					style={{ width: '16rem' }}
					className='darkBlue:bg-gray-50 overflow-hidden rounded bg-white shadow-tooltip flex-column dark:bg-gray-50'
				>
					<li>
						<a
							target='_blank'
							onClick={() => setOpen(false)}
							href={getTSELink(symbol?.insCode)}
							className='h-48 w-full gap-16 px-16 text-base text-gray-700 transition-colors flex-justify-start hover:bg-secondary-200'
						>
							<Image width='18' height='18' src='/static/images/tsetmc.png' alt='' />
							{t('common.tse')}
						</a>
					</li>
					{!symbol?.isOption && (
						<li>
							<a
								target='_blank'
								onClick={() => setOpen(false)}
								href={getCodalLink(symbol?.symbolTitle)}
								className='h-48 w-full gap-16 px-16 text-base text-gray-700 transition-colors flex-justify-start hover:bg-secondary-200'
							>
								<Image width='18' height='18' src='/static/images/codal.png' alt='' />
								{t('common.codal')}
							</a>
						</li>
					)}

					<li>
						<button
							onClick={() => setOpen(false)}
							className='h-48 w-full gap-16 px-16 text-base text-gray-700 transition-colors flex-justify-start hover:bg-secondary-200'
						>
							{t('symbol_context_menu.add_note')}
						</button>
					</li>
					<li>
						<button
							onClick={() => setOpen(false)}
							className='h-48 w-full gap-16 px-16 text-base text-gray-700 transition-colors flex-justify-start hover:bg-secondary-200'
						>
							{t('symbol_context_menu.alarm')}
						</button>
					</li>
					<li>
						<button
							onClick={() => setOpen(false)}
							className='h-48 w-full gap-16 px-16 text-base text-gray-700 transition-colors flex-justify-start hover:bg-secondary-200'
						>
							{t('symbol_context_menu.technical_chart')}
						</button>
					</li>
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
