import SwitchTab from '@/components/common/Tabs/SwitchTab';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface SimpleTradeProps extends IBsModalInputs {
	setInputValue: TSetBsModalInputs;
}

const SimpleTrade = ({ price, quantity, side, expand, holdAfterOrder, setInputValue }: SimpleTradeProps) => {
	const t = useTranslations();

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	const TABS = useMemo(
		() => [
			{
				id: 'buy',
				title: t('side.buy'),
			},
			{
				id: 'sell',
				title: t('side.sell'),
			},
		],
		[],
	);

	return (
		<form method='get' onSubmit={onSubmit} className='w-full gap-24 flex-column'>
			<SwitchTab
				data={TABS}
				defaultActiveTab='buy'
				classes={{
					root: 'bg-white',
					rect: side === 'buy' ? 'bg-success-100' : 'bg-error-100',
				}}
				onChangeTab={(tabId) => setInputValue('side', tabId as TBsSides)}
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'h-full flex-1 transition-colors',
							item.id === activeTab ? 'font-medium text-white' : 'text-gray-700',
						)}
						type='button'
					>
						{item.title}
					</button>
				)}
			/>

			<div className='flex gap-8'>
				<button
					type='submit'
					className={clsx(
						'h-40 flex-1 rounded text-base font-medium',
						side === 'buy' ? 'btn-success' : 'btn-error',
					)}
				>
					{t(`side.${side}`)}
				</button>

				<button
					type='submit'
					className='h-40 rounded border border-secondary-300 bg-white px-16 text-base text-secondary-300'
				>
					{t('bs_modal.draft')}
				</button>
			</div>
		</form>
	);
};

export default SimpleTrade;
