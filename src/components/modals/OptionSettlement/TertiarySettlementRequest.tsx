import brokerAxios from '@/api/brokerAxios';
import Checkbox from '@/components/common/Inputs/Checkbox';
import InputLegend from '@/components/common/Inputs/InputLegend';
import Radiobox from '@/components/common/Inputs/Radiobox';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { convertStringToInteger } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo, useState, type FC } from 'react';
import { toast } from 'react-toastify';




interface TertiarySettlementRequestProps {
	dataSecondaryDetails?: Reports.TCashOrPhysicalSettlement;
	onCloseModal: () => void;
}




const TertiarySettlementRequest: FC<TertiarySettlementRequestProps> = ({ onCloseModal, dataSecondaryDetails }) => {

	const t = useTranslations();

	const url = useAppSelector(getBrokerURLs);


	const [isMaximumStrike, setIsMaximumStrike] = useState(true);

	const [desireNum, setDesireNum] = useState('');

	const [isRequestForLostOrProfit, setIsRequestForLostOrProfit] = useState(false);

	const isPhysical = useMemo(() => dataSecondaryDetails?.from === 'physical', [dataSecondaryDetails?.from]);

	const handleSubmitNewSettlement = async () => {
		if (!url) return;

		try {
			const payload = {
				countOfDone: dataSecondaryDetails?.doneCount,
				requestCount: !isMaximumStrike ? desireNum : 0,
				requestForMaximum: isMaximumStrike,
				symbolISIN: dataSecondaryDetails?.symbolISIN,
				requestForLostOrProfit: isPhysical ? isRequestForLostOrProfit : undefined
			};

			const response = await brokerAxios.post(isPhysical ? url?.newPhysicalSettlement : url?.newCashSettlement, payload);

			if (response.status !== 200 || !response.data.succeeded) {
				toast.error(t((isPhysical ? 'alerts.option_physical_settlement_error_' : 'alerts.option_cash_settlement_error_') + response.data.errors[0]));
				return;
			}

			toast.success(t(isPhysical ? 'alerts.option_request_settlement_physical_success' : 'alerts.option_request_settlement_cash_success'));

			onCloseModal();
		} catch (e) {
		}
	};

	return (
		<div>
			<div className='flex items-center p-16 shadow-sm rounded'>
				<span className='tracking-normal text-info text-justify font-medium'>
					{
						isPhysical ? t('optionSettlementModal.notice_attention_request_physical') : t('optionSettlementModal.notice_attention_request_cash')
					}
				</span>
			</div>

			<div className='mt-24'>
				<span className='text-gray-900 mb-16'>{t('optionSettlementModal.choose_type_of_action')}</span>

				<div className={clsx('mt-16 mb-8 px-12 py-8 rounded flex justify-between', {
					'bg-primary-100': isMaximumStrike
				})}>
					<Radiobox
						label={t('cash_settlement_reports_page.type_request_settlement_MaximumStrike')}
						checked={isMaximumStrike}
						onChange={(checked) => setIsMaximumStrike(checked)}
						classes={{ text: 'mr-8 !text-gray-1000', label: 'flex items-center', active: 'font-semibold' }}
					/>

					<span>{(dataSecondaryDetails?.openPositionCount ?? 0) + ' ' + t('home.tab_option_position')}</span>
				</div>

				<div className={'pt-8 border-t border-gray-300'}>
					<Radiobox
						label={t('optionSettlementModal.desired_number_position')}
						checked={!isMaximumStrike}
						onChange={(checked) => setIsMaximumStrike(!checked)}
						classes={{
							text: 'mr-8 !text-gray-1000', label: 'flex items-center', active: 'font-semibold', root: clsx('px-12 py-8 rounded', {
								'bg-primary-100': !isMaximumStrike
							})
						}}
					/>
				</div>



				<div
					className={clsx('mt-24 ', {
						'opacity-0': isMaximumStrike
					})}
				>
					<InputLegend
						type='text'
						value={desireNum}
						onChange={(v) => setDesireNum(convertStringToInteger(v))}
						placeholder={t('home.count')}
						prefix={t('cash_settlement_reports_page.side_column')}
					/>
				</div>

				<div
					className={clsx('mt-24 ', {
						'opacity-0': !isPhysical
					})}>
					<Checkbox
						checked={isRequestForLostOrProfit}
						onChange={(checked) => setIsRequestForLostOrProfit(checked)}
						label='با تسویه فیزیکی در حالت زیان موافقم.'

					/>
				</div>



				<div className='mt-24 flex gap-x-8'>

					<button
						className={'h-48 w-full gap-8 rounded font-medium btn-info-outline'}
						type='submit'
						// disabled={!value}
						onClick={onCloseModal}
					>
						{t('common.cancel')}
					</button>

					<button
						className={'h-48 w-full gap-8 rounded font-medium btn-primary '}
						type='submit'
						disabled={!isMaximumStrike && !desireNum}
						onClick={handleSubmitNewSettlement}
					>
						{t('deposit_modal.state_Request')}
					</button>


				</div>
			</div>
		</div>
	);
};


export default TertiarySettlementRequest;
