// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat")
const helpers = require("@nomicfoundation/hardhat-network-helpers");

const {loadFixture,} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("SourcerAO", function () {
    async function deployContract() {
        const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
        const sourcerao = await ethers.deployContract("SourcerAO");
        await sourcerao.waitForDeployment();
        return { sourcerao, owner, addr1, addr2, addr3, addr4};
    }

    async function deployContractAndFund() {
        const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
        const sourcerao = await ethers.deployContract("SourcerAO");
        await sourcerao.waitForDeployment();
        await sourcerao.connect(addr1).createProject("Test Project", "uri to desc", true);
        await sourcerao.connect(addr1).setProjectParameters(0, await helpers.time.latest() + 3600, await helpers.time.latest() + 7200)
        await sourcerao.connect(addr1).fundProject(0, {value: ethers.parseEther("100")});
        await sourcerao.connect(addr2).fundProject(0, {value: ethers.parseEther("200")});
        var proj =  await sourcerao.getProject(0);
        var param = await sourcerao.getParameters();
        return {sourcerao, proj, param, owner, addr1, addr2, addr3, addr4};
    }

    async function deployContractProgressProject() {
        var { sourcerao, proj, param, owner, addr1, addr2, addr3, addr4} = await loadFixture(deployContractAndFund);
        await sourcerao.connect(owner).applyToProject(0);
        await sourcerao.connect(addr3).applyToProject(0);
        await helpers.time.increaseTo(await helpers.time.latest() + 3601);
        await sourcerao.connect(addr4).startVotePhase(0);
        await sourcerao.connect(addr1).voteForDeveloper(0, owner);
        await sourcerao.connect(addr2).voteForDeveloper(0, addr3);
        await helpers.time.increaseTo(await helpers.time.latest() + 3601);
        await sourcerao.connect(addr4).endVotePhase(0)
        await sourcerao.connect(addr3).acceptProject(0, {value: ethers.parseEther("30")});
        proj =  await sourcerao.getProject(0);
        return {sourcerao, proj, param, owner, addr1, addr2, addr3, addr4};
    }


    describe("Deployment", function () {
        it("Owner is admin and admin manager", async function () {
            const { sourcerao, owner } = await loadFixture(deployContract);
            expect(await sourcerao.isAdmin(owner.address)).to.equal(true);
            expect(await sourcerao.isAdminManager(owner.address)).to.equal(true);
        });
    });

    describe("Transactions", function () {
        it("Only admin can set parameters", async function () {
            const { sourcerao, owner, addr1, addr2, addr3, addr4 } = await loadFixture(
                deployContract
            );

            await expect(sourcerao.connect(addr1).setParameters(1,1,1)).to.be.revertedWith("Caller is not an admin");
        });

        it("Create a project", async function () {
            const { sourcerao, owner, addr1, addr2, addr3, addr4 } = await loadFixture(deployContract);
            
            await sourcerao.connect(addr1).createProject("Test Project", "uri to desc", true);
            
            const proj =  await sourcerao.getProject(0);
            expect(proj[1]).to.equal("Test Project");

        });

        it("Fund a project", async function () {
            const { sourcerao, owner, addr1, addr2, addr3, addr4 } = await loadFixture(deployContract);

            await sourcerao.connect(addr1).createProject("Test Project", "uri to desc", true);
            
            var proj =  await sourcerao.getProject(0);        
            const params = await sourcerao.getParameters();
            
            await sourcerao.connect(addr1).fundProject(0, {value: 100});
            
            proj =  await sourcerao.getProject(0);
            var expected_bail = 100n*params[0]/100n;
            var expected_fund = 100n - expected_bail;
            
            expect(proj[7]).to.equal(expected_fund);
            expect(proj[8]).to.equal(expected_bail);

            await sourcerao.connect(addr2).fundProject(0, {value: 200});
            proj =  await sourcerao.getProject(0);
            expected_bail = 300n*params[0]/100n;
            expected_fund = 300n - expected_bail;
            
            expect(proj[7]).to.equal(expected_fund);
            expect(proj[8]).to.equal(expected_bail);

        });

        it("Fund a project and withdraw", async function () {
            var  { sourcerao, proj, param, owner, addr1, addr2, addr3, addr4} = await loadFixture(deployContractAndFund);
        
            await expect(sourcerao.connect(addr3).withdrawFunds(0)).to.be.revertedWith("You have no funds to withdraw");

            await expect(sourcerao.connect(addr2).withdrawFunds(0)).to.changeEtherBalance(
                addr2,
                (ethers.parseEther("200"))
              );

            var funders = proj[13];
            expect(funders[0]).to.equal(addr1.address);
            expect(funders[1]).to.equal(addr2.address);
            const addr1_funds = await sourcerao.getFunds(0, addr1.address);
            expect(addr1_funds[0]).to.equal(ethers.parseEther("90"));
            expect(addr1_funds[1]).to.equal(ethers.parseEther("10"));

        });

        it("Apply for a project", async function () {
            var { sourcerao, proj, param, owner, addr1, addr2, addr3, addr4} = await loadFixture(deployContractAndFund);

            await sourcerao.connect(addr3).applyToProject(0);
            proj =  await sourcerao.getProject(0);
            var applicants = proj[14];
            expect(applicants[0]).to.equal(addr3.address);
            expect(await sourcerao.hasApplied(0, addr3.address)).to.equal(true);

        });

        it("Project start (vote + accept)", async function () {
            
            var { sourcerao, proj, param, owner, addr1, addr2, addr3, addr4} = await loadFixture(deployContractAndFund);
            await sourcerao.connect(owner).applyToProject(0);
            await sourcerao.connect(addr3).applyToProject(0);
            await expect(sourcerao.connect(addr4).startVotePhase(0)).to.be.revertedWith("Application deadline is not passed");
            var state = proj[6];
            expect(state).to.equal(0n);
            await helpers.time.increaseTo(await helpers.time.latest() + 3601);
            await sourcerao.connect(addr4).startVotePhase(0);
            proj =  await sourcerao.getProject(0);
            // State is now 1 (vote phase)
            expect(proj[6]).to.equal(1n);
            await expect(sourcerao.connect(addr4).voteForDeveloper(0, addr3)).to.be.revertedWith("You have no funds to vote");
            await sourcerao.connect(addr1).voteForDeveloper(0, owner);
            await sourcerao.connect(addr2).voteForDeveloper(0, addr3);
            
            await helpers.time.increaseTo(await helpers.time.latest() + 3601);

            // end vote phase and check winner
            await expect(sourcerao.connect(addr4).endVotePhase(0))
            .to.emit(sourcerao, "dev_chosen")
            .withArgs(0, addr3.address);

            proj =  await sourcerao.getProject(0);
            // State is now 2 (waiting for developer to accept)
            expect(proj[6]).to.equal(2n);

            await sourcerao.connect(addr3).acceptProject(0, {value: ethers.parseEther("30")});

            proj =  await sourcerao.getProject(0);
            // State is now 3 (progress)
            expect(proj[6]).to.equal(3n);
        });        

        it("Litigation", async function () {
            var { sourcerao, proj, param, owner, addr1, addr2, addr3, addr4} = await loadFixture(deployContractProgressProject);

            sourcerao.setParameters(10,0,0);
            await sourcerao.connect(addr1).litigate(0, {value: ethers.parseEther("10")});


        });

    });
});