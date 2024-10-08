import { ShieldFillSVG, ShieldOutlineSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setUserProgressBarModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section from '../../common/Section';

interface Item {
	id: string;
	title: string;
	passed: boolean;
}

interface IUserProgressBarProps {
	isModal?: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getUserProgressBar: state.modal.userProgressBar,
	}),
);

const UserProgressBar = ({ isModal = false }: IUserProgressBarProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getUserProgressBar } = useAppSelector(getStates);

	const data: Item[] = useMemo(
		() => [
			{
				id: 'login',
				title: t('home.login_check'),
				passed: true,
			},
			{
				id: 'trade',
				title: t('home.trade_check'),
				passed: true,
			},
			{
				id: 'invite',
				title: t('home.invite_check', { n: 3 }),
				passed: false,
			},
			{
				id: 'use_strategy',
				title: t('home.use_strategy_check'),
				passed: false,
			},
			{
				id: 'create_profile',
				title: t('home.create_profile_check'),
				passed: false,
			},
			{
				id: 'share',
				title: t('home.share_check'),
				passed: false,
			},
		],
		[],
	);

	return (
		<Section
			id='user_progress_bar'
			title={t('home.user_progress_bar')}
			info={''}
			onExpand={() => dispatch(setUserProgressBarModal(getUserProgressBar ? null : {}))}
			closeable={false}
			expandable={false}
		>
			<div className='h-full gap-24 pt-8 flex-column'>
				<div style={{ flex: '0 0 1.6rem' }} className='gap-8 flex-items-center'>
					<span className='text-success-100 text-lg font-medium'>32%</span>
					<div className='bg-gray-100 flex-1 overflow-hidden rounded-oval'>
						<div
							style={{ width: `${Math.min(100, 32)}%` }}
							className='bg-success-100 h-16 transition-width'
						/>
					</div>
				</div>

				<ul
					className={clsx('flex-1 justify-between pr-32 rtl flex-column', {
						'gap-16': isModal,
					})}
				>
					{data.map(({ id, passed, title }) => (
						<li key={id} className={clsx('flex gap-10', passed ? 'text-success-100' : 'text-gray-700')}>
							{passed ? (
								<ShieldFillSVG width='2.4rem' height='2.4rem' />
							) : (
								<ShieldOutlineSVG width='2.4rem' height='2.4rem' />
							)}
							<span className={clsx('text-base', passed ? 'text-gray-800 font-medium' : 'text-gray-700')}>
								{title}
							</span>
						</li>
					))}
				</ul>
			</div>
		</Section>
	);
};

export default UserProgressBar;
