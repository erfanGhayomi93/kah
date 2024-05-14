import brokerAxios from '@/api/brokerAxios';
import { useCountFreezeQuery } from '@/api/queries/requests';
import Radiobox from '@/components/common/Inputs/Radiobox';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
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


	const [value, setValue] = useState('');

	const { data } = useCountFreezeQuery({
		queryKey: ['CountFreezeList']
	});

	const handleSubmitUnFreeze = async () => {
		if (!url) return;

		try {
			const payload = {
				symbolISIN: value,
				type: 'UnFreeze'
			};

			const response = await brokerAxios.post(url?.newKaraFreeze, payload);
			const data = response.data;

			if (!data.succeeded) {
				toast.error(t('alerts.unFreeze_request_failed'), {
					toastId: 'alerts.unFreeze_request_failed'
				});
			} else {
				toast.success(t('alerts.unFreeze_request_succeeded'), {
					toastId: 'unFreeze_request_succeeded'
				});
				onCloseModal();
			}
		} catch (e) {
			const { message } = (e as Error);
			toast.error(t('alerts.unFسreeze_request_failed'), {
				toastId: message
			});
		}
	};


	return (

		<div className='flex flex-col justify-between h-full'>
			<div className="mt-24 mb-16 p-8 shadow-lg flex-1">
				<div className="flex mb-24">
					<span className="flex-1 text-center text-gray-900">{t('freeze_modal.symbol_title')}</span>
					<span className="flex-1 text-center text-gray-900">{t('freeze_modal.guaranted_number')}</span>
				</div>


				<div className='flex flex-col gap-y-16 overflow-auto' style={{ maxHeight: 300 }}>
					{
						data?.map((item, ind) => (
							<div className='flex' key={ind}>
								<Radiobox
									checked={value === item.symbolISIN}
									onChange={(checked) => checked && setValue(item.symbolISIN)}
									label={item.symbolTitle}
									classes={{ root: 'pr-16 flex-1' }}
								/>

								<span className='text-gray-1000 text-center flex-1'>
									{sepNumbers(String(item.count))}
								</span>
							</div>
						))
					}

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