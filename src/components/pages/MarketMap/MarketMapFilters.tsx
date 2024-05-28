import Select from '@/components/common/Inputs/Select';
import Tooltip from '@/components/common/Tooltip';
import { CameraSVG, LongshotSVG, ReloadSVG } from '@/components/icons';
import { useBrokerQueryClient, useDebounce } from '@/hooks';
import dayjs from '@/libs/dayjs';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { saveSvgAsPng } from 'save-svg-as-png';

interface IMarketMapFiltersProps {
	filters: TMarketMapFilters;
	setFilters: React.Dispatch<React.SetStateAction<TMarketMapFilters>>;
	onReset: () => void;
}

const MarketMapFilters = ({ filters, setFilters }: IMarketMapFiltersProps) => {
	const t = useTranslations();

	const { setDebounce } = useDebounce();

	const queryClient = useBrokerQueryClient();

	const setFieldValue = <T extends keyof TMarketMapFilters>(name: T, value: TMarketMapFilters[T]) => {
		setFilters((filters) => ({
			...filters,
			[name]: value,
		}));
	};

	const goToFullscreen = () => {
		try {
			const treemap = document.getElementById('treemap') as HTMLDivElement;
			treemap.requestFullscreen();
		} catch (e) {
			//
		}
	};

	const takeScreenshot = () => {
		try {
			const eSVG = document.getElementById('heatmap');
			if (!eSVG) return;

			const now = dayjs().calendar('jalali').format('YYYY-MM-DD-HH-mm');
			saveSvgAsPng(eSVG, `${now}-kahkeshan-market-map`);
		} catch (e) {
			//
		}
	};

	const refetch = () => {
		setDebounce(() => {
			queryClient.refetchQueries({ queryKey: ['marketMapQuery'], type: 'active' });
		}, 500);
	};

	const ListOfPercentage = useMemo(
		() => [
			{
				id: '-3',
				label: '-3',
				color: 'rgb(221, 62, 63)',
			},
			{
				id: '-2',
				label: '-2',
				color: 'rgb(173, 67, 74)',
			},
			{
				id: '-1',
				label: '-1',
				color: 'rgb(137, 68, 80)',
			},
			{
				id: '0',
				label: '0',
				color: 'rgb(53, 75, 97)',
			},
			{
				id: '1',
				label: '+1',
				color: 'rgb(33, 110, 111)',
			},
			{
				id: '2',
				label: '+2',
				color: 'rgb(17, 137, 122)',
			},
			{
				id: '3',
				label: '+3',
				color: 'rgb(2, 163, 132)',
			},
		],
		[],
	);

	// const MapTypes = useMemo<Array<TMarketMapFilters['map']>>(() => {
	// 	return [
	// 		{ id: 'all', label: t('market_map.map_type_all') },
	// 		{ id: 'portfolio', label: t('market_map.map_type_portfolio') },
	// 		{ id: 'watchlist', label: t('market_map.map_type_watchlist') },
	// 	];
	// }, []);

	const ListOfMarkets = useMemo<Array<TMarketMapFilters['market']>>(() => {
		return [
			{ id: 'all', label: t('market_map.market_type_all') },
			{ id: 'baseSymbolOption', label: t('market_map.market_type_base_symbol_option') },
			{ id: 'contract', label: t('market_map.market_type_contract') },
			{
				id: 'putOption',
				label: t('market_map.market_type_put_option'),
			},
			{
				id: 'callOption',
				label: t('market_map.market_type_call_option'),
			},
		];
	}, []);

	const ListOfProperties = useMemo<Array<TMarketMapFilters['property']>>(() => {
		return [
			{ id: 'volume', label: t('market_map.volume') },
			{ id: 'value', label: t('market_map.value') },
			{ id: 'quantity', label: t('market_map.quantity') },
		];
	}, []);

	// const SymbolTypes = useMemo<Array<TMarketMapFilters['symbolType']>>(() => {
	// 	return [
	// 		{ id: 'all', label: t('market_map.symbol_type_all') },
	// 		{ id: 'SharesInFarabourse', label: t('market_map.symbol_type_shares') },
	// 		{ id: 'PreemptionRight', label: t('market_map.symbol_type_preemption_right') },
	// 		{ id: 'StockFund', label: t('market_map.symbol_type_stock_fund') },
	// 		{ id: 'FixedFund', label: t('market_map.symbol_type_fixed_fund') },
	// 		{ id: 'MixedFund', label: t('market_map.symbol_type_mixed_fund') },
	// 		{ id: 'RealEstateFund', label: t('market_map.symbol_type_real_estate_fund') },
	// 		{ id: 'VentureFund', label: t('market_map.symbol_type_venture_fund') },
	// 		{ id: 'CommodityExchangeFund', label: t('market_map.symbol_type_commodity_exchange_fund') },
	// 		{ id: 'CommodityDepositCertificate', label: t('market_map.symbol_type_commodity_deposit_certificate') },
	// 		{ id: 'SaffronCertificate', label: t('market_map.symbol_type_saffron_certificate') },
	// 		{ id: 'GoldCoinCertificate', label: t('market_map.symbol_type_gold_coin_certificate') },
	// 	];
	// }, []);

	return (
		<div className=' p-8 '>
			<div className=' flex w-full items-center justify-between  overflow-hidden rounded bg-white p-8'>
				<div className='flex items-center gap-10'>
					<ul className='flex items-center gap-10'>
						{ListOfMarkets.map(({ id, label }) => (
							<li key={id}>
								<button
									style={{ width: '11.2rem' }}
									type='button'
									className={clsx(
										'h-40  rounded !border transition-colors',
										id === filters.market.id
											? 'no-hover font-medium btn-select'
											: 'border-gray-500 text-gray-900 hover:btn-hover',
									)}
								>
									{label}
								</button>
							</li>
						))}
					</ul>

					<div style={{ minWidth: '0.1rem', minHeight: '3rem' }} className='mx-8 bg-gray-400' />

					<Select
						onChange={(option) => setFieldValue('property', option)}
						options={ListOfProperties}
						getOptionId={(option) => option.id}
						getOptionTitle={(option) => <span>{t(option.label)}</span>}
						placeholder={t('market_map.market_based_on')}
						defaultValue={filters.property}
						classes={{ root: 'max-h-40  min-w-96' }}
					/>
				</div>

				<div className='flex items-center gap-24'>
					<ul role='menu' className='flex h-full flex-row-reverse items-center gap-2'>
						{ListOfPercentage.map((item) => (
							<li
								tabIndex={-1}
								role='menuitem'
								key={item.id}
								onClick={() =>
									setFieldValue('percentage', filters.percentage === item.id ? null : item.id)
								}
								className='shrink-0'
							>
								<button
									role='button'
									type='button'
									style={{
										backgroundColor: item.color,
										width: item.id === filters.percentage ? '40px' : '28px',
										height: item.id === filters.percentage ? '32px' : '28px',
									}}
									className='flex items-center justify-center rounded'
									data-testid={`market_map_filter_${item.label}`}
								>
									<span className='text-xs font-medium text-white ltr'>{item.label}%</span>
								</button>
							</li>
						))}
					</ul>

					<ul className='flex h-full items-center gap-16'>
						<Tooltip content={t('market_map.take_screnshot')} placement='bottom'>
							<li className='h-full w-24'>
								<button
									role='button'
									onClick={takeScreenshot}
									type='button'
									className='dark:text-dark-gray-800 hover:text-primary dark:hover:text-dark-primary-100 flex size-full items-center justify-center text-gray-800 transition-colors'
									data-testid='market_map_filters_takeAScreenshot'
								>
									<CameraSVG />
								</button>
							</li>
						</Tooltip>

						<Tooltip content={t('market_map.manual_refetch')} placement='bottom'>
							<li className='h-full w-24'>
								<button
									role='button'
									onClick={refetch}
									type='button'
									className='dark:text-dark-gray-800 hover:text-primary dark:hover:text-dark-primary-100 flex size-full items-center justify-center text-gray-800 transition-colors'
									data-testid='market_map_filters_refresh'
								>
									<ReloadSVG />
								</button>
							</li>
						</Tooltip>

						<Tooltip content={t('market_map.fulscreen')} placement='top'>
							<li className='h-full w-24'>
								<button
									role='button'
									onClick={goToFullscreen}
									type='button'
									className='dark:text-dark-gray-800 hover:text-primary dark:hover:text-dark-primary-100 flex size-full items-center justify-center text-gray-800 transition-colors'
									data-testid='market_map_filter_goToFullScreen'
								>
									<LongshotSVG />
								</button>
							</li>
						</Tooltip>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default MarketMapFilters;
