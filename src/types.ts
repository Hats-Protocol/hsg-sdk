import { Address } from "viem";

export interface TransactionResult {
  status: "success" | "reverted";
  transactionHash: Address;
}

export interface DeployHatsSignerGateAndSafeResult extends TransactionResult {
  newHsgInstance: Address;
  newSafeInstance: Address;
}

export interface DeployHatsSignerGateResult extends TransactionResult {
  newHsgInstance: Address;
}

export interface DeployMultiHatsSignerGateAndSafeResult
  extends TransactionResult {
  newMultiHsgInstance: Address;
  newSafeInstance: Address;
}

export interface DdeployMultiHatsSignerGateResult extends TransactionResult {
  newMultiHsgInstance: Address;
}
