import Collapse from '@/components/common/animation/Collapse';
import { ArrowDownSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setChoiceBrokerModal } from '@/features/slices/modalSlice';
import { toggleSidebar } from '@/features/slices/uiSlice';
import { Link, usePathname } from '@/navigation';
import { comparePathname } from '@/utils/helpers';
import clsx from 'clsx';
import { memo, useMemo } from 'react';
import styles from './Sidebar.module.scss';

interface IListButton {
	items?: TListItem[];
	isExpand?: boolean;
	onClick?: () => void;
}

interface IListAnchor {
	to: string;
}

export type TListItem = (IListButton | IListAnchor) & {
	id: string;
	label: string;
	icon?: JSX.Element;
	disabled?: boolean;
	isBroker?: boolean;
	compare?: (p1: string, p2: string) => boolean;
};

type ItemProps = TListItem & {
	sidebarIsExpand: boolean;
	toggle?: () => void;
};

type ButtonOrAnchorProps = TListItem & {
	isExpand: boolean;
	sidebarIsExpand: boolean;
	toggle?: () => void;
};

const Item = ({ id, label, icon, compare, disabled, sidebarIsExpand, toggle, ...props }: ItemProps) => {
	const pathname = usePathname();

	const isActive = useMemo(() => {
		if (typeof compare === 'function') return compare('to' in props ? props.to : pathname, pathname);

		if ('to' in props) return comparePathname(props.to, pathname);

		if ('isModal' in props) return false;

		return (
			!sidebarIsExpand &&
			Array.isArray(props.items) &&
			props.items.findIndex((item) => 'to' in item && comparePathname(item.to, pathname)) > -1
		);
	}, [pathname, sidebarIsExpand]);

	const isExpand = Boolean('isExpand' in props && props.isExpand);

	return (
		<li className={clsx(isExpand && styles.expand, isActive && styles.active)}>
			<ButtonOrAnchor
				id={id}
				label={label}
				icon={icon}
				disabled={disabled}
				isExpand={isExpand}
				sidebarIsExpand={sidebarIsExpand}
				toggle={toggle}
				{...props}
			/>

			{'items' in props && Array.isArray(props.items) && props.items.length > 0 && (
				<Collapse padding={16} enabled={sidebarIsExpand && isExpand}>
					<ul className={clsx(styles.list, isExpand && styles.expand)}>
						{props.items.map((item, i) => (
							<Item sidebarIsExpand={sidebarIsExpand} key={i} toggle={toggle} {...item} />
						))}
					</ul>
				</Collapse>
			)}
		</li>
	);
};

const ButtonOrAnchor = ({
	id,
	label,
	icon,
	disabled,
	isBroker,
	isExpand,
	sidebarIsExpand,
	toggle,
	...props
}: ButtonOrAnchorProps) => {
	const dispatch = useAppDispatch();

	const brokerUrl = useAppSelector(getBrokerURLs);

	const onMouseEnter = () => {
		if (sidebarIsExpand) return;
		dispatch(toggleSidebar(true));
	};

	const loginFirstBeforeUse = () => {
		dispatch(setChoiceBrokerModal({}));
	};

	const shouldPrevent = Boolean(!brokerUrl && isBroker);

	if ('to' in props) {
		return (
			<Link
				onClick={(e) => {
					if (shouldPrevent) {
						e.preventDefault();
						loginFirstBeforeUse();
					}
				}}
				href={props.to}
				onMouseEnter={onMouseEnter}
			>
				{icon}
				<span>{label}</span>
			</Link>
		);
	}

	return (
		<button
			type='button'
			onMouseEnter={onMouseEnter}
			onClick={(e) => {
				if (shouldPrevent) {
					e.preventDefault();
					loginFirstBeforeUse();
					return;
				}

				if (typeof props?.onClick === 'function') props.onClick();
				else toggle?.();
			}}
		>
			{icon}
			<span>{label}</span>
			{Array.isArray(props.items) && props.items.length > 0 && (
				<ArrowDownSVG style={{ transform: `rotate(${isExpand ? 180 : 0}deg)` }} />
			)}
		</button>
	);
};

export default memo(
	Item,
	(prev, next) =>
		prev.sidebarIsExpand === next.sidebarIsExpand &&
		prev.isBroker === next.isBroker &&
		'isExpand' in prev &&
		'isExpand' in next &&
		prev.isExpand === next.isExpand,
);
