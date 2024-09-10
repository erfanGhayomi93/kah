import { useFreezeMutation } from '@/api/mutations/freezeMutations';
import SymbolSearch from '@/components/common/Symbol/SymbolSearch';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useBrokerQueryClient } from '@/hooks';
import { useTranslations } from 'next-intl';
import { type FC, useState } from 'react';
import { toast } from 'react-toastify';

interface FreezeTabProps {
	onCloseModal: () => void;
}

const FreezeTab: FC<FreezeTabProps> = ({ onCloseModal }) => {
	const t = useTranslations();

	const [symbol, setSymbol] = useState<Symbol.Search | null>(null);

	const url = useAppSelector(getBrokerURLs);

	const queryClient = useBrokerQueryClient();

	const { mutate: createFreezeRequest } = useFreezeMutation({
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['freezeUnFreezeReports'] });

			toast.success(t('alerts.freeze_request_succeeded'), {
				toastId: 'freeze_request_succeeded',
			});

			onCloseModal();
		},

		onError: (e) => {
			if (e.message === 'DuplicateRequest') {
				toast.error(t('alerts.freeze_request_duplicated'), {
					toastId: 'alerts.freeze_request_duplicated',
				});
			} else if (e.message === 'OnlyPortfolioSymbolAllowed') {
				toast.error(t('alerts.only_portfolio_symbol_allowed'), {
					toastId: 'alerts.only_portfolio_symbol_allowed',
				});
			} else {
				toast.error(t('alerts.freeze_request_failed'), {
					toastId: 'alerts.freeze_request_failed',
				});
			}
		},
	});

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
		if (!url || !symbol) return;

		if (symbol.isOption) {
			toast.warn('alerts.option_error_cant_freeze');
			return;
		}

		if (symbol.isFreeze) {
			toast.warn('alerts.option_error_cant_freeze');
			return;
		}

		createFreezeRequest({ symbolISIN: [symbol.symbolISIN], type: 'freeze' });
	};

	return (
		<div className='gap-8 px-24 pt-24 flex-column'>
			<SymbolSearch value={symbol} onChange={onChangeSymbol} classes={{ root: '!flex-48' }} />

			<ul className='flex flex-col gap-y-16'>
				{contents.map((item, i) => (
					<li key={i} className='gap-x-8 flex-items-start'>
						<span className='mt-6 size-8 rounded-circle bg-info-100' />
						<p className='flex-1 text-justify text-tiny leading-loose text-gray-700'>{item}</p>
					</li>
				))}
			</ul>

			<button
				className='text- h-48 w-full gap-8 rounded font-medium flex-justify-center btn-primary'
				type='submit'
				disabled={!symbol}
				onClick={handleSubmitFreeze}
			>
				{t('common.create_request')}
			</button>
		</div>
	);
};

export default FreezeTab;
