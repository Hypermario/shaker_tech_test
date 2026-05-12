import { Navigate, Route, Routes } from 'react-router-dom'
import { EventPage } from './pages/EventPage'
import { EventsListPage } from './pages/EventsListPage'

function App() {
    return (
        <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-8">
            <main>
                <Routes>
                    <Route path="/" element={<EventsListPage />} />
                    <Route path="/events/:eventId" element={<EventPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
