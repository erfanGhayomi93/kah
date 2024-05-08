import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekday from 'dayjs/plugin/weekday';
import jalaliday from 'jalaliday';

dayjs.extend(jalaliday);
dayjs.extend(weekday);
dayjs.extend(isBetween);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
	weekStart: 6,
});

export default dayjs;
