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
		<div style={{ flex: '0 0 23.6rem', minHeight: '9.6rem' }} className='bg-light-gray-100 rounded p-16'>
			<ul className={styles.list}>
				<BaseSymbolStep
					symbolTitle={baseSymbol.symbolTitle}
					bestLimitPrice={baseSymbol.bestLimitPrice}
					status={step === 'base' ? 'TODO' : 'DONE'}
					className={clsx(styles.item, step === 'base' ? styles.active : styles.done)}
				/>

				<FreezeStep
					status={step === 'freeze' ? 'TODO' : step === 'option' ? 'DONE' : 'PENDING'}
					className={clsx(styles.item, step === 'freeze' ? styles.active : step === 'option' && styles.done)}
				/>

				<OptionStep
					status={step === 'option' ? 'TODO' : 'PENDING'}
					symbolTitle={option.symbolTitle}
					bestLimitPrice={option.bestLimitPrice}
					className={clsx(styles.item, step === 'option' && styles.active)}
				/>
			</ul>
		</div>
	);
};

export default Steps;
