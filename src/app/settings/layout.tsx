import Main from '@/components/layout/Main';
import ToolBar from '@/components/pages/Settings/components/ToolBar';

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<Main>
			<div className='darkBlue:bg-gray-50 flex-1 rounded bg-white flex-justify-center dark:bg-gray-50'>
				<div className='h-full w-8/12 flex-column'>
					<ToolBar />
					{children}
				</div>
			</div>
		</Main>
	);
};

export default Layout;
