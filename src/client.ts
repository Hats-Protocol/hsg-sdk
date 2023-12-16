import { PublicClient, WalletClient, decodeEventLog } from "viem";
import {
  HATS_SIGNER_GATE_FACTORY,
  HATS_SIGNER_GATE_BASE_ABI,
  HATS_SIGNER_GATE_ABI,
  MULTI_HATS_SIGNER_GATE_ABI,
  EXTENDED_HATS_SIGNER_GATE_FACTORY_ABI,
} from "./constants";
import {
  MissingPublicClientError,
  ChainIdMismatchError,
  MissingWalletClientError,
  NoChainError,
  ChainNotSupportedError,
  getError,
} from "./errors";
import { checkWriteFunctionArgs } from "./utils";
import { HSG_METADATA, MHSG_METADATA } from "./metadata";
import type { Account, Address } from "viem";
import {
  DeployHatsSignerGateAndSafeResult,
  DeployHatsSignerGateResult,
  DeployMultiHatsSignerGateAndSafeResult,
  DdeployMultiHatsSignerGateResult,
  HsgClaimSignerResult,
  MhsgClaimSignerResult,
  MhsgAddSignerHatsResult,
  SetTargetThresholdResult,
  SetMinThresholdResult,
  ReconcileSignerCountResult,
  RemoveSignerResult,
  SetOwnerHatResult,
  WriteFunction,
  CallInstanceWriteFunctionResult,
  HsgMetadata,
  HsgType,
} from "./types";

export class HatsSignerGateClient {
  private readonly _publicClient: PublicClient;
  private readonly _walletClient: WalletClient;
  private readonly _chainId: string;

  /**
   * Create a HatsSignerGateClient
   *
   * @param publicClient Viem Public Client
   * @param walletClient Viem Wallet Client
   * @returns A HatsSignerGateClient instance
   */
  constructor({
    publicClient,
    walletClient,
  }: {
    publicClient: PublicClient;
    walletClient: WalletClient;
  }) {
    if (publicClient === undefined) {
      throw new MissingPublicClientError("Error: public client is required");
    }
    if (walletClient === undefined) {
      throw new MissingWalletClientError("Error: wallet client is required");
    }
    if (walletClient.chain?.id !== publicClient.chain?.id) {
      throw new ChainIdMismatchError(
        "Error: provided chain id should match the wallet client chain id"
      );
    }
    if (walletClient.chain === undefined) {
      throw new NoChainError("Error: Viem client with no chain");
    }
    if (
      !Object.keys(HATS_SIGNER_GATE_FACTORY).includes(
        walletClient.chain.id.toString()
      )
    ) {
      throw new ChainNotSupportedError(
        `Error: chain ID ${walletClient.chain.id} is not supported`
      );
    }

    this._publicClient = publicClient;
    this._walletClient = walletClient;
    this._chainId = walletClient.chain.id.toString();
  }

  /*//////////////////////////////////////////////////////////////
                        HSG Factory
  //////////////////////////////////////////////////////////////*/

