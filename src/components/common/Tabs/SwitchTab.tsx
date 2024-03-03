import { cn } from '@/utils/helpers';
import { Fragment, cloneElement, useCallback, useLayoutEffect, useRef, useState } from 'react';
import styles from './SwitchTab.module.scss';

export type ITabIem<T extends object> = T & {
	id: string;
};

interface SwitchTabProps<T extends object> {
	defaultActiveTab: string;
	data: Array<ITabIem<T>>;
	classes?: RecordClasses<'root' | 'rect' | 'tabs'>;
	onChangeTab?: (tabId: string) => void;
	renderTab: (item: ITabIem<T>, activeTab: string) => React.ReactElement;
}

const SwitchTab = <T extends object>({
	defaultActiveTab,
	data,
	classes,
	onChangeTab,
	renderTab,
}: SwitchTabProps<T>) => {
	const rootRef = useRef<HTMLDivElement>(null);

	const rectRef = useRef<HTMLDivElement>(null);

	const [activeTab, setActiveTab] = useState(defaultActiveTab);

	const handleRectPosition = (el: HTMLElement | null) => {
		const eRoot = rootRef.current;
		const eRect = rectRef.current;
		if (!el || !eRoot || !eRect) return;

		try {
			const width = el.offsetWidth;
			const left = el.offsetLeft;
			const rootWidth = eRoot.offsetWidth;

			eRect.style.transform = `translateX(-${rootWidth - left - width - 2}px)`;
			eRect.style.width = `${width}px`;
		} catch (e) {
			//
		}
	};

	const onTabChange = useCallback(
		(el: HTMLElement) => {
			handleRectPosition(el);
		},
		[rectRef.current],
	);

	useLayoutEffect(() => {
		try {
			onChangeTab?.(activeTab);
		} catch (e) {
			//
		}
	}, [activeTab]);

	useLayoutEffect(() => {
		try {
			const eRoot = rootRef.current;
			if (!eRoot) return;

			const eActiveTab = eRoot.querySelector('[data-active="true"]') as HTMLElement | null;
			document.fonts.ready.then(() => handleRectPosition(eActiveTab));
		} catch (e) {
			//
		}
	}, [rootRef.current]);

	return (
		<div ref={rootRef} className={cn(styles.root, classes?.root)}>
			<div ref={rectRef} className={cn(styles.rect, classes?.rect)} />

			<div className={cn(styles.tabs, classes?.tabs)}>
				{data.map((item) => (
					<Fragment key={item.id}>
						{cloneElement(renderTab(item, activeTab), {
							onClick: () => setActiveTab(item.id),
							ref: activeTab === item.id ? onTabChange : undefined,
							'data-active': activeTab === item.id ? 'true' : 'false',
						})}
					</Fragment>
				))}
			</div>
		</div>
	);
};

export default SwitchTab;
