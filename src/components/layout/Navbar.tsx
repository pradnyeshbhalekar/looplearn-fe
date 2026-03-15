import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../Logo";
import { useTheme } from "../../context/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { logout } from "../../features/auth/authSlice";
import { Sun, Moon, LogOut, Fingerprint, Menu, X } from "lucide-react";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  const isHome = location.pathname === "/";

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6 rounded-full border border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-black backdrop-blur-xl shadow-sm transition-colors relative z-50">

        {/* LEFT: Brand/Logo */}
        <div className="flex items-center">
          <div onClick={closeMobileMenu}>
            <Logo className="text-lg font-black tracking-tighter transition-transform hover:scale-105 cursor-pointer" />
          </div>
        </div>

        {/* CENTER: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`text-xs font-black uppercase tracking-[0.1em] transition-colors no-underline ${location.pathname === "/dashboard" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-black dark:hover:text-white"}`}
              >
                Dashboard
              </Link>
              <Link
                to="/todays"
                className={`text-xs font-black uppercase tracking-[0.1em] transition-colors no-underline ${location.pathname === "/todays" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-black dark:hover:text-white"}`}
              >
                Briefing
              </Link>
              <Link
                to="/pricing"
                className={`text-xs font-black uppercase tracking-[0.1em] transition-colors no-underline ${location.pathname === "/pricing" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-black dark:hover:text-white"}`}
              >
                Pricing
              </Link>
            </>
          ) : (
            <>
              {isHome && ["Why", "Who", "How"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-600 transition-colors no-underline"
                >
                  {item}
                </a>
              ))}
              <Link
                to="/pricing"
                className={`text-xs font-black uppercase tracking-[0.2em] transition-colors no-underline ${location.pathname === "/pricing" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-blue-600"}`}
              >
                Pricing
              </Link>
            </>
          )}
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
          </button>

          <div className="h-4 w-px bg-gray-200 dark:bg-white/10 mx-1 hidden sm:block" />

          {/* Authenticatication Desktop/Mobile Hybrid */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="flex items-center gap-2 px-6 sm:px-7 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-3xl bg-black text-white hover:bg-blue-700 hover:scale-[1.02] transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)] no-underline whitespace-nowrap"
            >
              <Fingerprint size={14} strokeWidth={3} />
              <span className="hidden sm:inline">Access</span>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-full border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-red-500 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-400 transition-all group"
              title="Logout"
            >
              <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
              <span>Exit</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-4 right-4 bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 z-40 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className={`text-sm font-black uppercase tracking-widest py-2 border-b border-gray-100 dark:border-gray-800 ${location.pathname === "/dashboard" ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/todays"
                  onClick={closeMobileMenu}
                  className={`text-sm font-black uppercase tracking-widest py-2 border-b border-gray-100 dark:border-gray-800 ${location.pathname === "/todays" ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Briefing
                </Link>
                <Link
                  to="/pricing"
                  onClick={closeMobileMenu}
                  className={`text-sm font-black uppercase tracking-widest py-2 border-b border-gray-100 dark:border-gray-800 ${location.pathname === "/pricing" ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Pricing
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-black uppercase tracking-widest py-2 text-red-500 mt-2"
                >
                  <LogOut size={16} /> Exit Account
                </button>
              </>
            ) : (
              <>
                {isHome && ["Why", "Who", "How"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={closeMobileMenu}
                    className="text-sm font-black uppercase tracking-widest py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    {item}
                  </a>
                ))}
                <Link
                  to="/pricing"
                  onClick={closeMobileMenu}
                  className={`text-sm font-black uppercase tracking-widest py-2 border-b border-gray-100 dark:border-gray-800 ${location.pathname === "/pricing" ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Pricing
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;