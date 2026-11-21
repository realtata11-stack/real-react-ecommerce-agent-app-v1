import { Route, Routes } from 'react-router'
import { CartProvider } from './features/cart/cartStore.tsx'
import { ProductsPage } from './features/catalog/ProductsPage.tsx'
import { ProductDetailPage } from './features/product/ProductDetailPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'
import { TitledPage } from './pages/TitledPage.tsx'
import { Layout } from './shared/layout/Layout.tsx'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<TitledPage title="Cart" />} />
          <Route path="checkout" element={<TitledPage title="Checkout" />} />
          <Route
            path="order-success"
            element={<TitledPage title="Order Placed" />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}

export default App
