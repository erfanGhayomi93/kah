import axios from '@/api/axios';
import routes from '@/api/routes';
import Button from '@/components/common/Button';
import { useAppDispatch } from '@/features/hooks';
import { setAddSaturnTemplateModal } from '@/features/slices/modalSlice';
import { type IAddSaturnTemplate } from '@/features/slices/types/modalSlice.interfaces';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import Modal, { Header } from '../Modal';

interface AddSaturnTemplateProps extends IAddSaturnTemplate {}

const AddSaturnTemplate = forwardRef<HTMLDivElement, AddSaturnTemplateProps>(
	({ baseSymbolTitle, baseSymbolISIN, activeTab, options, ...props }, ref) => {
		const t = useTranslations();

		const dispatch = useAppDispatch();

		const [loading, setLoading] = useState(false);

		const [name, setName] = useState('');

		const onCloseModal = () => {
			dispatch(setAddSaturnTemplateModal(null));
		};

		const onSubmit = async (e: React.FormEvent) => {
			try {
				e.preventDefault();

				setLoading(true);

				const content = JSON.stringify({
					baseSymbolTitle,
					baseSymbolISIN,
					activeTab,
					options,
				});
				const response = await axios.post(routes.saturn.Upsert, {
					name,
					content,
				});
				const data = response.data;

				if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

				onCloseModal();
			} catch (e) {
				setLoading(false);
			}
		};

		const placeholder = t('save_saturn_template.input_placeholder');

		return (
			<Modal
				{...props}
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				top='50%'
				onClose={onCloseModal}
				ref={ref}
			>
				<div
					style={{ width: '388px' }}
					className='flex-col bg-white flex-justify-center darkBlue:bg-gray-50 dark:bg-gray-50'
				>
					<Header
						onClose={onCloseModal}
						label={t('save_saturn_template.save_template', { title: baseSymbolTitle })}
					/>

					<form method='get' onSubmit={onSubmit} className='w-full flex-1 gap-36 p-24 flex-column'>
						<label className='relative h-40 rounded flex-items-center input-group'>
							<input
								autoFocus
								type='text'
								maxLength={36}
								value={name}
								className='h-40 w-full rounded px-16 text-base'
								onChange={(e) => setName(e.target.value)}
							/>

							<span className={cn('flexible-placeholder', name && 'active')}>{placeholder}</span>

							<fieldset className={cn('flexible-fieldset', name && 'active')}>
								<legend>{placeholder}</legend>
							</fieldset>
						</label>

						<div className='w-full gap-8 flex-justify-center'>
							<Button
								loading={loading}
								disabled={name.length === 0}
								type='submit'
								className='h-40 flex-1 rounded text-lg font-medium btn-primary'
							>
								{t('common.save')}
							</Button>
						</div>
					</form>
				</div>
			</Modal>
		);
	},
);

export default AddSaturnTemplate;
