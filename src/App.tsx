import { AppContextProvider } from './context/app.context';
import { CartProvider } from './context/cart.context';
import AppRouter from './router'
import { NotificationProvider } from '@/context/notification.context';

const App = () => {

  return (
    <NotificationProvider>
      <AppContextProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AppContextProvider>
    </NotificationProvider>
  )
}

export default App
