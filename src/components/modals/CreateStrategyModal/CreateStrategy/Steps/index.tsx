import { type ICreateStrategyModal } from '@/features/slices/types/modalSlice.interfaces';
import clsx from 'clsx';
import styles from '../../CreateStrategyModal.module.scss';
import BaseSymbolStep from './BaseSymbolStep';
import FreezeStep from './FreezeStep';
import OptionStep from './OptionStep';

interface StepsProps {
	baseSymbol: ICreateStrategyModal['baseSymbol'];
	option: ICreateStrategyModal['option'];
	step: CreateStrategy.TCoveredCallSteps;
}

const Steps = ({ step, baseSymbol, option }: StepsProps) => {
	return (
		<div style={{ flex: '0 0 23.6rem', minHeight: '9.6rem' }} className='rounded bg-gray-200 p-16'>
			<ul className={styles.list}>
				<BaseSymbolStep
					symbolTitle={baseSymbol.symbolTitle}
					bestLimitPrice={baseSymbol.bestLimitPrice}
					status={step === 'base' ? 'PENDING' : 'DONE'}
					className={clsx(styles.item, step === 'base' ? styles.active : styles.done)}
				/>

				<FreezeStep
					status={step === 'freeze' ? 'PENDING' : step === 'option' ? 'DONE' : 'TODO'}
					className={clsx(styles.item, step === 'freeze' ? styles.active : step === 'option' && styles.done)}
				/>

				<OptionStep
					status={step === 'option' ? 'PENDING' : 'TODO'}
					symbolTitle={option.symbolTitle}
					bestLimitPrice={option.bestLimitPrice}
					className={clsx(styles.item, step === 'option' && styles.active)}
				/>
			</ul>
		</div>
	);
};

export default Steps;
