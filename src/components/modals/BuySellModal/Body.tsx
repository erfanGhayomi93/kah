import { useGetBrokerUrlQuery } from '@/api/queries/brokerQueries';
import LocalstorageInstance from '@/classes/Localstorage';
import Tabs from '@/components/common/Tabs/Tabs';
import { useAppDispatch } from '@/features/hooks';
import { toggleChooseBrokerModal, toggleLoginModal } from '@/features/slices/modalSlice';
import { setOrdersIsExpand } from '@/features/slices/uiSlice';
import { setBrokerIsSelected } from '@/features/slices/userSlice';
import { getBrokerClientId, getClientId } from '@/utils/cookie';
import { cn, dateConverter } from '@/utils/helpers';
import { createDraft, createOrder, updateDraft, updateOrder } from '@/utils/orders';
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
	id: number | undefined;
	symbolISIN: string;
	symbolType: TBsSymbolTypes;
	type: TBsTypes;
	mode: TBsModes;
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

			const { price, quantity, validity, collateral, symbolType } = props;

			if (!price) throw new Error('invalid_price');

			if (!quantity) throw new Error('invalid_quantity');

			if (symbolType === 'base' && !validity) throw new Error('invalid_validity_date');

			if (symbolType === 'option' && !collateral) throw new Error('invalid_collateral');

			cb();
		} catch (e) {
			const { message } = e as Error;
			toast.error(t(`alerts.${message}`), {
				toastId: message,
			});
		}
	};

	const onSubmit = () => {
		if (props.mode === 'create') sendOrder();
		else if (props.mode === 'edit' && props.type === 'order') editOrder();
		if (props.mode === 'edit' && props.type === 'draft') editDraft();
	};

	const sendOrder = async () => {
		try {
			if (!brokerUrls) return;

			const { price, quantity, validityDate, validity, symbolISIN, side, holdAfterOrder, close } = props;
			const params: IOFields = {
				symbolISIN,
				quantity,
				price,
				orderSide: side,
				validity,
				validityDate,
			};

			if (params.validity === 'GoodTillDate') params.validityDate = new Date(validityDate).getTime();
			else if (params.validity === 'Month' || params.validity === 'Week')
				params.validityDate = dateConverter(params.validity);

			await createOrder(params);
			toast.success(t('alerts.order_successfully_created'), {
				toastId: 'order_successfully_created',
			});

			if (!holdAfterOrder) {
				close();
				dispatch(setOrdersIsExpand(true));
				LocalstorageInstance.set('ot', props.symbolType === 'option' ? 'option_orders' : 'open_orders', true);
			}
		} catch (e) {
			toast.error(t('alerts.order_unsuccessfully_created'), {
				toastId: 'order_unsuccessfully_created',
			});
		}
	};

	const sendDraft = async () => {
		try {
			if (!brokerUrls) return;

			const { price, quantity, validityDate, validity, symbolISIN, side, holdAfterOrder, close } = props;
			const params: IOFields = {
				symbolISIN,
				quantity,
				price,
				orderSide: side,
				validity,
				validityDate: 0,
			};

			if (params.validity === 'GoodTillDate') params.validityDate = new Date(validityDate).getTime();
			else if (params.validity === 'Month' || params.validity === 'Week')
				params.validityDate = dateConverter(params.validity);

			await createDraft(params);
			toast.success(t('alerts.draft_successfully_created'), {
				toastId: 'draft_successfully_created',
			});

			if (!holdAfterOrder) {
				close();
				dispatch(setOrdersIsExpand(true));
				LocalstorageInstance.set('ot', 'draft', true);
			}
		} catch (e) {
			toast.error(t('alerts.draft_unsuccessfully_created'), {
				toastId: 'draft_unsuccessfully_created',
			});
		}
	};

	const editOrder = async () => {
		try {
			if (!brokerUrls) return;

			const { id, price, quantity, validityDate, validity, symbolISIN, side, holdAfterOrder, close } = props;
			const params: IOFieldsWithID = {
				id: id ?? -1,
				symbolISIN,
				quantity,
				price,
				orderSide: side,
				validity,
				validityDate,
			};

			if (params.validity === 'GoodTillDate') params.validityDate = new Date(validityDate).getTime();
			else if (params.validity === 'Month' || params.validity === 'Week')
				params.validityDate = dateConverter(params.validity);

			await updateOrder(params);
			toast.success(t('alerts.order_successfully_edited'), {
				toastId: 'order_successfully_edited',
			});

			if (!holdAfterOrder) {
				close();
				dispatch(setOrdersIsExpand(true));
				LocalstorageInstance.set('ot', props.symbolType === 'option' ? 'option_orders' : 'open_orders', true);
			}
		} catch (e) {
			toast.error(t('alerts.order_unsuccessfully_edited'), {
				toastId: 'order_unsuccessfully_edited',
			});
		}
	};

	const editDraft = async () => {
		if (!brokerUrls) return;

		try {
			const { id, price, quantity, validityDate, validity, symbolISIN, side, holdAfterOrder, close } = props;
			const params: IOFieldsWithID = {
				id: id ?? -1,
				symbolISIN,
				quantity,
				price,
				orderSide: side,
				validity,
				validityDate,
			};

			if (params.validity === 'GoodTillDate') params.validityDate = new Date(validityDate).getTime();
			else if (params.validity === 'Month' || params.validity === 'Week')
				params.validityDate = dateConverter(params.validity);

			await updateDraft(params);
			toast.success(t('alerts.draft_successfully_edited'), {
				toastId: 'draft_successfully_edited',
			});

			if (!holdAfterOrder) {
				close();
				dispatch(setOrdersIsExpand(true));
				LocalstorageInstance.set('ot', 'draft', true);
			}
		} catch (error) {
			toast.error(t('alerts.draft_unsuccessfully_edited'), {
				toastId: 'draft_unsuccessfully_edited',
			});
		}
	};

	const TABS = useMemo(
		() => [
			{
				id: 'normal',
				title: t('bs_modal.normal_trade'),
				render: <SimpleTrade {...props} createDraft={sendDraft} onSubmit={validation(onSubmit)} />,
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
							'flex-1 p-8 transition-colors',
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
