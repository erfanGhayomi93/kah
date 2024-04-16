import ipcMain from '@/classes/IpcMain';
import NoData from '@/components/common/NoData';
import SwitchTab from '@/components/common/Tabs/SwitchTab';
import { ExpandSVG, XCircleSVG } from '@/components/icons';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

export interface ITab<T> {
	id: T;
	title: string;
}

interface SectionProps<T, B> {
	id: TDashboardSections;
	title: string;
	expandable?: boolean;
	defaultTopActiveTab?: T;
	defaultBottomActiveTab?: B;
	children?: React.ReactNode;
	tabs?: Partial<{
		top: Array<ITab<T>> | React.ReactNode;
		bottom: Array<ITab<B>> | React.ReactNode;
	}>;
	onExpand?: () => void;
	onTopTabChange?: (v: T) => void;
	onBottomTabChange?: (v: B) => void;
}

const Section = <T extends string = string, B extends string = string>({
	id,
	title,
	tabs,
	children,
	defaultTopActiveTab,
	defaultBottomActiveTab,
	expandable,
	onExpand,
	onTopTabChange,
	onBottomTabChange,
}: SectionProps<T, B>) => {
	const rootRef = useRef<HTMLDivElement>(null);

	const observer = useRef<IntersectionObserver | null>(null);

	const [isRendered, setIsRendered] = useState(false);

	const disconnect = () => {
		if (observer.current) {
			observer.current.disconnect();
			observer.current = null;
		}
	};

	const onClose = () => {
		ipcMain.send('home.hide_section', { id, hidden: true });
	};

	const onVisibilityChange = (entries: IntersectionObserverEntry[]) => {
		const firstEntry = entries[0];
		if (!firstEntry || !firstEntry.isIntersecting) return;

		setIsRendered(true);
		disconnect();
	};

	useEffect(() => {
		const eRoot = rootRef.current;
		if (!eRoot) return;

		observer.current = new IntersectionObserver(onVisibilityChange, {
			threshold: 0.2,
		});
		observer.current.observe(eRoot);

		return () => disconnect();
	}, [rootRef.current]);

	return (
		<div
			ref={rootRef}
			className='size-full justify-between overflow-hidden rounded bg-white px-16 pb-16 pt-8 flex-column'
		>
			<div style={{ flex: '0 0 4rem' }} className='flex-justify-between'>
				<div className='flex h-full gap-8'>
					<div className='h-full gap-8 rounded bg-gray-200 px-8 flex-items-center'>
						<button
							onClick={onClose}
							type='button'
							className='text-gray-700 transition-colors flex-justify-center hover:text-error-100'
						>
							<XCircleSVG width='1.8rem' height='1.8rem' />
						</button>

						{expandable && (
							<button
								onClick={onExpand}
								type='button'
								className='size-18 rounded-circle bg-gray-700 text-white transition-colors flex-justify-center hover:bg-success-100'
							>
								<ExpandSVG width='1.4rem' height='1.4rem' />
							</button>
						)}
					</div>

					{Array.isArray(tabs?.top) ? (
						<SwitchTab<ITab<T>>
							data={tabs.top}
							defaultActiveTab={defaultTopActiveTab ?? tabs.top[0].id}
							classes={{
								root: '!h-40 bg-gray-200 rtl !border-0 py-4 px-8',
								rect: 'bg-white !h-32 rounded',
								tabs: 'gap-8',
							}}
							onChangeTab={(v) => onTopTabChange?.(v as T)}
							renderTab={(item, activeTab) => (
								<button
									type='button'
									className={clsx(
										'h-full flex-1 px-8 py-4 transition-colors',
										item.id === activeTab ? 'font-medium text-gray-1000' : 'text-gray-700',
									)}
								>
									{item.title}
								</button>
							)}
						/>
					) : (
						tabs?.top
					)}
				</div>

				<h1 className='text-lg font-medium text-gray-900'>{title}</h1>
			</div>

			{isRendered && (children ?? <NoData />)}

			{Array.isArray(tabs?.bottom) ? (
				<div style={{ flex: '0 0 4.8rem' }}>
					<SwitchTab<ITab<B>>
						data={tabs.bottom}
						defaultActiveTab={defaultBottomActiveTab ?? tabs.bottom[0].id}
						classes={{
							root: '!h-48 bg-gray-200 rtl !border-0 p-4',
							rect: 'bg-primary-100 no-hover !h-40',
							tabs: 'gap-8',
						}}
						onChangeTab={(v) => onBottomTabChange?.(v as B)}
						renderTab={(item, activeTab) => (
							<button
								type='button'
								className={clsx(
									'h-full flex-1 rounded transition-colors',
									item.id === activeTab ? 'font-medium text-primary-400' : 'text-gray-700',
								)}
							>
								{item.title}
							</button>
						)}
					/>
				</div>
			) : (
				tabs?.bottom
			)}
		</div>
	);
};

export default Section;
