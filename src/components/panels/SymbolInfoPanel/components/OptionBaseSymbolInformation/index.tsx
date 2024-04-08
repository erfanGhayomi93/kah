import { ArrowUpSVG } from '@/components/icons';
import { useLocalstorage } from '@/hooks';
import { useTranslations } from 'next-intl';
import OptionData from './OptionData';

interface OptionBaseSymbolInformationProps {
	symbolData: Symbol.Info;
}

const OptionBaseSymbolInformation = ({ symbolData }: OptionBaseSymbolInformationProps) => {
	const t = useTranslations();

	const [isExpand, setIsExpand] = useLocalstorage('bsio', false);

	const { baseSymbolTitle, symbolTitle } = symbolData;

	return (
		<div
			style={{
				height: isExpand ? '35.6rem' : '4.8rem',
				transition: 'height 250ms ease-in',
			}}
			className='select-none rounded bg-white px-8 flex-column'
		>
			<div onClick={() => setIsExpand(!isExpand)} className='min-h-48 cursor-pointer flex-justify-between'>
				<div className='text-base text-gray-900'>
					{t('symbol_info_panel.base_symbol_information') + ' '}
					<span className='border-b border-b-info text-info'>{baseSymbolTitle ?? symbolTitle}</span>
				</div>
				<button type='button' className='text-gray-800'>
					<ArrowUpSVG
						width='1.6rem'
						height='1.6rem'
						className='transition-transform'
						style={{ transform: `rotate(${isExpand ? 0 : 180}deg)` }}
					/>
				</button>
			</div>

			{isExpand && <OptionData symbolISIN={symbolData.symbolISIN} />}
		</div>
	);
};

export default OptionBaseSymbolInformation;
