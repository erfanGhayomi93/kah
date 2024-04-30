import Click from '@/components/common/Click';
import SymbolSearch from '@/components/common/Symbol/SymbolSearch';
import SymbolState from '@/components/common/SymbolState';
import { SearchSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useState } from 'react';

interface ToggleSymbolSelectProps {
	symbolData: Symbol.Info;
}

const ToggleSymbolSelect = ({ symbolData }: ToggleSymbolSelectProps) => {
	const dispatch = useAppDispatch();
	const [isToggleActive, setIsToggleActive] = useState(false);

	const onChangeSymbol = (value: Symbol.Search | null) => {
		if (value?.symbolISIN) dispatch(setSymbolInfoPanel(value.symbolISIN));
		setIsToggleActive(false);
	};

	return (
		<div className='flex-1 gap-12 flex-column'>
			<div className='gap-8 flex-items-center'>
				<SymbolState state={symbolData.symbolTradeState} />

				<div className='cursor-pointer gap-8 flex-items-center' onClick={() => setIsToggleActive(true)}>
					<div className='text-gray-900'>
						<SearchSVG width='2rem' height='2rem' />
					</div>

					<h1 className='text-lg font-medium text-gray-1000'>{symbolData.symbolTitle}</h1>

					{isToggleActive && (
						<Click onClickOutside={() => setIsToggleActive(false)}>
							<div className='absolute bg-white'>
								<SymbolSearch
									autoFocus
									classes={{
										list: 'panel-symbol-search',
									}}
									value={{ ...symbolData, companyISIN: '' } as Symbol.Search}
									onChange={onChangeSymbol}
								/>
							</div>
						</Click>
					)}
				</div>
			</div>
			<h2 className='pr-16 text-tiny text-gray-900'>{symbolData.companyName}</h2>
		</div>
	);
};

export default ToggleSymbolSelect;
