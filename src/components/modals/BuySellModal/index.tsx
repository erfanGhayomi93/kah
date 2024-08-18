import { useGlPositionExtraInfoQuery, useUserRemainQuery } from '@/api/queries/brokerPrivateQueries';
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
	min-height: 632px;
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
			priceLock,
			blockType,
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

		const { data: symbolExtraInfo } = useGlPositionExtraInfoQuery({
			queryKey: ['glPositionExtraInfoQuery', symbolData?.symbolISIN ?? ''],
			enabled: Boolean(symbolData),
		});

		const { data: bestLimitData, isLoading: isLoadingBestLimit } = useSymbolBestLimitQuery({
			queryKey: ['symbolBestLimitQuery', symbolISIN],
		});

		const { data: commissionData } = useCommissionsQuery({
			queryKey: ['commissionQuery'],
		});

		const { data: userRemain } = useUserRemainQuery({
			queryKey: ['userRemainQuery'],
		});

		const [inputs, setInputs] = useState<IBsModalInputs>({
			price: initialPrice ?? 0,
			quantity: initialQuantity ?? 0,
			value: 0,
			blockType: blockType ?? null,
			side: side ?? 'buy',
			validity: initialValidity ?? 'Day',
			validityDate: initialValidityDate ?? Date.now(),
			expand: expand ?? false,
			priceLock: priceLock ?? false,
			holdAfterOrder: holdAfterOrder ?? false,
		});

		const formula = () => {
			return OFormula.setType(symbolData?.isOption ? 'option' : 'base')
				.setSide(inputs.side)
				.setCommission(commission)
				.setContractSize(symbolData?.contractSize ?? 0)
				.setInitialRequiredMargin(symbolData?.initialMargin ?? 0);
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
			const quantity = formula().quantity(inputs.price, value) + 1;
			value = formula().value(inputs.price, quantity);

			setInputs((values) => ({
				...values,
				value,
				quantity,
			}));
		};

		const rearrangeValue = () => {
			if (!inputs.price || !inputs.quantity) return;

			const originalQuantity =
				inputs.side === 'buy' ? inputs.quantity : Math.max(inputs.quantity - symbolAssets, 0);

			setInputs({
				...inputs,
				value: formula().value(inputs.price, originalQuantity),
			});
		};

		const onCloseModal = () => {
			dispatch(setBuySellModal(null));
		};

		const onChangePrice = (price: number, checkIsLock: boolean): void => {
			const originalQuantity =
				inputs.side === 'buy' ? inputs.quantity : Math.max(inputs.quantity - symbolAssets, 0);

			const value = formula().value(price, originalQuantity);

			setInputs((values) => ({
				...values,
				priceLock: checkIsLock ? false : values.priceLock,
				price,
				value,
			}));
		};

		const onChangeQuantity = (quantity: number): void => {
			const originalQuantity = inputs.side === 'buy' ? quantity : Math.max(quantity - symbolAssets, 0);
			const value = formula().value(inputs.price, originalQuantity);

			setInputs((values) => ({
				...values,
				quantity,
				value,
			}));
		};

		const onChangeValue = (value: number): void => {
			const quantity = formula().quantity(inputs.price, value) + symbolAssets;

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

		const purchasePower = useMemo(() => {
			let purchasePower = userRemain?.purchasePower ?? 0;
			if (!inputs.price || !inputs.quantity) return purchasePower;

			const quantity = formula().quantity(inputs.price, purchasePower);
			purchasePower = formula().value(inputs.price, quantity);

			return Math.max(Math.floor(purchasePower), 0);
		}, [inputs.price, inputs.quantity, userRemain?.purchasePower ?? 0]);

		useEffect(() => {
			if (!inputs.price || !inputs.quantity) return;

			const originalQuantity =
				inputs.side === 'buy' ? inputs.quantity : Math.max(inputs.quantity - symbolAssets, 0);

			setInputs((values) => ({
				...values,
				value: formula().value(inputs.price, originalQuantity),
			}));
		}, [inputs.side]);

		useEffect(() => {
			if (!inputs.priceLock || !Array.isArray(bestLimitData)) return;
			const bestLimitPrice =
				inputs.side === 'buy' ? bestLimitData[0].bestSellLimitPrice : bestLimitData[0].bestBuyLimitPrice;

			onChangePrice(bestLimitPrice, false);
		}, [inputs.priceLock, inputs.side, bestLimitData]);

		const symbolAssets = Number(symbolExtraInfo?.asset ?? 0);

		const symbolType = symbolData?.isOption ? 'option' : 'base';

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
							symbolAssets={symbolAssets}
							orderingPurchasePower={purchasePower}
							purchasePower={userRemain?.purchasePower ?? 0}
							symbolData={symbolData ?? null}
							isLoadingBestLimit={isLoadingBestLimit}
							symbolTitle={symbolTitle}
							switchable={switchable}
							id={id}
							mode={mode}
							type={type}
							symbolISIN={symbolISIN}
							symbolType={symbolType}
							rearrangeValue={rearrangeValue}
							closeModal={onCloseModal}
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
