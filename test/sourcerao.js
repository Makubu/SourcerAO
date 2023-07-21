// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat");


// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("SourcerAO", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Get the Signers here.
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call ethers.deployContract and await
    // its waitForDeployment() method, which happens once its transaction has been
    // mined.
    const sourcerao = await ethers.deployContract("SourcerAO");

    await sourcerao.waitForDeployment();

    // Fixtures can return anything you consider useful for your tests
    return { sourcerao, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define each
    // of your tests. It receives the test name, and a callback function.
    //
    // If the callback function is async, Mocha will `await` it.
    it("Owner is admin and admin manager", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { sourcerao, owner } = await loadFixture(deployTokenFixture);
      expect(await sourcerao.isAdmin(owner.address)).to.equal(true);
      expect(await sourcerao.isAdminManager(owner.address)).to.equal(true);
    });
  });

  describe("Transactions", function () {
    it("Only admin can set parameters", async function () {
        const { sourcerao, owner, addr1, addr2 } = await loadFixture(
            deployTokenFixture
        );
    
        await expect(
            sourcerao.connect(addr1).setParameters(1,1,1,1)
        ).to.be.revertedWith("Caller is not an admin");
    });

    it("Create a project", async function () {
      const { sourcerao, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      // Transfer 50 tokens from owner to addr1
      await sourcerao.connect(addr1).createProject("Test Project", "uri to desc", true);

      console.log("project count", await sourcerao.getProjectCount());

      console.log("project 0:", await sourcerao.getProject(0));
    });

  });
});