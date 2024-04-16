import React, { useState } from "react";
import axios from "axios";
import { useEthersSigner } from "../getSigner";
import { ethers } from "ethers";
import NFTMarketplaceABI from "../abi721.json";

import { Box, Button, IconButton, Snackbar, TextField } from "@material-ui/core";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";


interface UploadNFTProps {
  className?: string;
  collectionLength: number;
  onComplete: () => void; 
}

export default function UploadNFT({
  collectionLength,onComplete
}: UploadNFTProps) {
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [imagePreviews, setImagePreviews] = useState<any>([]);
  const [ipfsUrls, setIpfsUrls] = useState<string[]>([]);
  const [collectionName, setCollectionName] = useState<string>();
  const navigate = useNavigate();

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
        const transaction = await contract.createToken(collectionId, tokenURI);
        await transaction.wait();
      }
    } catch (error) {
      console.error("Error minting NFTs:", error);
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

  const removeImage = (index: number) => {
    setSelectedFiles((prevFiles: any) => prevFiles.filter((_: any, i: number) => i !== index));
    setImagePreviews((prevPreviews: any) => prevPreviews.filter((_: any, i: number) => i !== index));
  };

  async function createCollection() {
    try {
      if (!signer) return;
      const contract = new ethers.Contract(
        "0xe5515f30168bb173d155dcba4f1e26a69cf79b88",
        NFTMarketplaceABI,
        signer
      );

      const collectionID = collectionName;
      if (collectionID?.length === 0) return;
      handleClick(`Creating collection, please don't change screens till we alert you!`, 'warning');
      const transaction = await contract.createCollection(collectionID);
      await transaction.wait();
      handleClick(`Your Collection is created! Wait for 30 seconds, and go back to landing page to see your collection in the manage section!`, 'success');
    } catch (error) {
      console.error("Error in creating collection!", error);
    }
  }

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

    console.log(tokenURIs);
    await createCollection();
    await mintNFTs(tokenURIs, collectionLength + 1);
  };

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

const goBack = () => {
  onComplete();
};



  return (
    <div style={{ width: '50%', height: '50%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
   <button onClick={goBack} style={{ color:'black', fontWeight:'bolder',position: 'absolute', top: '10px', left: '10px' }}>&lt;Go Back</button>
      <h1 style={{ fontSize:'25px',fontWeight:'bolder',marginBottom: '20px', color: '#333' }}>Add a collection</h1>
  
      <TextField
        label="Enter collection name"
        variant="outlined"
        value={collectionName}
        onChange={(e) => setCollectionName(e.target.value)}
        style={{ width: '50%', marginBottom: '20px' }}
        inputProps={{ style: { color: '#000' } }}
        InputLabelProps={{ style: { color: '#000' } }}
      />
  
      <div className="flex flex-col items-center justify-center gap-2 mt-5">
  <div className="flex justify-center">
    <label htmlFor="uploadInput" style={{ color: '#000', fontWeight: 'bold' }}>Upload Image(s)</label>
  </div>
  <div className="flex justify-center">
    <input style={{ width:'104px' }} id="uploadInput" type="file"  multiple onChange={handleFileChange} />
  </div>
</div>
  
      <div className="grid grid-cols-3 gap-4 w-4/12">
        {imagePreviews.map((preview: string, index: number) => (
          <div key={index} style={{ position: 'relative' }}>
            <img
              className="rounded"
              src={preview}
              alt={`Image Preview ${index}`}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                margin: "5px",
                filter: 'grayscale(100%)',
              }}
            />
            <IconButton
              aria-label="remove"
              style={{ position: 'absolute', top: '6px', right: '-3px', color: '#fff', backgroundColor: '#000', borderRadius: '50%', width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => removeImage(index)}
            >
              x
            </IconButton>
          </div>
        ))}
      </div>
  
      <Button 
      onClick={handleUpload} 
      variant="contained" 
      className="buttonHover"
      style={{ 
        padding: '10px 30px', 
        backgroundColor: '#000', 
        color: '#fff', 
        borderRadius: '5px', 
        border: 'none', 
        cursor: 'pointer', 
        marginTop: '20px',
      }}
    >
        Create Collection
      </Button>
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

