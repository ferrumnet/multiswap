const { ethers } = require("hardhat");

async function main() {
    // Compile the contracts and libraries
    await hre.run('compile');
    // Deploy the OneInchDecoder library
    const OneInchDecoder = await ethers.getContractFactory("OneInchDecoder");
    const oneInchDecoder = await OneInchDecoder.deploy();
    await oneInchDecoder.deployed();
    console.log("OneInchDecoder library deployed to:", oneInchDecoder.address);

    // Attach to the already deployed FerrumDeployer contract
    const ferrumDeployerAddress = "0x";
    const FerrumDeployer = await ethers.getContractFactory("FerrumDeployer");
    const ferrumDeployer = await FerrumDeployer.attach(ferrumDeployerAddress);

    // Prepare the initialization data for MultiswapForge
    const initData = ethers.utils.defaultAbiCoder.encode(
        ["address", "address"],
        ["0x", "0x"] // ["oneInchAggregatorAddress", "poolAddress"]
    );

    // Get the contract factory for MultiswapForge
    const MultiswapForge = await ethers.getContractFactory("MultiswapForge", {
        libraries: {
            "contracts/common/oneInch/OneInchDecoder.sol:OneInchDecoder": oneInchDecoder.address
        }
      });

    // Compute the bytecode of MultiswapForge with initData (slicing 0x)
    const bytecodeWithInitData = MultiswapForge.bytecode + initData.slice(2);

    // Compute a unique salt for deployment
    const salt = ethers.utils.formatBytes32String(new Date().getTime().toString());

    // Deploy MultiswapForge using FerrumDeployer's deployOwnable function
    const ownerAddress = "0x"; // Replace with the desired owner address
    const deploymentTx = await ferrumDeployer.deployOwnable(salt, ownerAddress, initData, bytecodeWithInitData);
    const receipt = await deploymentTx.wait();
    console.log('receipt: ', receipt);

    const multiswapForgeAddress = receipt.events.find((event) => event.event === 'DeployedWithData').args[0];
    console.log("ForgeFundManager deployed to:", multiswapForgeAddress);
  console.log("Verifing...");
  await hre.run("verify:verify", {
    address: oneInchDecoder.address,
    constructorArguments: [],
  });
  await hre.run("verify:verify", {
    address: multiswapForgeAddress,
    constructorArguments: [],
    libraries: {
      OneInchDecoder : oneInchDecoder.address,
    },
  });
  console.log("Contract verified successfully !");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});