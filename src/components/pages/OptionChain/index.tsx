'use client';

import Main from '@/components/layout/Main';
import { useAppDispatch } from '@/features/hooks';
import { setOrderBasket } from '@/features/slices/userSlice';
import { useInputs } from '@/hooks';
import { useEffect } from 'react';
import Option from './Option';
import Toolbar from './Toolbar';

const OptionChain = () => {
	const dispatch = useAppDispatch();

	const { inputs, setFieldValue } = useInputs<OptionChainFilters>({
		baseSymbol: null,
		settlementDay: null,
	});

	useEffect(() => {
		dispatch(setOrderBasket(null));
	}, [inputs.baseSymbol?.symbolISIN]);

	return (
		<Main className='gap-8 !px-8'>
			<Toolbar inputs={inputs} setFieldValue={setFieldValue} />
			<Option settlementDay={inputs.settlementDay} baseSymbol={inputs.baseSymbol ?? null} />
		</Main>
	);
};

export default OptionChain;
