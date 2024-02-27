import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import Loading from '@/components/common/Loading';
import Tabs from '@/components/common/Tabs/Tabs';
import { GrowDownSVG, GrowUpSVG, MoreOptionsSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleSymbolContractsModal } from '@/features/slices/modalSlice';
import { useTradingFeatures } from '@/hooks';
import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useLayoutEffect, useMemo } from 'react';
import ComputingInformation from './Tabs/ComputingInformation';
import ContractMarketDepth from './Tabs/ContractMarketDepth';
import PriceInformation from './Tabs/PriceInformation';

interface ContractProps {
	baseSymbol: Symbol.Info;
	option: Saturn.ContentOption | null;
	onLoadContract: (contract: Symbol.Info) => void;
	onChangeContractTab: (tab: Saturn.OptionTab) => void;
}

const Wrapper = ({ children }: { children?: React.ReactNode }) => (
	<div
		style={{ flex: 'calc(50% - 1.2rem)', height: '40rem' }}
		className='relative gap-24 rounded bg-white py-12 pl-16 pr-24 flex-column'
	>
		{children}
	</div>
);

const Contract = ({ baseSymbol, option, onChangeContractTab, onLoadContract }: ContractProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { addBuySellModal } = useTradingFeatures();

	const { data: contractInfo, isFetching } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', option === null ? null : option.symbolISIN],
		enabled: option !== null,
	});

	const addSymbol = () => {
		dispatch(
			toggleSymbolContractsModal({
				symbolTitle: baseSymbol.symbolTitle,
				symbolISIN: baseSymbol.symbolISIN,
			}),
		);
	};

	const addBsModal = (side: TBsSides) => {
		if (!contractInfo) return;

		const { symbolISIN, symbolTitle } = contractInfo;

		addBuySellModal({
			side,
			symbolType: 'option',
			symbolISIN,
			symbolTitle,
		});
	};

	const tabs = useMemo(
		() => [
			{
				id: 'price_information',
				title: t('saturn_page.tab_price_information'),
				render: <PriceInformation symbol={contractInfo ?? null} />,
			},
			{
				id: 'computing_information',
				title: t('saturn_page.tab_computing_information'),
				render: <ComputingInformation symbol={contractInfo ?? null} />,
			},
			{
				id: 'market_depth',
				title: t('saturn_page.tab_market_depth'),
				render: <ContractMarketDepth symbol={contractInfo ?? null} />,
			},
			{ id: 'open_position', title: t('saturn_page.tab_open_position'), disabled: true, render: null },
		],
		[contractInfo],
	);

	useLayoutEffect(() => {
		if (!contractInfo) return;
		onLoadContract(contractInfo);
	}, [contractInfo]);

	if (!option)
		return (
			<Wrapper>
				<div
					onClick={addSymbol}
					className='absolute cursor-pointer items-center gap-24 text-center flex-column center'
				>
					<Image width='48' height='48' alt='add-symbol' src='/static/images/add-button.png' />
					<span className='text-base text-gray-1000'>
						{t.rich('saturn_page.click_to_add_contract', {
							add: (chunks) => (
								<button type='button' className='text-primary-400'>
									{chunks}
								</button>
							),
							symbolTitle: baseSymbol.symbolTitle ?? '',
						})}
					</span>
				</div>
			</Wrapper>
		);

	if (isFetching)
		return (
			<Wrapper>
				<Loading />
			</Wrapper>
		);

	if (!contractInfo)
		return (
			<Wrapper>
				<span className='absolute center'>{t('common.an_error_occurred')}</span>
			</Wrapper>
		);

	const { closingPriceVarReferencePrice, symbolTitle, closingPrice, lastTradedPrice, companyName } = contractInfo;

	return (
		<Wrapper>
			<div className='flex-column'>
				<div style={{ gap: '7.8rem' }} className='flex-justify-between'>
					<div className='flex-items-start gap-4 flex-column'>
						<h1 className='text-3xl font-medium text-gray-1000'>{symbolTitle}</h1>
						<h4 className='whitespace-nowrap text-tiny text-gray-1000'>{companyName}</h4>
					</div>

					<div className='gap-8 flex-items-center'>
						<span
							className={clsx(
								'gap-4 flex-items-center',
								closingPriceVarReferencePrice >= 0 ? 'text-success-100' : 'text-error-100',
							)}
						>
							<span className='flex items-center text-tiny ltr'>
								({(closingPriceVarReferencePrice ?? 0).toFixed(2)} %)
								{closingPriceVarReferencePrice >= 0 ? (
									<GrowUpSVG width='1rem' height='1rem' />
								) : (
									<GrowDownSVG width='1rem' height='1rem' />
								)}
							</span>
							{sepNumbers(String(closingPrice))}
						</span>

						<span
							className={clsx(
								'flex items-center gap-4 text-4xl font-bold',
								closingPriceVarReferencePrice >= 0 ? 'text-success-200' : 'text-error-200',
							)}
						>
							{sepNumbers(String(lastTradedPrice || 1))}
							<span className='text-base font-normal text-gray-900'>{t('common.rial')}</span>
						</span>
					</div>

					<div className='gap-8 flex-items-center'>
						<button
							onClick={() => addBsModal('buy')}
							type='button'
							className='h-32 w-96 rounded text-tiny btn-success-outline'
						>
							{t('saturn_page.new_position')}
						</button>
						<button
							onClick={() => addBsModal('sell')}
							type='button'
							className='h-32 w-96 rounded text-tiny btn-error-outline'
						>
							{t('saturn_page.close_position')}
						</button>

						<button type='button' className='size-24 text-gray-1000'>
							<MoreOptionsSVG width='2.4rem' height='2.4rem' />
						</button>
					</div>
				</div>
			</div>

			<Tabs
				defaultActiveTab={option.activeTab}
				data={tabs}
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'px-8 py-12 transition-colors',
							item.id === activeTab ? 'font-medium text-gray-900' : 'text-gray-700',
						)}
						type='button'
					>
						{item.title}
					</button>
				)}
			/>
		</Wrapper>
	);
};

export default Contract;
