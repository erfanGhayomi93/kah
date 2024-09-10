import { useDebounce } from '@/hooks';
import { cn } from '@/utils/helpers';
import clsx from 'clsx';
import { Fragment, cloneElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Tabs.module.scss';

export type ITabIem<ID extends string | number, T extends object> = T & {
	id: ID;
	disabled?: boolean;
	render: null | (() => React.ReactElement | JSX.Element);
};

interface TabsProps<ID extends string | number, T extends object> {
	defaultActiveTab: ID;
	data: Array<ITabIem<ID, T>>;
	classes?: RecordClasses<'list' | 'container' | 'indicator'>;
	wrapper?: ({ children }: { children: React.ReactNode }) => React.ReactElement;
	renderTab: (item: ITabIem<ID, T>, activeTab: ID) => React.ReactElement;
	onChange?: (tab: ID) => void;
}

const Tabs = <ID extends string | number, T extends object>({
	defaultActiveTab,
	data,
	classes,
	wrapper,
	renderTab,
	onChange,
}: TabsProps<ID, T>) => {
	const rootRef = useRef<HTMLDivElement>(null);

	const indicatorRef = useRef<HTMLDivElement>(null);

	const activeElRef = useRef<HTMLElement | null>(null);

	const [activeTab, setActiveTab] = useState(defaultActiveTab);

	const { setDebounce } = useDebounce();

	const handleIndicatorSize = () => {
		const eRoot = rootRef.current;
		const eIndicator = indicatorRef.current;
		const eActive = activeElRef.current;
		if (!eIndicator || !eRoot || !eActive) return;

		try {
			const { left, width } = eActive.getBoundingClientRect();
			const { left: rootLeft, width: rootWidth } = eRoot.getBoundingClientRect();
			const originalLeft = Math.abs(left - rootLeft - 1);

			eIndicator.style.transform = `translate(-${Math.abs(rootWidth - originalLeft - width)}px, -50%)`;
			eIndicator.style.width = `${Math.round(width)}px`;
		} catch (e) {
			//
		}
	};

	const onWindowResize = () => {
		setDebounce(() => handleIndicatorSize(), 300);
	};

	const render = useMemo(() => data.find((item) => item.id === activeTab)?.render ?? null, [activeTab, data]);

	const onTabChange = useCallback(
		(el: HTMLElement) => {
			activeElRef.current = el;
			handleIndicatorSize();
		},
		[indicatorRef.current],
	);

	useEffect(() => {
		const controller = new AbortController();

		window.addEventListener('resize', onWindowResize, {
			signal: controller.signal,
		});

		return () => controller.abort();
	}, []);

	useEffect(() => {
		try {
			onChange?.(activeTab);
		} catch (error) {
			//
		}
	}, [activeTab]);

	useEffect(() => {
		try {
			const eRoot = rootRef.current;
			if (!eRoot) return;

			document.fonts.ready.then(() => handleIndicatorSize());
		} catch (e) {
			//
		}
	}, [rootRef.current]);

	return (
		<Fragment>
			<div ref={rootRef} className={clsx(classes?.container)}>
				<div className={clsx(styles.list, classes?.list)}>
					{data.map((item) => (
						<Fragment key={item.id}>
							{cloneElement(renderTab(item, activeTab), {
								onClick: () => {
									if (!item.disabled) setActiveTab(item.id);
								},
								ref: activeTab === item.id ? onTabChange : undefined,
								'data-active': activeTab === item.id ? 'true' : 'false',
							})}
						</Fragment>
					))}

					<div ref={indicatorRef} className={cn(styles.indicator, classes?.indicator)} />
				</div>
			</div>

			{wrapper ? wrapper({ children: render?.() }) : render?.()}
		</Fragment>
	);
};

export default Tabs;
