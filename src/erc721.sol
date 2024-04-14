pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFTContract is ERC721 {
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

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _collectionIdCounter;

    // Constructor
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    // Functions
    function createCollection(string memory _name) external {
        uint256 collectionId = _collectionIdCounter.current();
        _collectionIdCounter.increment();
        collections[collectionId] = Collection(collectionId, _name, msg.sender);
        emit CollectionCreated(collectionId, _name, msg.sender);
    }

    function createToken(uint256 collectionId, string memory tokenURI) external {
        require(collections[collectionId].owner == msg.sender, "Only collection owner can create tokens");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(msg.sender, tokenId);
        tokensInCollection[collectionId].push(ListedToken(tokenId, collectionId, msg.sender));
        emit TokenCreated(tokenId, collectionId, msg.sender, tokenURI);
    }

    function transferFrom(address from, address to, uint256 tokenId) public override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _transfer(from, to, tokenId);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        return _isApprovedForAll(ownerOf(tokenId), spender) || getApproved(tokenId) == spender || ownerOf(tokenId) == spender;
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
}
