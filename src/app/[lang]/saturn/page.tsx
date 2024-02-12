import Saturn from '@/components/pages/Saturn';
import SavedTemplates from '@/components/pages/Saturn/SavedTemplates';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = async () => {
	return (
		<>
			<SavedTemplates />
			<Saturn />
		</>
	);
};

export default Page;
