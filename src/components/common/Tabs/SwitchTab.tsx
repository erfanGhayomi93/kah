import { cn } from '@/utils/helpers';
import { Fragment, cloneElement, useCallback, useEffect, useRef, useState } from 'react';
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

	const activeElRef = useRef<HTMLElement | null>(null);

	const [activeTab, setActiveTab] = useState(defaultActiveTab);

	const handleRectPosition = () => {
		const eRoot = rootRef.current;
		const eRect = rectRef.current;
		const eActive = activeElRef.current;
		if (!eActive || !eRoot || !eRect) return;

		try {
			const { left, width } = eActive.getBoundingClientRect();
			const { left: rootLeft, width: rootWidth } = eRoot.getBoundingClientRect();
			const originalLeft = Math.abs(left - rootLeft) + 1;

			eRect.style.transform = `translate(-${Math.abs(rootWidth - originalLeft - width)}px, -50%)`;
			eRect.style.width = `${Math.round(width)}px`;
		} catch (e) {
			//
		}
	};

	const onTabChange = useCallback(
		(el: HTMLElement) => {
			activeElRef.current = el;
			handleRectPosition();
		},
		[JSON.stringify(data), rectRef.current],
	);

	useEffect(() => {
		setActiveTab(defaultActiveTab);
	}, [defaultActiveTab]);

	useEffect(() => {
		try {
			onChangeTab?.(activeTab);
		} catch (e) {
			//
		}
	}, [activeTab]);

	useEffect(() => {
		try {
			const eRoot = rootRef.current;
			if (!eRoot) return;

			document.fonts.ready.then(() => handleRectPosition());
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
						})}
					</Fragment>
				))}
			</div>
		</div>
	);
};

export default SwitchTab;
