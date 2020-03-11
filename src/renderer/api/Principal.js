// import { Subject } from 'rxjs/Subject'
import { trackerService } from './trackerService'

export function Principal() {
  this.userIdentity = {}
  this.authenticated = false

  this.authenticate = function(identity) {
    this.userIdentity = identity
    this.authenticated = identity !== null
    this.authenticationState.next(this.userIdentity)
  }

  this.hasAnyAuthority = function(authorities) {
    return Promise.resolve(this.hasAnyAuthorityDirect(authorities))
  }

  this.hasAnyAuthorityDirect = function(authorities) {
    if (!this.authenticated || !this.userIdentity || !this.userIdentity.authorities) {
      return false
    }
    for (let i = 0; i < authorities.length; i++) {
      if (this.userIdentity.authorities.indexOf(authorities[i]) !== -1) {
        return true
      }
    }
    return false
  }
  this.hasAuthority = function(authority) {
    if (!this.authenticated) {
      return Promise.resolve(false)
    }
    return this.identity().then((id) => {
      return Promise.resolve(id.authorities && id.authorities.indexOf(authority) !== -1)
    }, () => {
      return Promise.resolve(false)
    })
  }
  this.identity = function(force) {
    if (force === true) {
      this.userIdentity = undefined
    }

    // check and see if we have retrieved the userIdentity data from the server.
    // if we have, reuse it by immediately resolving
    if (this.userIdentity) {
      return Promise.resolve(this.userIdentity)
    }

    // retrieve the userIdentity data from the server, update the identity object, and then resolve.
    return this.account.get().toPromise().then((account) => {
      if (account) {
        this.userIdentity = account
        this.authenticated = true
        trackerService.connect()
      } else {
        this.userIdentity = null
        this.authenticated = false
      }
      this.authenticationState.next(this.userIdentity)
      return this.userIdentity
    }).catch(() => {
      if (trackerService.stompClient && trackerService.stompClient.connected) {
        trackerService.disconnect()
      }
      this.userIdentity = null
      this.authenticated = false
      this.authenticationState.next(this.userIdentity)
      return null
    })
  }
  this.isAuthenticated = function() {
    return this.authenticated
  }

  this.isIdentityResolved = function() {
    return this.userIdentity !== undefined
  }

  this.getAuthenticationState = function() {
    return this.authenticationState.asObservable()
  }

  this.getImageUrl = function() {
    return this.isIdentityResolved() ? this.userIdentity.imageUrl : null
  }
}
