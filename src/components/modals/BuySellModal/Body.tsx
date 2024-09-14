import { useUserRemainQuery } from '@/api/queries/brokerPrivateQueries';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setOrdersActiveTab } from '@/features/slices/tabSlice';
import { setOrdersIsExpand } from '@/features/slices/uiSlice';
import { dateConverter } from '@/utils/helpers';
import { createDraft, createOrder, updateDraft, updateOrder } from '@/utils/orders';
import { type AxiosError } from 'axios';
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
	symbolAssets: number;
	symbolData: Symbol.Info | null;
	symbolISIN: string;
	symbolTitle: string;
	switchable: boolean;
	isLoadingBestLimit: boolean;
	symbolType: TBsSymbolTypes;
	type: TBsTypes;
	mode: TBsModes;
	totalAmountTooltip: Record<'requiredMargin' | 'commission' | 'netValue', number>;
	closeModal: () => void;
	rearrangeValue: () => void;
	setInputValue: TSetBsModalInputs;
	setMinimumValue: () => void;
}

const Body = (props: BodyProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [submitting, setSubmitting] = useState(false);

	const brokerUrls = useAppSelector(getBrokerURLs);

	const { data: userRemain } = useUserRemainQuery({
		queryKey: ['userRemainQuery'],
	});

	const onSubmit = () => {
		if (props.mode === 'create') sendOrder();
		else if (props.mode === 'edit' && props.type === 'order') editOrder();
		if (props.mode === 'edit' && props.type === 'draft') editDraft();
	};

	const sendOrder = async () => {
		try {
			if (!brokerUrls) return;

			setSubmitting(true);

			const {
				price,
				quantity,
				blockType,
				validityDate,
				validity,
				symbolType,
				symbolISIN,
				holdAfterOrder,
				side,
				symbolAssets,
				closeModal,
			} = props;
			const params: IOFields = {
				symbolISIN,
				quantity,
				price,
				orderSide: side,
				validity,
				validityDate,
			};

			if (params.validity === 'GoodTillDate') params.validityDate = new Date(validityDate).getTime();

			if (side === 'sell' && symbolType === 'option' && quantity - symbolAssets < 0) {
				if (blockType!.type === 'Portfolio' || blockType!.type === 'Account') params.source = blockType!.type;
				else {
					params.source = 'Position';
					params.positionSymbolISIN = blockType!.value.symbolISIN;
				}
			}

			if (params.validity === 'Month' || params.validity === 'Week') {
				params.validityDate = dateConverter(params.validity);
			}

			await createOrder(params);

			if (!holdAfterOrder) closeModal();

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

			const { price, quantity, validityDate, validity, symbolISIN, side, holdAfterOrder, closeModal } = props;
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

			if (!holdAfterOrder) closeModal();

			dispatch(setOrdersIsExpand(true));
			dispatch(setOrdersActiveTab('draft'));
		} catch (e) {
			const { message } = e as AxiosError;
			toast.error(
				t(
					message === 'HaveMoreThanMaximumSize'
						? 'alerts.draft_limitation_error'
						: 'alerts.draft_unsuccessfully_created',
				),
				{
					toastId: 'draft_unsuccessfully_created',
				},
			);
		}
	};

	const editOrder = async () => {
		try {
			if (!brokerUrls) return;

			const { id, price, quantity, validityDate, validity, symbolISIN, side, holdAfterOrder, closeModal } = props;
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

			if (!holdAfterOrder) closeModal();

			dispatch(setOrdersIsExpand(true));
			dispatch(setOrdersActiveTab(props.symbolType === 'option' ? 'option_orders' : 'open_orders'));
		} catch (e) {
			toast.error(t('alerts.order_unsuccessfully_edited'), {
				toastId: 'order_unsuccessfully_edited',
			});
		}
	};

	const editDraft = async () => {
		if (!brokerUrls) return;

		try {
			const { id, price, quantity, validityDate, validity, symbolISIN, side, holdAfterOrder, closeModal } = props;
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

			if (!holdAfterOrder) closeModal();

			dispatch(setOrdersIsExpand(true));
			dispatch(setOrdersActiveTab('draft'));
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
				onSubmit={onSubmit}
			/>
		</Wrapper>
	);
};

export default Body;
