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
  WriteFunction,
  CallInstanceWriteFunctionResult,
  HsgMetadata,
  HsgType,
} from "./types";

export class HatsSignerGateClient {
  private readonly _publicClient: PublicClient;
  private readonly _walletClient: WalletClient;
  private readonly _chainId: string;

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

  async mhsgIsValidSignerHat({
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

  async validSignerCount({ instance }: { instance: Address }): Promise<bigint> {
    const count = await this._publicClient.readContract({
      address: instance,
      abi: HATS_SIGNER_GATE_BASE_ABI,
      functionName: "validSignerCount",
    });

    return count;
  }

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

  async getSafe({ instance }: { instance: Address }): Promise<Address> {
    const safe = await this._publicClient.readContract({
      address: instance,
      abi: HATS_SIGNER_GATE_BASE_ABI,
      functionName: "safe",
    });

    return safe;
  }

  async getMinThreshold({ instance }: { instance: Address }): Promise<bigint> {
    const minThreshold = await this._publicClient.readContract({
      address: instance,
      abi: HATS_SIGNER_GATE_BASE_ABI,
      functionName: "minThreshold",
    });

    return minThreshold;
  }

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

  async getMaxSigners({ instance }: { instance: Address }): Promise<bigint> {
    const maxSigners = await this._publicClient.readContract({
      address: instance,
      abi: HATS_SIGNER_GATE_BASE_ABI,
      functionName: "maxSigners",
    });

    return maxSigners;
  }

  /*//////////////////////////////////////////////////////////////
                            MHSG 
  //////////////////////////////////////////////////////////////*/

  getMetadata(type: HsgType): HsgMetadata {
    if (type === "HSG") {
      return HSG_METADATA;
    } else if (type === "MHSG") {
      return MHSG_METADATA;
    } else {
      throw new Error(`Error: type ${type} is not supproted`);
    }
  }

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
