import Header from "../components/site/Header";
import Hero from "../components/site/Hero";
import Services from "../components/site/Services";
import About from "../components/site/About";
import Gallery from "../components/site/Gallery";
import Reviews from "../components/site/Reviews";
import Contact from "../components/site/Contact";
import Footer from "../components/site/Footer";

export default function HomePage() {
  return (
    <div data-testid="home-page">
      <a href="#main-content" className="skip-link">Sări la conținut</a>
      <Header />
      <main id="main-content">
        <Hero />
        <Services />
        <About />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
