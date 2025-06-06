import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Logo/ChatGPT Image Apr 5, 2025, 11_57_07 PM.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiConnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"

// const subLinks=[
//   {
//     title:"python",
//     link:"/catalog/python"
//   },
//   {
//     title:"web dev",
//     link:"/catalog/web-development"
//   }
// ]
function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [isCatalogOpen, setIsCatalogOpen] = useState(false);


  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
        console.log("hello" + res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  // // console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    // bg-neutral-800
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-neutral" : "bg-neutral"
      }   transition-all duration-200`
    }
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        {/* Navigation links */}
        {isMobileMenuOpen && (
  <div className="absolute top-14 left-0 z-50 w-full bg-richblack-900 text-white p-4 md:hidden">
    <ul className="flex flex-col gap-y-4">
      {NavbarLinks.map((link, index) => (
        <li key={index}>
          {link.title === "Catalog" ? (
            <>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              >
                <span>{link.title}</span>
                <BsChevronDown className={`transition-transform ${isCatalogOpen ? "rotate-180" : ""}`} />
              </div>
              {isCatalogOpen && (
                <ul className="mt-2 ml-4 flex flex-col gap-y-2">
                  {loading ? (
                    <li className="text-sm">Loading...</li>
                  ) : subLinks?.length ? (
                    subLinks.map((subLink, i) => (
                      <li key={i}>
                        <Link
                          to={`/catalog/${subLink.name}`}
                          onClick={() => {
                            setIsCatalogOpen(false)
                            setIsMobileMenuOpen(false)
                          }}
                          className="text-sm text-richblack-5"
                        >
                          {subLink.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm">No Courses Found</li>
                  )}
                </ul>
              )}
            </>
          ) : (
            <Link
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-richblack-5"
            >
              {link.title}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
)}
{/* Desktop Navigation Links */}
 <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-caribbeangreen-25"
                          : "text-pure-greys-400"
                      }`}
                    >
                      <p className="text-pure-greys-400">{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg border bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks?.length ? (
                          <>
                            {subLinks
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-caribbeangreen-25"
                          : "text-pure-greys-400"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-caribbeangreen-100 px-[12px] py-[8px] text-white">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-white">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
        {/* <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button> */}
        <button
  className="mr-4 md:hidden"
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
>
  <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
</button>

      </div>
    </div>
  )
}

export default Navbar;
