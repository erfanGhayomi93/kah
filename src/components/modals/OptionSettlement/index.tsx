import { ArrowRightSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setOptionSettlementModal } from '@/features/slices/modalSlice';
import { type IOptionSettlementModal } from '@/features/slices/types/modalSlice.interfaces';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useState } from 'react';
import Modal, { Header } from '../Modal';
import Body from './Body';
import { HistorySettlement } from './HistorySettlement';

export type TModePage = 'primary' | 'secondary' | 'tertiary';

interface OptionSettlementProps extends IOptionSettlementModal {}

const OptionSettlement = forwardRef<HTMLDivElement, OptionSettlementProps>((props, ref) => {
	const t = useTranslations();

	const { activeTab, data } = props;

	const [isExpand, setIsExpand] = useState(false);

	const [modePage, setModePage] = useState<TModePage>('primary');

	const [dataSecondaryDetails, setDataSecondaryDetails] = useState<Reports.TCashOrPhysicalSettlement>();

	const [tabSelected, setTabSelected] = useState<string>('optionSettlementCashTab');

	const dispatch = useAppDispatch();

	const onExpanded = () => {
		setIsExpand((prev) => !prev);
	};

	const onCloseModal = () => {
		dispatch(setOptionSettlementModal(null));
	};

	const clickItemSettlement = (item?: Reports.TCashOrPhysicalSettlement) => {
		if (modePage === 'primary') {
			setModePage('secondary');
			setDataSecondaryDetails(item);
		} else if (modePage === 'secondary') {
			setModePage('tertiary');
		}
	};

	useEffect(() => {
		if (data) {
			setModePage('secondary');
			setDataSecondaryDetails({
				cashSettlementDate: data.cashSettlementDate,
				doneCount: data.doneCount,
				enabled: data.enabled,
				openPositionCount: data.openPositionCount,
				pandLStatus: data.pandLStatus,
				side: data.side,
				status: data.status,
				symbolISIN: data.symbolISIN,
				symbolTitle: data.symbolTitle,
				from: activeTab === 'optionSettlementCashTab' ? 'cash' : 'physical',
			});
		}
	}, [props]);

	return (
		<Modal
			top='50%'
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			ref={ref}
			onClose={onCloseModal}
			{...props}
		>
			{modePage === 'primary' ? (
				<Header label={t('optionSettlementModal.title')} onClose={onCloseModal} onExpanded={onExpanded} />
			) : (
				<Header>
					<div className='relative w-full pr-24 flex-justify-center'>
						<div
							className='absolute right-24 cursor-pointer text-gray-700'
							onClick={() => setModePage('primary')}
						>
							<ArrowRightSVG />
						</div>

						<h2 className='select-none text-xl font-medium text-gray-700'>
							{t('optionSettlementModal.title')}
							{modePage === 'tertiary' && (
								<>
									<span className='mx-4'>-</span>
									<span>{dataSecondaryDetails?.symbolTitle}</span>
								</>
							)}
						</h2>
					</div>
				</Header>
			)}

			<div
				style={{ width: isExpand ? '808px' : '400px', height: '574px' }}
				className='flex bg-white py-24 transition-width darkness:bg-gray-50'
			>
				<div
					style={{ flex: '0 0 400px' }}
					className={clsx('h-full flex-column', isExpand && 'border-l border-gray-200 px-24')}
				>
					<Body
						onCloseModal={onCloseModal}
						modePage={modePage}
						clickItemSettlement={clickItemSettlement}
						dataSecondaryDetails={dataSecondaryDetails}
						tabSelected={tabSelected}
						setTabSelected={setTabSelected}
					/>
				</div>

				{isExpand && (
					<div className='darkness::bg-gray-50 flex-1 bg-white px-24 flex-column'>
						<HistorySettlement tabSelected={tabSelected} onCloseModal={onCloseModal} />
					</div>
				)}
			</div>
		</Modal>
	);
});

export default OptionSettlement;
