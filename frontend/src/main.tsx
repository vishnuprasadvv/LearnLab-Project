import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import store, { persistor } from './app/store.ts'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
  <StrictMode>

          <App />


  </StrictMode>
      </PersistGate>
    </Provider>
)
