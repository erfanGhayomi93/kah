import clsx from 'clsx';
import { Fragment } from 'react';
import styles from '../../CreateStrategyModal.module.scss';
import BaseSymbolStep from './BaseSymbolStep';
import FreezeStep from './FreezeStep';
import OptionStep from './OptionStep';

interface StepsProps {
	steps: CreateStrategy.Input[];
}

const Steps = ({ steps }: StepsProps) => {
	return (
		<div style={{ flex: '0 0 23.6rem', minHeight: '9.6rem' }} className='rounded bg-gray-200 p-16'>
			<ul className={styles.list}>
				{steps.map((item, i) => (
					<Fragment key={i}>
						{item.type === 'base' && (
							<BaseSymbolStep
								className={clsx(
									styles.item,
									item.status === 'DONE' ? styles.done : item.status !== 'PENDING' && styles.active,
								)}
								{...item}
							/>
						)}
						{item.type === 'freeze' && (
							<FreezeStep
								className={clsx(
									styles.item,
									item.status === 'DONE' ? styles.done : item.status !== 'PENDING' && styles.active,
								)}
								{...item}
							/>
						)}
						{item.type === 'option' && (
							<OptionStep
								className={clsx(
									styles.item,
									item.status === 'DONE' ? styles.done : item.status !== 'PENDING' && styles.active,
								)}
								{...item}
							/>
						)}
					</Fragment>
				))}
			</ul>
		</div>
	);
};

export default Steps;
