'use client';

import Button from '@/components/common/Button';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';

const DesigningPage = () => {
	const t = useTranslations();

	const router = useRouter();

	return (
		<div className='gap-40 flex-column-justify-start'>
			<div>
				<img src='/static/images/designing-page.png' alt='designing-page' />
			</div>
			<div className=' gap-8 flex-column-justify-start'>
				<span className='text-gray-800 text-4xl font-medium'>{t('designing_page.page_on_designing')}</span>
				<span className='text-gray-700 text-3xl'>{t('designing_page.please_try_again_later')}</span>
			</div>

			<Button
				onClick={() => router.push('/')}
				className='border-primary-100 text-primary-100 hover:bg-secondary-100 rounded-3xl border bg-transparent  px-56 py-4 text-2xl transition-colors'
			>
				{t('designing_page.return')}
			</Button>
		</div>
	);
};

export default DesigningPage;
