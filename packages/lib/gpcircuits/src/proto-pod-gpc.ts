import { BABY_JUB_PRIME } from "@pcd/util";
import { Groth16Proof, groth16 } from "snarkjs";
import { loadVerificationKey } from "./artifacts";
import circuitParamJson from "./circuitParameters.json";
import { CircuitDesc, CircuitSignal } from "./types";
import { zeroResidueMod } from "./util";

/**
 * Name identifier for the Proto-POD-GPC family of circuits.
 */
export const PROTO_POD_GPC_FAMILY_NAME = "proto-pod-gpc";

/**
 * Full set of input signals to a ProtoPODGPC proof.  See comments for
 * annotations on array size and public signals.
 */
export type ProtoPODGPCInputs = {
  // Object modules [MAX_OBJECTS].
  objectContentID: CircuitSignal /*MAX_OBJECTS*/[];
  objectSignerPubkeyAx: CircuitSignal /*MAX_OBJECTS*/[];
  objectSignerPubkeyAy: CircuitSignal /*MAX_OBJECTS*/[];
  objectSignatureR8x: CircuitSignal /*MAX_OBJECTS*/[];
  objectSignatureR8y: CircuitSignal /*MAX_OBJECTS*/[];
  objectSignatureS: CircuitSignal /*MAX_OBJECTS*/[];

  // Entry modules [MAX_ENTRIES].
  /*PUB*/ entryObjectIndex: CircuitSignal /*MAX_ENTRIES*/[];
  /*PUB*/ entryNameHash: CircuitSignal /*MAX_ENTRIES*/[];
  /*PUB*/ entryIsValueHashRevealed: CircuitSignal /*MAX_ENTRIES packed bits*/;
  entryProofDepth: CircuitSignal /*MAX_ENTRIES*/[];
  entryProofIndex: CircuitSignal /*MAX_ENTRIES*/[] /*MERKLE_MAX_DEPTH packed bits*/;
  entryProofSiblings: CircuitSignal /*MAX_ENTRIES*/[] /*MERKLE_MAX_DEPTH*/[];

  // Virtual entry module [MAX_VIRTUAL_ENTRIES].
  /*PUB*/ virtualEntryIsValueHashRevealed: CircuitSignal;

  // Entry constraint modules.
  /*PUB*/ entryEqualToOtherEntryByIndex: CircuitSignal /*MAX_ENTRIES + MAX_VIRTUAL_ENTRIES*/[];

  // Owner module (1)
  /*PUB*/ ownerEntryIndex: CircuitSignal;
  ownerSemaphoreV3IdentityNullifier: CircuitSignal;
  ownerSemaphoreV3IdentityTrapdoor: CircuitSignal;
  /*PUB*/ ownerExternalNullifier: CircuitSignal;
  /*PUB*/ ownerIsNullfierHashRevealed: CircuitSignal;

  // Numeric value modules [MAX_NUMERIC_VALUES].
  numericValues: CircuitSignal /*MAX_NUMERIC_VALUES*/[];
  /*PUB*/ numericValueEntryIndices: CircuitSignal /*MAX_NUMERIC_VALUES*/[];
  /*PUB*/ numericMinValues: CircuitSignal /*MAX_NUMERIC_VALUES*/[];
  /*PUB*/ numericMaxValues: CircuitSignal /*MAX_NUMERIC_VALUES*/[];

  // MultiTuple module (1)
  /*PUB*/ tupleIndices: CircuitSignal /*MAX_TUPLES*/[] /*TUPLE_ARITY*/[];

  // List membership module (1+)
  /*PUB*/ listComparisonValueIndex: CircuitSignal /*MAX_LISTS*/[];
  /*PUB*/ listContainsComparisonValue: CircuitSignal;
  /*PUB*/ listValidValues: CircuitSignal /*MAX_LISTS*/[] /*MAX_LIST_ENTRIES*/[];

  // Global module (1)
  /*PUB*/ globalWatermark: CircuitSignal;
};

/**
 * All input names, represented as a type, for use in circomkit utests.
 */
export type ProtoPODGPCInputNamesType = [
  "objectContentID",
  "objectSignerPubkeyAx",
  "objectSignerPubkeyAy",
  "objectSignatureR8x",
  "objectSignatureR8y",
  "objectSignatureS",
  "entryObjectIndex",
  "entryNameHash",
  "entryIsValueHashRevealed",
  "entryProofDepth",
  "entryProofIndex",
  "entryProofSiblings",
  "virtualEntryIsValueHashRevealed",
  "entryEqualToOtherEntryByIndex",
  "ownerEntryIndex",
  "ownerSemaphoreV3IdentityNullifier",
  "ownerSemaphoreV3IdentityTrapdoor",
  "ownerExternalNullifier",
  "ownerIsNullfierHashRevealed",
  "numericValues",
  "numericValueEntryIndices",
  "numericMinValues",
  "numericMaxValues",
  "tupleIndices",
  "listComparisonValueIndex",
  "listContainsComparisonValue",
  "listValidValues",
  "globalWatermark"
];

