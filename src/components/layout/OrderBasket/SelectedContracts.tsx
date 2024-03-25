import { PlusSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setOrderBasket } from '@/features/slices/userSlice';
import clsx from 'clsx';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import Contract from './Contract';

interface SelectedContractsProps {
	data: TOrderBasket[];
}

const SelectedContracts = ({ data }: SelectedContractsProps) => {
	const listRef = useRef<HTMLUListElement | null>(null);

	const dispatch = useAppDispatch();

	const [selectedContracts, setSelectedContracts] = useState<string[]>([]);

	const onSelect = (symbolISIN: string, checked: boolean) => {
		if (checked) setSelectedContracts([...selectedContracts, symbolISIN]);
		else setSelectedContracts(selectedContracts.filter((isin) => isin !== symbolISIN));
	};

	const onDelete = (id: number | string) => {
		const isString = typeof id === 'string';
		dispatch(setOrderBasket(data.filter((item, index) => (isString ? item.symbolISIN !== id : index !== id))));
	};

	const addEmptyRow = () => {
		dispatch(
			setOrderBasket([
				...data,
				{
					contract: null,
					symbolISIN: null,
					side: 'call',
					settlementDay: null,
					strikePrice: 0,
					price: 0,
					quantity: 0,
				},
			]),
		);
	};

	const setProperty = <T extends keyof TOrderBasket>(id: number | string, field: T, value: IFillOrderBasket[T]) => {
		const isString = typeof id === 'string';
		const basket = JSON.parse(JSON.stringify(data)) as IFillOrderBasket[];
		const itemIndex = basket.findIndex((item, index) => (isString ? item.symbolISIN === id : index === id));

		if (itemIndex === -1) return;

		basket[itemIndex][field] = value;

		dispatch(setOrderBasket(basket));
	};

	const isChecked = useCallback(
		(symbolISIN: string) => {
			return selectedContracts.findIndex((isin) => isin === symbolISIN) > -1;
		},
		[selectedContracts],
	);

	useLayoutEffect(() => {
		const eList = listRef.current;
		if (!eList || data.length < 6) return;

		eList.scrollTo({
			top: eList.scrollHeight + 24,
			behavior: 'smooth',
		});
	}, [data.length]);

	const dLength = data.length;

	return (
		<div style={{ minHeight: '8.8rem' }} className='relative'>
			<ul
				ref={listRef}
				style={{ height: (dLength + 1) * 48 - 8, maxHeight: '32dvh', transition: 'height 250ms ease' }}
				className={clsx('relative h-full flex-column', dLength > 5 && 'overflow-auto')}
			>
				{data.map((item, i) => {
					const id = item.symbolISIN ?? String(i);

					return (
						<Contract
							index={i}
							key={id}
							checked={isChecked(id)}
							onSelect={(checked) => onSelect(id, checked)}
							onDelete={() => onDelete(item.symbolISIN ?? i)}
							setProperty={(field, value) => setProperty(item.symbolISIN ?? i, field, value)}
							{...item}
						/>
					);
				})}

				<li
					key='plus'
					style={{ top: `${dLength * 40 + dLength * 8}px`, transition: 'top 250ms ease' }}
					className='absolute left-0 h-40 w-full pr-48'
				>
					<button onClick={addEmptyRow} className='size-40 rounded btn-primary'>
						<PlusSVG width='1.6rem' height='1.6rem' />
					</button>
				</li>
			</ul>
		</div>
	);
};

export default SelectedContracts;
