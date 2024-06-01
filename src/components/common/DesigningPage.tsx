'use client';

import Button from '@/components/common/Button';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';

const DesigningPage = () => {
	const t = useTranslations();

	const router = useRouter();

	return (
		<div className='flex-column-justify-start gap-40'>
			<div>
				<img src='/static/images/designing-page.png' alt='designing-page' />
			</div>
			<div className=' flex-column-justify-start gap-8'>
				<span className='text-4xl font-medium text-gray-1000'>{t('designing_page.page_on_designing')}</span>
				<span className='text-3xl text-gray-900'>{t('designing_page.please_try_again_later')}</span>
			</div>

			<Button
				onClick={() => router.push('/')}
				className='rounded-3xl border-2 border-primary-300 bg-transparent px-56 py-4  text-2xl text-primary-300 transition-colors hover:bg-primary-100'
			>
				{t('designing_page.return')}
			</Button>
		</div>
	);
};

export default DesigningPage;
