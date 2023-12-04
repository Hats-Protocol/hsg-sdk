import { PublicClient, WalletClient, decodeEventLog } from "viem";
import {
  HATS_SIGNER_GATE_FACTORY,
  HATS_SIGNER_GATE_FACTORY_ABI,
  HATS_SIGNER_GATE_IMPLEMENTATION,
  HATS_SIGNER_GATE_ABI,
  MULTI_HATS_SIGNER_GATE_IMPLEMENTATION,
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
import type { Account, Address } from "viem";
import {
  DeployHatsSignerGateAndSafeResult,
  DeployHatsSignerGateResult,
  DeployMultiHatsSignerGateAndSafeResult,
  DdeployMultiHatsSignerGateResult,
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
}
