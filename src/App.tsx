import { Route, Routes } from 'react-router'
import { CartPage } from './features/cart/CartPage.tsx'
import { CartProvider } from './features/cart/cartStore.tsx'
import { CheckoutPage } from './features/checkout/CheckoutPage.tsx'
import { OrderSuccessPage } from './features/checkout/OrderSuccessPage.tsx'
import { ProductsPage } from './features/catalog/ProductsPage.tsx'
import { ProductDetailPage } from './features/product/ProductDetailPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'
import { Layout } from './shared/layout/Layout.tsx'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}

export default App
