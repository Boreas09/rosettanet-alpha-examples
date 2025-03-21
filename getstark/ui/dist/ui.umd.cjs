;(function (t, e) {
  typeof exports == "object" && typeof module < "u"
    ? e(exports)
    : typeof define == "function" && define.amd
    ? define(["exports"], e)
    : ((t = typeof globalThis < "u" ? globalThis : t || self), e((t.ui = {})))
})(this, function (exports) {
  "use strict"
  function noop() {}
  function run(t) {
    return t()
  }
  function blank_object() {
    return Object.create(null)
  }
  function run_all(t) {
    t.forEach(run)
  }
  function is_function(t) {
    return typeof t == "function"
  }
  function safe_not_equal(t, e) {
    return t != t
      ? e == e
      : t !== e || (t && typeof t == "object") || typeof t == "function"
  }
  let src_url_equal_anchor
  function src_url_equal(t, e) {
    return (
      src_url_equal_anchor ||
        (src_url_equal_anchor = document.createElement("a")),
      (src_url_equal_anchor.href = e),
      t === src_url_equal_anchor.href
    )
  }
  function is_empty(t) {
    return Object.keys(t).length === 0
  }
  function null_to_empty(t) {
    return t == null ? "" : t
  }
  function append(t, e) {
    t.appendChild(e)
  }
  function append_styles(t, e, r) {
    const n = get_root_for_style(t)
    if (!n.getElementById(e)) {
      const o = element("style")
      ;(o.id = e), (o.textContent = r), append_stylesheet(n, o)
    }
  }
  function get_root_for_style(t) {
    if (!t) return document
    const e = t.getRootNode ? t.getRootNode() : t.ownerDocument
    return e && e.host ? e : t.ownerDocument
  }
  function append_stylesheet(t, e) {
    append(t.head || t, e)
  }
  function insert(t, e, r) {
    t.insertBefore(e, r || null)
  }
  function detach(t) {
    t.parentNode.removeChild(t)
  }
  function destroy_each(t, e) {
    for (let r = 0; r < t.length; r += 1) t[r] && t[r].d(e)
  }
  function element(t) {
    return document.createElement(t)
  }
  function text(t) {
    return document.createTextNode(t)
  }
  function space() {
    return text(" ")
  }
  function listen(t, e, r, n) {
    return t.addEventListener(e, r, n), () => t.removeEventListener(e, r, n)
  }
  function attr(t, e, r) {
    r == null
      ? t.removeAttribute(e)
      : t.getAttribute(e) !== r && t.setAttribute(e, r)
  }
  function children(t) {
    return Array.from(t.childNodes)
  }
  function set_data(t, e) {
    ;(e = "" + e), t.wholeText !== e && (t.data = e)
  }
  let current_component
  function set_current_component(t) {
    current_component = t
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization")
    return current_component
  }
  function onMount(t) {
    get_current_component().$$.on_mount.push(t)
  }
  const dirty_components = [],
    binding_callbacks = [],
    render_callbacks = [],
    flush_callbacks = [],
    resolved_promise = Promise.resolve()
  let update_scheduled = !1
  function schedule_update() {
    update_scheduled || ((update_scheduled = !0), resolved_promise.then(flush))
  }
  function add_render_callback(t) {
    render_callbacks.push(t)
  }
  const seen_callbacks = new Set()
  let flushidx = 0
  function flush() {
    const t = current_component
    do {
      for (; flushidx < dirty_components.length; ) {
        const e = dirty_components[flushidx]
        flushidx++, set_current_component(e), update(e.$$)
      }
      for (
        set_current_component(null), dirty_components.length = 0, flushidx = 0;
        binding_callbacks.length;

      )
        binding_callbacks.pop()()
      for (let e = 0; e < render_callbacks.length; e += 1) {
        const r = render_callbacks[e]
        seen_callbacks.has(r) || (seen_callbacks.add(r), r())
      }
      render_callbacks.length = 0
    } while (dirty_components.length)
    for (; flush_callbacks.length; ) flush_callbacks.pop()()
    ;(update_scheduled = !1), seen_callbacks.clear(), set_current_component(t)
  }
  function update(t) {
    if (t.fragment !== null) {
      t.update(), run_all(t.before_update)
      const e = t.dirty
      ;(t.dirty = [-1]),
        t.fragment && t.fragment.p(t.ctx, e),
        t.after_update.forEach(add_render_callback)
    }
  }
  const outroing = new Set()
  function transition_in(t, e) {
    t && t.i && (outroing.delete(t), t.i(e))
  }
  function mount_component(t, e, r, n) {
    const { fragment: o, on_mount: s, on_destroy: i, after_update: l } = t.$$
    o && o.m(e, r),
      n ||
        add_render_callback(() => {
          const c = s.map(run).filter(is_function)
          i ? i.push(...c) : run_all(c), (t.$$.on_mount = [])
        }),
      l.forEach(add_render_callback)
  }
  function destroy_component(t, e) {
    const r = t.$$
    r.fragment !== null &&
      (run_all(r.on_destroy),
      r.fragment && r.fragment.d(e),
      (r.on_destroy = r.fragment = null),
      (r.ctx = []))
  }
  function make_dirty(t, e) {
    t.$$.dirty[0] === -1 &&
      (dirty_components.push(t), schedule_update(), t.$$.dirty.fill(0)),
      (t.$$.dirty[(e / 31) | 0] |= 1 << e % 31)
  }
  function init$1(t, e, r, n, o, s, i, l = [-1]) {
    const c = current_component
    set_current_component(t)
    const a = (t.$$ = {
      fragment: null,
      ctx: null,
      props: s,
      update: noop,
      not_equal: o,
      bound: blank_object(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(e.context || (c ? c.$$.context : [])),
      callbacks: blank_object(),
      dirty: l,
      skip_bound: !1,
      root: e.target || c.$$.root,
    })
    i && i(a.root)
    let u = !1
    if (
      ((a.ctx = r
        ? r(t, e.props || {}, (d, m, ...p) => {
            const h = p.length ? p[0] : m
            return (
              a.ctx &&
                o(a.ctx[d], (a.ctx[d] = h)) &&
                (!a.skip_bound && a.bound[d] && a.bound[d](h),
                u && make_dirty(t, d)),
              m
            )
          })
        : []),
      a.update(),
      (u = !0),
      run_all(a.before_update),
      (a.fragment = n ? n(a.ctx) : !1),
      e.target)
    ) {
      if (e.hydrate) {
        const d = children(e.target)
        a.fragment && a.fragment.l(d), d.forEach(detach)
      } else a.fragment && a.fragment.c()
      e.intro && transition_in(t.$$.fragment),
        mount_component(t, e.target, e.anchor, e.customElement),
        flush()
    }
    set_current_component(c)
  }
  class SvelteComponent {
    $destroy() {
      destroy_component(this, 1), (this.$destroy = noop)
    }
    $on(e, r) {
      const n = this.$$.callbacks[e] || (this.$$.callbacks[e] = [])
      return (
        n.push(r),
        () => {
          const o = n.indexOf(r)
          o !== -1 && n.splice(o, 1)
        }
      )
    }
    $set(e) {
      this.$$set &&
        !is_empty(e) &&
        ((this.$$.skip_bound = !0), this.$$set(e), (this.$$.skip_bound = !1))
    }
  }
  function add_css(t) {
    append_styles(
      t,
      "svelte-1mtuslq",
      `.sr-only.svelte-1mtuslq.svelte-1mtuslq{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0}.fixed.svelte-1mtuslq.svelte-1mtuslq{position:fixed}.inset-0.svelte-1mtuslq.svelte-1mtuslq{top:0px;right:0px;bottom:0px;left:0px}.z-40.svelte-1mtuslq.svelte-1mtuslq{z-index:40}.z-50.svelte-1mtuslq.svelte-1mtuslq{z-index:50}.mx-6.svelte-1mtuslq.svelte-1mtuslq{margin-left:1.5rem;margin-right:1.5rem}.mb-4.svelte-1mtuslq.svelte-1mtuslq{margin-bottom:1rem}.flex.svelte-1mtuslq.svelte-1mtuslq{display:flex}.h-8.svelte-1mtuslq.svelte-1mtuslq{height:2rem}.w-full.svelte-1mtuslq.svelte-1mtuslq{width:100%}.w-8.svelte-1mtuslq.svelte-1mtuslq{width:2rem}.max-w-\\[500px\\].svelte-1mtuslq.svelte-1mtuslq{max-width:500px}@keyframes svelte-1mtuslq-spin{to{transform:rotate(360deg)}}.animate-spin.svelte-1mtuslq.svelte-1mtuslq{animation:svelte-1mtuslq-spin 1s linear infinite}.cursor-pointer.svelte-1mtuslq.svelte-1mtuslq{cursor:pointer}.flex-col.svelte-1mtuslq.svelte-1mtuslq{flex-direction:column}.items-center.svelte-1mtuslq.svelte-1mtuslq{align-items:center}.justify-center.svelte-1mtuslq.svelte-1mtuslq{justify-content:center}.justify-between.svelte-1mtuslq.svelte-1mtuslq{justify-content:space-between}.gap-3.svelte-1mtuslq.svelte-1mtuslq{gap:0.75rem}.rounded-md.svelte-1mtuslq.svelte-1mtuslq{border-radius:0.375rem}.rounded-full.svelte-1mtuslq.svelte-1mtuslq{border-radius:9999px}.bg-black\\/25.svelte-1mtuslq.svelte-1mtuslq{background-color:rgb(0 0 0 / 0.25)}.bg-slate-50.svelte-1mtuslq.svelte-1mtuslq{--tw-bg-opacity:1;background-color:rgb(248 250 252 / var(--tw-bg-opacity))}.bg-slate-100.svelte-1mtuslq.svelte-1mtuslq{--tw-bg-opacity:1;background-color:rgb(241 245 249 / var(--tw-bg-opacity))}.fill-neutral-600.svelte-1mtuslq.svelte-1mtuslq{fill:#525252}.p-4.svelte-1mtuslq.svelte-1mtuslq{padding:1rem}.p-3.svelte-1mtuslq.svelte-1mtuslq{padding:0.75rem}.text-center.svelte-1mtuslq.svelte-1mtuslq{text-align:center}.text-xl.svelte-1mtuslq.svelte-1mtuslq{font-size:1.25rem;line-height:1.75rem}.text-neutral-300.svelte-1mtuslq.svelte-1mtuslq{--tw-text-opacity:1;color:rgb(212 212 212 / var(--tw-text-opacity))}.antialiased.svelte-1mtuslq.svelte-1mtuslq{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.shadow.svelte-1mtuslq.svelte-1mtuslq{--tw-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-sm.svelte-1mtuslq.svelte-1mtuslq{--tw-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.filter.svelte-1mtuslq.svelte-1mtuslq{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.backdrop-blur-sm.svelte-1mtuslq.svelte-1mtuslq{--tw-backdrop-blur:blur(4px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.transition-colors.svelte-1mtuslq.svelte-1mtuslq{transition-property:color, background-color, border-color, fill, stroke, -webkit-text-decoration-color;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, -webkit-text-decoration-color;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.svelte-1mtuslq.svelte-1mtuslq,.svelte-1mtuslq.svelte-1mtuslq::before,.svelte-1mtuslq.svelte-1mtuslq::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}.svelte-1mtuslq.svelte-1mtuslq::before,.svelte-1mtuslq.svelte-1mtuslq::after{--tw-content:''}h1.svelte-1mtuslq.svelte-1mtuslq{font-size:inherit;font-weight:inherit}a.svelte-1mtuslq.svelte-1mtuslq{color:inherit;text-decoration:inherit}.svelte-1mtuslq.svelte-1mtuslq:-moz-focusring{outline:auto}.svelte-1mtuslq.svelte-1mtuslq:-moz-ui-invalid{box-shadow:none}.svelte-1mtuslq.svelte-1mtuslq::-webkit-inner-spin-button,.svelte-1mtuslq.svelte-1mtuslq::-webkit-outer-spin-button{height:auto}.svelte-1mtuslq.svelte-1mtuslq::-webkit-search-decoration{-webkit-appearance:none}.svelte-1mtuslq.svelte-1mtuslq::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}h1.svelte-1mtuslq.svelte-1mtuslq{margin:0}ul.svelte-1mtuslq.svelte-1mtuslq{list-style:none;margin:0;padding:0}[role="button"].svelte-1mtuslq.svelte-1mtuslq{cursor:pointer}.svelte-1mtuslq.svelte-1mtuslq:disabled{cursor:default}img.svelte-1mtuslq.svelte-1mtuslq,svg.svelte-1mtuslq.svelte-1mtuslq{display:block;vertical-align:middle}img.svelte-1mtuslq.svelte-1mtuslq{max-width:100%;height:auto}.svelte-1mtuslq.svelte-1mtuslq,.svelte-1mtuslq.svelte-1mtuslq::before,.svelte-1mtuslq.svelte-1mtuslq::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x:  ;--tw-pan-y:  ;--tw-pinch-zoom:  ;--tw-scroll-snap-strictness:proximity;--tw-ordinal:  ;--tw-slashed-zero:  ;--tw-numeric-figure:  ;--tw-numeric-spacing:  ;--tw-numeric-fraction:  ;--tw-ring-inset:  ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur:  ;--tw-brightness:  ;--tw-contrast:  ;--tw-grayscale:  ;--tw-hue-rotate:  ;--tw-invert:  ;--tw-saturate:  ;--tw-sepia:  ;--tw-drop-shadow:  ;--tw-backdrop-blur:  ;--tw-backdrop-brightness:  ;--tw-backdrop-contrast:  ;--tw-backdrop-grayscale:  ;--tw-backdrop-hue-rotate:  ;--tw-backdrop-invert:  ;--tw-backdrop-opacity:  ;--tw-backdrop-saturate:  ;--tw-backdrop-sepia:  }.svelte-1mtuslq.svelte-1mtuslq::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x:  ;--tw-pan-y:  ;--tw-pinch-zoom:  ;--tw-scroll-snap-strictness:proximity;--tw-ordinal:  ;--tw-slashed-zero:  ;--tw-numeric-figure:  ;--tw-numeric-spacing:  ;--tw-numeric-fraction:  ;--tw-ring-inset:  ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur:  ;--tw-brightness:  ;--tw-contrast:  ;--tw-grayscale:  ;--tw-hue-rotate:  ;--tw-invert:  ;--tw-saturate:  ;--tw-sepia:  ;--tw-drop-shadow:  ;--tw-backdrop-blur:  ;--tw-backdrop-brightness:  ;--tw-backdrop-contrast:  ;--tw-backdrop-grayscale:  ;--tw-backdrop-hue-rotate:  ;--tw-backdrop-invert:  ;--tw-backdrop-opacity:  ;--tw-backdrop-saturate:  ;--tw-backdrop-sepia:  }.svelte-1mtuslq.svelte-1mtuslq{font-family:Nunito, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,\r
      Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,\r
      sans-serif;-webkit-font-smoothing:antialiased}.hover\\:bg-slate-200.svelte-1mtuslq.svelte-1mtuslq:hover{--tw-bg-opacity:1;background-color:rgb(226 232 240 / var(--tw-bg-opacity))}.dark.svelte-1mtuslq .dark\\:border-neutral-600.svelte-1mtuslq{--tw-border-opacity:1;border-color:rgb(82 82 82 / var(--tw-border-opacity))}.dark.svelte-1mtuslq .dark\\:bg-neutral-900.svelte-1mtuslq{--tw-bg-opacity:1;background-color:rgb(23 23 23 / var(--tw-bg-opacity))}.dark.svelte-1mtuslq .dark\\:bg-neutral-800.svelte-1mtuslq{--tw-bg-opacity:1;background-color:rgb(38 38 38 / var(--tw-bg-opacity))}.dark.svelte-1mtuslq .dark\\:fill-neutral-300.svelte-1mtuslq{fill:#d4d4d4}.dark.svelte-1mtuslq .dark\\:text-white.svelte-1mtuslq{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.dark.svelte-1mtuslq .dark\\:text-neutral-600.svelte-1mtuslq{--tw-text-opacity:1;color:rgb(82 82 82 / var(--tw-text-opacity))}.dark.svelte-1mtuslq .dark\\:hover\\:bg-neutral-700.svelte-1mtuslq:hover{--tw-bg-opacity:1;background-color:rgb(64 64 64 / var(--tw-bg-opacity))}`,
    )
  }
  function get_each_context(t, e, r) {
    const n = t.slice()
    return (n[20] = e[r]), n
  }
  function get_each_context_1(t, e, r) {
    const n = t.slice()
    return (n[23] = e[r]), n
  }
  function create_else_block(t) {
    let e, r
    return {
      c() {
        ;(e = element("img")),
          attr(e, "alt", t[23].name),
          src_url_equal(e.src, (r = t[23].icon)) || attr(e, "src", r),
          attr(e, "class", "w-8 h-8 rounded-full svelte-1mtuslq")
      },
      m(n, o) {
        insert(n, e, o)
      },
      p: noop,
      d(n) {
        n && detach(e)
      },
    }
  }
  function create_if_block(t) {
    let e
    return {
      c() {
        ;(e = element("div")),
          (e.innerHTML = `<svg aria-hidden="true" class="w-8 h-8 text-neutral-300 animate-spin dark:text-neutral-600 fill-neutral-600 dark:fill-neutral-300 svelte-1mtuslq" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" class="svelte-1mtuslq"></path><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" class="svelte-1mtuslq"></path></svg> 
              <span class="sr-only svelte-1mtuslq">Loading...</span>`),
          attr(e, "role", "status"),
          attr(e, "class", "svelte-1mtuslq")
      },
      m(r, n) {
        insert(r, e, n)
      },
      p: noop,
      d(r) {
        r && detach(e)
      },
    }
  }
  function create_each_block_1(t) {
    let e,
      r = t[23].name + "",
      n,
      o,
      s,
      i
    function l(m, p) {
      return m[1] === m[23].id ? create_if_block : create_else_block
    }
    let c = l(t),
      a = c(t)
    function u() {
      return t[12](t[23])
    }
    function d(...m) {
      return t[13](t[23], ...m)
    }
    return {
      c() {
        ;(e = element("li")),
          (n = text(r)),
          (o = space()),
          a.c(),
          attr(
            e,
            "class",
            "flex justify-between items-center p-3 bg-slate-100 rounded-md cursor-pointer shadow-sm hover:bg-slate-200 transition-colors dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-600 dark:text-white svelte-1mtuslq",
          )
      },
      m(m, p) {
        insert(m, e, p),
          append(e, n),
          append(e, o),
          a.m(e, null),
          s || ((i = [listen(e, "click", u), listen(e, "keyup", d)]), (s = !0))
      },
      p(m, p) {
        ;(t = m),
          c === (c = l(t)) && a
            ? a.p(t, p)
            : (a.d(1), (a = c(t)), a && (a.c(), a.m(e, null)))
      },
      d(m) {
        m && detach(e), a.d(), (s = !1), run_all(i)
      },
    }
  }
  function create_each_block(t) {
    let e,
      r,
      n = t[20].name + "",
      o,
      s,
      i,
      l,
      c,
      a,
      u,
      d,
      m,
      p
    return {
      c() {
        ;(e = element("a")),
          (r = element("li")),
          (o = text(n)),
          (s = space()),
          (i = element("img")),
          (a = space()),
          attr(i, "alt", (l = t[20].name)),
          src_url_equal(i.src, (c = t[20].icon)) || attr(i, "src", c),
          attr(i, "class", "w-8 h-8 rounded-full svelte-1mtuslq"),
          attr(
            r,
            "class",
            "flex justify-between items-center p-3 bg-slate-100 rounded-md shadow-sm cursor-pointer hover:bg-slate-200 transition-colors dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-600 dark:text-white svelte-1mtuslq",
          ),
          attr(e, "alt", (u = t[20].name + " download link")),
          attr(e, "href", (d = t[20].download)),
          attr(e, "target", "_blank"),
          attr(e, "rel", "noopener noreferrer"),
          attr(e, "class", "svelte-1mtuslq")
      },
      m(h, M) {
        insert(h, e, M),
          append(e, r),
          append(r, o),
          append(r, s),
          append(r, i),
          append(e, a),
          m ||
            ((p = [listen(r, "click", t[14]), listen(r, "keyup", t[15])]),
            (m = !0))
      },
      p(h, M) {
        M & 1 && n !== (n = h[20].name + "") && set_data(o, n),
          M & 1 && l !== (l = h[20].name) && attr(i, "alt", l),
          M & 1 && !src_url_equal(i.src, (c = h[20].icon)) && attr(i, "src", c),
          M & 1 &&
            u !== (u = h[20].name + " download link") &&
            attr(e, "alt", u),
          M & 1 && d !== (d = h[20].download) && attr(e, "href", d)
      },
      d(h) {
        h && detach(e), (m = !1), run_all(p)
      },
    }
  }
  function create_fragment(t) {
    let e,
      r,
      n,
      o,
      s,
      i,
      l,
      c,
      a,
      u,
      d,
      m,
      p = t[4],
      h = []
    for (let g = 0; g < p.length; g += 1)
      h[g] = create_each_block_1(get_each_context_1(t, p, g))
    let M = t[0],
      A = []
    for (let g = 0; g < M.length; g += 1)
      A[g] = create_each_block(get_each_context(t, M, g))
    return {
      c() {
        ;(e = element("div")),
          (r = element("main")),
          (n = element("header")),
          (o = element("h1")),
          (o.textContent = "Connect a wallet"),
          (s = space()),
          (i = element("span")),
          (i.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 0 24 24" fill="currentColor" class="svelte-1mtuslq"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" class="svelte-1mtuslq"></path></svg>'),
          (l = space()),
          (c = element("ul"))
        for (let g = 0; g < h.length; g += 1) h[g].c()
        a = space()
        for (let g = 0; g < A.length; g += 1) A[g].c()
        attr(o, "class", "text-xl svelte-1mtuslq"),
          attr(i, "role", "button"),
          attr(i, "alt", "Close"),
          attr(i, "class", "cursor-pointer svelte-1mtuslq"),
          attr(
            n,
            "class",
            "flex items-center justify-between mb-4 svelte-1mtuslq",
          ),
          attr(c, "class", "flex flex-col gap-3 svelte-1mtuslq"),
          attr(r, "role", "dialog"),
          attr(
            r,
            "class",
            null_to_empty(
              "bg-slate-50 rounded-md shadow w-full max-w-[500px] mx-6 p-4 text-center z-50 dark:bg-neutral-900 dark:text-white",
            ) + " svelte-1mtuslq",
          ),
          attr(
            e,
            "class",
            (u =
              null_to_empty(
                "backdrop-blur-sm fixed inset-0 flex items-center justify-center bg-black/25 z-40 " +
                  t[2],
              ) + " svelte-1mtuslq"),
          )
      },
      m(g, I) {
        insert(g, e, I),
          append(e, r),
          append(r, n),
          append(n, o),
          append(n, s),
          append(n, i),
          append(r, l),
          append(r, c)
        for (let b = 0; b < h.length; b += 1) h[b].m(c, null)
        append(c, a)
        for (let b = 0; b < A.length; b += 1) A[b].m(c, null)
        d ||
          ((m = [
            listen(i, "click", t[10]),
            listen(i, "keyup", t[11]),
            listen(r, "click", click_handler_3),
            listen(r, "keyup", keyup_handler_3),
            listen(e, "click", t[16]),
            listen(e, "keyup", t[17]),
          ]),
          (d = !0))
      },
      p(g, [I]) {
        if (I & 26) {
          p = g[4]
          let b
          for (b = 0; b < p.length; b += 1) {
            const E = get_each_context_1(g, p, b)
            h[b]
              ? h[b].p(E, I)
              : ((h[b] = create_each_block_1(E)), h[b].c(), h[b].m(c, a))
          }
          for (; b < h.length; b += 1) h[b].d(1)
          h.length = p.length
        }
        if (I & 9) {
          M = g[0]
          let b
          for (b = 0; b < M.length; b += 1) {
            const E = get_each_context(g, M, b)
            A[b]
              ? A[b].p(E, I)
              : ((A[b] = create_each_block(E)), A[b].c(), A[b].m(c, null))
          }
          for (; b < A.length; b += 1) A[b].d(1)
          A.length = M.length
        }
        I & 4 &&
          u !==
            (u =
              null_to_empty(
                "backdrop-blur-sm fixed inset-0 flex items-center justify-center bg-black/25 z-40 " +
                  g[2],
              ) + " svelte-1mtuslq") &&
          attr(e, "class", u)
      },
      i: noop,
      o: noop,
      d(g) {
        g && detach(e),
          destroy_each(h, g),
          destroy_each(A, g),
          (d = !1),
          run_all(m)
      },
    }
  }
  const click_handler_3 = (t) => t.stopPropagation(),
    keyup_handler_3 = (t) => t.stopPropagation()
  function instance(t, e, r) {
    const n = typeof window < "u" ? window : null
    let { lastWallet: o = null } = e,
      { installedWallets: s = [] } = e,
      { authorizedWallets: i = [] } = e,
      { discoveryWallets: l = [] } = e,
      { callback: c = async () => {} } = e,
      { theme: a = null } = e,
      u = !1,
      d = async (y) => {
        var _
        r(1, (u = (_ = y == null ? void 0 : y.id) != null ? _ : !1)),
          await c(y).catch(() => {}),
          r(1, (u = !1))
      },
      m = ""
    a === "dark" ||
    (a === null &&
      (n == null
        ? void 0
        : n.matchMedia("(prefers-color-scheme: dark)").matches))
      ? (m = "dark")
      : (m = "")
    const p = (y) => {
      r(2, (m = y.matches ? "dark" : ""))
    }
    onMount(() => {
      if (a === null)
        return (
          n == null ||
            n
              .matchMedia("(prefers-color-scheme: dark)")
              .addEventListener("change", p),
          () => {
            n == null ||
              n
                .matchMedia("(prefers-color-scheme: dark)")
                .removeEventListener("change", p)
          }
        )
    })
    const h = [o, ...i, ...s].filter(Boolean),
      M = () => d(null),
      A = (y) => {
        y.key === "Enter" && d(null)
      },
      g = (y) => d(y),
      I = (y, _) => {
        _.key === "Enter" && d(y)
      },
      b = () => d(null),
      E = (y) => {
        y.key === "Enter" && d(null)
      },
      x = () => d(null),
      O = (y) => {
        y.key === "Escape" && d(null)
      }
    return (
      (t.$$set = (y) => {
        "lastWallet" in y && r(5, (o = y.lastWallet)),
          "installedWallets" in y && r(6, (s = y.installedWallets)),
          "authorizedWallets" in y && r(7, (i = y.authorizedWallets)),
          "discoveryWallets" in y && r(0, (l = y.discoveryWallets)),
          "callback" in y && r(8, (c = y.callback)),
          "theme" in y && r(9, (a = y.theme))
      }),
      [l, u, m, d, h, o, s, i, c, a, M, A, g, I, b, E, x, O]
    )
  }
  class Modal extends SvelteComponent {
    constructor(e) {
      super(),
        init$1(
          this,
          e,
          instance,
          create_fragment,
          safe_not_equal,
          {
            lastWallet: 5,
            installedWallets: 6,
            authorizedWallets: 7,
            discoveryWallets: 0,
            callback: 8,
            theme: 9,
          },
          add_css,
        )
    }
  }
  function excludeWallets(t, e) {
    return t.filter((r) => !e.some((n) => n.id === r.id))
  }
  async function show({
    discoveryWallets: t,
    installedWallets: e,
    lastWallet: r,
    authorizedWallets: n,
    enable: o,
    modalOptions: s,
  }) {
    return new Promise((i) => {
      var a
      const l = [r].filter(Boolean)
      ;(n = excludeWallets(n, l)),
        (e = excludeWallets(e, [...l, ...n])),
        (t = excludeWallets(t, [...l, ...e, ...n]))
      const c = new Modal({
        target: document.body,
        props: {
          callback: async (u) => {
            var m
            const d = (m = await (o == null ? void 0 : o(u))) != null ? m : u
            c.$destroy(), i(d)
          },
          lastWallet: r,
          installedWallets: e,
          authorizedWallets: n,
          discoveryWallets: t,
          theme:
            (s == null ? void 0 : s.theme) === "system"
              ? null
              : (a = s == null ? void 0 : s.theme) != null
              ? a
              : null,
        },
      })
    })
  }
  var te = Object.defineProperty,
    ne = (t, e, r) =>
      e in t
        ? te(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r })
        : (t[e] = r),
    v = (t, e, r) => (ne(t, typeof e != "symbol" ? e + "" : e, r), r),
    K = (t, e, r) => {
      if (!e.has(t)) throw TypeError("Cannot " + r)
    },
    w = (t, e, r) => (
      K(t, e, "read from private field"), r ? r.call(t) : e.get(t)
    ),
    L = (t, e, r) => {
      if (e.has(t))
        throw TypeError("Cannot add the same private member more than once")
      e instanceof WeakSet ? e.add(t) : e.set(t, r)
    },
    F = (t, e, r, n) => (
      K(t, e, "write to private field"), n ? n.call(t, r) : e.set(t, r), r
    ),
    D = (t, e, r) => (K(t, e, "access private method"), r)
  const generateUID = () =>
      `${Date.now()}-${Math.floor(Math.random() * 8999999999999) + 1e12}`,
    shuffle = (t) => {
      for (let e = t.length - 1; e > 0; e--) {
        const r = Math.floor(Math.random() * (e + 1))
        ;[t[e], t[r]] = [t[r], t[e]]
      }
      return t
    },
    pipe$1 =
      (...t) =>
      (e) =>
        t.reduce((r, n) => r.then(n), Promise.resolve(e))
  function ensureKeysArray(t) {
    return Object.keys(t)
  }
  const ssrSafeWindow$1 = typeof window < "u" ? window : null
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
    return t.findIndex((r) => r === e) === -1 && t.push(e), t
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
            var r = arguments[e]
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n])
          }
          return t
        }),
      _extends$1$1.apply(this, arguments)
    )
  }
  function _object_without_properties_loose$1(t, e) {
    if (t == null) return {}
    var r = {},
      n = Object.keys(t),
      o,
      s
    for (s = 0; s < n.length; s++)
      (o = n[s]), !(e.indexOf(o) >= 0) && (r[o] = t[o])
    return r
  }
  const nativeGlobal = (() => {
      try {
        return new Function("return this")()
      } catch {
        return globalThis
      }
    })(),
    Global = nativeGlobal
  function definePropertyGlobalVal(t, e, r) {
    Object.defineProperty(t, e, { value: r, configurable: !1, writable: !0 })
  }
  function includeOwnProperty(t, e) {
    return Object.hasOwnProperty.call(t, e)
  }
  includeOwnProperty(globalThis, "__GLOBAL_LOADING_REMOTE_ENTRY__") ||
    definePropertyGlobalVal(globalThis, "__GLOBAL_LOADING_REMOTE_ENTRY__", {})
  const globalLoading = globalThis.__GLOBAL_LOADING_REMOTE_ENTRY__
  function setGlobalDefaultVal(t) {
    var e, r, n, o, s, i
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
          __PRELOADED_MAP__: new Map(),
        }),
        definePropertyGlobalVal(t, "__VMOK__", t.__FEDERATION__)),
      (e = t.__FEDERATION__).__GLOBAL_PLUGIN__ != null ||
        (e.__GLOBAL_PLUGIN__ = []),
      (r = t.__FEDERATION__).__INSTANCES__ != null || (r.__INSTANCES__ = []),
      (n = t.__FEDERATION__).moduleInfo != null || (n.moduleInfo = {}),
      (o = t.__FEDERATION__).__SHARE__ != null || (o.__SHARE__ = {}),
      (s = t.__FEDERATION__).__MANIFEST_LOADING__ != null ||
        (s.__MANIFEST_LOADING__ = {}),
      (i = t.__FEDERATION__).__PRELOADED_MAP__ != null ||
        (i.__PRELOADED_MAP__ = new Map())
  }
  setGlobalDefaultVal(globalThis), setGlobalDefaultVal(nativeGlobal)
  function getGlobalFederationInstance(t, e) {
    const r = getBuilderId()
    return globalThis.__FEDERATION__.__INSTANCES__.find(
      (n) =>
        !!(
          (r && n.options.id === getBuilderId()) ||
          (n.options.name === t && !n.options.version && !e) ||
          (n.options.name === t && e && n.options.version === e)
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
      if (t[e]) return { value: t[e], key: e }
      {
        const r = Object.keys(t)
        for (const n of r) {
          const [o, s] = n.split(":"),
            i = `${o}:${e}`,
            l = t[i]
          if (l) return { value: l, key: i }
        }
        return { value: void 0, key: e }
      }
    } else throw new Error("key must be string")
  }
  const getGlobalSnapshot = () => nativeGlobal.__FEDERATION__.moduleInfo,
    getTargetSnapshotInfoByModuleInfo = (t, e) => {
      const r = getFMId(t),
        n = getInfoWithoutType(e, r).value
      if (
        (n &&
          !n.version &&
          "version" in t &&
          t.version &&
          (n.version = t.version),
        n)
      )
        return n
      if ("version" in t && t.version) {
        const { version: o } = t,
          s = _object_without_properties_loose$1(t, ["version"]),
          i = getFMId(s),
          l = getInfoWithoutType(
            nativeGlobal.__FEDERATION__.moduleInfo,
            i,
          ).value
        if ((l == null ? void 0 : l.version) === o) return l
      }
    },
    getGlobalSnapshotInfoByModuleInfo = (t) =>
      getTargetSnapshotInfoByModuleInfo(
        t,
        nativeGlobal.__FEDERATION__.moduleInfo,
      ),
    setGlobalSnapshotInfoByModuleInfo = (t, e) => {
      const r = getFMId(t)
      return (
        (nativeGlobal.__FEDERATION__.moduleInfo[r] = e),
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
        for (const r of e) delete nativeGlobal.__FEDERATION__.moduleInfo[r]
      }
    ),
    getRemoteEntryExports = (t, e) => {
      const r = e || `__FEDERATION_${t}:custom__`,
        n = globalThis[r]
      return { remoteEntryKey: r, entryExports: n }
    },
    getGlobalHostPlugins = () => nativeGlobal.__FEDERATION__.__GLOBAL_PLUGIN__,
    getPreloaded = (t) => globalThis.__FEDERATION__.__PRELOADED_MAP__.get(t),
    setPreloaded = (t) =>
      globalThis.__FEDERATION__.__PRELOADED_MAP__.set(t, !0),
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
    return (e) => t.reduce((r, n) => n(r), e)
  }
  function extractComparator(t) {
    return t.match(parseRegex(comparator))
  }
  function combineVersion(t, e, r, n) {
    const o = `${t}.${e}.${r}`
    return n ? `${o}-${n}` : o
  }
  function parseHyphen(t) {
    return t.replace(
      parseRegex(hyphenRange),
      (e, r, n, o, s, i, l, c, a, u, d, m) => (
        isXVersion(n)
          ? (r = "")
          : isXVersion(o)
          ? (r = `>=${n}.0.0`)
          : isXVersion(s)
          ? (r = `>=${n}.${o}.0`)
          : (r = `>=${r}`),
        isXVersion(a)
          ? (c = "")
          : isXVersion(u)
          ? (c = `<${Number(a) + 1}.0.0-0`)
          : isXVersion(d)
          ? (c = `<${a}.${Number(u) + 1}.0-0`)
          : m
          ? (c = `<=${a}.${u}.${d}-${m}`)
          : (c = `<=${c}`),
        `${r} ${c}`.trim()
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
        e.replace(parseRegex(caret), (r, n, o, s, i) =>
          isXVersion(n)
            ? ""
            : isXVersion(o)
            ? `>=${n}.0.0 <${Number(n) + 1}.0.0-0`
            : isXVersion(s)
            ? n === "0"
              ? `>=${n}.${o}.0 <${n}.${Number(o) + 1}.0-0`
              : `>=${n}.${o}.0 <${Number(n) + 1}.0.0-0`
            : i
            ? n === "0"
              ? o === "0"
                ? `>=${n}.${o}.${s}-${i} <${n}.${o}.${Number(s) + 1}-0`
                : `>=${n}.${o}.${s}-${i} <${n}.${Number(o) + 1}.0-0`
              : `>=${n}.${o}.${s}-${i} <${Number(n) + 1}.0.0-0`
            : n === "0"
            ? o === "0"
              ? `>=${n}.${o}.${s} <${n}.${o}.${Number(s) + 1}-0`
              : `>=${n}.${o}.${s} <${n}.${Number(o) + 1}.0-0`
            : `>=${n}.${o}.${s} <${Number(n) + 1}.0.0-0`,
        ),
      )
      .join(" ")
  }
  function parseTildes(t) {
    return t
      .trim()
      .split(/\s+/)
      .map((e) =>
        e.replace(parseRegex(tilde), (r, n, o, s, i) =>
          isXVersion(n)
            ? ""
            : isXVersion(o)
            ? `>=${n}.0.0 <${Number(n) + 1}.0.0-0`
            : isXVersion(s)
            ? `>=${n}.${o}.0 <${n}.${Number(o) + 1}.0-0`
            : i
            ? `>=${n}.${o}.${s}-${i} <${n}.${Number(o) + 1}.0-0`
            : `>=${n}.${o}.${s} <${n}.${Number(o) + 1}.0-0`,
        ),
      )
      .join(" ")
  }
  function parseXRanges(t) {
    return t
      .split(/\s+/)
      .map((e) =>
        e.trim().replace(parseRegex(xRange), (r, n, o, s, i, l) => {
          const c = isXVersion(o),
            a = c || isXVersion(s),
            u = a || isXVersion(i)
          return (
            n === "=" && u && (n = ""),
            (l = ""),
            c
              ? n === ">" || n === "<"
                ? "<0.0.0-0"
                : "*"
              : n && u
              ? (a && (s = 0),
                (i = 0),
                n === ">"
                  ? ((n = ">="),
                    a
                      ? ((o = Number(o) + 1), (s = 0), (i = 0))
                      : ((s = Number(s) + 1), (i = 0)))
                  : n === "<=" &&
                    ((n = "<"), a ? (o = Number(o) + 1) : (s = Number(s) + 1)),
                n === "<" && (l = "-0"),
                `${n + o}.${s}.${i}${l}`)
              : a
              ? `>=${o}.0.0${l} <${Number(o) + 1}.0.0-0`
              : u
              ? `>=${o}.${s}.0${l} <${o}.${Number(s) + 1}.0-0`
              : r
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
    const { preRelease: r } = t,
      { preRelease: n } = e
    if (r === void 0 && Boolean(n)) return 1
    if (Boolean(r) && n === void 0) return -1
    if (r === void 0 && n === void 0) return 0
    for (let o = 0, s = r.length; o <= s; o++) {
      const i = r[o],
        l = n[o]
      if (i !== l)
        return i === void 0 && l === void 0
          ? 0
          : i
          ? l
            ? compareAtom(i, l)
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
    const r = parseRange(e)
        .split(" ")
        .map((u) => parseComparatorString(u))
        .join(" ")
        .split(/\s+/)
        .map((u) => parseGTE0(u)),
      n = extractComparator(t)
    if (!n) return !1
    const [, o, , s, i, l, c] = n,
      a = {
        operator: o,
        version: combineVersion(s, i, l, c),
        major: s,
        minor: i,
        patch: l,
        preRelease: c == null ? void 0 : c.split("."),
      }
    for (const u of r) {
      const d = extractComparator(u)
      if (!d) return !1
      const [, m, , p, h, M, A] = d,
        g = {
          operator: m,
          version: combineVersion(p, h, M, A),
          major: p,
          minor: h,
          patch: M,
          preRelease: A == null ? void 0 : A.split("."),
        }
      if (!compare(g, a)) return !1
    }
    return !0
  }
  function _extends$6() {
    return (
      (_extends$6 =
        Object.assign ||
        function (t) {
          for (var e = 1; e < arguments.length; e++) {
            var r = arguments[e]
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n])
          }
          return t
        }),
      _extends$6.apply(this, arguments)
    )
  }
  function formatShare(t, e) {
    let r
    return (
      "get" in t ? (r = t.get) : (r = () => Promise.resolve(t.lib)),
      _extends$6({ deps: [], useIn: [], from: e, loading: null }, t, {
        shareConfig: _extends$6(
          {
            requiredVersion: `^${t.version}`,
            singleton: !1,
            eager: !1,
            strictVersion: !1,
          },
          t.shareConfig,
        ),
        get: r,
        loaded: "lib" in t ? !0 : void 0,
        scope: Array.isArray(t.scope) ? t.scope : ["default"],
        strategy: t.strategy || "version-first",
      })
    )
  }
  function formatShareConfigs(t, e) {
    return t
      ? Object.keys(t).reduce((r, n) => ((r[n] = formatShare(t[n], e)), r), {})
      : {}
  }
  function versionLt(t, e) {
    const r = (n) => {
      if (!Number.isNaN(Number(n))) {
        const o = n.split(".")
        let s = n
        for (let i = 0; i < 3 - o.length; i++) s += ".0"
        return s
      }
      return n
    }
    return !!satisfy(r(t), `<=${r(e)}`)
  }
  const findVersion = (t, e, r, n) => {
      const o = t[e][r],
        s =
          n ||
          function (i, l) {
            return versionLt(i, l)
          }
      return Object.keys(o).reduce(
        (i, l) => (!i || s(i, l) || i === "0" ? l : i),
        0,
      )
    },
    isLoaded = (t) => Boolean(t.loaded) || typeof t.lib == "function"
  function findSingletonVersionOrderByVersion(t, e, r) {
    const n = t[e][r]
    return findVersion(t, e, r, function (o, s) {
      return !isLoaded(n[o]) && versionLt(o, s)
    })
  }
  function findSingletonVersionOrderByLoaded(t, e, r) {
    const n = t[e][r]
    return findVersion(t, e, r, function (o, s) {
      return isLoaded(n[s])
        ? isLoaded(n[o])
          ? Boolean(versionLt(o, s))
          : !0
        : isLoaded(n[o])
        ? !1
        : versionLt(o, s)
    })
  }
  function getFindShareFunction(t) {
    return t === "loaded-first"
      ? findSingletonVersionOrderByLoaded
      : findSingletonVersionOrderByVersion
  }
  function getRegisteredShare(t, e, r, n) {
    if (!t) return
    const { shareConfig: o, scope: s = DEFAULT_SCOPE, strategy: i } = r,
      l = Array.isArray(s) ? s : [s]
    for (const c of l)
      if (o && t[c] && t[c][e]) {
        const { requiredVersion: a } = o,
          u = getFindShareFunction(i)(t, c, e),
          d = () => {
            if (o.singleton) {
              if (typeof a == "string" && !satisfy(u, a)) {
                const p = `Version ${u} from ${
                  u && t[c][e][u].from
                } of shared singleton module ${e} does not satisfy the requirement of ${
                  r.from
                } which needs ${a})`
                o.strictVersion ? error(p) : warn$1(p)
              }
              return t[c][e][u]
            } else {
              if (a === !1 || a === "*" || satisfy(u, a)) return t[c][e][u]
              for (const [p, h] of Object.entries(t[c][e]))
                if (satisfy(p, a)) return h
            }
          },
          m = {
            shareScopeMap: t,
            scope: c,
            pkgName: e,
            version: u,
            GlobalFederation: Global.__FEDERATION__,
            resolver: d,
          }
        return (n.emit(m) || m).resolver()
      }
  }
  function getGlobalShareScope() {
    return Global.__FEDERATION__.__SHARE__
  }
  function _define_property$3(t, e, r) {
    return (
      e in t
        ? Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = r),
      t
    )
  }
  var MANIFEST_EXT = ".json",
    BROWSER_LOG_KEY = "FEDERATION_DEBUG",
    BROWSER_LOG_VALUE = "1",
    NameTransformSymbol = { AT: "@", HYPHEN: "-", SLASH: "/" },
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
    for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r]
    return n
  }
  function _array_without_holes(t) {
    if (Array.isArray(t)) return _array_like_to_array$2(t)
  }
  function _class_call_check(t, e) {
    if (!(t instanceof e))
      throw new TypeError("Cannot call a class as a function")
  }
  function _defineProperties(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r]
      ;(n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(t, n.key, n)
    }
  }
  function _create_class(t, e, r) {
    return (
      e && _defineProperties(t.prototype, e), r && _defineProperties(t, r), t
    )
  }
  function _define_property$2(t, e, r) {
    return (
      e in t
        ? Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = r),
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
    if (t) {
      if (typeof t == "string") return _array_like_to_array$2(t, e)
      var r = Object.prototype.toString.call(t).slice(8, -1)
      if (
        (r === "Object" && t.constructor && (r = t.constructor.name),
        r === "Map" || r === "Set")
      )
        return Array.from(r)
      if (
        r === "Arguments" ||
        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
      )
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
  var Logger = (function () {
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
            value: function (e, r) {
              if (this.enable) {
                var n = safeToString(r) || ""
                isBrowserEnv()
                  ? console.info(
                      "%c "
                        .concat(this.identifier, ": ")
                        .concat(e, " ")
                        .concat(n),
                      "color:#3300CC",
                    )
                  : console.info(
                      "\x1B[34m%s",
                      ""
                        .concat(this.identifier, ": ")
                        .concat(e, " ")
                        .concat(
                          n
                            ? `
`.concat(n)
                            : "",
                        ),
                    )
              }
            },
          },
          {
            key: "logOriginalInfo",
            value: function () {
              for (
                var e = arguments.length, r = new Array(e), n = 0;
                n < e;
                n++
              )
                r[n] = arguments[n]
              if (this.enable)
                if (isBrowserEnv()) {
                  var o
                  console.info(
                    "%c ".concat(this.identifier, ": OriginalInfo"),
                    "color:#3300CC",
                  ),
                    (o = console).log.apply(o, _to_consumable_array(r))
                } else {
                  var s
                  console.info(
                    "%c ".concat(this.identifier, ": OriginalInfo"),
                    "color:#3300CC",
                  ),
                    (s = console).log.apply(s, _to_consumable_array(r))
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
      for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
        e[r] = arguments[r]
      return e.length
        ? e.reduce(function (n, o) {
            return o ? (n ? "".concat(n).concat(SEPARATOR).concat(o) : o) : n
          }, "")
        : ""
    },
    getResourceUrl = function (t, e) {
      if ("getPublicPath" in t) {
        var r = new Function(t.getPublicPath)()
        return "".concat(r).concat(e)
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
  function _define_property$1(t, e, r) {
    return (
      e in t
        ? Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = r),
      t
    )
  }
  function _object_spread$1(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e] != null ? arguments[e] : {},
        n = Object.keys(r)
      typeof Object.getOwnPropertySymbols == "function" &&
        (n = n.concat(
          Object.getOwnPropertySymbols(r).filter(function (o) {
            return Object.getOwnPropertyDescriptor(r, o).enumerable
          }),
        )),
        n.forEach(function (o) {
          _define_property$1(t, o, r[o])
        })
    }
    return t
  }
  function ownKeys(t, e) {
    var r = Object.keys(t)
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(t)
      e &&
        (n = n.filter(function (o) {
          return Object.getOwnPropertyDescriptor(t, o).enumerable
        })),
        r.push.apply(r, n)
    }
    return r
  }
  function _object_spread_props(t, e) {
    return (
      (e = e != null ? e : {}),
      Object.getOwnPropertyDescriptors
        ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(e))
        : ownKeys(Object(e)).forEach(function (r) {
            Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r))
          }),
      t
    )
  }
  var simpleJoinRemoteEntry = function (t, e) {
    if (!t) return e
    var r = function (o) {
        if (o === ".") return ""
        if (o.startsWith("./")) return o.replace("./", "")
        if (o.startsWith("/")) {
          var s = o.slice(1)
          return s.endsWith("/") ? s.slice(0, -1) : s
        }
        return o
      },
      n = r(t)
    return n
      ? n.endsWith("/")
        ? "".concat(n).concat(e)
        : "".concat(n, "/").concat(e)
      : e
  }
  function generateSnapshotFromManifest(t) {
    var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      r,
      n,
      o = e.remotes,
      s = o === void 0 ? {} : o,
      i = e.overrides,
      l = i === void 0 ? {} : i,
      c = e.version,
      a,
      u = function () {
        return "publicPath" in t.metaData
          ? t.metaData.publicPath
          : t.metaData.getPublicPath
      },
      d = Object.keys(l),
      m = {}
    if (!Object.keys(s).length) {
      var p
      m =
        ((p = t.remotes) === null || p === void 0
          ? void 0
          : p.reduce(function (S, R) {
              var U,
                W = R.federationContainerName
              return (
                d.includes(W)
                  ? (U = l[W])
                  : "version" in R
                  ? (U = R.version)
                  : (U = R.entry),
                (S[W] = { matchedVersion: U }),
                S
              )
            }, {})) || {}
    }
    Object.keys(s).forEach(function (S) {
      return (m[S] = { matchedVersion: d.includes(S) ? l[S] : s[S] })
    })
    var h = t.metaData,
      M = h.remoteEntry,
      A = M.path,
      g = M.name,
      I = M.type,
      b = h.types,
      E = h.buildInfo.buildVersion,
      x = h.globalName,
      O = t.exposes,
      y = {
        version: c || "",
        buildVersion: E,
        globalName: x,
        remoteEntry: simpleJoinRemoteEntry(A, g),
        remoteEntryType: I,
        remoteTypes: simpleJoinRemoteEntry(b.path, b.name),
        remoteTypesZip: b.zip || "",
        remoteTypesAPI: b.api || "",
        remotesInfo: m,
        shared:
          t == null
            ? void 0
            : t.shared.map(function (S) {
                return { assets: S.assets, sharedName: S.name }
              }),
        modules:
          O == null
            ? void 0
            : O.map(function (S) {
                return {
                  moduleName: S.name,
                  modulePath: S.path,
                  assets: S.assets,
                }
              }),
      }
    if (!((r = t.metaData) === null || r === void 0) && r.prefetchInterface) {
      var _ = t.metaData.prefetchInterface
      y = _object_spread_props(_object_spread$1({}, y), {
        prefetchInterface: _,
      })
    }
    if (!((n = t.metaData) === null || n === void 0) && n.prefetchEntry) {
      var N = t.metaData.prefetchEntry,
        T = N.path,
        G = N.name,
        $ = N.type
      y = _object_spread_props(_object_spread$1({}, y), {
        prefetchEntry: simpleJoinRemoteEntry(T, G),
        prefetchEntryType: $,
      })
    }
    return (
      "publicPath" in t.metaData
        ? (a = _object_spread_props(_object_spread$1({}, y), {
            publicPath: u(),
          }))
        : (a = _object_spread_props(_object_spread$1({}, y), {
            getPublicPath: u(),
          })),
      a
    )
  }
  function isManifestProvider(t) {
    return !!("remoteEntry" in t && t.remoteEntry.includes(MANIFEST_EXT))
  }
  function asyncGeneratorStep$1(t, e, r, n, o, s, i) {
    try {
      var l = t[s](i),
        c = l.value
    } catch (a) {
      r(a)
      return
    }
    l.done ? e(c) : Promise.resolve(c).then(n, o)
  }
  function _async_to_generator$1(t) {
    return function () {
      var e = this,
        r = arguments
      return new Promise(function (n, o) {
        var s = t.apply(e, r)
        function i(c) {
          asyncGeneratorStep$1(s, n, o, i, l, "next", c)
        }
        function l(c) {
          asyncGeneratorStep$1(s, n, o, i, l, "throw", c)
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
    var r,
      n,
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
      (s = { next: l(0), throw: l(1), return: l(2) }),
      typeof Symbol == "function" &&
        (s[Symbol.iterator] = function () {
          return this
        }),
      s
    )
    function l(a) {
      return function (u) {
        return c([a, u])
      }
    }
    function c(a) {
      if (r) throw new TypeError("Generator is already executing.")
      for (; i; )
        try {
          if (
            ((r = 1),
            n &&
              (o =
                a[0] & 2
                  ? n.return
                  : a[0]
                  ? n.throw || ((o = n.return) && o.call(n), 0)
                  : n.next) &&
              !(o = o.call(n, a[1])).done)
          )
            return o
          switch (((n = 0), o && (a = [a[0] & 2, o.value]), a[0])) {
            case 0:
            case 1:
              o = a
              break
            case 4:
              return i.label++, { value: a[1], done: !1 }
            case 5:
              i.label++, (n = a[1]), (a = [0])
              continue
            case 7:
              ;(a = i.ops.pop()), i.trys.pop()
              continue
            default:
              if (
                ((o = i.trys),
                !(o = o.length > 0 && o[o.length - 1]) &&
                  (a[0] === 6 || a[0] === 2))
              ) {
                i = 0
                continue
              }
              if (a[0] === 3 && (!o || (a[1] > o[0] && a[1] < o[3]))) {
                i.label = a[1]
                break
              }
              if (a[0] === 6 && i.label < o[1]) {
                ;(i.label = o[1]), (o = a)
                break
              }
              if (o && i.label < o[2]) {
                ;(i.label = o[2]), i.ops.push(a)
                break
              }
              o[2] && i.ops.pop(), i.trys.pop()
              continue
          }
          a = e.call(t, i)
        } catch (u) {
          ;(a = [6, u]), (n = 0)
        } finally {
          r = o = 0
        }
      if (a[0] & 5) throw a[1]
      return { value: a[0] ? a[1] : void 0, done: !0 }
    }
  }
  function safeWrapper(t, e) {
    return _safeWrapper.apply(this, arguments)
  }
  function _safeWrapper() {
    return (
      (_safeWrapper = _async_to_generator$1(function (t, e) {
        var r, n
        return _ts_generator$1(this, function (o) {
          switch (o.label) {
            case 0:
              return o.trys.push([0, 2, , 3]), [4, t()]
            case 1:
              return (r = o.sent()), [2, r]
            case 2:
              return (n = o.sent()), !e && warn(n), [2]
            case 3:
              return [2]
          }
        })
      })),
      _safeWrapper.apply(this, arguments)
    )
  }
  function isStaticResourcesEqual(t, e) {
    var r = /^(https?:)?\/\//i,
      n = t.replace(r, "").replace(/\/$/, ""),
      o = e.replace(r, "").replace(/\/$/, "")
    return n === o
  }
  function createScript(t, e, r, n) {
    for (
      var o = null, s = !0, i = document.getElementsByTagName("script"), l = 0;
      l < i.length;
      l++
    ) {
      var c = i[l],
        a = c.getAttribute("src")
      if (a && isStaticResourcesEqual(a, t)) {
        ;(o = c), (s = !1)
        break
      }
    }
    if (
      !o &&
      ((o = document.createElement("script")),
      (o.type = "text/javascript"),
      (o.src = t),
      n)
    ) {
      var u = n(t)
      _instanceof(u, HTMLScriptElement) && (o = u)
    }
    r &&
      Object.keys(r).forEach(function (m) {
        o &&
          (m === "async" || m === "defer"
            ? (o[m] = r[m])
            : o.setAttribute(m, r[m]))
      })
    var d = function (m, p) {
      if (
        o &&
        ((o.onerror = null),
        (o.onload = null),
        safeWrapper(function () {
          o != null && o.parentNode && o.parentNode.removeChild(o)
        }),
        m)
      ) {
        var h = m(p)
        return e(), h
      }
      e()
    }
    return (
      (o.onerror = d.bind(null, o.onerror)),
      (o.onload = d.bind(null, o.onload)),
      { script: o, needAttach: s }
    )
  }
  function createLink(t, e) {
    for (
      var r =
          arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
        n = arguments.length > 3 ? arguments[3] : void 0,
        o = null,
        s = !0,
        i = document.getElementsByTagName("link"),
        l = 0;
      l < i.length;
      l++
    ) {
      var c = i[l],
        a = c.getAttribute("href"),
        u = c.getAttribute("ref")
      if (a && isStaticResourcesEqual(a, t) && u === r.ref) {
        ;(o = c), (s = !1)
        break
      }
    }
    if (
      !o &&
      ((o = document.createElement("link")), o.setAttribute("href", t), n)
    ) {
      var d = n(t)
      _instanceof(d, HTMLLinkElement) && (o = d)
    }
    r &&
      Object.keys(r).forEach(function (p) {
        o && o.setAttribute(p, r[p])
      })
    var m = function (p, h) {
      if (
        o &&
        ((o.onerror = null),
        (o.onload = null),
        safeWrapper(function () {
          o != null && o.parentNode && o.parentNode.removeChild(o)
        }),
        p)
      ) {
        var M = p(h)
        return e(), M
      }
      e()
    }
    return (
      (o.onerror = m.bind(null, o.onerror)),
      (o.onload = m.bind(null, o.onload)),
      { link: o, needAttach: s }
    )
  }
  function loadScript(t, e) {
    var r = e.attrs,
      n = e.createScriptHook
    return new Promise(function (o, s) {
      var i = createScript(t, o, r, n),
        l = i.script,
        c = i.needAttach
      c && document.getElementsByTagName("head")[0].appendChild(l)
    })
  }
  function _array_like_to_array(t, e) {
    ;(e == null || e > t.length) && (e = t.length)
    for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r]
    return n
  }
  function _array_with_holes(t) {
    if (Array.isArray(t)) return t
  }
  function asyncGeneratorStep(t, e, r, n, o, s, i) {
    try {
      var l = t[s](i),
        c = l.value
    } catch (a) {
      r(a)
      return
    }
    l.done ? e(c) : Promise.resolve(c).then(n, o)
  }
  function _async_to_generator(t) {
    return function () {
      var e = this,
        r = arguments
      return new Promise(function (n, o) {
        var s = t.apply(e, r)
        function i(c) {
          asyncGeneratorStep(s, n, o, i, l, "next", c)
        }
        function l(c) {
          asyncGeneratorStep(s, n, o, i, l, "throw", c)
        }
        i(void 0)
      })
    }
  }
  function _iterable_to_array_limit(t, e) {
    var r =
      t == null
        ? null
        : (typeof Symbol < "u" && t[Symbol.iterator]) || t["@@iterator"]
    if (r != null) {
      var n = [],
        o = !0,
        s = !1,
        i,
        l
      try {
        for (
          r = r.call(t);
          !(o = (i = r.next()).done) &&
          (n.push(i.value), !(e && n.length === e));
          o = !0
        );
      } catch (c) {
        ;(s = !0), (l = c)
      } finally {
        try {
          !o && r.return != null && r.return()
        } finally {
          if (s) throw l
        }
      }
      return n
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
    if (t) {
      if (typeof t == "string") return _array_like_to_array(t, e)
      var r = Object.prototype.toString.call(t).slice(8, -1)
      if (
        (r === "Object" && t.constructor && (r = t.constructor.name),
        r === "Map" || r === "Set")
      )
        return Array.from(r)
      if (
        r === "Arguments" ||
        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
      )
        return _array_like_to_array(t, e)
    }
  }
  function _ts_generator(t, e) {
    var r,
      n,
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
      (s = { next: l(0), throw: l(1), return: l(2) }),
      typeof Symbol == "function" &&
        (s[Symbol.iterator] = function () {
          return this
        }),
      s
    )
    function l(a) {
      return function (u) {
        return c([a, u])
      }
    }
    function c(a) {
      if (r) throw new TypeError("Generator is already executing.")
      for (; i; )
        try {
          if (
            ((r = 1),
            n &&
              (o =
                a[0] & 2
                  ? n.return
                  : a[0]
                  ? n.throw || ((o = n.return) && o.call(n), 0)
                  : n.next) &&
              !(o = o.call(n, a[1])).done)
          )
            return o
          switch (((n = 0), o && (a = [a[0] & 2, o.value]), a[0])) {
            case 0:
            case 1:
              o = a
              break
            case 4:
              return i.label++, { value: a[1], done: !1 }
            case 5:
              i.label++, (n = a[1]), (a = [0])
              continue
            case 7:
              ;(a = i.ops.pop()), i.trys.pop()
              continue
            default:
              if (
                ((o = i.trys),
                !(o = o.length > 0 && o[o.length - 1]) &&
                  (a[0] === 6 || a[0] === 2))
              ) {
                i = 0
                continue
              }
              if (a[0] === 3 && (!o || (a[1] > o[0] && a[1] < o[3]))) {
                i.label = a[1]
                break
              }
              if (a[0] === 6 && i.label < o[1]) {
                ;(i.label = o[1]), (o = a)
                break
              }
              if (o && i.label < o[2]) {
                ;(i.label = o[2]), i.ops.push(a)
                break
              }
              o[2] && i.ops.pop(), i.trys.pop()
              continue
          }
          a = e.call(t, i)
        } catch (u) {
          ;(a = [6, u]), (n = 0)
        } finally {
          r = o = 0
        }
      if (a[0] & 5) throw a[1]
      return { value: a[0] ? a[1] : void 0, done: !0 }
    }
  }
  function importNodeModule(t) {
    if (!t) throw new Error("import specifier is required")
    var e = new Function("name", "return import(name)")
    return e(t)
      .then(function (r) {
        return r.default
      })
      .catch(function (r) {
        throw (console.error("Error importing module ".concat(t, ":"), r), r)
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
        return _ts_generator(this, function (r) {
          switch (r.label) {
            case 0:
              return typeof fetch > "u"
                ? [4, importNodeModule("node-fetch")]
                : [3, 2]
            case 1:
              return (e = r.sent()), [2, (e == null ? void 0 : e.default) || e]
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
                          module: { exports: {} },
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
    return new Promise(function (r, n) {
      createScriptNode(
        t,
        function (o, s) {
          if (o) n(o)
          else {
            var i,
              l,
              c =
                (e == null || (i = e.attrs) === null || i === void 0
                  ? void 0
                  : i.globalName) ||
                "__FEDERATION_".concat(
                  e == null || (l = e.attrs) === null || l === void 0
                    ? void 0
                    : l.name,
                  ":custom__",
                ),
              a = (globalThis[c] = s)
            r(a)
          }
        },
        e.attrs,
        e.createScriptHook,
      )
    })
  }
  function matchRemoteWithNameAndExpose(t, e) {
    for (const r of t) {
      const n = e.startsWith(r.name)
      let o = e.replace(r.name, "")
      if (n) {
        if (o.startsWith("/")) {
          const l = r.name
          return (o = `.${o}`), { pkgNameOrAlias: l, expose: o, remote: r }
        } else if (o === "")
          return { pkgNameOrAlias: r.name, expose: ".", remote: r }
      }
      const s = r.alias && e.startsWith(r.alias)
      let i = r.alias && e.replace(r.alias, "")
      if (r.alias && s) {
        if (i && i.startsWith("/")) {
          const l = r.alias
          return (i = `.${i}`), { pkgNameOrAlias: l, expose: i, remote: r }
        } else if (i === "")
          return { pkgNameOrAlias: r.alias, expose: ".", remote: r }
      }
    }
  }
  function matchRemote(t, e) {
    for (const r of t) if (e === r.name || (r.alias && e === r.alias)) return r
  }
  function registerPlugins(t, e) {
    const r = getGlobalHostPlugins()
    r.length > 0 &&
      r.forEach((n) => {
        t != null && t.find((o) => o.name !== n.name) && t.push(n)
      }),
      t &&
        t.length > 0 &&
        t.forEach((n) => {
          e.forEach((o) => {
            o.applyPlugin(n)
          })
        })
  }
  function _extends$5() {
    return (
      (_extends$5 =
        Object.assign ||
        function (t) {
          for (var e = 1; e < arguments.length; e++) {
            var r = arguments[e]
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n])
          }
          return t
        }),
      _extends$5.apply(this, arguments)
    )
  }
  async function loadEsmEntry({ entry: t, remoteEntryExports: e }) {
    return new Promise((r, n) => {
      try {
        e
          ? r(e)
          : new Function(
              "callbacks",
              `import("${t}").then(callbacks[0]).catch(callbacks[1])`,
            )([r, n])
      } catch (o) {
        n(o)
      }
    })
  }
  async function loadEntryScript({
    name: t,
    globalName: e,
    entry: r,
    createScriptHook: n,
  }) {
    const { entryExports: o } = getRemoteEntryExports(t, e)
    return (
      o ||
      (typeof document > "u"
        ? loadScriptNode(r, {
            attrs: { name: t, globalName: e },
            createScriptHook: n,
          })
            .then(() => {
              const { remoteEntryKey: s, entryExports: i } =
                getRemoteEntryExports(t, e)
              return (
                assert(
                  i,
                  `
        Unable to use the ${t}'s '${r}' URL with ${s}'s globalName to get remoteEntry exports.
        Possible reasons could be:

        1. '${r}' is not the correct URL, or the remoteEntry resource or name is incorrect.

        2. ${s} cannot be used to get remoteEntry exports in the window object.
      `,
                ),
                i
              )
            })
            .catch((s) => s)
        : loadScript(r, { attrs: {}, createScriptHook: n })
            .then(() => {
              const { remoteEntryKey: s, entryExports: i } =
                getRemoteEntryExports(t, e)
              return (
                assert(
                  i,
                  `
      Unable to use the ${t}'s '${r}' URL with ${s}'s globalName to get remoteEntry exports.
      Possible reasons could be:

      1. '${r}' is not the correct URL, or the remoteEntry resource or name is incorrect.

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
    const { entry: e, name: r } = t
    return composeKeyWithSeparator(r, e)
  }
  async function getRemoteEntry({
    remoteEntryExports: t,
    remoteInfo: e,
    createScriptHook: r,
  }) {
    const { entry: n, name: o, type: s, entryGlobalName: i } = e,
      l = getRemoteEntryUniqueKey(e)
    return (
      t ||
      (globalLoading[l] ||
        (s === "esm"
          ? (globalLoading[l] = loadEsmEntry({
              entry: n,
              remoteEntryExports: t,
            }))
          : (globalLoading[l] = loadEntryScript({
              name: o,
              globalName: i,
              entry: n,
              createScriptHook: r,
            }))),
      globalLoading[l])
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
            var r = arguments[e]
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n])
          }
          return t
        }),
      _extends$4.apply(this, arguments)
    )
  }
  let Module = class {
    async getEntry() {
      if (this.remoteEntryExports) return this.remoteEntryExports
      const t = await getRemoteEntry({
        remoteInfo: this.remoteInfo,
        remoteEntryExports: this.remoteEntryExports,
        createScriptHook: (e) => {
          const r = this.host.loaderHook.lifecycle.createScript.emit({ url: e })
          if (typeof document > "u" || r instanceof HTMLScriptElement) return r
        },
      })
      return (
        assert(
          t,
          `remoteEntryExports is undefined 
 ${safeToString$1(this.remoteInfo)}`,
        ),
        (this.remoteEntryExports = t),
        this.remoteEntryExports
      )
    }
    async get(t, e) {
      const { loadFactory: r = !0 } = e || { loadFactory: !0 },
        n = await this.getEntry()
      if (!this.inited) {
        const s = this.host.shareScopeMap,
          i = this.remoteInfo.shareScope || "default"
        s[i] || (s[i] = {})
        const l = s[i],
          c = [],
          a = { version: this.remoteInfo.version || "" }
        Object.defineProperty(a, "hostId", {
          value: this.host.options.id || this.host.name,
          enumerable: !1,
        })
        const u = await this.host.hooks.lifecycle.beforeInitContainer.emit({
          shareScope: l,
          remoteEntryInitOptions: a,
          initScope: c,
          remoteInfo: this.remoteInfo,
          origin: this.host,
        })
        await n.init(u.shareScope, u.initScope, u.remoteEntryInitOptions),
          await this.host.hooks.lifecycle.initContainer.emit(
            _extends$4({}, u, { remoteEntryExports: n }),
          )
      }
      ;(this.lib = n), (this.inited = !0)
      const o = await n.get(t)
      return (
        assert(o, `${getFMId(this.remoteInfo)} remote don't export ${t}.`),
        r ? await o() : o
      )
    }
    constructor({ remoteInfo: t, host: e }) {
      ;(this.inited = !1),
        (this.lib = void 0),
        (this.remoteInfo = t),
        (this.host = e)
    }
  }
  class SyncHook {
    on(e) {
      typeof e == "function" && this.listeners.add(e)
    }
    once(e) {
      const r = this
      this.on(function n(...o) {
        return r.remove(n), e.apply(null, o)
      })
    }
    emit(...e) {
      let r
      return (
        this.listeners.size > 0 &&
          this.listeners.forEach((n) => {
            r = n(...e)
          }),
        r
      )
    }
    remove(e) {
      this.listeners.delete(e)
    }
    removeAll() {
      this.listeners.clear()
    }
    constructor(e) {
      ;(this.type = ""), (this.listeners = new Set()), e && (this.type = e)
    }
  }
  class AsyncHook extends SyncHook {
    emit(...e) {
      let r
      const n = Array.from(this.listeners)
      if (n.length > 0) {
        let o = 0
        const s = (i) =>
          i === !1
            ? !1
            : o < n.length
            ? Promise.resolve(n[o++].apply(null, e)).then(s)
            : i
        r = s()
      }
      return Promise.resolve(r)
    }
  }
  function checkReturnData(t, e) {
    if (!isObject(e)) return !1
    if (t !== e) {
      for (const r in t) if (!(r in e)) return !1
    }
    return !0
  }
  class SyncWaterfallHook extends SyncHook {
    emit(e) {
      isObject(e) ||
        error(`The data for the "${this.type}" hook should be an object.`)
      for (const r of this.listeners)
        try {
          const n = r(e)
          if (checkReturnData(e, n)) e = n
          else {
            this.onerror(
              `A plugin returned an unacceptable value for the "${this.type}" type.`,
            )
            break
          }
        } catch (n) {
          warn$1(n), this.onerror(n)
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
        error(
          `The response data for the "${this.type}" hook must be an object.`,
        )
      const r = Array.from(this.listeners)
      if (r.length > 0) {
        let n = 0
        const o = (i) => (warn$1(i), this.onerror(i), e),
          s = (i) => {
            if (checkReturnData(e, i)) {
              if (((e = i), n < r.length))
                try {
                  return Promise.resolve(r[n++](e)).then(s, o)
                } catch (l) {
                  return o(l)
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
      const r = e.name
      assert(r, "A name must be provided by the plugin."),
        this.registerPlugins[r] ||
          ((this.registerPlugins[r] = e),
          Object.keys(this.lifecycle).forEach((n) => {
            const o = e[n]
            o && this.lifecycle[n].on(o)
          }))
    }
    removePlugin(e) {
      assert(e, "A name is required.")
      const r = this.registerPlugins[e]
      assert(r, `The plugin "${e}" is not registered.`),
        Object.keys(r).forEach((n) => {
          n !== "name" && this.lifecycle[n].remove(r[n])
        })
    }
    inherit({ lifecycle: e, registerPlugins: r }) {
      Object.keys(e).forEach((n) => {
        assert(
          !this.lifecycle[n],
          `The hook "${n}" has a conflict and cannot be inherited.`,
        ),
          (this.lifecycle[n] = e[n])
      }),
        Object.keys(r).forEach((n) => {
          assert(
            !this.registerPlugins[n],
            `The plugin "${n}" has a conflict and cannot be inherited.`,
          ),
            this.applyPlugin(r[n])
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
            var r = arguments[e]
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n])
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
    return e.map((r) => {
      const n = matchRemote(t, r.nameOrAlias)
      return (
        assert(
          n,
          `Unable to preload ${r.nameOrAlias} as it is not included in ${
            !n && safeToString$1({ remoteInfo: n, remotes: t })
          }`,
        ),
        { remote: n, preloadConfig: defaultPreloadArgs(r) }
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
  function preloadAssets(t, e, r) {
    const { cssAssets: n, jsAssetsWithoutEntry: o, entryAssets: s } = r
    if (e.options.inBrowser) {
      s.forEach((l) => {
        const { moduleInfo: c } = l,
          a = e.moduleCache.get(t.name)
        getRemoteEntry(
          a
            ? {
                remoteInfo: c,
                remoteEntryExports: a.remoteEntryExports,
                createScriptHook: (u) => {
                  const d = e.loaderHook.lifecycle.createScript.emit({ url: u })
                  if (d instanceof HTMLScriptElement) return d
                },
              }
            : {
                remoteInfo: c,
                remoteEntryExports: void 0,
                createScriptHook: (u) => {
                  const d = e.loaderHook.lifecycle.createScript.emit({ url: u })
                  if (d instanceof HTMLScriptElement) return d
                },
              },
        )
      })
      const i = document.createDocumentFragment()
      n.forEach((l) => {
        const { link: c, needAttach: a } = createLink(
          l,
          () => {},
          { rel: "preload", as: "style" },
          (u) => {
            const d = e.loaderHook.lifecycle.createLink.emit({ url: u })
            if (d instanceof HTMLLinkElement) return d
          },
        )
        a && i.appendChild(c)
      }),
        o.forEach((l) => {
          const { link: c, needAttach: a } = createLink(
            l,
            () => {},
            { rel: "preload", as: "script" },
            (u) => {
              const d = e.loaderHook.lifecycle.createLink.emit({ url: u })
              if (d instanceof HTMLLinkElement) return d
            },
          )
          a && document.head.appendChild(c)
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
            var r = arguments[e]
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n])
          }
          return t
        }),
      _extends$2.apply(this, arguments)
    )
  }
  function assignRemoteInfo(t, e) {
    ;(!("remoteEntry" in e) || !e.remoteEntry) &&
      error(`The attribute remoteEntry of ${name} must not be undefined.`)
    const { remoteEntry: r } = e,
      n = getResourceUrl(e, r)
    ;(t.type = e.remoteEntryType),
      (t.entryGlobalName = e.globalName),
      (t.entry = n),
      (t.version = e.version),
      (t.buildVersion = e.buildVersion)
  }
  function snapshotPlugin() {
    return {
      name: "snapshot-plugin",
      async afterResolve(t) {
        const {
          remote: e,
          pkgNameOrAlias: r,
          expose: n,
          origin: o,
          remoteInfo: s,
        } = t
        if (!isRemoteInfoWithEntry(e) || !isPureRemoteEntry(e)) {
          const { remoteSnapshot: i, globalSnapshot: l } =
            await o.snapshotHandler.loadRemoteSnapshotInfo(e)
          assignRemoteInfo(s, i)
          const c = {
              remote: e,
              preloadConfig: {
                nameOrAlias: r,
                exposes: [n],
                resourceCategory: "sync",
                share: !1,
                depsRemote: !1,
              },
            },
            a = await o.hooks.lifecycle.generatePreloadAssets.emit({
              origin: o,
              preloadOptions: c,
              remoteInfo: s,
              remote: e,
              remoteSnapshot: i,
              globalSnapshot: l,
            })
          return (
            a && preloadAssets(s, o, a),
            _extends$2({}, t, { remoteSnapshot: i })
          )
        }
        return t
      },
    }
  }
  function splitId(t) {
    const e = t.split(":")
    return e.length === 1
      ? { name: e[0], version: void 0 }
      : e.length === 2
      ? { name: e[0], version: e[1] }
      : { name: e[1], version: e[2] }
  }
  function traverseModuleInfo(t, e, r, n, o = {}, s) {
    const i = getFMId(e),
      { value: l } = getInfoWithoutType(t, i),
      c = s || l
    if (c && !isManifestProvider(c) && (r(c, e, n), c.remotesInfo)) {
      const a = Object.keys(c.remotesInfo)
      for (const u of a) {
        if (o[u]) continue
        o[u] = !0
        const d = splitId(u),
          m = c.remotesInfo[u]
        traverseModuleInfo(
          t,
          { name: d.name, version: m.matchedVersion },
          r,
          !1,
          o,
          void 0,
        )
      }
    }
  }
  function generatePreloadAssets(t, e, r, n, o) {
    const s = [],
      i = [],
      l = [],
      c = new Set(),
      a = new Set(),
      { options: u } = t,
      { preloadConfig: d } = e,
      { depsRemote: m } = d
    traverseModuleInfo(
      n,
      r,
      (h, M, A) => {
        let g
        if (A) g = d
        else if (Array.isArray(m)) {
          const y = m.find(
            (_) => _.nameOrAlias === M.name || _.nameOrAlias === M.alias,
          )
          if (!y) return
          g = defaultPreloadArgs(y)
        } else if (m === !0) g = d
        else return
        const I = getResourceUrl(h, "remoteEntry" in h ? h.remoteEntry : "")
        I &&
          l.push({
            name: M.name,
            moduleInfo: {
              name: M.name,
              entry: I,
              type: "remoteEntryType" in h ? h.remoteEntryType : "global",
              entryGlobalName: "globalName" in h ? h.globalName : M.name,
              shareScope: "",
              version: "version" in h ? h.version : void 0,
            },
            url: I,
          })
        let b = "modules" in h ? h.modules : []
        const E = normalizePreloadExposes(g.exposes)
        if (E.length && "modules" in h) {
          var x
          b =
            h == null || (x = h.modules) == null
              ? void 0
              : x.reduce(
                  (y, _) => (
                    (E == null ? void 0 : E.indexOf(_.moduleName)) !== -1 &&
                      y.push(_),
                    y
                  ),
                  [],
                )
        }
        function O(y) {
          const _ = y.map((N) => getResourceUrl(h, N))
          return g.filter ? _.filter(g.filter) : _
        }
        if (b) {
          const y = b.length
          for (let _ = 0; _ < y; _++) {
            const N = b[_],
              T = `${M.name}/${N.moduleName}`
            t.hooks.lifecycle.handlePreloadModule.emit({
              id: N.moduleName === "." ? M.name : T,
              name: M.name,
              remoteSnapshot: h,
              preloadConfig: g,
              remote: M,
              origin: t,
            }),
              !getPreloaded(T) &&
                (g.resourceCategory === "all"
                  ? (s.push(...O(N.assets.css.async)),
                    s.push(...O(N.assets.css.sync)),
                    i.push(...O(N.assets.js.async)),
                    i.push(...O(N.assets.js.sync)))
                  : (g.resourceCategory = "sync") &&
                    (s.push(...O(N.assets.css.sync)),
                    i.push(...O(N.assets.js.sync))),
                setPreloaded(T))
          }
        }
      },
      !0,
      {},
      o,
    ),
      o.shared &&
        o.shared.forEach((h) => {
          var M
          const A = (M = u.shared) == null ? void 0 : M[h.sharedName]
          if (!A) return
          const g = getRegisteredShare(
            t.shareScopeMap,
            h.sharedName,
            A,
            t.hooks.lifecycle.resolveShare,
          )
          g &&
            typeof g.lib == "function" &&
            (h.assets.js.sync.forEach((I) => {
              c.add(I)
            }),
            h.assets.css.sync.forEach((I) => {
              a.add(I)
            }))
        })
    const p = i.filter((h) => !c.has(h))
    return {
      cssAssets: s.filter((h) => !a.has(h)),
      jsAssetsWithoutEntry: p,
      entryAssets: l,
    }
  }
  const generatePreloadAssetsPlugin = function () {
    return {
      name: "generate-preload-assets-plugin",
      async generatePreloadAssets(t) {
        const {
          origin: e,
          preloadOptions: r,
          remoteInfo: n,
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
                    name: n.name,
                    entry: o.entry,
                    type: "global",
                    entryGlobalName: "",
                    shareScope: "",
                  },
                },
              ],
            }
          : (assignRemoteInfo(n, i), generatePreloadAssets(e, r, n, s, i))
      },
    }
  }
  function _extends$1() {
    return (
      (_extends$1 =
        Object.assign ||
        function (t) {
          for (var e = 1; e < arguments.length; e++) {
            var r = arguments[e]
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n])
          }
          return t
        }),
      _extends$1.apply(this, arguments)
    )
  }
  class SnapshotHandler {
    async loadSnapshot(e) {
      const { options: r } = this.HostInstance,
        {
          hostGlobalSnapshot: n,
          remoteSnapshot: o,
          globalSnapshot: s,
        } = this.getGlobalRemoteInfo(e),
        { remoteSnapshot: i, globalSnapshot: l } =
          await this.hooks.lifecycle.loadSnapshot.emit({
            options: r,
            moduleInfo: e,
            hostGlobalSnapshot: n,
            remoteSnapshot: o,
            globalSnapshot: s,
          })
      return { remoteSnapshot: i, globalSnapshot: l }
    }
    async loadRemoteSnapshotInfo(e) {
      const { options: r } = this.HostInstance
      await this.hooks.lifecycle.beforeLoadRemoteSnapshot.emit({
        options: r,
        moduleInfo: e,
      })
      let n = getGlobalSnapshotInfoByModuleInfo({
        name: this.HostInstance.options.name,
        version: this.HostInstance.options.version,
      })
      n ||
        ((n = {
          version: this.HostInstance.options.version || "",
          remoteEntry: "",
          remotesInfo: {},
        }),
        addGlobalSnapshot({ [this.HostInstance.options.name]: n })),
        n &&
          "remotesInfo" in n &&
          !getInfoWithoutType(n.remotesInfo, e.name).value &&
          ("version" in e || "entry" in e) &&
          (n.remotesInfo = _extends$1({}, n == null ? void 0 : n.remotesInfo, {
            [e.name]: { matchedVersion: "version" in e ? e.version : e.entry },
          }))
      const {
          hostGlobalSnapshot: o,
          remoteSnapshot: s,
          globalSnapshot: i,
        } = this.getGlobalRemoteInfo(e),
        { remoteSnapshot: l, globalSnapshot: c } =
          await this.hooks.lifecycle.loadSnapshot.emit({
            options: r,
            moduleInfo: e,
            hostGlobalSnapshot: o,
            remoteSnapshot: s,
            globalSnapshot: i,
          })
      if (l)
        if (isManifestProvider(l)) {
          const a = await this.getManifestJson(l.remoteEntry, e, {}),
            u = setGlobalSnapshotInfoByModuleInfo(
              _extends$1({}, e, { entry: l.remoteEntry }),
              a,
            )
          return { remoteSnapshot: a, globalSnapshot: u }
        } else {
          const { remoteSnapshot: a } =
            await this.hooks.lifecycle.loadRemoteSnapshot.emit({
              options: this.HostInstance.options,
              moduleInfo: e,
              remoteSnapshot: l,
              from: "global",
            })
          return { remoteSnapshot: a, globalSnapshot: c }
        }
      else if (isRemoteInfoWithEntry(e)) {
        const a = await this.getManifestJson(e.entry, e, {}),
          u = setGlobalSnapshotInfoByModuleInfo(e, a),
          { remoteSnapshot: d } =
            await this.hooks.lifecycle.loadRemoteSnapshot.emit({
              options: this.HostInstance.options,
              moduleInfo: e,
              remoteSnapshot: a,
              from: "global",
            })
        return { remoteSnapshot: d, globalSnapshot: u }
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
      const r = getGlobalSnapshotInfoByModuleInfo({
          name: this.HostInstance.options.name,
          version: this.HostInstance.options.version,
        }),
        n =
          r &&
          "remotesInfo" in r &&
          r.remotesInfo &&
          getInfoWithoutType(r.remotesInfo, e.name).value
      return n && n.matchedVersion
        ? {
            hostGlobalSnapshot: r,
            globalSnapshot: getGlobalSnapshot(),
            remoteSnapshot: getGlobalSnapshotInfoByModuleInfo({
              name: e.name,
              version: n.matchedVersion,
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
    async getManifestJson(e, r, n) {
      const o = async () => {
          let i = this.manifestCache.get(e)
          if (i) return i
          try {
            let l = await this.loaderHook.lifecycle.fetch.emit(e, {})
            return (
              (!l || !(l instanceof Response)) && (l = await fetch(e, {})),
              (i = await l.json()),
              assert(
                i.metaData && i.exposes && i.shared,
                `${e} is not a federation manifest`,
              ),
              this.manifestCache.set(e, i),
              i
            )
          } catch (l) {
            error(`Failed to get manifestJson for ${r.name}. The manifest URL is ${e}. Please ensure that the manifestUrl is accessible.
          
 Error message:
          
 ${l}`)
          }
        },
        s = async () => {
          const i = await o(),
            l = generateSnapshotFromManifest(i, { version: e }),
            { remoteSnapshot: c } =
              await this.hooks.lifecycle.loadRemoteSnapshot.emit({
                options: this.HostInstance.options,
                moduleInfo: r,
                manifestJson: i,
                remoteSnapshot: l,
                manifestUrl: e,
                from: "manifest",
              })
          return c
        }
      return (
        this.manifestLoading[e] ||
          (this.manifestLoading[e] = s().then((i) => i)),
        this.manifestLoading[e]
      )
    }
    constructor(e) {
      ;(this.loadingHostSnapshot = null),
        (this.manifestCache = new Map()),
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
            var r = arguments[e]
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n])
          }
          return t
        }),
      _extends.apply(this, arguments)
    )
  }
  function _object_without_properties_loose(t, e) {
    if (t == null) return {}
    var r = {},
      n = Object.keys(t),
      o,
      s
    for (s = 0; s < n.length; s++)
      (o = n[s]), !(e.indexOf(o) >= 0) && (r[o] = t[o])
    return r
  }
  class FederationHost {
    _setGlobalShareScopeMap() {
      const e = getGlobalShareScope(),
        r = this.options.id || this.options.name
      r && !e[r] && (e[r] = this.shareScopeMap)
    }
    initOptions(e) {
      this.registerPlugins(e.plugins)
      const r = this.formatOptions(this.options, e)
      return (this.options = r), r
    }
    async loadShare(e, r) {
      var n
      const o = Object.assign(
        {},
        (n = this.options.shared) == null ? void 0 : n[e],
        r,
      )
      o != null &&
        o.scope &&
        (await Promise.all(
          o.scope.map(async (a) => {
            await Promise.all(this.initializeSharing(a, o.strategy))
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
      const l = getRegisteredShare(
          this.shareScopeMap,
          e,
          i,
          this.hooks.lifecycle.resolveShare,
        ),
        c = (a) => {
          a.useIn || (a.useIn = []), addUniqueItem(a.useIn, this.options.name)
        }
      if (l && l.lib) return c(l), l.lib
      if (l && l.loading && !l.loaded) {
        const a = await l.loading
        return (l.loaded = !0), l.lib || (l.lib = a), c(l), a
      } else if (l) {
        const a = (async () => {
          const u = await l.get()
          ;(i.lib = u), (i.loaded = !0), c(i)
          const d = getRegisteredShare(
            this.shareScopeMap,
            e,
            i,
            this.hooks.lifecycle.resolveShare,
          )
          return d && ((d.lib = u), (d.loaded = !0)), u
        })()
        return (
          this.setShared({
            pkgName: e,
            loaded: !1,
            shared: l,
            from: this.options.name,
            lib: null,
            loading: a,
          }),
          a
        )
      } else {
        if (r) return !1
        const a = (async () => {
          const u = await i.get()
          ;(i.lib = u), (i.loaded = !0), c(i)
          const d = getRegisteredShare(
            this.shareScopeMap,
            e,
            i,
            this.hooks.lifecycle.resolveShare,
          )
          return d && ((d.lib = u), (d.loaded = !0)), u
        })()
        return (
          this.setShared({
            pkgName: e,
            loaded: !1,
            shared: i,
            from: this.options.name,
            lib: null,
            loading: a,
          }),
          a
        )
      }
    }
    loadShareSync(e, r) {
      var n
      const o = Object.assign(
        {},
        (n = this.options.shared) == null ? void 0 : n[e],
        r,
      )
      o != null &&
        o.scope &&
        o.scope.forEach((l) => {
          this.initializeSharing(l, o.strategy)
        })
      const s = getRegisteredShare(
          this.shareScopeMap,
          e,
          o,
          this.hooks.lifecycle.resolveShare,
        ),
        i = (l) => {
          l.useIn || (l.useIn = []), addUniqueItem(l.useIn, this.options.name)
        }
      if (s) {
        if (typeof s.lib == "function")
          return (
            i(s),
            s.loaded ||
              ((s.loaded = !0),
              s.from === this.options.name && (o.loaded = !0)),
            s.lib
          )
        if (typeof s.get == "function") {
          const l = s.get()
          if (!(l instanceof Promise))
            return (
              i(s),
              this.setShared({
                pkgName: e,
                loaded: !0,
                from: this.options.name,
                lib: l,
                shared: s,
              }),
              l
            )
        }
      }
      if (o.lib) return o.loaded || (o.loaded = !0), o.lib
      if (o.get) {
        const l = o.get()
        if (l instanceof Promise)
          throw new Error(`
        The loadShareSync function was unable to load ${e}. The ${e} could not be found in ${this.options.name}.
        Possible reasons for failure: 

        1. The ${e} share was registered with the 'get' attribute, but loadShare was not used beforehand.

        2. The ${e} share was not registered with the 'lib' attribute.

      `)
        return (
          (o.lib = l),
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
    initRawContainer(e, r, n) {
      const o = getRemoteInfo({ name: e, entry: r }),
        s = new Module({ host: this, remoteInfo: o })
      return (s.remoteEntryExports = n), this.moduleCache.set(e, s), s
    }
    async _getRemoteModuleAndOptions(e) {
      const r = await this.hooks.lifecycle.beforeRequest.emit({
          id: e,
          options: this.options,
          origin: this,
        }),
        { id: n } = r,
        o = matchRemoteWithNameAndExpose(this.options.remotes, n)
      assert(
        o,
        `
        Unable to locate ${n} in ${
          this.options.name
        }. Potential reasons for failure include:

        1. ${n} was not included in the 'remotes' parameter of ${
          this.options.name || "the host"
        }.

        2. ${n} could not be found in the 'remotes' of ${
          this.options.name
        } with either 'name' or 'alias' attributes.
        3. ${n} is not online, injected, or loaded.
        4. ${n}  cannot be accessed on the expected.
        5. The 'beforeRequest' hook was provided but did not return the correct 'remoteInfo' when attempting to load ${n}.
      `,
      )
      const { remote: s } = o,
        i = getRemoteInfo(s),
        l = await this.hooks.lifecycle.afterResolve.emit(
          _extends({ id: n }, o, {
            options: this.options,
            origin: this,
            remoteInfo: i,
          }),
        ),
        { remote: c, expose: a } = l
      assert(
        c && a,
        `The 'beforeRequest' hook was executed, but it failed to return the correct 'remote' and 'expose' values while loading ${n}.`,
      )
      let u = this.moduleCache.get(c.name)
      const d = { host: this, remoteInfo: i }
      return (
        u || ((u = new Module(d)), this.moduleCache.set(c.name, u)),
        { module: u, moduleOptions: d, remoteMatchInfo: l }
      )
    }
    async loadRemote(e, r) {
      try {
        const { loadFactory: n = !0 } = r || { loadFactory: !0 },
          {
            module: o,
            moduleOptions: s,
            remoteMatchInfo: i,
          } = await this._getRemoteModuleAndOptions(e),
          { pkgNameOrAlias: l, remote: c, expose: a, id: u } = i,
          d = await o.get(a, r),
          m = await this.hooks.lifecycle.onLoad.emit({
            id: u,
            pkgNameOrAlias: l,
            expose: a,
            exposeModule: n ? d : void 0,
            exposeModuleFactory: n ? void 0 : d,
            remote: c,
            options: s,
            moduleInstance: o,
            origin: this,
          })
        return typeof m == "function" ? m : d
      } catch (n) {
        const { from: o = "runtime" } = r || { from: "runtime" },
          s = await this.hooks.lifecycle.errorLoadRemote.emit({
            id: e,
            error: n,
            from: o,
            origin: this,
          })
        if (!s) throw n
        return s
      }
    }
    async preloadRemote(e) {
      await this.hooks.lifecycle.beforePreloadRemote.emit({
        preloadOptions: e,
        options: this.options,
        origin: this,
      })
      const r = formatPreloadArgs(this.options.remotes, e)
      await Promise.all(
        r.map(async (n) => {
          const { remote: o } = n,
            s = getRemoteInfo(o),
            { globalSnapshot: i, remoteSnapshot: l } =
              await this.snapshotHandler.loadRemoteSnapshotInfo(o),
            c = await this.hooks.lifecycle.generatePreloadAssets.emit({
              origin: this,
              preloadOptions: n,
              remote: o,
              remoteInfo: s,
              globalSnapshot: i,
              remoteSnapshot: l,
            })
          !c || preloadAssets(s, this, c)
        }),
      )
    }
    initializeSharing(e = DEFAULT_SCOPE, r) {
      const n = this.shareScopeMap,
        o = this.options.name
      n[e] || (n[e] = {})
      const s = n[e],
        i = (u, d) => {
          var m
          const { version: p, eager: h } = d
          s[u] = s[u] || {}
          const M = s[u],
            A = M[p],
            g = Boolean(
              A &&
                (A.eager || ((m = A.shareConfig) == null ? void 0 : m.eager)),
            )
          ;(!A ||
            (A.strategy !== "loaded-first" &&
              !A.loaded &&
              (Boolean(!h) !== !g ? h : o > A.from))) &&
            (M[p] = d)
        },
        l = [],
        c = (u) => u && u.init && u.init(n[e]),
        a = async (u) => {
          const { module: d } = await this._getRemoteModuleAndOptions(u)
          if (d.getEntry) {
            const m = await d.getEntry()
            d.inited || (c(m), (d.inited = !0))
          }
        }
      return (
        Object.keys(this.options.shared).forEach((u) => {
          const d = this.options.shared[u]
          d.scope.includes(e) && i(u, d)
        }),
        r === "version-first" &&
          this.options.remotes.forEach((u) => {
            u.shareScope === e && l.push(a(u.name))
          }),
        l
      )
    }
    initShareScopeMap(e, r) {
      ;(this.shareScopeMap[e] = r),
        this.hooks.lifecycle.initContainerShareScopeMap.emit({
          shareScope: r,
          options: this.options,
          origin: this,
        })
    }
    formatOptions(e, r) {
      const n = formatShareConfigs(r.shared || {}, r.name),
        o = _extends({}, e.shared, n),
        { userOptions: s, options: i } = this.hooks.lifecycle.beforeInit.emit({
          origin: this,
          userOptions: r,
          options: e,
          shareInfo: o,
        }),
        l = (s.remotes || []).reduce(
          (u, d) => (this.registerRemote(d, u, { force: !1 }), u),
          i.remotes,
        )
      Object.keys(n).forEach((u) => {
        const d = n[u]
        !getRegisteredShare(
          this.shareScopeMap,
          u,
          d,
          this.hooks.lifecycle.resolveShare,
        ) &&
          d &&
          d.lib &&
          this.setShared({
            pkgName: u,
            lib: d.lib,
            get: d.get,
            loaded: !0,
            shared: d,
            from: r.name,
          })
      })
      const c = [...i.plugins]
      s.plugins &&
        s.plugins.forEach((u) => {
          c.includes(u) || c.push(u)
        })
      const a = _extends({}, e, r, { plugins: c, remotes: l, shared: o })
      return this.hooks.lifecycle.init.emit({ origin: this, options: a }), a
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
      shared: r,
      from: n,
      lib: o,
      loading: s,
      loaded: i,
      get: l,
    }) {
      const { version: c, scope: a = "default" } = r,
        u = _object_without_properties_loose(r, ["version", "scope"])
      ;(Array.isArray(a) ? a : [a]).forEach((d) => {
        this.shareScopeMap[d] || (this.shareScopeMap[d] = {}),
          this.shareScopeMap[d][e] || (this.shareScopeMap[d][e] = {}),
          !this.shareScopeMap[d][e][c] &&
            ((this.shareScopeMap[d][e][c] = _extends(
              { version: c, scope: ["default"] },
              u,
              { lib: o, loaded: i, loading: s },
            )),
            l && (this.shareScopeMap[d][e][c].get = l))
      })
    }
    removeRemote(e) {
      const { name: r } = e,
        n = this.options.remotes.findIndex((s) => s.name === r)
      n !== -1 && this.options.remotes.splice(n, 1)
      const o = this.moduleCache.get(e.name)
      if (o) {
        const s = o.remoteInfo.entryGlobalName
        globalThis[s] && delete globalThis[s]
        const i = getRemoteEntryUniqueKey(o.remoteInfo)
        globalLoading[i] && delete globalLoading[i],
          this.moduleCache.delete(e.name)
      }
    }
    registerRemote(e, r, n) {
      const o = () => {
          if (e.alias) {
            const i = r.find((l) => {
              var c
              return (
                e.alias &&
                (l.name.startsWith(e.alias) ||
                  ((c = l.alias) == null ? void 0 : c.startsWith(e.alias)))
              )
            })
            assert(
              !i,
              `The alias ${e.alias} of remote ${
                e.name
              } is not allowed to be the prefix of ${
                i && i.name
              } name or alias`,
            )
          }
          "entry" in e &&
            isBrowserEnv$1() &&
            !e.entry.startsWith("http") &&
            (e.entry = new URL(e.entry, window.location.origin).href),
            e.shareScope || (e.shareScope = DEFAULT_SCOPE),
            e.type || (e.type = DEFAULT_REMOTE_TYPE)
        },
        s = r.find((i) => i.name === e.name)
      if (!s) o(), r.push(e)
      else {
        const i = [
          `The remote "${e.name}" is already registered.`,
          n != null && n.force
            ? "Hope you have known that OVERRIDE it may have some unexpected errors"
            : 'If you want to merge the remote, you can set "force: true".',
        ]
        n != null && n.force && (this.removeRemote(s), o(), r.push(e)),
          warn$1(i.join(" "))
      }
    }
    registerRemotes(e, r) {
      e.forEach((n) => {
        this.registerRemote(n, this.options.remotes, {
          force: r == null ? void 0 : r.force,
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
        (this.moduleCache = new Map()),
        (this.loaderHook = new PluginSystem({
          getModuleInfo: new SyncHook(),
          createScript: new SyncHook(),
          createLink: new SyncHook(),
          fetch: new AsyncHook("fetch"),
        }))
      const r = {
        id: getBuilderId(),
        name: e.name,
        plugins: [snapshotPlugin(), generatePreloadAssetsPlugin()],
        remotes: [],
        shared: {},
        inBrowser: isBrowserEnv$1(),
      }
      ;(this.name = e.name),
        (this.options = r),
        (this.shareScopeMap = {}),
        this._setGlobalShareScopeMap(),
        (this.snapshotHandler = new SnapshotHandler(this)),
        this.registerPlugins([...r.plugins, ...(e.plugins || [])]),
        (this.options = this.formatOptions(r, e))
    }
  }
  let FederationInstance = null
  function init(t) {
    const e = getGlobalFederationInstance(t.name, t.version)
    if (e)
      return e.initOptions(t), FederationInstance || (FederationInstance = e), e
    {
      const r = getGlobalFederationConstructor() || FederationHost
      return (
        (FederationInstance = new r(t)),
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
  function __awaiter(t, e, r, n) {
    function o(s) {
      return s instanceof r
        ? s
        : new r(function (i) {
            i(s)
          })
    }
    return new (r || (r = Promise))(function (s, i) {
      function l(u) {
        try {
          a(n.next(u))
        } catch (d) {
          i(d)
        }
      }
      function c(u) {
        try {
          a(n.throw(u))
        } catch (d) {
          i(d)
        }
      }
      function a(u) {
        u.done ? s(u.value) : o(u.value).then(l, c)
      }
      a((n = n.apply(t, e || [])).next())
    })
  }
  function __generator(t, e) {
    var r = {
        label: 0,
        sent: function () {
          if (s[0] & 1) throw s[1]
          return s[1]
        },
        trys: [],
        ops: [],
      },
      n,
      o,
      s,
      i
    return (
      (i = { next: l(0), throw: l(1), return: l(2) }),
      typeof Symbol == "function" &&
        (i[Symbol.iterator] = function () {
          return this
        }),
      i
    )
    function l(a) {
      return function (u) {
        return c([a, u])
      }
    }
    function c(a) {
      if (n) throw new TypeError("Generator is already executing.")
      for (; r; )
        try {
          if (
            ((n = 1),
            o &&
              (s =
                a[0] & 2
                  ? o.return
                  : a[0]
                  ? o.throw || ((s = o.return) && s.call(o), 0)
                  : o.next) &&
              !(s = s.call(o, a[1])).done)
          )
            return s
          switch (((o = 0), s && (a = [a[0] & 2, s.value]), a[0])) {
            case 0:
            case 1:
              s = a
              break
            case 4:
              return r.label++, { value: a[1], done: !1 }
            case 5:
              r.label++, (o = a[1]), (a = [0])
              continue
            case 7:
              ;(a = r.ops.pop()), r.trys.pop()
              continue
            default:
              if (
                ((s = r.trys),
                !(s = s.length > 0 && s[s.length - 1]) &&
                  (a[0] === 6 || a[0] === 2))
              ) {
                r = 0
                continue
              }
              if (a[0] === 3 && (!s || (a[1] > s[0] && a[1] < s[3]))) {
                r.label = a[1]
                break
              }
              if (a[0] === 6 && r.label < s[1]) {
                ;(r.label = s[1]), (s = a)
                break
              }
              if (s && r.label < s[2]) {
                ;(r.label = s[2]), r.ops.push(a)
                break
              }
              s[2] && r.ops.pop(), r.trys.pop()
              continue
          }
          a = e.call(t, r)
        } catch (u) {
          ;(a = [6, u]), (o = 0)
        } finally {
          n = s = 0
        }
      if (a[0] & 5) throw a[1]
      return { value: a[0] ? a[1] : void 0, done: !0 }
    }
  }
  var E_CANCELED = new Error("request for lock canceled"),
    Semaphore = (function () {
      function t(e, r) {
        r === void 0 && (r = E_CANCELED),
          (this._value = e),
          (this._cancelError = r),
          (this._queue = []),
          (this._weightedWaiters = [])
      }
      return (
        (t.prototype.acquire = function (e, r) {
          var n = this
          if ((e === void 0 && (e = 1), r === void 0 && (r = 0), e <= 0))
            throw new Error("invalid weight ".concat(e, ": must be positive"))
          return new Promise(function (o, s) {
            var i = { resolve: o, reject: s, weight: e, priority: r },
              l = findIndexFromEnd(n._queue, function (c) {
                return r <= c.priority
              })
            l === -1 && e <= n._value
              ? n._dispatchItem(i)
              : n._queue.splice(l + 1, 0, i)
          })
        }),
        (t.prototype.runExclusive = function (e) {
          return __awaiter(this, arguments, void 0, function (r, n, o) {
            var s, i, l
            return (
              n === void 0 && (n = 1),
              o === void 0 && (o = 0),
              __generator(this, function (c) {
                switch (c.label) {
                  case 0:
                    return [4, this.acquire(n, o)]
                  case 1:
                    ;(s = c.sent()), (i = s[0]), (l = s[1]), (c.label = 2)
                  case 2:
                    return c.trys.push([2, , 4, 5]), [4, r(i)]
                  case 3:
                    return [2, c.sent()]
                  case 4:
                    return l(), [7]
                  case 5:
                    return [2]
                }
              })
            )
          })
        }),
        (t.prototype.waitForUnlock = function (e, r) {
          var n = this
          if ((e === void 0 && (e = 1), r === void 0 && (r = 0), e <= 0))
            throw new Error("invalid weight ".concat(e, ": must be positive"))
          return this._couldLockImmediately(e, r)
            ? Promise.resolve()
            : new Promise(function (o) {
                n._weightedWaiters[e - 1] || (n._weightedWaiters[e - 1] = []),
                  insertSorted(n._weightedWaiters[e - 1], {
                    resolve: o,
                    priority: r,
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
          this._queue.forEach(function (r) {
            return r.reject(e._cancelError)
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
          var r = this._value
          ;(this._value -= e.weight),
            e.resolve([r, this._newReleaser(e.weight)])
        }),
        (t.prototype._newReleaser = function (e) {
          var r = this,
            n = !1
          return function () {
            n || ((n = !0), r.release(e))
          }
        }),
        (t.prototype._drainUnlockWaiters = function () {
          if (this._queue.length === 0)
            for (var e = this._value; e > 0; e--) {
              var r = this._weightedWaiters[e - 1]
              !r ||
                (r.forEach(function (s) {
                  return s.resolve()
                }),
                (this._weightedWaiters[e - 1] = []))
            }
          else
            for (var n = this._queue[0].priority, e = this._value; e > 0; e--) {
              var r = this._weightedWaiters[e - 1]
              if (r) {
                var o = r.findIndex(function (l) {
                  return l.priority <= n
                })
                ;(o === -1 ? r : r.splice(0, o)).forEach(function (l) {
                  return l.resolve()
                })
              }
            }
        }),
        (t.prototype._couldLockImmediately = function (e, r) {
          return (
            (this._queue.length === 0 || this._queue[0].priority < r) &&
            e <= this._value
          )
        }),
        t
      )
    })()
  function insertSorted(t, e) {
    var r = findIndexFromEnd(t, function (n) {
      return e.priority <= n.priority
    })
    t.splice(r + 1, 0, e)
  }
  function findIndexFromEnd(t, e) {
    for (var r = t.length - 1; r >= 0; r--) if (e(t[r])) return r
    return -1
  }
  var Mutex = (function () {
    function t(e) {
      this._semaphore = new Semaphore(1, e)
    }
    return (
      (t.prototype.acquire = function () {
        return __awaiter(this, arguments, void 0, function (e) {
          var r, n
          return (
            e === void 0 && (e = 0),
            __generator(this, function (o) {
              switch (o.label) {
                case 0:
                  return [4, this._semaphore.acquire(1, e)]
                case 1:
                  return (r = o.sent()), (n = r[1]), [2, n]
              }
            })
          )
        })
      }),
      (t.prototype.runExclusive = function (e, r) {
        return (
          r === void 0 && (r = 0),
          this._semaphore.runExclusive(
            function () {
              return e()
            },
            1,
            r,
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
    let r = !1
    return new Promise((n) => {
      const o = (s) => {
        const { info: i, provider: l } = s.detail
        ;(i.rdns === "io.metamask" || i.rdns === "io.metamask.flask") &&
          isMetaMaskProvider(l) &&
          (n(l), (r = !0))
      }
      typeof t.addEventListener == "function" &&
        t.addEventListener("eip6963:announceProvider", o),
        setTimeout(() => {
          r || n(null)
        }, e),
        typeof t.dispatchEvent == "function" &&
          t.dispatchEvent(new Event("eip6963:requestProvider"))
    })
  }
  async function waitForMetaMaskProvider(t, e = {}) {
    const { timeout: r = 3e3, retries: n = 0 } = e
    let o = null
    try {
      o = await detectMetaMaskProvider(t, { timeout: r })
    } catch {}
    return (
      o ||
      (n === 0
        ? null
        : ((o = await waitForMetaMaskProvider({ timeout: r, retries: n - 1 })),
          o))
    )
  }
  async function detectMetamaskSupport(t) {
    return await waitForMetaMaskProvider(t, { retries: 3 })
  }
  var Y, Z, z, Q, V, J
  class MetaMaskVirtualWallet {
    constructor() {
      L(this, Y),
        L(this, z),
        L(this, V),
        v(this, "id", "metamask-snaps"),
        v(this, "name", "MetaMask Snaps"),
        v(
          this,
          "icon",
          "data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAxNDIgMTM3Ij4KICA8cGF0aCBmaWxsPSIjMEEwQTBBIiBkPSJtMTMxLjIxNSAxMzAuNzI3LTI5Ljk3Ni04Ljg4My0yMi42MDQgMTMuNDQ5SDYyLjg2MWwtMjIuNjE5LTEzLjQ0OS0yOS45NiA4Ljg4My05LjExLTMwLjYzIDkuMTE3LTMzLjk5Mi05LjExNy0yOC43NDIgOS4xMS0zNS42MTggNDYuODE3IDI3Ljg0N2gyNy4yOThsNDYuODE4LTI3Ljg0NyA5LjExNyAzNS42MTgtOS4xMTcgMjguNzQyIDkuMTE3IDMzLjk5Mi05LjExNyAzMC42M1oiLz4KICA8cGF0aCBmaWxsPSIjODlCMEZGIiBkPSJtMTM4LjgyOCAxMDEuMjE5LTguMzY0IDI4LjEwMy0yOC4wODgtOC4zMzUtMi4yNTctLjY2OS0zLjIxOS0uOTU2LTEzLjc4LTQuMDkyLTEuMjA0LjE1OC0uNDY2IDEuNyAxNy4wMTUgNS4wNDgtMjAuMTQ1IDExLjk5SDYzLjE5M2wtMjAuMTQ0LTExLjk5IDE3LjAwOC01LjA0LS40NjctMS43MDgtMS4xOTYtLjE1OC0xNy4wMDcgNS4wNDgtMi4yNTcuNjY5LTI4LjA4IDguMzM1LTguMzY1LTI4LjEwM0wwIDEwMC4xMjFsOS41MyAzMi4wMDYgMzAuNTctOS4wNzkgMjIuNDY5IDEzLjM3NGgxNi4zNzZsMjIuNDY4LTEzLjM3NCAzMC41NyA5LjA3OSA5LjUyMy0zMi4wMDYtMi42NzggMS4wOThaIi8+CiAgPHBhdGggZmlsbD0iI0QwNzVGRiIgZD0iTTM5LjEzIDEwMS4yMTh2MTkuNzY4bDIuMjU3LS42Njl2LTE3Ljk0OGwxNy4wMDcgMTIuOSAxLjE5Ni4xNTggMS4xMTMtMS4yNDEtMjAuMDc2LTE1LjIyNUgyLjY0N2w4LjUwOC0zMS43MjgtMi4wMzgtMS4xMDZMMCAxMDAuMTJsMi42ODUgMS4wOThIMzkuMTNabTcwLjEyOC0xNy44MjctNy4yMjEgMS43ODN2Mi4zMzJsMTAuNjM2LTIuNjMzLjA2OC0xNy42NGgtMS40OTdsLS43Ni0uNTE4LS4wNiAxNC42Ni04LjcxOC04LjIyOUg4My42MTVsLS4zNDYgMi4yNjRoMTcuNTQybDguNDQ3IDcuOTgxWiIvPgogIDxwYXRoIGZpbGw9IiNEMDc1RkYiIGQ9Ik0zOS40NzUgODcuNTA2di0yLjMzMmwtNy4yMjItMS43ODMgOC40NDgtNy45OGgxNy41MzRsLS4zNDYtMi4yNjVINDAuMjQybC0uNzc1LjMwOS04LjM4IDcuOTItLjA2LTE0LjY2LS43Ni41MTloLTEuNTA0bC4wNjggMTcuNjQgMTAuNjQ0IDIuNjMyWm05MC44NzctMjAuMjczIDguNTA4IDMxLjcyOGgtMzcuOTc5bC0yMC4wNzcgMTUuMjI1IDEuMTE0IDEuMjQxIDEuMjAzLS4xNTggMTctMTIuOXYxNy45NDhsMi4yNTcuNjY5di0xOS43NjhoMzYuNDUybDIuNjc4LTEuMDk4LTkuMTEtMzMuOTkzLTIuMDQ2IDEuMTA2WiIvPgogIDxwYXRoIGZpbGw9IiNGRjVDMTYiIGQ9Ik0yOC43NjUgNjcuMjMzaDEuNTA0bC43Ni0uNTIgMjMuMzg2LTE2LjAyMSAzLjQ4MyAyMi40Ni4zNDYgMi4yNjUgNS40OTEgMzUuNDIyIDEuOTU2LS43OWguMjAzbC05LjUwOC02MS4zNSAxLjc1Mi0xNy45NzFoMjUuMjM3TDg1LjEyIDQ4LjcybC05LjUwOCA2MS4zMjhoLjIwNGwxLjk1NS43OSA1LjQ5MS0zNS40MjIuMzQ2LTIuMjY0aC4wMDhsMy40ODMtMjIuNDYxIDIzLjM3OCAxNi4wMjIuNzYuNTI2aDE5LjExNGwyLjAzOC0xLjEwNSA5LjExLTI4LjczNUwxMzEuOTM4IDAgODQuMTIgMjguNDY0SDU3LjM5NEw5LjU2OCAwIDAgMzcuNGw5LjExIDI4LjczNSAyLjAzOCAxLjEwNWgxNy42MWwuMDA3LS4wMDdabTExMC4zOTQtMjkuOS04Ljc3IDI3LjY0M2gtMTguNDIybC0yMy45NzMtMTYuNDIgNDIuNjM1LTQ0LjU2MiA4LjUzIDMzLjMzOFpNMTI0LjY3MiA2Ljk1NyA4Ny4xNTIgNDYuMTdsLTEuNTU4LTE1Ljk1NSAzOS4wNzgtMjMuMjU4Wm0tNjguNzYgMjMuMjUtMS41NSAxNS45NjMtMzcuNTItMzkuMjIgMzkuMDcgMjMuMjV2LjAwOFpNMi4zNDcgMzcuMzMzbDguNTMtMzMuMzM4IDQyLjYzNSA0NC41NjEtMjMuOTcyIDE2LjQySDExLjExOEwyLjM0NyAzNy4zMzJaIi8+CiAgPHBhdGggZmlsbD0iI0JBRjI0QSIgZD0iTTc3LjA3IDExMC4wNDlINjQuNDQybC00Ljg1MiA1LjM3OSAyLjQxNSA4LjgwOGgxNy40ODlsMi40MTUtOC44MDgtNC44NTItNS4zNzloLjAxNVptLjcgMTEuOTNINjMuNzVsLTEuNjQtNS45NzIgMy4zMTctMy42NzloMTAuNjY2bDMuMzE3IDMuNjc5LTEuNjQgNS45NzJaTTU4LjI2IDkwLjgwN2wtLjIxMS0uNTV2LS4wMTRsLTMuNzM5LTkuNjg5SDQ0LjJsLTQuNzIzIDQuNjE5djIuMzI0bDE2LjY3NiA0LjEyMiAyLjEwNi0uODEyWm0tMTMuMTQyLTcuOTg5aDcuNjQzbDIuNCA2LjIxNC0xMy4xMDQtMy4yMzUgMy4wNTQtMi45NzhoLjAwN1ptNDAuMjI4IDguODAyIDE2LjY3Ny00LjEyMXYtMi4zMjVsLTQuNzI0LTQuNjFoLTEwLjExbC0zLjczOCA5LjY4di4wMTVsLS4yMTEuNTUgMi4xMDYuODEyWm0xNC4wOS01LjgyMi0xMy4xMDQgMy4yMzUgMi40LTYuMjJoNy42NDJsMy4wNTQgMi45ODZoLjAwN1oiLz4KPC9zdmc+Cg==",
        ),
        v(this, "windowKey", "starknet_metamask"),
        v(this, "provider", null),
        v(this, "swo", null),
        v(this, "lock"),
        v(this, "version", "v2.0.0"),
        (this.lock = new Mutex())
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
        .then((r) => r.request(e))
    }
    on(e, r) {
      D(this, z, Q)
        .call(this)
        .then((n) => n.on(e, r))
    }
    off(e, r) {
      D(this, z, Q)
        .call(this)
        .then((n) => n.off(e, r))
    }
  }
  ;(Y = new WeakSet()),
    (Z = async function (t) {
      this.provider || (this.provider = await detectMetamaskSupport(t)),
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
      const e = await loadRemote("MetaMaskStarknetSnapWallet/index")
      if (!e) throw new Error("Failed to load MetaMask Wallet")
      return new e.MetaMaskSnapWallet(this.provider, "*")
    }),
    (z = new WeakSet()),
    (Q = async function (t = window) {
      return this.lock.runExclusive(
        async () => (
          this.swo ||
            ((this.swo = await D(this, Y, Z).call(this, t)),
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
        firefox:
          "https://addons.mozilla.org/en-US/firefox/addon/braavos-wallet",
        edge: "https://microsoftedge.microsoft.com/addons/detail/braavos-wallet/hkkpjehhcnhgefhbdcgfkeegglpjchdc",
        ios: `https://link.braavos.app/dapp/${
          (X = ssrSafeWindow$1 == null ? void 0 : ssrSafeWindow$1.location) ==
          null
            ? void 0
            : X.host
        }`,
        android: `https://link.braavos.app/dapp/${
          (q = ssrSafeWindow$1 == null ? void 0 : ssrSafeWindow$1.location) ==
          null
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
        firefox:
          "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/",
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
      L(this, H),
        L(this, k),
        L(this, C, !1),
        L(this, j, void 0),
        L(this, P, void 0),
        v(this, "value"),
        F(this, P, e),
        D(this, k, B).call(this)
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
            Object.keys(localStorage).find((t) => t.startsWith(w(this, P))),
          ),
          F(this, C, !0),
          w(this, j) && this.set(localStorage.getItem(w(this, j))))
      } catch (t) {
        console.warn(t)
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
    let r = !1,
      n = []
    return new Promise((o) => {
      const s = (i) => {
        let { info: l, provider: c } = i.detail
        l.rdns === "com.bitget.web3"
          ? (l = { ...l, name: "Bitget Wallet via Rosettanet" })
          : l.rdns === "com.okex.wallet" &&
            (l = { ...l, name: "OKX Wallet via Rosettanet" }),
          n.some((a) => a.info.rdns === l.rdns) ||
            n.push({ info: l, provider: c }),
          isEVMProvider(c) && (o(n), (r = !0))
      }
      typeof t.addEventListener == "function" &&
        t.addEventListener("eip6963:announceProvider", s),
        setTimeout(() => {
          r || o([{ provider: null, info: null }])
        }, e),
        typeof t.dispatchEvent == "function" &&
          t.dispatchEvent(new Event("eip6963:requestProvider"))
    })
  }
  async function waitForEVMProvider(t, e = {}) {
    const { timeout: r = 3e3, retries: n = 0 } = e
    try {
      const o = await detectEVMProvider(t, { timeout: r })
      if (o[0].provider) return o
    } catch {}
    return n === 0
      ? [{ provider: null, info: null }]
      : waitForEVMProvider(t, { timeout: r, retries: n - 1 })
  }
  async function detectEVMSupport(t) {
    return await waitForEVMProvider(t, { retries: 3 })
  }
  const Permission = { ACCOUNTS: "accounts" }
  function filterBy(t, e) {
    var r, n
    if ((r = e == null ? void 0 : e.include) != null && r.length) {
      const o = new Set(e.include)
      return t.filter((s) => o.has(s.id))
    }
    if ((n = e == null ? void 0 : e.exclude) != null && n.length) {
      const o = new Set(e.exclude)
      return t.filter((s) => !o.has(s.id))
    }
    return t
  }
  const filterByAuthorized = async (t) => {
      const e = await Promise.all(
        t.map(async (r) => {
          try {
            return (
              await r.request({ type: "wallet_getPermissions" })
            ).includes(Permission.ACCOUNTS)
          } catch {
            return !1
          }
        }),
      )
      return t.filter((r, n) => e[n])
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
    evmWalletKeys = ensureKeysArray({ sendAsync: !0, send: !0, request: !0 })
  function createWalletGuard(t) {
    return function (e) {
      return e !== null && typeof e == "object" && t.every((r) => r in e)
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
      Object.getOwnPropertyNames(t).reduce((r, n) => {
        if (n.startsWith("starknet")) {
          const o = t[n]
          e(o) && !r[o.id] && (r[o.id] = o)
        }
        return r
      }, {}),
    )
  }
  const sortBy = (t, e) => {
      if (e && Array.isArray(e)) {
        t.sort((n, o) => e.indexOf(n.id) - e.indexOf(o.id))
        const r = t.length - e.length
        return [...t.slice(r), ...shuffle(t.slice(0, r))]
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
    let r = virtualWalletsMap[e.id]
    return r || ((r = await e.loadWallet(t)), (virtualWalletsMap[e.id] = r)), r
  }
  const defaultOptions = {
    windowObject: ssrSafeWindow$1 != null ? ssrSafeWindow$1 : {},
    isWalletObject,
    storageFactoryImplementation: (t) => new LocalStorageWrapper(t),
  }
  function getStarknet(t = {}) {
    const {
        storageFactoryImplementation: e,
        windowObject: r,
        isWalletObject: n,
      } = { ...defaultOptions, ...t },
      o = e("gsw-last")
    initiateVirtualWallets(r)
    let s
    async function i() {
      s = await detectEVMSupport(r)
    }
    return (
      i(),
      {
        getAvailableWallets: async (l = {}) => {
          const c = scanObjectForWallets(r, n)
          return (
            s.forEach((a) => {
              a.provider &&
                a.info &&
                c.push({
                  ...a.provider,
                  id: a.info.name,
                  name: a.info.name,
                  icon: a.info.icon,
                  version: a.info.icon,
                  on: a.provider.on,
                  off: a.provider.off,
                })
            }),
            pipe$1(
              (a) => filterBy(a, l),
              (a) => sortBy(a, l.sort),
            )(c)
          )
        },
        getAuthorizedWallets: async (l = {}) => {
          const c = scanObjectForWallets(r, n)
          return pipe$1(
            (a) => filterByAuthorized(a),
            (a) => filterBy(a, l),
            (a) => sortBy(a, l.sort),
          )(c)
        },
        getDiscoveryWallets: async (l = {}) =>
          pipe$1(
            (c) => filterBy(c, l),
            (c) => sortBy(c, l.sort),
          )(wallets),
        getLastConnectedWallet: async () => {
          const l = o.get(),
            c = scanObjectForWallets(r, n).find((u) => u.id === l),
            [a] = await filterByAuthorized(c ? [c] : [])
          return a || (o.delete(), null)
        },
        discoverVirtualWallets: async (l = []) => {
          const c = new Set(l),
            a =
              c.size > 0
                ? virtualWallets.filter((u) => c.has(u.name) || c.has(u.id))
                : virtualWallets
          await Promise.all(
            a.map(async (u) => {
              ;(await u.hasSupport(r)) && (r[u.windowKey] = u)
            }),
          )
        },
        enable: async (l, c) => {
          let a
          if (isVirtualWallet(l)) a = await resolveVirtualWallet(r, l)
          else if (isEvmWallet(l)) {
            const d = (await detectEVMSupport(r)).find(
              ({ info: m }) => m && m.name === l.name,
            )
            if (d && d.provider) a = d.provider
            else throw new Error("Failed to connect to the selected EVM wallet")
          } else if (isFullWallet(l)) a = l
          else throw new Error("Invalid wallet object")
          isEvmWallet(a)
            ? await a.request({ method: "eth_requestAccounts" })
            : await a.request({
                type: "wallet_requestAccounts",
                params: { silent_mode: c == null ? void 0 : c.silent_mode },
              })
          const u = await a.request({ type: "wallet_getPermissions" })
          if (!(u != null && u.includes(Permission.ACCOUNTS)))
            throw new Error("Failed to connect to wallet")
          return o.set(a.id), a
        },
        disconnect: async ({ clearLastWallet: l } = {}) => {
          l && o.delete()
        },
      }
    )
  }
  const main = getStarknet(),
    BROWSER_ALIASES_MAP = {
      "Amazon Silk": "amazon_silk",
      "Android Browser": "android",
      Bada: "bada",
      BlackBerry: "blackberry",
      Chrome: "chrome",
      Chromium: "chromium",
      Electron: "electron",
      Epiphany: "epiphany",
      Firefox: "firefox",
      Focus: "focus",
      Generic: "generic",
      "Google Search": "google_search",
      Googlebot: "googlebot",
      "Internet Explorer": "ie",
      "K-Meleon": "k_meleon",
      Maxthon: "maxthon",
      "Microsoft Edge": "edge",
      "MZ Browser": "mz",
      "NAVER Whale Browser": "naver",
      Opera: "opera",
      "Opera Coast": "opera_coast",
      PhantomJS: "phantomjs",
      Puffin: "puffin",
      QupZilla: "qupzilla",
      QQ: "qq",
      QQLite: "qqlite",
      Safari: "safari",
      Sailfish: "sailfish",
      "Samsung Internet for Android": "samsung_internet",
      SeaMonkey: "seamonkey",
      Sleipnir: "sleipnir",
      Swing: "swing",
      Tizen: "tizen",
      "UC Browser": "uc",
      Vivaldi: "vivaldi",
      "WebOS Browser": "webos",
      WeChat: "wechat",
      "Yandex Browser": "yandex",
      Roku: "roku",
    },
    BROWSER_MAP = {
      amazon_silk: "Amazon Silk",
      android: "Android Browser",
      bada: "Bada",
      blackberry: "BlackBerry",
      chrome: "Chrome",
      chromium: "Chromium",
      electron: "Electron",
      epiphany: "Epiphany",
      firefox: "Firefox",
      focus: "Focus",
      generic: "Generic",
      googlebot: "Googlebot",
      google_search: "Google Search",
      ie: "Internet Explorer",
      k_meleon: "K-Meleon",
      maxthon: "Maxthon",
      edge: "Microsoft Edge",
      mz: "MZ Browser",
      naver: "NAVER Whale Browser",
      opera: "Opera",
      opera_coast: "Opera Coast",
      phantomjs: "PhantomJS",
      puffin: "Puffin",
      qupzilla: "QupZilla",
      qq: "QQ Browser",
      qqlite: "QQ Browser Lite",
      safari: "Safari",
      sailfish: "Sailfish",
      samsung_internet: "Samsung Internet for Android",
      seamonkey: "SeaMonkey",
      sleipnir: "Sleipnir",
      swing: "Swing",
      tizen: "Tizen",
      uc: "UC Browser",
      vivaldi: "Vivaldi",
      webos: "WebOS Browser",
      wechat: "WeChat",
      yandex: "Yandex Browser",
    },
    PLATFORMS_MAP = {
      tablet: "tablet",
      mobile: "mobile",
      desktop: "desktop",
      tv: "tv",
    },
    OS_MAP = {
      WindowsPhone: "Windows Phone",
      Windows: "Windows",
      MacOS: "macOS",
      iOS: "iOS",
      Android: "Android",
      WebOS: "WebOS",
      BlackBerry: "BlackBerry",
      Bada: "Bada",
      Tizen: "Tizen",
      Linux: "Linux",
      ChromeOS: "Chrome OS",
      PlayStation4: "PlayStation 4",
      Roku: "Roku",
    },
    ENGINE_MAP = {
      EdgeHTML: "EdgeHTML",
      Blink: "Blink",
      Trident: "Trident",
      Presto: "Presto",
      Gecko: "Gecko",
      WebKit: "WebKit",
    }
  class Utils {
    static getFirstMatch(e, r) {
      const n = r.match(e)
      return (n && n.length > 0 && n[1]) || ""
    }
    static getSecondMatch(e, r) {
      const n = r.match(e)
      return (n && n.length > 1 && n[2]) || ""
    }
    static matchAndReturnConst(e, r, n) {
      if (e.test(r)) return n
    }
    static getWindowsVersionName(e) {
      switch (e) {
        case "NT":
          return "NT"
        case "XP":
          return "XP"
        case "NT 5.0":
          return "2000"
        case "NT 5.1":
          return "XP"
        case "NT 5.2":
          return "2003"
        case "NT 6.0":
          return "Vista"
        case "NT 6.1":
          return "7"
        case "NT 6.2":
          return "8"
        case "NT 6.3":
          return "8.1"
        case "NT 10.0":
          return "10"
        default:
          return
      }
    }
    static getMacOSVersionName(e) {
      const r = e
        .split(".")
        .splice(0, 2)
        .map((n) => parseInt(n, 10) || 0)
      if ((r.push(0), r[0] === 10))
        switch (r[1]) {
          case 5:
            return "Leopard"
          case 6:
            return "Snow Leopard"
          case 7:
            return "Lion"
          case 8:
            return "Mountain Lion"
          case 9:
            return "Mavericks"
          case 10:
            return "Yosemite"
          case 11:
            return "El Capitan"
          case 12:
            return "Sierra"
          case 13:
            return "High Sierra"
          case 14:
            return "Mojave"
          case 15:
            return "Catalina"
          default:
            return
        }
    }
    static getAndroidVersionName(e) {
      const r = e
        .split(".")
        .splice(0, 2)
        .map((n) => parseInt(n, 10) || 0)
      if ((r.push(0), !(r[0] === 1 && r[1] < 5))) {
        if (r[0] === 1 && r[1] < 6) return "Cupcake"
        if (r[0] === 1 && r[1] >= 6) return "Donut"
        if (r[0] === 2 && r[1] < 2) return "Eclair"
        if (r[0] === 2 && r[1] === 2) return "Froyo"
        if (r[0] === 2 && r[1] > 2) return "Gingerbread"
        if (r[0] === 3) return "Honeycomb"
        if (r[0] === 4 && r[1] < 1) return "Ice Cream Sandwich"
        if (r[0] === 4 && r[1] < 4) return "Jelly Bean"
        if (r[0] === 4 && r[1] >= 4) return "KitKat"
        if (r[0] === 5) return "Lollipop"
        if (r[0] === 6) return "Marshmallow"
        if (r[0] === 7) return "Nougat"
        if (r[0] === 8) return "Oreo"
        if (r[0] === 9) return "Pie"
      }
    }
    static getVersionPrecision(e) {
      return e.split(".").length
    }
    static compareVersions(e, r, n = !1) {
      const o = Utils.getVersionPrecision(e),
        s = Utils.getVersionPrecision(r)
      let i = Math.max(o, s),
        l = 0
      const c = Utils.map([e, r], (a) => {
        const u = i - Utils.getVersionPrecision(a),
          d = a + new Array(u + 1).join(".0")
        return Utils.map(
          d.split("."),
          (m) => new Array(20 - m.length).join("0") + m,
        ).reverse()
      })
      for (n && (l = i - Math.min(o, s)), i -= 1; i >= l; ) {
        if (c[0][i] > c[1][i]) return 1
        if (c[0][i] === c[1][i]) {
          if (i === l) return 0
          i -= 1
        } else if (c[0][i] < c[1][i]) return -1
      }
    }
    static map(e, r) {
      const n = []
      let o
      if (Array.prototype.map) return Array.prototype.map.call(e, r)
      for (o = 0; o < e.length; o += 1) n.push(r(e[o]))
      return n
    }
    static find(e, r) {
      let n, o
      if (Array.prototype.find) return Array.prototype.find.call(e, r)
      for (n = 0, o = e.length; n < o; n += 1) {
        const s = e[n]
        if (r(s, n)) return s
      }
    }
    static assign(e, ...r) {
      const n = e
      let o, s
      if (Object.assign) return Object.assign(e, ...r)
      for (o = 0, s = r.length; o < s; o += 1) {
        const i = r[o]
        typeof i == "object" &&
          i !== null &&
          Object.keys(i).forEach((c) => {
            n[c] = i[c]
          })
      }
      return e
    }
    static getBrowserAlias(e) {
      return BROWSER_ALIASES_MAP[e]
    }
    static getBrowserTypeByAlias(e) {
      return BROWSER_MAP[e] || ""
    }
  }
  const commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i,
    browsersList = [
      {
        test: [/googlebot/i],
        describe(t) {
          const e = { name: "Googlebot" },
            r =
              Utils.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, t) ||
              Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/opera/i],
        describe(t) {
          const e = { name: "Opera" },
            r =
              Utils.getFirstMatch(commonVersionIdentifier, t) ||
              Utils.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/opr\/|opios/i],
        describe(t) {
          const e = { name: "Opera" },
            r =
              Utils.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, t) ||
              Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/SamsungBrowser/i],
        describe(t) {
          const e = { name: "Samsung Internet for Android" },
            r =
              Utils.getFirstMatch(commonVersionIdentifier, t) ||
              Utils.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/Whale/i],
        describe(t) {
          const e = { name: "NAVER Whale Browser" },
            r =
              Utils.getFirstMatch(commonVersionIdentifier, t) ||
              Utils.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/MZBrowser/i],
        describe(t) {
          const e = { name: "MZ Browser" },
            r =
              Utils.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, t) ||
              Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/focus/i],
        describe(t) {
          const e = { name: "Focus" },
            r =
              Utils.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, t) ||
              Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/swing/i],
        describe(t) {
          const e = { name: "Swing" },
            r =
              Utils.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, t) ||
              Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/coast/i],
        describe(t) {
          const e = { name: "Opera Coast" },
            r =
              Utils.getFirstMatch(commonVersionIdentifier, t) ||
              Utils.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/opt\/\d+(?:.?_?\d+)+/i],
        describe(t) {
          const e = { name: "Opera Touch" },
            r =
              Utils.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, t) ||
              Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/yabrowser/i],
        describe(t) {
          const e = { name: "Yandex Browser" },
            r =
              Utils.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, t) ||
              Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/ucbrowser/i],
        describe(t) {
          const e = { name: "UC Browser" },
            r =
              Utils.getFirstMatch(commonVersionIdentifier, t) ||
              Utils.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/Maxthon|mxios/i],
        describe(t) {
          const e = { name: "Maxthon" },
            r =
              Utils.getFirstMatch(commonVersionIdentifier, t) ||
              Utils.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/epiphany/i],
        describe(t) {
          const e = { name: "Epiphany" },
            r =
              Utils.getFirstMatch(commonVersionIdentifier, t) ||
              Utils.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/puffin/i],
        describe(t) {
          const e = { name: "Puffin" },
            r =
              Utils.getFirstMatch(commonVersionIdentifier, t) ||
              Utils.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/sleipnir/i],
        describe(t) {
          const e = { name: "Sleipnir" },
            r =
              Utils.getFirstMatch(commonVersionIdentifier, t) ||
              Utils.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/k-meleon/i],
        describe(t) {
          const e = { name: "K-Meleon" },
            r =
              Utils.getFirstMatch(commonVersionIdentifier, t) ||
              Utils.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/micromessenger/i],
        describe(t) {
          const e = { name: "WeChat" },
            r =
              Utils.getFirstMatch(
                /(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i,
                t,
              ) || Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/qqbrowser/i],
        describe(t) {
          const e = {
              name: /qqbrowserlite/i.test(t) ? "QQ Browser Lite" : "QQ Browser",
            },
            r =
              Utils.getFirstMatch(
                /(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i,
                t,
              ) || Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/msie|trident/i],
        describe(t) {
          const e = { name: "Internet Explorer" },
            r = Utils.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/\sedg\//i],
        describe(t) {
          const e = { name: "Microsoft Edge" },
            r = Utils.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/edg([ea]|ios)/i],
        describe(t) {
          const e = { name: "Microsoft Edge" },
            r = Utils.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/vivaldi/i],
        describe(t) {
          const e = { name: "Vivaldi" },
            r = Utils.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/seamonkey/i],
        describe(t) {
          const e = { name: "SeaMonkey" },
            r = Utils.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/sailfish/i],
        describe(t) {
          const e = { name: "Sailfish" },
            r = Utils.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/silk/i],
        describe(t) {
          const e = { name: "Amazon Silk" },
            r = Utils.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/phantom/i],
        describe(t) {
          const e = { name: "PhantomJS" },
            r = Utils.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/slimerjs/i],
        describe(t) {
          const e = { name: "SlimerJS" },
            r = Utils.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
        describe(t) {
          const e = { name: "BlackBerry" },
            r =
              Utils.getFirstMatch(commonVersionIdentifier, t) ||
              Utils.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/(web|hpw)[o0]s/i],
        describe(t) {
          const e = { name: "WebOS Browser" },
            r =
              Utils.getFirstMatch(commonVersionIdentifier, t) ||
              Utils.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/bada/i],
        describe(t) {
          const e = { name: "Bada" },
            r = Utils.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/tizen/i],
        describe(t) {
          const e = { name: "Tizen" },
            r =
              Utils.getFirstMatch(
                /(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i,
                t,
              ) || Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/qupzilla/i],
        describe(t) {
          const e = { name: "QupZilla" },
            r =
              Utils.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, t) ||
              Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/firefox|iceweasel|fxios/i],
        describe(t) {
          const e = { name: "Firefox" },
            r = Utils.getFirstMatch(
              /(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i,
              t,
            )
          return r && (e.version = r), e
        },
      },
      {
        test: [/electron/i],
        describe(t) {
          const e = { name: "Electron" },
            r = Utils.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/MiuiBrowser/i],
        describe(t) {
          const e = { name: "Miui" },
            r = Utils.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/chromium/i],
        describe(t) {
          const e = { name: "Chromium" },
            r =
              Utils.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, t) ||
              Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/chrome|crios|crmo/i],
        describe(t) {
          const e = { name: "Chrome" },
            r = Utils.getFirstMatch(
              /(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i,
              t,
            )
          return r && (e.version = r), e
        },
      },
      {
        test: [/GSA/i],
        describe(t) {
          const e = { name: "Google Search" },
            r = Utils.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test(t) {
          const e = !t.test(/like android/i),
            r = t.test(/android/i)
          return e && r
        },
        describe(t) {
          const e = { name: "Android Browser" },
            r = Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/playstation 4/i],
        describe(t) {
          const e = { name: "PlayStation 4" },
            r = Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/safari|applewebkit/i],
        describe(t) {
          const e = { name: "Safari" },
            r = Utils.getFirstMatch(commonVersionIdentifier, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/.*/i],
        describe(t) {
          const e = /^(.*)\/(.*) /,
            r = /^(.*)\/(.*)[ \t]\((.*)/,
            o = t.search("\\(") !== -1 ? r : e
          return {
            name: Utils.getFirstMatch(o, t),
            version: Utils.getSecondMatch(o, t),
          }
        },
      },
    ],
    osParsersList = [
      {
        test: [/Roku\/DVP/],
        describe(t) {
          const e = Utils.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, t)
          return { name: OS_MAP.Roku, version: e }
        },
      },
      {
        test: [/windows phone/i],
        describe(t) {
          const e = Utils.getFirstMatch(
            /windows phone (?:os)?\s?(\d+(\.\d+)*)/i,
            t,
          )
          return { name: OS_MAP.WindowsPhone, version: e }
        },
      },
      {
        test: [/windows /i],
        describe(t) {
          const e = Utils.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, t),
            r = Utils.getWindowsVersionName(e)
          return { name: OS_MAP.Windows, version: e, versionName: r }
        },
      },
      {
        test: [/Macintosh(.*?) FxiOS(.*?)\//],
        describe(t) {
          const e = { name: OS_MAP.iOS },
            r = Utils.getSecondMatch(/(Version\/)(\d[\d.]+)/, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/macintosh/i],
        describe(t) {
          const e = Utils.getFirstMatch(
              /mac os x (\d+(\.?_?\d+)+)/i,
              t,
            ).replace(/[_\s]/g, "."),
            r = Utils.getMacOSVersionName(e),
            n = { name: OS_MAP.MacOS, version: e }
          return r && (n.versionName = r), n
        },
      },
      {
        test: [/(ipod|iphone|ipad)/i],
        describe(t) {
          const e = Utils.getFirstMatch(
            /os (\d+([_\s]\d+)*) like mac os x/i,
            t,
          ).replace(/[_\s]/g, ".")
          return { name: OS_MAP.iOS, version: e }
        },
      },
      {
        test(t) {
          const e = !t.test(/like android/i),
            r = t.test(/android/i)
          return e && r
        },
        describe(t) {
          const e = Utils.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, t),
            r = Utils.getAndroidVersionName(e),
            n = { name: OS_MAP.Android, version: e }
          return r && (n.versionName = r), n
        },
      },
      {
        test: [/(web|hpw)[o0]s/i],
        describe(t) {
          const e = Utils.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, t),
            r = { name: OS_MAP.WebOS }
          return e && e.length && (r.version = e), r
        },
      },
      {
        test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
        describe(t) {
          const e =
            Utils.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, t) ||
            Utils.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, t) ||
            Utils.getFirstMatch(/\bbb(\d+)/i, t)
          return { name: OS_MAP.BlackBerry, version: e }
        },
      },
      {
        test: [/bada/i],
        describe(t) {
          const e = Utils.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, t)
          return { name: OS_MAP.Bada, version: e }
        },
      },
      {
        test: [/tizen/i],
        describe(t) {
          const e = Utils.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, t)
          return { name: OS_MAP.Tizen, version: e }
        },
      },
      {
        test: [/linux/i],
        describe() {
          return { name: OS_MAP.Linux }
        },
      },
      {
        test: [/CrOS/],
        describe() {
          return { name: OS_MAP.ChromeOS }
        },
      },
      {
        test: [/PlayStation 4/],
        describe(t) {
          const e = Utils.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, t)
          return { name: OS_MAP.PlayStation4, version: e }
        },
      },
    ],
    platformParsersList = [
      {
        test: [/googlebot/i],
        describe() {
          return { type: "bot", vendor: "Google" }
        },
      },
      {
        test: [/huawei/i],
        describe(t) {
          const e = Utils.getFirstMatch(/(can-l01)/i, t) && "Nova",
            r = { type: PLATFORMS_MAP.mobile, vendor: "Huawei" }
          return e && (r.model = e), r
        },
      },
      {
        test: [/nexus\s*(?:7|8|9|10).*/i],
        describe() {
          return { type: PLATFORMS_MAP.tablet, vendor: "Nexus" }
        },
      },
      {
        test: [/ipad/i],
        describe() {
          return { type: PLATFORMS_MAP.tablet, vendor: "Apple", model: "iPad" }
        },
      },
      {
        test: [/Macintosh(.*?) FxiOS(.*?)\//],
        describe() {
          return { type: PLATFORMS_MAP.tablet, vendor: "Apple", model: "iPad" }
        },
      },
      {
        test: [/kftt build/i],
        describe() {
          return {
            type: PLATFORMS_MAP.tablet,
            vendor: "Amazon",
            model: "Kindle Fire HD 7",
          }
        },
      },
      {
        test: [/silk/i],
        describe() {
          return { type: PLATFORMS_MAP.tablet, vendor: "Amazon" }
        },
      },
      {
        test: [/tablet(?! pc)/i],
        describe() {
          return { type: PLATFORMS_MAP.tablet }
        },
      },
      {
        test(t) {
          const e = t.test(/ipod|iphone/i),
            r = t.test(/like (ipod|iphone)/i)
          return e && !r
        },
        describe(t) {
          const e = Utils.getFirstMatch(/(ipod|iphone)/i, t)
          return { type: PLATFORMS_MAP.mobile, vendor: "Apple", model: e }
        },
      },
      {
        test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
        describe() {
          return { type: PLATFORMS_MAP.mobile, vendor: "Nexus" }
        },
      },
      {
        test: [/[^-]mobi/i],
        describe() {
          return { type: PLATFORMS_MAP.mobile }
        },
      },
      {
        test(t) {
          return t.getBrowserName(!0) === "blackberry"
        },
        describe() {
          return { type: PLATFORMS_MAP.mobile, vendor: "BlackBerry" }
        },
      },
      {
        test(t) {
          return t.getBrowserName(!0) === "bada"
        },
        describe() {
          return { type: PLATFORMS_MAP.mobile }
        },
      },
      {
        test(t) {
          return t.getBrowserName() === "windows phone"
        },
        describe() {
          return { type: PLATFORMS_MAP.mobile, vendor: "Microsoft" }
        },
      },
      {
        test(t) {
          const e = Number(String(t.getOSVersion()).split(".")[0])
          return t.getOSName(!0) === "android" && e >= 3
        },
        describe() {
          return { type: PLATFORMS_MAP.tablet }
        },
      },
      {
        test(t) {
          return t.getOSName(!0) === "android"
        },
        describe() {
          return { type: PLATFORMS_MAP.mobile }
        },
      },
      {
        test(t) {
          return t.getOSName(!0) === "macos"
        },
        describe() {
          return { type: PLATFORMS_MAP.desktop, vendor: "Apple" }
        },
      },
      {
        test(t) {
          return t.getOSName(!0) === "windows"
        },
        describe() {
          return { type: PLATFORMS_MAP.desktop }
        },
      },
      {
        test(t) {
          return t.getOSName(!0) === "linux"
        },
        describe() {
          return { type: PLATFORMS_MAP.desktop }
        },
      },
      {
        test(t) {
          return t.getOSName(!0) === "playstation 4"
        },
        describe() {
          return { type: PLATFORMS_MAP.tv }
        },
      },
      {
        test(t) {
          return t.getOSName(!0) === "roku"
        },
        describe() {
          return { type: PLATFORMS_MAP.tv }
        },
      },
    ],
    enginesParsersList = [
      {
        test(t) {
          return t.getBrowserName(!0) === "microsoft edge"
        },
        describe(t) {
          if (/\sedg\//i.test(t)) return { name: ENGINE_MAP.Blink }
          const r = Utils.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, t)
          return { name: ENGINE_MAP.EdgeHTML, version: r }
        },
      },
      {
        test: [/trident/i],
        describe(t) {
          const e = { name: ENGINE_MAP.Trident },
            r = Utils.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test(t) {
          return t.test(/presto/i)
        },
        describe(t) {
          const e = { name: ENGINE_MAP.Presto },
            r = Utils.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test(t) {
          const e = t.test(/gecko/i),
            r = t.test(/like gecko/i)
          return e && !r
        },
        describe(t) {
          const e = { name: ENGINE_MAP.Gecko },
            r = Utils.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
      {
        test: [/(apple)?webkit\/537\.36/i],
        describe() {
          return { name: ENGINE_MAP.Blink }
        },
      },
      {
        test: [/(apple)?webkit/i],
        describe(t) {
          const e = { name: ENGINE_MAP.WebKit },
            r = Utils.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, t)
          return r && (e.version = r), e
        },
      },
    ]
  class Parser {
    constructor(e, r = !1) {
      if (e == null || e === "")
        throw new Error("UserAgent parameter can't be empty")
      ;(this._ua = e), (this.parsedResult = {}), r !== !0 && this.parse()
    }
    getUA() {
      return this._ua
    }
    test(e) {
      return e.test(this._ua)
    }
    parseBrowser() {
      this.parsedResult.browser = {}
      const e = Utils.find(browsersList, (r) => {
        if (typeof r.test == "function") return r.test(this)
        if (r.test instanceof Array) return r.test.some((n) => this.test(n))
        throw new Error("Browser's test function is not valid")
      })
      return (
        e && (this.parsedResult.browser = e.describe(this.getUA())),
        this.parsedResult.browser
      )
    }
    getBrowser() {
      return this.parsedResult.browser
        ? this.parsedResult.browser
        : this.parseBrowser()
    }
    getBrowserName(e) {
      return e
        ? String(this.getBrowser().name).toLowerCase() || ""
        : this.getBrowser().name || ""
    }
    getBrowserVersion() {
      return this.getBrowser().version
    }
    getOS() {
      return this.parsedResult.os ? this.parsedResult.os : this.parseOS()
    }
    parseOS() {
      this.parsedResult.os = {}
      const e = Utils.find(osParsersList, (r) => {
        if (typeof r.test == "function") return r.test(this)
        if (r.test instanceof Array) return r.test.some((n) => this.test(n))
        throw new Error("Browser's test function is not valid")
      })
      return (
        e && (this.parsedResult.os = e.describe(this.getUA())),
        this.parsedResult.os
      )
    }
    getOSName(e) {
      const { name: r } = this.getOS()
      return e ? String(r).toLowerCase() || "" : r || ""
    }
    getOSVersion() {
      return this.getOS().version
    }
    getPlatform() {
      return this.parsedResult.platform
        ? this.parsedResult.platform
        : this.parsePlatform()
    }
    getPlatformType(e = !1) {
      const { type: r } = this.getPlatform()
      return e ? String(r).toLowerCase() || "" : r || ""
    }
    parsePlatform() {
      this.parsedResult.platform = {}
      const e = Utils.find(platformParsersList, (r) => {
        if (typeof r.test == "function") return r.test(this)
        if (r.test instanceof Array) return r.test.some((n) => this.test(n))
        throw new Error("Browser's test function is not valid")
      })
      return (
        e && (this.parsedResult.platform = e.describe(this.getUA())),
        this.parsedResult.platform
      )
    }
    getEngine() {
      return this.parsedResult.engine
        ? this.parsedResult.engine
        : this.parseEngine()
    }
    getEngineName(e) {
      return e
        ? String(this.getEngine().name).toLowerCase() || ""
        : this.getEngine().name || ""
    }
    parseEngine() {
      this.parsedResult.engine = {}
      const e = Utils.find(enginesParsersList, (r) => {
        if (typeof r.test == "function") return r.test(this)
        if (r.test instanceof Array) return r.test.some((n) => this.test(n))
        throw new Error("Browser's test function is not valid")
      })
      return (
        e && (this.parsedResult.engine = e.describe(this.getUA())),
        this.parsedResult.engine
      )
    }
    parse() {
      return (
        this.parseBrowser(),
        this.parseOS(),
        this.parsePlatform(),
        this.parseEngine(),
        this
      )
    }
    getResult() {
      return Utils.assign({}, this.parsedResult)
    }
    satisfies(e) {
      const r = {}
      let n = 0
      const o = {}
      let s = 0
      if (
        (Object.keys(e).forEach((l) => {
          const c = e[l]
          typeof c == "string"
            ? ((o[l] = c), (s += 1))
            : typeof c == "object" && ((r[l] = c), (n += 1))
        }),
        n > 0)
      ) {
        const l = Object.keys(r),
          c = Utils.find(l, (u) => this.isOS(u))
        if (c) {
          const u = this.satisfies(r[c])
          if (u !== void 0) return u
        }
        const a = Utils.find(l, (u) => this.isPlatform(u))
        if (a) {
          const u = this.satisfies(r[a])
          if (u !== void 0) return u
        }
      }
      if (s > 0) {
        const l = Object.keys(o),
          c = Utils.find(l, (a) => this.isBrowser(a, !0))
        if (c !== void 0) return this.compareVersion(o[c])
      }
    }
    isBrowser(e, r = !1) {
      const n = this.getBrowserName().toLowerCase()
      let o = e.toLowerCase()
      const s = Utils.getBrowserTypeByAlias(o)
      return r && s && (o = s.toLowerCase()), o === n
    }
    compareVersion(e) {
      let r = [0],
        n = e,
        o = !1
      const s = this.getBrowserVersion()
      if (typeof s == "string")
        return (
          e[0] === ">" || e[0] === "<"
            ? ((n = e.substr(1)),
              e[1] === "=" ? ((o = !0), (n = e.substr(2))) : (r = []),
              e[0] === ">" ? r.push(1) : r.push(-1))
            : e[0] === "="
            ? (n = e.substr(1))
            : e[0] === "~" && ((o = !0), (n = e.substr(1))),
          r.indexOf(Utils.compareVersions(s, n, o)) > -1
        )
    }
    isOS(e) {
      return this.getOSName(!0) === String(e).toLowerCase()
    }
    isPlatform(e) {
      return this.getPlatformType(!0) === String(e).toLowerCase()
    }
    isEngine(e) {
      return this.getEngineName(!0) === String(e).toLowerCase()
    }
    is(e, r = !1) {
      return this.isBrowser(e, r) || this.isOS(e) || this.isPlatform(e)
    }
    some(e = []) {
      return e.some((r) => this.is(r))
    }
  }
  /*!
   * Bowser - a browser detector
   * https://github.com/lancedikson/bowser
   * MIT License | (c) Dustin Diaz 2012-2015
   * MIT License | (c) Denis Demchenko 2015-2019
   */ class Bowser {
    static getParser(e, r = !1) {
      if (typeof e != "string") throw new Error("UserAgent should be a string")
      return new Parser(e, r)
    }
    static parse(e) {
      return new Parser(e).getResult()
    }
    static get BROWSER_MAP() {
      return BROWSER_MAP
    }
    static get ENGINE_MAP() {
      return ENGINE_MAP
    }
    static get OS_MAP() {
      return OS_MAP
    }
    static get PLATFORMS_MAP() {
      return PLATFORMS_MAP
    }
  }
  const ssrSafeWindow = typeof window < "u" ? window : null
  function getBrowserStoreVersionFromBrowser() {
    var e
    switch (
      (e = Bowser.getParser(
        ssrSafeWindow == null ? void 0 : ssrSafeWindow.navigator.userAgent,
      ).getBrowserName()) == null
        ? void 0
        : e.toLowerCase()
    ) {
      case "firefox":
        return "firefox"
      case "microsoft edge":
        return "edge"
      case "android browser":
      case "chrome":
      case "chromium":
      case "electron":
      case "opera":
      case "vivaldi":
        return "chrome"
      case "safari":
        return "safari"
      default:
        return null
    }
  }
  function getOperatingSystemStoreVersionFromBrowser() {
    var e, r, n
    const t =
      (n =
        (r =
          (e = Bowser.getParser(
            ssrSafeWindow == null ? void 0 : ssrSafeWindow.navigator.userAgent,
          ).getOS()) == null
            ? void 0
            : e.name) == null
          ? void 0
          : r.toLowerCase()) != null
        ? n
        : null
    switch (t) {
      case "ios":
      case "android":
        return t
      default:
        return null
    }
  }
  const enableWithVersion = async (t, e) =>
      t ? main.enable(t, e).catch(() => null) : null,
    connect = async ({
      modalMode: t = "canAsk",
      storeVersion: e = getBrowserStoreVersionFromBrowser(),
      osVersion: r = getOperatingSystemStoreVersionFromBrowser(),
      modalTheme: n,
      ...o
    } = {}) => {
      var u, d
      const s = await main.getAuthorizedWallets({ ...o }),
        i = await main.getLastConnectedWallet()
      if (t === "neverAsk") {
        const m =
          (u = s.find((p) => p.id === (i == null ? void 0 : i.id))) != null
            ? u
            : s[0]
        return enableWithVersion(m, { silent_mode: !0 })
      }
      const l = await main.getAvailableWallets(o)
      if (t === "canAsk" && i) {
        const m =
          (d = s.find((p) => p.id === (i == null ? void 0 : i.id))) != null
            ? d
            : l.length === 1
            ? l[0]
            : void 0
        if (m) return enableWithVersion(m)
      }
      const a = (await main.getDiscoveryWallets(o)).reduce((m, p) => {
        const h = p.downloads[r] || p.downloads[e]
        if (h) {
          const M = Object.keys(p.downloads).find((I) => p.downloads[I] === h),
            g =
              M === "android" || M === "ios"
                ? `${p.name} Mobile`
                : `Install ${p.name}`
          m.push({ ...p, name: g, download: h })
        }
        return m
      }, [])
      return show({
        lastWallet: i,
        authorizedWallets: s,
        installedWallets: l,
        discoveryWallets: a,
        enable: enableWithVersion,
        modalOptions: { theme: n },
      })
    }
  function disconnect(t = {}) {
    return main.disconnect(t)
  }
  ;(exports.connect = connect),
    (exports.disconnect = disconnect),
    Object.defineProperties(exports, {
      __esModule: { value: !0 },
      [Symbol.toStringTag]: { value: "Module" },
    })
})
