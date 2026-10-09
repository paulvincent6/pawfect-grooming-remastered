
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./home.css";

const serviceIcons = ["🌸", "🐶", "🛁", "🛁", "✂️"];

const benefits = [
  {
    icon: "❤️",
    title: "Gentle Grooming",
    description:
      "We focus on making grooming a comfortable and enjoyable experience for your furry friends.",
  },
  {
    icon: "🏆",
    title: "Personalized Care",
    description:
      "Every pet is unique. Our grooming services are designed with your pet's individual needs in mind.",
  },
  {
    icon: "🌿",
    title: "Pet-Friendly Experience",
    description:
      "We aim to provide a welcoming environment where dogs and cats receive the attention they deserve.",
  },
];

function Home() {
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  // GET SERVICES FROM DATABASE
  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load services");
        }

        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load services:", error);
      })
      .finally(() => {
        setServicesLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />

      <main className="home-page">
        {/* =====================================
            HERO SECTION
        ===================================== */}
        <section className="home-hero">
          <div className="home-paw home-paw-left">🐾</div>
          <div className="home-paw home-paw-right">🐾</div>

          <div className="home-hero-inner">
            <div className="home-pet-illustrations">
              <span className="home-pet-small">🐱</span>
              <span className="home-pet-large">🐱</span>
              <span className="home-pet-dog">🐕</span>
            </div>

            <div className="home-hero-card">
              <h1>
                Best Grooming for Your
                <br />
                Furry Friends 🐾
              </h1>

              <p>
                Professional pet grooming services that keep
                your pets clean, happy, and healthy.
              </p>

              <Link to="/booking" className="home-primary-btn">
                Book Now
              </Link>
            </div>
          </div>

          <div className="home-hero-wave" />
        </section>

        {/* =====================================
            SERVICES SECTION
        ===================================== */}
        <section className="home-services" id="services">
          <div className="home-section-heading">
            <h2>Our Services</h2>
            <p>
              Everything your pet needs to look and feel
              their absolute best
            </p>
          </div>

          {servicesLoading ? (
            <p className="home-services-message">
              Loading grooming services...
            </p>
          ) : services.length === 0 ? (
            <p className="home-services-message">
              Our grooming services will be listed here soon.
            </p>
          ) : (
            <div className="home-services-grid">
              {services.map((service, index) => (
                <article
                  className="home-service-card"
                  key={service.service_id}
                >
                  <span className="home-service-icon">
                    {serviceIcons[index % serviceIcons.length]}
                  </span>

                  <div className="home-service-title-row">
                    <h3>{service.name}</h3>

                    <span className="home-service-price">
                      ₱{Number(service.price || 0).toFixed(2)}
                    </span>
                  </div>

                  <p>
                    {service.description ||
                      "A grooming service to help your pet look and feel their best."}
                  </p>
                </article>
              ))}
            </div>
          )}

          <Link to="/booking" className="home-outline-btn">
            Book a Grooming Service
          </Link>
        </section>

        {/* =====================================
            WHY CHOOSE US SECTION
        ===================================== */}
        <section className="home-why">
          <div className="home-section-heading home-heading-light">
            <h2>Why Pawfect Grooming?</h2>
            <p>
              We treat every pet like our own family member
            </p>
          </div>

          <div className="home-benefits-grid">
            {benefits.map((benefit) => (
              <article
                className="home-benefit-card"
                key={benefit.title}
              >
                <span className="home-benefit-icon">
                  {benefit.icon}
                </span>

                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =====================================
            HAPPY PET PARENTS
        ===================================== */}
        <section className="home-testimonials">
          <div className="home-section-heading">
            <h2>Happy Pet Parents 🐾</h2>
            <p>
              Your pet's comfort and happiness matter to us.
            </p>
          </div>

          <div className="home-testimonial-intro">
            <span>🐾</span>
            <h3>Every happy pet has a story.</h3>
            <p>
              After a completed grooming appointment,
              customers can share their experience
              through our review system.
            </p>
          </div>
        </section>

        {/* =====================================
            FINAL BOOKING SECTION
        ===================================== */}
        <section className="home-cta">
          <h2>Ready for a Pampered Pet? 🛁</h2>

          <p>
            Book an appointment today and give your furry
            friend the royal treatment they deserve!
          </p>

          <Link to="/booking" className="home-cta-btn">
            Book an Appointment
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
  