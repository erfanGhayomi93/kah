import Main from '@/components/layout/Main';
import ToolBar from '@/components/pages/Settings/components/ToolBar';

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<Main>
			<div className='flex-1 rounded bg-white flex-justify-center'>
				<div className='h-full w-3/5 flex-column'>
					<ToolBar />
					{children}
				</div>
			</div>
		</Main>
	);
};

export default Layout;
