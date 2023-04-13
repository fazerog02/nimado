import React from 'react'
import ReactDOM from 'react-dom/client'

import './global.css'
import App from './App'
import Tutorial from './components/Tutorial'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<Tutorial>
			<App />
		</Tutorial>
	</React.StrictMode>
)

reportWebVitals()
