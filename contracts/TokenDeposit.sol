pragma solidity 0.8.13;

import "./Slab.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract TokenDeposit {

    address[] public slabs;
    mapping(uint256 => uint256) public slabsOccupied;

    constructor() {
        slabs.push(new Slab(100));
        slabs.push(new Slab(200));
        slabs.push(new Slab(300));
        slabs.push(new Slab(400));
        slabs.push(new Slab(500));
    }

    function deposit(address _token, uint256 _amount) external {
        IERC20(_token).transferFrom(msg.sender, slabs[slabs.length - 1]);

    }
}

