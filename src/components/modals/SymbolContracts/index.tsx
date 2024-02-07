import { useBaseSettlementDaysQuery, useWatchlistBySettlementDateQuery } from '@/api/queries/optionQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import AgTable from '@/components/common/Tables/AgTable';
import { useAppDispatch } from '@/features/hooks';
import { toggleSymbolContractsModal, type IContractSelectorModal } from '@/features/slices/modalSlice';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import CellContractTitleRenderer from './CellContractTitleRenderer';
import Filters from './Filters';

interface SymbolContractsProps extends IContractSelectorModal {}

const Div = styled.div`
	width: 88rem;
	height: 80rem;
	display: flex;
	flex-direction: column;
	border-radius: 8px;
	justify-content: space-between;
	gap: 1.6rem;
`;

const SymbolContracts = ({ symbolISIN, symbolTitle }: SymbolContractsProps) => {
	const gridRef = useRef<GridApi<Option.Root>>(null);

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [states, setStates] = useState<SymbolContractModalStates>({
		contractType: {
			id: 'buy',
			title: t('side.buy'),
		},
		contract: null,
		activeSettlement: null,
		term: '',
	});

	const { data: settlementDays } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', symbolISIN],
	});

	const { data: watchlistData, isLoading } = useWatchlistBySettlementDateQuery({
		queryKey: [
			'watchlistBySettlementDateQuery',
			{ baseSymbolISIN: symbolISIN, settlementDate: states.activeSettlement?.contractEndDate ?? '' },
		],
		enabled: Boolean(states.activeSettlement),
	});

	const onCloseModal = () => {
		dispatch(toggleSymbolContractsModal(null));
	};

	const setStatesValue = <T extends keyof SymbolContractModalStates>(
		name: T,
		value: SymbolContractModalStates[T],
	) => {
		setStates((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const dayFormatter = (value: string) => {
		return dayjs(value).calendar('jalali').format('YYYY/MM/DD');
	};

	const addContract = () => {
		if (!states.contract) return;

		const {
			symbolInfo: { symbolISIN, symbolTitle },
		} = states.contract;

		ipcMain.send('saturn_contract_added', [
			{
				symbolISIN,
				symbolTitle,
				activeTab: 'price_information',
			},
		]);

		onCloseModal();
	};

	const COLUMNS: Array<ColDef<Option.Root>> = useMemo(
		() => [
			{
				headerName: 'نماد',
				colId: 'symbolTitle-buy',
				minWidth: 104,
				cellRenderer: CellContractTitleRenderer,
				comparator: (valueA, valueB) => valueA.localeCompare(valueB),
			},

			{
				headerName: 'ارزش',
				colId: 'tradeValue-buy',
				minWidth: 112,
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.tradeValue)),
			},

			{
				headerName: 'وضعیت',
				colId: 'iotm-buy',
				minWidth: 80,
				cellClass: ({ value }) => {
					switch (value.toLowerCase()) {
						case 'itm':
							return 'text-success-100';
						case 'otm':
							return 'text-error-100';
						case 'atm':
							return 'text-secondary-300';
						default:
							return '';
					}
				},
				valueGetter: ({ data }) => data!.optionWatchlistData.iotm,
			},

			{
				headerName: 'بهترین خرید',
				colId: 'bestBuyPrice-buy',
				minWidth: 96,
				cellStyle: {
					backgroundColor: 'rgba(12, 175, 130, 0.12)',
				},
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.bestBuyPrice)),
			},

			{
				headerName: 'بهترین فروش',
				colId: 'bestSellPrice-buy',
				minWidth: 96,
				cellStyle: {
					backgroundColor: 'rgba(254, 57, 87, 0.12)',
				},
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.bestSellPrice)),
			},

			{
				headerName: 'اعمال',
				colId: 'strikePrice',
				minWidth: 96,
				valueGetter: ({ data }) => sepNumbers(String(data!.symbolInfo.strikePrice)),
			},
		],
		[],
	);

	const defaultColDef: ColDef<Option.Root> = useMemo(
		() => ({
			suppressMovable: true,
			sortable: true,
			resizable: false,
			flex: 1,
		}),
		[],
	);

	useEffect(() => {
		try {
			const eGrid = gridRef.current;
			if (!watchlistData || !eGrid) return;

			const { term, contractType } = states;
			let data: Option.Root[] = JSON.parse(JSON.stringify(watchlistData));

			if (contractType.id === 'buy' || contractType.id === 'sell') {
				const type = contractType.id === 'buy' ? 'Call' : 'Put';
				data = data.filter((item) => item.symbolInfo.optionType === type);
			}

			if (term && term.length > 1) data = data.filter((item) => item.symbolInfo.symbolTitle.includes(term));

			eGrid.setGridOption('rowData', data);
		} catch (e) {
			//
		}
	}, [JSON.stringify(watchlistData), states]);

	return (
		<Modal top='7.2rem' onClose={onCloseModal}>
			<Div className='bg-white'>
				<Filters {...states} symbolTitle={symbolTitle} setStatesValue={setStatesValue} />

				<div className='flex flex-1 items-start gap-24 overflow-hidden px-32 pb-8 pt-16'>
					<div style={{ flex: '0 0 18.6rem' }} className='gap-16 overflow-auto flex-column'>
						{settlementDays?.map((item, index) => (
							<button
								type='button'
								key={index}
								onClick={() => setStatesValue('activeSettlement', item)}
								className={clsx(
									'h-48 w-full justify-start rounded border px-16 text-base transition-colors flex-items-center',
									JSON.stringify(item) === JSON.stringify(states.activeSettlement)
										? 'justify-start btn-primary'
										: 'border-gray-500 bg-gray-200 text-gray-1000 hover:bg-primary-100',
								)}
							>
								{t('symbol_contracts_modal.end_date') + ' ' + dayFormatter(item.contractEndDate ?? '')}
							</button>
						))}
					</div>

					<div className='relative h-full flex-1'>
						{isLoading && <Loading />}

						{!states.activeSettlement && (
							<div className='absolute h-full w-full flex-col gap-16 rounded border border-gray-500 text-center flex-justify-center'>
								<Image width='80' height='80' alt='welcome' src='/static/images/no-data.png' />
								<span className='text-base font-medium'>
									{t('symbol_contracts_modal.select_contract_from_list')}
								</span>
							</div>
						)}

						<AgTable
							ref={gridRef}
							onSelectionChanged={({ api }) => {
								const selectedRows = api!.getSelectedRows();
								if (selectedRows && selectedRows.length > 0)
									setStatesValue('contract', selectedRows[0]);
							}}
							rowSelection='single'
							suppressRowClickSelection={false}
							rowClass='cursor-pointer'
							className={clsx('h-full', !watchlistData && 'pointer-events-none opacity-0')}
							rowData={watchlistData ?? []}
							columnDefs={COLUMNS}
							defaultColDef={defaultColDef}
							getRowId={({ data }) => data!.symbolInfo.symbolISIN}
						/>
					</div>
				</div>

				<div className='px-32 pb-24 flex-justify-end'>
					<button
						type='button'
						className='h-40 rounded px-40 btn-primary'
						disabled={states.contract === null}
						onClick={addContract}
					>
						{t('symbol_contracts_modal.add_contract_to_symbol', { symbolTitle })}
					</button>
				</div>
			</Div>
		</Modal>
	);
};

export default SymbolContracts;
