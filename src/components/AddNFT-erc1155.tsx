

import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { useEthersSigner } from '../getSigner'; 
import ERC1155ABI from '../abi1155.json';
import { Snackbar } from '@material-ui/core';
import Alert from './Alert';

interface AddMoreNFTProps {
  className?: string;
  collectionID: number;
}

const AddMoreNFT1: React.FC<AddMoreNFTProps> = ({ className, collectionID }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const signer = useEthersSigner(); 

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);

      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

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
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      handleClick(`No images uploaded!`, 'error');
      return;
    }

    
    const tokenURIs = await Promise.all(selectedFiles.map(file => getIPFSUrl(file)));

    await mintNFTs(tokenURIs);
  };

  const getIPFSUrl = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios({
        method: 'POST',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        headers: {
          pinata_api_key: '90dd85cf70c8f0e78726', 
          pinata_secret_api_key: '0548bf0cd8d733add57055d9d3c7ae87f107d07c2f644fe2fe207381ad338eac'
        },
        data: formData,
      });
      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      return '';
    }
  };

  const mintNFTs = async (tokenURIs: string[]) => {
    if (!signer) return;
    const contract = new ethers.Contract(
      '0x512f89A87D95346f9cF1558fAb9cA505809F944a', 
      ERC1155ABI,
      signer
    );

    try {
      for (const tokenURI of tokenURIs) {
        collectionID = collectionID-1;
        handleClick(`NFT is being created. Wait till we alert you again!`, 'warning');
        const transaction = await contract.createToken(collectionID, tokenURI,{
                    gasLimit: 1000000, 
                   });
        await transaction.wait();
        handleClick(`NFT is created with tokenURI ${tokenURI}`, 'success');
      }
    } catch (error) {
      console.error('Error during NFT minting:', error);
    }
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
            width: "50px",
            height: "50px",
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
};

export default AddMoreNFT1;
