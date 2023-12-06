import type { Address, Abi } from "viem";

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

export interface CallInstanceWriteFunctionResult extends TransactionResult {}

export interface SetOwnerHatResult extends TransactionResult {}

export type HsgMetadata = {
  roles: Role[];
  writeFunctions: WriteFunction[];
  abi: Abi;
};

export type Role = {
  id: string;
  name: string;
  criteria: string;
  hatAdminsFallback?: boolean;
};

export type WriteFunction = {
  roles: string[];
  functionName: string;
  label: string;
  description: string;
  primary?: boolean;
  args: WriteFunctionArg[];
};

export type WriteFunctionArg = {
  name: string;
  description: string;
  type: string;
  displayType: string;
  optional?: boolean;
};

export type ArgumentTsType =
  | "number"
  | "bigint"
  | "string"
  | "boolean"
  | "number[]"
  | "bigint[]"
  | "string[]"
  | "boolean[]"
  | "unknown";

export type HsgType = "HSG" | "MHSG";
