export type DepthChartObject = {
	title: string
	href: string
}

export type Error = {
	code: number
	message: string
}

export type PXPAPIResponseTeam = {
	fullName: string
	competitorId: string
	details: {
		key: string
		brand: {
			logo: string
			theme: {
				dark: {
					logo: {
						svg: string
					}
					primaryColor: string
					secondaryColor: string
				}
				light: {
					logo: {
						svg: string
					}
					primaryColor: string
					secondaryColor: string
				}
			}
			primaryColor: string
			secondaryColor: string
		}
		firstName: string
		shortName: string
		secondName: string
		abbreviation: string
		officialName: string
	}
}

export type PXPAPIResponseInfoObj = {
	id: string
	teamId: string
	type: string
	subType: string
	description: string
	clock: string
	timestamp: number
	phase: string
	phaseQualifier: string
	isScoring: boolean
	playStartPosition: string
}

export type PXPAPIResponse = {
	data: {
		betGeniusFixtureId: string
		preferredSourceIds: { matchActionsSourceId: string }
		scoreboardInfo: {
			matchStatus: string
			currentPhase: string
			awayScore: number
			homeScore: number
			awayTimeoutsLeft: number
			homeTimeoutsLeft: number
			totalTimeouts: number
			scoreByPhases: {
				awayScore: { quarter1: number; quarter2: number; quarter3: number; quarter4: number }
				homeScore: { quarter1: number; quarter2: number; quarter3: number; quarter4: number }
			}
			timeRemainingInPhase: string
			possession: string
			down: number
			yardsToGo: number
			totalPhases: number
			phaseQualifier: string
			clockUnreliable: boolean
		}
		matchInfo: {
			roundId: string
			roundName: string
			scheduledStartTime: string
			venueName: string
			seasonId: string
			seasonName: string
			homeTeam: PXPAPIResponseTeam
			awayTeam: PXPAPIResponseTeam
			playedPhases: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'HL'[]
		}
		playByPlayInfo: {
			Q1?: PXPAPIResponseInfoObj[]
			Q2?: PXPAPIResponseInfoObj[]
			Q3?: PXPAPIResponseInfoObj[]
			Q4?: PXPAPIResponseInfoObj[]
			HL?: PXPAPIResponseInfoObj[]
		}
	}
	sport: string
	sportId: string
	competitionId: string
	availableTabs: {
		court: boolean
		teamStats: boolean
		playerStats: boolean
		lineups: boolean
		playByPlay: boolean
	}
}
