export type GetEmailTemplateInput = {
	newDepthChartProps?: {
		link: string
		team: string
		title: string
		account: {
			uuid: string
		}
		depthChart: {
			title: string
			uuid: string
		}
	}
	createAccountProps?: {
		title: string
		account: {
			uuid: string
			plainText: string
		}
		depthChart: {
			uuid: string
		}
	}
}

export const getEmailTemplate = ({ newDepthChartProps, createAccountProps }: GetEmailTemplateInput) => {
	const logo = 'https://3dfantasy.ca/img/logo.svg'

	if (newDepthChartProps) {
		return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${newDepthChartProps.title}</title>
            <style type="text/css">
              /* Reset styles */
              body,
              p,
              h1 {
                margin: 0;
                padding: 0;
              }
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
              }
              /* Container for better email client compatibility */
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
              }
              /* Header styles */
              .header {
                background-color: #000000;
                padding: 20px;
              }
              .logo {
                max-height: 50px;
              }
              /* Content styles */
              .content {
                padding: 30px 20px;
              }
              h1 {
                color: #333333;
                margin-bottom: 20px;
              }
              p {
                color: #666666;
                margin-bottom: 20px;
              }
              /* Footer styles */
              .footer {
                background-color: #000000;
                color: #ffffff;
                padding: 20px;
                text-align: center;
              }
              .footer a {
                color: #ffffff;
                text-decoration: underline;
                margin: 0 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Header with logo -->
              <div class="header">
                <img src="${logo}" alt="3DF Logo" class="logo" />
              </div>

              <!-- Main content -->
              <div class="content">
                <h1>New depth chart posted</h1>
                <p>
                  ${newDepthChartProps.team}
                </p>
                <p>
                  ${newDepthChartProps.depthChart.title}
                </p>
                <a href=${newDepthChartProps.link}>
                  Click here to view
                </a>
              </div>

              <!-- Footer with links -->
              <div class="footer">
                <a href="https://3dfantasy.ca">Website</a>
                <a href="mailto:wilson@3dfantasy.ca">Contact Us</a>
                <a href="https://3dfantasy.ca/unsubscribe/${newDepthChartProps.account.uuid}/${newDepthChartProps.depthChart.uuid}">Unsubscribe</a>
              </div>
            </div>
          </body>
        </html>
      `
	} else if (createAccountProps) {
		return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${createAccountProps.title}</title>
            <style type="text/css">
              /* Reset styles */
              body,
              p,
              h1 {
                margin: 0;
                padding: 0;
              }
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
              }
              /* Container for better email client compatibility */
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
              }
              /* Header styles */
              .header {
                background-color: #000000;
                padding: 20px;
              }
              .logo {
                max-height: 50px;
              }
              /* Content styles */
              .content {
                padding: 30px 20px;
              }
              h1 {
                color: #333333;
                margin-bottom: 20px;
              }
              p {
                color: #666666;
                margin-bottom: 20px;
              }
              /* Footer styles */
              .footer {
                background-color: #000000;
                color: #ffffff;
                padding: 20px;
                text-align: center;
              }
              .footer a {
                color: #ffffff;
                text-decoration: underline;
                margin: 0 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Header with logo -->
              <div class="header">
                <img src="${logo}" alt="3DF Logo" class="logo" />
              </div>

              <!-- Main content -->
              <div class="content">
                <h1>Account created</h1>
                <p>
                  3DF account has been created for this email, your password is listed below
                </p>
                <p>
                  ${createAccountProps.account.plainText}
                </p>
                <a href="https://3dfantasy.ca/auth/login/">
                  Click here for login page
                </a>
              </div>

              <!-- Footer with links -->
              <div class="footer">
                <a href="https://3dfantasy.ca">Website</a>
                <a href="mailto:wilson@3dfantasy.ca">Contact Us</a>
                <a href="https://3dfantasy.ca/unsubscribe/${createAccountProps.account.uuid}/${createAccountProps.depthChart.uuid}">Unsubscribe</a>
              </div>
            </div>
          </body>
        </html>
      `
	}

	return 'null'
}
