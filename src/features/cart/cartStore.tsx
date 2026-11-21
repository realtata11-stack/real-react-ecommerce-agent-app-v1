import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'

/** A cart line: id, quantity and a snapshot so the cart renders without fetching. */
export type CartItem = {
  id: number
  title: string
  thumbnail: string
  /** Discounted unit price in whole cents. */
  priceCents: number
  discountPercentage: number
  quantity: number
}

export type CartAction =
  | { type: 'add'; item: Omit<CartItem, 'quantity'> }
  | { type: 'increase'; id: number }
  | { type: 'decrease'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'clear' }

export const CART_STORAGE_KEY = 'my-store-cart'

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'number' &&
    typeof v.title === 'string' &&
    typeof v.thumbnail === 'string' &&
    typeof v.priceCents === 'number' &&
    typeof v.discountPercentage === 'number' &&
    typeof v.quantity === 'number' &&
    Number.isInteger(v.quantity) &&
    v.quantity >= 1
  )
}

/** Reads the saved cart. Unusable storage or bad JSON gives an empty cart. */
function loadCart(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(CART_STORAGE_KEY) ?? '[]',
    )
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Storage is unavailable: the cart keeps working for this visit only.
  }
}

function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'add':
      return items.some((i) => i.id === action.item.id)
        ? items.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...items, { ...action.item, quantity: 1 }]
    case 'increase':
      return items.map((i) =>
        i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i,
      )
    case 'decrease':
      return items.map((i) =>
        i.id === action.id
          ? { ...i, quantity: Math.max(1, i.quantity - 1) }
          : i,
      )
    case 'remove':
      return items.filter((i) => i.id !== action.id)
    case 'clear':
      return []
  }
}

type CartContextValue = {
  items: CartItem[]
  /** Sum of all quantities. */
  itemCount: number
  /** Sum of price x quantity, in whole cents. */
  totalCents: number
  dispatch: (action: CartAction) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart)

  useEffect(() => saveCart(items), [items])

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      totalCents: items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
      dispatch,
    }),
    [items],
  )
  return <CartContext value={value}>{children}</CartContext>
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used inside <CartProvider>')
  return value
}
