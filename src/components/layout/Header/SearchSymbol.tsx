import { useSymbolSearchQuery } from '@/api/queries/symbolQuery';
import Click from '@/components/common/Click';
import Popup from '@/components/common/Popup';
import styles from '@/components/common/Symbol/SymbolSearch.module.scss';
import Tooltip from '@/components/common/Tooltip';
import { SearchSVG, XCircleSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const SearchSymbol = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [term, setTerm] = useState('');

	const [isExpand, setIsExpand] = useState(false);

	const { data: symbolsData, isFetching } = useSymbolSearchQuery({
		queryKey: ['symbolSearchQuery', term.length < 2 ? null : term],
	});

	const setSymbol = (symbolISIN: string) => {
		if (symbolISIN) dispatch(setSymbolInfoPanel(symbolISIN));
	};

	useEffect(() => {
		setTerm('');
	}, [isExpand]);

	return (
		<Popup
			defaultPopupWidth={256}
			margin={{
				y: 4,
			}}
			className='w-searchbox'
			zIndex={9999}
			onClose={() => setTerm('')}
			renderer={({ setOpen }) => {
				if (term.length < 2) return null;

				if (isFetching)
					return (
						<div className={styles.blankList}>
							<span>{t('common.searching')}</span>
						</div>
					);

				if (!Array.isArray(symbolsData) || symbolsData.length === 0)
					return (
						<div className={styles.blankList}>
							<span>{t('common.symbol_not_found')}</span>
						</div>
					);

				return (
					<div className={styles.list}>
						<ul>
							{symbolsData.map((symbol) => (
								<li
									onClick={() => {
										setSymbol(symbol.symbolISIN);
										setIsExpand(false);
										setOpen(false);
									}}
									key={symbol.symbolISIN}
									className={styles.item}
								>
									{symbol.symbolTitle}
								</li>
							))}
						</ul>
					</div>
				);
			}}
		>
			{({ setOpen }) => (
				<Click
					dependency='.w-searchbox'
					enabled={isExpand}
					onClickOutside={() => {
						setIsExpand(false);
						setOpen(false);
					}}
				>
					<div
						style={{ width: isExpand ? '256px' : '3.2rem' }}
						className='h-32 overflow-hidden rounded-oval bg-light-gray-100 px-8 transition-width flex-justify-between'
					>
						<Tooltip disabled={isExpand} placement='bottom' content={t('tooltip.symbol_search')}>
							<button
								type='button'
								onClick={() => setIsExpand(!isExpand)}
								className='size-32 flex-justify-center icon-hover'
							>
								<SearchSVG width='2rem' height='2rem' strokeWidth='4rem' />
							</button>
						</Tooltip>

						{isExpand && (
							<>
								<input
									autoFocus
									onFocus={() => setOpen(true)}
									type='text'
									value={term}
									onChange={(e) => setTerm(e.target.value)}
									className='flex-1 border-0 bg-transparent text-right text-tiny'
									placeholder={t('header.search_symbol_placeholder')}
								/>
								<button
									onClick={() => {
										setOpen(false);
										setIsExpand(false);
									}}
									type='button'
									className='size-24 rounded-circle text-light-gray-700 flex-justify-center'
								>
									<XCircleSVG width='1.6rem' height='1.6rem' />
								</button>
							</>
						)}
					</div>
				</Click>
			)}
		</Popup>
	);
};

export default SearchSymbol;
