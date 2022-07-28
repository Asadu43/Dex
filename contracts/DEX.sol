// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Asad20.sol";
import "hardhat/console.sol";

contract DEX {
    event Bought(uint256 amount);
    event Sold(uint256 amount);
    Asad20 public token;
    uint256 public rate = 100;
    uint256 public minimumPrice = 0.5 ether;

    constructor(address _tokenAddress) {
        token = Asad20(_tokenAddress);
    }

    function buy() public payable {
        require(msg.value >= minimumPrice, "You need to send some ether");
        uint256 amountTobuy = (msg.value * rate);
        uint256 dexBalance = token.balanceOf(address(this));
        require(amountTobuy <= dexBalance, "Not enough tokens in the reserve");
        token.transfer(msg.sender, amountTobuy);
        emit Bought(amountTobuy);
    } 
    function sell(uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "Check the token allowance");
        uint256 balance = (amount / rate);
        token.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(balance);
        emit Sold(amount);
    }

    function getBalanceOfToken() public view returns (uint256) {
        return Asad20(token).balanceOf(address(this));
    }
}
