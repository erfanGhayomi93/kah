import Tabs from '@/components/common/Tabs/Tabs';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import SimpleTrade from './SimpleTrade';

interface WrapperProps {
	children: React.ReactNode;
	className?: ClassesValue;
}

const Wrapper = ({ children, className }: WrapperProps) => (
	<div style={{ flex: '0 0 336px' }} className={clsx('gap-24 overflow-hidden px-16 pb-16 flex-column', className)}>
		{children}
	</div>
);

interface BodyProps extends IBsModalInputs {
	symbolType: TBsSymbolTypes;
	setInputValue: TSetBsModalInputs;
}

const Body = (props: BodyProps) => {
	const t = useTranslations();

	const TABS = useMemo(
		() => [
			{
				id: 'normal',
				title: t('bs_modal.normal_trade'),
				render: <SimpleTrade {...props} />,
			},
			{
				id: 'strategy',
				title: t('bs_modal.strategy'),
				render: null,
				disabled: true,
			},
		],
		[JSON.stringify(props)],
	);

	if (props.symbolType === 'base') return <Wrapper className='pt-24'>{TABS[0].render}</Wrapper>;

	return (
		<Wrapper>
			<Tabs
				data={TABS}
				defaultActiveTab='normal'
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'flex-1 pb-8 pt-12 transition-colors',
							item.id === activeTab ? 'font-medium text-gray-900' : 'text-gray-700',
						)}
						type='button'
						disabled={item.disabled}
					>
						{item.title}
					</button>
				)}
			/>
		</Wrapper>
	);
};

export default Body;
