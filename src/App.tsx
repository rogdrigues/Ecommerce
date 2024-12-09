import { AppContextProvider } from './context/app.context';
import AppRouter from './router'
import { NotificationProvider } from '@/context/notification.context';

const App = () => {

  return (
    <NotificationProvider>
      <AppContextProvider>
        <AppRouter />
      </AppContextProvider>
    </NotificationProvider>
  )
}

export default App
