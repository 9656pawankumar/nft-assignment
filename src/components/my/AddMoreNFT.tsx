import React, { useState } from "react";
import axios from "axios";
import { useEthersSigner } from "../../getSigner";
import { ethers } from "ethers";
import NFTMarketplaceABI from "../../abi721.json";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface AddMoreNFTProps {
  className?: string;
  collectionID: number;
}

export default function AddMoreNFT({
  className,
  collectionID,
}: AddMoreNFTProps) {
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [imagePreviews, setImagePreviews] = useState<any>([]);
  const [ipfsUrls, setIpfsUrls] = useState<string[]>([]);
  const [collectionName, setCollectionName] = useState<string>();

  const signer = useEthersSigner();

  async function mintNFTs(tokenURIs: string[], collectionId: number) {
    try {
      if (!signer) return;
      const contract = new ethers.Contract(
        "0xe5515f30168bb173d155dcba4f1e26a69cf79b88",
        NFTMarketplaceABI,
        signer
      );
      
      for (const tokenURI of tokenURIs) {
        alert("NFT under build, PROCESSING...");
        console.log("here before transacrion ------")
        const transaction = await contract.createToken(collectionId, tokenURI);
        await transaction.wait();
        console.log("here aftertransacrion ------")


        alert("NFT successfully built!");

        console.log(`NFT -------- Created -------- with -------- tokenURI: ${tokenURI}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getIPFSUrl(file: any) {
    if (file) {
      try {
        const fileData = new FormData();
        fileData.append("file", file);

        const responseData = await axios({
          method: "POST",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: fileData,
          headers: {
            pinata_api_key: "56129fb5d9c711b93b21",
            pinata_secret_api_key:
              "ed7f52ceca3f84275c3a659e31d962f0a3b4cc2e64495903dcd4bda1f04c2cce",
          },
        });

        const ipfsHash = responseData.data.IpfsHash;
        const fileUrl = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
        // setNftImage(fileUrl);

        return fileUrl;
      } catch (err) {
        console.log(err);
        return;
      }
    }
    // else if (ipfsUrl) {
    //   const urlParts = ipfsUrl.split("/");
    //   ipfsHash = urlParts[urlParts.length - 1];
    //   //not storing ipfsHAsh for now, its TODO
    // }
    else {
      console.log("No file or IPFS URL provided");
      return;
    }
  }

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles: any) => [...prevFiles, ...files]);

    const previews = files.map((file: any) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews: any) => [...prevPreviews, ...previews]);
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();

    if (selectedFiles.length === 0 && ipfsUrls.length === 0) {
      console.log("No files or IPFS URLs provided");
      return;
    }

    const tokenURIs: any = [];

    for (const file of selectedFiles) {
      const uri = await getIPFSUrl(file);
      tokenURIs.push(uri);
    }

    await mintNFTs(tokenURIs, collectionID);
  };

  return (
    <div className={className} style={{ padding: "20px", backgroundColor: "#7fd1c0" }}>
      <div style={{ display: "flex", justifyContent: "left", gap: "5px", marginBottom: "20px" }}>
        <input type="file" multiple onChange={handleFileChange} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", width: "100%" }}>
        {imagePreviews.map((preview: string, index: number) => (
          <img
            className="rounded"
            key={index}
            src={preview}
            alt={`Preview ${index}`}
            style={{
              width: "500px",
              height: "500px",
              objectFit: "contain",
              borderRadius: "0px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
          />
        ))}
      </div>
      <button type="button" onClick={handleUpload} style={{ marginTop: "5px", padding: "10px 30px", fontSize: "16px", borderRadius: "0px", backgroundColor: "#8f00ff", color: "white", border: "none", cursor: "pointer" }}>
        ADD NFT TO YOUR COLLECTION
      </button>
    </div>
  );
}
