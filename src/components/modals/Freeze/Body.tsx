import Tabs from '@/components/common/Tabs/Tabs';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import FreezeTab from './FreezeTab';
import UnFreezeTab from './UnFreeze';

interface BodyProps {
	onCloseModal: () => void;
	setTabSelected: (id: string) => void;
}

export const Body: FC<BodyProps> = ({ onCloseModal, setTabSelected }) => {
	const t = useTranslations();

	const TABS = useMemo(
		() => [
			{
				id: 'freezeModalTab',
				title: t('freeze_modal.freeze_tab'),
				render: () => <FreezeTab onCloseModal={onCloseModal} />,
			},
			{
				id: 'unFreezeModalTab',
				title: t('freeze_modal.un_freeze_tab'),
				render: () => <UnFreezeTab onCloseModal={onCloseModal} />,
			},
		],
		[],
	);

	return (
		<div className='flex h-full flex-column'>
			<Tabs
				data={TABS}
				defaultActiveTab='freezeModalTab'
				onChange={(id) => setTabSelected(id)}
				classes={{
					container: 'px-24',
				}}
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'h-40 flex-1 px-16 text-center transition-colors flex-justify-center',
							item.id === activeTab ? 'font-medium text-gray-700' : 'text-gray-500',
						)}
						type='button'
					>
						{item.title}
					</button>
				)}
			/>
		</div>
	);
};
