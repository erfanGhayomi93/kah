import Main from '@/components/layout/Main';
import { Link } from '@/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React from 'react';

interface StrategyLayoutProps {
	children: React.ReactNode;
	isBuilding?: boolean;
	headerRenderer?: React.ReactNode;
}

const StrategyLayout = ({ children, isBuilding = false, headerRenderer }: StrategyLayoutProps) => {
	const t = useTranslations('strategies');

	return (
		<Main className='gap-8 !px-8'>
			<div
				style={{ flex: '0 0 5.6rem' }}
				className='flex-1 gap-24 overflow-hidden rounded bg-white px-16 flex-justify-start'
			>
				<ul className='flex gap-8'>
					<li>
						<Link
							style={{ width: '14rem' }}
							className={clsx(
								'h-40 rounded !border transition-colors flex-justify-center',
								!isBuilding
									? 'no-hover font-medium btn-select'
									: 'border-light-gray-100 bg-light-gray-100 text-light-gray-700',
							)}
							href='/strategy'
						>
							{t('prepared_strategy')}
						</Link>
					</li>
					<li>
						<Link
							style={{ width: '14rem' }}
							className={clsx(
								'h-40 rounded !border transition-colors flex-justify-center',
								isBuilding
									? 'no-hover font-medium btn-select'
									: 'border-light-gray-100 bg-light-gray-100 text-light-gray-700',
							)}
							href='/strategy/build'
						>
							{t('build_strategy')}
						</Link>
					</li>
				</ul>

				{headerRenderer && (
					<>
						<span className='bg-light-gray-200 h-12 w-2' />
						{headerRenderer}
					</>
				)}
			</div>

			{children}
		</Main>
	);
};

export default StrategyLayout;
