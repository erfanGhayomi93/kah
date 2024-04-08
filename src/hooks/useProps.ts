import { useLayoutEffect, useState } from 'react';

const useProps = <T, O = T>(p: T, propsValidation: (oldProps: T | O, newProps: T | O) => O) => {
	const [props, setProps] = useState<O>(propsValidation(p, p));

	useLayoutEffect(() => {
		setProps(propsValidation(p, props));
	}, [p]);

	return props;
};

export default useProps;
