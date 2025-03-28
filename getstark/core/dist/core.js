var te = Object.defineProperty
var ne = (t, e, n) =>
  e in t
    ? te(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n })
    : (t[e] = n)
var v = (t, e, n) => (ne(t, typeof e != "symbol" ? e + "" : e, n), n),
  K = (t, e, n) => {
    if (!e.has(t)) throw TypeError("Cannot " + n)
  }
var w = (t, e, n) => (
    K(t, e, "read from private field"), n ? n.call(t) : e.get(t)
  ),
  L = (t, e, n) => {
    if (e.has(t))
      throw TypeError("Cannot add the same private member more than once")
    e instanceof WeakSet ? e.add(t) : e.set(t, n)
  },
  F = (t, e, n, r) => (
    K(t, e, "write to private field"), r ? r.call(t, n) : e.set(t, n), n
  )
var D = (t, e, n) => (K(t, e, "access private method"), n)
const generateUID = () =>
    `${Date.now()}-${Math.floor(Math.random() * 8999999999999) + 1e12}`,
  shuffle = (t) => {
    for (let e = t.length - 1; e > 0; e--) {
      const n = Math.floor(Math.random() * (e + 1))
      ;[t[e], t[n]] = [t[n], t[e]]
    }
    return t
  },
  pipe$1 =
    (...t) =>
    (e) =>
      t.reduce((n, r) => n.then(r), Promise.resolve(e))
function ensureKeysArray(t) {
  return Object.keys(t)
}
const ssrSafeWindow = typeof window < "u" ? window : null
function getBuilderId() {
  return typeof FEDERATION_BUILD_IDENTIFIER < "u"
    ? FEDERATION_BUILD_IDENTIFIER
    : ""
}
function isDebugMode$1() {
  return Boolean("")
}
function isBrowserEnv$1() {
  return typeof window < "u"
}
const LOG_CATEGORY$1 = "[ Federation Runtime ]"
function assert(t, e) {
  t || error(e)
}
function error(t) {
  throw t instanceof Error
    ? ((t.message = `${LOG_CATEGORY$1}: ${t.message}`), t)
    : new Error(`${LOG_CATEGORY$1}: ${t}`)
}
function warn$1(t) {
  t instanceof Error
    ? ((t.message = `${LOG_CATEGORY$1}: ${t.message}`), console.warn(t))
    : console.warn(`${LOG_CATEGORY$1}: ${t}`)
}
function addUniqueItem(t, e) {
  return t.findIndex((n) => n === e) === -1 && t.push(e), t
}
function getFMId(t) {
  return "version" in t && t.version
    ? `${t.name}:${t.version}`
    : "entry" in t && t.entry
    ? `${t.name}:${t.entry}`
    : `${t.name}`
}
function isRemoteInfoWithEntry(t) {
  return typeof t.entry < "u"
}
function isPureRemoteEntry(t) {
  return !t.entry.includes(".json") && t.entry.includes(".js")
}
function safeToString$1(t) {
  try {
    return JSON.stringify(t, null, 2)
  } catch {
    return ""
  }
}
function isObject(t) {
  return t && typeof t == "object"
}
const objectToString = Object.prototype.toString
function isPlainObject(t) {
  return objectToString.call(t) === "[object Object]"
}
function _extends$1$1() {
  return (
    (_extends$1$1 =
      Object.assign ||
      function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e]
          for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r])
        }
        return t
      }),
    _extends$1$1.apply(this, arguments)
  )
}
function _object_without_properties_loose$1(t, e) {
  if (t == null) return {}
  var n = {},
    r = Object.keys(t),
    o,
    s
  for (s = 0; s < r.length; s++)
    (o = r[s]), !(e.indexOf(o) >= 0) && (n[o] = t[o])
  return n
}
const nativeGlobal = (() => {
    try {
      return new Function("return this")()
    } catch {
      return globalThis
    }
  })(),
  Global = nativeGlobal
function definePropertyGlobalVal(t, e, n) {
  Object.defineProperty(t, e, {
    value: n,
    configurable: !1,
    writable: !0,
  })
}
function includeOwnProperty(t, e) {
  return Object.hasOwnProperty.call(t, e)
}
includeOwnProperty(globalThis, "__GLOBAL_LOADING_REMOTE_ENTRY__") ||
  definePropertyGlobalVal(globalThis, "__GLOBAL_LOADING_REMOTE_ENTRY__", {})
const globalLoading = globalThis.__GLOBAL_LOADING_REMOTE_ENTRY__
function setGlobalDefaultVal(t) {
  var e, n, r, o, s, i
  includeOwnProperty(t, "__VMOK__") &&
    !includeOwnProperty(t, "__FEDERATION__") &&
    definePropertyGlobalVal(t, "__FEDERATION__", t.__VMOK__),
    includeOwnProperty(t, "__FEDERATION__") ||
      (definePropertyGlobalVal(t, "__FEDERATION__", {
        __GLOBAL_PLUGIN__: [],
        __INSTANCES__: [],
        moduleInfo: {},
        __SHARE__: {},
        __MANIFEST_LOADING__: {},
        __PRELOADED_MAP__: /* @__PURE__ */ new Map(),
      }),
      definePropertyGlobalVal(t, "__VMOK__", t.__FEDERATION__))
  var a
  ;(a = (e = t.__FEDERATION__).__GLOBAL_PLUGIN__) != null ||
    (e.__GLOBAL_PLUGIN__ = [])
  var c
  ;(c = (n = t.__FEDERATION__).__INSTANCES__) != null || (n.__INSTANCES__ = [])
  var l
  ;(l = (r = t.__FEDERATION__).moduleInfo) != null || (r.moduleInfo = {})
  var u
  ;(u = (o = t.__FEDERATION__).__SHARE__) != null || (o.__SHARE__ = {})
  var d
  ;(d = (s = t.__FEDERATION__).__MANIFEST_LOADING__) != null ||
    (s.__MANIFEST_LOADING__ = {})
  var h
  ;(h = (i = t.__FEDERATION__).__PRELOADED_MAP__) != null ||
    (i.__PRELOADED_MAP__ = /* @__PURE__ */ new Map())
}
setGlobalDefaultVal(globalThis)
setGlobalDefaultVal(nativeGlobal)
function getGlobalFederationInstance(t, e) {
  const n = getBuilderId()
  return globalThis.__FEDERATION__.__INSTANCES__.find(
    (r) =>
      !!(
        (n && r.options.id === getBuilderId()) ||
        (r.options.name === t && !r.options.version && !e) ||
        (r.options.name === t && e && r.options.version === e)
      ),
  )
}
function setGlobalFederationInstance(t) {
  globalThis.__FEDERATION__.__INSTANCES__.push(t)
}
function getGlobalFederationConstructor() {
  return globalThis.__FEDERATION__.__DEBUG_CONSTRUCTOR__
}
function setGlobalFederationConstructor(t, e = isDebugMode$1()) {
  e &&
    ((globalThis.__FEDERATION__.__DEBUG_CONSTRUCTOR__ = t),
    (globalThis.__FEDERATION__.__DEBUG_CONSTRUCTOR_VERSION__ = "0.1.2"))
}
function getInfoWithoutType(t, e) {
  if (typeof e == "string") {
    if (t[e])
      return {
        value: t[e],
        key: e,
      }
    {
      const r = Object.keys(t)
      for (const o of r) {
        const [s, i] = o.split(":"),
          a = `${s}:${e}`,
          c = t[a]
        if (c)
          return {
            value: c,
            key: a,
          }
      }
      return {
        value: void 0,
        key: e,
      }
    }
  } else throw new Error("key must be string")
}
const getGlobalSnapshot = () => nativeGlobal.__FEDERATION__.moduleInfo,
  getTargetSnapshotInfoByModuleInfo = (t, e) => {
    const n = getFMId(t),
      r = getInfoWithoutType(e, n).value
    if (
      (r &&
        !r.version &&
        "version" in t &&
        t.version &&
        (r.version = t.version),
      r)
    )
      return r
    if ("version" in t && t.version) {
      const { version: o } = t,
        s = _object_without_properties_loose$1(t, ["version"]),
        i = getFMId(s),
        a = getInfoWithoutType(nativeGlobal.__FEDERATION__.moduleInfo, i).value
      if ((a == null ? void 0 : a.version) === o) return a
    }
  },
  getGlobalSnapshotInfoByModuleInfo = (t) =>
    getTargetSnapshotInfoByModuleInfo(
      t,
      nativeGlobal.__FEDERATION__.moduleInfo,
    ),
  setGlobalSnapshotInfoByModuleInfo = (t, e) => {
    const n = getFMId(t)
    return (
      (nativeGlobal.__FEDERATION__.moduleInfo[n] = e),
      nativeGlobal.__FEDERATION__.moduleInfo
    )
  },
  addGlobalSnapshot = (t) => (
    (nativeGlobal.__FEDERATION__.moduleInfo = _extends$1$1(
      {},
      nativeGlobal.__FEDERATION__.moduleInfo,
      t,
    )),
    () => {
      const e = Object.keys(t)
      for (const n of e) delete nativeGlobal.__FEDERATION__.moduleInfo[n]
    }
  ),
  getRemoteEntryExports = (t, e) => {
    const n = e || `__FEDERATION_${t}:custom__`,
      r = globalThis[n]
    return {
      remoteEntryKey: n,
      entryExports: r,
    }
  },
  getGlobalHostPlugins = () => nativeGlobal.__FEDERATION__.__GLOBAL_PLUGIN__,
  getPreloaded = (t) => globalThis.__FEDERATION__.__PRELOADED_MAP__.get(t),
  setPreloaded = (t) => globalThis.__FEDERATION__.__PRELOADED_MAP__.set(t, !0),
  DEFAULT_SCOPE = "default",
  DEFAULT_REMOTE_TYPE = "global",
  buildIdentifier = "[0-9A-Za-z-]+",
  build = `(?:\\+(${buildIdentifier}(?:\\.${buildIdentifier})*))`,
  numericIdentifier = "0|[1-9]\\d*",
  numericIdentifierLoose = "[0-9]+",
  nonNumericIdentifier = "\\d*[a-zA-Z-][a-zA-Z0-9-]*",
  preReleaseIdentifierLoose = `(?:${numericIdentifierLoose}|${nonNumericIdentifier})`,
  preReleaseLoose = `(?:-?(${preReleaseIdentifierLoose}(?:\\.${preReleaseIdentifierLoose})*))`,
  preReleaseIdentifier = `(?:${numericIdentifier}|${nonNumericIdentifier})`,
  preRelease = `(?:-(${preReleaseIdentifier}(?:\\.${preReleaseIdentifier})*))`,
  xRangeIdentifier = `${numericIdentifier}|x|X|\\*`,
  xRangePlain = `[v=\\s]*(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:${preRelease})?${build}?)?)?`,
  hyphenRange = `^\\s*(${xRangePlain})\\s+-\\s+(${xRangePlain})\\s*$`,
  mainVersionLoose = `(${numericIdentifierLoose})\\.(${numericIdentifierLoose})\\.(${numericIdentifierLoose})`,
  loosePlain = `[v=\\s]*${mainVersionLoose}${preReleaseLoose}?${build}?`,
  gtlt = "((?:<|>)?=?)",
  comparatorTrim = `(\\s*)${gtlt}\\s*(${loosePlain}|${xRangePlain})`,
  loneTilde = "(?:~>?)",
  tildeTrim = `(\\s*)${loneTilde}\\s+`,
  loneCaret = "(?:\\^)",
  caretTrim = `(\\s*)${loneCaret}\\s+`,
  star = "(<|>)?=?\\s*\\*",
  caret = `^${loneCaret}${xRangePlain}$`,
  mainVersion = `(${numericIdentifier})\\.(${numericIdentifier})\\.(${numericIdentifier})`,
  fullPlain = `v?${mainVersion}${preRelease}?${build}?`,
  tilde = `^${loneTilde}${xRangePlain}$`,
  xRange = `^${gtlt}\\s*${xRangePlain}$`,
  comparator = `^${gtlt}\\s*(${fullPlain})$|^$`,
  gte0 = "^\\s*>=\\s*0.0.0\\s*$"
function parseRegex(t) {
  return new RegExp(t)
}
function isXVersion(t) {
  return !t || t.toLowerCase() === "x" || t === "*"
}
function pipe(...t) {
  return (e) => t.reduce((n, r) => r(n), e)
}
function extractComparator(t) {
  return t.match(parseRegex(comparator))
}
function combineVersion(t, e, n, r) {
  const o = `${t}.${e}.${n}`
  return r ? `${o}-${r}` : o
}
function parseHyphen(t) {
  return t.replace(
    parseRegex(hyphenRange),
    (e, n, r, o, s, i, a, c, l, u, d, h) => (
      isXVersion(r)
        ? (n = "")
        : isXVersion(o)
        ? (n = `>=${r}.0.0`)
        : isXVersion(s)
        ? (n = `>=${r}.${o}.0`)
        : (n = `>=${n}`),
      isXVersion(l)
        ? (c = "")
        : isXVersion(u)
        ? (c = `<${Number(l) + 1}.0.0-0`)
        : isXVersion(d)
        ? (c = `<${l}.${Number(u) + 1}.0-0`)
        : h
        ? (c = `<=${l}.${u}.${d}-${h}`)
        : (c = `<=${c}`),
      `${n} ${c}`.trim()
    ),
  )
}
function parseComparatorTrim(t) {
  return t.replace(parseRegex(comparatorTrim), "$1$2$3")
}
function parseTildeTrim(t) {
  return t.replace(parseRegex(tildeTrim), "$1~")
}
function parseCaretTrim(t) {
  return t.replace(parseRegex(caretTrim), "$1^")
}
function parseCarets(t) {
  return t
    .trim()
    .split(/\s+/)
    .map((e) =>
      e.replace(parseRegex(caret), (n, r, o, s, i) =>
        isXVersion(r)
          ? ""
          : isXVersion(o)
          ? `>=${r}.0.0 <${Number(r) + 1}.0.0-0`
          : isXVersion(s)
          ? r === "0"
            ? `>=${r}.${o}.0 <${r}.${Number(o) + 1}.0-0`
            : `>=${r}.${o}.0 <${Number(r) + 1}.0.0-0`
          : i
          ? r === "0"
            ? o === "0"
              ? `>=${r}.${o}.${s}-${i} <${r}.${o}.${Number(s) + 1}-0`
              : `>=${r}.${o}.${s}-${i} <${r}.${Number(o) + 1}.0-0`
            : `>=${r}.${o}.${s}-${i} <${Number(r) + 1}.0.0-0`
          : r === "0"
          ? o === "0"
            ? `>=${r}.${o}.${s} <${r}.${o}.${Number(s) + 1}-0`
            : `>=${r}.${o}.${s} <${r}.${Number(o) + 1}.0-0`
          : `>=${r}.${o}.${s} <${Number(r) + 1}.0.0-0`,
      ),
    )
    .join(" ")
}
function parseTildes(t) {
  return t
    .trim()
    .split(/\s+/)
    .map((e) =>
      e.replace(parseRegex(tilde), (n, r, o, s, i) =>
        isXVersion(r)
          ? ""
          : isXVersion(o)
          ? `>=${r}.0.0 <${Number(r) + 1}.0.0-0`
          : isXVersion(s)
          ? `>=${r}.${o}.0 <${r}.${Number(o) + 1}.0-0`
          : i
          ? `>=${r}.${o}.${s}-${i} <${r}.${Number(o) + 1}.0-0`
          : `>=${r}.${o}.${s} <${r}.${Number(o) + 1}.0-0`,
      ),
    )
    .join(" ")
}
function parseXRanges(t) {
  return t
    .split(/\s+/)
    .map((e) =>
      e.trim().replace(parseRegex(xRange), (n, r, o, s, i, a) => {
        const c = isXVersion(o),
          l = c || isXVersion(s),
          u = l || isXVersion(i)
        return (
          r === "=" && u && (r = ""),
          (a = ""),
          c
            ? r === ">" || r === "<"
              ? "<0.0.0-0"
              : "*"
            : r && u
            ? (l && (s = 0),
              (i = 0),
              r === ">"
                ? ((r = ">="),
                  l
                    ? ((o = Number(o) + 1), (s = 0), (i = 0))
                    : ((s = Number(s) + 1), (i = 0)))
                : r === "<=" &&
                  ((r = "<"), l ? (o = Number(o) + 1) : (s = Number(s) + 1)),
              r === "<" && (a = "-0"),
              `${r + o}.${s}.${i}${a}`)
            : l
            ? `>=${o}.0.0${a} <${Number(o) + 1}.0.0-0`
            : u
            ? `>=${o}.${s}.0${a} <${o}.${Number(s) + 1}.0-0`
            : n
        )
      }),
    )
    .join(" ")
}
function parseStar(t) {
  return t.trim().replace(parseRegex(star), "")
}
function parseGTE0(t) {
  return t.trim().replace(parseRegex(gte0), "")
}
function compareAtom(t, e) {
  return (
    (t = Number(t) || t), (e = Number(e) || e), t > e ? 1 : t === e ? 0 : -1
  )
}
function comparePreRelease(t, e) {
  const { preRelease: n } = t,
    { preRelease: r } = e
  if (n === void 0 && Boolean(r)) return 1
  if (Boolean(n) && r === void 0) return -1
  if (n === void 0 && r === void 0) return 0
  for (let o = 0, s = n.length; o <= s; o++) {
    const i = n[o],
      a = r[o]
    if (i !== a)
      return i === void 0 && a === void 0
        ? 0
        : i
        ? a
          ? compareAtom(i, a)
          : -1
        : 1
  }
  return 0
}
function compareVersion(t, e) {
  return (
    compareAtom(t.major, e.major) ||
    compareAtom(t.minor, e.minor) ||
    compareAtom(t.patch, e.patch) ||
    comparePreRelease(t, e)
  )
}
function eq(t, e) {
  return t.version === e.version
}
function compare(t, e) {
  switch (t.operator) {
    case "":
    case "=":
      return eq(t, e)
    case ">":
      return compareVersion(t, e) < 0
    case ">=":
      return eq(t, e) || compareVersion(t, e) < 0
    case "<":
      return compareVersion(t, e) > 0
    case "<=":
      return eq(t, e) || compareVersion(t, e) > 0
    case void 0:
      return !0
    default:
      return !1
  }
}
function parseComparatorString(t) {
  return pipe(parseCarets, parseTildes, parseXRanges, parseStar)(t)
}
function parseRange(t) {
  return pipe(
    parseHyphen,
    parseComparatorTrim,
    parseTildeTrim,
    parseCaretTrim,
  )(t.trim())
    .split(/\s+/)
    .join(" ")
}
function satisfy(t, e) {
  if (!t) return !1
  const o = parseRange(e)
      .split(" ")
      .map((h) => parseComparatorString(h))
      .join(" ")
      .split(/\s+/)
      .map((h) => parseGTE0(h)),
    s = extractComparator(t)
  if (!s) return !1
  const [, i, , a, c, l, u] = s,
    d = {
      operator: i,
      version: combineVersion(a, c, l, u),
      major: a,
      minor: c,
      patch: l,
      preRelease: u == null ? void 0 : u.split("."),
    }
  for (const h of o) {
    const p = extractComparator(h)
    if (!p) return !1
    const [, m, , A, g, y, _] = p,
      M = {
        operator: m,
        version: combineVersion(A, g, y, _),
        major: A,
        minor: g,
        patch: y,
        preRelease: _ == null ? void 0 : _.split("."),
      }
    if (!compare(M, d)) return !1
  }
  return !0
}
function _extends$6() {
  return (
    (_extends$6 =
      Object.assign ||
      function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e]
          for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r])
        }
        return t
      }),
    _extends$6.apply(this, arguments)
  )
}
function formatShare(t, e) {
  let n
  return (
    "get" in t ? (n = t.get) : (n = () => Promise.resolve(t.lib)),
    _extends$6(
      {
        deps: [],
        useIn: [],
        from: e,
        loading: null,
      },
      t,
      {
        shareConfig: _extends$6(
          {
            requiredVersion: `^${t.version}`,
            singleton: !1,
            eager: !1,
            strictVersion: !1,
          },
          t.shareConfig,
        ),
        get: n,
        loaded: "lib" in t ? !0 : void 0,
        scope: Array.isArray(t.scope) ? t.scope : ["default"],
        strategy: t.strategy || "version-first",
      },
    )
  )
}
function formatShareConfigs(t, e) {
  return t
    ? Object.keys(t).reduce((n, r) => ((n[r] = formatShare(t[r], e)), n), {})
    : {}
}
function versionLt(t, e) {
  const n = (r) => {
    if (!Number.isNaN(Number(r))) {
      const s = r.split(".")
      let i = r
      for (let a = 0; a < 3 - s.length; a++) i += ".0"
      return i
    }
    return r
  }
  return !!satisfy(n(t), `<=${n(e)}`)
}
const findVersion = (t, e, n, r) => {
    const o = t[e][n],
      s =
        r ||
        function (i, a) {
          return versionLt(i, a)
        }
    return Object.keys(o).reduce(
      (i, a) => (!i || s(i, a) || i === "0" ? a : i),
      0,
    )
  },
  isLoaded = (t) => Boolean(t.loaded) || typeof t.lib == "function"
