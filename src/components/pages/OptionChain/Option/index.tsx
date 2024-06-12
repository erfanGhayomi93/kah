import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const OptionInfo = dynamic(() => import('./OptionInfo'), {
	ssr: false,
	loading: () => <div className='h-40 w-full rounded skeleton' />,
});

const OptionTable = dynamic(() => import('./OptionTable'), {
	ssr: false,
	loading: () => <Loading />,
});

interface OptionProps {
	settlementDay: null | Option.BaseSettlementDays;
	baseSymbol: null | Option.BaseSearch;
}

const Option = ({ settlementDay, baseSymbol }: OptionProps) => {
	const t = useTranslations();

	return (
		<div className='relative flex-1 gap-8 rounded flex-column'>
			{settlementDay && baseSymbol ? (
				<>
					<OptionInfo settlementDay={settlementDay} />
					<div className='relative flex-1 overflow-hidden rounded bg-white flex-column'>
						<OptionTable settlementDay={settlementDay} baseSymbol={baseSymbol} />
					</div>
				</>
			) : (
				<div className='flex-1 rounded bg-white'>
					<div style={{ marginTop: '9.6rem' }}>
						<NoData text={t('option_chain.select_symbol_first')} />
					</div>
				</div>
			)}
		</div>
	);
};

export default Option;
