//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Personus {
    event NewGreeting(bytes32 greeting);
    event NewUser(uint256 identityCommitment, bytes32 username);
    event NewVouch(uint256 applicationId);
    event NewApplication(uint256 identityCommitment, uint256 applicationId);

    address public admin;
    uint256 public groupId;
    uint256 public applicationIdCounter = 0;
    ISemaphore public semaphore;

    mapping(uint256 => PersonusMember) public users; // identityCommitment => PersonusMember
    mapping(uint256 => PersonusApplication) public applications; // applicationId => PersonusApplication
    mapping(uint256 => bool) internal nullifierHashes; // nullifierHash => whether it has been used

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    struct PersonusApplication {
        uint256 identityCommitment;
        uint256 vouchCount;
    }

    struct PersonusMember {
        bytes32 username;
        uint256 applicationId;
        bool isMember;
    }

    constructor(address _semaphoreAddress, uint256 _groupId) {
        admin = msg.sender;
        semaphore = ISemaphore(_semaphoreAddress);
        groupId = _groupId;

        semaphore.createGroup(groupId, 20, 0, address(this));
    }

    function addGenesisMember(uint256 _identityCommitment, bytes32 _username)
        public
        onlyAdmin
    {
        require(!users[_identityCommitment].isMember, "Already a member");

        semaphore.addMember(groupId, _identityCommitment);
        users[_identityCommitment] = PersonusMember(_username, 0, true);

        emit NewUser(_identityCommitment, _username);
    }

    function createApplication(uint256 _identityCommitment) public {
        require(!users[_identityCommitment].isMember, "Already a member");

        applications[applicationIdCounter] = PersonusApplication(
            _identityCommitment,
            0
        );

        emit NewApplication(_identityCommitment, applicationIdCounter);
        applicationIdCounter++;
    }

    function castVouch(
        bytes32 _vouchMsg,
        uint256 _applicationId,
        uint256 _merkleTreeRoot,
        uint256 _nullifierHash,
        uint256[8] calldata _proof
    ) external {
        // application id is used as nullifer
        require(
            !nullifierHashes[_nullifierHash],
            "Nullifier hash has already been used"
        );
        semaphore.verifyProof(
            groupId,
            _merkleTreeRoot,
            _vouchMsg, // signal
            _nullifierHash,
            _applicationId,
            _proof
        );

        nullifierHashes[_nullifierHash] = true;

        PersonusApplication storage application = applications[_applicationId];
        application.vouchCount++;

        emit NewVouch(_applicationId);
    }

    function joinGroup(
        uint256 _identityCommitment,
        uint256 _applicationId,
        bytes32 _username
    ) external {
        require(
            applications[_applicationId].identityCommitment ==
                _identityCommitment,
            "Not your application"
        );
        require(
            applications[_applicationId].vouchCount >= 3,
            "Not enough vouches"
        );
        require(!users[_identityCommitment].isMember, "Already a member");

        semaphore.addMember(groupId, _identityCommitment);

        users[_identityCommitment] = PersonusMember(
            _username,
            _applicationId,
            true
        );

        emit NewUser(_identityCommitment, _username);
    }

    function bytesToUint256(bytes memory _bs)
        internal
        pure
        returns (uint256 value)
    {
        require(_bs.length == 32, "bytes length is not 32.");
        assembly {
            // load 32 bytes from memory starting from position _bs + 32
            value := mload(add(_bs, 0x20))
        }
        require(
            value <=
                0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff,
            "Value exceeds the range"
        );
    }
}
