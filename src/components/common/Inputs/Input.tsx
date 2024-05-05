import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	prefix?: string,
	classInput?: string,
	num2persianValue?: string
}


const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {

	const { prefix, classInput, num2persianValue, ...resProps } = props;

	// console.log('value', value);

	// useEffect(() => {
	// 	value && console.log('value', convertStringToInteger(value as string));
	// }, [value]);


	return (
		<div className='relative flex flex-col gap-4'>
			<div className='h-full flex-1 rounded border border-gray-500 flex-items-center input-group'>
				<input
					ref={ref}
					className={clsx('h-40 flex-1 rounded px-8 text-left ltr', {
						[classInput ?? '']: !!classInput
					})}
					{...resProps}
				/>

				{
					!!prefix && (
						<span className='h-24 w-36 border-r border-r-gray-500 text-tiny text-gray-700 flex-justify-center'>
							{prefix}
						</span>
					)
				}

			</div>

			{
				!!num2persianValue && (
					<span style={{ top: '4.8rem' }} className='absolute h-16 text-right text-sm text-gray-1000'>
						{num2persianValue}
					</span>
				)
			}
		</div>
	);
});

export default Input;
