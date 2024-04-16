import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, useAccount } from "wagmi";
import { config } from "./wagmi.config";

import WalletConnector from "./components/WalletConnector";
import { createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import DeployNFT from "./components/pages/DeployNFT";
import BrowseNFT from "./components/pages/BrowseNFT";
import { ConnectWallet } from "./ConnectWallet";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "./components/Alert";
import UploadNFT from "./components/UploadNFT";
import { Landing } from "./components/Landing";

const queryClient = new QueryClient();

function App() {
  return (
    <div className='h-screen'>
        <Routes>      
        <Route path="/" element={<WalletConnector />}/>  
          <Route path="/viewCollection" element={<BrowseNFT />}/> 
          <Route path="/landing" element={<Landing />}/>   
          {/* <Route path="/addCollection" element={<DeployNFT />}/>       */}
        </Routes>

        <div className='row text-center' style={{justifyContent:"center"}}>
          <div>
    <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}> 
    <ConnectWallet /> 
    </QueryClientProvider> 
    </WagmiProvider>
    </div>
    <div>
    </div>
    </div>
    </div>
  );
}

export default App;
