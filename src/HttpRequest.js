class HttpRequest {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  static createURL(baseUrl, url, params) {
    const finalUrl = new URL(url, baseUrl);

    for (const key in params) {
      finalUrl.searchParams.set(key, params[key]);
    }

    return finalUrl;
  }

  __request(method, url, config) {
    const {
      transformResponse,
      params,
      headers,
      responseType,
      onDownloadProgress,
      onUploadProgress,
      data
    } = config;

    const xhr = new XMLHttpRequest();
    const finalUrl = HttpRequest.createURL(this.baseUrl, url, params);
    const xhrHeaders = { ...this.headers, ...headers };

    xhr.open(method, finalUrl, true);
    xhr.responseType = responseType;

    xhr.onprogress = onDownloadProgress;
    xhr.upload.onprogress = onUploadProgress;

    Object.entries(xhrHeaders).forEach(([key, value]) => xhr.setRequestHeader(key, value));

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        let { response } = xhr;

        if (xhr.status !== 200) {
          return reject(xhr);
        }

        // eslint-disable-next-line no-undef
        if (transformResponse && areElementsFunction(transformResponse)) {
          response = transformResponse.reduce((acc, func) => func(acc), response);
        }

        return resolve(response);
      };

      xhr.send(data || null);
    });
  }

  get(url, config) {
    return this.__request('GET', url, config);
  }

  post(url, config) {
    return this.__request('POST', url, config);
  }
}

// const config = {

// `transformResponse` allows changes to the response data to be made before
// it is passed to then/catch
// transformResponse: [function(data) {
// Do whatever you want to transform the data

//   return data;
// }],

// `headers` are custom headers to be sent
// headers: { 'X-Requested-With': 'XMLHttpRequest' },

// `params` are the URL parameters to be sent with the request
// Must be a plain object or a URLSearchParams object
// params: {
//   ID: 12345
// },
// `data` is the data to be sent as the request body
// Only applicable for request methods 'PUT', 'POST', and 'PATCH'
// When no `transformRequest` is set, must be of one of the following types:
// - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
// - Browser only: FormData, File, Blob
// - Node only: Stream, Buffer

// data: {
//   firstName: 'Fred'
// },

// `responseType` indicates the type of data that the server will respond with
// options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
// responseType: 'text' // default

// `onUploadProgress` allows handling of progress events for uploads
// onUploadProgress: progressEvent => {}

// `onDownloadProgress` allows handling of progress events for downloads
// onDownloadProgress(progressEvent) {
//   // Do whatever you want with the native progress event
// }

// };