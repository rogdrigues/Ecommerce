import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppContextProvider } from './context/app.context';
import { CartProvider } from './context/cart.context';
import AppRouter from './router'
import { NotificationProvider } from '@/context/notification.context';

const App = () => {

  return (
    <NotificationProvider>
      <AppContextProvider>
        <CartProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <AppRouter />
          </GoogleOAuthProvider>
        </CartProvider>
      </AppContextProvider>
    </NotificationProvider>
  )
}

export default App
