import bcrypt from 'bcryptjs'
import { db } from '~/lib/db.server'

export const accountFindUniqueByEmail = async (email: string) => {
	const account = await db.account.findUnique({
		where: { email: email },
	})
	return account
}

export const accountCreate = async (email: string, password: string) => {
	const salt = bcrypt.genSaltSync(10)
	const passwordHash = bcrypt.hashSync(password, salt)
	const account = await db.account.create({
		data: {
			email: email,
			password: passwordHash,
		},
	})
	return account
}
