export type GetEmailTemplateInput = {
	template: 'newDepthChart'
	title: string
	team: string
	depthChartTitle: string
	link: string
}

export const getEmailTemplate = ({
	template,
	title,
	team,
	depthChartTitle,
	link,
}: GetEmailTemplateInput) => {
	const logo = 'https://3dfantasy.ca/img/logo.svg'

	const emailTemplate = {
		newDepthChart: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
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
              ${team}
            </p>
            <p>
              ${depthChartTitle}
            </p>
            <a href=${link}>
              Click here to view
            </a>
          </div>

          <!-- Footer with links -->
          <div class="footer">
            <a href="https://3dfantasy.ca">Website</a>
            <a href="mailto:wilson@3dfantasy.ca">Contact Us</a>
            <a href="https://3dfantasy.ca/unsubscribe?email=%%EMAIL%%">Unsubscribe</a>
          </div>
        </div>
      </body>
    </html>
`,
	}

	return emailTemplate[template]
}
