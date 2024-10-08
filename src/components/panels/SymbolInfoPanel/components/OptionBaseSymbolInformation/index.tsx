import { ArrowUpSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useLocalstorage } from '@/hooks';
import { useTranslations } from 'next-intl';
import OptionData from './OptionData';

interface OptionBaseSymbolInformationProps {
	symbolData: Symbol.Info;
}

const OptionBaseSymbolInformation = ({ symbolData }: OptionBaseSymbolInformationProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [isExpand, setIsExpand] = useLocalstorage('bsio', false);

	const { baseSymbolTitle, baseSymbolISIN, symbolISIN, symbolTitle } = symbolData;

	return (
		<div
			style={{
				height: isExpand ? '35.6rem' : '4.8rem',
				transition: 'height 250ms ease-in',
			}}
			className='darkBlue:bg-gray-50 select-none overflow-hidden rounded bg-white px-8 flex-column dark:bg-gray-50'
		>
			<div onClick={() => setIsExpand(!isExpand)} className='min-h-48 cursor-pointer flex-justify-between'>
				<div onClick={() => dispatch(setSymbolInfoPanel(baseSymbolISIN))} className='text-base text-gray-700'>
					{t('symbol_info_panel.base_symbol_information') + ' '}
					<span className='border-b-info border-b text-info-100'>{baseSymbolTitle ?? symbolTitle}</span>
				</div>
				<button type='button' className='text-gray-700'>
					<ArrowUpSVG
						width='1.6rem'
						height='1.6rem'
						className='transition-transform'
						style={{ transform: `rotate(${isExpand ? 0 : 180}deg)` }}
					/>
				</button>
			</div>

			{isExpand && <OptionData symbolISIN={symbolISIN} baseSymbolISIN={baseSymbolISIN} />}
		</div>
	);
};

export default OptionBaseSymbolInformation;
