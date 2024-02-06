import axios from '@/api/axios';
import { useAllSavedTemplatesQuery } from '@/api/queries/saturnQueries';
import routes from '@/api/routes';
import Loading from '@/components/common/Loading';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getSaturnActiveTemplate, setSaturnActiveTemplate } from '@/features/slices/uiSlice';
import { useDebounce } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Template from './Template';

const Templates = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const queryClient = useQueryClient();

	const { setDebounce } = useDebounce();

	const saturnActiveTemplate = useAppSelector(getSaturnActiveTemplate);

	const { data: savedTemplates, isFetching } = useAllSavedTemplatesQuery({
		queryKey: ['useAllSavedTemplates'],
	});

	const onPin = (template: Saturn.Template) => {
		setDebounce(async () => {
			try {
				const isPinned = !template.isPinned;

				const response = await axios.post(routes.saturn.Pin, {
					saturnId: template.id,
					isPinned,
				});
				const data = response.data;

				if (savedTemplates) {
					const templates = (JSON.parse(JSON.stringify(savedTemplates)) as Saturn.Template[]).map((item) => {
						if (template.id === item.id) item.isPinned = isPinned;
						return item;
					});

					queryClient.setQueryData(['useAllSavedTemplates'], templates);
				}

				if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');
			} catch (e) {
				//
			}
		}, 100);
	};

	const onSelect = (item: Saturn.Template) => {
		dispatch(setSaturnActiveTemplate(item));
	};

	if (isFetching)
		return (
			<div className='relative flex-1'>
				<Loading />
			</div>
		);

	if (!Array.isArray(savedTemplates) || savedTemplates.length === 0)
		return (
			<div className='relative flex-1'>
				<div className='absolute flex-col gap-16 flex-justify-center center'>
					<Image priority width='120' height='120' alt='profile' src='/static/images/no-template-found.png' />
					<span className='whitespace-nowrap text-base font-medium text-gray-900'>
						{t('saved_saturn_templates.no_data')}
					</span>
				</div>
			</div>
		);

	return (
		<ul className='relative flex-1 gap-16 px-24 pt-16 flex-column'>
			{savedTemplates.map((item) => (
				<Template
					key={item.id}
					{...item}
					isActive={Boolean(saturnActiveTemplate && saturnActiveTemplate.id === item.id)}
					onPin={() => onPin(item)}
					onSelect={() => onSelect(item)}
				/>
			))}
		</ul>
	);
};

export default Templates;
