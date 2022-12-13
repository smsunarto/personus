//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Personus.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract PersonusConsumer {
    event Foo(uint256 newCounterCount);

    uint256 public counter = 0;
    uint256 public groupId;
    Personus public personus;
    ISemaphore public semaphore;

    constructor(Personus _personus) {
        personus = _personus;
        groupId = _personus.groupId();
        semaphore = ISemaphore(personus.semaphore());
    }

    // only allow valid personus member to call this function
    function incrementCounter(
        bytes32 _signal,
        uint256 _merkleTreeRoot,
        uint256 _nullifierHash,
        uint256[8] calldata _proof
    ) public {
        semaphore.verifyProof(
            groupId,
            _merkleTreeRoot,
            _signal,
            _nullifierHash,
            groupId,
            _proof
        );

        counter++;
        emit Foo(counter);
    }
}
