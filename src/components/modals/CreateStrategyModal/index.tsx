import ipcMain from '@/classes/IpcMain';
import lightStreamInstance from '@/classes/Lightstream';
import { useAppDispatch } from '@/features/hooks';
import { setCreateStrategyModal } from '@/features/slices/modalSlice';
import { type ICreateStrategyModal } from '@/features/slices/types/modalSlice.interfaces';
import { useSubscription } from '@/hooks';
import { type ItemUpdate } from 'lightstreamer-client-web';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import Modal, { Header } from '../Modal';
import AddConditionalAlarm from './AddConditionalAlarm';
import BaseSymbolInfo from './CreateStrategy/BaseSymbolInfo';
import StepForm from './CreateStrategy/StepForm';
import Steps from './CreateStrategy/Steps';
import StrategyChartDetails from './StrategyChartDetails';

type TSubFields = IpcMainChannels['execute_strategy:symbol_data']['fieldName'];

interface CreateStrategyModalProps extends ICreateStrategyModal {}

const CreateStrategyModal = forwardRef<HTMLDivElement, CreateStrategyModalProps>(
	({ strategy, baseSymbol, steps, ...props }, ref) => {
		const t = useTranslations();

		const subscriptionResultRef = useRef<Record<string, Array<IpcMainChannels['execute_strategy:symbol_data']>>>(
			{},
		);

		const dispatch = useAppDispatch();

		const { subscribe } = useSubscription();

		const [isExpand, setIsExpand] = useState(false);

		const [strategySteps, setStrategySteps] = useState<CreateStrategy.Step[]>(steps);

		const setFieldValue = <T extends keyof CreateStrategy.IBaseSymbol>(
			name: T,
			value: CreateStrategy.IBaseSymbol[T],
		) => {
			const targetIndex = strategySteps.findIndex((item) => activeStep.id === item.id);
			if (targetIndex === -1) return;

			const newSteps = JSON.parse(JSON.stringify(strategySteps)) as typeof strategySteps;
			newSteps[targetIndex] = {
				...newSteps[targetIndex],
				[name]: value,
			};

			setStrategySteps(newSteps);
		};

		const onCloseModal = () => {
			dispatch(setCreateStrategyModal(null));
		};

		const nextStep = () => {
			if (activeStep.type === 'base') {
				setIsExpand(true);
			}
		};

		const onSymbolUpdate = (updateInfo: ItemUpdate) => {
			const symbolISIN: string = updateInfo.getItemName();

			updateInfo.forEachChangedField((fieldName, _b, value) => {
				try {
					if (value !== null) {
						const result = {
							fieldName: fieldName as TSubFields,
							itemName: symbolISIN,
							value: Number(value),
						};

						subscriptionResultRef.current[symbolISIN].push(result);

						ipcMain.send('execute_strategy:symbol_data', result);
					}
				} catch (e) {
					//
				}
			});
		};

		const activeStep = useMemo(() => strategySteps.find((item) => item.status === 'TODO')!, [strategySteps]);

		useEffect(() => {
			ipcMain.handle(
				'execute_strategy:get_symbol_data',
				([symbolISIN, fieldName]) =>
					new Promise<IpcMainChannels['execute_strategy:symbol_data'] | null>((resolve) => {
						const data = subscriptionResultRef.current[symbolISIN];
						if (!Array.isArray(data)) resolve(null);

						resolve(
							data.findLast((item) => item.itemName === symbolISIN && item.fieldName === fieldName) ??
								null,
						);
					}),
				{
					async: true,
				},
			);
		}, []);

		useEffect(() => {
			const fields: TSubFields[] = ['bestSellLimitPrice_1', 'bestBuyLimitPrice_1'];
			const symbolISINs = [];

			for (let i = 0; i < steps.length; i++) {
				const step = steps[i];
				if ('symbolISIN' in step) {
					symbolISINs.push(step.symbolISIN);

					if (!(step.symbolISIN in subscriptionResultRef.current))
						subscriptionResultRef.current[step.symbolISIN] = [];

					if (step.type === 'base') {
						subscriptionResultRef.current[step.symbolISIN].push({
							fieldName: 'bestSellLimitPrice_1',
							itemName: step.symbolISIN,
							value: step.bestLimitPrice,
						});
					} else {
						subscriptionResultRef.current[step.symbolISIN].push({
							fieldName: step.side === 'buy' ? 'bestSellLimitPrice_1' : 'bestBuyLimitPrice_1',
							itemName: step.symbolISIN,
							value: step.side === 'buy' ? step.bestSellLimitPrice : step.bestBuyLimitPrice,
						});
					}
				}
			}

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
					className='overflow-hidden bg-white transition-width flex-column'
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
									step={activeStep}
									onChange={setFieldValue}
									nextStep={nextStep}
									pending={isExpand}
								/>
								<Steps steps={steps} />
							</div>
							<StrategyChartDetails />
							<AddConditionalAlarm />
						</div>

						{isExpand && activeStep.type === 'base' && (
							<BaseSymbolInfo
								quantity={activeStep.quantity}
								price={activeStep.orderPrice}
								baseSymbolISIN={baseSymbol.symbolISIN}
								toggleExpand={setIsExpand}
								onChange={setFieldValue}
							/>
						)}
					</div>
				</div>
			</Modal>
		);
	},
);

export default CreateStrategyModal;
