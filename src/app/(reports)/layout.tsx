'use client';

import auth from '@/utils/hoc/auth';

const Layout = ({ children }: { children: ReactNode }) => children;

export default auth(Layout);
