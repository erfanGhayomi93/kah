import { ArrowDownSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleSidebar } from '@/features/slices/uiSlice';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Sidebar.module.scss';

export interface IListItem {
	label: string;
	to?: string;
	icon: JSX.Element;
	disabled?: boolean;
	defaultExpand?: boolean;
	items?: IListItem[];
}

interface ItemProps extends IListItem {}

const Item = ({ label, to, icon, disabled, defaultExpand, items }: ItemProps) => {
	const [isExpand, setIsExpand] = useState(Boolean(defaultExpand));

	const dispatch = useAppDispatch();

	const onClickItem = () => {
		dispatch(toggleSidebar(false));
	};

	return (
		<li>
			{to ? (
				<Link href={to} onClick={onClickItem}>
					{icon}
					<span>{label}</span>
				</Link>
			) : (
				<button onClick={() => setIsExpand(!isExpand)}>
					{icon}
					<span>{label}</span>
					<span className={styles.dropdownIcon}>
						<ArrowDownSVG
							className='transition-transform'
							style={{ transform: `translate(${isExpand ? 180 : 0}deg)` }}
						/>
					</span>
				</button>
			)}

			{isExpand && items && (
				<ul>
					{items.map((item, i) => (
						<li key={i}>
							<Link href={item.to ?? ''} onClick={onClickItem}>
								{item.icon}
								<span>{item.label}</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</li>
	);
};

export default Item;
