'use client'
import { useTranslations } from 'next-intl';
import SettingCard from '../../components/SettingCard';
import SettingCardField from '../../components/SettingCardField';
import Input from '@/components/modals/BuySellModal/common/Input';

const SendOrder = () => {
	const t = useTranslations();

	const fields = [
		{
			title: t('settings_page.default_buy_volume'),
			component: <Input label='asd' onChange={()=> {}} value={0}/>,
		},
		{
			title: t('settings_page.default_sell_volume'),
			component: <></>,
		},
		{
			title: t('settings_page.confirm_before_send_order'),
			component: <></>,
		},
		{
			title: t('settings_page.confirm_before_delete_order'),
			component: <></>,
		},
		{
			title: t('settings_page.Get_online_price'),
			component: <></>,
		},
		{
			title: t('settings_page.market_watcher_message_notification'),
			component: <></>,
		},
		{
			title: t('settings_page.show_symbol_info_in_send_order'),
			component: <></>,
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
