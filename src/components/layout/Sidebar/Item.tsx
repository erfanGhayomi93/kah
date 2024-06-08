import Tooltip from '@/components/common/Tooltip';
import Collapse from '@/components/common/animation/Collapse';
import { ArrowDownSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setChoiceBrokerModal, setLoginModal } from '@/features/slices/modalSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { Link, usePathname } from '@/navigation';
import { cn } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
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
	isModal: boolean;
}

export type TListItem = (IListButton | IListAnchor | IListModal) & {
	id: string;
	label: string;
	icon?: JSX.Element;
	disabled?: boolean;
	isBroker?: boolean;
};

type ItemProps = TListItem & {
	sidebarIsExpand: boolean;
	onClick?: (tagName: TListItem['id']) => void;
	toggle?: () => void;
};

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		brokerIsSelected: getBrokerIsSelected(state),
		brokerURLs: getBrokerURLs(state),
	}),
);
const Item = ({ label, icon, disabled, sidebarIsExpand, toggle, onClick, ...props }: ItemProps) => {
	const pathname = usePathname();

	const dispatch = useAppDispatch();

	const { isLoggedIn, brokerIsSelected } = useAppSelector(getStates);

	const onAuthorizing = () => {
		if (!isLoggedIn) {
			dispatch(setLoginModal({ showForceLoginAlert: true }));
		}

		if (!brokerIsSelected && isLoggedIn) {
			dispatch(setChoiceBrokerModal({}));
		}
	};

	const isActive = useMemo(() => {
		if ('to' in props) return props.to === pathname;

		if ('isModal' in props) return false;

		return !sidebarIsExpand && props.items.findIndex((item) => 'to' in item && item.to === pathname) > -1;
	}, [pathname, sidebarIsExpand]);

	const conditionalsAnchor = () => {
		const isAuthorize = isLoggedIn && brokerIsSelected;

		if (('to' in props && !props.isBroker) || ('to' in props && isAuthorize)) {
			return (
				<Link onClick={() => onClick?.('a')} href={props.to}>
					{icon}
					<span>{label}</span>
				</Link>
			);
		}
		if ('to' in props && props.isBroker) {
			return (
				<button onClick={onAuthorizing}>
					{icon}
					<span>{label}</span>
				</button>
			);
		}

		if ('isModal' in props) {
			return (
				<button type='button' onClick={() => onClick?.(props.id)}>
					{icon}
					<span>{label}</span>
				</button>
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
