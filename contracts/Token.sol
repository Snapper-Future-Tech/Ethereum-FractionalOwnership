pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address owner;

    constructor() ERC20("Token", "TKN") {
        // owner = msg.sender;
    }

    function addProperty(uint256 amount) public {
        _mint(msg.sender, amount);
    }

    function transferTokens(address to, uint256 amount) public {
        _transfer(msg.sender, to, amount);
    }

    function sell(address to, uint256 amount) public {
        _transfer(msg.sender, to, amount);
    }

    function burnTokens(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