  /**
   * Deploy a new HatsSignerGate and a new Safe, all wired up together
   *
   * @param account A Viem account
   * @param ownerHatId ID of the HSG's Owner Hat
   * @param signersHatId ID of the HSG's Signers Hat
   * @param minThreshold HSG's min threshold
   * @param targetThreshold HSG's target threshold
   * @param maxSigners HSG's max amount of signers
   * @returns An object containing the status of the call, the transaction hash, the new HSG instance and the new Safe
   */
  async deployHatsSignerGateAndSafe({
    account,
    ownerHatId,
    signersHatId,
    minThreshold,
    targetThreshold,
    maxSigners,
  }: {
    account: Account | Address;
    ownerHatId: bigint;
    signersHatId: bigint;
    minThreshold: bigint;
    targetThreshold: bigint;
    maxSigners: bigint;
  }): Promise<DeployHatsSignerGateAndSafeResult> {
    try {
      const { request } = await this._publicClient.simulateContract({
        address: HATS_SIGNER_GATE_FACTORY[this._chainId],
        abi: EXTENDED_HATS_SIGNER_GATE_FACTORY_ABI,
        functionName: "deployHatsSignerGateAndSafe",
        args: [
          ownerHatId,
          signersHatId,
          minThreshold,
          targetThreshold,
          maxSigners,
        ],
        account,
      });

      const hash = await this._walletClient.writeContract(request);

      const receipt = await this._publicClient.waitForTransactionReceipt({
        hash,
      });

      let hsg: Address | undefined;
      let safe: Address | undefined;
      for (let eventIndex = 0; eventIndex < receipt.logs.length; eventIndex++) {
        try {
          const event = decodeEventLog({
            abi: EXTENDED_HATS_SIGNER_GATE_FACTORY_ABI,
            eventName: "HatsSignerGateSetup",
            data: receipt.logs[eventIndex].data,
            topics: receipt.logs[eventIndex].topics,
          });

          hsg = event.args._hatsSignerGate;
          safe = event.args._safe;
          break;
        } catch (err) {
          // continue
        }
      }

      if (hsg === undefined || safe === undefined) {
        throw new Error("Unexpected Error");
      }

      return {
        status: receipt.status,
        transactionHash: receipt.transactionHash,
        newHsgInstance: hsg,
        newSafeInstance: safe,
      };
    } catch (err) {
      getError(err);
    }
  }

  /**
   * Deploy a new HatsSignerGate and relate it to an existing Safe
   * In order to wire it up to the existing Safe, the owners of the Safe must enable it as a module and guard.
   * WARNING: HatsSignerGate must not be attached to a Safe with any other modules.
   * WARNING: HatsSignerGate must not be attached to its Safe if `validSignerCount()` >= `_maxSigners`
   * Before wiring up HatsSignerGate to its Safe, call `canAttachHSGToSafe` and make sure the result is true
   * Failure to do so may result in the Safe being locked forever
   *
   * @param account A Viem account
   * @param ownerHatId ID of the HSG's Owner Hat
   * @param signersHatId ID of the HSG's Signers Hat
   * @param safe Existing Gnosis Safe that the signers will join
   * @param minThreshold HSG's min threshold
   * @param targetThreshold HSG's target threshold
   * @param maxSigners HSG's max amount of signers
   * @returns An object containing the status of the call, the transaction hash and the new HSG instance
   */
  async deployHatsSignerGate({
    account,
    ownerHatId,
    signersHatId,
    safe,
    minThreshold,
    targetThreshold,
    maxSigners,
  }: {
    account: Account | Address;
    ownerHatId: bigint;
    signersHatId: bigint;
    safe: Address;
    minThreshold: bigint;
    targetThreshold: bigint;
    maxSigners: bigint;
  }): Promise<DeployHatsSignerGateResult> {
    try {
      const { request } = await this._publicClient.simulateContract({
        address: HATS_SIGNER_GATE_FACTORY[this._chainId],
        abi: EXTENDED_HATS_SIGNER_GATE_FACTORY_ABI,
        functionName: "deployHatsSignerGate",
        args: [
          ownerHatId,
          signersHatId,
          safe,
          minThreshold,
          targetThreshold,
          maxSigners,
        ],
        account,
      });

      const hash = await this._walletClient.writeContract(request);

      const receipt = await this._publicClient.waitForTransactionReceipt({
        hash,
      });

      let hsg: Address | undefined;
      for (let eventIndex = 0; eventIndex < receipt.logs.length; eventIndex++) {
        try {
          const event = decodeEventLog({
            abi: EXTENDED_HATS_SIGNER_GATE_FACTORY_ABI,
            eventName: "HatsSignerGateSetup",
            data: receipt.logs[eventIndex].data,
            topics: receipt.logs[eventIndex].topics,
          });

          hsg = event.args._hatsSignerGate;
          break;
        } catch (err) {
          // continue
        }
      }

      if (hsg === undefined) {
        throw new Error("Unexpected Error");
      }

      return {
        status: receipt.status,
        transactionHash: receipt.transactionHash,
        newHsgInstance: hsg,
      };
    } catch (err) {
      getError(err);
    }
  }

