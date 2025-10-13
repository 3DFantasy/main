export type DepthChartObject = {
    title: string
    href: string
}

export type Error = {
    code: number
    message: string
}

export type TeamId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

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
    id: string // DRIVE#-PLAY#
    // REDBLACKS | ARGOS | ELKS | STAMPEDERS | BLUE BOMBERS | ROUGHRIDERS | ALOUETTES | TIGER-CATS | LIONS |
    teamId:
        | '88019'
        | '122345'
        | '114347'
        | '112939'
        | '110380'
        | '106752'
        | '86680'
        | '83579'
        | '93775'
        | string
    type:
        | 'Pass'
        | 'Sack'
        | 'Punt'
        | 'Run'
        | 'Kickoff'
        | 'FieldGoal'
        | 'TwoPoints'
        | 'ThreePoints'
        | 'OnePoint'
        | string
    subType:
        | 'CompletePass'
        | 'IncompletePass'
        | 'Touchdown'
        | 'Penalty'
        | 'Success'
        | 'Failed'
        | string
        | null
    description: string
    clock: string // MM:SS
    timestamp: number // Unix timestamp in milliseconds
    phase: 'Regular' | 'Overtime' | string
    phaseQualifier: '1' | '2' | '3' | '4' | string
    isScoring: boolean
    playStartPosition: string // DOWN & DISTANCE @ TEAM YRD-LINE (3rd & 8 at OTT 37)
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
                awayScore: {
                    quarter1: number
                    quarter2: number
                    quarter3: number
                    quarter4: number
                }
                homeScore: {
                    quarter1: number
                    quarter2: number
                    quarter3: number
                    quarter4: number
                }
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
            ALL: PXPAPIResponseInfoObj[]
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

export type { Account } from './account'
export type { Team } from './team'
