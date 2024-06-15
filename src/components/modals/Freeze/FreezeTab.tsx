import brokerAxios from '@/api/brokerAxios';
import SymbolSearch from '@/components/common/Symbol/SymbolSearch';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useBrokerQueryClient } from '@/hooks';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { type FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface FreezeTabProps {
	onCloseModal: () => void;
}

const FreezeTab: FC<FreezeTabProps> = ({ onCloseModal }) => {
	const t = useTranslations();

	const [symbol, setSymbol] = useState<Symbol.Search | null>(null);

	const url = useAppSelector(getBrokerURLs);

	const [isShowValidationSymbol, setIsShowValidationSymbol] = useState(false);

	const queryClient = useBrokerQueryClient();

	const onChangeSymbol = (value: Symbol.Search) => {
		if (value) setSymbol(value);
	};

	const contents = [
		t('freeze_modal.notice1_freeze'),
		t('freeze_modal.notice2_freeze'),
		t('freeze_modal.notice3_freeze'),
		t('freeze_modal.notice4_freeze'),
	];

	const handleSubmitFreeze = async () => {
		if (!url) return;

		if (!symbol) {
			setIsShowValidationSymbol(true);
			return;
		}

		if (symbol.isOption) {
			toast.warn('alerts.option_error_cant_freeze');
			return;
		}

		if (symbol.isFreeze) {
			toast.warn('alerts.option_error_cant_freeze');
			return;
		}

		try {
			const payload = {
				symbolISIN: symbol.symbolISIN,
				type: 'freeze',
			};

			const response = await brokerAxios.post(url?.newKaraFreeze, payload);
			const data = response.data;

			if (!data.succeeded) {
				toast.error(t('alerts.freeze_request_failed'), {
					toastId: 'alerts.freeze_request_failed',
				});
			} else {
				toast.success(t('alerts.freeze_request_succeeded'), {
					toastId: 'freeze_request_succeeded',
				});

				queryClient.invalidateQueries({ queryKey: ['freezeUnFreezeReports'] });

				onCloseModal();
			}
		} catch (e) {
			const { message } = e as Error;
			toast.error(t('alerts.freeze_request_failed'), {
				toastId: message,
			});
		}
	};

	useEffect(() => {
		!!symbol && isShowValidationSymbol && setIsShowValidationSymbol(false);
	}, [symbol]);

	return (
		<div>
			<div className='my-24'>
				<SymbolSearch value={symbol} onChange={onChangeSymbol} />

				<span
					className={clsx('text-tiny text-light-error-100 opacity-0', {
						'opacity-100': isShowValidationSymbol,
						'opacity-0': !isShowValidationSymbol,
					})}
				>
					{t('change_broker_modal.symbol_validation')}
				</span>
			</div>

			<div className='flex flex-col gap-y-16'>
				{contents.map((item, ind) => (
					<div key={ind} className='grid grid-flow-col gap-x-8'>
						<span className='mt-8 size-8 rounded-circle bg-light-info-100'></span>
						<p className='text-light-gray-700'>{item}</p>
					</div>
				))}
			</div>

			<div className='mt-24'>
				<button
					className='text- h-48 w-full gap-8 rounded font-medium flex-justify-center btn-primary'
					type='submit'
					onClick={handleSubmitFreeze}
				>
					{t('deposit_modal.state_Request')}
				</button>
			</div>
		</div>
	);
};

export default FreezeTab;
