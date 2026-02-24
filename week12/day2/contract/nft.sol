// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract NFTCollection is ERC721, ERC721Enumerable, Ownable, IERC2981 {

    using Strings for uint256;

    // =============================
    // CONSTANTS
    // =============================

    uint256 public constant MAX_SUPPLY = 10;
    uint256 public constant MAX_PER_WALLET = 3;
    uint256 public constant MAX_BATCH = 3;

    // =============================
    // STATE
    // =============================

    uint256 public mintPrice = 0.05 ether;
    uint256 private _tokenIdCounter;

    bool public revealed;
    bool public whitelistActive = true;

    string public notRevealedURI;
    string public baseURI ="ipfs://bafybeihcw6lp7msrcqwhqe6bh5sapqid5u7uemnp4vzp3ys4ye44pd3m5m/";

    mapping(address => bool) public whitelist;
    mapping(address => uint256) public mintedCount;

    address private _royaltyReceiver;
    uint96 private _royaltyBps = 500; // 5%

    // =============================
    // EVENTS
    // =============================

    event Minted(address indexed to, uint256 indexed tokenId);
    event Revealed(string baseURI);
    event WhitelistUpdated(address indexed account, bool status);
    event Withdrawn(address indexed owner, uint256 amount);

    // =============================
    // CONSTRUCTOR
    // =============================

    constructor(address initialOwner)
        ERC721("MyNFTCollection", "MNC")
        Ownable(initialOwner)
    {
        notRevealedURI = "ipfs://bafybeihcw6lp7msrcqwhqe6bh5sapqid5u7uemnp4vzp3ys4ye44pd3m5m/hidden.json";
        _royaltyReceiver = initialOwner;
        whitelist[initialOwner] = true;
    }

    // =============================
    // MINT
    // =============================

    function mint(uint256 quantity) external payable {
        require(quantity > 0, "Invalid quantity");
        require(quantity <= MAX_BATCH, "Exceeds max batch");
        require(_tokenIdCounter + quantity <= MAX_SUPPLY, "Max supply reached");
        require(mintedCount[msg.sender] + quantity <= MAX_PER_WALLET, "Wallet limit");
        require(msg.value >= mintPrice * quantity, "Insufficient ETH");

        if (whitelistActive) {
            require(whitelist[msg.sender], "Not whitelisted");
        }

        for (uint256 i; i < quantity; ) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;
            mintedCount[msg.sender]++;

            _safeMint(msg.sender, tokenId);
            emit Minted(msg.sender, tokenId);

            unchecked { i++; }
        }

        // Refund excess
        uint256 cost = mintPrice * quantity;
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }
    }

    function ownerMint(address to, uint256 quantity) external onlyOwner {
        require(_tokenIdCounter + quantity <= MAX_SUPPLY, "Max supply reached");

        for (uint256 i; i < quantity; ) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;

            _safeMint(to, tokenId);
            emit Minted(to, tokenId);

            unchecked { i++; }
        }
    }

    // =============================
    // METADATA
    // =============================

    function reveal(string calldata _baseURI) external onlyOwner {
        baseURI = _baseURI;
        revealed = true;
        emit Revealed(_baseURI);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        _requireOwned(tokenId);

        if (!revealed) {
            return notRevealedURI;
        }

        return string(
            abi.encodePacked(baseURI, tokenId.toString(), ".json")
        );
    }

    function setNotRevealedURI(string calldata uri) external onlyOwner {
        notRevealedURI = uri;
    }

    // =============================
    // WHITELIST
    // =============================

    function setWhitelistActive(bool status) external onlyOwner {
        whitelistActive = status;
    }

    function addToWhitelist(address[] calldata accounts) external onlyOwner {
        for (uint256 i; i < accounts.length; ) {
            whitelist[accounts[i]] = true;
            emit WhitelistUpdated(accounts[i], true);
            unchecked { i++; }
        }
    }

    function removeFromWhitelist(address account) external onlyOwner {
        whitelist[account] = false;
        emit WhitelistUpdated(account, false);
    }

    // =============================
    // ADMIN
    // =============================

    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");

        emit Withdrawn(owner(), balance);
    }

    // =============================
    // ROYALTY (ERC2981)
    // =============================

    function royaltyInfo(uint256, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        royaltyAmount = (salePrice * _royaltyBps) / 10000;
        return (_royaltyReceiver, royaltyAmount);
    }

    function setRoyaltyReceiver(address receiver) external onlyOwner {
        _royaltyReceiver = receiver;
    }

    // =============================
    // VIEWS
    // =============================

    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - _tokenIdCounter;
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function tokensOfOwner(address ownerAddr)
        external
        view
        returns (uint256[] memory)
    {
        uint256 count = balanceOf(ownerAddr);
        uint256[] memory ids = new uint256[](count);

        for (uint256 i; i < count; ) {
            ids[i] = tokenOfOwnerByIndex(ownerAddr, i);
            unchecked { i++; }
        }

        return ids;
    }

    // =============================
    // REQUIRED OVERRIDES
    // =============================

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    receive() external payable {}
}