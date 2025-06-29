import { default as bcrypt } from 'bcryptjs'

export function generatePassword({ length = 16 }: { length?: number }): {
	plainText: string
	hash: string
} {
	const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
	const numberChars = '0123456789'
	const specialChars = '!@#$%^&*?'

	const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars

	let password = ''

	// Ensure at least one of each character type
	password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length))
	password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length))
	password += numberChars.charAt(Math.floor(Math.random() * numberChars.length))
	password += specialChars.charAt(Math.floor(Math.random() * specialChars.length))

	// Fill the rest of the password
	for (let i = password.length; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * allChars.length)
		password += allChars.charAt(randomIndex)
	}

	// Shuffle the password characters
	password
		.split('')
		.sort(() => Math.random() - 0.5)
		.join('')

	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt.hashSync(password, salt)

	return {
		plainText: password,
		hash,
	}
}