  /**
   * Deploy a new MultiHatsSignerGate and a new Safe, all wired up together
   *
   * @param account A Viem account
   * @param ownerHatId ID of the MHSG's Owner Hat
   * @param signersHatIds IDs of the MHSG's Signers Hats
   * @param minThreshold MHSG's min threshold
   * @param targetThreshold MHSG's target threshold
   * @param maxSigners MHSG's max amount of signers
   * @returns An object containing the status of the call, the transaction hash, the new MHSG instance and the new Safe
   */
  async deployMultiHatsSignerGateAndSafe({
    account,
    ownerHatId,
    signersHatIds,
    minThreshold,
    targetThreshold,
    maxSigners,
  }: {
    account: Account | Address;
    ownerHatId: bigint;
    signersHatIds: bigint[];
    minThreshold: bigint;
    targetThreshold: bigint;
    maxSigners: bigint;
  }): Promise<DeployMultiHatsSignerGateAndSafeResult> {
    try {
      const { request } = await this._publicClient.simulateContract({
        address: HATS_SIGNER_GATE_FACTORY[this._chainId],
        abi: EXTENDED_HATS_SIGNER_GATE_FACTORY_ABI,
        functionName: "deployMultiHatsSignerGateAndSafe",
        args: [
          ownerHatId,
          signersHatIds,
          minThreshold,
          targetThreshold,
          maxSigners,
        ],
        account,
      });

      const hash = await this._walletClient.writeContract(request);

      const receipt = await this._publicClient.waitForTransactionReceipt({
        hash,
      });

      let mhsg: Address | undefined;
      let safe: Address | undefined;
      for (let eventIndex = 0; eventIndex < receipt.logs.length; eventIndex++) {
        try {
          const event = decodeEventLog({
            abi: EXTENDED_HATS_SIGNER_GATE_FACTORY_ABI,
            eventName: "MultiHatsSignerGateSetup",
            data: receipt.logs[eventIndex].data,
            topics: receipt.logs[eventIndex].topics,
          });

          mhsg = event.args._hatsSignerGate;
          safe = event.args._safe;
          break;
        } catch (err) {
          // continue
        }
      }

      if (mhsg === undefined || safe === undefined) {
        throw new Error("Unexpected Error");
      }

      return {
        status: receipt.status,
        transactionHash: receipt.transactionHash,
        newMultiHsgInstance: mhsg,
        newSafeInstance: safe,
      };
    } catch (err) {
      getError(err);
    }
  }

  /**
   * Deploy a new MultiHatsSignerGate and relate it to an existing Safe
   * In order to wire it up to the existing Safe, the owners of the Safe must enable it as a module and guard
   * WARNING: MultiHatsSignerGate must not be attached to a Safe with any other modules
   * WARNING: MultiHatsSignerGate must not be attached to its Safe if `validSignerCount()` >= `_maxSigners`
   * Before wiring up MultiHatsSignerGate to its Safe, call `canAttachMHSGToSafe` and make sure the result is true
   * Failure to do so may result in the Safe being locked forever
   *
   * @param account A Viem account
   * @param ownerHatId ID of the MHSG's Owner Hat
   * @param signersHatIds IDs of the MHSG's Signers Hats
   * @param safe Existing Gnosis Safe that the signers will join
   * @param minThreshold MHSG's min threshold
   * @param targetThreshold MHSG's target threshold
   * @param maxSigners MHSG's max amount of signers
   * @returns An object containing the status of the call, the transaction hash and the new MHSG instance
   */
  async deployMultiHatsSignerGate({
    account,
    ownerHatId,
    signersHatIds,
    safe,
    minThreshold,
    targetThreshold,
    maxSigners,
  }: {
    account: Account | Address;
    ownerHatId: bigint;
    signersHatIds: bigint[];
    safe: Address;
    minThreshold: bigint;
    targetThreshold: bigint;
    maxSigners: bigint;
  }): Promise<DdeployMultiHatsSignerGateResult> {
    try {
      const { request } = await this._publicClient.simulateContract({
        address: HATS_SIGNER_GATE_FACTORY[this._chainId],
        abi: EXTENDED_HATS_SIGNER_GATE_FACTORY_ABI,
        functionName: "deployMultiHatsSignerGate",
        args: [
          ownerHatId,
          signersHatIds,
          safe,
          minThreshold,
          targetThreshold,
          maxSigners,
        ],
        account,
      });

      const hash = await this._walletClient.writeContract(request);

      const receipt = await this._publicClient.waitForTransactionReceipt({
        hash,
      });

      let mhsg: Address | undefined;
      for (let eventIndex = 0; eventIndex < receipt.logs.length; eventIndex++) {
        try {
          const event = decodeEventLog({
            abi: EXTENDED_HATS_SIGNER_GATE_FACTORY_ABI,
            eventName: "MultiHatsSignerGateSetup",
            data: receipt.logs[eventIndex].data,
            topics: receipt.logs[eventIndex].topics,
          });

          mhsg = event.args._hatsSignerGate;
          break;
        } catch (err) {
          // continue
        }
      }

      if (mhsg === undefined) {
        throw new Error("Unexpected Error");
      }

      return {
        status: receipt.status,
        transactionHash: receipt.transactionHash,
        newMultiHsgInstance: mhsg,
      };
    } catch (err) {
      getError(err);
    }
  }

