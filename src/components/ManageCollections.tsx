import NFTMarketplaceABI from "../abi721.json";
import { useEthersSigner } from "../getSigner";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import UploadNFT from "./UploadNFT";
import AddMoreNFT from "./AddMoreNFT";
import AddMoreNFT1 from "../erc1155nft";
import { useNavigate } from "react-router-dom";

interface Token {
  tokenURI: string; // Add other properties as needed
}

export default function BrowseNFT() {
  const signer = useEthersSigner();

  const navigate = useNavigate();
  const [nftCollections, setNftCollections] = useState<any>();

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

  const [addCollectionsStyle, setAddCollectionsStyle] = useState({
    backgroundColor: "black",
    color: "white",
  });

  useEffect(() => {
    getAllCollections();
  }, [signer]);

  const handleNavigateView = (route: any) => {
    navigate("/landing");
  };

  return (
    <section>
      <div className="headingView">
        <span className="goBackLink" onClick={handleNavigateView}>
          {"< Go Back"}
        </span>
        <span className="headingText">Manage Collections</span>
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
                  <Button
                    id={`addBtnerc115-${id}`}
                    size="small"
                    style={{
                      marginBottom: "10px",
                      ...addCollectionsStyle,
                      fontWeight: "bold",
                      transition: "background-color 0.3s, color 0.3s",
                    }}
                    onClick={() => {
                      const dialog = document.getElementById(
                        `addMoreDialogerc115-${id}`
                      );
                      if (dialog instanceof HTMLDialogElement) {
                        dialog.showModal();
                      }
                    }}
                  >
                    Add ERC1155
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
                  <AddMoreNFT collectionID={id + 1} />
                </div>
              </dialog>
              <dialog
                id={`addMoreDialogerc115-${id}`}
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
                      `addMoreDialogerc115-${id}`
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
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { ethers } from "ethers";
// import { useEthersSigner } from "../getSigner";
// import { useNavigate } from "react-router-dom";
//  import NFTMarketplaceABI from "../abi721.json";

// import {
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Grid,
//   Typography,
// } from "@mui/material";

// import AddMoreNFT from "./AddMoreNFT";
// import AddMoreNFT1 from "../erc1155nft";

// interface Token {
//   tokenURI: string;
// }

// interface Collection {
//   id: number;
//   name: string;
//   tokens: Token[];
// }

// export default function BrowseNFT() {
//   const signer = useEthersSigner();
//   const navigate = useNavigate();
//   const [collections, setNftCollections] = useState<Collection[]>([]);

//   async function getAllCollections() {
//     try {
//       if (!signer) return;
//       const contract = new ethers.Contract(
//         "0xE5515F30168bb173D155Dcba4F1E26a69cf79b88",
//         NFTMarketplaceABI,
//         signer
//       );

//       const collections = await contract.getAllCollections();

//       const collectionTokenURIs = await Promise.all(
//         collections.map(async (collection: any) => {
//           const tokens = await contract.getTokensInCollection(collection.id);

//           const tokenURIs = await Promise.all(
//             tokens.map(async (token: any) => {
//               const uri = await contract.tokenURI(token.tokenId);
//               return {
//                 tokenId: token.tokenId,
//                 tokenURI: uri,
//               };
//             })
//           );

//           return {
//             collectionId: collection.id,
//             tokens: tokenURIs,
//             collectionName: collection.name,
//           };
//         })
//       );

//       setNftCollections(collectionTokenURIs);
//     } catch (error) {
//       console.error("Error fetching collections:", error);
//     }
//   }

//   const [addCollectionsStyle, setAddCollectionsStyle] = useState({
//     backgroundColor: "black",
//     color: "white",
//   });

//   useEffect(() => {
//     getAllCollections();
//   }, [signer]);

//   const handleNavigateView = (route: any) => {
//     navigate("/landing");
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <Button onClick={() => navigate(-1)} variant="contained" color="primary">
//         Go Back
//       </Button>
//       <Grid container spacing={4}>
//         {collections.map((collection, index) => (
//           <Grid item xs={12} sm={6} md={4} key={index}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h5" component="div">
//                   {collection.name}
//                 </Typography>
//                 <Typography sx={{ mb: 1.5 }} color="text.secondary">
//                   ID: {collection.id}
//                 </Typography>
//                 <Typography variant="body2">
//                   Number of NFTs: {collection.tokens.length}
//                 </Typography>
//                 {collection.tokens.slice(0, 3).map((token, idx) => (
//                   <img
//                     key={idx}
//                     src={token.tokenURI}
//                     alt={`Token ${idx}`}
//                     style={{ width: 100, height: 100, margin: 5 }}
//                   />
//                 ))}
//               </CardContent>
//               <CardActions>
//                 <Button
//                   size="small"
//                   onClick={() => {
//                     const dialog = document.getElementById(`addMoreDialog-${index}`);
//                     if (dialog instanceof HTMLDialogElement) {
//                       dialog.showModal();
//                     }
//                   }}
//                 >
//                   Add NFTs
//                 </Button>
//                 <Button
//                   size="small"
//                   onClick={() => {
//                     const dialog = document.getElementById(`addMore1155Dialog-${index}`);
//                     if (dialog instanceof HTMLDialogElement) {
//                       dialog.showModal();
//                     }
//                   }}
//                 >
//                   Add ERC1155
//                 </Button>
//               </CardActions>
//             </Card>
//             <dialog id={`addMoreDialog-${index}`}>
//               <h2>Add ERC721 NFT</h2>
//               <AddMoreNFT collectionID={collection.id} />
//               <Button
//                 onClick={() => {
//                   const dialog = document.getElementById(`addMoreDialog-${index}`);
//                   if (dialog instanceof HTMLDialogElement) {
//                     dialog.close();
//                   }
//                 }}
//               >
//                 Close
//               </Button>
//             </dialog>
//             <dialog id={`addMore1155Dialog-${index}`}>
//               <h2>Add ERC1155 NFT</h2>
//               <AddMoreNFT1 collectionID={collection.id} />
//               <Button
//                 onClick={() => {
//                   const dialog = document.getElementById(`addMore1155Dialog-${index}`);
//                   if (dialog instanceof HTMLDialogElement) {
//                     dialog.close();
//                   }
//                 }}
//               >
//                 Close
//               </Button>
//             </dialog>
//           </Grid>
//         ))}
//       </Grid>
//     </div>
//   );
// }
