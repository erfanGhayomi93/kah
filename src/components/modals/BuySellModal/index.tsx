import { useCommissionsQuery } from '@/api/queries/commonQueries';
import { useSymbolBestLimitQuery, useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import OFormula from '@/classes/Math/OFormula';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import { useAppDispatch } from '@/features/hooks';
import { setBuySellModal } from '@/features/slices/modalSlice';
import { type IBuySellModal } from '@/features/slices/types/modalSlice.interfaces';
import dynamic from 'next/dynamic';
import { forwardRef, useEffect, useMemo, useState } from 'react';
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

		const { data: bestLimitData, isLoading: isLoadingBestLimit } = useSymbolBestLimitQuery({
			queryKey: ['symbolBestLimitQuery', symbolISIN],
		});

		const { data: commissionData } = useCommissionsQuery({
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

		const formula = () => {
			return OFormula.setType(symbolData?.isOption ? 'option' : 'base')
				.setSide(inputs.side)
				.setCommission(commission)
				.setContractSize(symbolData?.contractSize ?? 0)
				.setInitialRequiredMargin(symbolData?.initialMargin ?? 0)
				.setRequiredMargin(symbolData?.requiredMargin ?? 0);
		};

		const setInputValue: TSetBsModalInputs = (arg1, arg2) => {
			if (typeof arg1 === 'string') {
				if (arg1 === 'price') return onChangePrice(arg2 as number, true);
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

		const setMinimumValue = () => {
			let value = 5e6;
			const quantity = formula().quantity(inputs.price, value);
			value = formula().value(inputs.price, quantity);

			setInputs((values) => ({
				...values,
				value,
				quantity,
			}));
		};

		const onCloseModal = () => {
			dispatch(setBuySellModal(null));
		};

		const onChangePrice = (price: number, checkIsLock: boolean): void => {
			const value = formula().value(price, inputs.quantity);

			setInputs((values) => ({
				...values,
				priceLock: checkIsLock ? false : values.priceLock,
				price,
				value,
			}));
		};

		const onChangeQuantity = (quantity: number): void => {
			const value = formula().value(inputs.price, quantity);

			setInputs((values) => ({
				...values,
				quantity,
				value,
			}));
		};

		const onChangeValue = (value: number): void => {
			const quantity = formula().quantity(inputs.price, value);

			setInputs((values) => ({
				...values,
				quantity,
				value,
			}));
		};

		const commission = useMemo<Record<TBsSides, number>>(() => {
			const result: Record<TBsSides, number> = { buy: 0, sell: 0 };

			if (!commissionData || !symbolData) return result;

			const c = commissionData[symbolData.marketUnit];
			if (c && typeof c === 'object') {
				result.buy = Math.abs(c.buyCommission);
				result.sell = Math.abs(c.sellCommission);
			}

			return result;
		}, [JSON.stringify(commissionData), inputs.side, symbolData?.marketUnit]);

		useEffect(() => {
			onChangeValue(formula().value(inputs.price, inputs.quantity));
		}, [inputs.side]);

		useEffect(() => {
			if (!inputs.priceLock || !Array.isArray(bestLimitData)) return;
			const bestLimitPrice =
				inputs.side === 'buy' ? bestLimitData[0].bestSellLimitPrice : bestLimitData[0].bestBuyLimitPrice;

			onChangePrice(bestLimitPrice, false);
		}, [inputs.priceLock, inputs.side, bestLimitData]);

		return (
			<Modal
				suppressClickOutside
				moveable
				transparent
				top='16%'
				onClose={onCloseModal}
				{...props}
				ref={ref}
				classes={{
					modal: 'border border-info-100',
				}}
			>
				<Div style={{ width: inputs.expand ? '732px' : '336px' }} className='bg-gray-50'>
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
									<SymbolInfo
										symbolData={symbolData ?? null}
										isLoading={isLoading}
										setInputValue={setInputValue}
									/>
								</ErrorBoundary>
							)}
						</div>

						<Body
							{...inputs}
							symbolData={symbolData ?? null}
							isLoadingBestLimit={isLoadingBestLimit}
							symbolTitle={symbolTitle}
							switchable={switchable}
							id={id}
							mode={mode}
							type={type}
							symbolISIN={symbolISIN}
							symbolType={symbolType}
							close={onCloseModal}
							setInputValue={setInputValue}
							setMinimumValue={setMinimumValue}
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
