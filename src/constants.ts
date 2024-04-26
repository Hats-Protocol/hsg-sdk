import type { Address } from "viem";

export const HATS_SIGNER_GATE_FACTORY: { [chainID: string]: Address } = {
  5: "0xA1fB14B5F322651e20F06eE2f2681B8f380bbB0E",
  1: "0x0F22eFC6EA47b1EFF42D1A2a6E69440929400F86",
  42161: "0x6FE52b46Af16F960E0eB1E15D2b27422ab158733",
  100: "0x0F22eFC6EA47b1EFF42D1A2a6E69440929400F86",
  137: "0x0F22eFC6EA47b1EFF42D1A2a6E69440929400F86",
  10: "0x39Ae0B5e81A69F7092EC4394b111b6a6411377e8",
  11155111: "0x5CB8a5B063B7E94cF39E8A8813A777f49B8DD050",
  8453: "0x5CB8a5B063B7E94cF39E8A8813A777f49B8DD050",
};

export const MULTI_HATS_SIGNER_GATE_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "minThreshold", type: "uint256" },
      { internalType: "uint256", name: "safeOwnerCount", type: "uint256" },
    ],
    name: "BelowMinThreshold",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "guard", type: "address" }],
    name: "CannotDisableThisGuard",
    type: "error",
  },
  { inputs: [], name: "FailedExecAddSigner", type: "error" },
  { inputs: [], name: "FailedExecChangeThreshold", type: "error" },
  { inputs: [], name: "FailedExecRemoveSigner", type: "error" },
  { inputs: [], name: "InvalidMinThreshold", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "hatId", type: "uint256" }],
    name: "InvalidSignerHat",
    type: "error",
  },
  { inputs: [], name: "InvalidSigners", type: "error" },
  { inputs: [], name: "InvalidTargetThreshold", type: "error" },
  { inputs: [], name: "MaxSignersReached", type: "error" },
  { inputs: [], name: "NoInvalidSignersToReplace", type: "error" },
  { inputs: [], name: "NoReentryAllowed", type: "error" },
  { inputs: [], name: "NotCalledFromSafe", type: "error" },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "NotSignerHatWearer",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "signer", type: "address" }],
    name: "SignerAlreadyClaimed",
    type: "error",
  },
  { inputs: [], name: "SignersCannotChangeModules", type: "error" },
  { inputs: [], name: "SignersCannotChangeOwners", type: "error" },
  { inputs: [], name: "SignersCannotChangeThreshold", type: "error" },
  {
    inputs: [{ internalType: "address", name: "signer", type: "address" }],
    name: "StillWearsSignerHat",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint8", name: "version", type: "uint8" },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "ownerHat",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "hatsAddress",
        type: "address",
      },
    ],
    name: "OwnerHatUpdated",
    type: "event",
  },
  { stateMutability: "nonpayable", type: "fallback" },
  {
    inputs: [
      { internalType: "uint256[]", name: "_newSignerHats", type: "uint256[]" },
    ],
    name: "addSignerHats",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "bool", name: "", type: "bool" },
    ],
    name: "checkAfterExecution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
      { internalType: "enum Enum.Operation", name: "operation", type: "uint8" },
      { internalType: "uint256", name: "safeTxGas", type: "uint256" },
      { internalType: "uint256", name: "baseGas", type: "uint256" },
      { internalType: "uint256", name: "gasPrice", type: "uint256" },
      { internalType: "address", name: "gasToken", type: "address" },
      {
        internalType: "address payable",
        name: "refundReceiver",
        type: "address",
      },
      { internalType: "bytes", name: "signatures", type: "bytes" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "checkTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_hatId", type: "uint256" }],
    name: "claimSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "claimedSignerHats",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "dataHash", type: "bytes32" },
      { internalType: "bytes", name: "signatures", type: "bytes" },
      { internalType: "uint256", name: "sigCount", type: "uint256" },
    ],
    name: "countValidSignatures",
    outputs: [
      { internalType: "uint256", name: "validSigCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHatsContract",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "isValidSigner",
    outputs: [{ internalType: "bool", name: "valid", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_hatId", type: "uint256" }],
    name: "isValidSignerHat",
    outputs: [{ internalType: "bool", name: "valid", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSigners",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minThreshold",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ownerHat",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "reconcileSignerCount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_signer", type: "address" }],
    name: "removeSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "safe",
    outputs: [
      { internalType: "contract IGnosisSafe", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_minThreshold", type: "uint256" },
    ],
    name: "setMinThreshold",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_ownerHat", type: "uint256" },
      { internalType: "address", name: "_hatsContract", type: "address" },
    ],
    name: "setOwnerHat",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_targetThreshold", type: "uint256" },
    ],
    name: "setTargetThreshold",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "initializeParams", type: "bytes" },
    ],
    name: "setUp",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "targetThreshold",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "validSignerCount",
    outputs: [
      { internalType: "uint256", name: "signerCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "validSignerHats",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const HATS_SIGNER_GATE_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "minThreshold", type: "uint256" },
      { internalType: "uint256", name: "safeOwnerCount", type: "uint256" },
    ],
    name: "BelowMinThreshold",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "guard", type: "address" }],
    name: "CannotDisableThisGuard",
    type: "error",
  },
  { inputs: [], name: "FailedExecAddSigner", type: "error" },
  { inputs: [], name: "FailedExecChangeThreshold", type: "error" },
  { inputs: [], name: "FailedExecRemoveSigner", type: "error" },
  { inputs: [], name: "InvalidMinThreshold", type: "error" },
  { inputs: [], name: "InvalidSigners", type: "error" },
  { inputs: [], name: "InvalidTargetThreshold", type: "error" },
  { inputs: [], name: "MaxSignersReached", type: "error" },
  { inputs: [], name: "NoInvalidSignersToReplace", type: "error" },
  { inputs: [], name: "NoReentryAllowed", type: "error" },
  { inputs: [], name: "NotCalledFromSafe", type: "error" },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "NotSignerHatWearer",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "signer", type: "address" }],
    name: "SignerAlreadyClaimed",
    type: "error",
  },
  { inputs: [], name: "SignersCannotChangeModules", type: "error" },
  { inputs: [], name: "SignersCannotChangeOwners", type: "error" },
  { inputs: [], name: "SignersCannotChangeThreshold", type: "error" },
  {
    inputs: [{ internalType: "address", name: "signer", type: "address" }],
    name: "StillWearsSignerHat",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint8", name: "version", type: "uint8" },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "ownerHat",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "hatsAddress",
        type: "address",
      },
    ],
    name: "OwnerHatUpdated",
    type: "event",
  },
  { stateMutability: "nonpayable", type: "fallback" },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "bool", name: "", type: "bool" },
    ],
    name: "checkAfterExecution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
      { internalType: "enum Enum.Operation", name: "operation", type: "uint8" },
      { internalType: "uint256", name: "safeTxGas", type: "uint256" },
      { internalType: "uint256", name: "baseGas", type: "uint256" },
      { internalType: "uint256", name: "gasPrice", type: "uint256" },
      { internalType: "address", name: "gasToken", type: "address" },
      {
        internalType: "address payable",
        name: "refundReceiver",
        type: "address",
      },
      { internalType: "bytes", name: "signatures", type: "bytes" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "checkTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "dataHash", type: "bytes32" },
      { internalType: "bytes", name: "signatures", type: "bytes" },
      { internalType: "uint256", name: "sigCount", type: "uint256" },
    ],
    name: "countValidSignatures",
    outputs: [
      { internalType: "uint256", name: "validSigCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHatsContract",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "isValidSigner",
    outputs: [{ internalType: "bool", name: "valid", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSigners",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minThreshold",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ownerHat",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "reconcileSignerCount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_signer", type: "address" }],
    name: "removeSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "safe",
    outputs: [
      { internalType: "contract IGnosisSafe", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_minThreshold", type: "uint256" },
    ],
    name: "setMinThreshold",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_ownerHat", type: "uint256" },
      { internalType: "address", name: "_hatsContract", type: "address" },
    ],
    name: "setOwnerHat",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_targetThreshold", type: "uint256" },
    ],
    name: "setTargetThreshold",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "initializeParams", type: "bytes" },
    ],
    name: "setUp",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "signersHatId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "targetThreshold",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "validSignerCount",
    outputs: [
      { internalType: "uint256", name: "signerCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const HATS_SIGNER_GATE_FACTORY_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_hatsSignerGateSingleton",
        type: "address",
      },
      {
        internalType: "address",
        name: "_multiHatsSignerGateSingleton",
        type: "address",
      },
      { internalType: "address", name: "_hatsAddress", type: "address" },
      { internalType: "address", name: "_safeSingleton", type: "address" },
      {
        internalType: "address",
        name: "_gnosisFallbackLibrary",
        type: "address",
      },
      {
        internalType: "address",
        name: "_gnosisMultisendLibrary",
        type: "address",
      },
      {
        internalType: "address",
        name: "_gnosisSafeProxyFactory",
        type: "address",
      },
      { internalType: "address", name: "_moduleProxyFactory", type: "address" },
      { internalType: "string", name: "_version", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "NoOtherModulesAllowed", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_hatsSignerGate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_ownerHatId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_signersHatId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_safe",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_minThreshold",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_targetThreshold",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_maxSigners",
        type: "uint256",
      },
    ],
    name: "HatsSignerGateSetup",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_hatsSignerGate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_ownerHatId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_signersHatIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_safe",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_minThreshold",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_targetThreshold",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_maxSigners",
        type: "uint256",
      },
    ],
    name: "MultiHatsSignerGateSetup",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "contract HatsSignerGate",
        name: "_hsg",
        type: "address",
      },
    ],
    name: "canAttachHSGToSafe",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract MultiHatsSignerGate",
        name: "_mhsg",
        type: "address",
      },
    ],
    name: "canAttachMHSGToSafe",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_ownerHatId", type: "uint256" },
      { internalType: "uint256", name: "_signersHatId", type: "uint256" },
      { internalType: "address", name: "_safe", type: "address" },
      { internalType: "uint256", name: "_minThreshold", type: "uint256" },
      { internalType: "uint256", name: "_targetThreshold", type: "uint256" },
      { internalType: "uint256", name: "_maxSigners", type: "uint256" },
    ],
    name: "deployHatsSignerGate",
    outputs: [{ internalType: "address", name: "hsg", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_ownerHatId", type: "uint256" },
      { internalType: "uint256", name: "_signersHatId", type: "uint256" },
      { internalType: "uint256", name: "_minThreshold", type: "uint256" },
      { internalType: "uint256", name: "_targetThreshold", type: "uint256" },
      { internalType: "uint256", name: "_maxSigners", type: "uint256" },
    ],
    name: "deployHatsSignerGateAndSafe",
    outputs: [
      { internalType: "address", name: "hsg", type: "address" },
      { internalType: "address payable", name: "safe", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_ownerHatId", type: "uint256" },
      { internalType: "uint256[]", name: "_signersHatIds", type: "uint256[]" },
      { internalType: "address", name: "_safe", type: "address" },
      { internalType: "uint256", name: "_minThreshold", type: "uint256" },
      { internalType: "uint256", name: "_targetThreshold", type: "uint256" },
      { internalType: "uint256", name: "_maxSigners", type: "uint256" },
    ],
    name: "deployMultiHatsSignerGate",
    outputs: [{ internalType: "address", name: "mhsg", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_ownerHatId", type: "uint256" },
      { internalType: "uint256[]", name: "_signersHatIds", type: "uint256[]" },
      { internalType: "uint256", name: "_minThreshold", type: "uint256" },
      { internalType: "uint256", name: "_targetThreshold", type: "uint256" },
      { internalType: "uint256", name: "_maxSigners", type: "uint256" },
    ],
    name: "deployMultiHatsSignerGateAndSafe",
    outputs: [
      { internalType: "address", name: "mhsg", type: "address" },
      { internalType: "address payable", name: "safe", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "gnosisFallbackLibrary",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gnosisMultisendLibrary",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gnosisSafeProxyFactory",
    outputs: [
      {
        internalType: "contract GnosisSafeProxyFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hatsAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hatsSignerGateSingleton",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "moduleProxyFactory",
    outputs: [
      {
        internalType: "contract ModuleProxyFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "multiHatsSignerGateSingleton",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "safeSingleton",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const EXTENDED_HATS_SIGNER_GATE_FACTORY_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_hatsSignerGateSingleton",
        type: "address",
      },
      {
        internalType: "address",
        name: "_multiHatsSignerGateSingleton",
        type: "address",
      },
      { internalType: "address", name: "_hatsAddress", type: "address" },
      { internalType: "address", name: "_safeSingleton", type: "address" },
      {
        internalType: "address",
        name: "_gnosisFallbackLibrary",
        type: "address",
      },
      {
        internalType: "address",
        name: "_gnosisMultisendLibrary",
        type: "address",
      },
      {
        internalType: "address",
        name: "_gnosisSafeProxyFactory",
        type: "address",
      },
      { internalType: "address", name: "_moduleProxyFactory", type: "address" },
      { internalType: "string", name: "_version", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "NoOtherModulesAllowed", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "hatId", type: "uint256" }],
    name: "InvalidSignerHat",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "minThreshold", type: "uint256" },
      { internalType: "uint256", name: "safeOwnerCount", type: "uint256" },
    ],
    name: "BelowMinThreshold",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "guard", type: "address" }],
    name: "CannotDisableThisGuard",
    type: "error",
  },
  { inputs: [], name: "FailedExecAddSigner", type: "error" },
  { inputs: [], name: "FailedExecChangeThreshold", type: "error" },
  { inputs: [], name: "FailedExecRemoveSigner", type: "error" },
  { inputs: [], name: "InvalidMinThreshold", type: "error" },
  { inputs: [], name: "InvalidSigners", type: "error" },
  { inputs: [], name: "InvalidTargetThreshold", type: "error" },
  { inputs: [], name: "MaxSignersReached", type: "error" },
  { inputs: [], name: "NoInvalidSignersToReplace", type: "error" },
  { inputs: [], name: "NoReentryAllowed", type: "error" },
  { inputs: [], name: "NotCalledFromSafe", type: "error" },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "NotSignerHatWearer",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "signer", type: "address" }],
    name: "SignerAlreadyClaimed",
    type: "error",
  },
  { inputs: [], name: "SignersCannotChangeModules", type: "error" },
  { inputs: [], name: "SignersCannotChangeOwners", type: "error" },
  { inputs: [], name: "SignersCannotChangeThreshold", type: "error" },
  {
    inputs: [{ internalType: "address", name: "signer", type: "address" }],
    name: "StillWearsSignerHat",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_hatsSignerGate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_ownerHatId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_signersHatId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_safe",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_minThreshold",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_targetThreshold",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_maxSigners",
        type: "uint256",
      },
    ],
    name: "HatsSignerGateSetup",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_hatsSignerGate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_ownerHatId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_signersHatIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_safe",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_minThreshold",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_targetThreshold",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_maxSigners",
        type: "uint256",
      },
    ],
    name: "MultiHatsSignerGateSetup",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "contract HatsSignerGate",
        name: "_hsg",
        type: "address",
      },
    ],
    name: "canAttachHSGToSafe",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract MultiHatsSignerGate",
        name: "_mhsg",
        type: "address",
      },
    ],
    name: "canAttachMHSGToSafe",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_ownerHatId", type: "uint256" },
      { internalType: "uint256", name: "_signersHatId", type: "uint256" },
      { internalType: "address", name: "_safe", type: "address" },
      { internalType: "uint256", name: "_minThreshold", type: "uint256" },
      { internalType: "uint256", name: "_targetThreshold", type: "uint256" },
      { internalType: "uint256", name: "_maxSigners", type: "uint256" },
    ],
    name: "deployHatsSignerGate",
    outputs: [{ internalType: "address", name: "hsg", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_ownerHatId", type: "uint256" },
      { internalType: "uint256", name: "_signersHatId", type: "uint256" },
      { internalType: "uint256", name: "_minThreshold", type: "uint256" },
      { internalType: "uint256", name: "_targetThreshold", type: "uint256" },
      { internalType: "uint256", name: "_maxSigners", type: "uint256" },
    ],
    name: "deployHatsSignerGateAndSafe",
    outputs: [
      { internalType: "address", name: "hsg", type: "address" },
      { internalType: "address payable", name: "safe", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_ownerHatId", type: "uint256" },
      { internalType: "uint256[]", name: "_signersHatIds", type: "uint256[]" },
      { internalType: "address", name: "_safe", type: "address" },
      { internalType: "uint256", name: "_minThreshold", type: "uint256" },
      { internalType: "uint256", name: "_targetThreshold", type: "uint256" },
      { internalType: "uint256", name: "_maxSigners", type: "uint256" },
    ],
    name: "deployMultiHatsSignerGate",
    outputs: [{ internalType: "address", name: "mhsg", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_ownerHatId", type: "uint256" },
      { internalType: "uint256[]", name: "_signersHatIds", type: "uint256[]" },
      { internalType: "uint256", name: "_minThreshold", type: "uint256" },
      { internalType: "uint256", name: "_targetThreshold", type: "uint256" },
      { internalType: "uint256", name: "_maxSigners", type: "uint256" },
    ],
    name: "deployMultiHatsSignerGateAndSafe",
    outputs: [
      { internalType: "address", name: "mhsg", type: "address" },
      { internalType: "address payable", name: "safe", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "gnosisFallbackLibrary",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gnosisMultisendLibrary",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gnosisSafeProxyFactory",
    outputs: [
      {
        internalType: "contract GnosisSafeProxyFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hatsAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hatsSignerGateSingleton",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "moduleProxyFactory",
    outputs: [
      {
        internalType: "contract ModuleProxyFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "multiHatsSignerGateSingleton",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "safeSingleton",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const HATS_SIGNER_GATE_BASE_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "minThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "safeOwnerCount",
        type: "uint256",
      },
    ],
    name: "BelowMinThreshold",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "guard",
        type: "address",
      },
    ],
    name: "CannotDisableThisGuard",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedExecChangeThreshold",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedExecRemoveSigner",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMinThreshold",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSigners",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTargetThreshold",
    type: "error",
  },
  {
    inputs: [],
    name: "MaxSignersReached",
    type: "error",
  },
  {
    inputs: [],
    name: "NoReentryAllowed",
    type: "error",
  },
  {
    inputs: [],
    name: "NotCalledFromSafe",
    type: "error",
  },
  {
    inputs: [],
    name: "SignersCannotChangeModules",
    type: "error",
  },
  {
    inputs: [],
    name: "SignersCannotChangeOwners",
    type: "error",
  },
  {
    inputs: [],
    name: "SignersCannotChangeThreshold",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "StillWearsSignerHat",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "ownerHat",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "hatsAddress",
        type: "address",
      },
    ],
    name: "OwnerHatUpdated",
    type: "event",
  },
  {
    stateMutability: "nonpayable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    name: "checkAfterExecution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "enum Enum.Operation",
        name: "operation",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "safeTxGas",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "baseGas",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gasPrice",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "gasToken",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "refundReceiver",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "signatures",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "checkTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "dataHash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "signatures",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "sigCount",
        type: "uint256",
      },
    ],
    name: "countValidSignatures",
    outputs: [
      {
        internalType: "uint256",
        name: "validSigCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHatsContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "isValidSigner",
    outputs: [
      {
        internalType: "bool",
        name: "valid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSigners",
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
  {
    inputs: [],
    name: "minThreshold",
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
  {
    inputs: [],
    name: "ownerHat",
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
  {
    inputs: [],
    name: "reconcileSignerCount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_signer",
        type: "address",
      },
    ],
    name: "removeSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "safe",
    outputs: [
      {
        internalType: "contract IGnosisSafe",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minThreshold",
        type: "uint256",
      },
    ],
    name: "setMinThreshold",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ownerHat",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_hatsContract",
        type: "address",
      },
    ],
    name: "setOwnerHat",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_targetThreshold",
        type: "uint256",
      },
    ],
    name: "setTargetThreshold",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "initializeParams",
        type: "bytes",
      },
    ],
    name: "setUp",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "targetThreshold",
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
  {
    inputs: [],
    name: "validSignerCount",
    outputs: [
      {
        internalType: "uint256",
        name: "signerCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
