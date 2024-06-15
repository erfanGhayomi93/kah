import { useSymbolSearchQuery } from '@/api/queries/symbolQuery';
import Click from '@/components/common/Click';
import KeyDown from '@/components/common/KeyDown';
import Popup from '@/components/common/Popup';
import styles from '@/components/common/Symbol/SymbolSearch.module.scss';
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
			defaultPopupWidth={300}
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
					<KeyDown
						enabled={isExpand}
						keys={['Escape']}
						onKeyDown={() => {
							setIsExpand(false);
							setOpen(false);
						}}
					>
						<div
							style={{ width: isExpand ? '30rem' : '4rem' }}
							className='border-light-gray-200 h-40 rounded border bg-white pl-8 transition-width flex-justify-between'
						>
							<button
								onClick={() => setIsExpand(!isExpand)}
								type='button'
								className='text-light-gray-700 h-40 min-w-40 flex-justify-center'
							>
								<SearchSVG width='2.4rem' height='2.4rem' strokeWidth='4rem' />
							</button>

							{isExpand && (
								<div className='flex-1 overflow-hidden flex-justify-start'>
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
										className='text-light-gray-700 size-24 rounded-circle flex-justify-center'
									>
										<XCircleSVG width='1.6rem' height='1.6rem' />
									</button>
								</div>
							)}
						</div>
					</KeyDown>
				</Click>
			)}
		</Popup>
	);
};

export default SearchSymbol;
