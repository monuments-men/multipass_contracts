pragma solidity ^0.8.4;

contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }
}

interface ILayerZeroReceiver {
    // @notice LayerZero endpoint will invoke this function to deliver the message on the destination
    // @param _srcChainId - the source endpoint identifier
    // @param _srcAddress - the source sending contract address from the source chain
    // @param _nonce - the ordered message nonce
    // @param _payload - the signed payload is the UA bytes has encoded to be sent
    function lzReceive(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        uint64 _nonce,
        bytes calldata _payload
    ) external;
}

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256);

    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    ) external view returns (uint256);
}

interface ILayerZeroUserApplicationConfig {
    // @notice set the configuration of the LayerZero messaging library of the specified version
    // @param _version - messaging library version
    // @param _chainId - the chainId for the pending config change
    // @param _configType - type of configuration. every messaging library has its own convention.
    // @param _config - configuration in the bytes. can encode arbitrary content.
    function setConfig(
        uint16 _version,
        uint16 _chainId,
        uint _configType,
        bytes calldata _config
    ) external;

    // @notice set the send() LayerZero messaging library version to _version
    // @param _version - new messaging library version
    function setSendVersion(uint16 _version) external;

    // @notice set the lzReceive() LayerZero messaging library version to _version
    // @param _version - new messaging library version
    function setReceiveVersion(uint16 _version) external;

    // @notice Only when the UA needs to resume the message flow in blocking mode and clear the stored payload
    // @param _srcChainId - the chainId of the source chain
    // @param _srcAddress - the contract address of the source contract at the source chain
    function forceResumeReceive(
        uint16 _srcChainId,
        bytes calldata _srcAddress
    ) external;
}

interface ILayerZeroEndpoint is ILayerZeroUserApplicationConfig {
    // @notice send a LayerZero message to the specified address at a LayerZero endpoint.
    // @param _dstChainId - the destination chain identifier
    // @param _destination - the address on destination chain (in bytes). address length/format may vary by chains
    // @param _payload - a custom bytes payload to send to the destination contract
    // @param _refundAddress - if the source transaction is cheaper than the amount of value passed, refund the additional amount to this address
    // @param _zroPaymentAddress - the address of the ZRO token holder who would pay for the transaction
    // @param _adapterParams - parameters for custom functionality. e.g. receive airdropped native gas from the relayer on destination
    function send(
        uint16 _dstChainId,
        bytes calldata _destination,
        bytes calldata _payload,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes calldata _adapterParams
    ) external payable;

    // @notice used by the messaging library to publish verified payload
    // @param _srcChainId - the source chain identifier
    // @param _srcAddress - the source contract (as bytes) at the source chain
    // @param _dstAddress - the address on destination chain
    // @param _nonce - the unbound message ordering nonce
    // @param _gasLimit - the gas limit for external contract execution
    // @param _payload - verified payload to send to the destination contract
    function receivePayload(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        address _dstAddress,
        uint64 _nonce,
        uint _gasLimit,
        bytes calldata _payload
    ) external;

    // @notice get the inboundNonce of a receiver from a source chain which could be EVM or non-EVM chain
    // @param _srcChainId - the source chain identifier
    // @param _srcAddress - the source chain contract address
    function getInboundNonce(
        uint16 _srcChainId,
        bytes calldata _srcAddress
    ) external view returns (uint64);

    // @notice get the outboundNonce from this source chain which, consequently, is always an EVM
    // @param _srcAddress - the source chain contract address
    function getOutboundNonce(
        uint16 _dstChainId,
        address _srcAddress
    ) external view returns (uint64);

    // @notice gets a quote in source native gas, for the amount that send() requires to pay for message delivery
    // @param _dstChainId - the destination chain identifier
    // @param _userApplication - the user app address on this EVM chain
    // @param _payload - the custom message to send over LayerZero
    // @param _payInZRO - if false, user app pays the protocol fee in native token
    // @param _adapterParam - parameters for the adapter service, e.g. send some dust native token to dstChain
    function estimateFees(
        uint16 _dstChainId,
        address _userApplication,
        bytes calldata _payload,
        bool _payInZRO,
        bytes calldata _adapterParam
    ) external view returns (uint nativeFee, uint zroFee);

    // @notice get this Endpoint's immutable source identifier
    function getChainId() external view returns (uint16);

    // @notice the interface to retry failed message on this Endpoint destination
    // @param _srcChainId - the source chain identifier
    // @param _srcAddress - the source chain contract address
    // @param _payload - the payload to be retried
    function retryPayload(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        bytes calldata _payload
    ) external;

    // @notice query if any STORED payload (message blocking) at the endpoint.
    // @param _srcChainId - the source chain identifier
    // @param _srcAddress - the source chain contract address
    function hasStoredPayload(
        uint16 _srcChainId,
        bytes calldata _srcAddress
    ) external view returns (bool);

    // @notice query if the _libraryAddress is valid for sending msgs.
    // @param _userApplication - the user app address on this EVM chain
    function getSendLibraryAddress(
        address _userApplication
    ) external view returns (address);

