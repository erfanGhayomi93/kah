import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import jalaliday from 'jalaliday';

dayjs.extend(jalaliday);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
	weekStart: 6,
});

export default dayjs;
