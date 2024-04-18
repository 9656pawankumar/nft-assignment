// import React, { useState } from "react";
// import axios from "axios";
// import { ethers } from "ethers";
// import ERC1155ABI from "../abi1155.json"; 
// import { useEthersSigner } from "../getSigner";
//  // Ensure this ABI is correct and available

// interface AddMoreNFTProps {
//   className?: string;
//   collectionID: number; // Address of the ERC1155 contract
// }

// const AddMoreNFT1: React.FC<AddMoreNFTProps> = ({ className, collectionID }) => {
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [ipfsUrls, setIpfsUrls] = useState<string[]>([]);

//   const signer = useEthersSigner();
//   const idarr = new Array()
//   idarr.push(collectionID)

//   const getSigner = async () => {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     await provider.send("eth_requestAccounts", []);
//      return provider.getSigner();
    
//   };

  
  
//   const mintNFTs = async (tokenURIs : String[]) => {
//     try {
//       //const signer = await getSigner(); // This needs to correctly resolve to a ethers.js Signer object
//       console.log("Signer Address:",  signer)
//       const contract = new ethers.Contract(
//         "0x33d7b391373b4bDf7BE528a4AD3dD8d4714BB522", // Ensure this is your correct contract address
//         ERC1155ABI,
//         signer  // This should be the ethers.js Signer object
//       );
  
//       const ids = tokenURIs.map((_, index) => index + 1);
//       const amounts = tokenURIs.map(() => 1);
//       const data = new Array(tokenURIs.length).fill(ethers.utils.hexlify(ethers.utils.randomBytes(1))); // Ensuring data is correctly formatted
//       //console.log(signer)
//     // console.log("Signer Address:", await signer.getAddress());
//     // console.log("Contract Address:", contract.address);
//     console.log("Token URIs:", tokenURIs);
//     console.log("IDs:", idarr);
//     console.log("Amounts:", amounts);
//     console.log("Data:", data);
   
//       // First simulate transaction
//      // await contract.callStatic.mintBatch(signer, ids, amounts, data);
//       // Then execute the transaction
     
//       const transaction = await contract.mintBatch(signer?._address, idarr, amounts,{
//         gasLimit: 1000000
//       });
//       await transaction.wait();
//       alert("NFTs successfully minted!");
//     } catch (error) {
//       console.error("Error during simulation or minting NFTs:", error);
//     }
//   }
  
  

//   async function getIPFSUrl(file: File) {
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const response = await axios({
//         method: "POST",
//         url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
//         data: formData,
//         headers: {
//           pinata_api_key: "90dd85cf70c8f0e78726",  // Replace with your actual API keys
//           pinata_secret_api_key: "0548bf0cd8d733add57055d9d3c7ae87f107d07c2f644fe2fe207381ad338eac",
//         },
//       });
//       return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
//     } catch (error) {
//       console.error("Error uploading to IPFS:", error);
//       return "";
//     }
//   }

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       const files = Array.from(event.target.files);
//       setSelectedFiles(files);

//       const previews = files.map(file => URL.createObjectURL(file));
//       setImagePreviews(previews);
//     }
//   };

//   const handleUpload = async () => {
//     if (selectedFiles.length === 0) {
//       console.log("No files selected");
//       return;
//     }

//     const tokenURIs = await Promise.all(selectedFiles.map(file => getIPFSUrl(file)));
//    await mintNFTs(tokenURIs);
    
//   };

//   return (
//     <div className={className} style={{ padding: "20px", backgroundColor: "#7fd1c0" }}>
//       <div style={{ display: "flex", justifyContent: "left", gap: "5px", marginBottom: "20px" }}>
//         <input type="file" multiple onChange={handleFileChange} />
//       </div>
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", width: "100%" }}>
//         {imagePreviews.map((preview, index) => (
//           <img
//             key={index}
//             src={preview}
//             alt={`Preview ${index}`}
//             style={{
//               width: "200px",
//               height: "200px",
//               objectFit: "contain",
//               borderRadius: "5px",
//               boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
//             }}
//           />
//         ))}
//       </div>
//       <button onClick={handleUpload} style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px", backgroundColor: "#8f00ff", color: "white", border: "none", cursor: "pointer" }}>
//         Mint ERC1155 NFTs
//       </button>
//     </div>
//   );
// };

// export default AddMoreNFT1;
import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { useEthersSigner } from "./getSigner";

import ERC1155ABI from "./abi1155.json"; // Ensure this ABI is correct and available

interface AddMoreNFTProps {
  className?: string;
  collectionID: number; // Ensure this is your ERC1155 contract's collection ID
}

const AddMoreNFT1: React.FC<AddMoreNFTProps> = ({ className, collectionID }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mintedNFTs, setMintedNFTs] = useState<string[]>([]);

  const signer = useEthersSigner(); // Ensure this hook properly retrieves an ethers.js signer

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);

      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      console.log("No files selected");
      return;
    }

    const tokenURIs = await Promise.all(selectedFiles.map(file => getIPFSUrl(file)));
    await mintNFTs(tokenURIs);
  };

  const getIPFSUrl = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        headers: {
          pinata_api_key: "90dd85cf70c8f0e78726", // Replace with your actual API keys
          pinata_secret_api_key: "0548bf0cd8d733add57055d9d3c7ae87f107d07c2f644fe2fe207381ad338eac",
        },
        data: formData,
      });
      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      return url;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      return "";
    }
  };

  const mintNFTs = async (tokenURIs: string[]) => {
    if (!signer) return;
    const contract = new ethers.Contract(
      "0x33d7b391373b4bDf7BE528a4AD3dD8d4714BB522", // Ensure this is your correct contract address
      ERC1155ABI,
      signer
    );
  
    try {
      const ids = tokenURIs.map((_, index) => index + 1); // Ensure IDs are correctly set up for minting
      const amounts = tokenURIs.map(() => 1); // Mint one of each
      const data = tokenURIs.map(() => ethers.utils.hexlify(ethers.utils.randomBytes(1))); // Simplified data
  
      // Correctly formatting the call to include gasLimit in the overrides
      const overrides = {
        gasLimit: 1000000, // You might want to adjust this based on your contract's needs
      };
  
      // Assuming the smart contract method is correctly imported and matches the expected parameters:
      // mintBatch(address to, uint256[] ids, uint256[] amounts, bytes data, overrides)
      const transaction = await contract.mintBatch(signer.getAddress(), ids, amounts,  overrides);
      await transaction.wait();
  
      setMintedNFTs(tokenURIs);
      alert("NFTs successfully minted!");
    } catch (error) {
      console.error("Error during minting NFTs:", error);
    }
  }
  

  return (
    <div className={className} style={{ padding: "20px", backgroundColor: "#7fd1c0" }}>
      <div style={{ display: "flex", justifyContent: "left", gap: "5px", marginBottom: "20px" }}>
        <input type="file" multiple onChange={handleFileChange} />
        <button onClick={handleUpload} style={{ padding: "10px 20px" }}>Mint ERC1155 NFTs</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", width: "100%" }}>
        {mintedNFTs.map((uri, index) => (
          <div key={index}>
            <img src={uri} alt={`Minted NFT ${index}`} style={{ width: "200px", height: "200px", objectFit: "contain", borderRadius: "5px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddMoreNFT1;
