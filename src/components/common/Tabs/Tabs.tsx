import clsx from 'clsx';
import { Fragment, cloneElement, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './Tabs.module.scss';

export type ITabIem<ID extends string | number, T extends object> = T & {
	id: ID;
	render: React.ReactNode;
};

interface TabsProps<ID extends string | number, T extends object> {
	defaultActiveTab: ID;
	data: Array<ITabIem<ID, T>>;
	classes?: RecordClasses<'list' | 'indicator'>;
	renderTab: (item: ITabIem<ID, T>, activeTab: ID) => React.ReactElement;
	onChange?: (tab: ID) => void;
}

const Tabs = <ID extends string | number, T extends object>({
	defaultActiveTab,
	data,
	classes,
	renderTab,
	onChange,
}: TabsProps<ID, T>) => {
	const rootRef = useRef<HTMLDivElement>(null);

	const indicatorRef = useRef<HTMLDivElement>(null);

	const [activeTab, setActiveTab] = useState(defaultActiveTab);

	const handleIndicatorSize = (el: HTMLElement | null) => {
		const eRoot = rootRef.current;
		const eIndicator = indicatorRef.current;
		if (!eIndicator || !eRoot || !el) return;

		try {
			const width = el.offsetWidth;
			const left = el.offsetLeft;
			const rootWidth = eRoot.offsetWidth;

			eIndicator.style.transform = `translateX(-${rootWidth - left - width}px)`;
			eIndicator.style.width = `${width}px`;
		} catch (e) {
			//
		}
	};

	const render = useMemo(() => data.find((item) => item.id === activeTab)?.render ?? null, [activeTab, data]);

	const onTabChange = useCallback(
		(el: HTMLElement) => {
			handleIndicatorSize(el);
		},
		[indicatorRef.current],
	);

	useLayoutEffect(() => {
		try {
			onChange?.(activeTab);
		} catch (error) {
			//
		}
	}, [activeTab]);

	useLayoutEffect(() => {
		try {
			const eRoot = rootRef.current;
			if (!eRoot) return;

			const eActiveTab = eRoot.querySelector('[data-active="true"]') as HTMLElement | null;
			document.fonts.ready.then(() => handleIndicatorSize(eActiveTab));
		} catch (e) {
			//
		}
	}, [rootRef.current]);

	return (
		<Fragment>
			<div ref={rootRef} className={clsx(styles.list, classes?.list)}>
				{data.map((item) => (
					<Fragment key={item.id}>
						{cloneElement(renderTab(item, activeTab), {
							onClick: () => setActiveTab(item.id),
							ref: activeTab === item.id ? onTabChange : undefined,
							'data-active': activeTab === item.id ? 'true' : 'false',
						})}
					</Fragment>
				))}

				<div ref={indicatorRef} className={clsx(styles.indicator, classes?.indicator)} />
			</div>

			{render}
		</Fragment>
	);
};

export default Tabs;