/**
 * Only the public inputs signals to a ProtoPODGPC proof.  See comments for
 * annotations on array size and public signals.
 */
export type ProtoPODGPCPublicInputs = {
  // Entry modules [MAX_ENTRIES].
  /*PUB*/ entryObjectIndex: CircuitSignal /*MAX_ENTRIES*/[];
  /*PUB*/ entryNameHash: CircuitSignal /*MAX_ENTRIES*/[];
  /*PUB*/ entryIsValueHashRevealed: CircuitSignal /*MAX_ENTRIES packed bits*/;

  // Virtual entry module [MAX_VIRTUAL_ENTRIES].
  /*PUB*/ virtualEntryIsValueHashRevealed: CircuitSignal;

  // Entry constraint modules.
  /*PUB*/ entryEqualToOtherEntryByIndex: CircuitSignal /*MAX_ENTRIES + MAX_VIRTUAL_ENTRIES*/[];

  // Owner module (1)
  /*PUB*/ ownerEntryIndex: CircuitSignal;
  /*PUB*/ ownerExternalNullifier: CircuitSignal;
  /*PUB*/ ownerIsNullfierHashRevealed: CircuitSignal;

  // Bounds check module (1)
  /*PUB*/ numericValueEntryIndices: CircuitSignal /*MAX_NUMERIC_VALUES*/[];
  /*PUB*/ numericMinValues: CircuitSignal /*MAX_NUMERIC_VALUES*/[];
  /*PUB*/ numericMaxValues: CircuitSignal /*MAX_NUMERIC_VALUES*/[];

  // Tuple module (1)
  /*PUB*/ tupleIndices: CircuitSignal /*MAX_TUPLES*/[] /*TUPLE_ARITY*/[];

  // List membership module (1)
  /*PUB*/ listComparisonValueIndex: CircuitSignal /*MAX_LISTS*/[];
  /*PUB*/ listContainsComparisonValue: CircuitSignal;
  /*PUB*/ listValidValues: CircuitSignal /*MAX_LISTS*/[] /*MAX_LIST_ENTRIES*/[];

  // Global module (1)
  /*PUB*/ globalWatermark: CircuitSignal;
};

/**
 * Only the public input names, as run-time data.
 */
export const PROTO_POD_GPC_PUBLIC_INPUT_NAMES = [
  "entryObjectIndex",
  "entryNameHash",
  "entryIsValueHashRevealed",
  "virtualEntryIsValueHashRevealed",
  "entryEqualToOtherEntryByIndex",
  "ownerEntryIndex",
  "ownerExternalNullifier",
  "ownerIsNullfierHashRevealed",
  "numericValueEntryIndices",
  "numericMinValues",
  "numericMaxValues",
  "tupleIndices",
  "listComparisonValueIndex",
  "listContainsComparisonValue",
  "listValidValues",
  "globalWatermark"
];

/**
 * All output signals from a ProtoPODGPC proof.  See comments for
 * annotations on array size and public signals.
 */
export type ProtoPODGPCOutputs = {
  entryRevealedValueHash: CircuitSignal /*MAX_ENTRIES*/[];
  virtualEntryRevealedValueHash: CircuitSignal /*MAX_OBJECTS*/[];
  ownerRevealedNullifierHash: CircuitSignal;
};

/**
 * Names of output signals from a ProtoPODGPC proof, represented as a type, for
 * use in circomkit utests.
 */
export type ProtoPODGPCOutputNamesType = [
  "entryRevealedValueHash",
  "virtualEntryRevealedValueHash",
  "ownerRevealedNullifierHash"
];

/**
 * Configurable size parameters for a ProtoPODGPC circuit.
 */
export type ProtoPODGPCCircuitParams = {
  /**
   * Number of POD objects which can be included in a proof.
   */
  maxObjects: number;

  /**
   * Number of POD entries which can be included in a proof.
   */
  maxEntries: number;

  /**
   * Max depth of POD merkle tree.  Max entries in any object is 2^(depth-1).
   */
  merkleMaxDepth: number;

  /**
   * Number of numeric values.
   */
  maxNumericValues: number;

  /**
   * Number of membership lists.
   */
  maxLists: number;

  /**
   * Number of entries in each membership list to be included in proof.
   */
  maxListElements: number;

  /**
   * Number of tuples which can be included in a proof.
   */
  maxTuples: number;

  /**
   * Arity (i.e. size or width) of tuples which can be included in a proof,
   * e.g. tupleArity = 2 for pairs or tupleArity = 3 for triples.
   */
  tupleArity: number;
};