function findSingletonVersionOrderByVersion(t, e, n) {
  const r = t[e][n]
  return findVersion(t, e, n, function (s, i) {
    return !isLoaded(r[s]) && versionLt(s, i)
  })
}
function findSingletonVersionOrderByLoaded(t, e, n) {
  const r = t[e][n]
  return findVersion(t, e, n, function (s, i) {
    return isLoaded(r[i])
      ? isLoaded(r[s])
        ? Boolean(versionLt(s, i))
        : !0
      : isLoaded(r[s])
      ? !1
      : versionLt(s, i)
  })
}
function getFindShareFunction(t) {
  return t === "loaded-first"
    ? findSingletonVersionOrderByLoaded
    : findSingletonVersionOrderByVersion
}
function getRegisteredShare(t, e, n, r) {
  if (!t) return
  const { shareConfig: o, scope: s = DEFAULT_SCOPE, strategy: i } = n,
    a = Array.isArray(s) ? s : [s]
  for (const c of a)
    if (o && t[c] && t[c][e]) {
      const { requiredVersion: l } = o,
        d = getFindShareFunction(i)(t, c, e),
        h = () => {
          if (o.singleton) {
            if (typeof l == "string" && !satisfy(d, l)) {
              const A = `Version ${d} from ${
                d && t[c][e][d].from
              } of shared singleton module ${e} does not satisfy the requirement of ${
                n.from
              } which needs ${l})`
              o.strictVersion ? error(A) : warn$1(A)
            }
            return t[c][e][d]
          } else {
            if (l === !1 || l === "*" || satisfy(d, l)) return t[c][e][d]
            for (const [A, g] of Object.entries(t[c][e]))
              if (satisfy(A, l)) return g
          }
        },
        p = {
          shareScopeMap: t,
          scope: c,
          pkgName: e,
          version: d,
          GlobalFederation: Global.__FEDERATION__,
          resolver: h,
        }
      return (r.emit(p) || p).resolver()
    }
}
function getGlobalShareScope() {
  return Global.__FEDERATION__.__SHARE__
}
function _define_property$3(t, e, n) {
  return (
    e in t
      ? Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (t[e] = n),
    t
  )
}
var MANIFEST_EXT = ".json",
  BROWSER_LOG_KEY = "FEDERATION_DEBUG",
  BROWSER_LOG_VALUE = "1",
  NameTransformSymbol = {
    AT: "@",
    HYPHEN: "-",
    SLASH: "/",
  },
  _obj,
  NameTransformMap =
    ((_obj = {}),
    _define_property$3(_obj, NameTransformSymbol.AT, "scope_"),
    _define_property$3(_obj, NameTransformSymbol.HYPHEN, "_"),
    _define_property$3(_obj, NameTransformSymbol.SLASH, "__"),
    _obj),
  _obj1
;(_obj1 = {}),
  _define_property$3(
    _obj1,
    NameTransformMap[NameTransformSymbol.AT],
    NameTransformSymbol.AT,
  ),
  _define_property$3(
    _obj1,
    NameTransformMap[NameTransformSymbol.HYPHEN],
    NameTransformSymbol.HYPHEN,
  ),
  _define_property$3(
    _obj1,
    NameTransformMap[NameTransformSymbol.SLASH],
    NameTransformSymbol.SLASH,
  )
var SEPARATOR = ":"
function isBrowserEnv() {
  return typeof window < "u"
}
function isDebugMode() {
  return typeof process < "u" && process.env && process.env.FEDERATION_DEBUG
    ? Boolean(process.env.FEDERATION_DEBUG)
    : typeof FEDERATION_DEBUG < "u" && Boolean(FEDERATION_DEBUG)
}
function _array_like_to_array$2(t, e) {
  ;(e == null || e > t.length) && (e = t.length)
  for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n]
  return r
}
function _array_without_holes(t) {
  if (Array.isArray(t)) return _array_like_to_array$2(t)
}
function _class_call_check(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function")
}
function _defineProperties(t, e) {
  for (var n = 0; n < e.length; n++) {
    var r = e[n]
    ;(r.enumerable = r.enumerable || !1),
      (r.configurable = !0),
      "value" in r && (r.writable = !0),
      Object.defineProperty(t, r.key, r)
  }
}
function _create_class(t, e, n) {
  return e && _defineProperties(t.prototype, e), n && _defineProperties(t, n), t
}
function _define_property$2(t, e, n) {
  return (
    e in t
      ? Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (t[e] = n),
    t
  )
}
function _iterable_to_array$1(t) {
  if (
    (typeof Symbol < "u" && t[Symbol.iterator] != null) ||
    t["@@iterator"] != null
  )
    return Array.from(t)
}
function _non_iterable_spread() {
  throw new TypeError(
    "Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
  )
}
function _to_consumable_array(t) {
  return (
    _array_without_holes(t) ||
    _iterable_to_array$1(t) ||
    _unsupported_iterable_to_array$2(t) ||
    _non_iterable_spread()
  )
}
function _unsupported_iterable_to_array$2(t, e) {
  if (!!t) {
    if (typeof t == "string") return _array_like_to_array$2(t, e)
    var n = Object.prototype.toString.call(t).slice(8, -1)
    if (
      (n === "Object" && t.constructor && (n = t.constructor.name),
      n === "Map" || n === "Set")
    )
      return Array.from(n)
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _array_like_to_array$2(t, e)
  }
}
function safeToString(t) {
  try {
    return JSON.stringify(t, null, 2)
  } catch {
    return ""
  }
}
var DEBUG_LOG = "[ FEDERATION DEBUG ]"
function safeGetLocalStorageItem() {
  try {
    if (typeof window < "u" && window.localStorage)
      return localStorage.getItem(BROWSER_LOG_KEY) === BROWSER_LOG_VALUE
  } catch {
    return typeof document < "u"
  }
  return !1
}
var Logger = /* @__PURE__ */ (function () {
    function t(e) {
      _class_call_check(this, t),
        _define_property$2(this, "enable", !1),
        _define_property$2(this, "identifier", void 0),
        (this.identifier = e || DEBUG_LOG),
        isBrowserEnv() && safeGetLocalStorageItem()
          ? (this.enable = !0)
          : isDebugMode() && (this.enable = !0)
    }
    return (
      _create_class(t, [
        {
          key: "info",
          value: function (e, n) {
            if (this.enable) {
              var r = safeToString(n) || ""
              isBrowserEnv()
                ? console.info(
                    "%c "
                      .concat(this.identifier, ": ")
                      .concat(e, " ")
                      .concat(r),
                    "color:#3300CC",
                  )
                : console.info(
                    "\x1B[34m%s",
                    ""
                      .concat(this.identifier, ": ")
                      .concat(e, " ")
                      .concat(
                        r
                          ? `
`.concat(r)
                          : "",
                      ),
                  )
            }
          },
        },
        {
          key: "logOriginalInfo",
          value: function () {
            for (var n = arguments.length, r = new Array(n), o = 0; o < n; o++)
              r[o] = arguments[o]
            if (this.enable)
              if (isBrowserEnv()) {
                var s
                console.info(
                  "%c ".concat(this.identifier, ": OriginalInfo"),
                  "color:#3300CC",
                ),
                  (s = console).log.apply(s, _to_consumable_array(r))
              } else {
                var i
                console.info(
                  "%c ".concat(this.identifier, ": OriginalInfo"),
                  "color:#3300CC",
                ),
                  (i = console).log.apply(i, _to_consumable_array(r))
              }
          },
        },
      ]),
      t
    )
  })(),
  LOG_CATEGORY = "[ Federation Runtime ]"
new Logger()
var composeKeyWithSeparator = function () {
    for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
      n[r] = arguments[r]
    return n.length
      ? n.reduce(function (o, s) {
          return s ? (o ? "".concat(o).concat(SEPARATOR).concat(s) : s) : o
        }, "")
      : ""
  },
  getResourceUrl = function (t, e) {
    if ("getPublicPath" in t) {
      var n = new Function(t.getPublicPath)()
      return "".concat(n).concat(e)
    } else
      return "publicPath" in t
        ? "".concat(t.publicPath).concat(e)
        : (console.warn(
            "Can not get resource url, if in debug mode, please ignore",
            t,
            e,
          ),
          "")
  },
  warn = function (t) {
    console.warn("".concat(LOG_CATEGORY, ": ").concat(t))
  }
