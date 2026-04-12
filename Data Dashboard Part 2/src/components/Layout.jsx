function Layout({ sidebar, children }) {
  return (
    <div className="page-layout">
      <aside className="sidebar">{sidebar}</aside>
      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;