import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import NoData from './NoData';

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
	className?: string;
}

interface SymbolInfoProps {
	selectedSymbol: null | Option.SymbolSearch;
}

const Wrapper = ({ children, className, style, ...props }: WrapperProps) => (
	<div style={{ flex: 1, ...style }} className={clsx('rounded bg-white', className)} {...props}>
		{children}
	</div>
);

const SymbolInfo = ({ selectedSymbol }: SymbolInfoProps) => {
	const t = useTranslations();

	if (!selectedSymbol)
		return (
			<Wrapper className='flex-justify-center'>
				<NoData text={t('option_chain.select_symbol_from_right_list')} />
			</Wrapper>
		);

	return <Wrapper />;
};

export default SymbolInfo;