  /*//////////////////////////////////////////////////////////////
                            HSG 
  //////////////////////////////////////////////////////////////*/

  /**
   * Claim signer rights on the safe. Account must wear the Signers Hat
   *
   * @param account A Viem account
   * @param hsgInstance HSG's instance address
   * @returns An object containing the status of the call and the transaction hash
   */
  async hsgClaimSigner({
    account,
    hsgInstance,
  }: {
    account: Account | Address;
    hsgInstance: Address;
  }): Promise<HsgClaimSignerResult> {
    try {
      const { request } = await this._publicClient.simulateContract({
        address: hsgInstance,
        abi: HATS_SIGNER_GATE_ABI,
        functionName: "claimSigner",
        account,
      });

      const hash = await this._walletClient.writeContract(request);

      const receipt = await this._publicClient.waitForTransactionReceipt({
        hash,
      });

      return {
        status: receipt.status,
        transactionHash: receipt.transactionHash,
      };
    } catch (err) {
      getError(err);
    }
  }

  /**
   * Check if a given account is a valid signer, i.e. is wearing the Signers Hat
   *
   * @param hsgInstance HSG's instance address
   * @param address The address to check
   * @returns 'true' if the address is a valid signer, 'false' otherwise
   */
  async hsgIsValidSigner({
    hsgInstance,
    address,
  }: {
    hsgInstance: Address;
    address: Address;
  }): Promise<boolean> {
    const isValid = await this._publicClient.readContract({
      address: hsgInstance,
      abi: HATS_SIGNER_GATE_ABI,
      functionName: "isValidSigner",
      args: [address],
    });

    return isValid;
  }

  /**
   * Get a HSG's Signers Hat ID
   *
   * @param hsgInstance HSG's instance address
   * @returns HSG's Signers Hat ID
   */
  async hsgSignersHatId({
    hsgInstance,
  }: {
    hsgInstance: Address;
  }): Promise<bigint> {
    const signersHatId = await this._publicClient.readContract({
      address: hsgInstance,
      abi: HATS_SIGNER_GATE_ABI,
      functionName: "signersHatId",
    });

    return signersHatId;
  }

  /*//////////////////////////////////////////////////////////////
                            MHSG 
  //////////////////////////////////////////////////////////////*/

  /**
   * Claim signer rights on the safe. Account must wear the provided valid Signers Hat ID
   *
   * @param account A Viem account
   * @param mhsgInstance MHSG's instance address
   * @param hatId The hat ID to claim signer rights for, must be a valid Signers Hat
   * @returns An object containing the status of the call and the transaction hash
   */
  async mhsgClaimSigner({
    account,
    mhsgInstance,
    hatId,
  }: {
    account: Account | Address;
    mhsgInstance: Address;
    hatId: bigint;
  }): Promise<MhsgClaimSignerResult> {
    try {
      const { request } = await this._publicClient.simulateContract({
        address: mhsgInstance,
        abi: MULTI_HATS_SIGNER_GATE_ABI,
        functionName: "claimSigner",
        args: [hatId],
        account,
      });

      const hash = await this._walletClient.writeContract(request);

      const receipt = await this._publicClient.waitForTransactionReceipt({
        hash,
      });

      return {
        status: receipt.status,
        transactionHash: receipt.transactionHash,
      };
    } catch (err) {
      getError(err);
    }
  }

