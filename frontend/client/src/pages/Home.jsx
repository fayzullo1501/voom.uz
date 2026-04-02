import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/Home/Hero";
import Partners from "../components/Home/Partners";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import PromoBanner from "../components/Home/PromoBanner";
import HowItWorks from "../components/Home/HowItWorks";
import DownloadApp from "../components/Home/DownloadApp";
import NewsSection from "../components/Home/NewsSection";
import RequestForm from "../components/Home/RequestForm";
import SEO from "../components/SEO";

function Home({ lang }) {
  const { t } = useTranslation("home");

  return (
    <>

      <SEO
        title={t("seo.title")}
        description={t("seo.description")}
        path=""
      />
      
      <Header lang={lang} />
      <Hero lang={lang} />
      <Partners lang={lang} />
      {/* <WhyChooseUs lang={lang} /> */}
      <PromoBanner lang={lang} />
      <HowItWorks lang={lang} />
      <DownloadApp lang={lang} />
      <NewsSection lang={lang} />
      <RequestForm lang={lang} />
      <Footer lang={lang} />
    </>
  );
}

export default Home;
