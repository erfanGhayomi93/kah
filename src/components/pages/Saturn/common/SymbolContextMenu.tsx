import Popup from '@/components/common/Popup';
import { MoreOptionsSVG } from '@/components/icons';
import { getCodalLink, getTSELink } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface SymbolContextMenuProps {
	symbol: Symbol.Info | null;
}

const SymbolContextMenu = ({ symbol }: SymbolContextMenuProps) => {
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
							className='h-48 px-16 text-base text-gray-900 transition-colors flex-justify-start hover:bg-secondary-100'
						>
							{t('common.tse')}
						</a>
					</li>
					<li>
						<a
							href={getCodalLink(symbol?.symbolTitle)}
							target='_blank'
							className='h-48 px-16 text-base text-gray-900 transition-colors flex-justify-start hover:bg-secondary-100'
						>
							{t('common.codal')}
						</a>
					</li>
				</ul>
			)}
		>
			{({ setOpen, open }) => (
				<button
					onClick={() => setOpen(true)}
					className='size-24 text-gray-900 flex-justify-center'
					type='button'
				>
					<MoreOptionsSVG />
				</button>
			)}
		</Popup>
	);
};

export default SymbolContextMenu;
