import { HatsSignerGateClient } from "../src/index";
import { HatsClient } from "@hatsprotocol/sdk-v1-core";
import { createPublicClient, createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
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
      forkUrl: process.env.SEPOLIA_RPC,
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
      chain: sepolia,
      transport: http("http://127.0.0.1:8545"),
    });
    walletClient = createWalletClient({
      chain: sepolia,
      transport: http("http://127.0.0.1:8545"),
    });

    hsgClient = new HatsSignerGateClient({ publicClient, walletClient });

    hatsClient = new HatsClient({
      chainId: sepolia.id,
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

  describe("Deploy HSG and a Safe", () => {
    let safe: Address;
    let hsg: Address;
    let hsgSignerMaxOne: Address;
    beforeAll(async () => {
      const res = await hsgClient.deployHatsSignerGateAndSafe({
        account: account1,
        ownerHatId: hat1,
        signersHatId: hat1_1,
        minThreshold: 2n,
        targetThreshold: 3n,
        maxSigners: 5n,
      });
      safe = res.newSafeInstance;
      hsg = res.newHsgInstance;

      const resOneMaxSigner = await hsgClient.deployHatsSignerGateAndSafe({
        account: account1,
        ownerHatId: hat1,
        signersHatId: hat1_1,
        minThreshold: 1n,
        targetThreshold: 1n,
        maxSigners: 1n,
      });
      hsgSignerMaxOne = resOneMaxSigner.newHsgInstance;

      await hatsClient.mintHat({
        account: account1,
        hatId: hat1_1,
        wearer: account2.address,
      });
    }, 30000);

    test("Test deployment", async () => {
      const numSigners = await hsgClient.validSignerCount({ instance: hsg });
      const safeInInstance = await hsgClient.getSafe({ instance: hsg });
      const minThreshold = await hsgClient.getMinThreshold({ instance: hsg });
      const targetThreshold = await hsgClient.getTargetThreshold({
        instance: hsg,
      });
      const maxSigners = await hsgClient.getMaxSigners({
        instance: hsg,
      });
      const signersHat = await hsgClient.hsgSignersHatId({ hsgInstance: hsg });
      expect(numSigners).toBe(0n);
      expect(safeInInstance).toBe(safe);
      expect(minThreshold).toBe(2n);
      expect(targetThreshold).toBe(3n);
      expect(maxSigners).toBe(5n);
      expect(signersHat).toBe(hat1_1);
    });

    test("Test get instance params", async () => {
      const params = await hsgClient.getInstanceParameters(hsg);
      expect(params.length).toBe(5);
      expect(params[0].value).toBe(safe);
      expect(params[1].value).toBe(2n);
      expect(params[2].value).toBe(3n);
      expect(params[3].value).toBe(5n);
      expect(params[4].value).toBe(hat1);
    });

    describe("Account claims signer rights", () => {
      beforeAll(async () => {
        const metadata = hsgClient.getMetadata("HSG");
        await hsgClient.callInstanceWriteFunction({
          account: account2,
          type: "HSG",
          instance: hsg,
          func: metadata.writeFunctions[0],
          args: [],
        });
      });

      test("Test claim is successful", async () => {
        const numSigners = await hsgClient.validSignerCount({ instance: hsg });
        const isValidSigner = await hsgClient.hsgIsValidSigner({
          hsgInstance: hsg,
          address: account2.address,
        });
        expect(numSigners).toBe(1n);
        expect(isValidSigner).toBe(true);
      });

      test("Test claim rejects when already claimed", async () => {
        const metadata = hsgClient.getMetadata("HSG");
        await expect(async () => {
          await hsgClient.callInstanceWriteFunction({
            account: account2,
            type: "HSG",
            instance: hsg,
            func: metadata.writeFunctions[0],
            args: [],
          });
        }).rejects.toThrow(
          `Error: Signer ${account2.address} is already on the safe, cannot claim twice`
        );
      });

      test("Test claim rejects for non valid signer", async () => {
        const metadata = hsgClient.getMetadata("HSG");
        await expect(async () => {
          await hsgClient.callInstanceWriteFunction({
            account: account1,
            type: "HSG",
            instance: hsg,
            func: metadata.writeFunctions[0],
            args: [],
          });
        }).rejects.toThrow(
          `Error: Address ${account1.address} is not a wearer of the signer Hat, only its wearers can become signers`
        );
      });

      test("Test claim rejects when max signers reached", async () => {
        const metadata = hsgClient.getMetadata("HSG");
        await hsgClient.hsgClaimSigner({
          account: account2,
          hsgInstance: hsgSignerMaxOne,
        });

        await expect(async () => {
          await hsgClient.callInstanceWriteFunction({
            account: account1,
            type: "HSG",
            instance: hsgSignerMaxOne,
            func: metadata.writeFunctions[0],
            args: [],
          });
        }).rejects.toThrow(
          "Error: Can never have more signers than designated by the max amount of signers parameter"
        );
      });
    });

    describe("Reconcile Signer Count", () => {
      beforeAll(async () => {
        const metadata = hsgClient.getMetadata("HSG");
        await hsgClient.callInstanceWriteFunction({
          account: account2,
          type: "HSG",
          instance: hsg,
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
      test("Test remove signer reverts for a valid signer", async () => {
        const metadata = hsgClient.getMetadata("HSG");
        await expect(async () => {
          await hsgClient.callInstanceWriteFunction({
            account: account2,
            type: "HSG",
            instance: hsg,
            func: metadata.writeFunctions[2],
            args: [account2.address],
          });
        }).rejects.toThrow(
          `Error: Address ${account2.address} still wears the signer Hat, can't remove a signer if they're still wearing the signer hat`
        );
      });

      test("Test remove signer", async () => {
        await hatsClient.transferHat({
          account: account1,
          hatId: hat1_1,
          from: account2.address,
          to: account1.address,
        });

        const metadata = hsgClient.getMetadata("HSG");
        await hsgClient.callInstanceWriteFunction({
          account: account2,
          type: "HSG",
          instance: hsg,
          func: metadata.writeFunctions[2],
          args: [account2.address],
        });

        const numSigners = await hsgClient.validSignerCount({ instance: hsg });
        const isValidSigner = await hsgClient.hsgIsValidSigner({
          hsgInstance: hsg,
          address: account2.address,
        });
        expect(numSigners).toBe(0n);
        expect(isValidSigner).toBe(false);
      }, 30000);
    });

    describe("Test Set Min Threshold", () => {
      test("Test set min threshold reverts when invalid value", async () => {
        const metadata = hsgClient.getMetadata("HSG");
        await expect(async () => {
          await hsgClient.callInstanceWriteFunction({
            account: account1,
            type: "HSG",
            instance: hsg,
            func: metadata.writeFunctions[3],
            args: [10n],
          });
        }).rejects.toThrow(
          `Error: Min threshold cannot be higher than the max amount of signers or the target threshold`
        );
      });

      test("Test set min threshold", async () => {
        const metadata = hsgClient.getMetadata("HSG");
        await hsgClient.callInstanceWriteFunction({
          account: account1,
          type: "HSG",
          instance: hsg,
          func: metadata.writeFunctions[3],
          args: [1n],
        });
        const minThreshod = await hsgClient.getMinThreshold({ instance: hsg });
        expect(minThreshod).toBe(1n);
      });
    });

    describe("Test Set Terget Threshold", () => {
      test("Test set target threshold reverts when invalid value", async () => {
        await expect(async () => {
          const metadata = hsgClient.getMetadata("HSG");
          await hsgClient.callInstanceWriteFunction({
            account: account1,
            type: "HSG",
            instance: hsg,
            func: metadata.writeFunctions[5],
            args: [20n],
          });
        }).rejects.toThrow(
          `Error: Target threshold must not be larger than the max amount of signers or smaller than the min threshold`
        );
      });

      test("Test set target threshold", async () => {
        const metadata = hsgClient.getMetadata("HSG");
        await hsgClient.callInstanceWriteFunction({
          account: account1,
          type: "HSG",
          instance: hsg,
          func: metadata.writeFunctions[5],
          args: [2n],
        });
        const targetThreshod = await hsgClient.getTargetThreshold({
          instance: hsg,
        });
        expect(targetThreshod).toBe(2n);
      });
    });

    describe("Test Set Owner Hat", () => {
      beforeAll(async () => {
        const metadata = hsgClient.getMetadata("HSG");
        await hsgClient.callInstanceWriteFunction({
          account: account1,
          type: "HSG",
          instance: hsg,
          func: metadata.writeFunctions[4],
          args: [hat1_2, "0x3bc1A0Ad72417f2d411118085256fC53CBdDd137"],
        });
      });

      test("Test set owner hat", async () => {
        const ownerHat = await hsgClient.getOwnerHat({
          instance: hsg,
        });
        expect(ownerHat).toBe(hat1_2);
      });
    });
  });

  afterAll(async () => {
    await anvil.stop();
  }, 30000);
});
