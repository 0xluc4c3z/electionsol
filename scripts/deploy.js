const hre = require("hardhat");

async function main() {
  
  const Election = await hre.ethers.getContractFactory("Election");
  const election = await Election.deploy();

  await election.deployed();

  console.log("Election deployed to:", election.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
