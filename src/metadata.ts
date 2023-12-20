import { HsgMetadata } from "./types";
import { MULTI_HATS_SIGNER_GATE_ABI, HATS_SIGNER_GATE_ABI } from "./constants";

export const HSG_METADATA: HsgMetadata = {
  customRoles: [
    {
      id: "hsgSigner",
      name: "HSG Signer",
      criteria: "signersHatId",
    },
    {
      id: "hsgOwner",
      name: "HSG Owner",
      criteria: "ownerHat",
    },
  ],
  writeFunctions: [
    {
      roles: ["hsgSigner"],
      functionName: "claimSigner",
      label: "Claim Signer Rights",
      description:
        "Become an owner on the safe if you are wearing the signers hat",
      primary: true,
      args: [],
    },
    {
      roles: ["public"],
      functionName: "reconcileSignerCount",
      label: "Reconcile SIgner Count",
      description:
        "Tallies the number of existing Safe owners that wear a Signers Hat and updates the Safe threshold if necessary",
      args: [],
    },
    {
      roles: ["public"],
      functionName: "removeSigner",
      label: "Remove Signer",
      description:
        "Removes an invalid signer from the Safe, updating the threshold if appropriate",
      args: [
        {
          name: "Signer",
          description: "The address to remove if not a valid signer",
          type: "address",
          displayType: "default",
        },
      ],
    },
    {
      roles: ["hsgOwner"],
      functionName: "setMinThreshold",
      label: "Set Min Threshold",
      description: "Sets a new minimum threshold",
      args: [
        {
          name: "Min Threshold",
          description: "The new minimum threshold",
          type: "uint256",
          displayType: "default",
        },
      ],
    },
    {
      roles: ["hsgOwner"],
      functionName: "setOwnerHat",
      label: "Set Owner Hat",
      description: "Sets a new Owner Hat",
      args: [
        {
          name: "Owner Hat",
          description: "The new Owner Hat ID",
          type: "uint256",
          displayType: "hat",
        },
        {
          name: "Hats Contract",
          description: "Addres of the Hats contract with the new Owner Hat",
          type: "addresss",
          displayType: "default",
        },
      ],
    },
    {
      roles: ["hsgOwner"],
      functionName: "setTargetThreshold",
      label: "Set Target Threshold",
      description:
        "Sets a new target threshold and changes Safe's threshold if appropriate",
      args: [
        {
          name: "Target Threshold",
          description: "The new target threshold",
          type: "uint256",
          displayType: "default",
        },
      ],
    },
  ],
  abi: HATS_SIGNER_GATE_ABI,
};

export const MHSG_METADATA: HsgMetadata = {
  customRoles: [
    {
      id: "hsgSigner",
      name: "MHSG Signer",
      criteria: "validSignerHats",
    },
    {
      id: "hsgOwner",
      name: "MHSG Owner",
      criteria: "ownerHat",
    },
  ],
  writeFunctions: [
    {
      roles: ["hsgSigner"],
      functionName: "claimSigner",
      label: "Claim Signer Rights",
      description:
        "Become an owner on the safe if you are wearing one of its signer hats",
      primary: true,
      args: [
        {
          name: "Signer Hat",
          description: "The Signer Hat ID to claim signer rights for",
          type: "uint256",
          displayType: "hat",
        },
      ],
    },
    {
      roles: ["public"],
      functionName: "reconcileSignerCount",
      label: "Reconcile SIgner Count",
      description:
        "Tallies the number of existing Safe owners that wear a Signers Hat and updates the Safe threshold if necessary",
      args: [],
    },
    {
      roles: ["public"],
      functionName: "removeSigner",
      label: "Remove Signer",
      description:
        "Removes an invalid signer from the Safe, updating the threshold if appropriate",
      args: [
        {
          name: "Signer",
          description: "The address to remove if not a valid signer",
          type: "address",
          displayType: "default",
        },
      ],
    },
    {
      roles: ["hsgOwner"],
      functionName: "setMinThreshold",
      label: "Set Min Threshold",
      description: "Sets a new minimum threshold",
      args: [
        {
          name: "Min Threshold",
          description: "The new minimum threshold",
          type: "uint256",
          displayType: "default",
        },
      ],
    },
    {
      roles: ["hsgOwner"],
      functionName: "setOwnerHat",
      label: "Set Owner Hat",
      description: "Sets a new Owner Hat",
      args: [
        {
          name: "Owner Hat",
          description: "The new Owner Hat ID",
          type: "uint256",
          displayType: "hat",
        },
        {
          name: "Hats Contract",
          description: "Addres of the Hats contract with the new Owner Hat",
          type: "addresss",
          displayType: "default",
        },
      ],
    },
    {
      roles: ["hsgOwner"],
      functionName: "setTargetThreshold",
      label: "Set Target Threshold",
      description:
        "Sets a new target threshold and changes Safe's threshold if appropriate",
      args: [
        {
          name: "Target Threshold",
          description: "The new target threshold",
          type: "uint256",
          displayType: "default",
        },
      ],
    },
    {
      roles: ["hsgOwner"],
      functionName: "addSignerHats",
      label: "Add Signer Hats",
      description: "Add new approved signer hats",
      args: [
        {
          name: "Signer Hats",
          description: "The Hat IDs to add as approved signer hats",
          type: "uint256[]",
          displayType: "default",
        },
      ],
    },
  ],
  abi: MULTI_HATS_SIGNER_GATE_ABI,
};