function _define_property$1(t, e, n) {
  return (
    e in t
      ? Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (t[e] = n),
    t
  )
}
function _object_spread$1(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {},
      r = Object.keys(n)
    typeof Object.getOwnPropertySymbols == "function" &&
      (r = r.concat(
        Object.getOwnPropertySymbols(n).filter(function (o) {
          return Object.getOwnPropertyDescriptor(n, o).enumerable
        }),
      )),
      r.forEach(function (o) {
        _define_property$1(t, o, n[o])
      })
  }
  return t
}
function ownKeys(t, e) {
  var n = Object.keys(t)
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t)
    e &&
      (r = r.filter(function (o) {
        return Object.getOwnPropertyDescriptor(t, o).enumerable
      })),
      n.push.apply(n, r)
  }
  return n
}
function _object_spread_props(t, e) {
  return (
    (e = e != null ? e : {}),
    Object.getOwnPropertyDescriptors
      ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(e))
      : ownKeys(Object(e)).forEach(function (n) {
          Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n))
        }),
    t
  )
}
var simpleJoinRemoteEntry = function (t, e) {
  if (!t) return e
  var n = function (o) {
      if (o === ".") return ""
      if (o.startsWith("./")) return o.replace("./", "")
      if (o.startsWith("/")) {
        var s = o.slice(1)
        return s.endsWith("/") ? s.slice(0, -1) : s
      }
      return o
    },
    r = n(t)
  return r
    ? r.endsWith("/")
      ? "".concat(r).concat(e)
      : "".concat(r, "/").concat(e)
    : e
}
function generateSnapshotFromManifest(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
    n,
    r,
    o = e.remotes,
    s = o === void 0 ? {} : o,
    i = e.overrides,
    a = i === void 0 ? {} : i,
    c = e.version,
    l,
    u = function () {
      return "publicPath" in t.metaData
        ? t.metaData.publicPath
        : t.metaData.getPublicPath
    },
    d = Object.keys(a),
    h = {}
  if (!Object.keys(s).length) {
    var p
    h =
      ((p = t.remotes) === null || p === void 0
        ? void 0
        : p.reduce(function (I, U) {
            var W,
              $ = U.federationContainerName
            return (
              d.includes($)
                ? (W = a[$])
                : "version" in U
                ? (W = U.version)
                : (W = U.entry),
              (I[$] = {
                matchedVersion: W,
              }),
              I
            )
          }, {})) || {}
  }
  Object.keys(s).forEach(function (I) {
    return (h[I] = {
      matchedVersion: d.includes(I) ? a[I] : s[I],
    })
  })
  var m = t.metaData,
    A = m.remoteEntry,
    g = A.path,
    y = A.name,
    _ = A.type,
    M = m.types,
    S = m.buildInfo.buildVersion,
    R = m.globalName,
    x = t.exposes,
    O = {
      version: c || "",
      buildVersion: S,
      globalName: R,
      remoteEntry: simpleJoinRemoteEntry(g, y),
      remoteEntryType: _,
      remoteTypes: simpleJoinRemoteEntry(M.path, M.name),
      remoteTypesZip: M.zip || "",
      remoteTypesAPI: M.api || "",
      remotesInfo: h,
      shared:
        t == null
          ? void 0
          : t.shared.map(function (I) {
              return {
                assets: I.assets,
                sharedName: I.name,
              }
            }),
      modules:
        x == null
          ? void 0
          : x.map(function (I) {
              return {
                moduleName: I.name,
                modulePath: I.path,
                assets: I.assets,
              }
            }),
    }
  if (!((n = t.metaData) === null || n === void 0) && n.prefetchInterface) {
    var T = t.metaData.prefetchInterface
    O = _object_spread_props(_object_spread$1({}, O), {
      prefetchInterface: T,
    })
  }
  if (!((r = t.metaData) === null || r === void 0) && r.prefetchEntry) {
    var N = t.metaData.prefetchEntry,
      b = N.path,
      E = N.name,
      G = N.type
    O = _object_spread_props(_object_spread$1({}, O), {
      prefetchEntry: simpleJoinRemoteEntry(b, E),
      prefetchEntryType: G,
    })
  }
  return (
    "publicPath" in t.metaData
      ? (l = _object_spread_props(_object_spread$1({}, O), {
          publicPath: u(),
        }))
      : (l = _object_spread_props(_object_spread$1({}, O), {
          getPublicPath: u(),
        })),
    l
  )
}
function isManifestProvider(t) {
  return !!("remoteEntry" in t && t.remoteEntry.includes(MANIFEST_EXT))
}
function asyncGeneratorStep$1(t, e, n, r, o, s, i) {
  try {
    var a = t[s](i),
      c = a.value
  } catch (l) {
    n(l)
    return
  }
  a.done ? e(c) : Promise.resolve(c).then(r, o)
}
function _async_to_generator$1(t) {
  return function () {
    var e = this,
      n = arguments
    return new Promise(function (r, o) {
      var s = t.apply(e, n)
      function i(c) {
        asyncGeneratorStep$1(s, r, o, i, a, "next", c)
      }
      function a(c) {
        asyncGeneratorStep$1(s, r, o, i, a, "throw", c)
      }
      i(void 0)
    })
  }
}
function _instanceof(t, e) {
  return e != null && typeof Symbol < "u" && e[Symbol.hasInstance]
    ? !!e[Symbol.hasInstance](t)
    : t instanceof e
}
function _ts_generator$1(t, e) {
  var n,
    r,
    o,
    s,
    i = {
      label: 0,
      sent: function () {
        if (o[0] & 1) throw o[1]
        return o[1]
      },
      trys: [],
      ops: [],
    }
  return (
    (s = {
      next: a(0),
      throw: a(1),
      return: a(2),
    }),
    typeof Symbol == "function" &&
      (s[Symbol.iterator] = function () {
        return this
      }),
    s
  )
  function a(l) {
    return function (u) {
      return c([l, u])
    }
  }
  function c(l) {
    if (n) throw new TypeError("Generator is already executing.")
    for (; i; )
      try {
        if (
          ((n = 1),
          r &&
            (o =
              l[0] & 2
                ? r.return
                : l[0]
                ? r.throw || ((o = r.return) && o.call(r), 0)
                : r.next) &&
            !(o = o.call(r, l[1])).done)
        )
          return o
        switch (((r = 0), o && (l = [l[0] & 2, o.value]), l[0])) {
          case 0:
          case 1:
            o = l
            break
          case 4:
            return (
              i.label++,
              {
                value: l[1],
                done: !1,
              }
            )
          case 5:
            i.label++, (r = l[1]), (l = [0])
            continue
          case 7:
            ;(l = i.ops.pop()), i.trys.pop()
            continue
          default:
            if (
              ((o = i.trys),
              !(o = o.length > 0 && o[o.length - 1]) &&
                (l[0] === 6 || l[0] === 2))
            ) {
              i = 0
              continue
            }
            if (l[0] === 3 && (!o || (l[1] > o[0] && l[1] < o[3]))) {
              i.label = l[1]
              break
            }
            if (l[0] === 6 && i.label < o[1]) {
              ;(i.label = o[1]), (o = l)
              break
            }
            if (o && i.label < o[2]) {
              ;(i.label = o[2]), i.ops.push(l)
              break
            }
            o[2] && i.ops.pop(), i.trys.pop()
            continue
        }
        l = e.call(t, i)
      } catch (u) {
        ;(l = [6, u]), (r = 0)
      } finally {
        n = o = 0
      }
    if (l[0] & 5) throw l[1]
    return {
      value: l[0] ? l[1] : void 0,
      done: !0,
    }
  }
}
function safeWrapper(t, e) {
  return _safeWrapper.apply(this, arguments)
}
function _safeWrapper() {
  return (
    (_safeWrapper = _async_to_generator$1(function (t, e) {
      var n, r
      return _ts_generator$1(this, function (o) {
        switch (o.label) {
          case 0:
            return o.trys.push([0, 2, , 3]), [4, t()]
          case 1:
            return (n = o.sent()), [2, n]
          case 2:
            return (r = o.sent()), !e && warn(r), [2]
          case 3:
            return [2]
        }
      })
    })),
    _safeWrapper.apply(this, arguments)
  )
}
function isStaticResourcesEqual(t, e) {
  var n = /^(https?:)?\/\//i,
    r = t.replace(n, "").replace(/\/$/, ""),
    o = e.replace(n, "").replace(/\/$/, "")
  return r === o
}
function createScript(t, e, n, r) {
  for (
    var o = null, s = !0, i = document.getElementsByTagName("script"), a = 0;
    a < i.length;
    a++
  ) {
    var c = i[a],
      l = c.getAttribute("src")
    if (l && isStaticResourcesEqual(l, t)) {
      ;(o = c), (s = !1)
      break
    }
  }
  if (
    !o &&
    ((o = document.createElement("script")),
    (o.type = "text/javascript"),
    (o.src = t),
    r)
  ) {
    var u = r(t)
    _instanceof(u, HTMLScriptElement) && (o = u)
  }
  n &&
    Object.keys(n).forEach(function (h) {
      o &&
        (h === "async" || h === "defer"
          ? (o[h] = n[h])
          : o.setAttribute(h, n[h]))
    })
  var d = function (h, p) {
    if (
      o &&
      ((o.onerror = null),
      (o.onload = null),
      safeWrapper(function () {
        o != null && o.parentNode && o.parentNode.removeChild(o)
      }),
      h)
    ) {
      var m = h(p)
      return e(), m
    }
    e()
  }
  return (
    (o.onerror = d.bind(null, o.onerror)),
    (o.onload = d.bind(null, o.onload)),
    {
      script: o,
      needAttach: s,
    }
  )
}
function createLink(t, e) {
  for (
    var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      r = arguments.length > 3 ? arguments[3] : void 0,
      o = null,
      s = !0,
      i = document.getElementsByTagName("link"),
      a = 0;
    a < i.length;
    a++
  ) {
    var c = i[a],
      l = c.getAttribute("href"),
      u = c.getAttribute("ref")
    if (l && isStaticResourcesEqual(l, t) && u === n.ref) {
      ;(o = c), (s = !1)
      break
    }
  }
  if (
    !o &&
    ((o = document.createElement("link")), o.setAttribute("href", t), r)
  ) {
    var d = r(t)
    _instanceof(d, HTMLLinkElement) && (o = d)
  }
  n &&
    Object.keys(n).forEach(function (p) {
      o && o.setAttribute(p, n[p])
    })
  var h = function (p, m) {
    if (
      o &&
      ((o.onerror = null),
      (o.onload = null),
      safeWrapper(function () {
        o != null && o.parentNode && o.parentNode.removeChild(o)
      }),
      p)
    ) {
      var A = p(m)
      return e(), A
    }
    e()
  }
  return (
    (o.onerror = h.bind(null, o.onerror)),
    (o.onload = h.bind(null, o.onload)),
    {
      link: o,
      needAttach: s,
    }
  )
}
function loadScript(t, e) {
  var n = e.attrs,
    r = e.createScriptHook
  return new Promise(function (o, s) {
    var i = createScript(t, o, n, r),
      a = i.script,
      c = i.needAttach
    c && document.getElementsByTagName("head")[0].appendChild(a)
  })
}
function _array_like_to_array(t, e) {
  ;(e == null || e > t.length) && (e = t.length)
  for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n]
  return r
}
function _array_with_holes(t) {
  if (Array.isArray(t)) return t
}
function asyncGeneratorStep(t, e, n, r, o, s, i) {
  try {
    var a = t[s](i),
      c = a.value
  } catch (l) {
    n(l)
    return
  }
  a.done ? e(c) : Promise.resolve(c).then(r, o)
}
function _async_to_generator(t) {
  return function () {
    var e = this,
      n = arguments
    return new Promise(function (r, o) {
      var s = t.apply(e, n)
      function i(c) {
        asyncGeneratorStep(s, r, o, i, a, "next", c)
      }
      function a(c) {
        asyncGeneratorStep(s, r, o, i, a, "throw", c)
      }
      i(void 0)
    })
  }
}
function _iterable_to_array_limit(t, e) {
  var n =
    t == null
      ? null
      : (typeof Symbol < "u" && t[Symbol.iterator]) || t["@@iterator"]
  if (n != null) {
    var r = [],
      o = !0,
      s = !1,
      i,
      a
    try {
      for (
        n = n.call(t);
        !(o = (i = n.next()).done) && (r.push(i.value), !(e && r.length === e));
        o = !0
      );
    } catch (c) {
      ;(s = !0), (a = c)
    } finally {
      try {
        !o && n.return != null && n.return()
      } finally {
        if (s) throw a
      }
    }
    return r
  }
}
function _non_iterable_rest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
  )
}
function _sliced_to_array(t, e) {
  return (
    _array_with_holes(t) ||
    _iterable_to_array_limit(t, e) ||
    _unsupported_iterable_to_array(t, e) ||
    _non_iterable_rest()
  )
}
function _unsupported_iterable_to_array(t, e) {
  if (!!t) {
    if (typeof t == "string") return _array_like_to_array(t, e)
    var n = Object.prototype.toString.call(t).slice(8, -1)
    if (
      (n === "Object" && t.constructor && (n = t.constructor.name),
      n === "Map" || n === "Set")
    )
      return Array.from(n)
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _array_like_to_array(t, e)
  }
}
function _ts_generator(t, e) {
  var n,
    r,
    o,
    s,
    i = {
      label: 0,
      sent: function () {
        if (o[0] & 1) throw o[1]
        return o[1]
      },
      trys: [],
      ops: [],
    }
  return (
    (s = {
      next: a(0),
      throw: a(1),
      return: a(2),
    }),
    typeof Symbol == "function" &&
      (s[Symbol.iterator] = function () {
        return this
      }),
    s
  )
  function a(l) {
    return function (u) {
      return c([l, u])
    }
  }
  function c(l) {
    if (n) throw new TypeError("Generator is already executing.")
    for (; i; )
      try {
        if (
          ((n = 1),
          r &&
            (o =
              l[0] & 2
                ? r.return
                : l[0]
                ? r.throw || ((o = r.return) && o.call(r), 0)
                : r.next) &&
            !(o = o.call(r, l[1])).done)
        )
          return o
        switch (((r = 0), o && (l = [l[0] & 2, o.value]), l[0])) {
          case 0:
          case 1:
            o = l
            break
          case 4:
            return (
              i.label++,
              {
                value: l[1],
                done: !1,
              }
            )
          case 5:
            i.label++, (r = l[1]), (l = [0])
            continue
          case 7:
            ;(l = i.ops.pop()), i.trys.pop()
            continue
          default:
            if (
              ((o = i.trys),
              !(o = o.length > 0 && o[o.length - 1]) &&
                (l[0] === 6 || l[0] === 2))
            ) {
              i = 0
              continue
            }
            if (l[0] === 3 && (!o || (l[1] > o[0] && l[1] < o[3]))) {
              i.label = l[1]
              break
            }
            if (l[0] === 6 && i.label < o[1]) {
              ;(i.label = o[1]), (o = l)
              break
            }
            if (o && i.label < o[2]) {
              ;(i.label = o[2]), i.ops.push(l)
              break
            }
            o[2] && i.ops.pop(), i.trys.pop()
            continue
        }
        l = e.call(t, i)
      } catch (u) {
        ;(l = [6, u]), (r = 0)
      } finally {
        n = o = 0
      }
    if (l[0] & 5) throw l[1]
    return {
      value: l[0] ? l[1] : void 0,
      done: !0,
    }
  }
}
function importNodeModule(t) {
  if (!t) throw new Error("import specifier is required")
  var e = new Function("name", "return import(name)")
  return e(t)
    .then(function (n) {
      return n.default
    })
    .catch(function (n) {
      throw (console.error("Error importing module ".concat(t, ":"), n), n)
    })
}
function createScriptNode(url, cb, attrs, createScriptHook) {
  if (createScriptHook) {
    var hookResult = createScriptHook(url)
    hookResult &&
      typeof hookResult == "object" &&
      "url" in hookResult &&
      (url = hookResult.url)
  }
  var urlObj
  try {
    urlObj = new URL(url)
  } catch (t) {
    console.error("Error constructing URL:", t),
      cb(new Error("Invalid URL: ".concat(t)))
    return
  }
  var getFetch = (function () {
    var t = _async_to_generator(function () {
      var e
      return _ts_generator(this, function (n) {
        switch (n.label) {
          case 0:
            return typeof fetch > "u"
              ? [4, importNodeModule("node-fetch")]
              : [3, 2]
          case 1:
            return (e = n.sent()), [2, (e == null ? void 0 : e.default) || e]
          case 2:
            return [2, fetch]
          case 3:
            return [2]
        }
      })
    })
    return function () {
      return t.apply(this, arguments)
    }
  })()
  console.log("fetching", urlObj.href),
    getFetch().then(function (f) {
      f(urlObj.href)
        .then(function (t) {
          return t.text()
        })
        .then(
          (function () {
            var _ref = _async_to_generator(function (data) {
              var _ref,
                path,
                vm,
                scriptContext,
                urlDirname,
                filename,
                script,
                exportedInterface,
                container
              return _ts_generator(this, function (_state) {
                switch (_state.label) {
                  case 0:
                    return [
                      4,
                      Promise.all([
                        importNodeModule("path"),
                        importNodeModule("vm"),
                      ]),
                    ]
                  case 1:
                    ;(_ref = _sliced_to_array.apply(void 0, [
                      _state.sent(),
                      2,
                    ])),
                      (path = _ref[0]),
                      (vm = _ref[1]),
                      (scriptContext = {
                        exports: {},
                        module: {
                          exports: {},
                        },
                      }),
                      (urlDirname = urlObj.pathname
                        .split("/")
                        .slice(0, -1)
                        .join("/")),
                      (filename = path.basename(urlObj.pathname))
                    try {
                      if (
                        ((script = new vm.Script(
                          "(function(exports, module, require, __dirname, __filename) {".concat(
                            data,
                            `
})`,
                          ),
                          filename,
                        )),
                        script.runInThisContext()(
                          scriptContext.exports,
                          scriptContext.module,
                          eval("require"),
                          urlDirname,
                          filename,
                        ),
                        (exportedInterface =
                          scriptContext.module.exports ||
                          scriptContext.exports),
                        attrs && exportedInterface && attrs.globalName)
                      )
                        return (
                          (container =
                            exportedInterface[attrs.globalName] ||
                            exportedInterface),
                          cb(void 0, container),
                          [2]
                        )
                      cb(void 0, exportedInterface)
                    } catch (t) {
                      cb(new Error("Script execution error: ".concat(t)))
                    }
                    return [2]
                }
              })
            })
            return function (t) {
              return _ref.apply(this, arguments)
            }
          })(),
        )
        .catch(function (t) {
          cb(t)
        })
    })
}
function loadScriptNode(t, e) {
  return new Promise(function (n, r) {
    createScriptNode(
      t,
      function (o, s) {
        if (o) r(o)
        else {
          var i,
            a,
            c =
              (e == null || (i = e.attrs) === null || i === void 0
                ? void 0
                : i.globalName) ||
              "__FEDERATION_".concat(
                e == null || (a = e.attrs) === null || a === void 0
                  ? void 0
                  : a.name,
                ":custom__",
              ),
            l = (globalThis[c] = s)
          n(l)
        }
      },
      e.attrs,
      e.createScriptHook,
    )
  })
}
function matchRemoteWithNameAndExpose(t, e) {
  for (const n of t) {
    const r = e.startsWith(n.name)
    let o = e.replace(n.name, "")
    if (r) {
      if (o.startsWith("/")) {
        const a = n.name
        return (
          (o = `.${o}`),
          {
            pkgNameOrAlias: a,
            expose: o,
            remote: n,
          }
        )
      } else if (o === "")
        return {
          pkgNameOrAlias: n.name,
          expose: ".",
          remote: n,
        }
    }
    const s = n.alias && e.startsWith(n.alias)
    let i = n.alias && e.replace(n.alias, "")
    if (n.alias && s) {
      if (i && i.startsWith("/")) {
        const a = n.alias
        return (
          (i = `.${i}`),
          {
            pkgNameOrAlias: a,
            expose: i,
            remote: n,
          }
        )
      } else if (i === "")
        return {
          pkgNameOrAlias: n.alias,
          expose: ".",
          remote: n,
        }
    }
  }
}
function matchRemote(t, e) {
  for (const n of t) if (e === n.name || (n.alias && e === n.alias)) return n
}
function registerPlugins(t, e) {
  const n = getGlobalHostPlugins()
  n.length > 0 &&
    n.forEach((r) => {
      t != null && t.find((o) => o.name !== r.name) && t.push(r)
    }),
    t &&
      t.length > 0 &&
      t.forEach((r) => {
        e.forEach((o) => {
          o.applyPlugin(r)
        })
      })
}
function _extends$5() {
  return (
    (_extends$5 =
      Object.assign ||
      function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e]
          for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r])
        }
        return t
      }),
    _extends$5.apply(this, arguments)
  )
}
async function loadEsmEntry({ entry: t, remoteEntryExports: e }) {
  return new Promise((n, r) => {
    try {
      e
        ? n(e)
        : new Function(
            "callbacks",
            `import("${t}").then(callbacks[0]).catch(callbacks[1])`,
          )([n, r])
    } catch (o) {
      r(o)
    }
  })
}
async function loadEntryScript({
  name: t,
  globalName: e,
  entry: n,
  createScriptHook: r,
}) {
  const { entryExports: o } = getRemoteEntryExports(t, e)
  return (
    o ||
    (typeof document > "u"
      ? loadScriptNode(n, {
          attrs: {
            name: t,
            globalName: e,
          },
          createScriptHook: r,
        })
          .then(() => {
            const { remoteEntryKey: s, entryExports: i } =
              getRemoteEntryExports(t, e)
            return (
              assert(
                i,
                `
        Unable to use the ${t}'s '${n}' URL with ${s}'s globalName to get remoteEntry exports.
        Possible reasons could be:

        1. '${n}' is not the correct URL, or the remoteEntry resource or name is incorrect.

        2. ${s} cannot be used to get remoteEntry exports in the window object.
      `,
              ),
              i
            )
          })
          .catch((s) => s)
      : loadScript(n, {
          attrs: {},
          createScriptHook: r,
        })
          .then(() => {
            const { remoteEntryKey: s, entryExports: i } =
              getRemoteEntryExports(t, e)
            return (
              assert(
                i,
                `
      Unable to use the ${t}'s '${n}' URL with ${s}'s globalName to get remoteEntry exports.
      Possible reasons could be:

      1. '${n}' is not the correct URL, or the remoteEntry resource or name is incorrect.

      2. ${s} cannot be used to get remoteEntry exports in the window object.
    `,
              ),
              i
            )
          })
          .catch((s) => s))
  )
}
function getRemoteEntryUniqueKey(t) {
  const { entry: e, name: n } = t
  return composeKeyWithSeparator(n, e)
}
async function getRemoteEntry({
  remoteEntryExports: t,
  remoteInfo: e,
  createScriptHook: n,
}) {
  const { entry: r, name: o, type: s, entryGlobalName: i } = e,
    a = getRemoteEntryUniqueKey(e)
  return (
    t ||
    (globalLoading[a] ||
      (s === "esm"
        ? (globalLoading[a] = loadEsmEntry({
            entry: r,
            remoteEntryExports: t,
          }))
        : (globalLoading[a] = loadEntryScript({
            name: o,
            globalName: i,
            entry: r,
            createScriptHook: n,
          }))),
    globalLoading[a])
  )
}
function getRemoteInfo(t) {
  return _extends$5({}, t, {
    entry: "entry" in t ? t.entry : "",
    type: t.type || DEFAULT_REMOTE_TYPE,
    entryGlobalName: t.entryGlobalName || t.name,
    shareScope: t.shareScope || DEFAULT_SCOPE,
  })
}
function _extends$4() {
  return (
    (_extends$4 =
      Object.assign ||
      function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e]
          for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r])
        }
        return t
      }),
    _extends$4.apply(this, arguments)
  )
}
let Module = class {
  async getEntry() {
    if (this.remoteEntryExports) return this.remoteEntryExports
    const e = await getRemoteEntry({
      remoteInfo: this.remoteInfo,
      remoteEntryExports: this.remoteEntryExports,
      createScriptHook: (n) => {
        const r = this.host.loaderHook.lifecycle.createScript.emit({
          url: n,
        })
        if (typeof document > "u" || r instanceof HTMLScriptElement) return r
      },
    })
    return (
      assert(
        e,
        `remoteEntryExports is undefined 
 ${safeToString$1(this.remoteInfo)}`,
      ),
      (this.remoteEntryExports = e),
      this.remoteEntryExports
    )
  }
  async get(e, n) {
    const { loadFactory: r = !0 } = n || {
        loadFactory: !0,
      },
      o = await this.getEntry()
    if (!this.inited) {
      const a = this.host.shareScopeMap,
        c = this.remoteInfo.shareScope || "default"
      a[c] || (a[c] = {})
      const l = a[c],
        u = [],
        d = {
          version: this.remoteInfo.version || "",
        }
      Object.defineProperty(d, "hostId", {
        value: this.host.options.id || this.host.name,
        enumerable: !1,
      })
      const h = await this.host.hooks.lifecycle.beforeInitContainer.emit({
        shareScope: l,
        remoteEntryInitOptions: d,
        initScope: u,
        remoteInfo: this.remoteInfo,
        origin: this.host,
      })
      await o.init(h.shareScope, h.initScope, h.remoteEntryInitOptions),
        await this.host.hooks.lifecycle.initContainer.emit(
          _extends$4({}, h, {
            remoteEntryExports: o,
          }),
        )
    }
    ;(this.lib = o), (this.inited = !0)
    const s = await o.get(e)
    return (
      assert(s, `${getFMId(this.remoteInfo)} remote don't export ${e}.`),
      r ? await s() : s
    )
  }
  constructor({ remoteInfo: e, host: n }) {
    ;(this.inited = !1),
      (this.lib = void 0),
      (this.remoteInfo = e),
      (this.host = n)
  }
}
class SyncHook {
  on(e) {
    typeof e == "function" && this.listeners.add(e)
  }
  once(e) {
    const n = this
    this.on(function r(...o) {
      return n.remove(r), e.apply(null, o)
    })
  }
  emit(...e) {
    let n
    return (
      this.listeners.size > 0 &&
        this.listeners.forEach((r) => {
          n = r(...e)
        }),
      n
    )
  }
  remove(e) {
    this.listeners.delete(e)
  }
  removeAll() {
    this.listeners.clear()
  }
  constructor(e) {
    ;(this.type = ""),
      (this.listeners = /* @__PURE__ */ new Set()),
      e && (this.type = e)
  }
}
class AsyncHook extends SyncHook {
  emit(...e) {
    let n
    const r = Array.from(this.listeners)
    if (r.length > 0) {
      let o = 0
      const s = (i) =>
        i === !1
          ? !1
          : o < r.length
          ? Promise.resolve(r[o++].apply(null, e)).then(s)
          : i
      n = s()
    }
    return Promise.resolve(n)
  }
}
function checkReturnData(t, e) {
  if (!isObject(e)) return !1
  if (t !== e) {
    for (const n in t) if (!(n in e)) return !1
  }
  return !0
}
class SyncWaterfallHook extends SyncHook {
  emit(e) {
    isObject(e) ||
      error(`The data for the "${this.type}" hook should be an object.`)
    for (const n of this.listeners)
      try {
        const r = n(e)
        if (checkReturnData(e, r)) e = r
        else {
          this.onerror(
            `A plugin returned an unacceptable value for the "${this.type}" type.`,
          )
          break
        }
      } catch (r) {
        warn$1(r), this.onerror(r)
      }
    return e
  }
  constructor(e) {
    super(), (this.onerror = error), (this.type = e)
  }
}
class AsyncWaterfallHook extends SyncHook {
  emit(e) {
    isObject(e) ||
      error(`The response data for the "${this.type}" hook must be an object.`)
    const n = Array.from(this.listeners)
    if (n.length > 0) {
      let r = 0
      const o = (i) => (warn$1(i), this.onerror(i), e),
        s = (i) => {
          if (checkReturnData(e, i)) {
            if (((e = i), r < n.length))
              try {
                return Promise.resolve(n[r++](e)).then(s, o)
              } catch (a) {
                return o(a)
              }
          } else
            this.onerror(
              `A plugin returned an incorrect value for the "${this.type}" type.`,
            )
          return e
        }
      return Promise.resolve(s(e))
    }
    return Promise.resolve(e)
  }
  constructor(e) {
    super(), (this.onerror = error), (this.type = e)
  }
}
class PluginSystem {
  applyPlugin(e) {
    assert(isPlainObject(e), "Plugin configuration is invalid.")
    const n = e.name
    assert(n, "A name must be provided by the plugin."),
      this.registerPlugins[n] ||
        ((this.registerPlugins[n] = e),
        Object.keys(this.lifecycle).forEach((r) => {
          const o = e[r]
          o && this.lifecycle[r].on(o)
        }))
  }
  removePlugin(e) {
    assert(e, "A name is required.")
    const n = this.registerPlugins[e]
    assert(n, `The plugin "${e}" is not registered.`),
      Object.keys(n).forEach((r) => {
        r !== "name" && this.lifecycle[r].remove(n[r])
      })
  }
  inherit({ lifecycle: e, registerPlugins: n }) {
    Object.keys(e).forEach((r) => {
      assert(
        !this.lifecycle[r],
        `The hook "${r}" has a conflict and cannot be inherited.`,
      ),
        (this.lifecycle[r] = e[r])
    }),
      Object.keys(n).forEach((r) => {
        assert(
          !this.registerPlugins[r],
          `The plugin "${r}" has a conflict and cannot be inherited.`,
        ),
          this.applyPlugin(n[r])
      })
  }
  constructor(e) {
    ;(this.registerPlugins = {}),
      (this.lifecycle = e),
      (this.lifecycleKeys = Object.keys(e))
  }
}
function _extends$3() {
  return (
    (_extends$3 =
      Object.assign ||
      function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e]
          for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r])
        }
        return t
      }),
    _extends$3.apply(this, arguments)
  )
}
function defaultPreloadArgs(t) {
  return _extends$3(
    {
      resourceCategory: "sync",
      share: !0,
      depsRemote: !0,
      prefetchInterface: !1,
    },
    t,
  )
}
function formatPreloadArgs(t, e) {
  return e.map((n) => {
    const r = matchRemote(t, n.nameOrAlias)
    return (
      assert(
        r,
        `Unable to preload ${n.nameOrAlias} as it is not included in ${
          !r &&
          safeToString$1({
            remoteInfo: r,
            remotes: t,
          })
        }`,
      ),
      {
        remote: r,
        preloadConfig: defaultPreloadArgs(n),
      }
    )
  })
}
function normalizePreloadExposes(t) {
  return t
    ? t.map((e) =>
        e === "." ? e : e.startsWith("./") ? e.replace("./", "") : e,
      )
    : []
}
function preloadAssets(t, e, n) {
  const { cssAssets: r, jsAssetsWithoutEntry: o, entryAssets: s } = n
  if (e.options.inBrowser) {
    s.forEach((a) => {
      const { moduleInfo: c } = a,
        l = e.moduleCache.get(t.name)
      getRemoteEntry(
        l
          ? {
              remoteInfo: c,
              remoteEntryExports: l.remoteEntryExports,
              createScriptHook: (u) => {
                const d = e.loaderHook.lifecycle.createScript.emit({
                  url: u,
                })
                if (d instanceof HTMLScriptElement) return d
              },
            }
          : {
              remoteInfo: c,
              remoteEntryExports: void 0,
              createScriptHook: (u) => {
                const d = e.loaderHook.lifecycle.createScript.emit({
                  url: u,
                })
                if (d instanceof HTMLScriptElement) return d
              },
            },
      )
    })
    const i = document.createDocumentFragment()
    r.forEach((a) => {
      const { link: c, needAttach: l } = createLink(
        a,
        () => {},
        {
          rel: "preload",
          as: "style",
        },
        (u) => {
          const d = e.loaderHook.lifecycle.createLink.emit({
            url: u,
          })
          if (d instanceof HTMLLinkElement) return d
        },
      )
      l && i.appendChild(c)
    }),
      o.forEach((a) => {
        const { link: c, needAttach: l } = createLink(
          a,
          () => {},
          {
            rel: "preload",
            as: "script",
          },
          (u) => {
            const d = e.loaderHook.lifecycle.createLink.emit({
              url: u,
            })
            if (d instanceof HTMLLinkElement) return d
          },
        )
        l && document.head.appendChild(c)
      }),
      document.head.appendChild(i)
  }
}
function _extends$2() {
  return (
    (_extends$2 =
      Object.assign ||
      function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e]
          for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r])
        }
        return t
      }),
    _extends$2.apply(this, arguments)
  )
}
function assignRemoteInfo(t, e) {
  ;(!("remoteEntry" in e) || !e.remoteEntry) &&
    error(`The attribute remoteEntry of ${name} must not be undefined.`)
  const { remoteEntry: n } = e,
    r = getResourceUrl(e, n)
  ;(t.type = e.remoteEntryType),
    (t.entryGlobalName = e.globalName),
    (t.entry = r),
    (t.version = e.version),
    (t.buildVersion = e.buildVersion)
}
function snapshotPlugin() {
  return {
    name: "snapshot-plugin",
    async afterResolve(t) {
      const {
        remote: e,
        pkgNameOrAlias: n,
        expose: r,
        origin: o,
        remoteInfo: s,
      } = t
      if (!isRemoteInfoWithEntry(e) || !isPureRemoteEntry(e)) {
        const { remoteSnapshot: i, globalSnapshot: a } =
          await o.snapshotHandler.loadRemoteSnapshotInfo(e)
        assignRemoteInfo(s, i)
        const c = {
            remote: e,
            preloadConfig: {
              nameOrAlias: n,
              exposes: [r],
              resourceCategory: "sync",
              share: !1,
              depsRemote: !1,
            },
          },
          l = await o.hooks.lifecycle.generatePreloadAssets.emit({
            origin: o,
            preloadOptions: c,
            remoteInfo: s,
            remote: e,
            remoteSnapshot: i,
            globalSnapshot: a,
          })
        return (
          l && preloadAssets(s, o, l),
          _extends$2({}, t, {
            remoteSnapshot: i,
          })
        )
      }
      return t
    },
  }
}
function splitId(t) {
  const e = t.split(":")
  return e.length === 1
    ? {
        name: e[0],
        version: void 0,
      }
    : e.length === 2
    ? {
        name: e[0],
        version: e[1],
      }
    : {
        name: e[1],
        version: e[2],
      }
}
function traverseModuleInfo(t, e, n, r, o = {}, s) {
  const i = getFMId(e),
    { value: a } = getInfoWithoutType(t, i),
    c = s || a
  if (c && !isManifestProvider(c) && (n(c, e, r), c.remotesInfo)) {
    const l = Object.keys(c.remotesInfo)
    for (const u of l) {
      if (o[u]) continue
      o[u] = !0
      const d = splitId(u),
        h = c.remotesInfo[u]
      traverseModuleInfo(
        t,
        {
          name: d.name,
          version: h.matchedVersion,
        },
        n,
        !1,
        o,
        void 0,
      )
    }
  }
}
function generatePreloadAssets(t, e, n, r, o) {
  const s = [],
    i = [],
    a = [],
    c = /* @__PURE__ */ new Set(),
    l = /* @__PURE__ */ new Set(),
    { options: u } = t,
    { preloadConfig: d } = e,
    { depsRemote: h } = d
  traverseModuleInfo(
    r,
    n,
    (g, y, _) => {
      let M
      if (_) M = d
      else if (Array.isArray(h)) {
        const N = h.find(
          (b) => b.nameOrAlias === y.name || b.nameOrAlias === y.alias,
        )
        if (!N) return
        M = defaultPreloadArgs(N)
      } else if (h === !0) M = d
      else return
      const S = getResourceUrl(g, "remoteEntry" in g ? g.remoteEntry : "")
      S &&
        a.push({
          name: y.name,
          moduleInfo: {
            name: y.name,
            entry: S,
            type: "remoteEntryType" in g ? g.remoteEntryType : "global",
            entryGlobalName: "globalName" in g ? g.globalName : y.name,
            shareScope: "",
            version: "version" in g ? g.version : void 0,
          },
          url: S,
        })
      let R = "modules" in g ? g.modules : []
      const x = normalizePreloadExposes(M.exposes)
      if (x.length && "modules" in g) {
        var O
        R =
          g == null || (O = g.modules) == null
            ? void 0
            : O.reduce(
                (N, b) => (
                  (x == null ? void 0 : x.indexOf(b.moduleName)) !== -1 &&
                    N.push(b),
                  N
                ),
                [],
              )
      }
      function T(N) {
        const b = N.map((E) => getResourceUrl(g, E))
        return M.filter ? b.filter(M.filter) : b
      }
      if (R) {
        const N = R.length
        for (let b = 0; b < N; b++) {
          const E = R[b],
            G = `${y.name}/${E.moduleName}`
          t.hooks.lifecycle.handlePreloadModule.emit({
            id: E.moduleName === "." ? y.name : G,
            name: y.name,
            remoteSnapshot: g,
            preloadConfig: M,
            remote: y,
            origin: t,
          }),
            !getPreloaded(G) &&
              (M.resourceCategory === "all"
                ? (s.push(...T(E.assets.css.async)),
                  s.push(...T(E.assets.css.sync)),
                  i.push(...T(E.assets.js.async)),
                  i.push(...T(E.assets.js.sync)))
                : (M.resourceCategory = "sync") &&
                  (s.push(...T(E.assets.css.sync)),
                  i.push(...T(E.assets.js.sync))),
              setPreloaded(G))
        }
      }
    },
    !0,
    {},
    o,
  ),
    o.shared &&
      o.shared.forEach((g) => {
        var y
        const _ = (y = u.shared) == null ? void 0 : y[g.sharedName]
        if (!_) return
        const M = getRegisteredShare(
          t.shareScopeMap,
          g.sharedName,
          _,
          t.hooks.lifecycle.resolveShare,
        )
        M &&
          typeof M.lib == "function" &&
          (g.assets.js.sync.forEach((S) => {
            c.add(S)
          }),
          g.assets.css.sync.forEach((S) => {
            l.add(S)
          }))
      })
  const m = i.filter((g) => !c.has(g))
  return {
    cssAssets: s.filter((g) => !l.has(g)),
    jsAssetsWithoutEntry: m,
    entryAssets: a,
  }
}
const generatePreloadAssetsPlugin = function () {
  return {
    name: "generate-preload-assets-plugin",
    async generatePreloadAssets(t) {
      const {
        origin: e,
        preloadOptions: n,
        remoteInfo: r,
        remote: o,
        globalSnapshot: s,
        remoteSnapshot: i,
      } = t
      return isRemoteInfoWithEntry(o) && isPureRemoteEntry(o)
        ? {
            cssAssets: [],
            jsAssetsWithoutEntry: [],
            entryAssets: [
              {
                name: o.name,
                url: o.entry,
                moduleInfo: {
                  name: r.name,
                  entry: o.entry,
                  type: "global",
                  entryGlobalName: "",
                  shareScope: "",
                },
              },
            ],
          }
        : (assignRemoteInfo(r, i), generatePreloadAssets(e, n, r, s, i))
    },
  }
}
function _extends$1() {
  return (
    (_extends$1 =
      Object.assign ||
      function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e]
          for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r])
        }
        return t
      }),
    _extends$1.apply(this, arguments)
  )
}
class SnapshotHandler {
  async loadSnapshot(e) {
    const { options: n } = this.HostInstance,
      {
        hostGlobalSnapshot: r,
        remoteSnapshot: o,
        globalSnapshot: s,
      } = this.getGlobalRemoteInfo(e),
      { remoteSnapshot: i, globalSnapshot: a } =
        await this.hooks.lifecycle.loadSnapshot.emit({
          options: n,
          moduleInfo: e,
          hostGlobalSnapshot: r,
          remoteSnapshot: o,
          globalSnapshot: s,
        })
    return {
      remoteSnapshot: i,
      globalSnapshot: a,
    }
  }
  async loadRemoteSnapshotInfo(e) {
    const { options: n } = this.HostInstance
    await this.hooks.lifecycle.beforeLoadRemoteSnapshot.emit({
      options: n,
      moduleInfo: e,
    })
    let r = getGlobalSnapshotInfoByModuleInfo({
      name: this.HostInstance.options.name,
      version: this.HostInstance.options.version,
    })
    r ||
      ((r = {
        version: this.HostInstance.options.version || "",
        remoteEntry: "",
        remotesInfo: {},
      }),
      addGlobalSnapshot({
        [this.HostInstance.options.name]: r,
      })),
      r &&
        "remotesInfo" in r &&
        !getInfoWithoutType(r.remotesInfo, e.name).value &&
        ("version" in e || "entry" in e) &&
        (r.remotesInfo = _extends$1({}, r == null ? void 0 : r.remotesInfo, {
          [e.name]: {
            matchedVersion: "version" in e ? e.version : e.entry,
          },
        }))
    const {
        hostGlobalSnapshot: o,
        remoteSnapshot: s,
        globalSnapshot: i,
      } = this.getGlobalRemoteInfo(e),
      { remoteSnapshot: a, globalSnapshot: c } =
        await this.hooks.lifecycle.loadSnapshot.emit({
          options: n,
          moduleInfo: e,
          hostGlobalSnapshot: o,
          remoteSnapshot: s,
          globalSnapshot: i,
        })
    if (a)
      if (isManifestProvider(a)) {
        const l = await this.getManifestJson(a.remoteEntry, e, {}),
          u = setGlobalSnapshotInfoByModuleInfo(
            _extends$1({}, e, {
              entry: a.remoteEntry,
            }),
            l,
          )
        return {
          remoteSnapshot: l,
          globalSnapshot: u,
        }
      } else {
        const { remoteSnapshot: l } =
          await this.hooks.lifecycle.loadRemoteSnapshot.emit({
            options: this.HostInstance.options,
            moduleInfo: e,
            remoteSnapshot: a,
            from: "global",
          })
        return {
          remoteSnapshot: l,
          globalSnapshot: c,
        }
      }
    else if (isRemoteInfoWithEntry(e)) {
      const l = await this.getManifestJson(e.entry, e, {}),
        u = setGlobalSnapshotInfoByModuleInfo(e, l),
        { remoteSnapshot: d } =
          await this.hooks.lifecycle.loadRemoteSnapshot.emit({
            options: this.HostInstance.options,
            moduleInfo: e,
            remoteSnapshot: l,
            from: "global",
          })
      return {
        remoteSnapshot: d,
        globalSnapshot: u,
      }
    } else
      error(`
          Cannot get remoteSnapshot with the name: '${e.name}', version: '${
        e.version
      }' from __FEDERATION__.moduleInfo. The following reasons may be causing the problem:

          1. The Deploy platform did not deliver the correct data. You can use __FEDERATION__.moduleInfo to check the remoteInfo.

          2. The remote '${e.name}' version '${e.version}' is not released.

          The transformed module info: ${JSON.stringify(c)}
        `)
  }
  getGlobalRemoteInfo(e) {
    const n = getGlobalSnapshotInfoByModuleInfo({
        name: this.HostInstance.options.name,
        version: this.HostInstance.options.version,
      }),
      r =
        n &&
        "remotesInfo" in n &&
        n.remotesInfo &&
        getInfoWithoutType(n.remotesInfo, e.name).value
    return r && r.matchedVersion
      ? {
          hostGlobalSnapshot: n,
          globalSnapshot: getGlobalSnapshot(),
          remoteSnapshot: getGlobalSnapshotInfoByModuleInfo({
            name: e.name,
            version: r.matchedVersion,
          }),
        }
      : {
          hostGlobalSnapshot: void 0,
          globalSnapshot: getGlobalSnapshot(),
          remoteSnapshot: getGlobalSnapshotInfoByModuleInfo({
            name: e.name,
            version: "version" in e ? e.version : void 0,
          }),
        }
  }
  async getManifestJson(e, n, r) {
    const o = async () => {
        let i = this.manifestCache.get(e)
        if (i) return i
        try {
          let a = await this.loaderHook.lifecycle.fetch.emit(e, {})
          return (
            (!a || !(a instanceof Response)) && (a = await fetch(e, {})),
            (i = await a.json()),
            assert(
              i.metaData && i.exposes && i.shared,
              `${e} is not a federation manifest`,
            ),
            this.manifestCache.set(e, i),
            i
          )
        } catch (a) {
          error(`Failed to get manifestJson for ${n.name}. The manifest URL is ${e}. Please ensure that the manifestUrl is accessible.
          
 Error message:
          
 ${a}`)
        }
      },
      s = async () => {
        const i = await o(),
          a = generateSnapshotFromManifest(i, {
            version: e,
          }),
          { remoteSnapshot: c } =
            await this.hooks.lifecycle.loadRemoteSnapshot.emit({
              options: this.HostInstance.options,
              moduleInfo: n,
              manifestJson: i,
              remoteSnapshot: a,
              manifestUrl: e,
              from: "manifest",
            })
        return c
      }
    return (
      this.manifestLoading[e] || (this.manifestLoading[e] = s().then((i) => i)),
      this.manifestLoading[e]
    )
  }
  constructor(e) {
    ;(this.loadingHostSnapshot = null),
      (this.manifestCache = /* @__PURE__ */ new Map()),
      (this.hooks = new PluginSystem({
        beforeLoadRemoteSnapshot: new AsyncHook("beforeLoadRemoteSnapshot"),
        loadSnapshot: new AsyncWaterfallHook("loadGlobalSnapshot"),
        loadRemoteSnapshot: new AsyncWaterfallHook("loadRemoteSnapshot"),
      })),
      (this.manifestLoading = Global.__FEDERATION__.__MANIFEST_LOADING__),
      (this.HostInstance = e),
      (this.loaderHook = e.loaderHook)
  }
}
function _extends() {
  return (
    (_extends =
      Object.assign ||
      function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e]
          for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r])
        }
        return t
      }),
    _extends.apply(this, arguments)
  )
}
function _object_without_properties_loose(t, e) {
  if (t == null) return {}
  var n = {},
    r = Object.keys(t),
    o,
    s
  for (s = 0; s < r.length; s++)
    (o = r[s]), !(e.indexOf(o) >= 0) && (n[o] = t[o])
  return n
}
class FederationHost {
  _setGlobalShareScopeMap() {
    const e = getGlobalShareScope(),
      n = this.options.id || this.options.name
    n && !e[n] && (e[n] = this.shareScopeMap)
  }
  initOptions(e) {
    this.registerPlugins(e.plugins)
    const n = this.formatOptions(this.options, e)
    return (this.options = n), n
  }
  async loadShare(e, n) {
    var r
    const o = Object.assign(
      {},
      (r = this.options.shared) == null ? void 0 : r[e],
      n,
    )
    o != null &&
      o.scope &&
      (await Promise.all(
        o.scope.map(async (l) => {
          await Promise.all(this.initializeSharing(l, o.strategy))
        }),
      ))
    const s = await this.hooks.lifecycle.beforeLoadShare.emit({
        pkgName: e,
        shareInfo: o,
        shared: this.options.shared,
        origin: this,
      }),
      { shareInfo: i } = s
    assert(
      i,
      `Cannot find ${e} Share in the ${this.options.name}. Please ensure that the ${e} Share parameters have been injected`,
    )
    const a = getRegisteredShare(
        this.shareScopeMap,
        e,
        i,
        this.hooks.lifecycle.resolveShare,
      ),
      c = (l) => {
        l.useIn || (l.useIn = []), addUniqueItem(l.useIn, this.options.name)
      }
    if (a && a.lib) return c(a), a.lib
    if (a && a.loading && !a.loaded) {
      const l = await a.loading
      return (a.loaded = !0), a.lib || (a.lib = l), c(a), l
    } else if (a) {
      const u = (async () => {
        const d = await a.get()
        ;(i.lib = d), (i.loaded = !0), c(i)
        const h = getRegisteredShare(
          this.shareScopeMap,
          e,
          i,
          this.hooks.lifecycle.resolveShare,
        )
        return h && ((h.lib = d), (h.loaded = !0)), d
      })()
      return (
        this.setShared({
          pkgName: e,
          loaded: !1,
          shared: a,
          from: this.options.name,
          lib: null,
          loading: u,
        }),
        u
      )
    } else {
      if (n) return !1
      const u = (async () => {
        const d = await i.get()
        ;(i.lib = d), (i.loaded = !0), c(i)
        const h = getRegisteredShare(
          this.shareScopeMap,
          e,
          i,
          this.hooks.lifecycle.resolveShare,
        )
        return h && ((h.lib = d), (h.loaded = !0)), d
      })()
      return (
        this.setShared({
          pkgName: e,
          loaded: !1,
          shared: i,
          from: this.options.name,
          lib: null,
          loading: u,
        }),
        u
      )
    }
  }
  loadShareSync(e, n) {
    var r
    const o = Object.assign(
      {},
      (r = this.options.shared) == null ? void 0 : r[e],
      n,
    )
    o != null &&
      o.scope &&
      o.scope.forEach((a) => {
        this.initializeSharing(a, o.strategy)
      })
    const s = getRegisteredShare(
        this.shareScopeMap,
        e,
        o,
        this.hooks.lifecycle.resolveShare,
      ),
      i = (a) => {
        a.useIn || (a.useIn = []), addUniqueItem(a.useIn, this.options.name)
      }
    if (s) {
      if (typeof s.lib == "function")
        return (
          i(s),
          s.loaded ||
            ((s.loaded = !0), s.from === this.options.name && (o.loaded = !0)),
          s.lib
        )
      if (typeof s.get == "function") {
        const a = s.get()
        if (!(a instanceof Promise))
          return (
            i(s),
            this.setShared({
              pkgName: e,
              loaded: !0,
              from: this.options.name,
              lib: a,
              shared: s,
            }),
            a
          )
      }
    }
    if (o.lib) return o.loaded || (o.loaded = !0), o.lib
    if (o.get) {
      const a = o.get()
      if (a instanceof Promise)
        throw new Error(`
        The loadShareSync function was unable to load ${e}. The ${e} could not be found in ${this.options.name}.
        Possible reasons for failure: 

        1. The ${e} share was registered with the 'get' attribute, but loadShare was not used beforehand.

        2. The ${e} share was not registered with the 'lib' attribute.

      `)
      return (
        (o.lib = a),
        this.setShared({
          pkgName: e,
          loaded: !0,
          from: this.options.name,
          lib: o.lib,
          shared: o,
        }),
        o.lib
      )
    }
    throw new Error(`
        The loadShareSync function was unable to load ${e}. The ${e} could not be found in ${this.options.name}.
        Possible reasons for failure: 

        1. The ${e} share was registered with the 'get' attribute, but loadShare was not used beforehand.

        2. The ${e} share was not registered with the 'lib' attribute.

      `)
  }
  initRawContainer(e, n, r) {
    const o = getRemoteInfo({
        name: e,
        entry: n,
      }),
      s = new Module({
        host: this,
        remoteInfo: o,
      })
    return (s.remoteEntryExports = r), this.moduleCache.set(e, s), s
  }
  async _getRemoteModuleAndOptions(e) {
    const n = await this.hooks.lifecycle.beforeRequest.emit({
        id: e,
        options: this.options,
        origin: this,
      }),
      { id: r } = n,
      o = matchRemoteWithNameAndExpose(this.options.remotes, r)
    assert(
      o,
      `
        Unable to locate ${r} in ${
        this.options.name
      }. Potential reasons for failure include:

        1. ${r} was not included in the 'remotes' parameter of ${
        this.options.name || "the host"
      }.

        2. ${r} could not be found in the 'remotes' of ${
        this.options.name
      } with either 'name' or 'alias' attributes.
        3. ${r} is not online, injected, or loaded.
        4. ${r}  cannot be accessed on the expected.
        5. The 'beforeRequest' hook was provided but did not return the correct 'remoteInfo' when attempting to load ${r}.
      `,
    )
    const { remote: s } = o,
      i = getRemoteInfo(s),
      a = await this.hooks.lifecycle.afterResolve.emit(
        _extends(
          {
            id: r,
          },
          o,
          {
            options: this.options,
            origin: this,
            remoteInfo: i,
          },
        ),
      ),
      { remote: c, expose: l } = a
    assert(
      c && l,
      `The 'beforeRequest' hook was executed, but it failed to return the correct 'remote' and 'expose' values while loading ${r}.`,
    )
    let u = this.moduleCache.get(c.name)
    const d = {
      host: this,
      remoteInfo: i,
    }
    return (
      u || ((u = new Module(d)), this.moduleCache.set(c.name, u)),
      {
        module: u,
        moduleOptions: d,
        remoteMatchInfo: a,
      }
    )
  }
  async loadRemote(e, n) {
    try {
      const { loadFactory: r = !0 } = n || {
          loadFactory: !0,
        },
        {
          module: o,
          moduleOptions: s,
          remoteMatchInfo: i,
        } = await this._getRemoteModuleAndOptions(e),
        { pkgNameOrAlias: a, remote: c, expose: l, id: u } = i,
        d = await o.get(l, n),
        h = await this.hooks.lifecycle.onLoad.emit({
          id: u,
          pkgNameOrAlias: a,
          expose: l,
          exposeModule: r ? d : void 0,
          exposeModuleFactory: r ? void 0 : d,
          remote: c,
          options: s,
          moduleInstance: o,
          origin: this,
        })
      return typeof h == "function" ? h : d
    } catch (r) {
      const { from: o = "runtime" } = n || {
          from: "runtime",
        },
        s = await this.hooks.lifecycle.errorLoadRemote.emit({
          id: e,
          error: r,
          from: o,
          origin: this,
        })
      if (!s) throw r
      return s
    }
  }
  async preloadRemote(e) {
    await this.hooks.lifecycle.beforePreloadRemote.emit({
      preloadOptions: e,
      options: this.options,
      origin: this,
    })
    const n = formatPreloadArgs(this.options.remotes, e)
    await Promise.all(
      n.map(async (r) => {
        const { remote: o } = r,
          s = getRemoteInfo(o),
          { globalSnapshot: i, remoteSnapshot: a } =
            await this.snapshotHandler.loadRemoteSnapshotInfo(o),
          c = await this.hooks.lifecycle.generatePreloadAssets.emit({
            origin: this,
            preloadOptions: r,
            remote: o,
            remoteInfo: s,
            globalSnapshot: i,
            remoteSnapshot: a,
          })
        !c || preloadAssets(s, this, c)
      }),
    )
  }
  initializeSharing(e = DEFAULT_SCOPE, n) {
    const r = this.shareScopeMap,
      o = this.options.name
    r[e] || (r[e] = {})
    const s = r[e],
      i = (u, d) => {
        var h
        const { version: p, eager: m } = d
        s[u] = s[u] || {}
        const A = s[u],
          g = A[p],
          y = Boolean(
            g && (g.eager || ((h = g.shareConfig) == null ? void 0 : h.eager)),
          )
        ;(!g ||
          (g.strategy !== "loaded-first" &&
            !g.loaded &&
            (Boolean(!m) !== !y ? m : o > g.from))) &&
          (A[p] = d)
      },
      a = [],
      c = (u) => u && u.init && u.init(r[e]),
      l = async (u) => {
        const { module: d } = await this._getRemoteModuleAndOptions(u)
        if (d.getEntry) {
          const h = await d.getEntry()
          d.inited || (c(h), (d.inited = !0))
        }
      }
    return (
      Object.keys(this.options.shared).forEach((u) => {
        const d = this.options.shared[u]
        d.scope.includes(e) && i(u, d)
      }),
      n === "version-first" &&
        this.options.remotes.forEach((u) => {
          u.shareScope === e && a.push(l(u.name))
        }),
      a
    )
  }
  initShareScopeMap(e, n) {
    ;(this.shareScopeMap[e] = n),
      this.hooks.lifecycle.initContainerShareScopeMap.emit({
        shareScope: n,
        options: this.options,
        origin: this,
      })
  }
  formatOptions(e, n) {
    const r = formatShareConfigs(n.shared || {}, n.name),
      o = _extends({}, e.shared, r),
      { userOptions: s, options: i } = this.hooks.lifecycle.beforeInit.emit({
        origin: this,
        userOptions: n,
        options: e,
        shareInfo: o,
      }),
      c = (s.remotes || []).reduce(
        (h, p) => (
          this.registerRemote(p, h, {
            force: !1,
          }),
          h
        ),
        i.remotes,
      )
    Object.keys(r).forEach((h) => {
      const p = r[h]
      !getRegisteredShare(
        this.shareScopeMap,
        h,
        p,
        this.hooks.lifecycle.resolveShare,
      ) &&
        p &&
        p.lib &&
        this.setShared({
          pkgName: h,
          lib: p.lib,
          get: p.get,
          loaded: !0,
          shared: p,
          from: n.name,
        })
    })
    const u = [...i.plugins]
    s.plugins &&
      s.plugins.forEach((h) => {
        u.includes(h) || u.push(h)
      })
    const d = _extends({}, e, n, {
      plugins: u,
      remotes: c,
      shared: o,
    })
    return (
      this.hooks.lifecycle.init.emit({
        origin: this,
        options: d,
      }),
      d
    )
  }
  registerPlugins(e) {
    registerPlugins(e, [
      this.hooks,
      this.snapshotHandler.hooks,
      this.loaderHook,
    ])
  }
  setShared({
    pkgName: e,
    shared: n,
    from: r,
    lib: o,
    loading: s,
    loaded: i,
    get: a,
  }) {
    const { version: c, scope: l = "default" } = n,
      u = _object_without_properties_loose(n, ["version", "scope"])
    ;(Array.isArray(l) ? l : [l]).forEach((h) => {
      this.shareScopeMap[h] || (this.shareScopeMap[h] = {}),
        this.shareScopeMap[h][e] || (this.shareScopeMap[h][e] = {}),
        !this.shareScopeMap[h][e][c] &&
          ((this.shareScopeMap[h][e][c] = _extends(
            {
              version: c,
              scope: ["default"],
            },
            u,
            {
              lib: o,
              loaded: i,
              loading: s,
            },
          )),
          a && (this.shareScopeMap[h][e][c].get = a))
    })
  }
  removeRemote(e) {
    const { name: n } = e,
      r = this.options.remotes.findIndex((s) => s.name === n)
    r !== -1 && this.options.remotes.splice(r, 1)
    const o = this.moduleCache.get(e.name)
    if (o) {
      const s = o.remoteInfo.entryGlobalName
      globalThis[s] && delete globalThis[s]
      const i = getRemoteEntryUniqueKey(o.remoteInfo)
      globalLoading[i] && delete globalLoading[i],
        this.moduleCache.delete(e.name)
    }
  }
  registerRemote(e, n, r) {
    const o = () => {
        if (e.alias) {
          const i = n.find((a) => {
            var c
            return (
              e.alias &&
              (a.name.startsWith(e.alias) ||
                ((c = a.alias) == null ? void 0 : c.startsWith(e.alias)))
            )
          })
          assert(
            !i,
            `The alias ${e.alias} of remote ${
              e.name
            } is not allowed to be the prefix of ${i && i.name} name or alias`,
          )
        }
        "entry" in e &&
          isBrowserEnv$1() &&
          !e.entry.startsWith("http") &&
          (e.entry = new URL(e.entry, window.location.origin).href),
          e.shareScope || (e.shareScope = DEFAULT_SCOPE),
          e.type || (e.type = DEFAULT_REMOTE_TYPE)
      },
      s = n.find((i) => i.name === e.name)
    if (!s) o(), n.push(e)
    else {
      const i = [
        `The remote "${e.name}" is already registered.`,
        r != null && r.force
          ? "Hope you have known that OVERRIDE it may have some unexpected errors"
          : 'If you want to merge the remote, you can set "force: true".',
      ]
      r != null && r.force && (this.removeRemote(s), o(), n.push(e)),
        warn$1(i.join(" "))
    }
  }
  registerRemotes(e, n) {
    e.forEach((r) => {
      this.registerRemote(r, this.options.remotes, {
        force: n == null ? void 0 : n.force,
      })
    })
  }
  constructor(e) {
    ;(this.hooks = new PluginSystem({
      beforeInit: new SyncWaterfallHook("beforeInit"),
      init: new SyncHook(),
      beforeRequest: new AsyncWaterfallHook("beforeRequest"),
      afterResolve: new AsyncWaterfallHook("afterResolve"),
      beforeInitContainer: new AsyncWaterfallHook("beforeInitContainer"),
      initContainerShareScopeMap: new AsyncWaterfallHook("initContainer"),
      initContainer: new AsyncWaterfallHook("initContainer"),
      onLoad: new AsyncHook("onLoad"),
      handlePreloadModule: new SyncHook("handlePreloadModule"),
      errorLoadRemote: new AsyncHook("errorLoadRemote"),
      beforeLoadShare: new AsyncWaterfallHook("beforeLoadShare"),
      loadShare: new AsyncHook(),
      resolveShare: new SyncWaterfallHook("resolveShare"),
      beforePreloadRemote: new AsyncHook(),
      generatePreloadAssets: new AsyncHook("generatePreloadAssets"),
      afterPreloadRemote: new AsyncHook(),
    })),
      (this.version = "0.1.2"),
      (this.moduleCache = /* @__PURE__ */ new Map()),
      (this.loaderHook = new PluginSystem({
        getModuleInfo: new SyncHook(),
        createScript: new SyncHook(),
        createLink: new SyncHook(),
        fetch: new AsyncHook("fetch"),
      }))
    const n = {
      id: getBuilderId(),
      name: e.name,
      plugins: [snapshotPlugin(), generatePreloadAssetsPlugin()],
      remotes: [],
      shared: {},
      inBrowser: isBrowserEnv$1(),
    }
    ;(this.name = e.name),
      (this.options = n),
      (this.shareScopeMap = {}),
      this._setGlobalShareScopeMap(),
      (this.snapshotHandler = new SnapshotHandler(this)),
      this.registerPlugins([...n.plugins, ...(e.plugins || [])]),
      (this.options = this.formatOptions(n, e))
  }
}
let FederationInstance = null
function init(t) {
  const e = getGlobalFederationInstance(t.name, t.version)
  if (e)
    return e.initOptions(t), FederationInstance || (FederationInstance = e), e
  {
    const n = getGlobalFederationConstructor() || FederationHost
    return (
      (FederationInstance = new n(t)),
      setGlobalFederationInstance(FederationInstance),
      FederationInstance
    )
  }
}
function loadRemote(...t) {
  return (
    assert(FederationInstance, "Please call init first"),
    FederationInstance.loadRemote.apply(FederationInstance, t)
  )
}
setGlobalFederationConstructor(FederationHost)
function __awaiter(t, e, n, r) {
  function o(s) {
    return s instanceof n
      ? s
      : new n(function (i) {
          i(s)
        })
  }
  return new (n || (n = Promise))(function (s, i) {
    function a(u) {
      try {
        l(r.next(u))
      } catch (d) {
        i(d)
      }
    }
    function c(u) {
      try {
        l(r.throw(u))
      } catch (d) {
        i(d)
      }
    }
    function l(u) {
      u.done ? s(u.value) : o(u.value).then(a, c)
    }
    l((r = r.apply(t, e || [])).next())
  })
}
function __generator(t, e) {
  var n = {
      label: 0,
      sent: function () {
        if (s[0] & 1) throw s[1]
        return s[1]
      },
      trys: [],
      ops: [],
    },
    r,
    o,
    s,
    i
  return (
    (i = { next: a(0), throw: a(1), return: a(2) }),
    typeof Symbol == "function" &&
      (i[Symbol.iterator] = function () {
        return this
      }),
    i
  )
  function a(l) {
    return function (u) {
      return c([l, u])
    }
  }
  function c(l) {
    if (r) throw new TypeError("Generator is already executing.")
    for (; n; )
      try {
        if (
          ((r = 1),
          o &&
            (s =
              l[0] & 2
                ? o.return
                : l[0]
                ? o.throw || ((s = o.return) && s.call(o), 0)
                : o.next) &&
            !(s = s.call(o, l[1])).done)
        )
          return s
        switch (((o = 0), s && (l = [l[0] & 2, s.value]), l[0])) {
          case 0:
          case 1:
            s = l
            break
          case 4:
            return n.label++, { value: l[1], done: !1 }
          case 5:
            n.label++, (o = l[1]), (l = [0])
            continue
          case 7:
            ;(l = n.ops.pop()), n.trys.pop()
            continue
          default:
            if (
              ((s = n.trys),
              !(s = s.length > 0 && s[s.length - 1]) &&
                (l[0] === 6 || l[0] === 2))
            ) {
              n = 0
              continue
            }
            if (l[0] === 3 && (!s || (l[1] > s[0] && l[1] < s[3]))) {
              n.label = l[1]
              break
            }
            if (l[0] === 6 && n.label < s[1]) {
              ;(n.label = s[1]), (s = l)
              break
            }
            if (s && n.label < s[2]) {
              ;(n.label = s[2]), n.ops.push(l)
              break
            }
            s[2] && n.ops.pop(), n.trys.pop()
            continue
        }
        l = e.call(t, n)
      } catch (u) {
        ;(l = [6, u]), (o = 0)
      } finally {
        r = s = 0
      }
    if (l[0] & 5) throw l[1]
    return { value: l[0] ? l[1] : void 0, done: !0 }
  }
}
var E_CANCELED = new Error("request for lock canceled"),
  Semaphore = (function () {
    function t(e, n) {
      n === void 0 && (n = E_CANCELED),
        (this._value = e),
        (this._cancelError = n),
        (this._queue = []),
        (this._weightedWaiters = [])
    }
    return (
      (t.prototype.acquire = function (e, n) {
        var r = this
        if ((e === void 0 && (e = 1), n === void 0 && (n = 0), e <= 0))
          throw new Error("invalid weight ".concat(e, ": must be positive"))
        return new Promise(function (o, s) {
          var i = { resolve: o, reject: s, weight: e, priority: n },
            a = findIndexFromEnd(r._queue, function (c) {
              return n <= c.priority
            })
          a === -1 && e <= r._value
            ? r._dispatchItem(i)
            : r._queue.splice(a + 1, 0, i)
        })
      }),
      (t.prototype.runExclusive = function (e) {
        return __awaiter(this, arguments, void 0, function (n, r, o) {
          var s, i, a
          return (
            r === void 0 && (r = 1),
            o === void 0 && (o = 0),
            __generator(this, function (c) {
              switch (c.label) {
                case 0:
                  return [4, this.acquire(r, o)]
                case 1:
                  ;(s = c.sent()), (i = s[0]), (a = s[1]), (c.label = 2)
                case 2:
                  return c.trys.push([2, , 4, 5]), [4, n(i)]
                case 3:
                  return [2, c.sent()]
                case 4:
                  return a(), [7]
                case 5:
                  return [2]
              }
            })
          )
        })
      }),
      (t.prototype.waitForUnlock = function (e, n) {
        var r = this
        if ((e === void 0 && (e = 1), n === void 0 && (n = 0), e <= 0))
          throw new Error("invalid weight ".concat(e, ": must be positive"))
        return this._couldLockImmediately(e, n)
          ? Promise.resolve()
          : new Promise(function (o) {
              r._weightedWaiters[e - 1] || (r._weightedWaiters[e - 1] = []),
                insertSorted(r._weightedWaiters[e - 1], {
                  resolve: o,
                  priority: n,
                })
            })
      }),
      (t.prototype.isLocked = function () {
        return this._value <= 0
      }),
      (t.prototype.getValue = function () {
        return this._value
      }),
      (t.prototype.setValue = function (e) {
        ;(this._value = e), this._dispatchQueue()
      }),
      (t.prototype.release = function (e) {
        if ((e === void 0 && (e = 1), e <= 0))
          throw new Error("invalid weight ".concat(e, ": must be positive"))
        ;(this._value += e), this._dispatchQueue()
      }),
      (t.prototype.cancel = function () {
        var e = this
        this._queue.forEach(function (n) {
          return n.reject(e._cancelError)
        }),
          (this._queue = [])
      }),
      (t.prototype._dispatchQueue = function () {
        for (
          this._drainUnlockWaiters();
          this._queue.length > 0 && this._queue[0].weight <= this._value;

        )
          this._dispatchItem(this._queue.shift()), this._drainUnlockWaiters()
      }),
      (t.prototype._dispatchItem = function (e) {
        var n = this._value
        ;(this._value -= e.weight), e.resolve([n, this._newReleaser(e.weight)])
      }),
      (t.prototype._newReleaser = function (e) {
        var n = this,
          r = !1
        return function () {
          r || ((r = !0), n.release(e))
        }
      }),
      (t.prototype._drainUnlockWaiters = function () {
        if (this._queue.length === 0)
          for (var e = this._value; e > 0; e--) {
            var n = this._weightedWaiters[e - 1]
            !n ||
              (n.forEach(function (s) {
                return s.resolve()
              }),
              (this._weightedWaiters[e - 1] = []))
          }
        else
          for (var r = this._queue[0].priority, e = this._value; e > 0; e--) {
            var n = this._weightedWaiters[e - 1]
            if (!!n) {
              var o = n.findIndex(function (a) {
                return a.priority <= r
              })
              ;(o === -1 ? n : n.splice(0, o)).forEach(function (a) {
                return a.resolve()
              })
            }
          }
      }),
      (t.prototype._couldLockImmediately = function (e, n) {
        return (
          (this._queue.length === 0 || this._queue[0].priority < n) &&
          e <= this._value
        )
      }),
      t
    )
  })()
