import ipcMain from '@/classes/IpcMain';
import NoData from '@/components/common/NoData';
import RenderOnViewportEntry from '@/components/common/RenderOnViewportEntry ';
import SwitchTab from '@/components/common/Tabs/SwitchTab';
import Tooltip from '@/components/common/Tooltip';
import { ExpandSVG, InfoCircleSVG, XCircleSVG } from '@/components/icons';
import clsx from 'clsx';

export interface ITab<T> {
	id: T;
	title: React.ReactNode;
}

interface SectionProps<T, B> {
	id: TDashboardSections;
	title: string;
	expandable?: boolean;
	info?: string;
	defaultTopActiveTab?: T;
	defaultBottomActiveTab?: B;
	children?: React.ReactNode;
	tabs?: Partial<{
		top: Array<ITab<T>> | React.ReactNode;
		bottom: Array<ITab<B>> | React.ReactNode;
	}>;
	closeable?: boolean;
	isModal?: boolean;
	onExpand?: () => void;
	onTopTabChange?: (v: T) => void;
	onBottomTabChange?: (v: B) => void;
}

const Section = <T extends string = string, B extends string = string>({
	id,
	title,
	tabs,
	children,
	defaultTopActiveTab,
	defaultBottomActiveTab,
	expandable,
	info,
	closeable = true,
	isModal = false,
	onExpand,
	onTopTabChange,
	onBottomTabChange,
}: SectionProps<T, B>) => {
	const onClose = () => {
		ipcMain.send('home.hide_section', { id, hidden: true });
	};

	return (
		<div className='darkBlue:bg-gray-50 size-full flex-1 justify-between overflow-hidden rounded bg-white pb-16 pl-8 pr-16 pt-8 flex-column dark:bg-gray-50'>
			<div style={{ flex: '0 0 4rem' }} className='ltr flex-justify-between'>
				<div className='flex h-full gap-8'>
					<div
						className={clsx(
							'h-full gap-8 rounded bg-gray-100 px-8 flex-items-center',
							!closeable && !expandable && !info && 'bg-transparent',
						)}
					>
						{closeable && (
							<button
								onClick={expandable ? onClose : onExpand}
								type='button'
								className='text-gray-500 transition-colors flex-justify-center hover:text-error-100'
							>
								<XCircleSVG width='1.8rem' height='1.8rem' />
							</button>
						)}

						{expandable && (
							<button
								onClick={onExpand}
								type='button'
								className='size-18 rounded-circle bg-gray-500 text-white transition-colors flex-justify-center hover:bg-success-100'
							>
								<ExpandSVG width='1.4rem' height='1.4rem' />
							</button>
						)}

						{info && (
							<Tooltip className='text-tiny font-medium' content={info ?? ''}>
								<div className='size-18 rounded-circle  text-gray-500 transition-colors flex-justify-center hover:text-info-100'>
									<InfoCircleSVG width='1.8rem' height='1.8rem' />
								</div>
							</Tooltip>
						)}
					</div>

					{Array.isArray(tabs?.top) ? (
						<SwitchTab<ITab<T>>
							data={tabs.top}
							defaultActiveTab={defaultTopActiveTab ?? tabs.top[0].id}
							classes={{
								root: '!h-40 bg-gray-100 rtl !border-0 py-4 px-8',
								rect: 'bg-white dark:bg-gray-50 darkBlue:bg-gray-50 !h-32 rounded',
								tabs: 'gap-8',
							}}
							onChangeTab={(v) => onTopTabChange?.(v as T)}
							renderTab={(item, activeTab) => (
								<button
									type='button'
									className={clsx(
										'h-full flex-1 px-8 py-4 transition-colors',
										item.id === activeTab ? 'font-medium text-gray-800' : 'text-gray-500',
									)}
								>
									{item.title}
								</button>
							)}
						/>
					) : (
						tabs?.top
					)}
				</div>

				<h1 className='text-lg font-medium text-gray-700'>{title}</h1>
			</div>

			<RenderOnViewportEntry
				className={clsx(
					'relative h-full flex-1 overflow-hidden pl-8 pt-16',
					isModal && 'flex flex-col items-center justify-center',
				)}
			>
				{children ?? <NoData className='absolute center' />}
			</RenderOnViewportEntry>

			{Array.isArray(tabs?.bottom) ? (
				<div style={{ flex: '0 0 4.8rem' }}>
					<SwitchTab<ITab<B>>
						data={tabs.bottom}
						defaultActiveTab={defaultBottomActiveTab ?? tabs.bottom[0].id}
						classes={{
							root: '!h-48 bg-gray-100 rtl !border-0 p-4',
							rect: 'bg-secondary-100 no-hover !h-40',
							tabs: 'gap-8',
						}}
						onChangeTab={(v) => onBottomTabChange?.(v as B)}
						renderTab={(item, activeTab) => (
							<button
								type='button'
								className={clsx(
									'h-full flex-1 rounded transition-colors',
									item.id === activeTab ? 'font-medium text-primary-100' : 'text-gray-500',
								)}
							>
								{item.title}
							</button>
						)}
					/>
				</div>
			) : (
				tabs?.bottom
			)}
		</div>
	);
};

export default Section;
