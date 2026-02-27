import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../Logo";
import { useTheme } from "../../context/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { logout } from "../../features/auth/authSlice";
import { Sun, Moon, LogOut, LayoutDashboard, Fingerprint } from "lucide-react";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Check if we are on the Briefing (Todays) page
  const isBriefingPage = location.pathname === "/todays";

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-6 rounded-full border border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-xl shadow-sm">
        
        {/* LEFT: Brand/Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="no-underline group">
            <Logo className="text-lg font-black tracking-tighter transition-transform group-hover:scale-105" />
          </Link>

          {/* Marketing Links - Hidden on Briefing Page */}
          {!isBriefingPage && (
            <div className="hidden md:flex items-center gap-6">
              {["Why", "Who", "How"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-600 transition-colors no-underline"
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
          </button>

          <div className="h-4 w-px bg-gray-200 dark:bg-white/10 mx-2" />

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-all no-underline"
            >
              <Fingerprint size={14} />
              Access
            </Link>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Only show "Briefing" button if NOT on the briefing page */}
              {!isBriefingPage && (
                <Link
                  to="/todays"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-all no-underline"
                >
                  <LayoutDashboard size={14} />
                  <span className="hidden sm:inline">Briefing</span>
                </Link>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors group relative"
                title="Logout"
              >
                <LogOut size={18} strokeWidth={2.5} />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded pointer-events-none">
                  Exit
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;