import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import Loading from '@/components/common/Loading';
import Tabs, { type ITabIem } from '@/components/common/Tabs/Tabs';
import { GrowDownSVG, GrowUpSVG, XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useSubscription, useTradingFeatures } from '@/hooks';
import { cn, getColorBasedOnPercent, sepNumbers } from '@/utils/helpers';
import { subscribeSymbolInfo } from '@/utils/subscriptions';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { type ItemUpdate } from 'lightstreamer-client-web';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import SymbolContextMenu from '../../../common/Symbol/SymbolContextMenu';

const PriceInformation = dynamic(() => import('./Tabs/PriceInformation'), {
	ssr: false,
	loading: () => <Loading />,
});

const ComputingInformation = dynamic(() => import('./Tabs/ComputingInformation'), {
	ssr: false,
	loading: () => <Loading />,
});

const ContractMarketDepth = dynamic(() => import('./Tabs/ContractMarketDepth'), {
	ssr: false,
	loading: () => <Loading />,
});

interface WrapperProps {
	children?: React.ReactNode;
}

interface ContractProps {
	baseSymbol: Symbol.Info;
	option: Saturn.ContentOption | null;
	close: () => void;
	addNewContract: () => void;
	onLoadContract: (contract: Symbol.Info) => void;
	onChangeContractTab: (tab: Saturn.OptionTab) => void;
}

