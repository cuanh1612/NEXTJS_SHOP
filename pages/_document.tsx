import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
            <Html lang='en'>
                <Head lang='en'>
                    <meta name="description" content="Next Shop HUYDEV E-commerce website with Next.js" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument