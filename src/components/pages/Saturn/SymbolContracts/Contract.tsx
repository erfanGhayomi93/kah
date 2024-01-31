import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import Loading from '@/components/common/Loading';
import SymbolState from '@/components/common/SymbolState';
import { GrowDownSVG, GrowUpSVG, MoreOptionsSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleSymbolContractsModal } from '@/features/slices/modalSlice';
import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo } from 'react';
import Tab from '../common/Tab';
import ComputingInformation from './Tabs/ComputingInformation';
import PriceInformation from './Tabs/PriceInformation';

interface ContractProps {
	baseSymbol: Symbol.Info;
	symbolISIN: string | null;
	onChange: (symbol: string | null) => void;
}

const Wrapper = ({ children }: { children?: React.ReactNode }) => (
	<div
		style={{ flex: 'calc(50% - 1.2rem)', height: '40rem' }}
		className='relative gap-24 rounded bg-white py-12 pl-16 pr-24 flex-column'
	>
		{children}
	</div>
);

const Contract = ({ baseSymbol, symbolISIN, onChange }: ContractProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { data: contractInfo, isFetching } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', symbolISIN],
		enabled: typeof symbolISIN === 'string',
	});

	const addSymbol = () => {
		dispatch(
			toggleSymbolContractsModal({
				symbolTitle: baseSymbol.symbolTitle,
				symbolISIN: baseSymbol.symbolISIN,
			}),
		);
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
			{ id: 'market_depth', title: t('saturn_page.tab_market_depth'), disabled: true, render: null },
			{ id: 'open_position', title: t('saturn_page.tab_open_position'), disabled: true, render: null },
		],
		[contractInfo],
	);

	if (!symbolISIN)
		return (
			<Wrapper>
				<div
					onClick={addSymbol}
					className='absolute cursor-pointer items-center gap-24 text-center flex-column center'
				>
					<Image width='48' height='48' alt='add-symbol' src='/static/images/add-button.png' />
					<span className='text-gray-1000 text-base'>
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

	if (!contractInfo) return <Wrapper />;

	const { closingPriceVarReferencePrice, symbolTradeState, symbolTitle, closingPrice, lastTradedPrice, companyName } =
		contractInfo;

	return (
		<Wrapper>
			<div className='flex-column'>
				<div style={{ gap: '7.8rem' }} className='flex-justify-between'>
					<div style={{ gap: '1rem' }} className='flex-items-center'>
						<SymbolState state={symbolTradeState} />
						<h1 className='text-gray-1000 text-3xl font-medium'>{symbolTitle}</h1>
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
							<span className='text-gray-900 text-base font-normal'>{t('common.rial')}</span>
						</span>
					</div>

					<div className='gap-8 flex-items-center'>
						<button type='button' className='h-32 w-96 rounded text-tiny btn-error-outline'>
							{t('saturn_page.close_position')}
						</button>

						<button type='button' className='h-32 w-96 rounded text-tiny btn-success-outline'>
							{t('saturn_page.new_position')}
						</button>

						<button type='button' className='text-gray-1000 size-24'>
							<MoreOptionsSVG width='2.4rem' height='2.4rem' />
						</button>
					</div>
				</div>

				<h4 className='text-gray-1000 whitespace-nowrap pr-20 text-tiny'>{companyName}</h4>
			</div>

			<Tab data={tabs} />
		</Wrapper>
	);
};

export default Contract;
