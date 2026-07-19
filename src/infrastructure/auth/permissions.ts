import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access"

const statement = {
  ...defaultStatements,
  team: ["manage", "view"],
} as const

const ac = createAccessControl(statement)

const admin = ac.newRole({
  team: ["manage", "view"],
  ...adminAc.statements,
})

const manager = ac.newRole({
  ...adminAc.statements,
  team: ["manage", "view"],
})

const editor = ac.newRole({
  user: ["list", "get"],
  session: [],
  team: ["view"],
})

const instructor = ac.newRole({
  user: [],
  session: [],
  team: [],
})

const user = ac.newRole({
  user: [],
  session: [],
  team: [],
})

export { ac, admin, manager, editor, instructor, user }
