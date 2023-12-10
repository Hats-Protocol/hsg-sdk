import { HatsSignerGateClient } from "../src/index";
import { HatsClient } from "@hatsprotocol/sdk-v1-core";
import { createPublicClient, createWalletClient, http } from "viem";
import { goerli } from "viem/chains";
import { createAnvil } from "@viem/anvil";
import { privateKeyToAccount } from "viem/accounts";
import type {
  PublicClient,
  WalletClient,
  PrivateKeyAccount,
  Address,
} from "viem";
import type { Anvil } from "@viem/anvil";
import "dotenv/config";

describe("Client Tests With Metadata", () => {
  let publicClient: PublicClient;
  let walletClient: WalletClient;
  let hsgClient: HatsSignerGateClient;
  let hatsClient: HatsClient;
  let anvil: Anvil;

  let account1: PrivateKeyAccount;
  let account2: PrivateKeyAccount;
  let hat1: bigint;
  let hat1_1: bigint;
  let hat1_2: bigint;

  beforeAll(async () => {
    anvil = createAnvil({
      forkUrl: process.env.GOERLI_RPC,
      startTimeout: 20000,
    });
    await anvil.start();

    account1 = privateKeyToAccount(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    );
    account2 = privateKeyToAccount(
      "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    );

    // init Viem clients
    publicClient = createPublicClient({
      chain: goerli,
      transport: http("http://127.0.0.1:8545"),
    });
    walletClient = createWalletClient({
      chain: goerli,
      transport: http("http://127.0.0.1:8545"),
    });

    hsgClient = new HatsSignerGateClient({ publicClient, walletClient });

    hatsClient = new HatsClient({
      chainId: goerli.id,
      publicClient: publicClient,
      walletClient: walletClient,
    });

    const resHat1 = await hatsClient.mintTopHat({
      target: account1.address,
      details: "Tophat SDK",
      imageURI: "Tophat URI",
      account: account1,
    });
    hat1 = resHat1.hatId;

    const resHat1_1 = await hatsClient.createHat({
      admin: hat1,
      maxSupply: 3,
      eligibility: account1.address,
      toggle: account1.address,
      mutable: true,
      details: "1.1 details",
      imageURI: "1.1 URI",
      account: account1,
    });
    hat1_1 = resHat1_1.hatId;

    const resHat1_2 = await hatsClient.createHat({
      admin: hat1,
      maxSupply: 3,
      eligibility: account1.address,
      toggle: account1.address,
      mutable: true,
      details: "1.1 details",
      imageURI: "1.1 URI",
      account: account1,
    });
    hat1_2 = resHat1_2.hatId;
  }, 30000);

  describe("Deploy MHSG and a Safe", () => {
    let safe: Address;
    let mhsg: Address;
    beforeAll(async () => {
      const res = await hsgClient.deployMultiHatsSignerGateAndSafe({
        account: account1,
        ownerHatId: hat1,
        signersHatIds: [hat1_1, hat1_2],
        minThreshold: 2n,
        targetThreshold: 3n,
        maxSigners: 5n,
      });
      safe = res.newSafeInstance;
      mhsg = res.newMultiHsgInstance;

      await hatsClient.mintHat({
        account: account1,
        hatId: hat1_1,
        wearer: account2.address,
      });
    });

    test("Test deployment", async () => {
      const numSigners = await hsgClient.validSignerCount({ instance: mhsg });
      const safeInInstance = await hsgClient.getSafe({ instance: mhsg });
      const minThreshold = await hsgClient.getMinThreshold({ instance: mhsg });
      const targetThreshold = await hsgClient.getTargetThreshold({
        instance: mhsg,
      });
      const maxSigners = await hsgClient.getMaxSigners({
        instance: mhsg,
      });
      const isValidSignerHat = await hsgClient.mhsgIsValidSignerHat({
        mhsgInstance: mhsg,
        hatId: hat1_1,
      });
      expect(numSigners).toBe(0n);
      expect(safeInInstance).toBe(safe);
      expect(minThreshold).toBe(2n);
      expect(targetThreshold).toBe(3n);
      expect(maxSigners).toBe(5n);
      expect(isValidSignerHat).toBe(true);
    });

    describe("Account claims signer rights", () => {
      beforeAll(async () => {
        const metadata = hsgClient.getMetadata("MHSG");
        await hsgClient.callInstanceWriteFunction({
          account: account2,
          type: "MHSG",
          instance: mhsg,
          func: metadata.writeFunctions[0],
          args: [hat1_1],
        });
      });

      test("Test claim is successful", async () => {
        const numSigners = await hsgClient.validSignerCount({ instance: mhsg });
        const isValidSigner = await hsgClient.mhsgIsValidSigner({
          mhsgInstance: mhsg,
          address: account2.address,
        });
        expect(numSigners).toBe(1n);
        expect(isValidSigner).toBe(true);
      });
    });

    describe("Reconcile Signer Count", () => {
      beforeAll(async () => {
        const metadata = hsgClient.getMetadata("MHSG");
        await hsgClient.callInstanceWriteFunction({
          account: account2,
          type: "MHSG",
          instance: mhsg,
          func: metadata.writeFunctions[1],
          args: [],
        });
      });

      test("Test reconcile signer count", async () => {
        const threshold = await publicClient.readContract({
          address: safe,
          abi: [
            {
              inputs: [],
              name: "getThreshold",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
          functionName: "getThreshold",
        });
        expect(threshold).toBe(1n);
      });
    });

    describe("Remove Signer", () => {
      beforeAll(async () => {
        await hatsClient.transferHat({
          account: account1,
          hatId: hat1_1,
          from: account2.address,
          to: account1.address,
        });

        const metadata = hsgClient.getMetadata("MHSG");
        await hsgClient.callInstanceWriteFunction({
          account: account2,
          type: "MHSG",
          instance: mhsg,
          func: metadata.writeFunctions[2],
          args: [account2.address],
        });
      });

      test("Test remove signer", async () => {
        const numSigners = await hsgClient.validSignerCount({ instance: mhsg });
        const isValidSigner = await hsgClient.mhsgIsValidSigner({
          mhsgInstance: mhsg,
          address: account2.address,
        });
        expect(numSigners).toBe(0n);
        expect(isValidSigner).toBe(false);
      });
    });

    describe("Test Set Min Threshold", () => {
      beforeAll(async () => {
        const metadata = hsgClient.getMetadata("MHSG");
        await hsgClient.callInstanceWriteFunction({
          account: account1,
          type: "MHSG",
          instance: mhsg,
          func: metadata.writeFunctions[3],
          args: [1n],
        });
      });

      test("Test set min threshold", async () => {
        const minThreshod = await hsgClient.getMinThreshold({ instance: mhsg });
        expect(minThreshod).toBe(1n);
      });
    });

    describe("Test Set Terget Threshold", () => {
      beforeAll(async () => {
        const metadata = hsgClient.getMetadata("MHSG");
        await hsgClient.callInstanceWriteFunction({
          account: account1,
          type: "MHSG",
          instance: mhsg,
          func: metadata.writeFunctions[5],
          args: [2n],
        });
      });

      test("Test set target threshold", async () => {
        const targetThreshod = await hsgClient.getTargetThreshold({
          instance: mhsg,
        });
        expect(targetThreshod).toBe(2n);
      });
    });

    describe("Test Add Signer Hat", () => {
      beforeAll(async () => {
        const metadata = hsgClient.getMetadata("MHSG");
        await hsgClient.callInstanceWriteFunction({
          account: account1,
          type: "MHSG",
          instance: mhsg,
          func: metadata.writeFunctions[6],
          args: [[hat1]],
        });
      });

      test("Test add signer hat", async () => {
        const isValidSignerHat = await hsgClient.mhsgIsValidSignerHat({
          mhsgInstance: mhsg,
          hatId: hat1,
        });
        expect(isValidSignerHat).toBe(true);
      });
    });

    describe("Test Set Owner Hat", () => {
      beforeAll(async () => {
        const metadata = hsgClient.getMetadata("MHSG");
        await hsgClient.callInstanceWriteFunction({
          account: account1,
          type: "MHSG",
          instance: mhsg,
          func: metadata.writeFunctions[4],
          args: [hat1_2, "0x3bc1A0Ad72417f2d411118085256fC53CBdDd137"],
        });
      });

      test("Test set owner hat", async () => {
        const ownerHat = await hsgClient.getOwnerHat({
          instance: mhsg,
        });
        expect(ownerHat).toBe(hat1_2);
      });
    });
  });

  afterAll(async () => {
    await anvil.stop();
  }, 30000);
});
