import { useCommissionsQuery } from '@/api/queries/commonQueries';
import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import { useAppDispatch } from '@/features/hooks';
import { setBuySellModal } from '@/features/slices/modalSlice';
import { type IBuySellModal } from '@/features/slices/types/modalSlice.interfaces';
import { divide } from '@/utils/helpers';
import dynamic from 'next/dynamic';
import { forwardRef, useMemo, useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import Body from './Body';
import Footer from './Footer';
import Header from './Header';

const SymbolInfo = dynamic(() => import('./SymbolInfo'), {
	ssr: false,
	loading: () => <Loading />,
});

const Div = styled.div`
	height: 62rem;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	transition: width 200ms ease-in-out;
	-webkit-transition: width 200ms ease-in-out;
`;

interface BuySellModalProps extends IBuySellModal {}

const BuySellModal = forwardRef<HTMLDivElement, BuySellModalProps>(
	(
		{
			id,
			symbolISIN,
			symbolTitle,
			symbolType,
			priceLock,
			collateral,
			side,
			switchable = true,
			mode = 'create',
			type = 'order',
			initialValidity,
			initialValidityDate,
			initialPrice,
			initialQuantity,
			expand = true,
			holdAfterOrder,
			...props
		},
		ref,
	) => {
		const dispatch = useAppDispatch();

		const { data: symbolData, isLoading } = useSymbolInfoQuery({
			queryKey: ['symbolInfoQuery', symbolISIN],
		});

		const { data: commissions } = useCommissionsQuery({
			queryKey: ['commissionQuery'],
		});

		const [inputs, setInputs] = useState<IBsModalInputs>({
			price: initialPrice ?? 0,
			quantity: initialQuantity ?? 0,
			value: 0,
			collateral: collateral ?? null,
			side: side ?? 'buy',
			validity: initialValidity ?? 'Day',
			validityDate: initialValidityDate ?? 0,
			expand: expand ?? false,
			priceLock: priceLock ?? false,
			holdAfterOrder: holdAfterOrder ?? false,
		});

		const setInputValue: TSetBsModalInputs = (arg1, arg2) => {
			if (typeof arg1 === 'string') {
				if (arg1 === 'price') return onChangePrice(arg2 as number);
				if (arg1 === 'quantity') return onChangeQuantity(arg2 as number);
				if (arg1 === 'value') return onChangeValue(arg2 as number);

				setInputs((values) => ({
					...values,
					[arg1]: arg2,
				}));
			} else if (typeof arg1 === 'object') {
				setInputs((values) => ({
					...values,
					...arg1,
				}));
			} else if (typeof arg1 === 'function') {
				setInputs((values) => ({
					...values,
					...arg1(values),
				}));
			}
		};

		const onCloseModal = () => {
			dispatch(setBuySellModal(null));
		};

		const onChangePrice = (price: number): void => {
			let value = price * inputs.quantity;
			value += Math.round(value * commission.default);

			setInputs((values) => ({
				...values,
				price,
				value,
			}));
		};

		const onChangeQuantity = (quantity: number): void => {
			let value = inputs.price * quantity;
			value += Math.round(value * commission.default);

			setInputs((values) => ({
				...values,
				quantity,
				value,
			}));
		};

		const onChangeValue = (value: number): void => {
			const { price } = inputs;
			const estimatedQuantity = Math.max(divide(value, price), 0);

			const valuePerQuantity = price + price * commission.default;

			let defaultValue = estimatedQuantity * price;
			defaultValue += commission.default * defaultValue;

			const remainValue = Math.floor(divide(defaultValue - value, valuePerQuantity));
			const realQuantity = Math.floor(Math.max(estimatedQuantity - remainValue, 0));

			defaultValue = realQuantity * price;
			defaultValue += Math.round(commission.default * defaultValue);

			setInputs((prev) => ({
				...prev,
				quantity: realQuantity,
				value: defaultValue,
			}));
		};

		const commission = useMemo<Record<'default' | 'buy' | 'sell', number>>(() => {
			const result: Record<'default' | 'buy' | 'sell', number> = { default: 0, buy: 0, sell: 0 };

			if (!commissions || !symbolData) return result;

			if (!symbolData.marketUnit) {
				// eslint-disable-next-line no-console
				console.error(`MarketUnit not defined: ${symbolData.marketUnit}`);
				return result;
			}

			const comm = commissions[symbolData.marketUnit];
			if (!comm) {
				// eslint-disable-next-line no-console
				console.error(`MarketUnit not found: ${symbolData.marketUnit}`);
				return result;
			}

			result.sell = comm.sellCommission;
			result.buy = comm.buyCommission;
			result.default = side === 'buy' ? result.buy : result.sell;

			return result;
		}, [JSON.stringify(commissions), side, symbolData?.marketUnit]);

		return (
			<Modal suppressClickOutside moveable transparent top='16%' onClose={onCloseModal} {...props} ref={ref}>
				<Div style={{ width: inputs.expand ? '732px' : '336px' }} className='bg-light-gray-50'>
					<Header
						symbolTitle={symbolTitle}
						expand={inputs.expand}
						onToggle={() => setInputValue('expand', !inputs.expand)}
						onClose={onCloseModal}
					/>

					<div className='flex h-full flex-1'>
						<div className='relative w-full flex-1 overflow-hidden'>
							{inputs.expand && (
								<ErrorBoundary>
									<SymbolInfo symbolData={symbolData ?? null} isLoading={isLoading} />
								</ErrorBoundary>
							)}
						</div>

						<Body
							{...inputs}
							symbolTitle={symbolTitle}
							commission={commission}
							switchable={switchable}
							id={id}
							mode={mode}
							type={type}
							close={onCloseModal}
							symbolISIN={symbolISIN}
							symbolType={symbolType}
							priceTickSize={symbolData?.orderPriceTickSize ?? 0}
							quantityTickSize={symbolData?.orderQuantityTickSize ?? 0}
							setInputValue={setInputValue}
						/>
					</div>

					<Footer
						isHolding={inputs.holdAfterOrder}
						onHold={(checked) => setInputValue('holdAfterOrder', checked)}
					/>
				</Div>
			</Modal>
		);
	},
);

export default BuySellModal;
