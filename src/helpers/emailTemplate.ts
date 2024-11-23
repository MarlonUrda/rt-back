export const emailTemplate = (user: string, code: string) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

  <head>
    <link rel="preload" as="image" href="https://react-email-demo-3kjjfblod-resend.vercel.app/static/dropbox-logo.png" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" /><!--$-->
  </head>
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Cambia tu contraseña de Rotten Minds
  </div>

  <body style="background-color:transparent;padding:10px 0">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;background-color:transparent;border:3px solid #000000;padding:45px">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr>
                  <td><img alt="Rotten Minds" height="100" src="https://firebasestorage.googleapis.com/v0/b/cervant-admin-panel.appspot.com/o/tenants%2Fpublic%2Fnotebit%2Flogo2.png?alt=media" style="display:block;outline:none;border:none;text-decoration:none;" widht="750"/>
                    <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:black">Hola ${user},</p>
                    <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:black">
					Alguien solicitó un cambio de contraseña para tu cuenta de Rotten Minds. Si fuiste tú, usa el siguiente código para cambiar tu contraseña:</p>
					

					<h2 style="font-size:24px;line-height:32px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:600;color:black">${code}</h2>


                    <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:black">
					Si no solicitaste un cambio de contraseña, ignora este mensaje.
					</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table><!--/$-->
  </body>

</html>
  `
}

//<img alt="Notebit" height="45" src="https://firebasestorage.googleapis.com/v0/b/cervant-admin-panel.appspot.com/o/tenants%2Fpublic%2Fnotebit%2Flogo.png?alt=media" style="display:block;outline:none;border:none;text-decoration:none" width="233" />