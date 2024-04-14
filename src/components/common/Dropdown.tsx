'use client';

import { cn } from '@/utils/helpers';
import { cloneElement, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Dropdown.module.scss';

export interface IDropdownItem {
	id: string | number;
	title: string;
	underline?: boolean;
	active?: boolean;
	icon?: React.ReactElement;
	action?: () => void;
}

interface IDropdownCustomContainer {
	containerRenderer: (close: () => void) => React.ReactNode;
}

interface IDropdownCustomItem<T> {
	data: T[];
	itemRenderer: (item: T, close: () => void) => React.ReactElement;
}

interface IDropdownDefaultItem {
	items: IDropdownItem[];
}

type TDropdownConditionalProps<T> = IDropdownDefaultItem | IDropdownCustomItem<T> | IDropdownCustomContainer;

export type TDropdownProps<T> = TDropdownConditionalProps<T> & {
	portal?: boolean;
	disabled?: boolean;
	coverTrigger?: boolean;
	destroyPopupOnHide?: boolean;
	defaultDropdownWidth?: number;
	dropdownRender?: React.ReactNode;
	zIndexPopup?: number;
	direction?: 'ltr' | 'rtl';
	trigger?: 'click' | 'hover' | 'contextMenu';
	classes?: RecordClasses<'root' | 'list' | 'item' | 'active' | 'underline'>;
	children: React.ReactElement;
	onPopupVisibilityChanged?: (visible?: boolean) => void;
};

const Dropdown = <T extends unknown>({
	portal,
	disabled,
	coverTrigger,
	destroyPopupOnHide,
	defaultDropdownWidth,
	dropdownRender,
	zIndexPopup,
	direction,
	trigger,
	classes,
	children,
	onPopupVisibilityChanged,
	...props
}: TDropdownProps<T>) => {
	const childRef = useRef<HTMLElement | null>(null);

	const dropdownRef = useRef<HTMLDivElement | null>(null);

	const controller = useRef<AbortController | null>(null);

	const [visible, setVisible] = useState(false);

	const onClickChild = () => {
		setVisible((prevState) => !prevState);
	};

	const onWindowClick = (e: MouseEvent, abort: () => void) => {
		try {
			const eDropdown = dropdownRef.current;
			const eChild = childRef.current;
			if (!eDropdown || !eChild) return;

			const target = e.target as HTMLElement;
			if (eChild.contains(target) || eDropdown.contains(target)) return;

			setVisible(false);
			abort();
		} catch (e) {
			//
		}
	};

	const onItemClick = (callback?: () => void) => {
		try {
			setVisible(false);
			callback?.();
		} catch (e) {
			//
		}
	};

	const onCloseDropdown = () => {
		setVisible(false);
	};

	const items = () => {
		if ('items' in props) {
			return props.items.map((item) => (
				<li
					key={item.id}
					onClick={() => onItemClick(item.action)}
					className={cn(
						styles.item,
						classes?.item,
						item.underline && [styles.underline, classes?.underline],
						item.active && [styles.active, classes?.active],
					)}
				>
					{item.icon}
					<span>{item.title}</span>
				</li>
			));
		}

		if ('containerRenderer' in props) {
			return props.containerRenderer(onCloseDropdown);
		}

		return props.data.map((item, index) => (
			<li key={index} className={cn(styles.item, classes?.item)}>
				{props.itemRenderer(item, onCloseDropdown)}
			</li>
		));
	};

	const abort = () => {
		if (controller.current) controller.current.abort();
	};

	const onChildMount = useCallback((element: HTMLElement | null) => {
		if (!element) return;

		childRef.current = element;
		element.addEventListener('click', onClickChild);
	}, []);

	useEffect(() => {
		const eChild = childRef.current;
		const eDropdown = dropdownRef.current;
		if (!visible || !eChild || !eDropdown) return;

		try {
			const dropdownOffset = eDropdown.getBoundingClientRect();
			const dropdownWidth = defaultDropdownWidth ?? dropdownOffset.width;
			const dropdownHeight = dropdownOffset.height;
			const { left, top, height, width } = eChild.getBoundingClientRect();

			const offsetTop = top + height + 1;
			const offsetLeft = left + width - dropdownWidth;
			const { innerHeight, innerWidth } = window;

			eDropdown.style.transform = `translate(${Math.max(Math.min(innerWidth - dropdownWidth, offsetLeft), 0)}px,${Math.max(
				Math.min(offsetTop + dropdownHeight, innerHeight - dropdownHeight - 1),
				0,
			)}px)`;
			eDropdown.style.maxHeight = `${Math.max(window.innerHeight - offsetTop - 72, 200)}px`;
			if (defaultDropdownWidth) eDropdown.style.width = `${defaultDropdownWidth}px`;

			controller.current = new AbortController();
			window.addEventListener('click', (e) => onWindowClick(e, abort), {
				signal: controller.current.signal,
			});
		} catch (e) {
			//
		}
	}, [visible]);

	useEffect(
		() => () => {
			abort();
		},
		[],
	);

	return [
		cloneElement(children, {
			ref: onChildMount,
		}),
		visible &&
			createPortal(
				<div ref={dropdownRef} className={cn(styles.root, classes?.root)}>
					<ul className={cn(styles.list, classes?.list)}>{items()}</ul>
				</div>,
				document.body,
			),
	];
};

export default Dropdown;
