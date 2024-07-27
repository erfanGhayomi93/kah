import { XCircleSVG } from '@/components/icons';
import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	prefix?: string;
	classInput?: ClassesValue;
	num2persianValue?: string;
	error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
	const { prefix, classInput, num2persianValue, error, ...resProps } = props;

	return (
		<div className='relative flex flex-col gap-4'>
			<div
				className={clsx(
					'h-full flex-1 rounded border flex-items-center input-group',
					error ? 'border-error-100' : 'border-gray-200',
				)}
			>
				<input ref={ref} className={clsx('h-48 flex-1 rounded px-8 text-left ltr', classInput)} {...resProps} />

				{!!prefix && (
					<span className='border-r-gray-200 text-gray-500 h-24 w-36 border-r text-tiny flex-justify-center'>
						{prefix}
					</span>
				)}
			</div>

			{!!num2persianValue && !error && (
				<span style={{ top: '5.2rem' }} className='text-gray-800 absolute h-16 text-right text-tiny'>
					{num2persianValue?.split('تومان')[0] + ' '} <span className='text-gray-500'>{'تومان'}</span>
				</span>
			)}

			{error && (
				<span style={{ top: '5.2rem' }} className='text-error-100 absolute flex gap-4 text-tiny'>
					<XCircleSVG width='1.6rem' height='1.6rem' />
					{error}
				</span>
			)}
		</div>
	);
});

export default Input;
