import Tooltip from '@/components/common/Tooltip';
import Collapse from '@/components/common/animation/Collapse';
import { ArrowDownSVG } from '@/components/icons';
import { Link, usePathname } from '@/navigation';
import { cn } from '@/utils/helpers';
import { memo, useMemo } from 'react';
import styles from './Sidebar.module.scss';

interface IListButton {
	items: TListItem[];
	isExpand?: boolean;
}

interface IListAnchor {
	to: string;
}

interface IListModal {
	isModal: boolean
}

export type TListItem = (IListButton | IListAnchor | IListModal) & {
	id: string;
	label: string;
	icon?: JSX.Element;
	disabled?: boolean;
};

type ItemProps = TListItem & {
	sidebarIsExpand: boolean;
	onClick?: (tagName: TListItem['id']) => void;
	toggle?: () => void;
};

const Item = ({ label, icon, disabled, sidebarIsExpand, toggle, onClick, ...props }: ItemProps) => {
	const pathname = usePathname();

	const isActive = useMemo(() => {
		if ('to' in props) return props.to === pathname;
		else if ('isModal' in props) return false;

		return !sidebarIsExpand && props.items.findIndex((item) => 'to' in item && item.to === pathname) > -1;
	}, [pathname, sidebarIsExpand]);


	const conditionalsAnchor = () => {
		if ('to' in props) {
			return (
				<Link onClick={() => onClick?.('a')} href={props.to}>
					{icon}
					<span>{label}</span>
				</Link>
			);
		}

		else if ('isModal' in props) {
			return (
				<Link onClick={() => onClick?.(props.id)} href={''}>
					{icon}
					<span>{label}</span>
				</Link>
			);
		}

		return (
			<button
				onClick={() => {
					toggle?.();
					onClick?.('button');
				}}
			>
				{icon}
				<span>{label}</span>
				{hasDropdown && <ArrowDownSVG style={{ transform: `rotate(${isExpand ? 180 : 0}deg)` }} />}
			</button>
		);

	};

	const hasDropdown = 'items' in props && props.items.length > 0;

	const isExpand = Boolean('isExpand' in props && props.isExpand);

	return (
		<Tooltip disabled={sidebarIsExpand} placement='left' content={label} animation={false}>
			<li className={cn(isExpand && styles.expand, isActive && styles.active)}>
				{conditionalsAnchor()}

				{hasDropdown && (
					<Collapse padding={16} enabled={sidebarIsExpand && isExpand}>
						<ul className={cn(styles.list, isExpand && styles.expand)}>
							{props.items.map((item, i) => (
								<Item
									sidebarIsExpand={sidebarIsExpand}
									key={i}
									toggle={toggle}
									onClick={onClick}
									{...item}
								/>
							))}
						</ul>
					</Collapse>
				)}
			</li>
		</Tooltip>
	);
};

export default memo(Item);
