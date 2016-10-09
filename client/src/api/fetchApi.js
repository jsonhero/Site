require('es6-promise').polyfill();
import 'isomorphic-fetch';
import _ from 'lodash';

class FetchApi {
  constructor(url) {
    this.service = url;
  }

  mergeEndpoint(endpoint) {
    return `${this.service}${endpoint}`
  }

  mapToApi(endpoints) {
    let api = {}
    Object.keys(endpoints).map(key => {
      let endpoint_schema = endpoints[key]
      api[key] = (...args) => {
        return this.makeRequest(endpoint_schema(...args))
      }
    })
    return api;
  }

  checkStatus(response) {
    if (response.ok) {
      return response;
    }

    throw new Error(response.statusCode)
  }

  getDefaultOptions() {
    return {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      timeout: 10000,
      mode: 'cors',
    }
  }

  makeRequest(options) {
    const merged_options = _.merge(this.getDefaultOptions(), options.request)
    const merged_uri = this.mergeEndpoint(options.endpoint)
    if (merged_options.body) merged_options.body = JSON.stringify(merged_options.body);
    return fetch(merged_uri, merged_options)
      .then(this.checkStatus)
      .then(response => response.json())
  }

}
export default FetchApi;
