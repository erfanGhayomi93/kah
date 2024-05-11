import { initialSymbolInfoPanelGrid } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setSymbolInfoPanelSetting } from '@/features/slices/modalSlice';
import { type ISymbolInfoPanelSetting } from '@/features/slices/types/modalSlice.interfaces';
import { getSymbolInfoPanelGridLayout, setSymbolInfoPanelGridLayout } from '@/features/slices/uiSlice';
import { useTranslations } from 'next-intl';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Section from './Section';

const Div = styled.div`
	width: 500px;
	position: relative;
`;

interface ISection {
	id: TSymbolInfoPanelSections;
	title: string;
	imgSrc: string;
}

interface SymbolInfoPanelSettingProps extends ISymbolInfoPanelSetting {}

const SymbolInfoPanelSetting = forwardRef<HTMLDivElement, SymbolInfoPanelSettingProps>(
	({ isOption, ...props }, ref) => {
		const t = useTranslations();

		const dispatch = useAppDispatch();

		const symbolInfoPanelGridLayout = useAppSelector(getSymbolInfoPanelGridLayout);

		const [gridLayout, setGridLayout] = useState<typeof symbolInfoPanelGridLayout>([...symbolInfoPanelGridLayout]);

		const onCloseModal = () => {
			dispatch(setSymbolInfoPanelSetting(null));
		};

		const onChecked = (id: TSymbolInfoPanelSections, v: boolean) => {
			const layout = JSON.parse(JSON.stringify(gridLayout)) as typeof gridLayout;
			const i = layout.findIndex((item) => item.id === id);

			if (i === -1) return;

			layout[i].hidden = !v;
			setGridLayout(layout);
		};

		const onSubmit = () => {
			dispatch(setSymbolInfoPanelGridLayout(gridLayout));
			onCloseModal();
		};

		const setToDefault = () => {
			setGridLayout(initialSymbolInfoPanelGrid);
		};

		const data = useMemo<ISection[]>(() => {
			if (!isOption)
				return [
					{
						id: 'symbol_detail',
						title: t('symbol_info_panel_setting.symbol_detail'),
						imgSrc: '/static/images/B8wsD6vJaH.png',
					},
					{
						id: 'base_symbol_contracts',
						title: t('symbol_info_panel_setting.contracts'),
						imgSrc: '/static/images/B8wsD6vJaH.png',
					},
					{
						id: 'user_open_positions',
						title: t('symbol_info_panel_setting.user_open_positions'),
						imgSrc: '/static/images/B8wsD6vJaH.png',
					},
					{
						id: 'quotes',
						title: t('symbol_info_panel_setting.5_quotes'),
						imgSrc: '/static/images/VhXKFwLTRr.png',
					},
					{
						id: 'individual_and_legal',
						title: t('symbol_info_panel_setting.individual_and_legal'),
						imgSrc: '/static/images/9PlkNy6gfp.png',
					},
					{
						id: 'chart',
						title: t('symbol_info_panel_setting.symbol_chart'),
						imgSrc: '/static/images/rbfs0K0Tqf.png',
					},
					{
						id: 'same_sector_symbols',
						title: t('symbol_info_panel_setting.same_sector'),
						imgSrc: '/static/images/s9XZ4s6Sc8.png',
					},
					{
						id: 'supervisor_messages',
						title: t('symbol_info_panel_setting.supervisor_message'),
						imgSrc: '/static/images/4GpkvmODwv.png',
					},
				];

			return [
				{
					id: 'option_detail',
					title: t('symbol_info_panel_setting.option_detail'),
					imgSrc: '/static/images/weoXEM1DSq.png',
				},
				{
					id: 'market_depth',
					title: t('symbol_info_panel_setting.market_depth'),
					imgSrc: '/static/images/q4WNQ4Oibv.png',
				},
				{
					id: 'chart',
					title: t('symbol_info_panel_setting.symbol_chart'),
					imgSrc: '/static/images/rbfs0K0Tqf.png',
				},
				{
					id: 'individual_and_legal',
					title: t('symbol_info_panel_setting.individual_and_legal'),
					imgSrc: '/static/images/9PlkNy6gfp.png',
				},
			];
		}, [isOption]);

		const isNotHidden = useCallback(
			(id: TSymbolInfoPanelSections) => {
				return !gridLayout.find((item) => item.id === id)?.hidden;
			},
			[gridLayout],
		);

		return (
			<Modal top='7%' transparent onClose={onCloseModal} {...props} ref={ref}>
				<Div className='justify-between bg-white flex-column'>
					<Header label={t('symbol_info_panel_setting.title')} onClose={onCloseModal} />

					<div className='flex-1 flex-column'>
						<div className='flex-1 gap-16 p-24 flex-column'>
							<h3 className='text-tiny text-gray-900'>{t('symbol_info_panel_setting.description')}</h3>

							<ul className='flex flex-wrap justify-start gap-28'>
								{data.map((item, i) => (
									<Section
										key={i}
										title={item.title}
										imgSrc={item.imgSrc}
										checked={isNotHidden(item.id)}
										onChecked={(v) => onChecked(item.id, v)}
									/>
								))}
							</ul>
						</div>
						<div className='h-64 gap-8 border-t border-gray-500 px-16 flex-justify-end'>
							<button
								onClick={setToDefault}
								style={{ width: '12rem' }}
								type='button'
								className='h-40 rounded btn-primary-outline'
							>
								{t('symbol_info_panel_setting.back_to_default')}
							</button>
							<button
								onClick={onSubmit}
								style={{ width: '12rem' }}
								type='button'
								className='h-40 rounded btn-primary'
							>
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
