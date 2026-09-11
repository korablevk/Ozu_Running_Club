import * as migration_20260911_213316_core_collections from './20260911_213316_core_collections';

export const migrations = [
  {
    up: migration_20260911_213316_core_collections.up,
    down: migration_20260911_213316_core_collections.down,
    name: '20260911_213316_core_collections'
  },
];
