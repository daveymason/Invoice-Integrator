// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.7.0/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.7.0/contracts/access/Ownable.sol";

contract InvoiceNFT is ERC721, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("InvoiceNFT", "INV") {}

    function mintNFT(address recipient, string memory metadataURI) public onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, metadataURI);
        nextTokenId++;
        return tokenId;
    }

    function _setTokenURI(uint256 tokenId, string memory metadataURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = metadataURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }
}

//This is working on remix IDE and also on Metamask using Polgon SDK Testnet for testing