import * as migration_20260911_213316_core_collections from './20260911_213316_core_collections';
import * as migration_20260912_094952_add_member_details from './20260912_094952_add_member_details';

export const migrations = [
  {
    up: migration_20260911_213316_core_collections.up,
    down: migration_20260911_213316_core_collections.down,
    name: '20260911_213316_core_collections',
  },
  {
    up: migration_20260912_094952_add_member_details.up,
    down: migration_20260912_094952_add_member_details.down,
    name: '20260912_094952_add_member_details'
  },
];
