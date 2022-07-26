// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Asad20.sol";

contract DEX {

    event Bought(uint256 amount);
    event Sold(uint256 amount);
    Asad20 public token;
    uint public rate = 100;

    uint public totalPrice;

    constructor(address _tokenAddress) {
        token =  Asad20(_tokenAddress);
    }

function buy() payable public {
    uint256 amountTobuy = msg.value / 1 ether;
    uint256 total = amountTobuy * rate;
    uint256 dexBalance = token.balanceOf(address(this));
    require(amountTobuy > 0, "You need to send some ether");
    require(amountTobuy <= dexBalance, "Not enough tokens in the reserve");
    token.transfer(msg.sender, total);
    emit Bought(amountTobuy);
}

function sell(uint256 amount) public {
    require(amount > 0, "You need to sell at least some tokens");
    uint256 balance = (amount / rate) * 1 ether;
    uint256 allowance = token.allowance(msg.sender, address(this));
    require(allowance >= amount, "Check the token allowance");
    token.transferFrom(msg.sender, address(this), amount);
    payable(msg.sender).transfer(balance);
    emit Sold(amount);
}

function getBalanceOfToken() public view returns (uint256) {
  return Asad20(token).balanceOf(address(this));
}

}