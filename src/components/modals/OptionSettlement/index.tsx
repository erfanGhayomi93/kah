import AnimatePresence from '@/components/common/animation/AnimatePresence';
import { ArrowRightSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setOptionSettlementModal } from '@/features/slices/modalSlice';
import { type IOptionSettlementModal } from '@/features/slices/types/modalSlice.interfaces';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Body from './Body';

const Div = styled.div`
	width : 420px;
	min-height : 430px;
	max-height : 550px;
	display : flex;
	flex-direction : column;
`;

export type TModePage = 'primary' | 'secondary' | 'tertiary';


interface OptionSettlementProps extends IOptionSettlementModal { }

const OptionSettlement = forwardRef<HTMLDivElement, OptionSettlementProps>((props, ref) => {

	const t = useTranslations();

	const [isShowExpanded, setIsShowExpanded] = useState(false);

	const [modePage, setModePage] = useState<TModePage>('primary');

	const [dataSecondaryDetails, setDataSecondaryDetails] = useState<Reports.TCashOrPhysicalSettlement>();

	// const [tabSelected, setTabSelected] = useState('optionSettlementCashTab');

	const dispatch = useAppDispatch();

	const onExpanded = () => {
		setIsShowExpanded((prev) => !prev);
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

	return (
		<Modal
			top='50%'
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			ref={ref}
			onClose={onCloseModal}
			{...props}
		>
			{
				modePage === 'primary' ? (
					<Header
						label={t('optionSettlementModal.title')}
						onClose={onCloseModal}
						onExpanded={onExpanded}
					/>
				) : (
					<Header>
						<div className='pr-24 flex-justify-center relative w-full'>
							<div
								className='absolute right-24 cursor-pointer text-gray-900'
								onClick={() => setModePage('primary')}
							>
								<ArrowRightSVG />
							</div>

							<h2 className='select-none text-xl font-medium text-gray-900'>
								{
									t('optionSettlementModal.title')
								}
								{
									modePage === 'tertiary' && (
										<>
											<span className='mx-4'>-</span>
											<span>{dataSecondaryDetails?.symbolTitle}</span>
										</>
									)
								}
							</h2>

						</div>
					</Header>
				)
			}

			<div className='flex bg-white p-24'>
				<Div
					className={clsx('flex-column', {
						'border-l border-gray-500 pl-24 pr-16': isShowExpanded,
					})}
				>
					<Body
						onCloseModal={onCloseModal}
						modePage={modePage}
						clickItemSettlement={clickItemSettlement}
						dataSecondaryDetails={dataSecondaryDetails}
					/>
				</Div>

				<AnimatePresence initial={{ animation: 'fadeInLeft' }} exit={{ animation: 'fadeOutLeft' }}>
					{isShowExpanded && (
						<Div className='bg-white'>
							{/* <HistoryFreeze
								tabSelected={tabSelected}
								onCloseModal={onCloseModal}
							/> */}
						</Div>
					)}
				</AnimatePresence>
			</div>

		</Modal>
	);
});


export default OptionSettlement;
