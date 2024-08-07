import { useFreezeMutation } from '@/api/mutations/freezeMutations';
import { useGlPositionExtraInfoQuery } from '@/api/queries/brokerPrivateQueries';
import { useCommissionsQuery } from '@/api/queries/commonQueries';
import lightStreamInstance from '@/classes/Lightstream';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useAppDispatch } from '@/features/hooks';
import {
	setExecuteCoveredCallStrategyModal,
	updateExecuteCoveredCallStrategyModal,
} from '@/features/slices/modalSlice';
import { type IExecuteCoveredCallStrategyModal } from '@/features/slices/types/modalSlice.interfaces';
import { useInputs, useSubscription } from '@/hooks';
import { createOrder } from '@/utils/orders';
import { type ItemUpdate } from 'lightstreamer-client-web';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useState } from 'react';
import Modal, { Header } from '../Modal';
import AddConditionalAlarm from './AddConditionalAlarm';
import BuyBaseSymbol from './BuyBaseSymbol';
import StepForm from './CreateStrategy/StepForm';
import Steps from './CreateStrategy/Steps';
import OrderOption from './OrderOption';
import StrategyChartDetails from './StrategyChartDetails';
import SymbolInfo from './SymbolInfo';

interface ExecuteCoveredCallStrategyModalProps extends IExecuteCoveredCallStrategyModal {}

