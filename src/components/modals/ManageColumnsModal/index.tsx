import Switch from '@/components/common/Inputs/Switch';
import { RefreshSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setManageColumnsModal } from '@/features/slices/modalSlice';
import { type IManageColumnsModal } from '@/features/slices/types/modalSlice.interfaces';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';

interface ManageColumnsModalProps extends IManageColumnsModal {}

interface ISwitchColumnFieldProps {
	title: string;
	checked: boolean;
	onChange: (value: boolean) => void;
}

interface ICategoryCardProps {
	columnsArray: unknown[];
	title: string;
	onColumnSwitch: (value: boolean) => void;
	onAllColumnSwitch: (value: boolean) => void;
}

const Div = styled.div`
	height: 540px;
	display: flex;
	min-width: 660px;
	flex-direction: column;
`;

const ManageColumnsModal = ({
	initialColumns,
	title,
	columns: listOfColumns,
	applyChangesAfterClose,
	onReset,
	onColumnChanged: onColumnChangedCallBack,
	...props
}: ManageColumnsModalProps) => {
	const dispatch = useAppDispatch();
	// const [columns, setColumns] = useState(listOfColumns ?? []);

	const t = useTranslations();

	// const onResetColumns = () => {
	// 	try {
	// 		if (initialColumns) setColumns(initialColumns);
	// 		onReset?.();
	// 	} catch (e) {
	// 		//
	// 	}
	// };

	// const onColumnChanged = (updatedCol: IManageColumn<string>) => {
	// 	try {
	// 		const newColumns = columns.map((col) => ({
	// 			...col,
	// 			hidden: Boolean(col.id === updatedCol.id ? !col.hidden : col.hidden),
	// 		}));

	// 		setColumns(newColumns);
	// 		onColumnChangedCallBack(updatedCol, newColumns);
	// 	} catch (e) {
	// 		//
	// 	}
	// };

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
						<button className='icon-hover'>
							<RefreshSVG />
						</button>
					}
				></Header>
				<div className='flex flex-1 gap-16 p-24'>
					<CategoryCard
						columnsArray={[]}
						onAllColumnSwitch={() => {}}
						onColumnSwitch={() => {}}
						title='test'
					/>
				</div>
			</Div>
			{/* <div className='sticky top-0 z-10 h-56 w-full bg-gray-200 px-24 flex-justify-between'>
				<h1 className='text-xl font-medium text-gray-900'>{title}</h1>

				<div className='flex gap-24'>
					{onReset && (
						<button className='icon-hover' type='button' onClick={onResetColumns}>
							<RefreshSVG width='2.4rem' height='2.4rem' />
						</button>
					)}
					<button className='icon-hover' type='button' onClick={close}>
						<XSVG width='2rem' height='2rem' />
					</button>
				</div>
			</div>

			<ul className='flex flex-wrap gap-x-16 gap-y-24 px-24'>
				{columns.map((col) => (
					<li key={col.id}>
						<button
							onClick={() => onColumnChanged(col)}
							type='button'
							style={{ width: '14.4rem' }}
							className={clsx(
								'h-40 rounded transition-colors flex-justify-center',
								col.hidden
									? 'bg-white text-gray-900 shadow-sm hover:shadow-none hover:btn-hover'
									: 'bg-primary-400 text-white hover:bg-primary-300',
							)}
						>
							{col.title}
						</button>
					</li>
				))}
			</ul> */}
		</Modal>
	);
};

const ColumnSwitchField = ({ checked, onChange, title }: ISwitchColumnFieldProps) => (
	<>
		<Switch checked={checked} onChange={onChange} />
		<span className={clsx('text-nowrap text-tiny', checked ? 'text-gray-1000' : 'text-gray-900')}>{title}</span>
	</>
);

const CategoryCard = ({ columnsArray, onColumnSwitch, onAllColumnSwitch, title }: ICategoryCardProps) => {
	return (
		<div className='w-full gap-16 rounded p-16 shadow-card flex-column' style={{ minWidth: 205 }}>
			<div className='gap-8 border-b border-b-gray-400 pb-16 flex-justify-start'>
				<ColumnSwitchField checked onChange={onAllColumnSwitch} title={title} />
			</div>
			<div className='grid h-full grid-flow-col grid-rows-9 gap-x-24'>
				{columnsArray.map((item, index) => (
					<div key={index} className='gap-8 flex-justify-start'>
						<ColumnSwitchField checked onChange={onColumnSwitch} title={''} />
					</div>
				))}
			</div>
		</div>
	);
};

export default ManageColumnsModal;
