'use client';

import { redirect } from '@/navigation';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return redirect('/watchlist');
};

export default Page;