function insertSorted(t, e) {
  var n = findIndexFromEnd(t, function (r) {
    return e.priority <= r.priority
  })
  t.splice(n + 1, 0, e)
}
function findIndexFromEnd(t, e) {
  for (var n = t.length - 1; n >= 0; n--) if (e(t[n])) return n
  return -1
}
var Mutex = (function () {
  function t(e) {
    this._semaphore = new Semaphore(1, e)
  }
  return (
    (t.prototype.acquire = function () {
      return __awaiter(this, arguments, void 0, function (e) {
        var n, r
        return (
          e === void 0 && (e = 0),
          __generator(this, function (o) {
            switch (o.label) {
              case 0:
                return [4, this._semaphore.acquire(1, e)]
              case 1:
                return (n = o.sent()), (r = n[1]), [2, r]
            }
          })
        )
      })
    }),
    (t.prototype.runExclusive = function (e, n) {
      return (
        n === void 0 && (n = 0),
        this._semaphore.runExclusive(
          function () {
            return e()
          },
          1,
          n,
        )
      )
    }),
    (t.prototype.isLocked = function () {
      return this._semaphore.isLocked()
    }),
    (t.prototype.waitForUnlock = function (e) {
      return e === void 0 && (e = 0), this._semaphore.waitForUnlock(1, e)
    }),
    (t.prototype.release = function () {
      this._semaphore.isLocked() && this._semaphore.release()
    }),
    (t.prototype.cancel = function () {
      return this._semaphore.cancel()
    }),
    t
  )
})()
function isMetaMaskProvider(t) {
  return (
    t !== null &&
    typeof t == "object" &&
    t.hasOwnProperty("isMetaMask") &&
    t.hasOwnProperty("request")
  )
}
function detectMetaMaskProvider(t, { timeout: e = 3e3 } = {}) {
  let n = !1
  return new Promise((r) => {
    const o = (s) => {
      const { info: i, provider: a } = s.detail
      ;(i.rdns === "io.metamask" || i.rdns === "io.metamask.flask") &&
        isMetaMaskProvider(a) &&
        (r(a), (n = !0))
    }
    typeof t.addEventListener == "function" &&
      t.addEventListener("eip6963:announceProvider", o),
      setTimeout(() => {
        n || r(null)
      }, e),
      typeof t.dispatchEvent == "function" &&
        t.dispatchEvent(new Event("eip6963:requestProvider"))
  })
}
async function waitForMetaMaskProvider(t, e = {}) {
  const { timeout: n = 3e3, retries: r = 0 } = e
  let o = null
  try {
    o = await detectMetaMaskProvider(t, { timeout: n })
  } catch {}
  return (
    o ||
    (r === 0
      ? null
      : ((o = await waitForMetaMaskProvider({ timeout: n, retries: r - 1 })),
        o))
  )
}
async function detectMetamaskSupport(t) {
  return await waitForMetaMaskProvider(t, { retries: 3 })
}
var Y, Z, z, Q, V, J
class MetaMaskVirtualWallet {
  constructor() {
    L(this, Y)
    L(this, z)
    L(this, V)
    v(this, "id", "metamask-snaps")
    v(this, "name", "MetaMask Snaps")
    v(
      this,
      "icon",
      "data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAxNDIgMTM3Ij4KICA8cGF0aCBmaWxsPSIjMEEwQTBBIiBkPSJtMTMxLjIxNSAxMzAuNzI3LTI5Ljk3Ni04Ljg4My0yMi42MDQgMTMuNDQ5SDYyLjg2MWwtMjIuNjE5LTEzLjQ0OS0yOS45NiA4Ljg4My05LjExLTMwLjYzIDkuMTE3LTMzLjk5Mi05LjExNy0yOC43NDIgOS4xMS0zNS42MTggNDYuODE3IDI3Ljg0N2gyNy4yOThsNDYuODE4LTI3Ljg0NyA5LjExNyAzNS42MTgtOS4xMTcgMjguNzQyIDkuMTE3IDMzLjk5Mi05LjExNyAzMC42M1oiLz4KICA8cGF0aCBmaWxsPSIjODlCMEZGIiBkPSJtMTM4LjgyOCAxMDEuMjE5LTguMzY0IDI4LjEwMy0yOC4wODgtOC4zMzUtMi4yNTctLjY2OS0zLjIxOS0uOTU2LTEzLjc4LTQuMDkyLTEuMjA0LjE1OC0uNDY2IDEuNyAxNy4wMTUgNS4wNDgtMjAuMTQ1IDExLjk5SDYzLjE5M2wtMjAuMTQ0LTExLjk5IDE3LjAwOC01LjA0LS40NjctMS43MDgtMS4xOTYtLjE1OC0xNy4wMDcgNS4wNDgtMi4yNTcuNjY5LTI4LjA4IDguMzM1LTguMzY1LTI4LjEwM0wwIDEwMC4xMjFsOS41MyAzMi4wMDYgMzAuNTctOS4wNzkgMjIuNDY5IDEzLjM3NGgxNi4zNzZsMjIuNDY4LTEzLjM3NCAzMC41NyA5LjA3OSA5LjUyMy0zMi4wMDYtMi42NzggMS4wOThaIi8+CiAgPHBhdGggZmlsbD0iI0QwNzVGRiIgZD0iTTM5LjEzIDEwMS4yMTh2MTkuNzY4bDIuMjU3LS42Njl2LTE3Ljk0OGwxNy4wMDcgMTIuOSAxLjE5Ni4xNTggMS4xMTMtMS4yNDEtMjAuMDc2LTE1LjIyNUgyLjY0N2w4LjUwOC0zMS43MjgtMi4wMzgtMS4xMDZMMCAxMDAuMTJsMi42ODUgMS4wOThIMzkuMTNabTcwLjEyOC0xNy44MjctNy4yMjEgMS43ODN2Mi4zMzJsMTAuNjM2LTIuNjMzLjA2OC0xNy42NGgtMS40OTdsLS43Ni0uNTE4LS4wNiAxNC42Ni04LjcxOC04LjIyOUg4My42MTVsLS4zNDYgMi4yNjRoMTcuNTQybDguNDQ3IDcuOTgxWiIvPgogIDxwYXRoIGZpbGw9IiNEMDc1RkYiIGQ9Ik0zOS40NzUgODcuNTA2di0yLjMzMmwtNy4yMjItMS43ODMgOC40NDgtNy45OGgxNy41MzRsLS4zNDYtMi4yNjVINDAuMjQybC0uNzc1LjMwOS04LjM4IDcuOTItLjA2LTE0LjY2LS43Ni41MTloLTEuNTA0bC4wNjggMTcuNjQgMTAuNjQ0IDIuNjMyWm05MC44NzctMjAuMjczIDguNTA4IDMxLjcyOGgtMzcuOTc5bC0yMC4wNzcgMTUuMjI1IDEuMTE0IDEuMjQxIDEuMjAzLS4xNTggMTctMTIuOXYxNy45NDhsMi4yNTcuNjY5di0xOS43NjhoMzYuNDUybDIuNjc4LTEuMDk4LTkuMTEtMzMuOTkzLTIuMDQ2IDEuMTA2WiIvPgogIDxwYXRoIGZpbGw9IiNGRjVDMTYiIGQ9Ik0yOC43NjUgNjcuMjMzaDEuNTA0bC43Ni0uNTIgMjMuMzg2LTE2LjAyMSAzLjQ4MyAyMi40Ni4zNDYgMi4yNjUgNS40OTEgMzUuNDIyIDEuOTU2LS43OWguMjAzbC05LjUwOC02MS4zNSAxLjc1Mi0xNy45NzFoMjUuMjM3TDg1LjEyIDQ4LjcybC05LjUwOCA2MS4zMjhoLjIwNGwxLjk1NS43OSA1LjQ5MS0zNS40MjIuMzQ2LTIuMjY0aC4wMDhsMy40ODMtMjIuNDYxIDIzLjM3OCAxNi4wMjIuNzYuNTI2aDE5LjExNGwyLjAzOC0xLjEwNSA5LjExLTI4LjczNUwxMzEuOTM4IDAgODQuMTIgMjguNDY0SDU3LjM5NEw5LjU2OCAwIDAgMzcuNGw5LjExIDI4LjczNSAyLjAzOCAxLjEwNWgxNy42MWwuMDA3LS4wMDdabTExMC4zOTQtMjkuOS04Ljc3IDI3LjY0M2gtMTguNDIybC0yMy45NzMtMTYuNDIgNDIuNjM1LTQ0LjU2MiA4LjUzIDMzLjMzOFpNMTI0LjY3MiA2Ljk1NyA4Ny4xNTIgNDYuMTdsLTEuNTU4LTE1Ljk1NSAzOS4wNzgtMjMuMjU4Wm0tNjguNzYgMjMuMjUtMS41NSAxNS45NjMtMzcuNTItMzkuMjIgMzkuMDcgMjMuMjV2LjAwOFpNMi4zNDcgMzcuMzMzbDguNTMtMzMuMzM4IDQyLjYzNSA0NC41NjEtMjMuOTcyIDE2LjQySDExLjExOEwyLjM0NyAzNy4zMzJaIi8+CiAgPHBhdGggZmlsbD0iI0JBRjI0QSIgZD0iTTc3LjA3IDExMC4wNDlINjQuNDQybC00Ljg1MiA1LjM3OSAyLjQxNSA4LjgwOGgxNy40ODlsMi40MTUtOC44MDgtNC44NTItNS4zNzloLjAxNVptLjcgMTEuOTNINjMuNzVsLTEuNjQtNS45NzIgMy4zMTctMy42NzloMTAuNjY2bDMuMzE3IDMuNjc5LTEuNjQgNS45NzJaTTU4LjI2IDkwLjgwN2wtLjIxMS0uNTV2LS4wMTRsLTMuNzM5LTkuNjg5SDQ0LjJsLTQuNzIzIDQuNjE5djIuMzI0bDE2LjY3NiA0LjEyMiAyLjEwNi0uODEyWm0tMTMuMTQyLTcuOTg5aDcuNjQzbDIuNCA2LjIxNC0xMy4xMDQtMy4yMzUgMy4wNTQtMi45NzhoLjAwN1ptNDAuMjI4IDguODAyIDE2LjY3Ny00LjEyMXYtMi4zMjVsLTQuNzI0LTQuNjFoLTEwLjExbC0zLjczOCA5LjY4di4wMTVsLS4yMTEuNTUgMi4xMDYuODEyWm0xNC4wOS01LjgyMi0xMy4xMDQgMy4yMzUgMi40LTYuMjJoNy42NDJsMy4wNTQgMi45ODZoLjAwN1oiLz4KPC9zdmc+Cg==",
    )
    v(this, "windowKey", "starknet_metamask")
    v(this, "provider", null)
    v(this, "swo", null)
    v(this, "lock")
    v(this, "version", "v2.0.0")
    this.lock = new Mutex()
  }
  async loadWallet(e) {
    return await D(this, z, Q).call(this, e), this
  }
  async hasSupport(e) {
    return (
      (this.provider = await detectMetamaskSupport(e)), this.provider !== null
    )
  }
  async request(e) {
    return D(this, z, Q)
      .call(this)
      .then((n) => n.request(e))
  }
  on(e, n) {
    D(this, z, Q)
      .call(this)
      .then((r) => r.on(e, n))
  }
  off(e, n) {
    D(this, z, Q)
      .call(this)
      .then((r) => r.off(e, n))
  }
}
;(Y = new WeakSet()),
  (Z = async function (e) {
    this.provider || (this.provider = await detectMetamaskSupport(e)),
      await init({
        name: "MetaMaskStarknetSnapWallet",
        remotes: [
          {
            name: "MetaMaskStarknetSnapWallet",
            alias: "MetaMaskStarknetSnapWallet",
            entry: `https://snaps.consensys.io/starknet/get-starknet/v1/remoteEntry.js?ts=${Date.now()}`,
          },
        ],
      })
    const n = await loadRemote("MetaMaskStarknetSnapWallet/index")
    if (!n) throw new Error("Failed to load MetaMask Wallet")
    return new n.MetaMaskSnapWallet(this.provider, "*")
  }),
  (z = new WeakSet()),
  (Q = async function (e = window) {
    return this.lock.runExclusive(
      async () => (
        this.swo ||
          ((this.swo = await D(this, Y, Z).call(this, e)),
          D(this, V, J).call(this)),
        this.swo
      ),
    )
  }),
  (V = new WeakSet()),
  (J = function () {
    this.swo &&
      ((this.version = this.swo.version),
      (this.name = this.swo.name),
      (this.id = this.swo.id),
      (this.icon = this.swo.icon))
  })
