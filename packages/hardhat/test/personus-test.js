const { Identity } = require("@semaphore-protocol/identity");
const { Group } = require("@semaphore-protocol/group");
const {
  generateProof,
  packToSolidityProof,
  verifyProof,
} = require("@semaphore-protocol/proof");
const { expect } = require("chai");
const { run, ethers } = require("hardhat");

describe("Personus", function () {
  let personus;

  const users = [];
  const groupId = 136784786;
  const group = new Group();

  before(async () => {
    personus = await run("deploy", { logs: false, group: groupId });

    users.push({
      identity: new Identity(),
      username: ethers.utils.formatBytes32String("genesis1"),
    });

    users.push({
      identity: new Identity(),
      username: ethers.utils.formatBytes32String("genesis2"),
    });

    users.push({
      identity: new Identity(),
      username: ethers.utils.formatBytes32String("genesis3"),
    });
    users.push({
      identity: new Identity(),
      username: ethers.utils.formatBytes32String("new-member"),
    });
    users.push({
      identity: new Identity(),
      username: ethers.utils.formatBytes32String("new-member2"),
    });

    group.addMember(users[0].identity.generateCommitment());
    group.addMember(users[1].identity.generateCommitment());
    group.addMember(users[2].identity.generateCommitment());
  });

  describe("# addGenesisMember ", () => {
    it("Should allow admin to add genesis member", async () => {
      for (let i = 0; i < 3; i++) {
        const transaction = personus.addGenesisMember(
          group.members[i],
          users[i].username
        );

        await expect(transaction)
          .to.emit(personus, "NewUser")
          .withArgs(group.members[i], users[i].username);
      }
    });
  });

  describe("# createApplication", () => {
    it("Should allow users to create application to the group", async () => {
      const commitmment = users[3].identity.generateCommitment();
      const transaction = personus.createApplication(commitmment);

      await expect(transaction)
        .to.emit(personus, "NewApplication")
        .withArgs(commitmment, 0);
    });

    it("Should prevent double application", async () => {
      const transaction = personus.createApplication(group.members[0]);

      await expect(transaction).to.be.revertedWith("Already a member");
    });

    it("Should increment application id", async () => {
      const commitmment = users[4].identity.generateCommitment();
      const transaction = personus.createApplication(commitmment);

      await expect(transaction)
        .to.emit(personus, "NewApplication")
        .withArgs(commitmment, 1);
    });
  });

  describe("# castVouch ", () => {
    const wasmFilePath = "./static/semaphore.wasm";
    const zkeyFilePath = "./static/semaphore.zkey";

    it("Should allow users to cast vouch", async () => {
      for (let i = 0; i < 3; i++) {
        const vouch = ethers.utils.formatBytes32String(
          "Vouch for application 0!"
        );

        const fullProof = await generateProof(
          users[i].identity,
          group,
          0,
          vouch,
          {
            wasmFilePath,
            zkeyFilePath,
          }
        );
        const solidityProof = packToSolidityProof(fullProof.proof);

        const transaction = personus.castVouch(
          vouch,
          0,
          fullProof.publicSignals.merkleRoot,
          fullProof.publicSignals.nullifierHash,
          solidityProof
        );

        await expect(transaction).to.emit(personus, "NewVouch").withArgs(0);
      }
    });

    it("Should prevent double vote", async () => {
      for (let i = 0; i < 3; i++) {
        const vouch = ethers.utils.formatBytes32String(
          "Vouch for application 0!"
        );

        const fullProof = await generateProof(
          users[i].identity,
          group,
          0,
          vouch,
          {
            wasmFilePath,
            zkeyFilePath,
          }
        );
        const solidityProof = packToSolidityProof(fullProof.proof);

        const transaction = personus.castVouch(
          vouch,
          0,
          fullProof.publicSignals.merkleRoot,
          fullProof.publicSignals.nullifierHash,
          solidityProof
        );

        await expect(transaction).to.be.revertedWith(
          "Nullifier hash has already been used"
        );
      }
    });
  });

  describe("# joinGroup ", () => {
    it("Should allow vouch > 3 application to join member", async () => {
      group.addMember(users[3].identity.generateCommitment());
      const transaction = personus.joinGroup(
        group.members[3],
        0,
        users[3].username
      );

      await expect(transaction)
        .to.emit(personus, "NewUser")
        .withArgs(group.members[3], users[3].username);
    });

    it("Should reject unvouched member", async () => {
      group.addMember(users[4].identity.generateCommitment());
      personus.createApplication(group.members[4]);
      const transaction = personus.joinGroup(
        group.members[4],
        1,
        users[4].username
      );

      await expect(transaction).to.be.revertedWith("Not enough vouches");
    });
  });
});