/**
 * ProtoPODGPCCircuitParams constructor.
 */
export function ProtoPODGPCCircuitParams(
  maxObjects: number,
  maxEntries: number,
  merkleMaxDepth: number,
  maxNumericValues: number,
  maxLists: number,
  maxListElements: number,
  maxTuples: number,
  tupleArity: number
): ProtoPODGPCCircuitParams {
  return {
    maxObjects,
    maxEntries,
    merkleMaxDepth,
    maxNumericValues,
    maxLists,
    maxListElements,
    maxTuples,
    tupleArity
  };
}

/**
 * Mapping taking a ProtoPODGPCCircuitParams to its array representation.
 * Inverse of {@link arrayToProtoPODGPCCircuitParam}.
 * This is necessary for invocations of the circuits themselves.
 */
export function protoPODGPCCircuitParamArray(
  params: ProtoPODGPCCircuitParams
): number[] {
  return [
    params.maxObjects,
    params.maxEntries,
    params.merkleMaxDepth,
    params.maxNumericValues,
    params.maxLists,
    params.maxListElements,
    params.maxTuples,
    params.tupleArity
  ];
}

/**
 * Mapping taking an array representation of parameters to
 * a ProtoPODGPCCircuitParams object.  Inverse of
 * {@link protoPODGPCCircuitParamArray}.
 */
export function arrayToProtoPODGPCCircuitParam(
  params: number[]
): ProtoPODGPCCircuitParams {
  return ProtoPODGPCCircuitParams(
    params[0],
    params[1],
    params[2],
    params[3],
    params[4],
    params[5],
    params[6],
    params[7]
  );
}

/**
 * Mapping computing the maximum number of virtual entries from given GPC
 * parameters.
 */
export function paramMaxVirtualEntries(
  params: ProtoPODGPCCircuitParams
): number {
  return params.maxObjects;
}

/**
 * Circuit description with parameters specific to ProtoPODGPC family.
 */
export type ProtoPODGPCCircuitDesc = CircuitDesc & ProtoPODGPCCircuitParams;

/**
 * Utility functions for the ProtoPODGPC family of circuits.
 *
 * TODO(POD-P3): Factor out and generalize if/when there are multiple
 * families and we're clear on what's common between them.
 */
export class ProtoPODGPC {
  /**
   * Generate a Groth16 proof for a circuit in this family.
   *
   * @param inputs full inputs (public and private)
   * @param wasmPath path to wasm file for witness generation.
   *   See {@link artifactPaths}.
   * @param pkeyPath path to file containing proving key.
   *   See {@link artifactPaths}.
   * @returns Groth16 proof, circuit outputs, and full set of public signals
   * (primarily for verification in tests).
   */
  public static async prove(
    inputs: ProtoPODGPCInputs,
    wasmPath: string,
    pkeyPath: string
  ): Promise<{
    proof: Groth16Proof;
    outputs: ProtoPODGPCOutputs;
    publicSignals: bigint[];
  }> {
    const { proof, publicSignals } = await groth16.fullProve(
      inputs,
      wasmPath,
      pkeyPath
    );
    const intPublicSignals = publicSignals.map(BigInt);

    const outputs = ProtoPODGPC.outputsFromPublicSignals(
      intPublicSignals,
      inputs.entryNameHash.length,
      inputs.objectSignatureS.length
    );
    return { proof, outputs, publicSignals: intPublicSignals };
  }

  /**
   * Verify a proof for a circuit in this library.
   *
   * @param vkeyPath path to verification key as a JSON file.
   *   See {@link artifactPaths}.
   * @param proof Groth16 proof.
   * @param publicInputs claimed public inputs to the circuit.
   *   See {@link filterPublicInputs}
   * @param outputs claimed outputs from the circuit (generally derived from
   *   claims).
   * @returns true if the proof is valid
   */
  public static async verify(
    vkeyPath: string,
    proof: Groth16Proof,
    publicInputs: ProtoPODGPCPublicInputs,
    outputs: ProtoPODGPCOutputs
  ): Promise<boolean> {
    const publicSignals = ProtoPODGPC.makePublicSignals(publicInputs, outputs);
    return await groth16.verify(
      await loadVerificationKey(vkeyPath),
      // Snarkjs actually allows bigints (via call to stringifyBigInts in
      // ffjavascript), but @types/snarkjs doesn't know that.
      publicSignals as unknown as string[],
      proof
    );
  }

