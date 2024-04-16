import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import jalaliday from 'jalaliday';

dayjs.extend(jalaliday);
dayjs.extend(updateLocale);
dayjs.extend(relativeTime);

dayjs.updateLocale('en', {
	weekStart: 6,
});

export default dayjs;
