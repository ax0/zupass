import { PODValue, podValueHash } from "@pcd/pod";
import { expect } from "chai";
import { WitnessTester } from "circomkit";
import "mocha";
import {
  ListMembershipModuleInputNamesType,
  ListMembershipModuleInputs,
  ListMembershipModuleOutputNamesType,
  ListMembershipModuleOutputs,
  extendedSignalArray,
  hashTuple,
  padArray,
  paramMaxVirtualEntries,
  processLists,
  processSingleList,
  zipLists
} from "../src";
import { circomkit } from "./common";
import { TEST_CIRCUIT_PARAMETERS } from "./proto-pod-gpc.spec";

describe("List membership helpers should work", function () {
  const params1 = {
    ...TEST_CIRCUIT_PARAMETERS[0][0],
    maxEntries: 6,
    tupleArity: 2,
    maxLists: 3,
    maxListElements: 10,
    maxTuples: 4
  };

  const params2 = {
    ...params1,
    tupleArity: 3
  };

  const params3 = {
    ...params1,
    tupleArity: 4
  };

  it("should properly process a single membership list", () => {
    // List membership without tuples
    const list1 = [0n, 1n, 2n, 3n].map((value) => [
      { type: "int", value } as PODValue
    ]);
    const listComparisonValueIndex1 = [0];

    // List membership with tuples
    const list2 = list1.map((x) => x.concat(x));
    const listComparisonValueIndex2 = [0, 2];

    // Restrict attention to those parameters allowing a list membership check.
    for (const params of TEST_CIRCUIT_PARAMETERS.map((pair) => pair[0]).filter(
      (params) => params.maxListElements > 0
    )) {
      // Truncate list if necessary.
      const truncatedList = list1.slice(0, params.maxListElements);

      expect(
        processSingleList(
          params,
          params.maxEntries + paramMaxVirtualEntries(params),
          listComparisonValueIndex1,
          truncatedList
        )
      ).to.deep.equal({
        tupleIndices: [],
        listComparisonValueIndex: 0,
        listValidValues: padArray(
          truncatedList.map((x) => podValueHash(x[0])),
          params.maxListElements,
          podValueHash(list1[0][0])
        )
      });
    }

    expect(
      processSingleList(params1, 6, listComparisonValueIndex2, list2)
    ).to.deep.equal({
      tupleIndices: [[0, 2]],
      listComparisonValueIndex: 6,
      listValidValues: padArray(
        list2.map((x) => hashTuple(params1.tupleArity, x)),
        params1.maxListElements,
        hashTuple(params1.tupleArity, list2[0])
      )
    });

    expect(
      processSingleList(params2, 6, listComparisonValueIndex2, list2)
    ).to.deep.equal({
      tupleIndices: [[0, 2, 0]],
      listComparisonValueIndex: 6,
      listValidValues: padArray(
        list2.map((x) => hashTuple(params2.tupleArity, x)),
        params2.maxListElements,
        hashTuple(params2.tupleArity, list2[0])
      )
    });

    expect(
      processSingleList(params3, 6, listComparisonValueIndex2, list2)
    ).to.deep.equal({
      tupleIndices: [[0, 2, 0, 0]],
      listComparisonValueIndex: 6,
      listValidValues: padArray(
        list2.map((x) => hashTuple(params3.tupleArity, x)),
        params1.maxListElements,
        hashTuple(params3.tupleArity, list2[0])
      )
    });
  });
  it("should properly process multiple membership lists", () => {
    // List membership without tuples
    const list1 = [0n, 1n, 2n, 3n].map((value) => {
      return { type: "int", value } as PODValue;
    });

    const list2 = [98n, 97n, 0n, 4n].map((value) => {
      return { type: "cryptographic", value } as PODValue;
    });

    const lists = [
      zipLists([list1, list2]),
      zipLists([list1, list2, list1, list1]),
      list1.map((x) => [x])
    ];

    const listComparisonValueIndices = [[0, 1], [2, 3, 4, 5], [0]];

    const listValidValues1 = [
      [
        5761833800329748082551817559300086650797914616924753469673239650843627935146n,
        17469414314922515317374944768007856796862394642440288583832552538492770007297n,
        9515281866020622514018085436975892780866762369531923886762760153571646747622n,
        15866811995824089293749468808478915337040145970836273016636380754543464442080n,
        5761833800329748082551817559300086650797914616924753469673239650843627935146n,
        5761833800329748082551817559300086650797914616924753469673239650843627935146n,
        5761833800329748082551817559300086650797914616924753469673239650843627935146n,
        5761833800329748082551817559300086650797914616924753469673239650843627935146n,
        5761833800329748082551817559300086650797914616924753469673239650843627935146n,
        5761833800329748082551817559300086650797914616924753469673239650843627935146n
      ],
      [
        5471880032677466603829286872903097666457225330720290379658430980354293667652n,
        15398281083253910995399226421457183178551188440281255844388951647984680599394n,
        13059198415240663142310762867995799778026456692003781731633350611821415510128n,
        6338307475223234171825405017391537523342534406203405977225861250776527264006n,
        5471880032677466603829286872903097666457225330720290379658430980354293667652n,
        5471880032677466603829286872903097666457225330720290379658430980354293667652n,
        5471880032677466603829286872903097666457225330720290379658430980354293667652n,
        5471880032677466603829286872903097666457225330720290379658430980354293667652n,
        5471880032677466603829286872903097666457225330720290379658430980354293667652n,
        5471880032677466603829286872903097666457225330720290379658430980354293667652n
      ],
      [
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        18586133768512220936620570745912940619677854269274689475585506675881198879027n,
        8645981980787649023086883978738420856660271013038108762834452721572614684349n,
        6018413527099068561047958932369318610297162528491556075919075208700178480084n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n
      ]
    ];

    const listValidValues2 = [
      [
        19807313840762825537239430494583375754967739397068537685303260758245683156086n,
        20825757977558359782800140446441091744662712907152513288142672663645932253678n,
        19363743679913688414034979546858006272122980236659570222656664710682301846920n,
        3595934468675371469609151017737700699848250709097803796686715738190273796778n,
        19807313840762825537239430494583375754967739397068537685303260758245683156086n,
        19807313840762825537239430494583375754967739397068537685303260758245683156086n,
        19807313840762825537239430494583375754967739397068537685303260758245683156086n,
        19807313840762825537239430494583375754967739397068537685303260758245683156086n,
        19807313840762825537239430494583375754967739397068537685303260758245683156086n,
        19807313840762825537239430494583375754967739397068537685303260758245683156086n
      ],
      [
        7264202224973777384387757597510908525920131559240265231884907515015111902027n,
        6039998608110309201352261001459985879882966964664198947767694135073350587452n,
        1393901694819463509271036873779394305993893084721808993825341697312065054472n,
        18053133888829334228027202089439053527376171011121103320668420112880781885219n,
        7264202224973777384387757597510908525920131559240265231884907515015111902027n,
        7264202224973777384387757597510908525920131559240265231884907515015111902027n,
        7264202224973777384387757597510908525920131559240265231884907515015111902027n,
        7264202224973777384387757597510908525920131559240265231884907515015111902027n,
        7264202224973777384387757597510908525920131559240265231884907515015111902027n,
        7264202224973777384387757597510908525920131559240265231884907515015111902027n
      ],
      [
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        18586133768512220936620570745912940619677854269274689475585506675881198879027n,
        8645981980787649023086883978738420856660271013038108762834452721572614684349n,
        6018413527099068561047958932369318610297162528491556075919075208700178480084n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n
      ]
    ];

    const listValidValues3 = [
      [
        7696853836372712575501086906563412132955804226675214283831137449214042819560n,
        1246437017664158814676582093837535272588521578125556742159132138283084848586n,
        11880931982666018608380688487936984584837990320019309620835319468607033935037n,
        9150215748597990227476562570542907987875480016196159823477073578154452234153n,
        7696853836372712575501086906563412132955804226675214283831137449214042819560n,
        7696853836372712575501086906563412132955804226675214283831137449214042819560n,
        7696853836372712575501086906563412132955804226675214283831137449214042819560n,
        7696853836372712575501086906563412132955804226675214283831137449214042819560n,
        7696853836372712575501086906563412132955804226675214283831137449214042819560n,
        7696853836372712575501086906563412132955804226675214283831137449214042819560n
      ],
      [
        7696853836372712575501086906563412132955804226675214283831137449214042819560n,
        1246437017664158814676582093837535272588521578125556742159132138283084848586n,
        11880931982666018608380688487936984584837990320019309620835319468607033935037n,
        9150215748597990227476562570542907987875480016196159823477073578154452234153n,
        7696853836372712575501086906563412132955804226675214283831137449214042819560n,
        7696853836372712575501086906563412132955804226675214283831137449214042819560n,
        7696853836372712575501086906563412132955804226675214283831137449214042819560n,
        7696853836372712575501086906563412132955804226675214283831137449214042819560n,
        7696853836372712575501086906563412132955804226675214283831137449214042819560n,
        7696853836372712575501086906563412132955804226675214283831137449214042819560n
      ],
      [
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        18586133768512220936620570745912940619677854269274689475585506675881198879027n,
        8645981980787649023086883978738420856660271013038108762834452721572614684349n,
        6018413527099068561047958932369318610297162528491556075919075208700178480084n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n,
        19014214495641488759237505126948346942972912379615652741039992445865937985820n
      ]
    ];

    expect(
      processLists(params1, listComparisonValueIndices, lists)
    ).to.deep.equal({
      tupleIndices: [
        [0n, 1n],
        [2n, 3n],
        [9n, 4n],
        [10n, 5n]
      ],
      listComparisonValueIndex: [8n, 11n, 0n],
      listValidValues: listValidValues1
    });

    expect(
      processLists(params2, listComparisonValueIndices, lists)
    ).to.deep.equal({
      tupleIndices: [
        [0n, 1n, 0n],
        [2n, 3n, 4n],
        [9n, 5n, 2n],
        [0n, 0n, 0n]
      ],
      listComparisonValueIndex: [8n, 10n, 0n],
      listValidValues: listValidValues2
    });

    expect(
      processLists(params3, listComparisonValueIndices, lists)
    ).to.deep.equal({
      tupleIndices: [
        [0n, 1n, 0n, 0n],
        [2n, 3n, 4n, 5n],
        [0n, 0n, 0n, 0n],
        [0n, 0n, 0n, 0n]
      ],
      listComparisonValueIndex: [8n, 9n, 0n],
      listValidValues: listValidValues3
    });
  });
});

