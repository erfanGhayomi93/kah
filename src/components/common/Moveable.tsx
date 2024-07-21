import { cloneElement, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface MoveableProps {
	enabled?: boolean;
	children: React.ReactElement;
	paddingTop?: number;
	paddingLeft?: number;
	paddingBottom?: number;
	paddingRight?: number;
}

const Moveable = forwardRef<HTMLElement, MoveableProps>(
	({ enabled = true, paddingTop = 0, paddingLeft = 0, paddingBottom = 0, paddingRight = 0, children }, ref) => {
		const childRef = useRef<HTMLElement>(null);

		useImperativeHandle(ref, () => childRef.current!);

		const onMouseDown = (e: MouseEvent) => {
			try {
				if (e.button !== 0) return;

				try {
					const target = e.target as HTMLElement;
					const tagName = target.tagName;
					if (['INPUT', 'BUTTON', 'TEXTAREA', 'LABEL'].includes(tagName)) return;

					const tagClosestName = target.closest('LABEL');
					if (tagClosestName) return;

					const isNotMoveable = target.closest('.no-moveable');
					if (isNotMoveable) return;
				} catch (e) {
					//
				}

				document.body.style.userSelect = 'none';

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

				let positionX = left + e.movementX;
				positionX = Math.max(0, Math.min(positionX, innerWidth - width - paddingRight + paddingLeft));

				let positionY = top + e.movementY;
				positionY = Math.max(0, Math.min(positionY, innerHeight - height - paddingBottom + paddingTop));

				eChild.style.transform = `translate(${positionX}px, ${positionY}px)`;
				eChild.style.top = '0';
				eChild.style.left = '0';
				eChild.style.bottom = '';
				eChild.style.right = '';
			} catch (e) {
				//
			}
		};

		const onMouseUp = () => {
			if (childRef.current) childRef.current.style.cursor = '';

			document.body.style.userSelect = '';

			window.removeEventListener('mousemove', onMoveModal);
			window.removeEventListener('mouseup', onMouseUp);
		};

		useEffect(() => {
			const eChild = childRef.current;
			if (!eChild || !enabled) return;

			eChild.addEventListener('mousedown', onMouseDown);

			return () => {
				eChild.removeEventListener('mousedown', onMouseDown);
			};
		}, [childRef.current, enabled]);

		return cloneElement(children, { ref: childRef });
	},
);

export default Moveable;
