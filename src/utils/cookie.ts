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
			if (options?.path) newCookie += `; Path=${options.path}`;
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
	document.cookie = `${name}=;path=/;expires=-1`;
};
