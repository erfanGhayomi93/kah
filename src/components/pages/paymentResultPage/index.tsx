'use client';

import paymentFailLight from '@/assets/images/payment_fail_light.png';
import paymentSuccessLight from '@/assets/images/payment_success_light.png';
import { useRouter } from '@/navigation';
import { sepNumbers } from '@/utils/helpers';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const PaymentResultPage = () => {
	const interval = useRef<NodeJS.Timeout | null>(null);

	const t = useTranslations();

	const router = useRouter();

	const [countdown, setCountdown] = useState(5);

	const params = new URLSearchParams(location.search);

	const IsSuccessful = params.get('IsSuccessful');

	const mainContent: Array<{ title: string; amount: string | number }> = [
		{
			title: t('payment_result.price'),
			amount: Number(params.get('Amount')),
		},
		{
			title: t('payment_result.number_transaction'),
			amount: Number(params.get('TransactionNumber')),
		},
		{
			title: t('payment_result.tracking_code'),
			amount: Number(params.get('TraceNo')),
		},
		{
			title: t('payment_result.type_payment'),
			amount: String(params.get('BankName') ?? '-'),
		},
	];

	const clearCountdown = () => {
		if (typeof interval.current === 'number') clearInterval(interval.current);
	};

	useEffect(() => {
		interval.current = setInterval(() => {
			setCountdown((prevState) => prevState - 1);
		}, 1000);

		return () => {
			clearCountdown();
		};
	}, []);

	useEffect(() => {
		if (countdown > 0) return;

		router.push('/');
		clearCountdown();
	}, [countdown]);

	return (
		<div className=' flex h-screen items-center justify-center bg-gray-200'>
			<div className='flex h-4/5 w-3/12 flex-col items-center  justify-start gap-32 rounded-md bg-white p-24 shadow-sm'>
				<div className='flex flex-col items-center gap-16'>
					<div className='pb-24'>
						{IsSuccessful === 'True' ? (
							<Image src={paymentSuccessLight} alt='' />
						) : (
							<Image src={paymentFailLight} alt='' />
						)}
					</div>
					<span
						className={clsx('text-2xl font-bold', {
							'text-success-200': IsSuccessful === 'True',
							'text-error-200': IsSuccessful === 'False',
						})}
					>
						{t(`payment_result.payment_${IsSuccessful === 'True' ? 'success' : 'error'}_title`)}
					</span>
					<span className='text-base text-gray-900'>
						{t(`payment_result.payment_${IsSuccessful === 'True' ? 'success' : 'error'}_desc`)}
					</span>
				</div>

				<ul className='flex w-full flex-1 flex-col'>
					{mainContent.map((content, index) => (
						<li
							key={index}
							className={clsx(
								'flex flex-1 items-center justify-between border-b border-gray-300 p-16 text-base',
								{
									'border-none': index === 3,
								},
							)}
						>
							<span className='text-gray-800'>{content.title}</span>
							<div className='gap-6 flex items-center text-base'>
								<span className='text-gray-900'>
									{index === 0 ? sepNumbers(String(content.amount)) : content.amount}
								</span>
								<span className='pr-4 text-gray-800'>{index === 0 && t('common.rial')}</span>
							</div>
						</li>
					))}
				</ul>

				<div className='text-3xl text-info'>{`00:0${Math.max(0, countdown)}`}</div>

				<div className='flex w-full flex-col items-center gap-20'>
					<button
						onClick={() => router.push('/')}
						className='rounded-base h-48 w-full text-base font-medium btn-info-outline'
					>
						{t('payment_result.return_to_app')}
					</button>
				</div>
			</div>
		</div>
	);
};

export default PaymentResultPage;