const metaMaskVirtualWallet = new MetaMaskVirtualWallet()
var X, q
const wallets = [
  {
    id: "argentX",
    name: "Argent X",
    icon: "data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjQwIiBoZWlnaHQ9IjM2IiB2aWV3Qm94PSIwIDAgNDAgMzYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNC43NTgyIC0zLjk3MzY0ZS0wN0gxNC42MjM4QzE0LjI4NTEgLTMuOTczNjRlLTA3IDE0LjAxMzggMC4yODExNzggMTQuMDA2NCAwLjYzMDY4M0MxMy44MDE3IDEwLjQ1NDkgOC44MjIzNCAxOS43NzkyIDAuMjUxODkzIDI2LjM4MzdDLTAuMDIwMjA0NiAyNi41OTMzIC0wLjA4MjE5NDYgMjYuOTg3MiAwLjExNjczNCAyNy4yNzA5TDYuMDQ2MjMgMzUuNzM0QzYuMjQ3OTYgMzYuMDIyIDYuNjQwOTkgMzYuMDg3IDYuOTE3NjYgMzUuODc1NEMxMi4yNzY1IDMxLjc3MjggMTYuNTg2OSAyNi44MjM2IDE5LjY5MSAyMS4zMzhDMjIuNzk1MSAyNi44MjM2IDI3LjEwNTcgMzEuNzcyOCAzMi40NjQ2IDM1Ljg3NTRDMzIuNzQxIDM2LjA4NyAzMy4xMzQxIDM2LjAyMiAzMy4zMzYxIDM1LjczNEwzOS4yNjU2IDI3LjI3MDlDMzkuNDY0MiAyNi45ODcyIDM5LjQwMjIgMjYuNTkzMyAzOS4xMzA0IDI2LjM4MzdDMzAuNTU5NyAxOS43NzkyIDI1LjU4MDQgMTAuNDU0OSAyNS4zNzU5IDAuNjMwNjgzQzI1LjM2ODUgMC4yODExNzggMjUuMDk2OSAtMy45NzM2NGUtMDcgMjQuNzU4MiAtMy45NzM2NGUtMDdaIiBmaWxsPSIjRkY4NzVCIi8+Cjwvc3ZnPgo=",
    downloads: {
      chrome:
        "https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/argent-x",
      edge: "https://microsoftedge.microsoft.com/addons/detail/argent-x/ajcicjlkibolbeaaagejfhnofogocgcj",
    },
  },
  {
    id: "braavos",
    name: "Braavos",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aAogICAgICAgIGQ9Ik02Mi43MDUgMTMuOTExNkM2Mi44MzU5IDE0LjEzMzMgNjIuNjYyMSAxNC40MDcgNjIuNDAzOSAxNC40MDdDNTcuMTgwNyAxNC40MDcgNTIuOTM0OCAxOC41NDI3IDUyLjgzNTEgMjMuNjgxN0M1MS4wNDY1IDIzLjM0NzcgNDkuMTkzMyAyMy4zMjI2IDQ3LjM2MjYgMjMuNjMxMUM0Ny4yMzYxIDE4LjUxNTYgNDMuMDAwOSAxNC40MDcgMzcuNzk0OCAxNC40MDdDMzcuNTM2NSAxNC40MDcgMzcuMzYyNSAxNC4xMzMxIDM3LjQ5MzUgMTMuOTExMkM0MC4wMjE3IDkuNjI4MDkgNDQuNzIwNCA2Ljc1IDUwLjA5OTEgNi43NUM1NS40NzgxIDYuNzUgNjAuMTc2OSA5LjYyODI2IDYyLjcwNSAxMy45MTE2WiIKICAgICAgICBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMzcyXzQwMjU5KSIgLz4KICAgIDxwYXRoCiAgICAgICAgZD0iTTc4Ljc2MDYgNDUuODcxOEM4MC4yNzI1IDQ2LjMyOTcgODEuNzAyNSA0NS4wMDU1IDgxLjE3MTQgNDMuNTIyMkM3Ni40MTM3IDMwLjIzMzQgNjEuMzkxMSAyNC44MDM5IDUwLjAyNzcgMjQuODAzOUMzOC42NDQyIDI0LjgwMzkgMjMuMjg2OCAzMC40MDcgMTguODc1NCA0My41OTEyQzE4LjM4MjQgNDUuMDY0NSAxOS44MDgzIDQ2LjM0NDYgMjEuMjk3OCA0NS44ODgxTDQ4Ljg3MiAzNy40MzgxQzQ5LjUzMzEgMzcuMjM1NSA1MC4yMzk5IDM3LjIzNDQgNTAuOTAxNyAzNy40MzQ4TDc4Ljc2MDYgNDUuODcxOFoiCiAgICAgICAgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzM3Ml80MDI1OSkiIC8+CiAgICA8cGF0aAogICAgICAgIGQ9Ik0xOC44MTMyIDQ4LjE3MDdMNDguODkzNSAzOS4wNDcyQzQ5LjU1MDYgMzguODQ3OCA1MC4yNTI0IDM4Ljg0NzMgNTAuOTA5OCAzOS4wNDU2TDgxLjE3ODEgNDguMTc1MkM4My42OTEyIDQ4LjkzMzIgODUuNDExIDUxLjI0ODMgODUuNDExIDUzLjg3MzVWODEuMjIzM0M4NS4yOTQ0IDg3Ljg5OTEgNzkuMjk3NyA5My4yNSA3Mi42MjQ1IDkzLjI1SDYxLjU0MDZDNjAuNDQ0OSA5My4yNSA1OS41NTc3IDkyLjM2MzcgNTkuNTU3NyA5MS4yNjhWODEuNjc4OUM1OS41NTc3IDc3LjkwMzEgNjEuNzkyMSA3NC40ODU1IDY1LjI0OTggNzIuOTcyOUM2OS44ODQ5IDcwLjk0NTQgNzUuMzY4MSA2OC4yMDI4IDc2LjM5OTQgNjIuNjk5MkM3Ni43MzIzIDYwLjkyMjkgNzUuNTc0MSA1OS4yMDk0IDczLjgwMjQgNTguODU3M0M2OS4zMjI2IDU3Ljk2NjcgNjQuMzU2MiA1OC4zMTA3IDYwLjE1NjQgNjAuMTg5M0M1NS4zODg3IDYyLjMyMTkgNTQuMTQxNSA2NS44Njk0IDUzLjY3OTcgNzAuNjMzN0w1My4xMjAxIDc1Ljc2NjJDNTIuOTQ5MSA3Ny4zMzQ5IDUxLjQ3ODUgNzguNTM2NiA0OS45MDE0IDc4LjUzNjZDNDguMjY5OSA3OC41MzY2IDQ3LjA0NjUgNzcuMjk0IDQ2Ljg2OTYgNzUuNjcxMkw0Ni4zMjA0IDcwLjYzMzdDNDUuOTI0OSA2Ni41NTI5IDQ1LjIwNzkgNjIuNTg4NyA0MC45ODk1IDYwLjcwMThDMzYuMTc3NiA1OC41NDk0IDMxLjM0MTkgNTcuODM0NyAyNi4xOTc2IDU4Ljg1NzNDMjQuNDI2IDU5LjIwOTQgMjMuMjY3OCA2MC45MjI5IDIzLjYwMDcgNjIuNjk5MkMyNC42NDEgNjguMjUwNyAzMC4wODEyIDcwLjkzMDUgMzQuNzUwMyA3Mi45NzI5QzM4LjIwOCA3NC40ODU1IDQwLjQ0MjQgNzcuOTAzMSA0MC40NDI0IDgxLjY3ODlWOTEuMjY2M0M0MC40NDI0IDkyLjM2MiAzOS41NTU1IDkzLjI1IDM4LjQ1OTkgOTMuMjVIMjcuMzc1NkMyMC43MDI0IDkzLjI1IDE0LjcwNTcgODcuODk5MSAxNC41ODkxIDgxLjIyMzNWNTMuODY2M0MxNC41ODkxIDUxLjI0NDYgMTYuMzA0NSA0OC45MzE2IDE4LjgxMzIgNDguMTcwN1oiCiAgICAgICAgZmlsbD0idXJsKCNwYWludDJfbGluZWFyXzM3Ml80MDI1OSkiIC8+CiAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMzcyXzQwMjU5IiB4MT0iNDkuMzA1NyIgeTE9IjIuMDc5IiB4Mj0iODAuMzYyNyIgeTI9IjkzLjY1OTciCiAgICAgICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0Y1RDQ1RSIgLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY5NjAwIiAvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzM3Ml80MDI1OSIgeDE9IjQ5LjMwNTciIHkxPSIyLjA3OSIgeDI9IjgwLjM2MjciIHkyPSI5My42NTk3IgogICAgICAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGNUQ0NUUiIC8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTYwMCIgLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQyX2xpbmVhcl8zNzJfNDAyNTkiIHgxPSI0OS4zMDU3IiB5MT0iMi4wNzkiIHgyPSI4MC4zNjI3IiB5Mj0iOTMuNjU5NyIKICAgICAgICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjRjVENDVFIiAvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjk2MDAiIC8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KPC9zdmc+",
    downloads: {
      chrome:
        "https://chrome.google.com/webstore/detail/braavos-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/braavos-wallet",
      edge: "https://microsoftedge.microsoft.com/addons/detail/braavos-wallet/hkkpjehhcnhgefhbdcgfkeegglpjchdc",
      ios: `https://link.braavos.app/dapp/${
        (X = ssrSafeWindow == null ? void 0 : ssrSafeWindow.location) == null
          ? void 0
          : X.host
      }`,
      android: `https://link.braavos.app/dapp/${
        (q = ssrSafeWindow == null ? void 0 : ssrSafeWindow.location) == null
          ? void 0
          : q.host
      }`,
    },
  },
  {
    id: metaMaskVirtualWallet.id,
    name: metaMaskVirtualWallet.name,
    icon: metaMaskVirtualWallet.icon,
    downloads: {
      chrome:
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/",
      edge: "https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US",
    },
  },
  {
    id: "okxwallet",
    name: "OKX Wallet",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJDSURBVHgB7Zq9jtpAEMfHlhEgQLiioXEkoAGECwoKxMcTRHmC5E3IoyRPkPAEkI7unJYmTgEFTYwA8a3NTKScLnCHN6c9r1e3P2llWQy7M/s1Gv1twCP0ej37dDq9x+Zut1t3t9vZjDEHIiSRSPg4ZpDL5fxkMvn1cDh8m0wmfugfO53OoFQq/crn8wxfY9EymQyrVCqMfHvScZx1p9ls3pFxXBy/bKlUipGPrVbLuQqAfsCliq3zl0H84zwtjQrOw4Mt1W63P5LvBm2d+Xz+YzqdgkqUy+WgWCy+Mc/nc282m4FqLBYL+3g8fjDxenq72WxANZbLJeA13zDX67UDioL5ybXwafMYu64Ltn3bdDweQ5R97fd7GyhBQMipx4POeEDHIu2LfDdBIGGz+hJ9CQ1ABjoA2egAZPM6AgiCAEQhsi/C4jHyPA/6/f5NG3Ks2+3CYDC4aTccDrn6ojG54MnEvG00GoVmWLIRNZ7wTCwDHYBsdACy0QHIhiuRETxlICWpMMhGZHmqS8qH6JLyGegAZKMDkI0uKf8X4SWlaZo+Pp1bRrwlJU8ZKLIvUjKh0WiQ3sRUbNVq9c5Ebew7KEo2m/1p4jJ4qAmDaqDQBzj5XyiAT4VCQezJigAU+IDU+z8vJFnGWeC+bKQV/5VZ71FV6L7PA3gg3tXrdQ+DgLhC+75Wq3no69P3MC0NFQpx2lL04Ql9gHK1bRDjsSBIvScBnDTk1WrlGIZBorIDEYJj+rhdgnQ67VmWRe0zlplXl81vcyEt0rSoYDUAAAAASUVORK5CYII=",
    downloads: {
      chrome:
        "https://chrome.google.com/webstore/detail/mcohilncbfahbmgdjkbpemcciiolgcge",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/okexwallet",
      edge: "https://microsoftedge.microsoft.com/addons/detail/%E6%AC%A7%E6%98%93-web3-%E9%92%B1%E5%8C%85/pbpjkcldjiffchgbbndmhojiacbgflha",
      safari: "https://apps.apple.com/us/app/okx-wallet/id6463797825",
    },
  },
  {
    id: "keplr",
    name: "Keplr",
    icon: "data:image/png;base64,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",
    downloads: {
      chrome:
        "https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/keplr",
      edge: "https://microsoftedge.microsoft.com/addons/detail/keplr/ocodgmmffbkkeecmadcijjhkmeohinei",
    },
  },
  {
    id: "fordefi",
    name: "Fordefi",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzEzNDk0XzY2MjU0KSI+CjxwYXRoIGQ9Ik0xMC44NzY5IDE1LjYzNzhIMS41VjE4LjM5OUMxLjUgMTkuODAxMyAyLjYzNDQ3IDIwLjkzOCA0LjAzMzkyIDIwLjkzOEg4LjI0OTkyTDEwLjg3NjkgMTUuNjM3OFoiIGZpbGw9IiM3OTk0RkYiLz4KPHBhdGggZD0iTTEuNSA5Ljc3NTUxSDE5LjA1MTZMMTcuMDEzOSAxMy44NzExSDEuNVY5Ljc3NTUxWiIgZmlsbD0iIzQ4NkRGRiIvPgo8cGF0aCBkPSJNNy42NTk5NiAzSDEuNTI0NDFWOC4wMDcwNEgyMi40NjEyVjNIMTYuMzI1NlY2LjczOTQ0SDE1LjA2MDZWM0g4LjkyNTAyVjYuNzM5NDRINy42NTk5NlYzWiIgZmlsbD0iIzVDRDFGQSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzEzNDk0XzY2MjU0Ij4KPHJlY3Qgd2lkdGg9IjIxIiBoZWlnaHQ9IjE4IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS41IDMpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
    downloads: {
      chrome:
        "https://chrome.google.com/webstore/detail/fordefi/hcmehenccjdmfbojapcbcofkgdpbnlle",
    },
  },
]
var C, j, P, H, ee, k, B
class LocalStorageWrapper {
  constructor(e) {
    L(this, H)
    L(this, k)
    L(this, C, !1)
    L(this, j, void 0)
    L(this, P, void 0)
    v(this, "value")
    F(this, P, e), D(this, k, B).call(this)
  }
  set(e) {
    return !w(this, C) && !D(this, k, B).call(this)
      ? !1
      : (this.delete(),
        (this.value = e),
        e &&
          (F(this, j, `${w(this, P)}-${generateUID()}`),
          localStorage.setItem(w(this, j), e)),
        !0)
  }
  get() {
    return D(this, H, ee).call(this), this.value
  }
  delete() {
    return !w(this, C) && !D(this, k, B).call(this)
      ? !1
      : ((this.value = null),
        w(this, j) && localStorage.removeItem(w(this, j)),
        !0)
  }
}
;(C = new WeakMap()),
  (j = new WeakMap()),
  (P = new WeakMap()),
  (H = new WeakSet()),
  (ee = function () {
    this.value && this.set(this.value)
  }),
  (k = new WeakSet()),
  (B = function () {
    try {
      !w(this, C) &&
        typeof window < "u" &&
        (F(
          this,
          j,
          Object.keys(localStorage).find((e) => e.startsWith(w(this, P))),
        ),
        F(this, C, !0),
        w(this, j) && this.set(localStorage.getItem(w(this, j))))
    } catch (e) {
      console.warn(e)
    }
    return w(this, C)
  })
