import { BaseError, ContractFunctionRevertedError } from "viem";

export class ChainIdMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChainIdMismatchError";
  }
}

export class MissingPublicClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingPublicClientError";
  }
}

export class MissingWalletClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingWalletClientError";
  }
}

export class NoChainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoChainError";
  }
}

export class ChainNotSupportedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChainNotSupportedError";
  }
}

export class CannotDisableThisGuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CannotDisableThisGuardError";
  }
}

export class NotOwnerHatWearerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotOwnerHatWearerError";
  }
}

export class NotSignerHatWearerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotSignerHatWearerError";
  }
}

export class InvalidSignersError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidSignersError";
  }
}

export class GuardAlreadySetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GuardAlreadySetError";
  }
}

export class StillWearsSignerHatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StillWearsSignerHatError";
  }
}

export class MaxSignersReachedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MaxSignersReachedError";
  }
}

export class NoInvalidSignersToReplaceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoInvalidSignersToReplaceError";
  }
}

export class InvalidTargetThresholdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTargetThresholdError";
  }
}

export class InvalidMinThresholdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMinThresholdError";
  }
}

export class SignerAlreadyClaimedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SignerAlreadyClaimedError";
  }
}

export class FailedExecChangeThresholdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FailedExecChangeThresholdError";
  }
}

export class FailedExecAddSignerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FailedExecAddSignerError";
  }
}

export class FailedExecRemoveSignerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FailedExecRemoveSignerError";
  }
}

export class FailedExecEnableModuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FailedExecEnableModuleError";
  }
}

export class BelowMinThresholdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BelowMinThresholdError";
  }
}

export class InvalidSignerHatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidSignerHatError";
  }
}

export class SignersCannotChangeThresholdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SignersCannotChangeThresholdError";
  }
}

export class SignersCannotChangeModulesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SignersCannotChangeModulesError";
  }
}

export class SignersCannotChangeOwnersError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SignersCannotChangeOwnersError";
  }
}

export class NotCalledFromSafeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotCalledFromSafeError";
  }
}

export class NoReentryAllowedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoReentryAllowedError";
  }
}

export class ParametersLengthsMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParametersLengthsMismatchError";
  }
}

export class InvalidParamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidParamError";
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function getError(err: unknown): never {
  if (err instanceof BaseError) {
    const revertError = err.walk(
      (err) => err instanceof ContractFunctionRevertedError
    );
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName ?? "";
      const errorArgs = revertError.data?.args as any[];
      switch (errorName) {
        case "CannotDisableThisGuard": {
          throw new CannotDisableThisGuardError(
            `Error: Signers are not allowed to disable the HatsSignerGate guard`
          );
        }
        case "NotOwnerHatWearer": {
          throw new NotOwnerHatWearerError(
            `Error: Address ${errorArgs[0]} is not a wearer of the owner Hat, only its wearers can make changes to this contract`
          );
        }
        case "NotSignerHatWearer": {
          throw new NotSignerHatWearerError(
            `Error: Address ${errorArgs[0]} is not a wearer of the signer Hat, only its wearers can become signers`
          );
        }
        case "InvalidSigners": {
          throw new InvalidSignersError(
            `Error: Valid signers must wear the signer hat at time of execution`
          );
        }
        case "GuardAlreadySet": {
          throw new GuardAlreadySetError(
            `Error: This contract can only be set once as a zodiac guard on safe`
          );
        }
        case "StillWearsSignerHat": {
          throw new StillWearsSignerHatError(
            `Error: Address ${errorArgs[0]} still wears the signer Hat, can't remove a signer if they're still wearing the signer hat`
          );
        }
        case "MaxSignersReached": {
          throw new MaxSignersReachedError(
            `Error: Can never have more signers than designated by the max amount of signers parameter`
          );
        }
        case "NoInvalidSignersToReplace": {
          throw new NoInvalidSignersToReplaceError(
            `Error: Valid signer attempts to claim signer rights but there are already max amount of signers`
          );
        }
        case "InvalidTargetThreshold": {
          throw new InvalidTargetThresholdError(
            `Error: Target threshold must be lower than the max amount of signers`
          );
        }
        case "InvalidMinThreshold": {
          throw new InvalidMinThresholdError(
            `Error: Min threshold cannot be higher than the max amount of signers or the target threshold`
          );
        }
        case "SignerAlreadyClaimed": {
          throw new SignerAlreadyClaimedError(
            `Error: Signer ${errorArgs[0]} is already on the safe, cannot claim twice`
          );
        }
        case "FailedExecChangeThreshold": {
          throw new FailedExecChangeThresholdError(
            `Error: Call to change the threshold failed`
          );
        }
        case "FailedExecAddSigner": {
          throw new FailedExecAddSignerError(
            `Error: Call to add a signer failed`
          );
        }
        case "FailedExecRemoveSigner": {
          throw new FailedExecRemoveSignerError(
            `Error: Call to remove a signer failed`
          );
        }
        case "FailedExecEnableModule": {
          throw new FailedExecEnableModuleError(
            `Error: Call to enable a module failed`
          );
        }
        case "BelowMinThreshold": {
          throw new BelowMinThresholdError(
            `Error: Cannot execute a tx if the safe's owners count (${errorArgs[1]}) is smaller than the min threshold (${errorArgs[0]})`
          );
        }
        case "InvalidSignerHat": {
          throw new InvalidSignerHatError(
            `Error: Hat ${errorArgs[0]} is not a valid signer hat`
          );
        }
        case "SignersCannotChangeThreshold": {
          throw new SignersCannotChangeThresholdError(
            `Error: Signers are not allowed to change the threshold`
          );
        }
        case "SignersCannotChangeModules": {
          throw new SignersCannotChangeModulesError(
            `Error: Signers are not allowed to add new modules`
          );
        }
        case "SignersCannotChangeOwners": {
          throw new SignersCannotChangeOwnersError(
            `Error: Signers are not allowed to change owners`
          );
        }
        case "NotCalledFromSafe": {
          throw new NotCalledFromSafeError(`Error: Reentrancy guard`);
        }
        case "NoReentryAllowed": {
          throw new NoReentryAllowedError(`Error: Reentrancy guard`);
        }
        default: {
          throw err;
        }
      }
    }
  } else {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Unexpected error occured");
    }
  }
}