describe("list-membership.ListMembershipModule should work", function () {
  // Circuit compilation sometimes takes more than the default timeout of 2s.
  const circuit: (
    n: number
  ) => Promise<
    WitnessTester<
      ListMembershipModuleInputNamesType,
      ListMembershipModuleOutputNamesType
    >
  > = (n) =>
    circomkit.WitnessTester("ListMembershipModule", {
      file: "list-membership",
      template: "ListMembershipModule",
      params: [n]
    });
  // Here the list of admissible values contains only 5 elements.
  const sampleList = [
    8905486818455134363060055817991647390962079139440460714076410595226736943033n,
    371570493675795085340917563256321114090422950170926983546930236206324642985n,
    21855291653660581372252244680535463430106492049961256436916646040420709922401n,
    17518217940872299898943856612951083413101473252068510221758291357642178243064n,
    19610499204834543146583882237191752133835393319355403157181111118356886459810n
  ];

  // Sample input with arbitrary padding
  const sampleInput: (n: number) => ListMembershipModuleInputs = (n) => {
    return {
      validValues: extendedSignalArray(sampleList, n, sampleList[0]), // We fill up the rest with the first element.
      comparisonValue: sampleList[3]
    };
  };

  const sampleOutput: ListMembershipModuleOutputs = {
    isMember: BigInt(+true)
  };

  const sampleOutput2: ListMembershipModuleOutputs = {
    isMember: BigInt(+false)
  };

  it("should successfully verify list membership", async () => {
    await circuit(sampleList.length).then((c) =>
      c.expectPass(sampleInput(sampleList.length), sampleOutput)
    );
  });

  it("should successfully verify list non-membership", async () => {
    await circuit(sampleList.length).then((c) =>
      c.expectPass(
        { ...sampleInput(sampleList.length), comparisonValue: 0n },
        sampleOutput2
      )
    );
  });

  it("should successfully verify list membership with padding of various sizes", async () => {
    for (let i = 0; i < 10; i++) {
      const listLength = 2 * (i + 1) * sampleList.length;
      await circuit(listLength).then((c) =>
        c.expectPass(sampleInput(listLength), sampleOutput)
      );
    }
  });

  it("should successfully verify list non-membership with padding of various sizes", async () => {
    for (let i = 0; i < 10; i++) {
      const listLength = 2 * (i + 1) * sampleList.length;
      await circuit(listLength).then((c) =>
        c.expectPass(
          { ...sampleInput(listLength), comparisonValue: 0n },
          sampleOutput2
        )
      );
    }
  });
});
