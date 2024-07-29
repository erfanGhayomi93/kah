import Click from '@/components/common/Click';
import SymbolSearch from '@/components/common/Symbol/SymbolSearch';
import SymbolState from '@/components/common/SymbolState';
import { SearchSVG } from '@/components/icons';
import { openNewTab } from '@/utils/helpers';
import clsx from 'clsx';
import { useState } from 'react';

interface SymbolSearchTogglerProps {
	symbolTitle: string;
	companyName: string;
	symbolTradeState: Symbol.TradeState;
}

const SymbolSearchToggler = ({ symbolTitle, companyName, symbolTradeState }: SymbolSearchTogglerProps) => {
	const [isSearching, setIsSearching] = useState(false);

	const onChangeSymbol = (newSymbol: Symbol.Search | null) => {
		if (!newSymbol) return;

		const saturnUrl = newSymbol.isOption
			? `/saturn?contractISIN=${newSymbol.symbolISIN}`
			: `/saturn?symbolISIN=${newSymbol.symbolISIN}`;

		openNewTab(saturnUrl);
	};

	return (
		<div className='relative flex-1 cursor-pointer flex-column'>
			<div onClick={() => setIsSearching(true)} className='gap-8 flex-items-center'>
				<SymbolState state={symbolTradeState} />
				<div className='text-gray-700'>
					<SearchSVG width='2.4rem' height='2.4rem' />
				</div>
				<h1 className='text-3xl font-medium text-gray-800'>{symbolTitle}</h1>
			</div>

			<h4 className={clsx('whitespace-nowrap pr-20 text-tiny text-gray-800', isSearching && 'opacity-0')}>
				{companyName}
			</h4>

			{isSearching && (
				<Click onClickOutside={() => setIsSearching(false)}>
					<div style={{ width: '24rem' }} className='darkBlue:bg-gray-50 absolute bg-white dark:bg-gray-50'>
						<SymbolSearch
							clearable
							autoFocus
							classes={{
								list: 'symbol-menu',
							}}
							value={null}
							onChange={onChangeSymbol}
						/>
					</div>
				</Click>
			)}
		</div>
	);
};

export default SymbolSearchToggler;