function isEVMProvider(t) {
  return (
    t !== null &&
    typeof t == "object" &&
    t.hasOwnProperty("sendAsync") &&
    t.hasOwnProperty("request")
  )
}
async function detectEVMProvider(t, { timeout: e = 3e3 } = {}) {
  let n = !1,
    r = []
  return new Promise((o) => {
    const s = (i) => {
      let { info: a, provider: c } = i.detail
      a.rdns === "com.bitget.web3"
        ? (a = { ...a, name: "Bitget Wallet via Rosettanet" })
        : a.rdns === "com.okex.wallet" &&
          (a = { ...a, name: "OKX Wallet via Rosettanet" }),
        r.some((l) => l.info.rdns === a.rdns) ||
          r.push({ info: a, provider: c }),
        isEVMProvider(c) && (o(r), (n = !0))
    }
    typeof t.addEventListener == "function" &&
      t.addEventListener("eip6963:announceProvider", s),
      setTimeout(() => {
        n || o([{ provider: null, info: null }])
      }, e),
      typeof t.dispatchEvent == "function" &&
        t.dispatchEvent(new Event("eip6963:requestProvider"))
  })
}
async function waitForEVMProvider(t, e = {}) {
  const { timeout: n = 3e3, retries: r = 0 } = e
  try {
    const o = await detectEVMProvider(t, { timeout: n })
    if (o[0].provider) return o
  } catch {}
  return r === 0
    ? [{ provider: null, info: null }]
    : waitForEVMProvider(t, {
        timeout: n,
        retries: r - 1,
      })
}
async function detectEVMSupport(t) {
  return await waitForEVMProvider(t, {
    retries: 3,
  })
}
const Permission = {
  ACCOUNTS: "accounts",
}
function filterBy(t, e) {
  var n, r
  if ((n = e == null ? void 0 : e.include) != null && n.length) {
    const o = new Set(e.include)
    return t.filter((s) => o.has(s.id))
  }
  if ((r = e == null ? void 0 : e.exclude) != null && r.length) {
    const o = new Set(e.exclude)
    return t.filter((s) => !o.has(s.id))
  }
  return t
}
const filterByAuthorized = async (t) => {
    const e = await Promise.all(
      t.map(async (n) => {
        try {
          return (
            await n.request({
              type: "wallet_getPermissions",
            })
          ).includes(Permission.ACCOUNTS)
        } catch {
          return !1
        }
      }),
    )
    return t.filter((n, r) => e[r])
  },
  virtualWalletKeys = ensureKeysArray({
    id: !0,
    name: !0,
    icon: !0,
    windowKey: !0,
    loadWallet: !0,
    hasSupport: !0,
  }),
  fullWalletKeys = ensureKeysArray({
    id: !0,
    name: !0,
    version: !0,
    icon: !0,
    request: !0,
    on: !0,
    off: !0,
  }),
  evmWalletKeys = ensureKeysArray({
    sendAsync: !0,
    send: !0,
    request: !0,
  })
