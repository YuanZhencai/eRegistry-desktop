import { Message } from 'element-ui'

export default class MessageService {
  $i18n

  constructor(i18n) {
    this.$i18n = i18n
  }

  success(response) {
    const headers = this.successHeaders(response)
    if (headers.length > 1) {
      headers.sort()
      const alertKey = response.headers[headers[0]]
      if (typeof alertKey === 'string') {
        const alertParam = headers.length >= 2 ? response.headers[headers[1]] : null
        Message.success(this.translate(alertKey, { param: alertParam }))
      }
    }
  }
  error(error) {
    const response = error.response
    if (response.status === 0) {
      // connection refused, server not reachable
      this.addErrorAlert('Server not reachable', 'error.server_not_reachable')
      return
    }
    if (response.status === 401) {
      return
    }
    if (!(((response.data.path && response.data.path.indexOf('/api/account') === 0)))) {
      switch (response.status) {
        case 400:
          {
            const headers = this.errorHeaders(response)
            headers.sort()
            let errorHeader = null
            let entityKey = null
            if (headers.length > 1) {
              errorHeader = response.headers[headers[0]]
              entityKey = response.headers[headers[1]]
            }
            if (errorHeader) {
              const entityName = this.translate('global.menu.entities.' + entityKey)
              this.addErrorAlert(errorHeader, errorHeader, { entityName })
            } else if (response.data && response.data.fieldErrors) {
              const fieldErrors = response.data.fieldErrors
              if (fieldErrors && fieldErrors.length > 0 && !(response.data.path && response.data.path.indexOf('/api/authenticate') === 0)) {
                this.addErrorAlert('error.validation', 'error.validation')
              }
            } else if (response.data && response.data.message) {
              this.addErrorAlert(response.data.message, response.data.message, response.data.params)
            }
          }

          break

        case 404:
          this.addErrorAlert('Not found', 'error.url_not_found')
          break

        default:
          if (response.data && response.data.message) {
            this.addErrorAlert(response.data.message)
          }
      }
    }
  }

  addErrorAlert(message, key, data) {
    key = key || message
    Message.error(this.translate(key, data))
  }

  translate(key, data) {
    if (key) {
      key = key.replace('studioApp.', '')
      key = key.replace('eRegistryApp.', '')
      return this.$i18n.t(key, data)
    }
    return key
  }

  successHeaders(response) {
    const headers = []
    for (const name in response.headers) {
      if (name.toLowerCase().endsWith('app-alert') || name.toLowerCase().endsWith('app-params')) {
        headers.push(name)
      }
    }
    return headers
  }
  errorHeaders(response) {
    const headers = []
    for (const name in response.headers) {
      if (name.toLowerCase().endsWith('app-error') || name.toLowerCase().endsWith('app-params')) {
        headers.push(name)
      }
    }
    return headers
  }
}

