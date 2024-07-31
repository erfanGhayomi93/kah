import { useAppSelector } from '@/features/hooks';
import { getTheme } from '@/features/slices/uiSlice';
import { getDeviceColorSchema } from '@/utils/helpers';

const useTheme = () => {
	const theme = useAppSelector(getTheme);

	if (theme === 'system') return getDeviceColorSchema();
	return theme;
};

export default useTheme;
