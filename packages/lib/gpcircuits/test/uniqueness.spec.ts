import { POD_INT_MAX, POD_INT_MIN, podValueHash } from "@pcd/pod";
import { WitnessTester } from "circomkit";
import "mocha";
import {
  UniquenessModuleInputNamesType,
  UniquenessModuleOutputNamesType
} from "../src";
import { circomkit } from "./common";

const circuit = async (
  numElements: number
): Promise<
  WitnessTester<UniquenessModuleInputNamesType, UniquenessModuleOutputNamesType>
> =>
  circomkit.WitnessTester("UniquenessModule", {
    file: "uniqueness",
    template: "UniquenessModule",
    params: [numElements]
  });

describe("uniqueness.UniquenessModule should work", async function () {
  it("should return 1 for unique list elements", async () => {
    const lists = [
      [1n],
      [1n, 2n],
      [47n, 27n, 11n],
      [898n, 8283n, 16n],
      [1923n, 2736n, 192n, 837n]
    ];

    for (const list of lists) {
      await circuit(list.length).then((c) =>
        c.expectPass({ values: list }, { valuesAreUnique: 1n })
      );
    }
  });

  it("should return 0 for unique list elements", async () => {
    const lists = [
      [1n, 1n],
      [47n, 47n, 11n],
      [47n, 11n, 47n],
      [11n, 47n, 47n],
      [1923n, 1923n, 192n, 837n],
      [192n, 837n, 1923n, 1923n],
      [1923n, 837n, 1923n, 192n],
      [837n, 1923n, 192n, 1923n]
    ];

    for (const list of lists) {
      await circuit(list.length).then((c) =>
        c.expectPass({ values: list }, { valuesAreUnique: 0n })
      );
    }
  });
});
