/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Speaker, StakeholderCategoryMeta, StakeholderInvitee } from '../types';
import { INITIAL_VERIFIED_SPEAKERS } from './speakersData';
import { STAKEHOLDER_CATEGORIES, INITIAL_STAKEHOLDERS } from './stakeholdersData';
import { DIGNITARY_TIERS_DATA } from './dignitariesData';

export interface MasterRegistry {
  speakers: Speaker[];
  stakeholderCategories: StakeholderCategoryMeta[];
  stakeholderInvitees: StakeholderInvitee[];
  dignitaryTiers: typeof DIGNITARY_TIERS_DATA;
}

export const MASTER_REGISTRY: MasterRegistry = {
  speakers: INITIAL_VERIFIED_SPEAKERS,
  stakeholderCategories: STAKEHOLDER_CATEGORIES,
  stakeholderInvitees: INITIAL_STAKEHOLDERS,
  dignitaryTiers: DIGNITARY_TIERS_DATA
};

export function getMasterRegistry(): MasterRegistry {
  return MASTER_REGISTRY;
}