  /**
   * Checks if a given account is a valid signer, i.e. is wearing one of the Signers Hats
   *
   * @param mhsgInstance MHSG's instance address
   * @param address The address to check
   * @returns 'true' if the given address is a valid signer, 'false' otherwise
   */
  async mhsgIsValidSigner({
    mhsgInstance,
    address,
  }: {
    mhsgInstance: Address;
    address: Address;
  }): Promise<boolean> {
    const isValid = await this._publicClient.readContract({
      address: mhsgInstance,
      abi: MULTI_HATS_SIGNER_GATE_ABI,
      functionName: "isValidSigner",
      args: [address],
    });

    return isValid;
  }

  /**
   * Add new approved Signers Hats
   * The caller must be a wearer of the MHSG's Owner Hat
   *
   * @param account A Viem account
   * @param mhsgInstance MHSG's instance address
   * @param newSignerHats Array of Hat IDs to add as approved Signers Hats
   * @returns An object containing the status of the call and the transaction hash
   */
  async mhsgAddSignerHats({
    account,
    mhsgInstance,
    newSignerHats,
  }: {
    account: Account | Address;
    mhsgInstance: Address;
    newSignerHats: bigint[];
  }): Promise<MhsgAddSignerHatsResult> {
    try {
      const { request } = await this._publicClient.simulateContract({
        address: mhsgInstance,
        abi: MULTI_HATS_SIGNER_GATE_ABI,
        functionName: "addSignerHats",
        args: [newSignerHats],
        account,
      });

      const hash = await this._walletClient.writeContract(request);

      const receipt = await this._publicClient.waitForTransactionReceipt({
        hash,
      });

      return {
        status: receipt.status,
        transactionHash: receipt.transactionHash,
      };
    } catch (err) {
      getError(err);
    }
  }

  /**
   * Check if a given Hat is a valid Signers Hat
   *
   * @param mhsgInstance MHSG's instance address
   * @param hatId The Hat to check
   * @returns 'true' if the given Hat is a valid Signers Hat, 'false' otherwise
   */
  async mhsgIsValidSignersHat({
    mhsgInstance,
    hatId,
  }: {
    mhsgInstance: Address;
    hatId: bigint;
  }): Promise<boolean> {
    const isValid = await this._publicClient.readContract({
      address: mhsgInstance,
      abi: MULTI_HATS_SIGNER_GATE_ABI,
      functionName: "isValidSignerHat",
      args: [hatId],
    });

    return isValid;
  }

  /*//////////////////////////////////////////////////////////////
                        Shared Functions 
  //////////////////////////////////////////////////////////////*/

  /**
   * Sets a new target threshold, and changes Safe's threshold if appropriate
   * The caller must be a wearer of the HSG/MHSG's Owner Hat
   *
   * @param account A Viem account
   * @param instance HSG/MHSG instance address
   * @param targetThreshold The new target threshold to set
   * @returns An object containing the status of the call and the transaction hash
   */
  async setTargetThreshold({
    account,
    instance,
    targetThreshold,
  }: {
    account: Account | Address;
    instance: Address;
    targetThreshold: bigint;
  }): Promise<SetTargetThresholdResult> {
    try {
      const { request } = await this._publicClient.simulateContract({
        address: instance,
        abi: HATS_SIGNER_GATE_BASE_ABI,
        functionName: "setTargetThreshold",
        args: [targetThreshold],
        account,
      });

      const hash = await this._walletClient.writeContract(request);

      const receipt = await this._publicClient.waitForTransactionReceipt({
        hash,
      });

      return {
        status: receipt.status,
        transactionHash: receipt.transactionHash,
      };
    } catch (err) {
      getError(err);
    }
  }

