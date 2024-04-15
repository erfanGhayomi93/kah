import Checkbox from '@/components/common/Inputs/Checkbox';
import { PlusSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setOrderBasket } from '@/features/slices/userSlice';
import { uuidv4 } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useCallback, useLayoutEffect, useRef } from 'react';
import Contract from './Contract';

interface SelectedContractsProps {
	data: IOrderBasket[];
	selectedData: IOrderBasket[];
	setSelectedData: (v: IOrderBasket[]) => void;
}

const SelectedContracts = ({ data, selectedData, setSelectedData }: SelectedContractsProps) => {
	const t = useTranslations();

	const listRef = useRef<HTMLUListElement | null>(null);

	const dispatch = useAppDispatch();

	const filterBasketItems = (id: string) => (item: IOrderBasket) => {
		return item.id !== id;
	};

	const onSelect = (id: string, order: IOrderBasket, checked: boolean) => {
		if (checked) setSelectedData([...selectedData, order]);
		else setSelectedData(selectedData.filter(filterBasketItems(id)));
	};

	const onDelete = (id: string) => {
		setSelectedData(selectedData.filter(filterBasketItems(id)));
		dispatch(setOrderBasket(data.filter(filterBasketItems(id))));
	};

	const addEmptyRow = () => {
		dispatch(
			setOrderBasket([
				...data,
				{
					id: uuidv4(),
					baseSymbolISIN: data[0].baseSymbolISIN,
					symbolISIN: null,
					side: 'buy',
					type: 'call',
					settlementDay: null,
					strikePrice: 0,
					price: 0,
					quantity: 0,
				},
			]),
		);
	};

	const setProperty = <T extends keyof IOrderBasket>(id: string, field: T, value: IOrderBasket[T]) => {
		const basket = JSON.parse(JSON.stringify(data)) as IOrderBasket[];
		const itemIndex = basket.findIndex((item, index) => item.id === id);

		if (itemIndex === -1) return;

		basket[itemIndex][field] = value;

		dispatch(setOrderBasket(basket));
	};

	const setProperties = (id: string, values: Partial<IOrderBasket>) => {
		const basket = JSON.parse(JSON.stringify(data)) as IOrderBasket[];
		const itemIndex = basket.findIndex((item, index) => item.id === id);

		if (itemIndex === -1) return;

		basket[itemIndex] = {
			...basket[itemIndex],
			...values,
		};

		dispatch(setOrderBasket(basket));
	};

	const selectAll = (checked: boolean) => {
		if (checked)
			setSelectedData(
				data.filter(
					({ price, quantity, strikePrice, settlementDay }) =>
						price > 0 && quantity > 0 && strikePrice > 0 && settlementDay !== null,
				),
			);
		else setSelectedData([]);
	};

	const isChecked = useCallback(
		(id: string) => {
			return selectedData.findIndex((item) => item.id === id) > -1;
		},
		[selectedData],
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
		<div style={{ minHeight: '12.8rem' }} className='relative gap-8 flex-column'>
			<div className='h-32 gap-8 px-16 flex-justify-start *:text-tiny *:text-gray-900'>
				<div style={{ flex: '0 0 24px' }} className='h-40 flex-items-center'>
					<Checkbox checked={selectedData.length === dLength} onChange={selectAll} />
				</div>

				<div style={{ flex: '0 0 40px' }} className='text-center'>
					<span>{t('order_basket.bs')}</span>
				</div>

				<div className='flex-1 text-center'>
					<span>{t('order_basket.end_date')}</span>
				</div>

				<div style={{ flex: '0 0 86px' }} className='text-center'>
					<span>{t('order_basket.strike')}</span>
				</div>

				<div style={{ flex: '0 0 86px' }} className='text-center'>
					<span>{t('order_basket.type')}</span>
				</div>

				<div style={{ flex: '0 0 64px' }} className='text-center'>
					<span>{t('order_basket.quantity')}</span>
				</div>

				<div style={{ flex: '0 0 86px' }} className='text-center'>
					<span>{t('order_basket.price')}</span>
				</div>

				<div style={{ flex: '0 0 24px' }} className='text-center' />
			</div>

			<ul
				ref={listRef}
				style={{ height: (dLength + 1) * 48 - 8, maxHeight: '32dvh', transition: 'height 250ms ease' }}
				className={clsx('relative h-full flex-column', dLength > 5 && 'overflow-auto')}
			>
				{data.map((item, i) => (
					<Contract
						index={i}
						key={item.id}
						checked={isChecked(item.id)}
						onSelect={(checked) => onSelect(item.id, item, checked)}
						onDelete={() => onDelete(item.id)}
						setProperty={(field, value) => setProperty(item.id, field, value)}
						setProperties={(values) => setProperties(item.id, values)}
						{...item}
					/>
				))}

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
