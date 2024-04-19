// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFTContract is ERC1155 {
    using Counters for Counters.Counter;

    // Structs
    struct Collection {
        uint256 id;
        string name;
        address owner;
    }

    struct ListedToken {
        uint256 tokenId;
        uint256 collectionId;
        address owner;
    }

    // Events
    event CollectionCreated(uint256 indexed collectionId, string name, address indexed owner);
    event TokenCreated(uint256 indexed tokenId, uint256 indexed collectionId, address indexed owner, string tokenURI);

    // Storage
    mapping(uint256 => Collection) public collections;
    mapping(uint256 => ListedToken[]) public tokensInCollection;
    mapping(uint256 => string) public tokenId2Uri;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _collectionIdCounter;
      string public name;
    string public symbol;
    // Constructor
    constructor(string memory baseURI) ERC1155(baseURI) {
    name = "pawanerc1155";
    symbol = "PAW";
}

    // Functions
    function createCollection(string memory _name) external {
        uint256 collectionId = _collectionIdCounter.current();
        _collectionIdCounter.increment();
        collections[collectionId] = Collection(collectionId, _name, msg.sender);
        emit CollectionCreated(collectionId, _name, msg.sender);
    }

    function createToken(uint256 collectionId, string memory tokenURI) external {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(msg.sender, tokenId,1,'0x0');
        tokensInCollection[collectionId].push(ListedToken(tokenId, collectionId, msg.sender));
        tokenId2Uri[tokenId]=tokenURI;
        emit TokenCreated(tokenId, collectionId, msg.sender, tokenURI);
    }


    function getAllCollections() external view returns (Collection[] memory) {
        Collection[] memory allCollections = new Collection[](_collectionIdCounter.current());
        for (uint256 i = 0; i < _collectionIdCounter.current(); i++) {
            allCollections[i] = collections[i];
        }
        return allCollections;
    }

    function getTokensInCollection(uint256 collectionId) external view returns (ListedToken[] memory) {
        return tokensInCollection[collectionId];
    }

    function getMyCollections() external view returns (Collection[] memory) {
        Collection[] memory myCollections;
        uint256 count = 0;
        for (uint256 i = 0; i < _collectionIdCounter.current(); i++) {
            if (collections[i].owner == msg.sender) {
                count++;
            }
        }
        myCollections = new Collection[](count);
        count = 0;
        for (uint256 i = 0; i < _collectionIdCounter.current(); i++) {
            if (collections[i].owner == msg.sender) {
                myCollections[count] = collections[i];
                count++;
            }
        }
        return myCollections;
    }
    function getTokenUri(uint256 tokenId)external view returns (string memory Uri){
        return tokenId2Uri[tokenId];
    }
}