const ExecuteCoveredCallStrategyModal = forwardRef<HTMLDivElement, ExecuteCoveredCallStrategyModalProps>(
	({ strategy, baseSymbol, contractSize, inUseCapital, option, ...props }, ref) => {
		const t = useTranslations();

		const dispatch = useAppDispatch();

		const { subscribe } = useSubscription();

		const { data: symbolExtraInfo } = useGlPositionExtraInfoQuery({
			queryKey: ['glPositionExtraInfoQuery', baseSymbol.symbolISIN],
		});

		const { data: commissions } = useCommissionsQuery({
			queryKey: ['commissionQuery'],
		});

		const { mutate: createFreezeRequest } = useFreezeMutation();

		const [step, setStep] = useState<CreateStrategy.TCoveredCallSteps>('base');

		const [isExpand, setIsExpand] = useState(false);

		const { inputs, setFieldValue, setFieldsValue } = useInputs<CreateStrategy.CoveredCallInput>({
			budget: 0,
			quantity: 0,
			optionPrice: option.bestLimitPrice,
			basePrice: baseSymbol.bestLimitPrice,
			useFreeStock: false,
		});

		const onCloseModal = () => {
			dispatch(setExecuteCoveredCallStrategyModal(null));
		};

		const onSymbolUpdate = (updateInfo: ItemUpdate) => {
			const symbolISIN: string = updateInfo.getItemName();

			const updates: Partial<IExecuteCoveredCallStrategyModal> = {};

			updateInfo.forEachChangedField((_a, _b, value) => {
				try {
					if (value !== null) {
						const valueAsNumber = Number(value);
						if (isNaN(valueAsNumber)) return;

						if (symbolISIN === baseSymbol.symbolISIN) {
							updates.baseSymbol = {
								...baseSymbol,
								bestLimitPrice: valueAsNumber,
							};
						}

						if (symbolISIN === option.symbolISIN) {
							updates.option = {
								...option,
								bestLimitPrice: valueAsNumber,
							};
						}
					}
				} catch (e) {
					//
				}
			});

			dispatch(updateExecuteCoveredCallStrategyModal(updates));
		};

		const onSubmitBaseSymbol = () => {
			try {
				createOrder({
					price: inputs.basePrice,
					quantity: inputs.quantity,
					orderSide: 'buy',
					symbolISIN: baseSymbol.symbolISIN,
					validity: 'Day',
					validityDate: 0,
				});

				setIsExpand(false);
				setStep('freeze');
			} catch (e) {
				//
			}
		};

		const onSubmitOption = () => {
			try {
				createOrder({
					price: inputs.optionPrice,
					quantity: inputs.quantity / contractSize,
					orderSide: 'sell',
					symbolISIN: option.symbolISIN,
					validity: 'Day',
					validityDate: 0,
				});
			} catch (e) {
				//
			}
		};

		const goToNextStep = () => {
			if (step === 'base') {
				if (remainsQuantity === 0) setStep('freeze');
				else setIsExpand(true);

				return;
			}

			if (step === 'freeze') {
				createFreezeRequest({ symbolISIN: [baseSymbol.symbolISIN], type: 'freeze' });
				setStep('option');

				return;
			}

			if (step === 'option') {
				setIsExpand(true);
				return;
			}
		};

		useEffect(() => {
			const fields = ['bestSellLimitPrice_1', 'bestBuyLimitPrice_1'];
			const symbolISINs = [baseSymbol.symbolISIN, option.symbolISIN];

			const sub = lightStreamInstance.subscribe({
				mode: 'MERGE',
				items: symbolISINs,
				fields,
				dataAdapter: 'RamandRLCDData',
				snapshot: true,
			});
			sub.addEventListener('onItemUpdate', onSymbolUpdate);

			subscribe(sub);
		}, []);

		useEffect(() => {
			if (inputs.useFreeStock && remainsQuantity === 0) {
				setIsExpand(false);
			}
		}, [inputs.useFreeStock]);

		const remainsQuantity = inputs.useFreeStock
			? Math.max(0, inputs.quantity - (symbolExtraInfo?.asset ?? 0))
			: inputs.quantity;

		const baseSymbolCommission = commissions?.[baseSymbol.marketUnit] ?? null;

		const optionCommission = commissions?.[option.marketUnit] ?? null;

		return (
			<Modal
				top='50%'
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				onClose={onCloseModal}
				{...props}
				ref={ref}
			>
				<div
					style={{ width: isExpand ? '102.4rem' : '60rem' }}
					className='overflow-hidden bg-white transition-width flex-column darkness:bg-gray-50'
				>
					<Header
						label={t('create_strategy.strategy', {
							strategyName: t(`${strategy}.title`),
							baseSymbolTitle: baseSymbol.symbolTitle,
						})}
						onClose={onCloseModal}
					/>

					<div className='flex gap-24 p-24'>
						<div className='w-full justify-between gap-16 flex-column'>
							<div className='flex flex-row-reverse gap-24'>
								<StepForm
									asset={symbolExtraInfo?.asset ?? 0}
									isFreeze={Boolean(symbolExtraInfo?.isFreeze)}
									baseBestLimitPrice={baseSymbol.bestLimitPrice}
									optionBestLimitPrice={option.bestLimitPrice}
									step={step}
									baseSymbolCommission={baseSymbolCommission?.buyCommission ?? 0}
									optionCommission={optionCommission?.sellCommission ?? 0}
									setFieldValue={setFieldValue}
									setFieldsValue={setFieldsValue}
									nextStep={goToNextStep}
									pending={isExpand}
									contractSize={contractSize}
									optionQuantity={Math.floor(inputs.quantity / contractSize)}
									{...inputs}
								/>

								<Steps baseSymbol={baseSymbol} option={option} step={step} />
							</div>

							<ErrorBoundary>
								<StrategyChartDetails
									contractSize={contractSize}
									baseSymbol={baseSymbol}
									option={option}
									{...inputs}
								/>
							</ErrorBoundary>

							<AddConditionalAlarm />
						</div>

						{isExpand && (
							<>
								{step === 'base' && (
									<SymbolInfo symbolISIN={baseSymbol.symbolISIN}>
										{(symbolData) => (
											<BuyBaseSymbol
												symbolTitle={symbolData.symbolTitle}
												bestLimitPrice={baseSymbol.bestLimitPrice}
												quantity={remainsQuantity}
												price={inputs.basePrice}
												marketUnit={symbolData.marketUnit}
												validityDate='Day'
												onSubmit={onSubmitBaseSymbol}
												onChangePrice={(v) => setFieldValue('basePrice', v)}
											/>
										)}
									</SymbolInfo>
								)}

								{step === 'option' && (
									<SymbolInfo symbolISIN={option.symbolISIN}>
										{(symbolData) => (
											<OrderOption
												symbolTitle={symbolData.symbolTitle}
												bestLimitPrice={option.bestLimitPrice}
												quantity={inputs.quantity * contractSize}
												price={inputs.optionPrice}
												onSubmit={onSubmitOption}
												onChangePrice={(v) => setFieldValue('optionPrice', v)}
											/>
										)}
									</SymbolInfo>
								)}
							</>
						)}
					</div>
				</div>
			</Modal>
		);
	},
);

export default ExecuteCoveredCallStrategyModal;
