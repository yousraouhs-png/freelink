import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1E3A8A',
            color: '#fff',
            borderRadius: '12px',
            padding: '14px 18px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#4ade80', secondary: '#fff' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#fff' } },
        }}
      />
    </ClerkProvider>
  )
}
