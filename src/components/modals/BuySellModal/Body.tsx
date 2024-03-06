import { useGetBrokerUrlQuery } from '@/api/queries/brokerQueries';
import Tabs from '@/components/common/Tabs/Tabs';
import { useAppDispatch } from '@/features/hooks';
import { toggleChooseBrokerModal, toggleLoginModal } from '@/features/slices/modalSlice';
import { setBrokerIsSelected } from '@/features/slices/userSlice';
import { getBrokerClientId, getClientId } from '@/utils/cookie';
import { cn, createOrder, dateConverter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import SimpleTrade from './SimpleTrade';

interface WrapperProps {
	children: React.ReactNode;
	className?: ClassesValue;
}

const Wrapper = ({ children, className }: WrapperProps) => (
	<div style={{ flex: '0 0 336px' }} className={cn('gap-24 overflow-hidden px-16 pb-16 flex-column', className)}>
		{children}
	</div>
);

interface BodyProps extends IBsModalInputs {
	symbolISIN: string;
	symbolType: TBsSymbolTypes;
	close: () => void;
	setInputValue: TSetBsModalInputs;
}

const Body = (props: BodyProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { data: brokerUrls } = useGetBrokerUrlQuery({
		queryKey: ['getBrokerUrlQuery'],
	});

	const validation = (cb: () => void) => () => {
		try {
			const clientId = getClientId();
			if (!clientId) {
				dispatch(toggleLoginModal({}));
				throw new Error('login_to_your_account');
			}

			const bClientId = getBrokerClientId();
			if (!bClientId) {
				dispatch(setBrokerIsSelected(false));
				dispatch(toggleChooseBrokerModal({}));
				throw new Error('broker_error');
			}

			if (!brokerUrls) throw new Error('broker_error');

			const { price, quantity, validityDate, collateral, symbolType } = props;

			if (!price) throw new Error('invalid_price');

			if (!quantity) throw new Error('invalid_quantity');

			if (symbolType === 'base' && !validityDate) throw new Error('invalid_validity_date');

			if (symbolType === 'option' && !collateral) throw new Error('invalid_collateral');

			cb();
		} catch (e) {
			const { message } = e as Error;
			toast.error(t(`alerts.${message}`), {
				toastId: message,
			});
		}
	};

	const onSubmit = async () => {
		try {
			if (!brokerUrls) return;

			const { price, quantity, validityDate, symbolISIN, side, holdAfterOrder, close } = props;
			const params: IpcMainChannels['send_order'] = {
				symbolISIN,
				quantity,
				price,
				orderSide: side,
				validity: validityDate,
				validityDate: 0,
			};

			if (params.validity === 'Month' || params.validity === 'Week')
				params.validityDate = dateConverter(params.validity);

			await createOrder(params);
			toast.success(t('alerts.ordered_successfully'), {
				toastId: 'ordered_successfully',
			});

			if (!holdAfterOrder) close();
		} catch (e) {
			toast.error(t('alerts.ordered_unsuccessfully'), {
				toastId: 'ordered_unsuccessfully',
			});
		}
	};

	const TABS = useMemo(
		() => [
			{
				id: 'normal',
				title: t('bs_modal.normal_trade'),
				render: <SimpleTrade {...props} onSubmit={validation(onSubmit)} />,
			},
			{
				id: 'strategy',
				title: t('bs_modal.strategy'),
				render: null,
				disabled: true,
			},
		],
		[JSON.stringify(props), brokerUrls],
	);

	if (props.symbolType === 'base') return <Wrapper className='pt-24'>{TABS[0].render}</Wrapper>;

	return (
		<Wrapper>
			<Tabs
				data={TABS}
				defaultActiveTab='normal'
				renderTab={(item, activeTab) => (
					<button
						className={cn(
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
