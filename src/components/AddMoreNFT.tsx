import React, { useState } from "react";
import axios from "axios";
import { useEthersSigner } from "../getSigner";
import { ethers } from "ethers";
import NFTMarketplaceABI from "../abi721.json";
import { Snackbar } from "@material-ui/core";
import Alert from "./Alert";

interface AddMoreNFTProps {
  className?: string;
  collectionID: number;
}

export default function AddMoreNFT({
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
        handleClick(`NFT is being created. Wait till we alert you again!`, 'warning');
        const transaction = await contract.createToken(collectionId, tokenURI);
        await transaction.wait();


        handleClick(`NFT is created with tokenURI ${tokenURI}`, 'success');
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
            pinata_api_key: "90dd85cf70c8f0e78726",
            pinata_secret_api_key:
              "0548bf0cd8d733add57055d9d3c7ae87f107d07c2f644fe2fe207381ad338eac",
          },
        });

        const ipfsHash = responseData.data.IpfsHash;
        const fileUrl = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;

        return fileUrl;
      } catch (err) {
        console.log(err);
        return;
      }
    }

    else {
      console.log("No file uploaded");
      return;
    }
  }

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');


  const handleClose = (event:any, reason:any) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
}

const handleClick = (msg:any, sev:any) => {
  setMessage(msg);
  setSeverity(sev);
  setOpen(true);
};

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles: any) => [...prevFiles, ...files]);

    const previews = files.map((file: any) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews: any) => [...prevPreviews, ...previews]);
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();

    if (selectedFiles.length === 0 && ipfsUrls.length === 0) {
      handleClick(`No images uploaded!`, 'error');
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
    <div style={{ padding: "20px", backgroundColor: "white", color: "black" }}>
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
    <button type="button" onClick={handleUpload} style={{ marginTop: "5px", padding: "10px 30px", fontSize: "16px", borderRadius: "0px", backgroundColor: "black", color: "white", border: "none", cursor: "pointer" }}>
      ADD NFT TO YOUR COLLECTION
    </button>
    <Snackbar open={open}    autoHideDuration={3000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
  </div>
  
  
  );
}
