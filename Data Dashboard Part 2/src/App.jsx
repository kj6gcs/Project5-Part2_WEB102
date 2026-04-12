import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL =
  "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=50";

function App() {
  const [launches, setLaunches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [providerFilter, setProviderFilter] = useState("All");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Failed to fetch launch data. Status: ${response.status}`);
        }

        const data = await response.json();
        setLaunches(data.results || []);
      } catch (err) {
        console.error("Launch fetch error:", err);
        setError(err.message || "Something went wrong while fetching launch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, []);

  const filteredLaunches = useMemo(() => {
    return launches.filter((launch) => {
      const name = launch.name?.toLowerCase() || "";
      const matchesSearch = name.includes(searchTerm.toLowerCase());

      const statusName = launch.status?.name || "Unknown";
      const matchesStatus =
        statusFilter === "All" || statusName === statusFilter;

      const providerName = launch.launch_service_provider?.name || "Unknown";
      const matchesProvider =
        providerFilter === "All" || providerName === providerFilter;

      const launchDate = launch.net ? new Date(launch.net) : null;

      const matchesStartDate =
        !startDateFilter ||
        (launchDate && launchDate >= new Date(startDateFilter));

      const matchesEndDate =
        !endDateFilter ||
        (launchDate && launchDate <= new Date(`${endDateFilter}T23:59:59`));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesProvider &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [
    launches,
    searchTerm,
    statusFilter,
    providerFilter,
    startDateFilter,
    endDateFilter,
  ]);

  const totalLaunches = launches.length;

  const uniqueProviders = new Set(
    launches
      .map((launch) => launch.launch_service_provider?.name)
      .filter(Boolean)
  ).size;

  const launchesWithMission = launches.filter((launch) => launch.mission).length;

  const filteredCount = filteredLaunches.length;

  const statusOptions = [
    "All",
    ...new Set(launches.map((launch) => launch.status?.name).filter(Boolean)),
  ];

  const providerOptions = [
    "All",
    ...new Set(
      launches
        .map((launch) => launch.launch_service_provider?.name)
        .filter(Boolean)
    ),
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setProviderFilter("All");
    setStartDateFilter("");
    setEndDateFilter("");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Orbital Watch</h1>
        <p>Track upcoming launches and space missions</p>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <h2>{totalLaunches}</h2>
          <p>Total Launches</p>
        </div>

        <div className="stat-card">
          <h2>{uniqueProviders}</h2>
          <p>Launch Providers</p>
        </div>

        <div className="stat-card">
          <h2>{launchesWithMission}</h2>
          <p>Launches With Missions</p>
        </div>

        <div className="stat-card">
          <h2>{filteredCount}</h2>
          <p>Matching Current Filters</p>
        </div>
      </section>

      <section className="controls-wrapper">
        <div className="search-row">
          <div className="filter-group search-group">
            <label htmlFor="search">Search Launches</label>
            <input
              id="search"
              type="text"
              placeholder="Search by launch name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="statusFilter">Launch Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="providerFilter">Launch Provider</label>
            <select
              id="providerFilter"
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
            >
              {providerOptions.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="startDate">Earliest Launch Date</label>
            <input
              id="startDate"
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="endDate">Latest Launch Date</label>
            <input
              id="endDate"
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
            />
          </div>

          <div className="filter-group button-group">
            <label>&nbsp;</label>
            <button className="clear-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      <section className="table-section">
        {loading && <p>Loading launches...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Provider</th>
                <th>Launch Date</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredLaunches.map((launch) => (
                <tr key={launch.id}>
                  <td>{launch.name || "Unknown"}</td>
                  <td>{launch.status?.name || "Unknown"}</td>
                  <td>{launch.launch_service_provider?.name || "Unknown"}</td>
                  <td>
                    {launch.net
                      ? new Date(launch.net).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{launch.pad?.location?.name || "Unknown"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default App;