  /**
   * Extract the public inputs from the full set of proof inputs.
   */
  public static filterPublicInputs(
    allInputs: ProtoPODGPCInputs
  ): ProtoPODGPCPublicInputs {
    return {
      entryObjectIndex: allInputs.entryObjectIndex,
      entryNameHash: allInputs.entryNameHash,
      entryIsValueHashRevealed: allInputs.entryIsValueHashRevealed,
      virtualEntryIsValueHashRevealed:
        allInputs.virtualEntryIsValueHashRevealed,
      entryEqualToOtherEntryByIndex: allInputs.entryEqualToOtherEntryByIndex,
      ownerEntryIndex: allInputs.ownerEntryIndex,
      ownerExternalNullifier: allInputs.ownerExternalNullifier,
      ownerIsNullfierHashRevealed: allInputs.ownerIsNullfierHashRevealed,
      numericValueEntryIndices: allInputs.numericValueEntryIndices,
      numericMinValues: allInputs.numericMinValues,
      numericMaxValues: allInputs.numericMaxValues,
      tupleIndices: allInputs.tupleIndices,
      listComparisonValueIndex: allInputs.listComparisonValueIndex,
      listContainsComparisonValue: allInputs.listContainsComparisonValue,
      listValidValues: allInputs.listValidValues,
      globalWatermark: allInputs.globalWatermark
    };
  }

  /**
   * Extract named outputs from the public circuit signals.
   *
   * Because of the flattened array representation of the public signals, the
   * circuit's maxEntries parameter must be known to properly reconstruct
   * output arrays.
   */
  public static outputsFromPublicSignals(
    publicSignals: bigint[],
    maxEntries: number,
    maxVirtualEntries: number
  ): ProtoPODGPCOutputs {
    return {
      entryRevealedValueHash: publicSignals.slice(0, maxEntries),
      virtualEntryRevealedValueHash: publicSignals.slice(
        maxEntries,
        maxEntries + maxVirtualEntries
      ),
      ownerRevealedNullifierHash: publicSignals[maxEntries + maxVirtualEntries]
    };
  }

  /**
   * Creates a set of public signals for verification, given public inputs
   * and outputs of a circuit.
   *
   * Some values are replaced with their 0-residues modulo `BABY_JUB_PRIME` to
   * agree with the values returned by the Groth16 prover, which are always
   * normalised this way.
   */
  public static makePublicSignals(
    inputs: ProtoPODGPCPublicInputs,
    outputs: ProtoPODGPCOutputs
  ): bigint[] {
    return [
      ...outputs.entryRevealedValueHash,
      ...outputs.virtualEntryRevealedValueHash,
      outputs.ownerRevealedNullifierHash,
      ...inputs.entryObjectIndex,
      ...inputs.entryNameHash,
      inputs.entryIsValueHashRevealed,
      inputs.virtualEntryIsValueHashRevealed,
      ...inputs.entryEqualToOtherEntryByIndex,
      inputs.ownerEntryIndex,
      inputs.ownerExternalNullifier,
      inputs.ownerIsNullfierHashRevealed,
      ...inputs.numericValueEntryIndices,
      ...inputs.numericMinValues.map((value) =>
        zeroResidueMod(value, BABY_JUB_PRIME)
      ),
      ...inputs.numericMaxValues.map((value) =>
        zeroResidueMod(value, BABY_JUB_PRIME)
      ),
      ...inputs.tupleIndices.flat(),
      ...inputs.listComparisonValueIndex,
      inputs.listContainsComparisonValue,
      ...inputs.listValidValues.flat(),
      inputs.globalWatermark
    ].map(BigInt);
  }

  /**
   * Picks the smallest available circuit in this family which can handle the
   * size parameters of a desired configuration.
   *
   * @param params a lower bound on the parameters required
   * @returns the circuit description, or undefined if no circuit can handle
   *   the required parameters.
   */
  public static pickCircuit(
    requiredParameters: ProtoPODGPCCircuitParams
  ): ProtoPODGPCCircuitDesc | undefined {
    for (const circuitDesc of ProtoPODGPC.CIRCUIT_FAMILY) {
      if (
        ProtoPODGPC.circuitMeetsRequirements(circuitDesc, requiredParameters)
      ) {
        return circuitDesc;
      }
    }
    return undefined;
  }

