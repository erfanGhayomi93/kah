import Switch from '@/components/common/Inputs/Switch';
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
	disabled?: boolean;
	title: string;
	checked: boolean;
	onChange: () => void;
}

interface ICategoryCardProps {
	tag: string;
	columns: IManageColumn[];
	onColumnSwitch: (updatedCol: IManageColumn) => void;
	onAllColumnSwitch: (headerState: boolean, tag: string) => void;
}

const Wrapper = styled.form`
	display: flex;
	min-width: 400px;
	flex-direction: column;
`;

const ManageColumnsModal = forwardRef<HTMLDivElement, ManageColumnsModalProps>(
	(
		{
			initialColumns,
			title,
			stream = true,
			columns: listOfColumns,
			onCategoryChanged,
			onColumnChanged,
			onColumnsChanged,
			onReset,
			...props
		},
		ref,
	) => {
		const t = useTranslations();

		const dispatch = useAppDispatch();

		const [columns, setColumns] = useState(listOfColumns ?? []);

		const dataMapper = useMemo(() => {
			const tags: Record<string, IManageColumn[]> = {};

			for (let i = 0; i < columns.length; i++) {
				const column = columns[i];
				const tag = column.tag ?? 'NULL';

				if (column.disabled) continue;

				if (!(tag in tags)) tags[tag] = [];
				tags[tag]?.push(column);
			}

			return tags;
		}, [columns]);

		const onResetColumns = () => {
			try {
				if (initialColumns) setColumns(initialColumns);
				onReset?.();
			} catch (e) {
				//
			}
		};

		const onChangeColumn = (updatedCol: IManageColumn) => {
			try {
				const newColumns = columns.map((col) => ({
					...col,
					hidden: Boolean(col.id === updatedCol.id ? !col.hidden : col.hidden),
				}));

				setColumns(newColumns);

				onColumnChanged?.({ ...updatedCol, hidden: !updatedCol.hidden });
				if (stream) onColumnsChanged?.(newColumns);
			} catch (e) {
				//
			}
		};

		const onAllColumnSwitch = (show: boolean, tag: string) => {
			try {
				const categoryColumns: IManageColumn[] = [];
				const newColumns = columns.map((col) => {
					if (col.disabled || tag !== col.tag) return col;

					const newCol = { ...col, hidden: !show };
					categoryColumns.push(newCol);

					return newCol;
				});

				setColumns(newColumns);

				onCategoryChanged?.(categoryColumns);
				if (stream) onColumnsChanged?.(newColumns);
			} catch (e) {
				//
			}
		};

		const onClose = () => {
			dispatch(setManageColumnsModal(null));
		};

		const onSubmit = (e: React.FormEvent) => {
			try {
				e.preventDefault();

				onColumnsChanged?.(columns);
				onClose();
			} catch (e) {
				//
			}
		};

		return (
			<Modal
				top='50%'
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				onClose={onClose}
				ref={ref}
				{...props}
			>
				<Wrapper onSubmit={onSubmit} className='gap-24 bg-white pb-24 darkness:bg-gray-50'>
					<Header
						label={t('manage_option_watchlist_columns.title')}
						onClose={onClose}
						onReset={onResetColumns}
					/>

					<div className='flex flex-1 gap-16 px-24'>
						{Object.keys(dataMapper).map((tag) => (
							<CategoryCard
								key={tag}
								tag={tag}
								columns={dataMapper[tag]}
								onAllColumnSwitch={onAllColumnSwitch}
								onColumnSwitch={onChangeColumn}
							/>
						))}
					</div>

					{!stream && (
						<div className='w-full px-24'>
							<button type='submit' className='h-40 w-full rounded btn-primary'>
								{t('common.confirm')}
							</button>
						</div>
					)}
				</Wrapper>
			</Modal>
		);
	},
);

const CategoryCard = ({ columns, tag, onColumnSwitch, onAllColumnSwitch }: ICategoryCardProps) => {
	const t = useTranslations('manage_column_categories');

	const hasHiddenColumn = columns.findIndex((i) => i.hidden) !== -1;
	const hasTag = tag !== 'NULL';

	return (
		<div className={clsx('flex-1 rounded px-16 shadow-sm flex-column', hasTag ? 'gap-16 pb-16' : 'py-8')}>
			{hasTag && (
				<div className='gap-8 border-b border-b-gray-200 py-6 flex-justify-start'>
					<ColumnSwitchField
						checked={!hasHiddenColumn}
						onChange={() => onAllColumnSwitch(hasHiddenColumn, tag)}
						title={t(tag) ?? '-'}
					/>
				</div>
			)}

			<div className='grid flex-1 grid-flow-col grid-rows-9 gap-x-24'>
				{columns.map((item) => (
					<ColumnSwitchField
						key={item.id}
						checked={!item.hidden}
						onChange={() => onColumnSwitch(item)}
						title={item.title ?? '-'}
						disabled={item.disabled ?? false}
					/>
				))}
			</div>
		</div>
	);
};

const ColumnSwitchField = ({ checked, title, disabled, onChange }: ISwitchColumnFieldProps) => (
	<div className='h-40 gap-8 flex-justify-start'>
		<Switch disabled={disabled} checked={checked} onChange={onChange} />
		<span className={clsx('text-nowrap text-tiny', checked ? 'text-gray-800' : 'text-gray-700')}>{title}</span>
	</div>
);

export default ManageColumnsModal;
