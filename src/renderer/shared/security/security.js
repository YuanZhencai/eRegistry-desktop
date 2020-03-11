import store from '@/store'

export function hasAnyAuthority(authority) {
  const roles = store.getters && store.getters.roles
  if (Array.isArray(authority)) {
    return authority.some((a) => {
      return roles.includes(a)
    })
  } else {
    return roles.includes(authority)
  }
}
