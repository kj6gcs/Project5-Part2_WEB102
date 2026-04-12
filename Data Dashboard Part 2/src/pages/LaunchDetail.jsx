import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import "../App.css";

const API_URL = "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=50";

function LaunchDetail() {
  const { id } = useParams();
  const location = useLocation();
  const passedLaunch = location.state?.launch;

  const [launch, setLaunch] = useState(passedLaunch || null);
  const [loading, setLoading] = useState(!passedLaunch);
  const [error, setError] = useState("");

  useEffect(() => {
    if (passedLaunch) {
      setLaunch(passedLaunch);
      setLoading(false);
      return;
    }

    const fetchLaunch = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch launch details. Status: ${response.status}`,
          );
        }

        const data = await response.json();
        const foundLaunch = data.results?.find(
          (item) => String(item.id) === String(id),
        );

        if (!foundLaunch) {
          throw new Error("Launch not found.");
        }

        setLaunch(foundLaunch);
      } catch (err) {
        console.error("Launch detail fetch error:", err);
        setError(
          err.message || "Something went wrong while fetching launch details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLaunch();
  }, [id, passedLaunch]);

  return (
    <Layout
      sidebar={
        <div>
          <h2 className="sidebar-title">Navigation</h2>
          <p>Select a launch to open its detail page.</p>
        </div>
      }
    >
      <div className="app">
        <header className="header">
          <h1>Launch Details</h1>
          <p>More information about the selected launch</p>
        </header>

        <section className="controls-wrapper">
          <Link
            to="/"
            className="clear-btn"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            ← Back to Dashboard
          </Link>
        </section>

        <section className="table-section">
          {loading && <p>Loading launch details...</p>}
          {error && <p className="error-message">{error}</p>}

          {!loading && !error && launch && (
            <div className="detail-card">
              <h2>{launch.name || "Unknown Launch"}</h2>
              <p>
                <strong>Status:</strong> {launch.status?.name || "Unknown"}
              </p>
              <p>
                <strong>Provider:</strong>{" "}
                {launch.launch_service_provider?.name || "Unknown"}
              </p>
              <p>
                <strong>Launch Date:</strong>{" "}
                {launch.net ? new Date(launch.net).toLocaleString() : "N/A"}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {launch.pad?.location?.name || "Unknown"}
              </p>
              <p>
                <strong>Pad:</strong> {launch.pad?.name || "Unknown"}
              </p>
              <p>
                <strong>Mission Name:</strong>{" "}
                {launch.mission?.name || "No mission listed"}
              </p>
              <p>
                <strong>Mission Type:</strong>{" "}
                {launch.mission?.type || "Unknown"}
              </p>
              <p>
                <strong>Orbit:</strong>{" "}
                {launch.mission?.orbit?.name || "Unknown"}
              </p>
              <p>
                <strong>Rocket:</strong>{" "}
                {launch.rocket?.configuration?.full_name || "Unknown"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {launch.mission?.description || "No description available."}
              </p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default LaunchDetail;
