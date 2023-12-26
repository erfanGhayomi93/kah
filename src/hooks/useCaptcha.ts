import { useState } from 'react';

const useCaptcha = () => {
	const [captcha] = useState({
		base64String: null,
		key: null,
	});

	return [{ src: captcha.base64String, key: captcha.key }];
};

export default useCaptcha;
