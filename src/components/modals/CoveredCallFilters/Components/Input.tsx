import { PercentSVG } from '@/components/icons';
import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
	prefix?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
	const { prefix, ...resProps } = props;

	return (
		<div className='relative flex flex-col gap-4'>
			<div className='h-full flex-1 rounded border border-gray-500 flex-items-center input-group'>
				<input ref={ref} className={clsx('h-48 flex-1 rounded px-8 text-left ltr')} {...resProps} />
				{prefix}
			</div>
		</div>
	);
});

export const Prefix = () => (
	<span className='h-24 w-36 border-r border-r-input text-tiny text-gray-700 flex-justify-center'>
		<PercentSVG width='1.2rem' height='1.2rem' className='text-gray-700' />
	</span>
);

export default Input;
