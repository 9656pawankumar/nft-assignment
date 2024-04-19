import NFTMarketplaceABI from "../abi1155.json";
import { useEthersSigner } from "../getSigner";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Typography
} from "@mui/material";
import AddMoreNFT1 from "./AddNFT-erc1155";
import { useNavigate } from "react-router-dom";

interface Token {
  tokenURI: string; // Add other properties as needed
}

export default function BrowseNFT2() {
  const signer = useEthersSigner();

 
  async function getAllCollections() {
    try {
      if (!signer) return;
      const contract = new ethers.Contract(
        "0x512f89A87D95346f9cF1558fAb9cA505809F944a",
        NFTMarketplaceABI,
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

      setNftCollections(collectionTokenURIs);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  }
  

  // useEffect(() => {
  //   getAllCollections();
  // }, [signer]);

  const MINUTE_MS = 2000;
  useEffect(() => {
    const interval = setInterval(() => {
      getAllCollections();
    }, MINUTE_MS);
  
    return () => clearInterval(interval); 
  }, [])

  const handleNavigateView = (route: any) => {
    navigate("/landing");
  };
  const [addCollectionsStyle, setAddCollectionsStyle] = useState({
    backgroundColor: "black",
    color: "white",
  });

  const navigate = useNavigate();
  const [nftCollections, setNftCollections] = useState<any>();


  return (
    <section>
      <div className="headingView">
        <span className="goBackLink" onClick={handleNavigateView}>
          {"< Go Back"}
        </span>
        <span className="headingText">Manage Collections - ERC1151</span>
      </div>

      <div
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
        }}
      >
        <Grid container spacing={5} justifyContent="center">
          {nftCollections?.map((nc: any, id: number) => (
            <Grid
              item
              xs={12}
              md={6}
              key={id}
              sx={{ margin: "0 auto", textAlign: "center" }}
            >
              <Card style={{ maxWidth: "40rem" }}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    <b>Collection Name: </b>
                    {nc?.collectionName}
                  </Typography>
                  <Typography color="textSecondary">
                    <b>Id: </b> {nc?.collectionId.toString()}
                  </Typography>
                  <Typography variant="body2" component="p">
                    NFT Count: {nc?.tokens.length}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                      overflowX: "auto",
                    }}
                  >
                    {nc?.tokens?.map((token: any, index: number) => (
                      <img
                        key={index}
                        style={{
                          width: "auto",
                          height: "100px",
                          marginRight: "10px",
                        }}
                        src={token?.tokenURI}
                        alt={`Token ${index}`}
                      />
                    ))}
                  </div>
                </CardContent>
                <CardActions style={{ justifyContent: "center" }}>
                  <Button
                    id={`addBtn-${id}`}
                    size="small"
                    style={{
                      marginBottom: "10px",
                      ...addCollectionsStyle,
                      fontWeight: "bold",
                      transition: "background-color 0.3s, color 0.3s",
                    }}
                    onClick={() => {
                      const dialog = document.getElementById(
                        `addMoreDialog-${id}`
                      );
                      if (dialog instanceof HTMLDialogElement) {
                        dialog.showModal();
                      }
                    }}
                  >
                    Add NFTs
                  </Button>
                </CardActions>
              </Card>
              <dialog
                id={`addMoreDialog-${id}`}
                className="rounded p-5"
                style={{
                  backgroundColor: "white",
                  width: "300px",
                  position: "relative",
                }}
              >
                <button
                  onClick={() => {
                    const dialog = document.getElementById(
                      `addMoreDialog-${id}`
                    );
                    if (dialog instanceof HTMLDialogElement) {
                      dialog.close();
                    }
                  }}
                  className="btn btn-danger mt-3"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    fontWeight: "bold",
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  X
                </button>
                <h2 className="text-lg font-semibold">Select images</h2>
                <div>
                  <AddMoreNFT1 collectionID={id + 1} />
                </div>
              </dialog>
            </Grid>
            
          ))}
        </Grid>
      </div>
    </section>
  );
}
