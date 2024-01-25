import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import NoData from './NoData';

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
	className?: string;
}

interface SymbolContractsProps {
	selectedSymbol: null | Option.SymbolSearch;
}

const Wrapper = ({ children, className, style, ...props }: WrapperProps) => (
	<div style={{ flex: '1.8 1 76rem', ...style }} className={clsx('rounded bg-white', className)} {...props}>
		{children}
	</div>
);

const SymbolContracts = ({ selectedSymbol }: SymbolContractsProps) => {
	const t = useTranslations();

	if (!selectedSymbol)
		return (
			<Wrapper className='flex-justify-center'>
				<NoData text={t('option_chain.select_symbol_from_top_list')} />
			</Wrapper>
		);

	return <div style={{ flex: '1.8 1 76rem' }} className='rounded bg-white' />;
};

export default SymbolContracts;
