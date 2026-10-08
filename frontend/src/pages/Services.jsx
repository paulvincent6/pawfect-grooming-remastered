
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./services.css";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/services"
        );

        if (!response.ok) {
          throw new Error("Failed to load services.");
        }

        const data = await response.json();

        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Load services error:", err);
        setError("Unable to load grooming services.");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const activeServices = services.filter(
    (service) =>
      !service.status ||
      service.status.toLowerCase() === "active"
  );

  const formatPrice = (price) => {
    return `₱${Number(price).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <>
      <Navbar />

      <div className="customer-services-page">
        <section className="customer-services-hero">
          <h1>Our Services</h1>
          <p>
            Quality grooming and care for your furry companions.
          </p>
        </section>

        <main className="customer-services-content">
          <div className="customer-services-heading">
            <h2>🐾 Grooming Services</h2>
            <p>
              Explore our available grooming services and
              choose the best one for your pet.
            </p>
          </div>

          {loading && (
            <p className="customer-services-message">
              Loading services...
            </p>
          )}

          {error && (
            <p className="customer-services-error">{error}</p>
          )}

          {!loading && !error && activeServices.length === 0 && (
            <p className="customer-services-message">
              No grooming services are available right now.
            </p>
          )}

          {!loading && !error && activeServices.length > 0 && (
            <div className="customer-services-grid">
              {activeServices.map((service) => (
                <article
                  className="customer-service-card"
                  key={service.service_id}
                >
                  <div className="customer-service-card-top">
                    <span className="customer-service-icon">
                      🐶
                    </span>
                    <span className="customer-service-price">
                      {formatPrice(service.price)}
                    </span>
                  </div>

                  <h3>{service.name}</h3>

                  <p className="customer-service-description">
                    {service.description ||
                      "Professional grooming care for your pet."}
                  </p>

                  <div className="customer-service-bottom">
                    <span className="customer-service-duration">
                      🕒 {service.duration} minutes
                    </span>

                    <a
                      href="/booking"
                      className="customer-service-book"
                    >
                      Book Now →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Services;