  /**
   * Sets a new minimum threshold
   * The caller must be a wearer of the HSG/MHSG's Owner Hat
   *
   * @param account A Viem account
   * @param instance HSG/MHSG instance address
   * @param minThreshold The new minimum threshold to set
   * @returns An object containing the status of the call and the transaction hash
   */
  async setMinThreshold({
    account,
    instance,
    minThreshold,
  }: {
    account: Account | Address;
    instance: Address;
    minThreshold: bigint;
  }): Promise<SetMinThresholdResult> {
    try {
      const { request } = await this._publicClient.simulateContract({
        address: instance,
        abi: HATS_SIGNER_GATE_BASE_ABI,
        functionName: "setMinThreshold",
        args: [minThreshold],
        account,
      });

      const hash = await this._walletClient.writeContract(request);

      const receipt = await this._publicClient.waitForTransactionReceipt({
        hash,
      });

      return {
        status: receipt.status,
        transactionHash: receipt.transactionHash,
      };
    } catch (err) {
      getError(err);
    }
  }

  /**
   * Sets a new Owner Hat
   * The caller must be a wearer of the current HSG/MHSG's Owner Hat
   *
   * @param account A Viem account
   * @param instance HSG/MHSG instance address
   * @param newOwnerHat The new Owner Hat to set
   * @param hatsContractAddress The Hats.sol contract address of the new Owner Hat
   * @returns An object containing the status of the call and the transaction hash
   */
  async setOwnerHat({
    account,
    instance,
    newOwnerHat,
    hatsContractAddress,
  }: {
    account: Account | Address;
    instance: Address;
    newOwnerHat: bigint;
    hatsContractAddress: Address;
  }): Promise<SetOwnerHatResult> {
    try {
      const { request } = await this._publicClient.simulateContract({
        address: instance,
        abi: HATS_SIGNER_GATE_BASE_ABI,
        functionName: "setOwnerHat",
        args: [newOwnerHat, hatsContractAddress],
        account,
      });

      const hash = await this._walletClient.writeContract(request);

      const receipt = await this._publicClient.waitForTransactionReceipt({
        hash,
      });

      return {
        status: receipt.status,
        transactionHash: receipt.transactionHash,
      };
    } catch (err) {
      getError(err);
    }
  }

  /**
   * Tallies the number of existing Safe owners that wear a Signers Hat and updates the Safe's threshold if necessary
   * Does NOT remove invalid Safe owners
   *
   * @returns An object containing the status of the call and the transaction hash
   */
  async reconcileSignerCount({
    account,
    instance,
  }: {
    account: Account | Address;
    instance: Address;
  }): Promise<ReconcileSignerCountResult> {
    try {
      const { request } = await this._publicClient.simulateContract({
        address: instance,
        abi: HATS_SIGNER_GATE_BASE_ABI,
        functionName: "reconcileSignerCount",
        account,
      });

      const hash = await this._walletClient.writeContract(request);

      const receipt = await this._publicClient.waitForTransactionReceipt({
        hash,
      });

      return {
        status: receipt.status,
        transactionHash: receipt.transactionHash,
      };
    } catch (err) {
      getError(err);
    }
  }

  /**
   * Tallies the number of existing Safe owners that wear a Signers Hat
   *
   * @param instance HSG/MHSG instance address
   * @returns The number of valid signers on the Safe
   */
  async validSignerCount({ instance }: { instance: Address }): Promise<bigint> {
    const count = await this._publicClient.readContract({
      address: instance,
      abi: HATS_SIGNER_GATE_BASE_ABI,
      functionName: "validSignerCount",
    });

    return count;
  }

  /**
   *  Removes an invalid signer from the Safe, updating its threshold if appropriate
   *
   * @param account A Viem account
   * @param instance HSG/MHSG instance address
   * @param signer The address to remove if not a valid signer
   * @returns An object containing the status of the call and the transaction hash
   */
  async removeSigner({
    account,
    instance,
    signer,
  }: {
    account: Account | Address;
    instance: Address;
    signer: Address;
  }): Promise<RemoveSignerResult> {
    try {
      const { request } = await this._publicClient.simulateContract({
        address: instance,
        abi: HATS_SIGNER_GATE_BASE_ABI,
        functionName: "removeSigner",
        args: [signer],
        account,
      });

      const hash = await this._walletClient.writeContract(request);

      const receipt = await this._publicClient.waitForTransactionReceipt({
        hash,
      });

      return {
        status: receipt.status,
        transactionHash: receipt.transactionHash,
      };
    } catch (err) {
      getError(err);
    }
  }

