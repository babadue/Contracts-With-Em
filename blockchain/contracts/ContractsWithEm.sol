// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

// allSourcePaths

contract ContractsWithEm {
    struct Em {
        address devl;
        uint date;
        uint level;
        uint reward;
    }

    mapping(address => Em) public devl;
    uint public level;
    uint[] public indexes;
    string[] public texts;
    Em[] public ems;
    address public this_address;
    address public owner;
    AggregatorV3Interface public priceFeed;

    constructor(address _priceFeed) {
        owner = msg.sender;
        this_address = address(this);
        priceFeed = AggregatorV3Interface(_priceFeed);
        setTexts();
    }

    function addDevl(address _emAddress, uint _level, uint _reward) public {
        devl[_emAddress] = Em(_emAddress, block.timestamp, _level, _reward);
    }

    function getDevl(address _emAddress) public view returns (Em memory) {
        return devl[_emAddress];
    }

    function getTimeStamp() public view returns (uint256) {
        return block.timestamp;
    }

    function setLevel(uint _level) public {
        level = _level;
    }

    function getLevel() public view returns (uint) {
        return level;
    }

    // function getIndexes() public view returns (uint[] memory) {
    //     return indexes;
    // }

    // function findIndexes(uint _level) public {
    //     delete indexes;
    //     for (uint i = 0; i < texts.length; i++) {
    //         if (_level & (2 ** i) != 0) {
    //             indexes.push(i);
    //         }
    //     }
    // }

    function findIndexes2(uint _level) public returns (uint[] memory) {
        delete indexes;
        for (uint i = 0; i < texts.length; i++) {
            if (_level & (2 ** i) != 0) {
                indexes.push(i);
            }
        }
        return indexes;
    }

    function toString(uint aString) public pure returns (string memory) {
        return Strings.toString(aString);
    }

    function getXOR(uint16 a, uint16 b) public pure returns (uint16) {
        return a ^ b;
    }

    function getAND(uint16 a, uint16 b) public pure returns (uint16) {
        return a & b;
    }

    function setTexts() public {
        texts.push("Time to go!");
        texts.push("Either they win or we do!");
        texts.push("Bring it on!");
        texts.push("Do me a favor!");
        texts.push("Two pronged approach!");
        texts.push("I don't know what 'is' is!");
    }

    function getTexts() public view returns (string[] memory) {
        return texts;
    }

    function getTextsLength() public view returns (uint) {
        return texts.length;
    }

    function getEms() public view returns (Em[] memory) {
        return ems;
    }

    function getThisAddress() public view returns (address) {
        return address(this);
    }

    function getPrice() public view returns (uint256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return uint256(answer / 100000000);
    }

    function multiplication(
        uint256 a,
        uint256 b
    ) public pure returns (uint256) {
        return a * b;
    }

    function division(uint256 a, uint256 b) public pure returns (uint256) {
        return a / b;
    }

    function divisionToWei(uint256 a, uint256 b) public pure returns (uint256) {
        return (a * 10 ** 18) / b;
    }

    function addition(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }

    function substraction(uint256 a, uint256 b) public pure returns (uint256) {
        return a - b;
    }

    function getSender() public view returns (address) {
        return msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getAddressThis() public view returns (address) {
        return address(this);
    }

    function reward(uint amount, uint _level, address payee) public {
        require(
            address(this).balance >= amount,
            "Not enough eth in the contract"
        );
        payable(payee).transfer(amount);
        Em memory _em = devl[payee];
        addDevl(payee, _level, amount + _em.reward);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function sendBalanceToOwner() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function deposit() public payable onlyOwner {}

    function getBalance() public view onlyOwner returns (uint) {
        return address(this).balance;
    }

    function isOnwer(address anAddress) public view returns (bool) {
        if (anAddress == owner) {
            return true;
        }
        return false;
    }
}
