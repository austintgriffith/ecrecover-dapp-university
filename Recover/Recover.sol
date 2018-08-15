pragma solidity ^0.4.24;

/*
  Post signed messages to prove message came from a certain account

  Things to try:
    send a message from your account to prove it works
    send a message from another account
    sign a message with one account and send it from another

  Problems:
    replay
    string is too general, sign the contract address and signer too
    What else?
 */


import "openzeppelin-solidity/contracts/ECRecovery.sol";

contract Recover {
  using ECRecovery for bytes32;

  constructor() public {
    emit Message(address(this),"Contract Deployed");
  }

  function message(string _message, bytes _signature) public returns (address){
    bytes32 hash = keccak256(abi.encodePacked(_message));
    address signer = hash.toEthSignedMessageHash().recover(_signature);
    emit Message(signer,_message);
    return signer;
  }
  event Message(address signer,string message);
}
