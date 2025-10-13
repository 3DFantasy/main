import { compareDepthChartList } from '~/dao/depthChartList.server'
import { db } from '~/lib/db.server'
import { timeout } from '~/utils'
import { getDepthChartInfo, sendMail } from '~/utils/index.server'
import { logger } from '~/utils/logger'
import { getEmailTemplate } from '~/utils/m365/emailTemplate.server'
import { teamHandlers } from '~/utils/puppeteer/index.server'

import type { DepthChartObject } from '~/types'

export async function teamCheck({ teamId }: { teamId: number }) {
    const year = Number(process.env.LEAGUE_YEAR)

    let result: DepthChartObject[] | null = null
    if (teamHandlers[teamId as keyof typeof teamHandlers]) {
        result = await teamHandlers[teamId as keyof typeof teamHandlers]()
    }

    if (!result) {
        throw new Error(
            `Something went wrong fetching depth charts for teamId: ${teamId}`
        )
    }

    const compareDepthChartListResp = await compareDepthChartList({
        teamId,
        year,
        value: result,
    })

    if (compareDepthChartListResp.isErr) {
        throw new Error(compareDepthChartListResp.error.message)
    }

    if (
        compareDepthChartListResp.value.newDepthChart &&
        process.env.NODE_ENV !== 'development'
    ) {
        const newDepthChartObj = compareDepthChartListResp.value.newDepthChart
        const depthChartDateInfo = getDepthChartInfo(new Date())
        // create new chart
        const newDepthChart = await db.depthChart.create({
            data: {
                teamId,
                title: newDepthChartObj.title,
                value: newDepthChartObj.href,
                year,
                depthChartListId:
                    compareDepthChartListResp.value.depthChartList.id,
                season: depthChartDateInfo.season,
                week: depthChartDateInfo.week,
            },
        })

        // update existing list
        await db.depthChartList.update({
            where: {
                id: compareDepthChartListResp.value.depthChartList.id,
            },
            data: {
                value: JSON.stringify(result),
            },
        })

        const notificationField =
            `team${teamId}Notification` as keyof typeof db.account.fields
        let allAccountsToMail: {
            id: number
            uuid: string
            email: string
        }[] = []
        let skip = 0
        const take = 50
        let hasMore = true

        while (hasMore) {
            const accountsBatch = await db.account.findMany({
                where: {
                    [notificationField]: true,
                },
                select: {
                    id: true,
                    uuid: true,
                    email: true,
                },
                take,
                skip,
            })

            allAccountsToMail = [...allAccountsToMail, ...accountsBatch]

            if (accountsBatch.length < take) {
                hasMore = false
            } else {
                skip += take // Move to the next batch
            }
        }

        const teamTitle = process.env[`TEAM_${teamId}_TITLE`] as string
        const emailTitle = `New Depth Chart Posted: ${teamTitle}`

        // send emails
        for (const account of allAccountsToMail) {
            const sendMailResp = await sendMail({
                message: {
                    subject: emailTitle,
                    body: {
                        content: getEmailTemplate({
                            newDepthChartProps: {
                                title: emailTitle,
                                account: {
                                    uuid: account.uuid,
                                },
                                depthChart: {
                                    title: newDepthChartObj.title,
                                    uuid: newDepthChart.uuid,
                                },
                                link: newDepthChartObj.href,
                                team: teamTitle,
                            },
                        }),
                        contentType: 'HTML',
                    },
                    toRecipients: [
                        { emailAddress: { address: account.email } },
                    ],
                },
                saveToSentItems: 'true',
            })

            if (sendMailResp.isErr) {
                throw new Error(sendMailResp.error.message)
            }
            await timeout(1)
        }
    }

    logger.info(
        'resque/jobs/teamCheck.server.ts',
        `Team${teamId}Check complete`
    )
    return true
}
