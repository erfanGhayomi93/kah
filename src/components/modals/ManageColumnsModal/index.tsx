import Switch from '@/components/common/Inputs/Switch';
import { RefreshSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setManageColumnsModal } from '@/features/slices/modalSlice';
import { type IManageColumnsModal } from '@/features/slices/types/modalSlice.interfaces';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useMemo, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';

interface ManageColumnsModalProps extends IManageColumnsModal {}

interface ISwitchColumnFieldProps {
	title: string;
	checked: boolean;
	onChange: () => void;
}

interface ICategoryCardProps {
	columnsArray: Array<IManageColumn<string>>;
	onColumnSwitch: (updatedCol: IManageColumn<string>) => void;
	onAllColumnSwitch: (headerState: boolean, tag: TManageColumnTag) => void;
	tag: TManageColumnTag;
}

const Div = styled.div`
	height: 550px;
	display: flex;
	min-width: 650px;
	flex-direction: column;
`;

const ManageColumnsModal = forwardRef<HTMLDivElement, ManageColumnsModalProps>(
	({
		initialColumns,
		title,
		columns: listOfColumns,
		applyChangesAfterClose,
		onReset,
		onColumnChanged: onColumnChangedCallBack,
		...props
	}) => {
		const dispatch = useAppDispatch();

		const [columns, setColumns] = useState(listOfColumns ?? []);

		const dataMapper = useMemo(() => {
			const tags: Partial<Record<TManageColumnTag, Array<IManageColumn<string>>>> = {};

			for (let i = 0; i < columns.length; i++) {
				const column = columns[i];
				if (!column.nonEditable) {
					const tag = column.tag as TManageColumnTag;
					if (!(tag in tags)) tags[tag] = [];
					tags[tag]?.push(column);
				}
			}

			return tags as Record<TManageColumnTag, Array<IManageColumn<string>>>;
		}, [columns]);

		const t = useTranslations();

		const onResetColumns = () => {
			try {
				if (initialColumns) setColumns(initialColumns);
				onReset?.();
			} catch (e) {
				//
			}
		};

		const onColumnChanged = (updatedCol: IManageColumn<string>) => {
			try {
				const newColumns = columns.map((col) => ({
					...col,
					hidden: Boolean(col.id === updatedCol.id ? !col.hidden : col.hidden),
				}));

				setColumns(newColumns);
				onColumnChangedCallBack(newColumns);
			} catch (e) {
				//
			}
		};

		const onAllColumnSwitch = (headerState: boolean, tag: TManageColumnTag) => {
			const newColumns = columns.map((col) => ({
				...col,
				hidden: tag === col.tag && !col.nonEditable ? !headerState : col.hidden,
			}));

			setColumns(newColumns);
			onColumnChangedCallBack(newColumns);
		};

		const onClose = () => {
			dispatch(setManageColumnsModal(null));
		};

		return (
			<Modal top='50%' style={{ modal: { transform: 'translate(-50%, -50%)' } }} onClose={onClose} {...props}>
				<Div className='bg-white'>
					<Header
						label={t('manage_option_watchlist_columns.title')}
						onClose={onClose}
						CustomeNode={
							<button className='icon-hover' onClick={onResetColumns}>
								<RefreshSVG />
							</button>
						}
					/>
					<div className='flex flex-1 gap-16 p-24'>
						{Object.keys(dataMapper).map((tag) => (
							<CategoryCard
								key={tag}
								tag={tag as TManageColumnTag}
								columnsArray={dataMapper[tag as TManageColumnTag]}
								onAllColumnSwitch={onAllColumnSwitch}
								onColumnSwitch={onColumnChanged}
							/>
						))}
					</div>
				</Div>
			</Modal>
		);
	},
);

const ColumnSwitchField = ({ checked, onChange, title }: ISwitchColumnFieldProps) => (
	<>
		<Switch checked={checked} onChange={onChange} />
		<span className={clsx('text-nowrap text-tiny', checked ? 'text-gray-1000' : 'text-gray-900')}>{title}</span>
	</>
);

const CategoryCard = ({ columnsArray, onColumnSwitch, onAllColumnSwitch, tag }: ICategoryCardProps) => {
	const t = useTranslations('manage_column_categories');

	const findHiddenColumn = columnsArray.findIndex((i) => i.hidden);
	const hasHiddenColumn = findHiddenColumn !== -1;

	return (
		<div className='w-full gap-16 rounded p-16 shadow-card flex-column'>
			<div className='gap-8 border-b border-b-gray-400 pb-16 flex-justify-start'>
				<ColumnSwitchField
					checked={!hasHiddenColumn}
					onChange={() => onAllColumnSwitch(hasHiddenColumn, tag)}
					title={t(tag) ?? '-'}
				/>
			</div>
			<div className='grid h-full grid-flow-col grid-rows-9 gap-x-24'>
				{columnsArray.map((item) => (
					<div key={item.id} className='gap-8 flex-justify-start'>
						<ColumnSwitchField
							checked={!item.hidden}
							onChange={() => onColumnSwitch(item)}
							title={item.title ?? '-'}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default ManageColumnsModal;
