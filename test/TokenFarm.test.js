const { assert } = require("chai");

const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");

require("chai")
  .use(require("chai-as-promised"))
  .should();

const ONE_MILLION = "1000000";
const ONE_HUNDRED = "100";

function tokens(n) {
  return web3.utils.toWei(n, "Ether");
}

// in args - accounts destruct this
contract("TokenFarm", ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;
  before(async () => {
    // Load Contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens(ONE_MILLION));

    // Send tokens to investor
    await daiToken.transfer(investor, tokens(ONE_HUNDRED, { from: owner }));
  });
  describe("Mock Dai deployment", async () => {
    it("has a name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });

  describe("Dapp Token deployment", async () => {
    it("has a name", async () => {
      const name = await dappToken.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("TokenFarm deployment", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "Dapp Token Farm");
    });
    it("contract has tokens", async () => {
      const balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens(ONE_MILLION));
    });
  });
});
