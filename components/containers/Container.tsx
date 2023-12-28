import React from 'react';
import DesktopNavbar from '../navbars/DesktopNavbar';
import DesktopHeaderBase from '../headers/DesktopHeaderBase';
import Navbar from '../navbars/Navbar';
import HeaderBase from '../headers/HeaderBase';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { isAdminChecker } from 'utils/admin';
import Head from 'next/head';

const Container = (props) => {
  const { activeName, children } = props;
  const { selector, accountId } = useWalletSelector();

  const isAdmin = isAdminChecker(accountId);

  return (
    <div className="font-montserrat h-full md:h-screen relative hide-scroll bg-indigo-white flex overflow-x-hidden overflow-y-hidden">
      <Head>
        <script
          type="text/javascript"
          async
          dangerouslySetInnerHTML={{
            __html: `
          (function(w, d, s, l, i) {
                w[l] = w[l] || []
                w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" })
                const f = d.getElementsByTagName(s)[0],
                  j = d.createElement(s),
                  dl = l != "dataLayer" ? "&l=" + l : ""
                j.async = true
                j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl
                f.parentNode.insertBefore(j, f)
              })(window,document,'script','dataLayer',"GTM-KQBL75W")`,
          }}
        />

        <title>Playible - Next Generation of Fantasy Sports</title>
        <link rel="icon" type="image/png" sizes="16x16" href="images/favicon.png" />
      </Head>

      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-KQBL75W"
          height="0"
          width="0"
          className="hidden"
        ></iframe>
      </noscript>

      <div className="invisible w-0 md:visible md:w-full">
        <div className="flex bg-indigo-white">
          <DesktopNavbar
            isAdmin={isAdmin}
            isLoggedIn={selector.isSignedIn()}
            color="indigo-navbargrad2"
            secondcolor="indigo-navbargrad1"
            activeName={activeName}
          />
          <div className="flex flex-col w-screen h-screen">
            <DesktopHeaderBase />
            {children}
          </div>
        </div>
      </div>

      <div className="visible md:invisible h-fit overflow-x-auto z-40">
        <Navbar isAdmin={isAdmin} isLoggedIn={selector.isSignedIn()} />
        <HeaderBase />

        {children}
      </div>
    </div>
  );
};

export default Container;
