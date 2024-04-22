import Loading from '@/components/common/Loading';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';

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
					<div style={{ top: '18%' }} className='absolute flex-col gap-8 text-center flex-justify-center'>
						<Image
							width='174'
							height='174'
							quality='100'
							alt='search first'
							src='/static/images/search-file.png'
						/>
						<span className='text-base text-gray-900'>{t('option_chain.select_symbol_first')}</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default Option;
