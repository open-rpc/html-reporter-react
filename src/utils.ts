/* eslint-disable id-length */

export const getPassingFailingMissedMethods = (report: any) => {
  // get method call coverage
  const passingCallsByMethod = report.reduce((m: any, call: any) => {
    if (call.valid === false) {
      return m;
    }
    if (!m[call.methodName]) {
      m[call.methodName] = [];
    }
    m[call.methodName].push(call);
    return m;
  }, {} as { [key: string]: any[] });

  const passingMethods = Object.keys(passingCallsByMethod);

  const failedCallsByMethod = report.reduce((m: any, call: any) => {
    if (call.valid === true) {
      return m;
    }
    if (!m[call.methodName]) {
      m[call.methodName] = [];
    }
    m[call.methodName].push(call);
    return m;
  }, {} as { [key: string]: any[] });

  // const openrpcMethods = options.openrpcDocument.methods.length;

  const failedMethods = Object.keys(failedCallsByMethod);

  // //take into account failed methods
  // const missingMethods: string[] = options.openrpcDocument.methods
  //   .map(({ name }) => name)
  //   .filter((methodName) => !passingMethods.includes(methodName))
  //   .filter((methodName) => !failedMethods.includes(methodName));
  return {
    passing: passingMethods,
    failing: failedMethods,
    missing: [],
  };
};

export const getPassingFailed = (report: any) => {
  const passing = report.filter((item: any) => item.valid === true);
  const failing = report.filter((item: any) => item.valid === false);
  return { passing, failing };
};

export const navigateWithSearchAndHash = (to: string, query: string, { state = null } = {}) => {
    // calling `replaceState` allows us to set the history
  // state without creating an extra entry
  const search = new URLSearchParams(query).toString();
  history.replaceState(
    state,
    "",
    // keep the current pathname, current query string, but replace the hash
    location.pathname +
      (search ? `?${search}` : '') +
      // update location hash, this will cause `hashchange` event to fire
      // normalise the value before updating, so it's always preceeded with "#/"
      (location.hash = `#/${to.replace(/^#?\/?/, "")}`)
  );
}
