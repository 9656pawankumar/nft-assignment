import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, useAccount } from "wagmi";
import { config } from "./config";

import { Input } from "./components/ui/input";
import EntryTile from "./components/my/EntryTile";
import { Toaster } from "./components/ui/toaster";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DeployNFT from "./components/pages/DeployNFT";
import BrowseNFT from "./components/pages/BrowseNFT";
import StatusBanner from "./components/my/StatusBanner";

// 2. Set up a React Query client.
const queryClient = new QueryClient();

function App() {
  const { isConnected } = useAccount();
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <section className="min-h-screen bg-stone-900 text-white content-center">
          <div className="flex flex-col justify-between mx-auto max-w-96 min-h-96">
            {/* <EntryTile title="Drop a collection" url="/deploy"/> */}
            <EntryTile title="Browse NFT collections" url="/browse" />
          </div>
        </section>
      ),
    },
    {
      path: "/browse",
      element: <BrowseNFT />,
    },
    {
      path: "/deploy",
      element: <DeployNFT />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      <StatusBanner className="text-white" status={isConnected} />
    </>
  );
}

export default App;
