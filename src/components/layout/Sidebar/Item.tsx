import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.scss';

export interface ItemProps {
	label: string;
	to: string;
	icon: JSX.Element;
}

const Item = ({ label, to, icon }: ItemProps) => {
	const router = useRouter();

	return (
		<li className={styles.item}>
			<Link href={to}>
				{icon}
				<span>{label}</span>
			</Link>
		</li>
	);
};

export default Item;