  /**
   * Finds the description of a circuit in this family by name.
   *
   * @param familyName the circuit family name
   * @param circuitName the name of the circuit
   * @returns the circuit description, or undefined if the name is
   *   unrecognized.
   */
  public static findCircuit(
    familyName: string,
    circuitName: string
  ): ProtoPODGPCCircuitDesc | undefined {
    if (familyName && familyName !== PROTO_POD_GPC_FAMILY_NAME) {
      return undefined;
    }
    for (const circuitDesc of ProtoPODGPC.CIRCUIT_FAMILY) {
      if (circuitName && circuitDesc.name === circuitName) {
        return circuitDesc;
      }
    }
    return undefined;
  }

  /**
   * Checks whether a described circuit can meet a required set of parameters.
   * This will be true if each of the circuit's parameters is greater than or
   * equal to the required value.
   *
   * @param circuitDesc description of the circuit to check
   * @param requiredParams the min required value of each circuit parameter
   * @returns `true` if the circuit meets the requirements.
   */
  public static circuitMeetsRequirements(
    circuitDesc: ProtoPODGPCCircuitDesc,
    requiredParams: ProtoPODGPCCircuitParams
  ): boolean {
    return (
      circuitDesc.maxObjects >= requiredParams.maxObjects &&
      circuitDesc.maxEntries >= requiredParams.maxEntries &&
      circuitDesc.merkleMaxDepth >= requiredParams.merkleMaxDepth &&
      circuitDesc.maxNumericValues >= requiredParams.maxNumericValues &&
      circuitDesc.maxLists >= requiredParams.maxLists &&
      circuitDesc.maxListElements >= requiredParams.maxListElements &&
      circuitDesc.maxTuples >= requiredParams.maxTuples &&
      circuitDesc.tupleArity >= requiredParams.tupleArity
    );
  }

  /**
   * Calculates the merged set of parameters which meets the unified (maximum)
   * requirements of both inputs.
   *
   * @param rp1 first set of required parameters
   * @param rp2 second set of required paremeters
   * @returns unified (maximum) parameters
   */
  public static mergeRequiredParams(
    rp1: ProtoPODGPCCircuitParams,
    rp2: ProtoPODGPCCircuitParams
  ): ProtoPODGPCCircuitParams {
    const array1 = protoPODGPCCircuitParamArray(rp1);
    const array2 = protoPODGPCCircuitParamArray(rp2);
    return arrayToProtoPODGPCCircuitParam(
      array1.map((p, i) => Math.max(p, array2[i]))
    );
  }

  /**
   * Generates a circuit name based on parameters.
   */
  public static circuitNameForParams(params: ProtoPODGPCCircuitParams): string {
    return `${params.maxObjects}o-${params.maxEntries}e-${params.merkleMaxDepth}md-${params.maxNumericValues}nv-${params.maxLists}x${params.maxListElements}l-${params.maxTuples}x${params.tupleArity}t`;
  }

  private static circuitDescForParams(
    circuitParams: ProtoPODGPCCircuitParams,
    cost: number
  ): ProtoPODGPCCircuitDesc {
    return {
      family: PROTO_POD_GPC_FAMILY_NAME,
      name: ProtoPODGPC.circuitNameForParams(circuitParams),
      cost,
      ...circuitParams
    };
  }

  /**
   * Circuit parameters pulled from `circuitParameters.json`
   * in the form of pairs consisting of the circuit parameters
   * and the cost of the circuit in constraints.
   */
  static CIRCUIT_PARAMETERS: [ProtoPODGPCCircuitParams, number][] =
    circuitParamJson as [ProtoPODGPCCircuitParams, number][];

  /**
   * List of pre-compiled circuits, sorted in order of increasing cost.
   * These should match the declarations in circuits.json for circomkit,
   * and each should correspond to an available set of precompiled artifacts.
   */
  // TODO(POD-P2): Pick convenient circuit sizes for MVP.
  public static CIRCUIT_FAMILY: ProtoPODGPCCircuitDesc[] =
    ProtoPODGPC.CIRCUIT_PARAMETERS.sort((a, b) => a[1] - b[1]).map(
      (pair: [ProtoPODGPCCircuitParams, number]): ProtoPODGPCCircuitDesc =>
        ProtoPODGPC.circuitDescForParams(pair[0], pair[1])
    );

  /**
   * Name of the package on NPM which contains published artifacts for this
   * GPC family.
   */
  public static ARTIFACTS_NPM_PACKAGE_NAME = "@pcd/proto-pod-gpc-artifacts";

  /**
   * Version of the published artifacts on NPM which are compatible with this
   * version of the GPC circuits.
   */
  public static ARTIFACTS_NPM_VERSION = "0.5.0";
}
