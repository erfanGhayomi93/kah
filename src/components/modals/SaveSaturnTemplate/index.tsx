import axios from '@/api/axios';
import routes from '@/api/routes';
import Button from '@/components/common/Button';
import { useAppDispatch } from '@/features/hooks';
import { toggleSaveSaturnTemplate, type ISaveSaturnTemplate } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

const Div = styled.div`
	width: 384px;
	padding: 1.6rem 2.4rem 2.4rem 2.4rem;
	display: flex;
	gap: 2.4rem;
	flex-direction: column;
	align-items: center;
	text-align: center;
`;

interface SaveSaturnTemplateProps extends ISaveSaturnTemplate {}

const SaveSaturnTemplate = ({ baseSymbolTitle, baseSymbolISIN, ...props }: SaveSaturnTemplateProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [loading, setLoading] = useState(false);

	const [name, setName] = useState('');

	const onCloseModal = () => {
		dispatch(toggleSaveSaturnTemplate(null));
	};

	const onSubmit = async (e: React.FormEvent) => {
		try {
			e.preventDefault();

			setLoading(true);

			const content = JSON.stringify({
				baseSymbolTitle,
				baseSymbolISIN,
				...props,
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

	return (
		<Modal style={{ modal: { transform: 'translate(-50%, -50%)' } }} top='50%' onClose={onCloseModal}>
			<Div className='bg-white'>
				<h2 className='text-xl font-medium text-gray-1000'>
					{t('save_saturn_template.save_template', { title: baseSymbolTitle })}
				</h2>

				<form method='get' onSubmit={onSubmit} className='w-full flex-1 gap-36 flex-column'>
					<label className='w-full items-start gap-8 flex-column'>
						<span className='text-lg font-medium text-gray-900'>
							{t('save_saturn_template.input_label')}
						</span>
						<input
							autoFocus
							type='text'
							value={name}
							placeholder={t('save_saturn_template.input_placeholder')}
							className='h-40 w-full rounded border border-gray-500 px-8 text-base'
							onChange={(e) => setName(e.target.value)}
						/>
					</label>

					<div className='w-full gap-8 flex-justify-center'>
						<button
							type='button'
							onClick={onCloseModal}
							className='h-40 flex-1 rounded text-lg btn-disabled-outline'
						>
							{t('common.cancel')}
						</button>

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
			</Div>
		</Modal>
	);
};

export default SaveSaturnTemplate;
