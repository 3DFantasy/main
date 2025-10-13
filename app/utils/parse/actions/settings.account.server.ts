import { default as bcrypt, default as bcryptjs } from 'bcryptjs'
import Result, { err, ok } from 'true-myth/result'
import { db } from '~/lib/db.server'
import { parseFormData } from '~/utils/parse/index.server'

import type { Error } from '~/types'

export type ParseApiTeamCheckActionOutput = {
    email: string
    currentPassword: string
    newPassword: string
    newPasswordHash: string
}

export const parseSettingsAccountAction = async ({
    formData,
}: {
    formData: FormData
}): Promise<Result<ParseApiTeamCheckActionOutput, Error>> => {
    const email = parseFormData(
        formData.get('email'),
        'parseSettingsAccountAction-email'
    )
    const currentPassword = parseFormData(
        formData.get('currentPassword'),
        'parseSettingsAccountAction-currentPassword'
    )
    const newPassword = parseFormData(
        formData.get('newPassword'),
        'parseSettingsAccountAction-newPassword'
    )
    const newPasswordConfirm = parseFormData(
        formData.get('newPasswordConfirm'),
        'parseSettingsAccountAction-newPasswordConfirm'
    )

    if (
        email.isErr ||
        currentPassword.isErr ||
        newPassword.isErr ||
        newPasswordConfirm.isErr
    ) {
        return err({
            message:
                'Something went wrong parsing formData - parseSettingsAccountAction',
            code: 500,
        })
    }
    if (
        currentPassword.value.length === 0 ||
        newPassword.value.length === 0 ||
        newPasswordConfirm.value.length === 0
    ) {
        return err({
            message: 'Password cannot be blank',
            code: 401,
        })
    }
    if (newPasswordConfirm.value !== newPassword.value) {
        return err({
            message: 'New password & Confirm new password do not match',
            code: 401,
        })
    }

    const account = await db.account.findUnique({
        where: { email: email.value },
    })

    if (!account) {
        return err({
            message: 'Account does not exist',
            code: 401,
        })
    }

    const passwordsMatch = await bcryptjs.compare(
        currentPassword.value,
        account.password
    )
    if (!passwordsMatch) {
        return err({
            message: 'Current password is incorrect',
            code: 401,
        })
    }

    const salt = bcrypt.genSaltSync(10)
    const newPasswordHash = bcrypt.hashSync(newPassword.value, salt)

    return ok({
        email: email.value,
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
        newPasswordHash,
    })
}
