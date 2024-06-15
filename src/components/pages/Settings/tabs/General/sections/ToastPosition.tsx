import { NotificationSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getToastPosition, setToastPosition } from '@/features/slices/uiSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { toast, type ToastPosition } from 'react-toastify';

interface IButtons {
	title: string;
	id: ToastPosition;
	className: string;
}

const ToastPositionSettings = () => {
	const t = useTranslations();

	const toastPosition = useAppSelector(getToastPosition);
	const dispatch = useAppDispatch();

	const buttons: IButtons[] = [
		{
			title: t('settings_page.bottom_left'),
			id: 'bottom-left',
			className: 'bottom-0 left-8',
		},
		{
			title: t('settings_page.bottom_right'),
			id: 'bottom-right',
			className: 'bottom-0 right-8',
		},
		{
			title: t('settings_page.top_left'),
			id: 'top-left',
			className: 'top-0 left-8',
		},
		{
			title: t('settings_page.top_right'),
			id: 'top-right',
			className: 'top-0 right-8',
		},
	];

	return (
		<div className='gap-16 flex-justify-between'>
			{buttons.map((item) => (
				<button
					key={item.id}
					className={clsx(
						'relative w-full  rounded-md !border py-48 transition-colors flex-justify-center',
						item.id === toastPosition
							? 'bg-light-secondary-100 border-transparent'
							: 'border-light-gray-200 hover:btn-hover',
					)}
					onClick={() => {
						dispatch(setToastPosition(item.id));
						toast.success(t('settings_page.changed_toast_position'), { position: item.id, autoClose: 500 });
					}}
				>
					<span
						className={clsx(
							'absolute ' + item.className,
							item.id === toastPosition ? 'text-light-primary-100' : 'text-light-gray-200',
						)}
					>
						{<NotificationSVG width={'3.9rem'} height={'3.9rem'} />}
					</span>
					{item.title}
				</button>
			))}
		</div>
	);
};

export default ToastPositionSettings;
