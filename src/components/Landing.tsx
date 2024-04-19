import { Box, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useEthersSigner } from "../getSigner";
import { ethers } from "ethers";
import NFTMarketplaceABI from "../abi721.json";
import NFTMarketplaceABI1 from "../abi1155.json";
import { useNavigate } from 'react-router-dom';
import UploadNFT from './UploadNFT-erc721';
import UploadNFT2 from './UploadNFT-erc1151';

export function Landing() {
    const signer = useEthersSigner();
    const [nftCollectionsERC721, setNftCollections721] = useState<any>();
    const [nftCollectionsERC1151, setNftCollections1151] = useState<any>();
    const [isUploadClicked, setisUploadClicked] = useState<Boolean>(false);
    const [isUploadClicked1, setisUploadClicked1] = useState<Boolean>(false);
    const navigate = useNavigate();
    const [manageCollectionsStyle, setManageCollectionsStyle] = useState({
        backgroundColor: 'white',
        color: 'black',
      });
      const [manageCollectionsStyle1, setManageCollectionsStyle1] = useState({
        backgroundColor: 'white',
        color: 'black',
      });
     
      const MINUTE_MS = 1000;

      useEffect(() => {
        const interval = setInterval(() => {
          getAllCollectionsERC721();
          getAllCollectionsERC1151();
        }, MINUTE_MS);
      
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
      }, [])
    
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


      const handleManageCollectionsEnter1 = () => {
        setManageCollectionsStyle1({
          backgroundColor: 'black',
          color: 'white',
        });
      };
    
      const handleManageCollectionsLeave1 = () => {
        setManageCollectionsStyle1({
          backgroundColor: 'white',
          color: 'black',
        });
      };
    
      const handleUploadSuccess = () => {
        setisUploadClicked(false);
      };

      const handleUploadSuccess1 = () => {
        setisUploadClicked1(false);
      };

      const [addCollectionsStyle, setAddCollectionsStyle] = useState({
        backgroundColor: 'white',
        color: 'black',
      });

      const [addCollectionsStyle1, setAddCollectionsStyle1] = useState({
        backgroundColor: 'white',
        color: 'black',
      });

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

      const handleAddCollectionsEnter1 = () => {
        setAddCollectionsStyle1({
          backgroundColor: 'black',
          color: 'white',
        });
      };
    
      const handleAddCollectionsLeave1 = () => {
        setAddCollectionsStyle1({
          backgroundColor: 'white',
          color: 'black',
        });
      };



      const handleNavigateView721 =(route:any)=>{
        navigate("/viewCollection721");
      }

      const handleNavigateView1151 =(route:any)=>{
        navigate("/viewCollection1151");
      }

      const handleNavigateAdd =(route:any)=>{
        setisUploadClicked(true);
      }

      const handleNavigateAdd1 =(route:any)=>{
        setisUploadClicked1(true);
      }

      async function getAllCollectionsERC721() {
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
    
          setNftCollections721(collectionTokenURIs);
        } catch (error) {
          console.error("Error fetching collections:", error);
        }
      }

      async function getAllCollectionsERC1151() {
        try {
          if (!signer) return;
          const contract = new ethers.Contract(
            "0x512f89A87D95346f9cF1558fAb9cA505809F944a",
            NFTMarketplaceABI1,
            signer
          );
    
          const collections = await contract.getAllCollections();
    
          const collectionTokenURIs = await Promise.all(
            collections.map(async (collection: any) => {
              const tokens = await contract.getTokensInCollection(collection.id); 
              const tokenURIs = await Promise.all(
                tokens.map(async (token: any) => {
                  const uri = await contract.getTokenUri(token.tokenId);
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
    console.log(collectionTokenURIs);
          setNftCollections1151(collectionTokenURIs);
        } catch (error) {
          console.error("Error fetching collections:", error);
        }
      }
    

    
      return (
        <>
        <div className="headingView"><span className="headingText">NFT Marketplace</span></div>
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
              (<UploadNFT onComplete={handleUploadSuccess} collectionLength={nftCollectionsERC721?.length} />) 
             :isUploadClicked1 ?
             (<UploadNFT2 onComplete={handleUploadSuccess1} collectionLength={nftCollectionsERC1151?.length} />)
             :
             (
             <div style={{ width: '50%', height: '50%', position: 'absolute',padding:'25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',backgroundColor:'rgba(255, 255, 255, 0.3)'}}>
            <Button
              onClick={handleNavigateView721}
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
              MANAGE EXISTING COLLECTIONS ERC 721
            </Button>

            <Button
              onClick={handleNavigateView1151}
              variant="contained"
              style={{
                width: '50%',
                marginBottom: '10px',
                ...manageCollectionsStyle1,
                fontWeight: 'bold',
                transition: 'background-color 0.3s, color 0.3s',
              }}
              onMouseEnter={handleManageCollectionsEnter1}
              onMouseLeave={handleManageCollectionsLeave1}
            >
              MANAGE EXISTING COLLECTIONS ERC 1151
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
              ADD NEW COLLECTIONS ERC 721
            </Button>

            <Button
              onClick={handleNavigateAdd1}
              variant="contained"
              style={{
                width: '50%',
                ...addCollectionsStyle1,
                fontWeight: 'bold',
                transition: 'background-color 0.3s, color 0.3s',
              }}
              onMouseEnter={handleAddCollectionsEnter1}
              onMouseLeave={handleAddCollectionsLeave1}
            >
              ADD NEW COLLECTIONS ERC 1151
            </Button>
          </div>
          )
             }
          
        </Box>
        </>
      );
}