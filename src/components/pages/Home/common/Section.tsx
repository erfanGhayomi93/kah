import ipcMain from '@/classes/IpcMain';
import SwitchTab from '@/components/common/Tabs/SwitchTab';
import { ExpandSVG, XSVG } from '@/components/icons';
import clsx from 'clsx';

interface ITab {
	id: string;
	title: string;
}

interface SectionProps {
	id: THomeSections;
	title: string;
	children?: React.ReactNode;
	tabs?: Partial<{
		top: ITab[] | React.ReactNode;
		bottom: ITab[] | React.ReactNode;
	}>;
	onExpand?: () => void;
}

const Section = ({ id, title, tabs, onExpand }: SectionProps) => {
	const onClose = () => {
		ipcMain.send('home.hide_section', { id, hidden: true });
	};

	return (
		<div className='size-full justify-between rounded bg-white px-8 pb-16 pt-8 flex-column'>
			<div style={{ flex: '0 0 4rem' }} className='flex-justify-between'>
				<div className='flex h-full gap-8'>
					<div className='h-full gap-8 rounded bg-gray-200 px-8 flex-items-center'>
						<button
							onClick={onClose}
							type='button'
							className='size-18 rounded-circle bg-gray-700 text-white flex-justify-center'
						>
							<XSVG width='1.4rem' height='1.4rem' />
						</button>

						<button
							onClick={onExpand}
							type='button'
							className='size-18 rounded-circle bg-gray-700 text-white flex-justify-center'
						>
							<ExpandSVG width='1.8rem' height='1.8rem' />
						</button>
					</div>

					{Array.isArray(tabs?.top) ? (
						<SwitchTab<ITab>
							data={tabs.top}
							defaultActiveTab={tabs.top[0].id}
							classes={{
								root: '!h-40 bg-gray-200 rtl !border-0 py-4 px-8',
								rect: 'bg-white !h-32 rounded',
								tabs: 'gap-8',
							}}
							// onChangeTab={console.log}
							renderTab={(item, activeTab) => (
								<button
									type='button'
									className={clsx(
										'h-full flex-1 px-8 py-4 transition-colors',
										item.id === activeTab ? 'font-medium text-gray-1000' : 'text-gray-700',
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

				<h1 className='text-lg font-medium text-gray-900'>{title}</h1>
			</div>

			{Array.isArray(tabs?.bottom) ? (
				<SwitchTab<ITab>
					data={tabs.bottom}
					defaultActiveTab={tabs.bottom[0].id}
					classes={{
						root: '!h-48 bg-gray-200 rtl !border-0 p-4',
						rect: 'btn-select no-hover !border !h-40',
						tabs: 'gap-8',
					}}
					// onChangeTab={console.log}
					renderTab={(item, activeTab) => (
						<button
							type='button'
							className={clsx(
								'h-full flex-1 rounded transition-colors',
								item.id === activeTab ? 'font-medium text-primary-400' : 'text-gray-700',
							)}
						>
							{item.title}
						</button>
					)}
				/>
			) : (
				tabs?.bottom
			)}
		</div>
	);
};

export default Section;
