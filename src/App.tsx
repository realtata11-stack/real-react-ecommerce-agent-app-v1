import { Route, Routes } from 'react-router'
import { ProductsPage } from './features/catalog/ProductsPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'
import { TitledPage } from './pages/TitledPage.tsx'
import { Layout } from './shared/layout/Layout.tsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route
          path="products/:id"
          element={<TitledPage title="Product Details" />}
        />
        <Route path="cart" element={<TitledPage title="Cart" />} />
        <Route path="checkout" element={<TitledPage title="Checkout" />} />
        <Route
          path="order-success"
          element={<TitledPage title="Order Placed" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
