function Sidebar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  providerFilter,
  setProviderFilter,
  startDateFilter,
  setStartDateFilter,
  endDateFilter,
  setEndDateFilter,
  statusOptions = [],
  providerOptions = [],
  clearFilters,
}) {
  return (
    <div>
      <h2 className="sidebar-title">Filters</h2>

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
        <button className="clear-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
