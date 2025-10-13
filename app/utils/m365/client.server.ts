import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials'

const credential = new ClientSecretCredential(
    process.env.MICROSOFT_APP_TENANT_ID,
    process.env.MICROSOFT_APP_CLIENT_ID,
    process.env.MICROSOFT_CLIENT_SECRET
)

// Create an authentication provider using the credential
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
})

// Initialize the Graph client
export const client = Client.initWithMiddleware({
    authProvider: authProvider,
})
