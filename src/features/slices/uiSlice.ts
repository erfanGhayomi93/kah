import LocalstorageInstance from '@/classes/Localstorage';
import { initialDashboardGrid, initialSymbolInfoPanelGrid } from '@/constants/grid';
import broadcast from '@/utils/broadcast';
import { setCookieTheme } from '@/utils/cookie';
import { getDeviceColorSchema } from '@/utils/helpers';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ToastPosition } from 'react-toastify';
import { type RootState } from '../store';

export interface UIState {
	sidebarIsExpand: boolean;

	saturnActiveTemplate: Saturn.Template | null;

	lsStatus: LightstreamStatus;

	ordersIsExpand: boolean;

	symbolInfoPanelGridLayout: ISymbolInfoPanelGrid[];

	dashboardGridLayout: IDashboardGrid[];

	toastPosition: ToastPosition;

	builtStrategy: TSymbolStrategy[];

	theme: TTheme;
}

const initialState: UIState = {
	ordersIsExpand: false,

	sidebarIsExpand: false,

	saturnActiveTemplate: null,

	builtStrategy: [],

	lsStatus: 'CONNECTING',

	symbolInfoPanelGridLayout: LocalstorageInstance.get('sipg', initialSymbolInfoPanelGrid, (v) => Array.isArray(v)),

	dashboardGridLayout: LocalstorageInstance.get('dg', initialDashboardGrid, (v) => Array.isArray(v)),

	toastPosition: LocalstorageInstance.get<ToastPosition>('tp', 'bottom-left'),

	theme: getDeviceColorSchema(),
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		toggleSidebar: (state, { payload }: PayloadAction<UIState['sidebarIsExpand']>) => {
			state.sidebarIsExpand = payload;
		},

		setLsStatus: (state, { payload }: PayloadAction<UIState['lsStatus']>) => {
			state.lsStatus = payload;
		},

		setSaturnActiveTemplate: (state, { payload }: PayloadAction<UIState['saturnActiveTemplate']>) => {
			state.saturnActiveTemplate = payload;
		},

		setOrdersIsExpand: (state, { payload }: PayloadAction<UIState['ordersIsExpand']>) => {
			state.ordersIsExpand = payload;
		},

		setSymbolInfoPanelGridLayout: (state, { payload }: PayloadAction<UIState['symbolInfoPanelGridLayout']>) => {
			LocalstorageInstance.set('sipg', payload);
			state.symbolInfoPanelGridLayout = payload;
		},

		setDashboardGridLayout: (state, { payload }: PayloadAction<UIState['dashboardGridLayout']>) => {
			LocalstorageInstance.set('dg', payload);
			state.dashboardGridLayout = payload;
		},

		toggleOrdersIsExpand: (state) => {
			state.ordersIsExpand = !state.ordersIsExpand;
		},

		setToastPosition: (state, { payload }: PayloadAction<UIState['toastPosition']>) => {
			LocalstorageInstance.set('tp', payload);
			state.toastPosition = payload;
		},

		setBuiltStrategy: (state, { payload }: PayloadAction<UIState['builtStrategy']>) => {
			state.builtStrategy = payload;
		},

		setTheme: (state, { payload }: PayloadAction<UIState['theme']>) => {
			try {
				broadcast.postMessage(JSON.stringify({ type: 'theme_changed', payload }));

				document.documentElement.setAttribute(
					'data-theme',
					payload === 'system' ? getDeviceColorSchema() : payload,
				);
			} catch (e) {
				//
			}

			setCookieTheme(payload);
			state.theme = payload;
		},
	},
});

export const {
	setSaturnActiveTemplate,
	toggleSidebar,
	toggleOrdersIsExpand,
	setOrdersIsExpand,
	setLsStatus,
	setSymbolInfoPanelGridLayout,
	setDashboardGridLayout,
	setToastPosition,
	setBuiltStrategy,
	setTheme,
} = uiSlice.actions;

export const getSidebarIsExpand = (state: RootState) => state.ui.sidebarIsExpand;
export const getOrdersIsExpand = (state: RootState) => state.ui.ordersIsExpand;
export const getLsStatus = (state: RootState) => state.ui.lsStatus;
export const getSaturnActiveTemplate = (state: RootState) => state.ui.saturnActiveTemplate;
export const getSymbolInfoPanelGridLayout = (state: RootState) => state.ui.symbolInfoPanelGridLayout;
export const getDashboardGridLayout = (state: RootState) => state.ui.dashboardGridLayout;
export const getToastPosition = (state: RootState) => state.ui.toastPosition;
export const getBuiltStrategy = (state: RootState) => state.ui.builtStrategy;
export const getTheme = (state: RootState) => state.ui.theme;

export default uiSlice.reducer;
