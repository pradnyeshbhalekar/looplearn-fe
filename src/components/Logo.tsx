import { Link } from "react-router-dom"

const Logo = ({ className = "", hideText = false }: { className?: string; hideText?: boolean }) => {
  return (
    <Link
      to="/"
      className={`font-bold tracking-tight no-underline inline-flex items-center ${className}`}
    >
      <span className="text-secondary dark:text-white">L</span>

      <span
        aria-hidden
        className="text-primary inline-block scale-[1.35] ml-[4px] mr-[4px]"
      >
        ∞
      </span>

      {!hideText && <span className="text-secondary dark:text-white">plearn</span>}
    </Link>
  )
}

export default Logo