import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const OptionInfo = dynamic(() => import('./OptionInfo'), {
	ssr: false,
	loading: () => <div className='skeleton h-40 w-full rounded' />,
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
		<div className='flex-1 gap-8 rounded flex-column'>
			{settlementDay && baseSymbol ? (
				<>
					<OptionInfo settlementDay={settlementDay} />
					<div className='relative flex-1 overflow-hidden rounded bg-white flex-column'>
						<OptionTable settlementDay={settlementDay} baseSymbol={baseSymbol} />
					</div>
				</>
			) : (
				<div className='flex flex-1 justify-center rounded bg-white'>
					<div style={{ top: '20%' }} className='absolute'>
						<NoData text={t('option_chain.select_symbol_first')} />
					</div>
				</div>
			)}
		</div>
	);
};

export default Option;
