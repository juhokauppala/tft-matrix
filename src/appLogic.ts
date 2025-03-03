import { SingleSetData } from "./cdragon";

const groupConnectedTraits = (champions: Champion[]) => {
  // Form groups based on champions with exactly 2 traits
  const championsWith2Traits = champions.filter((c) => c.traits.length === 2);

  const origins: string[] = [],
    types: string[] = [];

  // Insert a trait into a known group and all traits shared by a champion into the other group
  const classifyTrait = (
    knownTrait: string,
    knownTraitType: "origin" | "type"
  ) => {
    const traitList = knownTraitType === "origin" ? origins : types;
    // Recursion end: Trait already in group
    if (traitList.includes(knownTrait)) return;

    traitList.push(knownTrait);
    const traitChampions = championsWith2Traits.filter((c) =>
      c.traits.includes(knownTrait)
    );

    // For each champion that has the known trait...
    for (const traitChampion of traitChampions) {
      // ... find the other trait...
      const otherTrait = traitChampion.traits.find((t) => t !== knownTrait);
      if (otherTrait === undefined)
        throw Error(
          `${traitChampion.name} has no other traits than ${knownTrait}`
        );

      // ... and classify it as the other group
      classifyTrait(
        otherTrait,
        knownTraitType === "origin" ? "type" : "origin"
      );
    }
  };

  // Boldly assume that origin is first
  classifyTrait(championsWith2Traits[0].traits[0], "origin");
  console.debug(`Origin traits:`, origins);
  console.debug(`Type traits:`, types);
  return { origins, types };
};

export const process = (data: SingleSetData) => {
  const { origins: ORIGINS } = groupConnectedTraits(data.champions);

  const originTraits = data.traits.filter((t) =>
    ORIGINS.map((o) => o.toLowerCase()).includes(t.name.toLowerCase())
  );
  const typeTraits = data.traits.filter(
    (t) => !ORIGINS.map((o) => o.toLowerCase()).includes(t.name.toLowerCase())
  );

  const champsWith3Traits = data.champions.filter((c) => c.traits.length > 2);
  const typeTraits3: Trait[] = [];
  const originTraits3: Trait[] = [];
  champsWith3Traits.forEach((c) => {
    const _typeTraits = c.traits
      .map((t) => typeTraits.find((ttr) => ttr.name === t))
      .filter((t) => t) as Trait[];
    const _originTraits = c.traits
      .map((t) => originTraits.find((otr) => otr.name === t))
      .filter((t) => t) as Trait[];

    if (_typeTraits.length > 1) typeTraits3.push(..._typeTraits);
    if (_originTraits.length > 1) originTraits3.push(..._originTraits);
  });

  const typeTraits3Unique = [
    ...new Map<string, Trait>(typeTraits3.map((t) => [t.name, t])).values(),
  ];
  const originTraits3Unique = [
    ...new Map<string, Trait>(originTraits3.map((t) => [t.name, t])).values(),
  ];

  return { originTraits, typeTraits, originTraits3Unique, typeTraits3Unique };
};
