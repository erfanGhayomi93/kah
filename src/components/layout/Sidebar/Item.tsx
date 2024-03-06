import Tooltip from '@/components/common/Tooltip';
import Collapse from '@/components/common/transition/Collapse';
import { ArrowDownSVG } from '@/components/icons';
import { Link, usePathname } from '@/navigation';
import { cn } from '@/utils/helpers';
import styles from './Sidebar.module.scss';

interface IListButton {
	items: TListItem[];
	isExpand?: boolean;
}

interface IListAnchor {
	to: string;
}

export type TListItem = (IListButton | IListAnchor) & {
	id: string;
	label: string;
	icon: JSX.Element;
	disabled?: boolean;
};

type ItemProps = TListItem & {
	sidebarIsExpand: boolean;
	toggle?: () => void;
};

const Item = ({ label, icon, disabled, sidebarIsExpand, toggle, ...props }: ItemProps) => {
	const pathname = usePathname();

	const hasDropdown = 'items' in props && props.items.length > 0;

	const isExpand = Boolean('isExpand' in props && props.isExpand);

	const isActive = 'to' in props && props.to === pathname;

	return (
		<Tooltip disabled={sidebarIsExpand} placement='left' content={label}>
			<li className={cn(isExpand && styles.expand, isActive && styles.active)}>
				{'to' in props ? (
					<Link href={props.to}>
						{icon}
						<span>{label}</span>
					</Link>
				) : (
					<button onClick={toggle}>
						{icon}
						<span>{label}</span>
						{hasDropdown && <ArrowDownSVG style={{ transform: `rotate(${isExpand ? 180 : 0}deg)` }} />}
					</button>
				)}

				{hasDropdown && (
					<Collapse enabled={sidebarIsExpand && isExpand}>
						<ul className={cn(styles.list, isExpand && styles.expand)}>
							{props.items.map((item, i) => (
								<Item sidebarIsExpand={sidebarIsExpand} key={i} {...item} />
							))}
						</ul>
					</Collapse>
				)}
			</li>
		</Tooltip>
	);
};

export default Item;
