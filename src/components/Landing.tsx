import { Box, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useEthersSigner } from "../getSigner";
import { ethers } from "ethers";
import NFTMarketplaceABI from "../abi721.json";
import { useNavigate } from 'react-router-dom';
import UploadNFT from './UploadNFT';

export function Landing() {
    const signer = useEthersSigner();
    const [nftCollections, setNftCollections] = useState<any>();
    const [isUploadClicked, setisUploadClicked] = useState<Boolean>(false);
    const navigate = useNavigate();
    const [manageCollectionsStyle, setManageCollectionsStyle] = useState({
        backgroundColor: 'white',
        color: 'black',
      });
    
      const [addCollectionsStyle, setAddCollectionsStyle] = useState({
        backgroundColor: 'white',
        color: 'black',
      });
    
      const handleManageCollectionsEnter = () => {
        setManageCollectionsStyle({
          backgroundColor: 'black',
          color: 'white',
        });
      };
    
      const handleManageCollectionsLeave = () => {
        setManageCollectionsStyle({
          backgroundColor: 'white',
          color: 'black',
        });
      };
    
      const handleUploadSuccess = () => {
        setisUploadClicked(false);
      };

      const handleAddCollectionsEnter = () => {
        setAddCollectionsStyle({
          backgroundColor: 'black',
          color: 'white',
        });
      };
    
      const handleAddCollectionsLeave = () => {
        setAddCollectionsStyle({
          backgroundColor: 'white',
          color: 'black',
        });
      };

      const handleNavigateView =(route:any)=>{
        navigate("/viewCollection");
      }
      const handleNavigateAdd =(route:any)=>{
        setisUploadClicked(true);
      }

      async function getAllCollections() {
        try {
          if (!signer) return;
          const contract = new ethers.Contract(
            "0xE5515F30168bb173D155Dcba4F1E26a69cf79b88",
            NFTMarketplaceABI,
            signer
          );
    
          const collections = await contract.getAllCollections();
    
          const collectionTokenURIs = await Promise.all(
            collections.map(async (collection: any) => {
              const tokens = await contract.getTokensInCollection(collection.id); 
    
              const tokenURIs = await Promise.all(
                tokens.map(async (token: any) => {
                  const uri = await contract.tokenURI(token.tokenId);
                  return {
                    tokenId: token.tokenId,
                    tokenURI: uri,
                  };
                })
              );
    
              return {
                collectionId: collection.id,
                tokens: tokenURIs,
                collectionName: collection.name,
              };
            })
          );
    
          setNftCollections(collectionTokenURIs);
        } catch (error) {
          console.error("Error fetching collections:", error);
        }
      }
    
      useEffect(() => {
        getAllCollections();
      }, [signer]);
    
    
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
        >
             {isUploadClicked ?
              (<UploadNFT onComplete={handleUploadSuccess} collectionLength={nftCollections?.length} />) 
             :
             (
             <div style={{ width: '50%', height: '50%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',backgroundColor:'rgba(255, 255, 255, 0.3)'}}>
            <Button
              onClick={handleNavigateView}
              variant="contained"
              style={{
                width: '50%',
                marginBottom: '10px',
                ...manageCollectionsStyle,
                fontWeight: 'bold',
                transition: 'background-color 0.3s, color 0.3s',
              }}
              onMouseEnter={handleManageCollectionsEnter}
              onMouseLeave={handleManageCollectionsLeave}
            >
              MANAGE EXISTING COLLECTIONS
            </Button>
            <Button
              onClick={handleNavigateAdd}
              variant="contained"
              style={{
                width: '50%',
                ...addCollectionsStyle,
                fontWeight: 'bold',
                transition: 'background-color 0.3s, color 0.3s',
              }}
              onMouseEnter={handleAddCollectionsEnter}
              onMouseLeave={handleAddCollectionsLeave}
            >
              ADD NEW COLLECTIONS
            </Button>
          </div>
          )
             }
          
        </Box>
      );
}