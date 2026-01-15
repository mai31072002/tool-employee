import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import ThemeProvider from './app/layout/home_theme_provider';
import AuthConfig from './app/main/auth/auth.config';

const root = ReactDOM.createRoot(document.getElementById('root'));
if (AuthConfig.guestPath.indexOf(window.location.pathname) === -1) {
    root.render(
        <React.StrictMode>
            <ThemeProvider>
                <App path={window.location.pathname} />
            </ThemeProvider>
        </React.StrictMode>
    )
} else {
    root.render(
        <App path={window.location.pathname} />
    )
}

reportWebVitals();
