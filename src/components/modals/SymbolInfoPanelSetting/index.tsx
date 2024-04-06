import { useAppDispatch } from '@/features/hooks';
import { type ISymbolInfoPanelSetting, setSymbolInfoPanelSetting } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { forwardRef, useMemo } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Section from './Section';

const Div = styled.div`
	width: 560px;
	position: relative;
`;

interface SymbolInfoPanelSettingProps extends ISymbolInfoPanelSetting {}

const SymbolInfoPanelSetting = forwardRef<HTMLDivElement, SymbolInfoPanelSettingProps>(
	({ isOption, ...props }, ref) => {
		const t = useTranslations();

		const dispatch = useAppDispatch();

		const onCloseModal = () => {
			dispatch(setSymbolInfoPanelSetting(null));
		};

		const onChecked = (v: boolean) => {
			//
		};

		const data = useMemo(() => {
			if (!isOption)
				return [
					{
						title: t('symbol_info_panel_setting.symbol_detail'),
						imgSrc: '/static/images/B8wsD6vJaH.png',
						checked: true,
					},
					{
						title: t('symbol_info_panel_setting.contracts'),
						imgSrc: '/static/images/B8wsD6vJaH.png',
						checked: true,
					},
					{
						title: t('symbol_info_panel_setting.user_open_positions'),
						imgSrc: '/static/images/B8wsD6vJaH.png',
						checked: true,
					},
					{
						title: t('symbol_info_panel_setting.5_quotes'),
						imgSrc: '/static/images/VhXKFwLTRr.png',
						checked: true,
					},
					{
						title: t('symbol_info_panel_setting.individual_and_legal'),
						imgSrc: '/static/images/9PlkNy6gfp.png',
						checked: true,
					},
					{
						title: t('symbol_info_panel_setting.symbol_chart'),
						imgSrc: '/static/images/rbfs0K0Tqf.png',
						checked: true,
					},
					{
						title: t('symbol_info_panel_setting.same_sector'),
						imgSrc: '/static/images/s9XZ4s6Sc8.png',
						checked: true,
					},
					{
						title: t('symbol_info_panel_setting.supervisor_message'),
						imgSrc: '/static/images/4GpkvmODwv.png',
						checked: true,
					},
				];

			return [];
		}, [isOption]);

		return (
			<Modal top='7%' transparent onClose={onCloseModal} {...props} ref={ref}>
				<Div className='justify-between bg-white flex-column'>
					<Header label={t('symbol_info_panel_setting.title')} onClose={onCloseModal} />

					<div className='flex-1 flex-column'>
						<div className='flex-1 gap-16 px-24 pb-16 pt-24 flex-column'>
							<h3 className='text-tiny text-gray-900'>{t('symbol_info_panel_setting.description')}</h3>

							<div className='gap-24 flex-column'>
								{data.map((item, i) => (
									<Section
										key={i}
										title={item.title}
										imgSrc={item.imgSrc}
										checked={item.checked}
										onChecked={onChecked}
									/>
								))}
							</div>
						</div>
						<div className='h-64 gap-8 border-t border-gray-500 px-16 flex-justify-end'>
							<button
								style={{ width: '12rem' }}
								type='button'
								className='h-40 rounded btn-primary-outline'
							>
								{t('symbol_info_panel_setting.back_to_default')}
							</button>
							<button style={{ width: '12rem' }} type='button' className='h-40 rounded btn-primary'>
								{t('common.confirm')}
							</button>
						</div>
					</div>
				</Div>
			</Modal>
		);
	},
);

export default SymbolInfoPanelSetting;
