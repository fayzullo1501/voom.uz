import Header from "../components/layout/Header";
import Hero from "../components/home/Hero";
import DocsGrid from "../components/home/DocsGrid";
import Footer from "../components/layout/Footer";

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <DocsGrid />
      <Footer />
    </div>
  );
};

export default Home;