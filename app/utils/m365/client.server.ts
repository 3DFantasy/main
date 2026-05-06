import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials'

let cached: Client | undefined

// Lazy: ClientSecretCredential validates its args in the constructor and throws
// if any are missing, which would crash server boot in test/CI where Azure creds
// are intentionally absent. Only paying that cost when something actually calls
// sendMail keeps the rest of the app bootable without real credentials.
export function getClient(): Client {
    if (cached) return cached
    const credential = new ClientSecretCredential(
        process.env.MICROSOFT_APP_TENANT_ID as string,
        process.env.MICROSOFT_APP_CLIENT_ID as string,
        process.env.MICROSOFT_CLIENT_SECRET as string
    )
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default'],
    })
    cached = Client.initWithMiddleware({ authProvider })
    return cached
}
