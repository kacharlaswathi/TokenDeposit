import { expect } from "chai";
import { utils } from "ethers";

export function shouldBehaveLikeTokenDeposit(): void {
  it("Should be able to successfully deposit to slabs", async function () {
    const tokenDeposit = await this.tokenDeposit.connect(this.signers.admin);
    const token = await this.testToken.connect(this.signers.admin);
    const depositAmount = utils.parseEther("10");
    await token.approve(tokenDeposit.address, depositAmount);
    const allowance = await token.allowance(await this.signers.admin.getAddress(), tokenDeposit.address);

    expect(allowance).to.eq(depositAmount);
    await expect(tokenDeposit.deposit(token.address, depositAmount)).to.emit(tokenDeposit, "Deposit");
    const slabs = await tokenDeposit.getDepositedSlab(await this.signers.admin.getAddress());
    expect(slabs[0]).to.eq(4);
  });
  it("Should be allocated to other slabs if one slab is full in single deposit", async function () {
    const tokenDeposit = await this.tokenDeposit.connect(this.signers.admin);
    const token = await this.testToken.connect(this.signers.admin);
    const depositAmount = utils.parseEther("600");
    await token.approve(tokenDeposit.address, depositAmount);
    const allowance = await token.allowance(await this.signers.admin.getAddress(), tokenDeposit.address);

    expect(allowance).to.eq(depositAmount);
    await tokenDeposit.deposit(token.address, depositAmount);
    const slabs = await tokenDeposit.getDepositedSlab(await this.signers.admin.getAddress());
    expect(slabs[0]).to.eq(4);
    expect(slabs[1]).to.eq(3);
  });
  it("Should be allocated to other slabs if one slab is full in second deposit", async function () {
    const tokenDeposit = await this.tokenDeposit.connect(this.signers.admin);
    const token = await this.testToken.connect(this.signers.admin);
    const depositAmount = utils.parseEther("500");
    await token.approve(tokenDeposit.address, depositAmount);
    const allowance = await token.allowance(await this.signers.admin.getAddress(), tokenDeposit.address);

    expect(allowance).to.eq(depositAmount);
    await tokenDeposit.deposit(token.address, depositAmount);
    const slabs = await tokenDeposit.getDepositedSlab(await this.signers.admin.getAddress());

    expect(slabs[0]).to.eq(4);
    await token.transfer(await this.signers.admin1.getAddress(), depositAmount);

    await token.connect(this.signers.admin1).approve(tokenDeposit.address, depositAmount);

    expect(allowance).to.eq(depositAmount);
    await tokenDeposit.connect(this.signers.admin1).deposit(token.address, depositAmount);
    const secondDepositSlabs = await tokenDeposit.getDepositedSlab(await this.signers.admin1.getAddress());
    expect(secondDepositSlabs[0]).to.eq(3);
  });

  it("Should revert deposit if amount is greater than available in all the slabs", async function () {
    const tokenDeposit = await this.tokenDeposit.connect(this.signers.admin);
    const token = await this.testToken.connect(this.signers.admin);
    const depositAmount = utils.parseEther("5000");
    await token.approve(tokenDeposit.address, depositAmount);
    const allowance = await token.allowance(await this.signers.admin.getAddress(), tokenDeposit.address);

    expect(allowance).to.eq(depositAmount);
    await expect(tokenDeposit.deposit(token.address, depositAmount)).to.be.revertedWith(
      "no vacant slabs for this amount",
    );
  });

  it("Should revert deposit for second time for same user", async function () {
    const tokenDeposit = await this.tokenDeposit.connect(this.signers.admin);
    const token = await this.testToken.connect(this.signers.admin);
    const depositAmount = utils.parseEther("500");
    await token.approve(tokenDeposit.address, depositAmount);
    const allowance = await token.allowance(await this.signers.admin.getAddress(), tokenDeposit.address);

    expect(allowance).to.eq(depositAmount);
    await tokenDeposit.deposit(token.address, depositAmount);
    const slabs = await tokenDeposit.getDepositedSlab(await this.signers.admin.getAddress());

    expect(slabs[0]).to.eq(4);

    await expect(tokenDeposit.deposit(token.address, depositAmount)).to.be.revertedWith("already deposited");
  });
}
