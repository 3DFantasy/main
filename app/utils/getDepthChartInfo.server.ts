interface SeasonInfo {
	season: 'pre' | 'regular' | 'post'
	week: number
}

export function getDepthChartInfo(date: Date = new Date()): SeasonInfo {
	const year = date.getFullYear()

	// Define season boundaries
	const seasonStart = new Date(year, 5, 5) // June 5th (month 5 = June)
	const seasonEnd = new Date(year, 10, 31) // October 31st (month 10 = November)

	let season: 'pre' | 'regular' | 'post'
	let week: number

	if (date < seasonStart) {
		season = 'pre'
		// For pre-season, calculate weeks from January 1st
		const yearStart = new Date(year, 0, 1)
		week = getWeekNumber(yearStart, date)
	} else if (date <= seasonEnd) {
		season = 'regular'
		// For regular season, calculate weeks from June 5th
		week = getWeekNumber(seasonStart, date)
	} else {
		season = 'post'
		// For post-season, calculate weeks from November 1st
		const postSeasonStart = new Date(year, 10, 1) // November 1st
		week = getWeekNumber(postSeasonStart, date)
	}

	return { season, week }
}

function getWeekNumber(startDate: Date, currentDate: Date): number {
	// Find the first Sunday on or after the start date
	const firstSunday = new Date(startDate)
	const daysToSunday = (7 - firstSunday.getDay()) % 7
	firstSunday.setDate(firstSunday.getDate() + daysToSunday)

	// If current date is before the first Sunday, it's week 1
	if (currentDate < firstSunday) {
		return 1
	}

	// Calculate the difference in days and convert to weeks
	const diffTime = currentDate.getTime() - firstSunday.getTime()
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

	return Math.floor(diffDays / 7) + 2 // +2 because we start counting from week 1
}
