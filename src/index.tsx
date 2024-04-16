import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useAccount } from 'wagmi'
import { config } from './wagmi.config'
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient()

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </WagmiProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
