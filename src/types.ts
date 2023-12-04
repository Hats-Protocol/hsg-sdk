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

export interface HsgClaimSignerResult extends TransactionResult {}

export interface MhsgClaimSignerResult extends TransactionResult {}

export interface MhsgAddSignerHatsResult extends TransactionResult {}

export interface SetTargetThresholdResult extends TransactionResult {}

export interface SetMinThresholdResult extends TransactionResult {}

export interface ReconcileSignerCountResult extends TransactionResult {}

export interface RemoveSignerResult extends TransactionResult {}
