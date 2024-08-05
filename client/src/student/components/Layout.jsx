import Footer from "./Footer"
import Header from "./Header"
// import Magin from "./Magin"
import { Outlet } from "react-router-dom"


function Layout() {
  return (
    <main>

      <Header />
      <div className="md:mt-0 mt-32">
        <Outlet />
      </div>
      <Footer />
    </main>
  )
}

export default Layout