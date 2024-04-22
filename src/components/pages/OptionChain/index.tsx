'use client';

import Main from '@/components/layout/Main';
import { useState } from 'react';
import Option from './Option';
import Toolbar from './Toolbar';

const OptionChain = () => {
	const [inputs, setInputs] = useState<OptionChainFilters>({
		baseSymbol: null,
		settlementDay: null,
	});

	const setInputValue = <T extends keyof OptionChainFilters>(name: T, value: OptionChainFilters[T]) => {
		setInputs((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<Main className='gap-8 !px-8'>
			<Toolbar inputs={inputs} setInputValue={setInputValue} />
			<Option settlementDay={inputs.settlementDay} baseSymbol={inputs.baseSymbol ?? null} />
		</Main>
	);
};

export default OptionChain;