function createWalletGuard(t) {
  return function (n) {
    return n !== null && typeof n == "object" && t.every((r) => r in n)
  }
}
const isFullWallet = createWalletGuard(fullWalletKeys),
  isVirtualWallet = createWalletGuard(virtualWalletKeys),
  isEvmWallet = createWalletGuard(evmWalletKeys)
function isWalletObject(t) {
  try {
    return isFullWallet(t) || isVirtualWallet(t) || isEvmWallet(t)
  } catch {}
  return !1
}
function scanObjectForWallets(t, e) {
  return Object.values(
    Object.getOwnPropertyNames(t).reduce((n, r) => {
      if (r.startsWith("starknet")) {
        const o = t[r]
        e(o) && !n[o.id] && (n[o.id] = o)
      }
      return n
    }, {}),
  )
}
const sortBy = (t, e) => {
    if (e && Array.isArray(e)) {
      t.sort((r, o) => e.indexOf(r.id) - e.indexOf(o.id))
      const n = t.length - e.length
      return [...t.slice(n), ...shuffle(t.slice(0, n))]
    } else return shuffle(t)
  },
  virtualWallets = [metaMaskVirtualWallet]
function initiateVirtualWallets(t) {
  virtualWallets.forEach(async (e) => {
    e.windowKey in t || ((await e.hasSupport(t)) && (t[e.windowKey] = e))
  })
}
const virtualWalletsMap = {}
async function resolveVirtualWallet(t, e) {
  let n = virtualWalletsMap[e.id]
  return n || ((n = await e.loadWallet(t)), (virtualWalletsMap[e.id] = n)), n
}
const defaultOptions = {
  windowObject: ssrSafeWindow != null ? ssrSafeWindow : {},
  isWalletObject,
  storageFactoryImplementation: (t) => new LocalStorageWrapper(t),
}
function getStarknet(t = {}) {
  const {
      storageFactoryImplementation: e,
      windowObject: n,
      isWalletObject: r,
    } = {
      ...defaultOptions,
      ...t,
    },
    o = e("gsw-last")
  initiateVirtualWallets(n)
  let s
  async function i() {
    s = await detectEVMSupport(n)
  }
  return (
    i(),
    {
      getAvailableWallets: async (a = {}) => {
        const c = scanObjectForWallets(n, r)
        return (
          s.forEach((l) => {
            l.provider &&
              l.info &&
              c.push({
                ...l.provider,
                id: l.info.name,
                name: l.info.name,
                icon: l.info.icon,
                version: l.info.icon,
                on: l.provider.on,
                off: l.provider.off,
              })
          }),
          pipe$1(
            (l) => filterBy(l, a),
            (l) => sortBy(l, a.sort),
          )(c)
        )
      },
      getAuthorizedWallets: async (a = {}) => {
        const c = scanObjectForWallets(n, r)
        return pipe$1(
          (l) => filterByAuthorized(l),
          (l) => filterBy(l, a),
          (l) => sortBy(l, a.sort),
        )(c)
      },
      getDiscoveryWallets: async (a = {}) =>
        pipe$1(
          (c) => filterBy(c, a),
          (c) => sortBy(c, a.sort),
        )(wallets),
      getLastConnectedWallet: async () => {
        const a = o.get(),
          l = scanObjectForWallets(n, r).find((d) => d.id === a),
          [u] = await filterByAuthorized(l ? [l] : [])
        return u || (o.delete(), null)
      },
      discoverVirtualWallets: async (a = []) => {
        const c = new Set(a),
          l =
            c.size > 0
              ? virtualWallets.filter((u) => c.has(u.name) || c.has(u.id))
              : virtualWallets
        await Promise.all(
          l.map(async (u) => {
            ;(await u.hasSupport(n)) && (n[u.windowKey] = u)
          }),
        )
      },
      enable: async (a, c) => {
        let l
        if (isVirtualWallet(a)) l = await resolveVirtualWallet(n, a)
        else if (isEvmWallet(a)) {
          const h = (await detectEVMSupport(n)).find(
            ({ info: p }) => p && p.name === a.name,
          )
          if (h && h.provider) l = h.provider
          else throw new Error("Failed to connect to the selected EVM wallet")
        } else if (isFullWallet(a)) l = a
        else throw new Error("Invalid wallet object")
        isEvmWallet(l)
          ? await l.request({ method: "eth_requestAccounts" })
          : await l.request({
              type: "wallet_requestAccounts",
              params: {
                silent_mode: c == null ? void 0 : c.silent_mode,
              },
            })
        const u = await l.request({
          type: "wallet_getPermissions",
        })
        if (!(u != null && u.includes(Permission.ACCOUNTS)))
          throw new Error("Failed to connect to wallet")
        return o.set(l.id), l
      },
      disconnect: async ({ clearLastWallet: a } = {}) => {
        a && o.delete()
      },
    }
  )
}
const main = getStarknet()
export {
  main as default,
  getStarknet,
  isWalletObject,
  scanObjectForWallets,
  ssrSafeWindow,
}
