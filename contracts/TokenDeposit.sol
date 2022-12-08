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
        require(_amount > 0, "amount is 0");
        uint256 temp = _amount;
        for(uint256 i = slabs.length - 1; i >=0 ;i--){
            uint256 available = Slab(slabs[i]).getAvailableCapacity();
            if(available == 0) continue;
            // fill some tokens in available slabs
            // fill the rest in other slabs
            if(temp >= available){
                temp = temp - available;
                Slab(slabs[i]).updateFilled(temp - available);
                IERC20(_token).transferFrom(msg.sender, slabs[i], temp - available);
            }
            else { 
                temp = 0;
                IERC20(_token).transferFrom(msg.sender, slabs[i], temp);
                break;
            }
            
        }
        require(temp == 0, "no vacant slabs for this amount");
    }
}

