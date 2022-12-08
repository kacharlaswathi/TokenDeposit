pragma solidity 0.8.13;

contract Slab {
    uint256 public capacity;
    uint256 public filled;

    constructor(uint256 _capacity){
        capacity = _capacity;
    }

    function getAvailableCapacity() external view returns(uint256) {
        return capacity - filled;
    }

    function updateFilled(uint256 _amount) external {
        filled += _amount;
    }
}