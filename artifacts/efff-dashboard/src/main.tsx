import { createRoot } from 'react-dom/client';
import { setAuthTokenGetter } from '@workspace/api-client-react';

import App from './App';

import './index.css';

// Wire up the bearer token for all API requests
setAuthTokenGetter(() => localStorage.getItem('efff_token'));

createRoot(document.getElementById('root')!).render(<App />);
