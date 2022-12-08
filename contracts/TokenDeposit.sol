pragma solidity 0.8.13;

import "./Slab.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract TokenDeposit {

    event Deposit(address indexed _user, uint256 _amount);

    address[5] public slabs;
    mapping(address => uint256[]) public depositedSlabs;
    constructor() {
        slabs[0] = address(new Slab(100 * 1e18));
        slabs[1] = address(new Slab(200 * 1e18));
        slabs[2] = address(new Slab(300 * 1e18));
        slabs[3] = address(new Slab(400 * 1e18));
        slabs[4] = address(new Slab(500 * 1e18));
    }

    modifier isDeposited(address _depositor) {
        uint256[] memory userSlabs = depositedSlabs[_depositor];
        require(userSlabs.length == 0, "already deposited");
        _;
    }

    function deposit(address _token, uint256 _amount) external isDeposited(msg.sender){
        require(_amount > 0, "amount is 0");
        uint256 temp = _amount;
        for(uint256 i = slabs.length - 1; i >=0 ;i--){
            uint256 available = Slab(slabs[i]).getAvailableCapacity();
            if(available == 0) continue;
            // fill some tokens in available slabs
            // fill the rest in other slabs
            if(temp > available){
                temp = temp - available;
                Slab(slabs[i]).updateFilled(available);
                IERC20(_token).transferFrom(msg.sender, slabs[i], available);
            }
            else { 
                Slab(slabs[i]).updateFilled(temp);
                IERC20(_token).transferFrom(msg.sender, slabs[i], temp);
                temp = 0;
            }
            depositedSlabs[msg.sender].push(i);

            if(temp == 0 || i == 0)
                break;
        }
        require(temp == 0, "no vacant slabs for this amount");
        emit Deposit(msg.sender, _amount);
    }
    function getDepositedSlab(address _depositor) external view returns(uint256[] memory){
        return depositedSlabs[_depositor];
    }

}

