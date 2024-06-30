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
				<span className='text-4xl font-medium text-light-gray-800'>
					{t('designing_page.page_on_designing')}
				</span>
				<span className='text-3xl text-light-gray-700'>{t('designing_page.please_try_again_later')}</span>
			</div>

			<Button
				onClick={() => router.push('/')}
				className='rounded-3xl border border-light-primary-100 bg-transparent px-56 py-4  text-2xl text-light-primary-100 transition-colors hover:bg-light-secondary-100'
			>
				{t('designing_page.return')}
			</Button>
		</div>
	);
};

export default DesigningPage;
