import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ListActiveStudies } from './pages/ListActiveStudies'
import { RootLayout } from './layouts/RootLayout'
import ErrorPage from './pages/ErrorPage'
import { CreateActiveStudy } from './pages/CreateActiveStudy'
import { Dashboard } from './pages/Dashboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />} >
          <Route index element={<ListActiveStudies />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='new-active-studiy' element={<CreateActiveStudy />} />        
        </Route>
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
