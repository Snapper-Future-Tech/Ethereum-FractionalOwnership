//SPDX-License-Identifier: MIT

import "./token.sol";

pragma solidity ^0.8.0;

contract property{

    //Define owner
    address owner;
    constructor(){
        owner = msg.sender;
    }
}