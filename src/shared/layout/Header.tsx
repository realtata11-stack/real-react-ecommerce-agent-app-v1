import { Link, NavLink } from 'react-router'
import { useCart } from '../../features/cart/cartStore.tsx'

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM1 2v2h2l3.6 7.6-1.4 2.4A2 2 0 0 0 7 17h12v-2H7.4l1.1-2h7.5a2 2 0 0 0 1.7-1l3.6-6.5A1 1 0 0 0 20.4 4H5.2l-.9-2H1Z" />
    </svg>
  )
}

export function Header() {
  const { itemCount } = useCart()
  return (
    <header>
      <div className="mx-auto grid max-w-content grid-cols-3 items-center px-4 py-6">
        <Link to="/" className="justify-self-start text-2xl font-bold">
          My Store
        </Link>
        <nav className="flex justify-center gap-4 text-base">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'text-primary' : 'hover:text-primary-hover'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? 'text-primary' : 'hover:text-primary-hover'
            }
          >
            Products
          </NavLink>
        </nav>
        <Link
          to="/cart"
          aria-label="Cart"
          className="relative justify-self-end"
        >
          <CartIcon />
          {itemCount > 0 && (
            <span
              data-testid="cart-badge"
              className="absolute -top-2 -right-3 flex min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs text-white"
            >
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
