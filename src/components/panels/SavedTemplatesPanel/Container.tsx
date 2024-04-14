import { XSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import Templates from './Templates';

interface ContainerProps {
	close: () => void;
}

const Container = ({ close }: ContainerProps) => {
	const t = useTranslations();

	return (
		<>
			<div className='sticky top-0 z-10 min-h-56 w-full bg-gray-200 px-24 flex-justify-between'>
				<h1 className='text-xl font-medium text-gray-900'>{t('saved_saturn_templates.title')}</h1>

				<div className='flex gap-24'>
					<button className='icon-hover' type='button' onClick={close}>
						<XSVG width='2rem' height='2rem' />
					</button>
				</div>
			</div>

			<Templates />
		</>
	);
};

export default Container;
