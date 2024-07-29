import brokerAxios from '@/api/brokerAxios';
import SymbolSearch from '@/components/common/Symbol/SymbolSearch';
import { InfoCircleSVG } from '@/components/icons';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useBrokerQueryClient } from '@/hooks';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { type FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface BodyProps {
	onCloseModal: () => void;
}

export const Body: FC<BodyProps> = ({ onCloseModal }) => {
	const t = useTranslations();

	const url = useAppSelector(getBrokerURLs);

	const queryClient = useBrokerQueryClient();

	const [symbol, setSymbol] = useState<Symbol.Search | null>(null);

	const [isShowValidationSymbol, setIsShowValidationSymbol] = useState(false);

	const onChangeSymbol = (value: Symbol.Search) => {
		if (value) setSymbol(value);
	};

	const handleSubmitChangeBroker = async () => {
		if (!url) return;

		if (!symbol) {
			setIsShowValidationSymbol(true);
			return;
		}

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

	useEffect(() => {
		!!symbol && isShowValidationSymbol && setIsShowValidationSymbol(false);
	}, [symbol]);

	return (
		<div className='flex h-full flex-col justify-between'>
			<div>
				<SymbolSearch value={symbol} onChange={onChangeSymbol} />

				<span
					className={clsx('text-tiny text-error-100 opacity-0', {
						'opacity-100': isShowValidationSymbol,
						'opacity-0': !isShowValidationSymbol,
					})}
				>
					{t('change_broker_modal.symbol_validation')}
				</span>

				<div className='mt-16 flex items-center gap-4'>
					<InfoCircleSVG className='text-info-100' width='2rem' height='2rem' />
					<span className='text-tiny tracking-normal text-info-100'>
						{t('change_broker_modal.notice_attention')}
					</span>
				</div>
			</div>

			<div className='mt-48'>
				<button
					className='text- h-48 w-full gap-8 rounded font-medium flex-justify-center btn-primary'
					type='submit'
					onClick={handleSubmitChangeBroker}
				>
					{t('deposit_modal.state_Request')}
				</button>
			</div>
		</div>
	);
};
