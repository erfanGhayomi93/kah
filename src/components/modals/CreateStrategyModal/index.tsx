import { useAppDispatch } from '@/features/hooks';
import { setCreateStrategyModal } from '@/features/slices/modalSlice';
import { type ICreateStrategyModal } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import Modal, { Header } from '../Modal';
import AddConditionalAlarm from './AddConditionalAlarm';
import CreateStrategy from './CreateStrategy';
import StrategyChartDetails from './StrategyChartDetails';

interface CreateStrategyModalProps extends ICreateStrategyModal {}

const CreateStrategyModal = forwardRef<HTMLDivElement, CreateStrategyModalProps>(
	({ strategy, baseSymbol, steps, ...props }, ref) => {
		const t = useTranslations();

		const dispatch = useAppDispatch();

		const [inputs, setInputs] = useState<CreateStrategy.Input[]>(steps);

		const onCloseModal = () => {
			dispatch(setCreateStrategyModal(null));
		};

		return (
			<Modal
				top='50%'
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				onClose={onCloseModal}
				{...props}
				ref={ref}
			>
				<div style={{ width: '60rem' }} className='bg-white flex-column'>
					<Header
						label={t('create_strategy.strategy', {
							strategyName: t(`${strategy}.title`),
							baseSymbolTitle: baseSymbol.symbolTitle,
						})}
						onClose={onCloseModal}
					/>

					<div className='flex p-24'>
						<div className='w-full justify-between gap-16 flex-column'>
							<CreateStrategy inputs={inputs} setInputs={setInputs} />
							<StrategyChartDetails />
							<AddConditionalAlarm />
						</div>
					</div>
				</div>
			</Modal>
		);
	},
);

export default CreateStrategyModal;
