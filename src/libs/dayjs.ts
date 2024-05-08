import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekday from 'dayjs/plugin/weekday';
import jalaliday from 'jalaliday';

dayjs.extend(jalaliday);
dayjs.extend(weekday);
dayjs.extend(isBetween);
dayjs.extend(updateLocale);
dayjs.extend(relativeTime);
dayjs.extend(weekday);

dayjs.updateLocale('en', {
	weekStart: 6,
});

export default dayjs;
