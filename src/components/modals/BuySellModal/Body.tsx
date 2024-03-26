import { useUserRemainQuery } from '@/api/queries/brokerPrivateQueries';
import ipcMain from '@/classes/IpcMain';
import LocalstorageInstance from '@/classes/Localstorage';
import Tabs from '@/components/common/Tabs/Tabs';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { toggleChoiceBrokerModal, toggleLoginModal } from '@/features/slices/modalSlice';
import { setOrdersIsExpand } from '@/features/slices/uiSlice';
import { setBrokerIsSelected } from '@/features/slices/userSlice';
import { getBrokerClientId, getClientId } from '@/utils/cookie';
import { cn, dateConverter } from '@/utils/helpers';
import { createDraft, createOrder, updateDraft, updateOrder } from '@/utils/orders';
import { useTranslations } from 'next-intl';
import { useMemo, useRef, useState } from 'react';
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
	switchable: boolean;
	symbolType: TBsSymbolTypes;
	type: TBsTypes;
	mode: TBsModes;
	commission: Record<'buy' | 'sell' | 'default', number>;
	close: () => void;
	setInputValue: TSetBsModalInputs;
}

const Body = (props: BodyProps) => {
	const t = useTranslations();

	const sendingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const [submitting, setSubmitting] = useState(false);

	const brokerUrls = useAppSelector(getBrokerURLs);

	const dispatch = useAppDispatch();

	const { data: userRemain } = useUserRemainQuery({
		queryKey: ['userRemainQuery'],
	});

	const onOrderMessageReceived = (id: string) => (result: IpcMainChannels['order_sent']) => {
		if (id !== result.id) return;

		if (sendingTimeoutRef.current) clearTimeout(sendingTimeoutRef.current);

		onOrderSentSuccessfully();
	};

	const addNewHandler = (id: string) => {
		const removeHandler = ipcMain.handle('order_sent', onOrderMessageReceived(id), { once: true });

		sendingTimeoutRef.current = setTimeout(() => {
			onOrderSentSuccessfully();
			removeHandler();
		}, 2000);
	};

	const validation = (cb: () => void) => () => {
		try {
			const clientId = getClientId();
			if (!clientId) {
				dispatch(toggleLoginModal({}));
				throw new Error('login_to_your_account');
			}

			const bClientId = getBrokerClientId();
			if (!bClientId[0]) {
				dispatch(setBrokerIsSelected(false));
				dispatch(toggleChoiceBrokerModal({}));
				throw new Error('broker_error');
			}

			if (!brokerUrls) throw new Error('broker_error');

			const { price, quantity, validity, collateral, symbolType } = props;

			if (!price) throw new Error('invalid_price');

			if (!quantity) throw new Error('invalid_quantity');

			if (symbolType === 'base' && !validity) throw new Error('invalid_validity_date');

			if (symbolType === 'option' && props.side === 'sell' && !collateral) throw new Error('invalid_collateral');

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

			setSubmitting(true);

			const { price, quantity, validityDate, validity, symbolISIN, side } = props;
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

			const uuid = await createOrder(params);

			if (uuid) addNewHandler(uuid);
			else onOrderSentSuccessfully();
		} catch (e) {
			onOrderSentFailed();
		}
	};

	const onOrderSentSuccessfully = () => {
		setSubmitting(false);

		toast.success(t('alerts.order_successfully_created'), {
			toastId: 'order_successfully_created',
		});

		if (!props.holdAfterOrder) {
			props.close();
			dispatch(setOrdersIsExpand(true));
			LocalstorageInstance.set('ot', props.symbolType === 'option' ? 'option_orders' : 'today_orders', true);
		}
	};

	const onOrderSentFailed = () => {
		setSubmitting(false);

		toast.error(t('alerts.order_unsuccessfully_created'), {
			toastId: 'order_unsuccessfully_created',
		});
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
				render: () => (
					<SimpleTrade
						{...props}
						submitting={submitting}
						userRemain={userRemain ?? null}
						createDraft={sendDraft}
						onSubmit={validation(onSubmit)}
					/>
				),
			},
			{
				id: 'strategy',
				title: t('bs_modal.strategy'),
				render: null,
				disabled: true,
			},
		],
		[JSON.stringify(props), JSON.stringify(userRemain), submitting, brokerUrls],
	);

	if (props.symbolType === 'base') return <Wrapper className='pt-24'>{TABS[0].render?.()}</Wrapper>;

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
