import { Link } from 'react-router'

const featuredCategories = [
  { slug: 'beauty', name: 'Beauty' },
  { slug: 'fragrances', name: 'Fragrances' },
  { slug: 'furniture', name: 'Furniture' },
  { slug: 'groceries', name: 'Groceries' },
  { slug: 'laptops', name: 'Laptops' },
]

export function Footer() {
  return (
    <footer className="bg-footer text-white">
      <div className="mx-auto flex max-w-content justify-between px-4 py-12">
        <div>
          <p className="text-3xl font-bold">My Store</p>
          <ul className="mt-6 space-y-4 text-sm">
            <li>Bangkok Thailand 10150</li>
            <li>Call Us: 123-456-7898</li>
            <li>Email Us: admin@mystore.com</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Categories</h2>
          <ul className="mt-4 space-y-2">
            {featuredCategories.map((c) => (
              <li key={c.slug}>
                <Link to={`/products?category=${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Pages</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
