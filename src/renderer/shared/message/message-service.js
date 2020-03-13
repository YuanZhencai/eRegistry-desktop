export function success(response) {
  const headers = responseHeaders(response)
  if (headers.length > 1) {
    headers.sort()
    const alertKey = response.headers.get(headers[0])
    if (typeof alertKey === 'string') {
      const alertParam = headers.length >= 2 ? response.headers.get(headers[1]) : null
      this.$message.success(translate(alertKey, { param: alertParam }))
    }
  }
  return response
}

export function error(httpResponse) {
  if (httpResponse.status === 401) {
    return
  }
  if (!((httpResponse.text() === '' || (httpResponse.json().path && httpResponse.json().path.indexOf('/api/account') === 0)))) {
    switch (httpResponse.status) {
      // connection refused, server not reachable
      case 0:
        addErrorAlert('Server not reachable', 'error.server.not.reachable')
        break

      case 400:
        {
          const headers = responseHeaders(httpResponse)
          headers.sort()
          let errorHeader = null
          let entityKey = null
          if (headers.length > 1) {
            errorHeader = httpResponse.headers.get(headers[0])
            entityKey = httpResponse.headers.get(headers[1])
          }
          if (errorHeader) {
            const entityName = translate('global.menu.entities.' + entityKey)
            addErrorAlert(errorHeader, errorHeader, { entityName })
          } else if (httpResponse.text() !== '' && httpResponse.json() && httpResponse.json().fieldErrors) {
            const fieldErrors = httpResponse.json().fieldErrors
            if (fieldErrors && fieldErrors.length > 0 && !(httpResponse.json().path && httpResponse.json().path.indexOf('/api/authenticate') === 0)) {
              addErrorAlert('error.validation', 'error.validation')
            }
          } else if (httpResponse.text() !== '' && httpResponse.json() && httpResponse.json().message) {
            addErrorAlert(httpResponse.json().message, httpResponse.json().message, httpResponse.json().params)
          } else {
            addErrorAlert(httpResponse.text())
          }
        }

        break

      case 404:
        addErrorAlert('Not found', 'error.url.not.found')
        break

      default:
        if (httpResponse.text() !== '' && httpResponse.json() && httpResponse.json().message) {
          addErrorAlert(httpResponse.json().message)
        } else {
          addErrorAlert(httpResponse.text())
        }
    }
  }
  return Promise.reject(httpResponse)
}

function addErrorAlert(message, key, data) {
  key = key || message
  this.$message.error(translate(key, data))
}

function translate(key, data) {
  if (key) {
    key = key.replace('studioApp', 'eRegistryApp')
    return key
  }
  return key
}

function responseHeaders(response) {
  const headers = []
  for (const name in response.headers) {
    if (name.toLowerCase().endsWith('app-alert') || name.toLowerCase().endsWith('app-params')) {
      headers.push(name)
    }
  }
  return headers
}
