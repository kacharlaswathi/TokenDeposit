pragma solidity 0.8.13;
import "@openzeppelin/contracts/access/Ownable.sol";


contract Slab is Ownable {
    uint256 public capacity;
    uint256 public filled;

    constructor(uint256 _capacity){
        capacity = _capacity;
    }

    function getAvailableCapacity() external view returns(uint256) {
        return capacity - filled;
    }

    function updateFilled(uint256 _amount) external onlyOwner{
        filled += _amount;
    }
}