    // @notice query if the _libraryAddress is valid for receiving msgs.
    // @param _userApplication - the user app address on this EVM chain
    function getReceiveLibraryAddress(
        address _userApplication
    ) external view returns (address);

    // @notice query if the non-reentrancy guard for send() is on
    // @return true if the guard is on. false otherwise
    function isSendingPayload() external view returns (bool);

    // @notice query if the non-reentrancy guard for receive() is on
    // @return true if the guard is on. false otherwise
    function isReceivingPayload() external view returns (bool);

    // @notice get the configuration of the LayerZero messaging library of the specified version
    // @param _version - messaging library version
    // @param _chainId - the chainId for the pending config change
    // @param _userApplication - the contract address of the user application
    // @param _configType - type of configuration. every messaging library has its own convention.
    function getConfig(
        uint16 _version,
        uint16 _chainId,
        address _userApplication,
        uint _configType
    ) external view returns (bytes memory);

    // @notice get the send() LayerZero messaging library version
    // @param _userApplication - the contract address of the user application
    function getSendVersion(
        address _userApplication
    ) external view returns (uint16);

    // @notice get the lzReceive() LayerZero messaging library version
    // @param _userApplication - the contract address of the user application
    function getReceiveVersion(
        address _userApplication
    ) external view returns (uint16);
}

contract MultiPassContract is Ownable, ILayerZeroReceiver {
    // Address of the Layer Zero contract
    address public layerZeroContractAddress;
    address public omniTicketContract;
    ILayerZeroEndpoint public endpoint;

    uint256 gas = 450000;
    event NFTOwnershipBroadcasted(address owner, uint tokenId, uint timestamp);

    mapping(uint16 => mapping(address => bool)) public omniNftsSent;

    // nft contract address, tokenId, timestamp.
    mapping(address => mapping(uint => uint)) public broadcastedNftsTimestamp;
    uint cooldownTimerBroadcast = 60;

    constructor(address _omniTicketContract, address _endpoint) {
        //@TODO unnecessary imho
        layerZeroContractAddress = _endpoint;
        omniTicketContract = _omniTicketContract;
        endpoint = ILayerZeroEndpoint(_endpoint);
    }

    function multiPassCheck(
        address _ownerToVerify,
        uint16 _srcChainId
    ) external view returns (bool) {
        return omniNftsSent[_srcChainId][_ownerToVerify];
    }

    // Function to check if a message was sent from a specific address
    function lzReceive(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        uint64,
        bytes calldata _payload
    ) external override {
        require(msg.sender == address(layerZeroContractAddress));

        address fromAddress = abi.decode(_srcAddress, (address));
        require(fromAddress == omniTicketContract, "not our ticket contract!");

        (address ownerAddress, uint256 tokenId) = abi.decode(
            _payload,
            (address, uint256)
        );

        omniNftsSent[_srcChainId][ownerAddress] = true;
    }

    // the other was too complicated
    function checkFees(
        uint16 _dstChainId,
        bytes memory _destination
    ) external view returns (uint) {
        // Create an instance of the ERC721 contract

        IERC721 omniTicket = IERC721(omniTicketContract);
        // Check the balance of the msg.sender
        uint256 balance = omniTicket.balanceOf(msg.sender);

        bytes memory payload = abi.encode(msg.sender, 1);

        uint16 version = 1;
        bytes memory adapterParams = abi.encodePacked(version, gas);

        (uint256 messageFee, ) = endpoint.estimateFees(
            _dstChainId,
            address(this),
            payload,
            false,
            adapterParams
        );

        return messageFee;
    }

    function broadcastNFTOwnership(
        uint16 _dstChainId,
        bytes memory _destination
    ) external payable {
        // Create an instance of the ERC721 contract

        IERC721 omniTicket = IERC721(omniTicketContract);
        // Check the balance of the msg.sender
        uint256 balance = omniTicket.balanceOf(msg.sender);

        // If balance is more than 0, broadcast ownership
        if (balance > 0) {
            uint256 tokenId = omniTicket.tokenOfOwnerByIndex(msg.sender, 0);
            // Iterate through each owned NFT

            // Save the timestamp in the mapping
            broadcastedNftsTimestamp[msg.sender][tokenId] = block.timestamp;

            bytes memory payload = abi.encode(msg.sender, tokenId);

            uint16 version = 1;
            bytes memory adapterParams = abi.encodePacked(version, gas);

            (uint256 messageFee, ) = endpoint.estimateFees(
                _dstChainId,
                address(this),
                payload,
                false,
                adapterParams
            );
            require(
                msg.value >= messageFee,
                "Must send enough value to cover messageFee"
            );

            endpoint.send{value: msg.value}(
                _dstChainId,
                _destination,
                payload,
                payable(msg.sender),
                address(0x0),
                adapterParams
            );

            // Emit the event
            emit NFTOwnershipBroadcasted(msg.sender, tokenId, block.timestamp);
        }
    }
}
