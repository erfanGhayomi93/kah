import { useUserRemainQuery } from '@/api/queries/brokerPrivateQueries';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setChoiceBrokerModal, setLoginModal } from '@/features/slices/modalSlice';
import { setOrdersActiveTab } from '@/features/slices/tabSlice';
import { setOrdersIsExpand } from '@/features/slices/uiSlice';
import { setBrokerIsSelected } from '@/features/slices/userSlice';
import { useBrokerQueryClient } from '@/hooks';
import { getBrokerClientId, getClientId } from '@/utils/cookie';
import { dateConverter } from '@/utils/helpers';
import { createDraft, createOrder, updateDraft, updateOrder } from '@/utils/orders';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-toastify';
import SimpleTrade from './SimpleTrade';

interface WrapperProps {
	children: React.ReactNode;
	className?: ClassesValue;
}

const Wrapper = ({ children, className }: WrapperProps) => (
	<div style={{ flex: '0 0 336px' }} className={clsx('gap-24 overflow-hidden p-16 flex-column', className)}>
		{children}
	</div>
);

interface BodyProps extends IBsModalInputs {
	id: number | undefined;
	orderingPurchasePower: number;
	purchasePower: number;
	symbolData: Symbol.Info | null;
	symbolISIN: string;
	symbolTitle: string;
	switchable: boolean;
	isLoadingBestLimit: boolean;
	symbolType: TBsSymbolTypes;
	type: TBsTypes;
	mode: TBsModes;
	close: () => void;
	setInputValue: TSetBsModalInputs;
	setMinimumValue: () => void;
}

const Body = (props: BodyProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [submitting, setSubmitting] = useState(false);

	const brokerUrls = useAppSelector(getBrokerURLs);

	const queryClient = useBrokerQueryClient();

	const { data: userRemain } = useUserRemainQuery({
		queryKey: ['userRemainQuery'],
	});

	const validation = (cb: () => void) => () => {
		try {
			const clientId = getClientId();
			if (!clientId) {
				dispatch(setLoginModal({ showForceLoginAlert: true }));
				throw new Error('login_to_your_account');
			}

			const bClientId = getBrokerClientId();
			if (!bClientId[0]) {
				dispatch(setBrokerIsSelected(false));
				dispatch(setChoiceBrokerModal({}));
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

	const refetchOrdersCount = () => {
		queryClient.refetchQueries({
			queryKey: ['brokerOrdersCountQuery'],
			exact: true,
		});
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
			else if (params.validity === 'Month' || params.validity === 'Week') {
				params.validityDate = dateConverter(params.validity);
			}

			await createOrder(params);

			setSubmitting(false);
			dispatch(setOrdersIsExpand(true));
			dispatch(setOrdersActiveTab(props.symbolType === 'option' ? 'option_orders' : 'today_orders'));
		} catch (e) {
			setSubmitting(false);
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

			refetchOrdersCount();
			toast.success(t('alerts.draft_successfully_created'), {
				toastId: 'draft_successfully_created',
			});

			if (!holdAfterOrder) {
				close();
				dispatch(setOrdersIsExpand(true));
				dispatch(setOrdersActiveTab('draft'));
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
				dispatch(setOrdersActiveTab(props.symbolType === 'option' ? 'option_orders' : 'open_orders'));
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
				dispatch(setOrdersActiveTab('draft'));
			}
		} catch (error) {
			toast.error(t('alerts.draft_unsuccessfully_edited'), {
				toastId: 'draft_unsuccessfully_edited',
			});
		}
	};

	return (
		<Wrapper>
			<SimpleTrade
				{...props}
				submitting={submitting}
				userRemain={userRemain ?? null}
				createDraft={sendDraft}
				onSubmit={validation(onSubmit)}
			/>
		</Wrapper>
	);
};

export default Body;
