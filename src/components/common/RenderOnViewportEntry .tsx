import { useFirstViewportEntry } from '@/hooks';
import React, { Suspense, useRef } from 'react';

interface RenderOnViewportEntryProps extends Partial<IntersectionObserverInit>, React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	loading?: React.ReactNode;
}

const RenderOnViewportEntry = ({
	children,
	loading,
	threshold = 0.2,
	root,
	rootMargin,
	...wrapperProps
}: RenderOnViewportEntryProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const entered = useFirstViewportEntry(ref, { threshold, root, rootMargin });

	return (
		<div ref={ref} {...wrapperProps}>
			{entered && <Suspense fallback={loading}>{children}</Suspense>}
		</div>
	);
};

export default RenderOnViewportEntry;
