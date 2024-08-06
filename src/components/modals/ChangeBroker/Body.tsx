import brokerAxios from '@/api/brokerAxios';
import SymbolSearch from '@/components/common/Symbol/SymbolSearch';
import { InfoCircleSVG } from '@/components/icons';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useBrokerQueryClient } from '@/hooks';
import { useTranslations } from 'next-intl';
import { type FC, useState } from 'react';
import { toast } from 'react-toastify';

interface BodyProps {
	onCloseModal: () => void;
}

export const Body: FC<BodyProps> = ({ onCloseModal }) => {
	const t = useTranslations();

	const url = useAppSelector(getBrokerURLs);

	const queryClient = useBrokerQueryClient();

	const [symbol, setSymbol] = useState<Symbol.Search | null>(null);

	const onChangeSymbol = (value: Symbol.Search) => {
		if (value) setSymbol(value);
	};

	const handleSubmitChangeBroker = async () => {
		if (!url || !symbol) return;

		try {
			const fd = new FormData();
			fd.append('SymbolISIN', symbol?.symbolISIN ?? '');

			const response = await brokerAxios.post(url?.ChangeBrokerCreate, fd);
			const data = response.data;

			if (!data.succeeded) {
				toast.error(t('alerts.change_broker_failure_' + data.errors[0]), {
					toastId: data.errors[0],
				});
			} else {
				toast.success(t('alerts.change_broker_request_successfully'), {
					toastId: 'change_broker_successfully',
				});

				queryClient.invalidateQueries({ queryKey: ['changeBrokerReports'] });

				onCloseModal();
			}
		} catch (e) {
			const { message } = e as Error;
			toast.error(t('alerts.change_broker_failure_' + message), {
				toastId: message,
			});
		}
	};

	return (
		<form className='h-full justify-between flex-column'>
			<div className='flex-1 gap-16 flex-column'>
				<SymbolSearch value={symbol} onChange={onChangeSymbol} classes={{ root: '!flex-48' }} />

				<div className='flex items-start gap-4'>
					<InfoCircleSVG className='mt-4 text-info-100' width='1.6rem' height='1.6rem' />
					<span className='flex-1 text-tiny leading-loose text-info-100'>
						{t('change_broker_modal.notice_attention')}
					</span>
				</div>
			</div>

			<button
				disabled={symbol === null}
				type='submit'
				className='text- h-48 w-full gap-8 rounded font-medium flex-justify-center btn-primary'
				onClick={handleSubmitChangeBroker}
			>
				{t('deposit_modal.state_Request')}
			</button>
		</form>
	);
};
