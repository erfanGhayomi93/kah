import { base64decode, base64encode } from './helpers';

interface ICookieOptions {
	secure?: boolean;
	sameSite?: 'Lax' | 'Strict' | 'None';
	maxAgeInSeconds?: number;
	expires?: number;
	path?: string;
	partitioned?: boolean;
	httpOnly?: boolean;
	domain?: string;
}

export const getCookie = (name: string): string | null => {
	try {
		const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
		return v ? v[2] : null;
	} catch (e) {
		return null;
	}
};

export const setCookie = (name: string, value: string, options?: ICookieOptions) => {
	try {
		let newCookie = `${name}=${value}`;

		if (options) {
			if (options?.domain) newCookie += `; Domain=${options.domain}`;
			if (options?.maxAgeInSeconds) newCookie += `; Max-Age=${options.maxAgeInSeconds}`;
			newCookie += `; Path=${options?.path ?? '/'}`;
			if (options?.sameSite) newCookie += `; SameSite=${options.sameSite}`;
			if (options?.secure) newCookie += '; Secure';
			if (options?.partitioned) newCookie += '; Partitioned';
			if (options?.httpOnly) newCookie += '; HttpOnly';
		}

		document.cookie = newCookie;
	} catch (e) {
		//
	}
};

export const deleteCookie = (name: string) => {
	document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

// Client ID
export const getClientId = () => getCookie('kahkeshan_client_id');

export const setClientId = (value: string) => setCookie('kahkeshan_client_id', value, { maxAgeInSeconds: 86400 });

export const deleteClientId = () => deleteCookie('kahkeshan_client_id');

// Broker Client ID
export const getBrokerClientId = (): [string | null, number | null] => {
	try {
		const clientId = getCookie('br_client_id');

		if (clientId) {
			const decodedClientId = base64decode(clientId);

			if (decodedClientId) {
				const [token, brokerCode] = decodedClientId.split('^');
				return [token ?? '', isNaN(Number(brokerCode)) ? -1 : Number(brokerCode)];
			}
		}
	} catch (e) {
		deleteBrokerClientId();
	}

	return [null, null];
};

export const setBrokerClientId = (value: string) =>
	setCookie('br_client_id', base64encode(value), { maxAgeInSeconds: 86400 });

export const deleteBrokerClientId = () => deleteCookie('br_client_id');
