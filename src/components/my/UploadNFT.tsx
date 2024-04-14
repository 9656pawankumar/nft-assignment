import React, { useState } from "react";
import axios from "axios";
import { useEthersSigner } from "./../../getSigner";
import { ethers } from "ethers";
import NFTMarketplaceABI from "./../../abi.json";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

interface UploadNFTProps {
  className?: string;
  collectionLength: number;
}

export default function UploadNFT({
  className,
  collectionLength,
}: UploadNFTProps) {
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [imagePreviews, setImagePreviews] = useState<any>([]);
  const [ipfsUrls, setIpfsUrls] = useState<string[]>([]);
  const [collectionName, setCollectionName] = useState<string>();

  const signer = useEthersSigner();

  async function mintNFTs(tokenURIs: string[], collectionId: number) {
    try {
      if (!signer) return;
      const contract = new ethers.Contract(
        "0xee15c5d1b8a4464fa26e7ccf0a96d3e6a32bb512",
        NFTMarketplaceABI,
        signer
      );

      for (const tokenURI of tokenURIs) {
        const transaction = await contract.createToken(collectionId, tokenURI);
        await transaction.wait();
        console.log(`NFT Created with tokenURI: ${tokenURI}`);
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

  async function createCollection() {
    try {
      if (!signer) return;
      const contract = new ethers.Contract(
        "0xee15c5d1b8a4464fa26e7ccf0a96d3e6a32bb512",
        NFTMarketplaceABI,
        signer
      );

      const collectionID = collectionName;
      if (collectionID?.length === 0) return;
      alert("A collection will be created now, please wait");
      const transaction = await contract.createCollection(collectionID);
      await transaction.wait();

      alert("A collection is created, please refresh");

      console.log(transaction);
    } catch (error) {
      console.error("Collection creation error:", error);
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

  return (
    <div className={className}>
      <Input
        className="max-w-96"
        type="text"
        placeholder="Give your collection a name"
        value={collectionName}
        onChange={(e) => setCollectionName(e.target.value)}
      />
      <div className="flex gap-5 mt-5">
        <input type="file" multiple onChange={handleFileChange} />
        <Input
          className="max-w-96"
          type="text"
          placeholder="Or you can upload a IPFS URL"
          value={ipfsUrls}
          onChange={(e) => setIpfsUrls(e.target.value.split(","))}
        />
      </div>
      <div className="grid grid-cols-3 gap-4 w-4/12">
        {imagePreviews.map((preview: string, index: number) => (
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img
            className="rounded"
            key={index}
            src={preview}
            alt={`Image Preview ${index}`}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              margin: "5px",
            }}
          />
        ))}
      </div>
      <Button className="mt-4" onClick={handleUpload}>
        Create collection
      </Button>
    </div>
  );
}
