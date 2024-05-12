'use client';
import Input from '@/components/common/Inputs/Input';
import Switch from '@/components/common/Inputs/Switch';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useReducer } from 'react';
import SettingCard from '../../components/SettingCard';
import SettingCardField from '../../components/SettingCardField';

type TReducerType =
	| 'defaultBuyVolume'
	| 'defaultSellVolume'
	| 'confirmSendOrder'
	| 'confirmDeleteOrder'
	| 'getOnlinePrice'
	| 'marketWatcherMessageNotification'
	| 'showSymbolInfoInSendOrder';

const initialFieldValues = {
	defaultBuyVolume: '',
	defaultSellVolume: '',
	confirmSendOrder: false,
	confirmDeleteOrder: false,
	getOnlinePrice: false,
	marketWatcherMessageNotification: false,
	showSymbolInfoInSendOrder: false,
};

const reducer = (
	state: typeof initialFieldValues,
	action: { type: TReducerType; payload: string | boolean },
): typeof initialFieldValues => {
	return { ...state, [action.type]: action.payload };
};

const SendOrder = () => {
	const t = useTranslations();

	const [fieldValues, dispatch] = useReducer(reducer, initialFieldValues);

	const fields = [
		{
			title: t('settings_page.default_buy_volume'),
			component: (
				<Input
					classInput='text-right'
					value={sepNumbers(String(fieldValues.defaultBuyVolume))}
					onChange={(e) =>
						dispatch({ type: 'defaultBuyVolume', payload: convertStringToInteger(e.target.value) })
					}
					type='text'
					inputMode='numeric'
					placeholder='وارد کنید'
				/>
			),
		},
		{
			title: t('settings_page.default_sell_volume'),
			component: (
				<Input
					classInput='text-right'
					value={sepNumbers(String(fieldValues.defaultSellVolume))}
					onChange={(e) =>
						dispatch({ type: 'defaultSellVolume', payload: convertStringToInteger(e.target.value) })
					}
					type='text'
					inputMode='numeric'
					placeholder='وارد کنید'
				/>
			),
		},
		{
			title: t('settings_page.confirm_before_send_order'),
			component: (
				<>
					<Switch
						checked={fieldValues.confirmSendOrder}
						onChange={(value) => dispatch({ type: 'confirmSendOrder', payload: value })}
					/>
				</>
			),
		},
		{
			title: t('settings_page.confirm_before_delete_order'),
			component: (
				<>
					<Switch
						checked={fieldValues.confirmDeleteOrder}
						onChange={(value) => dispatch({ type: 'confirmDeleteOrder', payload: value })}
					/>
				</>
			),
		},
		{
			title: t('settings_page.Get_online_price'),
			component: (
				<>
					<Switch
						checked={fieldValues.getOnlinePrice}
						onChange={(value) => dispatch({ type: 'getOnlinePrice', payload: value })}
					/>
				</>
			),
		},
		{
			title: t('settings_page.market_watcher_message_notification'),
			component: (
				<>
					<Switch
						checked={fieldValues.marketWatcherMessageNotification}
						onChange={(value) => dispatch({ type: 'marketWatcherMessageNotification', payload: value })}
					/>
				</>
			),
		},
		{
			title: t('settings_page.show_symbol_info_in_send_order'),
			component: (
				<>
					<Switch
						checked={fieldValues.showSymbolInfoInSendOrder}
						onChange={(value) => dispatch({ type: 'showSymbolInfoInSendOrder', payload: value })}
					/>
				</>
			),
		},
	];

	return (
		<SettingCard title={t('settings_page.send_order_settings')}>
			<div className='grid grid-cols-2 gap-x-32 gap-y-24'>
				{fields.map((item) => (
					<SettingCardField key={item.title} colon={false} title={item.title} node={item.component} />
				))}
			</div>
		</SettingCard>
	);
};

export default SendOrder;
