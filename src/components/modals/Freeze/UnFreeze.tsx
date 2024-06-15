import brokerAxios from '@/api/brokerAxios';
import { useCountFreezeQuery } from '@/api/queries/requests';
import Radiobox from '@/components/common/Inputs/Radiobox';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useBrokerQueryClient } from '@/hooks';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { type FC, useState } from 'react';
import { toast } from 'react-toastify';

interface UnFreezeProps {
	onCloseModal: () => void;
}

const UnFreezeTab: FC<UnFreezeProps> = ({ onCloseModal }) => {
	const t = useTranslations();

	const url = useAppSelector(getBrokerURLs);

	const queryClient = useBrokerQueryClient();

	const [value, setValue] = useState('');

	const { data } = useCountFreezeQuery({
		queryKey: ['CountFreezeList'],
	});

	const handleSubmitUnFreeze = async () => {
		if (!url) return;

		try {
			const payload = {
				symbolISIN: value,
				type: 'UnFreeze',
			};

			const response = await brokerAxios.post(url?.newKaraFreeze, payload);
			const data = response.data;

			if (!data.succeeded) {
				toast.error(t('alerts.unFreeze_request_failed'), {
					toastId: 'alerts.unFreeze_request_failed',
				});
			} else {
				toast.success(t('alerts.unFreeze_request_succeeded'), {
					toastId: 'unFreeze_request_succeeded',
				});

				queryClient.invalidateQueries({ queryKey: ['freezeUnFreezeReports'] });

				onCloseModal();
			}
		} catch (e) {
			const { message } = e as Error;
			toast.error(t('alerts.unFreeze_request_failed'), {
				toastId: message,
			});
		}
	};

	return (
		<div className='flex h-full flex-col justify-between'>
			<div className='mb-16 mt-24 flex-1 p-8 shadow-lg'>
				<div className='mb-24 flex'>
					<span className='text-light-gray-700 flex-1 text-center'>{t('freeze_modal.symbol_title')}</span>
					<span className='text-light-gray-700 flex-1 text-center'>{t('freeze_modal.guaranted_number')}</span>
				</div>

				<div className='flex flex-col gap-y-16 overflow-auto' style={{ maxHeight: 300 }}>
					{data?.map((item, ind) => (
						<div className='flex' key={ind}>
							<Radiobox
								checked={value === item.symbolISIN}
								onChange={(checked) => checked && setValue(item.symbolISIN)}
								label={item.symbolTitle}
								classes={{ root: 'pr-16 flex-1' }}
							/>

							<span className='text-light-gray-800 flex-1 text-center'>
								{sepNumbers(String(item.count))}
							</span>
						</div>
					))}
				</div>
			</div>

			<div className=''>
				<button
					className={'h-48 w-full gap-8 rounded font-medium flex-justify-center btn-primary'}
					type='submit'
					disabled={!value}
					onClick={handleSubmitUnFreeze}
				>
					{t('deposit_modal.state_Request')}
				</button>
			</div>
		</div>
	);
};

export default UnFreezeTab;