  /**
   * Get a HSG/MHSG's attached Safe
   *
   * @param instance HSG/MHSG instance address
   * @returns Address of the attached Safe
   */
  async getSafe({ instance }: { instance: Address }): Promise<Address> {
    const safe = await this._publicClient.readContract({
      address: instance,
      abi: HATS_SIGNER_GATE_BASE_ABI,
      functionName: "safe",
    });

    return safe;
  }

  /**
   * Get a HSG/MHSG's min threshold
   *
   * @param instance HSG/MHSG instance address
   * @returns The instance's min threshold
   */
  async getMinThreshold({ instance }: { instance: Address }): Promise<bigint> {
    const minThreshold = await this._publicClient.readContract({
      address: instance,
      abi: HATS_SIGNER_GATE_BASE_ABI,
      functionName: "minThreshold",
    });

    return minThreshold;
  }

  /**
   * Get a HSG/MHSG's target threshold
   *
   * @param instance HSG/MHSG instance address
   * @returns The instance's target threshold
   */
  async getTargetThreshold({
    instance,
  }: {
    instance: Address;
  }): Promise<bigint> {
    const targetThreshold = await this._publicClient.readContract({
      address: instance,
      abi: HATS_SIGNER_GATE_BASE_ABI,
      functionName: "targetThreshold",
    });

    return targetThreshold;
  }

  /**
   * Get a HSG/MHSG's max signers
   *
   * @param instance HSG/MHSG instance address
   * @returns The instance's max signers
   */
  async getMaxSigners({ instance }: { instance: Address }): Promise<bigint> {
    const maxSigners = await this._publicClient.readContract({
      address: instance,
      abi: HATS_SIGNER_GATE_BASE_ABI,
      functionName: "maxSigners",
    });

    return maxSigners;
  }

  /**
   * Get a HSG/MHSG's Owner Hat
   *
   * @param instance HSG/MHSG instance address
   * @returns The instance's Owner Hat
   */
  async getOwnerHat({ instance }: { instance: Address }): Promise<bigint> {
    const ownerHat = await this._publicClient.readContract({
      address: instance,
      abi: HATS_SIGNER_GATE_BASE_ABI,
      functionName: "ownerHat",
    });

    return ownerHat;
  }

  /*//////////////////////////////////////////////////////////////
                  HSG & MHSG Write Functions Caller 
  //////////////////////////////////////////////////////////////*/

  /**
   * Get the metadata object of HSG or MHSG
   *
   * @param type 'HSG' or 'MHSG'
   * @returns The metadata object
   */
  getMetadata(type: HsgType): HsgMetadata {
    if (type === "HSG") {
      return HSG_METADATA;
    } else if (type === "MHSG") {
      return MHSG_METADATA;
    } else {
      throw new Error(`Error: type ${type} is not supproted`);
    }
  }

  /**
   *  Call a HSG/MHSG instance's write function
   *
   * @param account A Viem account
   * @param type 'HSG' or 'MHSG'
   * @param instance The MHSG/HSG instance address
   * @param func The write function to call
   * @param args The arguments with which to call the provided function
   * @returns An object containing the status of the call and the transaction hash
   */
  async callInstanceWriteFunction({
    account,
    type,
    instance,
    func,
    args,
  }: {
    account: Account | Address;
    type: HsgType;
    instance: Address;
    func: WriteFunction;
    args: unknown[];
  }): Promise<CallInstanceWriteFunctionResult> {
    const metadata = this.getMetadata(type);

    checkWriteFunctionArgs({ func, args });

    try {
      const { request } = await this._publicClient.simulateContract({
        address: instance,
        abi: metadata.abi,
        functionName: func.functionName,
        args: args,
        account,
      });

      const hash = await this._walletClient.writeContract(request);

      const receipt = await this._publicClient.waitForTransactionReceipt({
        hash,
      });

      return {
        status: receipt.status,
        transactionHash: receipt.transactionHash,
      };
    } catch (err) {
      getError(err);
    }
  }
}
