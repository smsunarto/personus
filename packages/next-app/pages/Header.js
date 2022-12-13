import Head from "next/head";

function Header() {
  return (
    <Head>
      <title>Personus</title>
      <meta name="description" content="Personus demo site" />
      <link rel="icon" href="/unicorn.png" />
      <meta property="og:title" content="🦄 Personus" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://web3starterkit.vercel.app/" />
      <meta property="og:site_name" content="🦄 Personus"></meta>
      <meta property="og:description" content="Personus demo site" />
      <meta name="twitter:title" content="🦄 Personus" />
      <meta name="twitter:description" content="Personus demo site" />
    </Head>
  );
}

export default Header;
