import { Signer } from "@ethersproject/abstract-signer";
import { ethers, waffle } from "hardhat";
import { Accounts, Signers } from "../types";
import { shouldBehaveLikeTokenDeposit } from "./TokenDeposit.behavior";
import { BigNumber, utils } from "ethers";
import { MockProvider } from "ethereum-waffle";


import TokenDepositArtifact from "../artifacts/contracts/TokenDeposit.sol/TokenDeposit.json";
import Erc20Artifact from "../artifacts/contracts/TestErc20.sol/TestErc20.json";

const { deployContract } = waffle;

describe("Token Deposit Unit tests", function () {
  const [wallet, walletTo] = new MockProvider().getWallets();

  before(async function () {
    this.accounts = {} as Accounts;
    this.signers = {} as Signers;

    const signers: Signer[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.admin1 = signers[1];

  });

  describe("Token Deposit", function () {
    this.beforeEach(async function () {
        this.testToken = await deployContract(this.signers.admin, Erc20Artifact, [
            "testToken",
            "testToken",
            BigNumber.from(utils.parseEther("1000000")),
          ]);
      this.tokenDeposit = await deployContract(this.signers.admin, TokenDepositArtifact, [
      ]);
  });
  shouldBehaveLikeTokenDeposit();
});
});
