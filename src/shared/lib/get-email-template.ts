export const getEmailTemplate = (
  url: string,
  type: 'verification' | 'change-email' = 'verification',
) => {
  const title =
    type === 'verification'
      ? 'Вітаємо! Ви зареєструвалися в системі курсів БПР.'
      : 'Зміна електронної пошти';

  const description1 =
    type === 'verification'
      ? 'Ви отримали цей лист, оскільки реєструвалися на платформі курсів безперервного професійного розвитку (БПР) Житомирського базового фармацевтичного фахового коледжу.'
      : 'Ми отримали запит на зміну адреси електронної пошти у вашому профілі на платформі курсів безперервного професійного розвитку (БПР) Житомирського базового фармацевтичного фахового коледжу.';

  const description2 =
    type === 'verification'
      ? 'Щоб завершити реєстрацію та підтвердити свою електронну пошту, будь ласка, перейдіть за посиланням нижче:'
      : 'Перейдіть за посиланням нижче, щоб підтвердити зміну.';

  const description3 =
    type === 'verification'
      ? 'Якщо ви не реєструвалися на нашому сайті, просто проігноруйте цей лист.'
      : 'Якщо ви не змінювали електронну пошту, просто проігноруйте цей лист.';

  const buttonText =
    type === 'verification'
      ? 'Підтвердити електронну пошту'
      : 'Змінити електронну пошту';

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  lang="uk"
>
  <head>
    <title></title>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <!--[if !mso]>-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta name="x-apple-disable-message-reformatting" content="" />
    <meta content="target-densitydpi=device-dpi" name="viewport" />
    <meta content="true" name="HandheldFriendly" />
    <meta content="width=device-width" name="viewport" />
    <meta
      name="format-detection"
      content="telephone=no, date=no, address=no, email=no, url=no"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@500;600;700&amp;display=swap"
      rel="stylesheet"
      type="text/css"
    />
    <style type="text/css">
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Fira Sans', BlinkMacSystemFont, Segoe UI, Helvetica Neue,
          Arial, sans-serif;
      }
    </style>
  </head>
  <body style="background-color: #f0f0f0; min-width: 100%;">
    <div style="padding: 20px;">
      <div
        style="
          width: 100%;
          max-width: 650px;
          margin: 20px auto;
          padding: 40px 20px;
          background-color: #ffffff;
        "
      >
        <div style="text-align: center">
          <img src="${process.env.MINIO_ENDPOINT}/bpr/logo.png" alt="Logo" style="width: 120px; height: auto" />
        </div>

        <h1 style="font-size: 32px; line-height: 1.2; margin: 30px 0; text-align: center; font-family: 'Fira Sans', BlinkMacSystemFont, Segoe UI, Helvetica Neue">
          ${title}
        </h1>

        <p style="font-family: 'Fira Sans', BlinkMacSystemFont, Segoe UI, Helvetica Neue; margin-bottom: 8px; color: #666666; font-size: 16px; line-height: 1.5em; text-align: justify;">
          ${description1}
        </p>
        <p style="font-family: 'Fira Sans', BlinkMacSystemFont, Segoe UI, Helvetica Neue; margin-bottom: 8px; color: #666666; font-size: 16px; line-height: 1.5em; text-align: justify;">
          ${description2}
        </p>
        <p style="font-family: 'Fira Sans', BlinkMacSystemFont, Segoe UI, Helvetica Neue; margin-bottom: 8px; color: #666666; font-size: 16px; line-height: 1.5em; text-align: justify;">
          ${description3}
        </p>
        <p style="font-family: 'Fira Sans', BlinkMacSystemFont, Segoe UI, Helvetica Neue; margin-bottom: 8px; color: #666666; font-size: 16px; line-height: 1.5em; text-align: justify;">З повагою</p>
        <p style="font-family: 'Fira Sans', BlinkMacSystemFont, Segoe UI, Helvetica Neue; margin-bottom: 8px; color: #666666; font-size: 16px; line-height: 1.5em; text-align: justify;">Житомирський базовий фармацевтичний фаховий коледж</p>

        <div style="text-align: center; margin: 32px 0">
          <a href="${url}">
            <button style="font-family: 'Fira Sans', BlinkMacSystemFont, Segoe UI, Helvetica Neue; background-color: #0055ff; color: #fff; padding: 16px 32px; border-radius: 10px; font-size: 18px; text-decoration: none; border: 0; cursor: pointer;">
              ${buttonText}
            </button>
          </a>
        </div>
      </div>
    </div>
  </body>
</html>`;
};
