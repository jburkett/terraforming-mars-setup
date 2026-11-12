import boards from './boards.json' with { type: 'json' }
import expansions from './expansions.json' with { type: 'json' }
import colonies from './colonies.json' with { type: 'json' }
import milestones from './milestones.json' with { type: 'json' }
import awards from './awards.json' with { type: 'json' }
import instructions from './instructions.json' with { type: 'json' }
import { parseCatalogs } from './validation.ts'

function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    for (const nested of Object.values(value)) freeze(nested)
    Object.freeze(value)
  }
  return value
}

export const catalogs = freeze(
  parseCatalogs({
    boards,
    expansions,
    colonies,
    milestones,
    awards,
    instructions,
  }),
)
