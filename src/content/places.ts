/** World layout anchors shared by the village builder, NPC routines, and quests. X/Z in world units; -Z is north. */
export type V2 = [number, number];

export const NODES: Record<string, V2> = {
  plazaN: [0, -4.8], plazaS: [0, 4.8], plazaW: [-4.8, 0], plazaE: [4.8, 0],
  cafe: [-12, -4.2], store: [12, -4.2],
  home: [0, 18.6], homeE: [4.6, 12.4], bus: [2.2, 23.4], garden: [10, 7.0],
  dock: [-6.8, 10.0], dockEnd: [-11.0, 10.45], pondSE: [-6.6, 15.6], pondS: [-14, 16.8],
  biscuitHome: [-22, -2.6], pipHome: [22, -2.6], yuzuHome: [-26, 16.6],
  bridgeS: [0, -17.2], bridgeN: [0, -22.8], clearing: [0, -29],
};

export const EDGES: [string, string][] = [
  ['plazaN', 'plazaW'], ['plazaN', 'plazaE'], ['plazaS', 'plazaW'], ['plazaS', 'plazaE'],
  ['plazaW', 'cafe'], ['plazaE', 'store'], ['plazaE', 'garden'], ['plazaS', 'homeE'], ['homeE', 'home'], ['home', 'bus'],
  ['plazaW', 'dock'], ['dock', 'dockEnd'], ['dock', 'pondSE'], ['pondSE', 'pondS'], ['pondS', 'yuzuHome'],
  ['pondSE', 'home'],
  ['cafe', 'biscuitHome'], ['store', 'pipHome'],
  ['plazaN', 'bridgeS'], ['bridgeS', 'bridgeN'], ['bridgeN', 'clearing'],
];

export const SPOTS = {
  spawn: [1.2, 22.2] as V2,
  fountain: [0, 0] as V2,
  notice: [5.2, -3.4] as V2,
  homeDoor: [0, 17.3] as V2,
  cafeBuilding: [-12, -8.6] as V2,
  storeBuilding: [12, -8.6] as V2,
  homeBuilding: [0, 14.6] as V2,
  biscuitHouse: [-22, -6.6] as V2,
  pipHouse: [22, -6.6] as V2,
  yuzuHouse: [-26, 12.4] as V2,
  bigTree: [16, 5] as V2,
  pond: { x: -14, z: 10, rx: 6, rz: 4.5 },
  dockRect: { minX: -11.8, maxX: -7.4, minZ: 9.1, maxZ: 10.9 },
  fishSpot: [-9.4, 9.5] as V2,
  bobber: [-9.4, 7.3] as V2,
  stream: { z: -20, half: 1.25 },
  bridge: { halfW: 1.35, minZ: -22.4, maxZ: -17.6 },
  forestLog: [0, -24.6] as V2,
  lost: { key: [2.7, 2.3] as V2, book: [14.7, 6.4] as V2, umbrella: [2.4, -17.0] as V2 },
  flowers: [[8.2, 9.6], [9.6, 10.6], [12.2, 10.4], [13.6, 9.4], [8.8, 12.2], [12.8, 12.4]] as V2[],
  mushrooms: [[-2.4, -28.6], [2.6, -29.8], [-1.2, -31.4], [3.4, -27.4]] as V2[],
};
