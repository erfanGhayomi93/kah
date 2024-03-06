import { cloneElement, forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';

interface MoveableProps {
	enabled?: boolean;
	children: React.ReactElement;
}

const Moveable = forwardRef<HTMLElement, MoveableProps>(({ enabled = true, children }, ref) => {
	const childRef = useRef<HTMLElement>(null);

	useImperativeHandle(ref, () => childRef.current!);

	const onMouseDown = (e: MouseEvent) => {
		try {
			if (e.button !== 0) return;

			try {
				const tagName = (e.target as HTMLElement).tagName;
				if (['INPUT', 'BUTTON', 'TEXTAREA', 'LABEL'].includes(tagName)) return;
			} catch (e) {
				//
			}

			window.addEventListener('mousemove', onMoveModal);
			window.addEventListener('mouseup', onMouseUp);
		} catch (e) {
			//
		}
	};

	const onMoveModal = (e: MouseEvent) => {
		try {
			const eChild = childRef.current;
			if (!eChild) return;

			eChild.style.cursor = 'move';

			const { left, top, width, height } = eChild.getBoundingClientRect();

			const { innerWidth, innerHeight } = window;

			if (e.clientX < 0 || e.clientX > innerWidth) {
				eChild.style.left = `${e.clientX < 0 ? width / 2 : innerWidth - width / 2}px`;
				return;
			}
			if (e.clientY < 0 || e.clientY > innerHeight) {
				eChild.style.top = `${e.clientY < 0 ? 0 : innerHeight - height}px`;
				return;
			}

			let positionX = left + width / 2 + e.movementX;
			positionX = Math.max(width / 2, Math.min(positionX, innerWidth - width / 2));

			let positionY = top + e.movementY;
			positionY = Math.max(0, Math.min(positionY, innerHeight - height));

			eChild.style.left = `${positionX}px`;
			eChild.style.top = `${positionY}px`;
			eChild.style.transform = '';
		} catch (e) {
			//
		}
	};

	const onMouseUp = () => {
		if (childRef.current) childRef.current.style.cursor = '';

		window.removeEventListener('mousemove', onMoveModal);
		window.removeEventListener('mouseup', onMouseUp);
	};

	useLayoutEffect(() => {
		const eChild = childRef.current;
		if (!eChild || !enabled) return;

		eChild.addEventListener('mousedown', onMouseDown);

		return () => {
			eChild.removeEventListener('mousedown', onMouseDown);
		};
	}, [childRef.current, enabled]);

	return cloneElement(children, { ref: childRef });
});

export default Moveable;
