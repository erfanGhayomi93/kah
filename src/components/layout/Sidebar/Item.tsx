import Tooltip from '@/components/common/Tooltip';
import Collapse from '@/components/common/transition/Collapse';
import { ArrowDownSVG } from '@/components/icons';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Sidebar.module.scss';

interface IListButton {
	defaultExpand?: boolean;
	items: TListItem[];
}

interface IListAnchor {
	to: string;
}

export type TListItem = (IListButton | IListAnchor) & {
	label: string;
	icon: JSX.Element;
	disabled?: boolean;
};

type ItemProps = TListItem & {
	sidebarIsExpand: boolean;
};

const Item = ({ label, icon, disabled, sidebarIsExpand, ...props }: ItemProps) => {
	const [isExpand, setIsExpand] = useState(Boolean('defaultExpand' in props ? props.defaultExpand : false));

	const hasDropdown = 'items' in props && props.items.length > 0;

	return (
		<Tooltip disabled={sidebarIsExpand} placement='left' content={label}>
			<li className={clsx(isExpand && styles.expand)}>
				{'to' in props ? (
					<Link href={props.to}>
						{icon}
						<span>{label}</span>
					</Link>
				) : (
					<button onClick={() => setIsExpand(!isExpand)}>
						{icon}
						<span>{label}</span>
						{hasDropdown && <ArrowDownSVG style={{ transform: `rotate(${isExpand ? 180 : 0}deg)` }} />}
					</button>
				)}

				{hasDropdown && (
					<Collapse enabled={isExpand}>
						<ul className={clsx(styles.list, isExpand && styles.expand)}>
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
