pragma solidity 0.8.13;

import "./Slab.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract TokenDeposit {

    address[5] public slabs;
    mapping(uint256 => uint256) public slabsOccupied;

    constructor() {
        slabs[0] = address(new Slab(100));
        slabs[1] = address(new Slab(200));
        slabs[2] = address(new Slab(300));
        slabs[3] = address(new Slab(400));
        slabs[4] = address(new Slab(500));
    }

    function deposit(address _token, uint256 _amount) external {
        IERC20(_token).transferFrom(msg.sender, slabs[slabs.length - 1], _amount);

    }
}

