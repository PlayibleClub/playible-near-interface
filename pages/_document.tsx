import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;0,1000;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900;1,1000&display=swap"
            rel="stylesheet"
          />
          <title>Playible - Next Generation of Fantasy Sports</title>
          <link rel="icon" type="image/png" sizes="16x16" href="images/favicon.png" />

          <meta name="description" content="Playible - Next Generation of Fantasy Sports" />
          <meta name="keywords" content="fantasy, sports, draft, crypto, cryptocurrency, play" />

          <meta property="og:title" content="Playible - Next Generation of Fantasy Sports" />
          <meta
            property="og:description"
            content="Playible - Next Generation of Fantasy Sports"
          />
          <meta property="og:url" content="https://playible.io/" />
          <meta property="og:type" content="website" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
