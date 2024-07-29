import Click from '@/components/common/Click';
import SymbolSearch from '@/components/common/Symbol/SymbolSearch';
import SymbolState from '@/components/common/SymbolState';
import { SearchSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useState } from 'react';

interface SymbolSearchTogglerProps {
	symbolData: Symbol.Info;
}

const SymbolSearchToggler = ({ symbolData }: SymbolSearchTogglerProps) => {
	const dispatch = useAppDispatch();

	const [isSearching, setIsSearching] = useState(false);

	const onChangeSymbol = (value: Symbol.Search | null) => {
		if (value?.symbolISIN) dispatch(setSymbolInfoPanel(value.symbolISIN));
		setIsSearching(false);
	};

	return (
		<div className='flex-1 gap-12 flex-column'>
			<div className='gap-8 flex-items-center'>
				<SymbolState state={symbolData.symbolTradeState} />

				<div className='cursor-pointer gap-8 flex-items-center' onClick={() => setIsSearching(true)}>
					<div className='text-gray-700'>
						<SearchSVG width='2rem' height='2rem' />
					</div>

					<h1 className='text-lg font-medium text-gray-800'>{symbolData.symbolTitle}</h1>

					{isSearching && (
						<Click onClickOutside={() => setIsSearching(false)}>
							<div
								style={{ width: '18rem' }}
								className='darkBlue:bg-gray-50 absolute bg-white dark:bg-gray-50'
							>
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
			</div>
			<h2 className='pr-16 text-tiny text-gray-700'>{symbolData.companyName}</h2>
		</div>
	);
};

export default SymbolSearchToggler;