const Contract = ({
	baseSymbol,
	option,
	close,
	addNewContract,
	onChangeContractTab,
	onLoadContract,
}: ContractProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const queryClient = useQueryClient();

	const { addBuySellModal } = useTradingFeatures();

	const { subscribe, unsubscribe } = useSubscription();

	const { data: contractInfo, isLoading } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', option === null ? null : option.symbolISIN],
		enabled: option !== null,
	});

	const openSymbolInfoPanel = () => {
		try {
			if (option) dispatch(setSymbolInfoPanel(option.symbolISIN));
		} catch (e) {
			//
		}
	};

	const addBsModal = (side: TBsSides) => {
		if (!contractInfo) return;

		const { symbolISIN, symbolTitle } = contractInfo;

		addBuySellModal({
			side,
			mode: 'create',
			symbolType: 'option',
			symbolISIN,
			symbolTitle,
		});
	};

	const onSymbolUpdate = (updateInfo: ItemUpdate) => {
		try {
			const queryKey = ['symbolInfoQuery', option === null ? null : option.symbolISIN];
			const visualData = JSON.parse(JSON.stringify(queryClient.getQueryData(queryKey))) as Symbol.Info;

			if (!visualData) return;

			updateInfo.forEachChangedField((fieldName, _b, value) => {
				try {
					if (value && fieldName in visualData) {
						const valueAsNumber = Number(value);

						// @ts-expect-error: Lightstream returns the wrong data type
						visualData[fieldName as keyof Symbol.Info] = isNaN(valueAsNumber) ? value : valueAsNumber;
					}
				} catch (e) {
					//
				}
			});

			queryClient.setQueryData(queryKey, visualData);
		} catch (e) {
			//
		}
	};

	const tabs: Array<ITabIem<Saturn.OptionTab, { title: string }>> = useMemo(
		() => [
			{
				id: 'price_information',
				title: t('saturn_page.tab_price_information'),
				render: () => <PriceInformation symbol={contractInfo ?? null} />,
			},
			{
				id: 'computing_information',
				title: t('saturn_page.tab_computing_information'),
				render: () => <ComputingInformation symbol={contractInfo ?? null} />,
			},
			{
				id: 'market_depth',
				title: t('saturn_page.tab_market_depth'),
				render: () => <ContractMarketDepth symbol={contractInfo ?? null} />,
			},
		],
		[contractInfo],
	);

	useEffect(() => {
		if (!option?.symbolISIN) {
			unsubscribe();
			return;
		}

		const sub = subscribeSymbolInfo(option.symbolISIN, 'symbolData');
		sub.addEventListener('onItemUpdate', onSymbolUpdate);

		subscribe(sub);
	}, [option?.symbolISIN]);

	useEffect(() => {
		if (!contractInfo) return;
		onLoadContract(contractInfo);
	}, [contractInfo]);

	if (!option)
		return (
			<Wrapper>
				<div
					onClick={addNewContract}
					className='absolute cursor-pointer items-center gap-24 text-center flex-column center'
				>
					<Image width='60' height='60' alt='add-symbol' src='/static/images/add-button.png' />
					<span className='text-base text-gray-800'>
						{t.rich('saturn_page.click_to_add_contract', {
							add: (chunks) => (
								<button type='button' className='text-primary-100'>
									{chunks}
								</button>
							),
							symbolTitle: baseSymbol.symbolTitle ?? '',
						})}
					</span>
				</div>
			</Wrapper>
		);

	if (isLoading)
		return (
			<Wrapper>
				<Loading />
			</Wrapper>
		);

	const closingPriceVarReferencePrice = contractInfo?.closingPriceVarReferencePrice ?? 0;
	const closingPriceVarReferencePricePercent = contractInfo?.closingPriceVarReferencePricePercent ?? 0;

	return (
		<Wrapper>
			<div className='justify-start pb-8 flex-column'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-1 justify-between gap-16'>
						<div className='cursor-pointer flex-column flex-items-start'>
							<div className='flex items-center gap-8'>
								<SymbolContextMenu symbol={contractInfo ?? null} />
								<h1 onClick={openSymbolInfoPanel} className='text-3xl font-medium text-gray-800'>
									{contractInfo?.symbolTitle ?? '−'}
								</h1>
							</div>
							<h4 className='whitespace-nowrap pr-32 text-tiny text-gray-800'>
								{contractInfo?.companyName ?? '−'}
							</h4>
						</div>

						<div className='h-fit gap-8 text-base flex-items-center'>
							<span
								className={cn(
									'gap-4 ltr flex-items-center',
									getColorBasedOnPercent(closingPriceVarReferencePricePercent),
								)}
							>
								{sepNumbers(String(closingPriceVarReferencePrice))}
								<span className='flex items-center'>
									({(closingPriceVarReferencePricePercent ?? 0).toFixed(2)} %)
									{closingPriceVarReferencePricePercent > 0 && (
										<GrowUpSVG width='1rem' height='1rem' />
									)}
									{closingPriceVarReferencePricePercent < 0 && (
										<GrowDownSVG width='1rem' height='1rem' />
									)}
								</span>
							</span>

							<span className={clsx('flex items-center gap-4 text-2xl font-bold text-gray-800 ltr')}>
								<span className='text-base font-normal text-gray-700'>{t('common.rial')}</span>
								{sepNumbers(String(contractInfo?.lastTradedPrice ?? 0))}
							</span>
						</div>
					</div>

					<div className='flex-1 gap-16 pt-4 flex-justify-end'>
						<div className='gap-8 flex-items-center'>
							<button
								style={{ width: '11rem' }}
								type='button'
								onClick={() => addBsModal('buy')}
								className='size-32 rounded !border text-tiny flex-justify-center btn-success-outline'
							>
								{t('saturn_page.new_position')}
							</button>

							<button
								style={{ width: '11rem' }}
								type='button'
								onClick={() => addBsModal('sell')}
								className='size-32 rounded !border text-tiny flex-justify-center btn-error-outline'
							>
								{t('saturn_page.close_position')}
							</button>
						</div>

						<button onClick={close} type='button' className='size-24 icon-hover'>
							<XSVG width='2rem' height='2rem' />
						</button>
					</div>
				</div>
			</div>

			{contractInfo ? (
				<Tabs
					defaultActiveTab={option.activeTab}
					data={tabs}
					onChange={onChangeContractTab}
					wrapper={({ children }) => <div className='relative flex-1'>{children}</div>}
					renderTab={(item, activeTab) => (
						<button
							className={cn(
								'p-8 transition-colors',
								item.id === activeTab ? 'font-medium text-gray-700' : 'text-gray-500',
							)}
							type='button'
						>
							{item.title}
						</button>
					)}
				/>
			) : (
				<div className='relative flex-1'>
					<span className='absolute font-medium center'>{t('common.an_error_occurred')}</span>
				</div>
			)}
		</Wrapper>
	);
};

const Wrapper = ({ children }: WrapperProps) => (
	<div
		style={{
			flex: '1 0 39.2rem',
		}}
		className='relative gap-16 rounded bg-white px-16 py-12 flex-column darkBlue:bg-gray-50 dark:bg-gray-50'
	>
		{children}
	</div>
);

export default Contract;
