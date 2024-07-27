import SymbolState from '@/components/common/SymbolState';
import { GrowDownSVG, GrowUpSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { getColorBasedOnPercent, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface SymbolMainDetailsProps extends Symbol.Info {}

const SymbolMainDetails = (symbol: SymbolMainDetailsProps) => {
	const t = useTranslations('common');

	const dispatch = useAppDispatch();

	const openSymbolInfoPanel = () => {
		try {
			dispatch(setSymbolInfoPanel(symbol.symbolISIN));
		} catch (e) {
			//
		}
	};

	const {
		closingPriceVarReferencePrice,
		closingPriceVarReferencePricePercent,
		symbolTradeState,
		symbolTitle,
		lastTradedPrice,
		companyName,
	} = symbol;

	return (
		<div className='flex-column'>
			<div className='flex-justify-between'>
				<div onClick={openSymbolInfoPanel} style={{ gap: '1rem' }} className='flex-items-center'>
					<SymbolState state={symbolTradeState} />
					<h1 className='text-gray-800 text-3xl font-medium'>{symbolTitle}</h1>
				</div>

				<div className='flex-1 gap-8 flex-justify-end'>
					<span
						className={clsx(
							'gap-4 ltr flex-items-center',
							getColorBasedOnPercent(closingPriceVarReferencePricePercent),
						)}
					>
						{sepNumbers(String(closingPriceVarReferencePrice ?? 0))}
						<span className='flex items-center text-base'>
							({(closingPriceVarReferencePricePercent ?? 0).toFixed(2)} %)
							{closingPriceVarReferencePricePercent > 0 && <GrowUpSVG width='1rem' height='1rem' />}
							{closingPriceVarReferencePricePercent < 0 && <GrowDownSVG width='1rem' height='1rem' />}
						</span>
					</span>

					<span className='flex items-center gap-4 text-2xl font-bold'>
						{sepNumbers(String(lastTradedPrice ?? 0))}
						<span className='text-gray-700 text-tiny font-normal'>{t('rial')}</span>
					</span>
				</div>
			</div>

			<div onClick={openSymbolInfoPanel} className='cursor-pointer flex-column'>
				<h4 className='text-gray-800 whitespace-nowrap pr-20 text-tiny'>{companyName}</h4>
			</div>
		</div>
	);
};

export default SymbolMainDetails;
