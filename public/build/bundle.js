
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const pageRoute = writable('main');
    const contentOpacity = writable(1);
    const authCheck = writable({
      auth: false,
      passID: 'none',
      userID: 'none',
      userMail: 'none',
      age: 'none',
      gender: 'none',
      rate: 5,
      style: [
        { rass: '' },
        { emo: '' },
        { radi: '' },
        { sder: '' }
      ]
    });

    const myQuestionsData = writable([]);
    const allQuestionsData = writable([]);

    /**
     * Create a ripple action
     * @typedef {{ event?: string; transition?: number; zIndex?: string; rippleColor?: string; disabled?: boolean }} Options
     * @param {Element} node
     * @param {Options} [options={}]
     * @returns {{ destroy: () => void; update: (options?: Options) => void }}
     */
    function ripple(node, options = {}) {
      // Default values.
      const props = {
        event: options.event || 'click',
        transition: options.transition || 150,
        zIndex: options.zIndex || '100',
        bg: options.rippleColor || null,
        disabled: options.disabled || false,
      };

      const handler = event => rippler(event, node, props);

      if (!props.disabled) {
        node.addEventListener(props.event, handler);
      }

      function rippler(event, target, { bg, zIndex, transition }) {
        // Get border to avoid offsetting on ripple container position
        const targetBorder = parseInt(
          getComputedStyle(target).borderWidth.replace('px', '')
        );

        // Get necessary variables
        const rect = target.getBoundingClientRect(),
          left = rect.left,
          top = rect.top,
          width = target.offsetWidth,
          height = target.offsetHeight,
          dx = event.clientX - left,
          dy = event.clientY - top,
          maxX = Math.max(dx, width - dx),
          maxY = Math.max(dy, height - dy),
          style = window.getComputedStyle(target),
          radius = Math.sqrt(maxX * maxX + maxY * maxY),
          border = targetBorder > 0 ? targetBorder : 0;

        // Create the ripple and its container
        const ripple = document.createElement('div');
        const rippleContainer = document.createElement('div');
        rippleContainer.className = 'ripple-container';
        ripple.className = 'ripple';

        // Styles for the ripple
        ripple.style.marginTop = '0px';
        ripple.style.marginLeft = '0px';
        ripple.style.width = '1px';
        ripple.style.height = '1px';
        ripple.style.transition = `all ${transition}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.position = 'relative';
        ripple.style.zIndex = zIndex;
        if (bg !== null) {
          ripple.style.backgroundColor = bg;
        }

        // Styles for the rippleContainer
        rippleContainer.style.position = 'absolute';
        rippleContainer.style.left = 0 - border + 'px';
        rippleContainer.style.top = 0 - border + 'px';
        rippleContainer.style.height = '0';
        rippleContainer.style.width = '0';
        rippleContainer.style.pointerEvents = 'none';
        rippleContainer.style.overflow = 'hidden';

        // Store target position to change it after
        const storedTargetPosition =
          target.style.position.length > 0
            ? target.style.position
            : getComputedStyle(target).position;
        // Change target position to relative to guarantee ripples correct positioning
        if (
          storedTargetPosition !== 'relative' &&
          storedTargetPosition !== 'absolute'
        ) {
          target.style.position = 'relative';
        }

        rippleContainer.appendChild(ripple);
        target.appendChild(rippleContainer);

        ripple.style.marginLeft = dx + 'px';
        ripple.style.marginTop = dy + 'px';

        rippleContainer.style.width = width + 'px';
        rippleContainer.style.height = height + 'px';
        rippleContainer.style.borderTopLeftRadius = style.borderTopLeftRadius;
        rippleContainer.style.borderTopRightRadius = style.borderTopRightRadius;
        rippleContainer.style.borderBottomLeftRadius = style.borderBottomLeftRadius;
        rippleContainer.style.borderBottomRightRadius =
          style.borderBottomRightRadius;
        rippleContainer.style.direction = 'ltr';

        setTimeout(() => {
          ripple.style.width = radius * 2 + 'px';
          ripple.style.height = radius * 2 + 'px';
          ripple.style.marginLeft = dx - radius + 'px';
          ripple.style.marginTop = dy - radius + 'px';
        }, 0);

        function clearRipple() {
          setTimeout(() => {
            ripple.style.backgroundColor = 'rgba(0, 0, 0, 0)';
          }, 250);

          // Timeout set to get a smooth removal of the ripple
          setTimeout(() => {
            rippleContainer.parentNode.removeChild(rippleContainer);
          }, transition + 250);

          // After removing event set position to target to it's original one
          // Timeout it's needed to avoid jerky effect of ripple jumping out parent target
          setTimeout(() => {
            let clearPosition = true;
            for (let i = 0; i < target.childNodes.length; i++) {
              if (target.childNodes[i].className === 'ripple-container') {
                clearPosition = false;
              }
            }

            if (clearPosition) {
              if (storedTargetPosition !== 'static') {
                target.style.position = storedTargetPosition;
              } else {
                target.style.position = '';
              }
            }
          }, transition + 250);
        }

        clearRipple();
      }

      return {
        destroy() {
          node.removeEventListener(props.event, handler);
        },
        update(newProps = {}) {
          if (newProps.disabled) {
            node.removeEventListener(props.event, handler);
          } else {
            node.addEventListener(props.event, handler);
          }
        },
      };
    }

    /**
     * An action to set up arbitrary event listeners dynamically.
     * @param {Element} node
     * @param {Array<{ name: string; handler: EventListenerOrEventListenerObject }>} args The event listeners to be registered
     * @returns {{ destroy: () => void }}
     */
    function events(node, args) {
      if (args != null) {
        for (const event of args) {
          node.addEventListener(event.name, event.handler);
        }
      }

      return {
        destroy() {
          if (args != null) {
            for (const event of args) {
              node.removeEventListener(event.name, event.handler);
            }
          }
        },
      };
    }

    /**
     * Filters out falsy classes.
     * @param {...(string | false | null)} args The classes to be filtered
     * @return {string} The classes without the falsy values
     */
    function classes(...args) {
      return args.filter(cls => !!cls).join(' ');
    }

    /* node_modules\attractions\button\button.svelte generated by Svelte v3.47.0 */
    const file$o = "node_modules\\attractions\\button\\button.svelte";

    // (124:0) {:else}
    function create_else_block$5(ctx) {
    	let button;
    	let button_class_value;
    	let ripple_action;
    	let eventsAction_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	let button_levels = [
    		{ type: "button" },
    		{ disabled: /*disabled*/ ctx[10] },
    		{
    			class: button_class_value = classes('btn', /*_class*/ ctx[0])
    		},
    		/*$$restProps*/ ctx[15]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			toggle_class(button, "filled", /*filled*/ ctx[1]);
    			toggle_class(button, "outline", /*outline*/ ctx[2]);
    			toggle_class(button, "danger", /*danger*/ ctx[3]);
    			toggle_class(button, "round", /*round*/ ctx[5]);
    			toggle_class(button, "neutral", /*neutral*/ ctx[4]);
    			toggle_class(button, "rectangle", /*rectangle*/ ctx[6]);
    			toggle_class(button, "small", /*small*/ ctx[7]);
    			toggle_class(button, "selected", /*selected*/ ctx[8]);
    			toggle_class(button, "svelte-2r4z0x", true);
    			add_location(button, file$o, 124, 2, 3278);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_1*/ ctx[19], false, false, false),
    					action_destroyer(ripple_action = ripple.call(null, button, {
    						disabled: /*noRipple*/ ctx[9] || /*disabled*/ ctx[10]
    					})),
    					action_destroyer(eventsAction_action = events.call(null, button, /*events*/ ctx[13]))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				{ type: "button" },
    				(!current || dirty & /*disabled*/ 1024) && { disabled: /*disabled*/ ctx[10] },
    				(!current || dirty & /*_class*/ 1 && button_class_value !== (button_class_value = classes('btn', /*_class*/ ctx[0]))) && { class: button_class_value },
    				dirty & /*$$restProps*/ 32768 && /*$$restProps*/ ctx[15]
    			]));

    			if (ripple_action && is_function(ripple_action.update) && dirty & /*noRipple, disabled*/ 1536) ripple_action.update.call(null, {
    				disabled: /*noRipple*/ ctx[9] || /*disabled*/ ctx[10]
    			});

    			if (eventsAction_action && is_function(eventsAction_action.update) && dirty & /*events*/ 8192) eventsAction_action.update.call(null, /*events*/ ctx[13]);
    			toggle_class(button, "filled", /*filled*/ ctx[1]);
    			toggle_class(button, "outline", /*outline*/ ctx[2]);
    			toggle_class(button, "danger", /*danger*/ ctx[3]);
    			toggle_class(button, "round", /*round*/ ctx[5]);
    			toggle_class(button, "neutral", /*neutral*/ ctx[4]);
    			toggle_class(button, "rectangle", /*rectangle*/ ctx[6]);
    			toggle_class(button, "small", /*small*/ ctx[7]);
    			toggle_class(button, "selected", /*selected*/ ctx[8]);
    			toggle_class(button, "svelte-2r4z0x", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(124:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (101:0) {#if href}
    function create_if_block$g(ctx) {
    	let a;
    	let a_href_value;
    	let a_rel_value;
    	let a_sapper_prefetch_value;
    	let a_sveltekit_prefetch_value;
    	let a_disabled_value;
    	let a_class_value;
    	let eventsAction_action;
    	let ripple_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	let a_levels = [
    		{
    			href: a_href_value = /*disabled*/ ctx[10] ? null : /*href*/ ctx[11]
    		},
    		{
    			rel: a_rel_value = /*noPrefetch*/ ctx[12] ? null : 'prefetch'
    		},
    		{
    			"sapper:prefetch": a_sapper_prefetch_value = /*noPrefetch*/ ctx[12] ? null : true
    		},
    		{
    			"sveltekit:prefetch": a_sveltekit_prefetch_value = /*noPrefetch*/ ctx[12] ? null : true
    		},
    		{
    			disabled: a_disabled_value = /*disabled*/ ctx[10] ? true : null
    		},
    		{
    			class: a_class_value = classes('btn', /*_class*/ ctx[0])
    		},
    		/*$$restProps*/ ctx[15]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			toggle_class(a, "filled", /*filled*/ ctx[1]);
    			toggle_class(a, "outline", /*outline*/ ctx[2]);
    			toggle_class(a, "danger", /*danger*/ ctx[3]);
    			toggle_class(a, "round", /*round*/ ctx[5]);
    			toggle_class(a, "neutral", /*neutral*/ ctx[4]);
    			toggle_class(a, "rectangle", /*rectangle*/ ctx[6]);
    			toggle_class(a, "small", /*small*/ ctx[7]);
    			toggle_class(a, "selected", /*selected*/ ctx[8]);
    			toggle_class(a, "svelte-2r4z0x", true);
    			add_location(a, file$o, 101, 2, 2694);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[18], false, false, false),
    					action_destroyer(eventsAction_action = events.call(null, a, /*events*/ ctx[13])),
    					action_destroyer(ripple_action = ripple.call(null, a, {
    						disabled: /*noRipple*/ ctx[9] || /*disabled*/ ctx[10]
    					}))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*disabled, href*/ 3072 && a_href_value !== (a_href_value = /*disabled*/ ctx[10] ? null : /*href*/ ctx[11])) && { href: a_href_value },
    				(!current || dirty & /*noPrefetch*/ 4096 && a_rel_value !== (a_rel_value = /*noPrefetch*/ ctx[12] ? null : 'prefetch')) && { rel: a_rel_value },
    				(!current || dirty & /*noPrefetch*/ 4096 && a_sapper_prefetch_value !== (a_sapper_prefetch_value = /*noPrefetch*/ ctx[12] ? null : true)) && {
    					"sapper:prefetch": a_sapper_prefetch_value
    				},
    				(!current || dirty & /*noPrefetch*/ 4096 && a_sveltekit_prefetch_value !== (a_sveltekit_prefetch_value = /*noPrefetch*/ ctx[12] ? null : true)) && {
    					"sveltekit:prefetch": a_sveltekit_prefetch_value
    				},
    				(!current || dirty & /*disabled*/ 1024 && a_disabled_value !== (a_disabled_value = /*disabled*/ ctx[10] ? true : null)) && { disabled: a_disabled_value },
    				(!current || dirty & /*_class*/ 1 && a_class_value !== (a_class_value = classes('btn', /*_class*/ ctx[0]))) && { class: a_class_value },
    				dirty & /*$$restProps*/ 32768 && /*$$restProps*/ ctx[15]
    			]));

    			if (eventsAction_action && is_function(eventsAction_action.update) && dirty & /*events*/ 8192) eventsAction_action.update.call(null, /*events*/ ctx[13]);

    			if (ripple_action && is_function(ripple_action.update) && dirty & /*noRipple, disabled*/ 1536) ripple_action.update.call(null, {
    				disabled: /*noRipple*/ ctx[9] || /*disabled*/ ctx[10]
    			});

    			toggle_class(a, "filled", /*filled*/ ctx[1]);
    			toggle_class(a, "outline", /*outline*/ ctx[2]);
    			toggle_class(a, "danger", /*danger*/ ctx[3]);
    			toggle_class(a, "round", /*round*/ ctx[5]);
    			toggle_class(a, "neutral", /*neutral*/ ctx[4]);
    			toggle_class(a, "rectangle", /*rectangle*/ ctx[6]);
    			toggle_class(a, "small", /*small*/ ctx[7]);
    			toggle_class(a, "selected", /*selected*/ ctx[8]);
    			toggle_class(a, "svelte-2r4z0x", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(101:0) {#if href}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$g, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[11]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"class","filled","outline","danger","neutral","round","rectangle","small","selected","noRipple","disabled","href","noPrefetch","events"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { class: _class = null } = $$props;
    	let { filled = false } = $$props;
    	let { outline = false } = $$props;
    	let { danger = false } = $$props;
    	let { neutral = false } = $$props;
    	let { round = false } = $$props;
    	let { rectangle = false } = $$props;
    	let { small = false } = $$props;
    	let { selected = false } = $$props;
    	let { noRipple = false } = $$props;
    	let { disabled = false } = $$props;
    	let { href = null } = $$props;
    	let { noPrefetch = false } = $$props;
    	let { events: events$1 = [] } = $$props;

    	if (filled && outline) {
    		console.error('A button may not be filled and outlined at the same time');
    	}

    	if (danger && neutral) {
    		console.error('A button may not be danger and neutral at the same time');
    	}

    	if (filled && selected) {
    		console.error('A button may not be filled and selected at the same time');
    	}

    	const dispatch = createEventDispatcher();
    	const click_handler = e => dispatch('click', { nativeEvent: e });
    	const click_handler_1 = e => dispatch('click', { nativeEvent: e });

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(15, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(0, _class = $$new_props.class);
    		if ('filled' in $$new_props) $$invalidate(1, filled = $$new_props.filled);
    		if ('outline' in $$new_props) $$invalidate(2, outline = $$new_props.outline);
    		if ('danger' in $$new_props) $$invalidate(3, danger = $$new_props.danger);
    		if ('neutral' in $$new_props) $$invalidate(4, neutral = $$new_props.neutral);
    		if ('round' in $$new_props) $$invalidate(5, round = $$new_props.round);
    		if ('rectangle' in $$new_props) $$invalidate(6, rectangle = $$new_props.rectangle);
    		if ('small' in $$new_props) $$invalidate(7, small = $$new_props.small);
    		if ('selected' in $$new_props) $$invalidate(8, selected = $$new_props.selected);
    		if ('noRipple' in $$new_props) $$invalidate(9, noRipple = $$new_props.noRipple);
    		if ('disabled' in $$new_props) $$invalidate(10, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(11, href = $$new_props.href);
    		if ('noPrefetch' in $$new_props) $$invalidate(12, noPrefetch = $$new_props.noPrefetch);
    		if ('events' in $$new_props) $$invalidate(13, events$1 = $$new_props.events);
    		if ('$$scope' in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		ripple,
    		eventsAction: events,
    		classes,
    		_class,
    		filled,
    		outline,
    		danger,
    		neutral,
    		round,
    		rectangle,
    		small,
    		selected,
    		noRipple,
    		disabled,
    		href,
    		noPrefetch,
    		events: events$1,
    		dispatch
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('_class' in $$props) $$invalidate(0, _class = $$new_props._class);
    		if ('filled' in $$props) $$invalidate(1, filled = $$new_props.filled);
    		if ('outline' in $$props) $$invalidate(2, outline = $$new_props.outline);
    		if ('danger' in $$props) $$invalidate(3, danger = $$new_props.danger);
    		if ('neutral' in $$props) $$invalidate(4, neutral = $$new_props.neutral);
    		if ('round' in $$props) $$invalidate(5, round = $$new_props.round);
    		if ('rectangle' in $$props) $$invalidate(6, rectangle = $$new_props.rectangle);
    		if ('small' in $$props) $$invalidate(7, small = $$new_props.small);
    		if ('selected' in $$props) $$invalidate(8, selected = $$new_props.selected);
    		if ('noRipple' in $$props) $$invalidate(9, noRipple = $$new_props.noRipple);
    		if ('disabled' in $$props) $$invalidate(10, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(11, href = $$new_props.href);
    		if ('noPrefetch' in $$props) $$invalidate(12, noPrefetch = $$new_props.noPrefetch);
    		if ('events' in $$props) $$invalidate(13, events$1 = $$new_props.events);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		_class,
    		filled,
    		outline,
    		danger,
    		neutral,
    		round,
    		rectangle,
    		small,
    		selected,
    		noRipple,
    		disabled,
    		href,
    		noPrefetch,
    		events$1,
    		dispatch,
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {
    			class: 0,
    			filled: 1,
    			outline: 2,
    			danger: 3,
    			neutral: 4,
    			round: 5,
    			rectangle: 6,
    			small: 7,
    			selected: 8,
    			noRipple: 9,
    			disabled: 10,
    			href: 11,
    			noPrefetch: 12,
    			events: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get danger() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set danger(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get neutral() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set neutral(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get round() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set round(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rectangle() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rectangle(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get small() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set small(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noRipple() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noRipple(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noPrefetch() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noPrefetch(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get events() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set events(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Button$1 = Button;

    /* node_modules\attractions\checkbox\checkbox.svelte generated by Svelte v3.47.0 */
    const file$n = "node_modules\\attractions\\checkbox\\checkbox.svelte";

    // (62:2) {#if slotLeft}
    function create_if_block_1$d(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$d.name,
    		type: "if",
    		source: "(62:2) {#if slotLeft}",
    		ctx
    	});

    	return block;
    }

    // (80:2) {#if !slotLeft}
    function create_if_block$f(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(80:2) {#if !slotLeft}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let label;
    	let t0;
    	let input;
    	let input_class_value;
    	let t1;
    	let div;
    	let div_class_value;
    	let t2;
    	let label_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*slotLeft*/ ctx[7] && create_if_block_1$d(ctx);

    	let input_levels = [
    		{ __value: /*value*/ ctx[5] },
    		{ type: "checkbox" },
    		{
    			class: input_class_value = classes(/*inputClass*/ ctx[2])
    		},
    		{ disabled: /*disabled*/ ctx[6] },
    		/*$$restProps*/ ctx[11]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let if_block1 = !/*slotLeft*/ ctx[7] && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			if (if_block1) if_block1.c();
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-ly1qcx", true);
    			add_location(input, file$n, 64, 2, 1790);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(classes('selector', /*selectorClass*/ ctx[3])) + " svelte-ly1qcx"));
    			attr_dev(div, "style", /*selectorStyle*/ ctx[4]);
    			add_location(div, file$n, 78, 2, 2068);
    			attr_dev(label, "class", label_class_value = "" + (null_to_empty(classes('checkbox', /*_class*/ ctx[1])) + " svelte-ly1qcx"));
    			attr_dev(label, "title", /*title*/ ctx[9]);
    			toggle_class(label, "round", /*round*/ ctx[8]);
    			add_location(label, file$n, 60, 0, 1686);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			if (if_block0) if_block0.m(label, null);
    			append_dev(label, t0);
    			append_dev(label, input);
    			if (input.autofocus) input.focus();
    			input.checked = /*checked*/ ctx[0];
    			append_dev(label, t1);
    			append_dev(label, div);
    			append_dev(label, t2);
    			if (if_block1) if_block1.m(label, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[14]),
    					listen_dev(input, "change", /*change_handler*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*slotLeft*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*slotLeft*/ 128) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$d(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(label, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				(!current || dirty & /*value*/ 32) && { __value: /*value*/ ctx[5] },
    				{ type: "checkbox" },
    				(!current || dirty & /*inputClass*/ 4 && input_class_value !== (input_class_value = classes(/*inputClass*/ ctx[2]))) && { class: input_class_value },
    				(!current || dirty & /*disabled*/ 64) && { disabled: /*disabled*/ ctx[6] },
    				dirty & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11]
    			]));

    			if (dirty & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}

    			toggle_class(input, "svelte-ly1qcx", true);

    			if (!current || dirty & /*selectorClass*/ 8 && div_class_value !== (div_class_value = "" + (null_to_empty(classes('selector', /*selectorClass*/ ctx[3])) + " svelte-ly1qcx"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*selectorStyle*/ 16) {
    				attr_dev(div, "style", /*selectorStyle*/ ctx[4]);
    			}

    			if (!/*slotLeft*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*slotLeft*/ 128) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$f(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(label, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*_class*/ 2 && label_class_value !== (label_class_value = "" + (null_to_empty(classes('checkbox', /*_class*/ ctx[1])) + " svelte-ly1qcx"))) {
    				attr_dev(label, "class", label_class_value);
    			}

    			if (!current || dirty & /*title*/ 512) {
    				attr_dev(label, "title", /*title*/ ctx[9]);
    			}

    			if (dirty & /*_class, round*/ 258) {
    				toggle_class(label, "round", /*round*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"class","inputClass","selectorClass","selectorStyle","checked","value","disabled","slotLeft","round","title"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Checkbox', slots, ['default']);
    	let { class: _class = null } = $$props;
    	let { inputClass = null } = $$props;
    	let { selectorClass = null } = $$props;
    	let { selectorStyle = null } = $$props;
    	let { checked = false } = $$props;
    	let { value } = $$props;
    	let { disabled = false } = $$props;
    	let { slotLeft = false } = $$props;
    	let { round = false } = $$props;
    	let { title = null } = $$props;
    	const dispatch = createEventDispatcher();

    	function input_change_handler() {
    		checked = this.checked;
    		$$invalidate(0, checked);
    	}

    	const change_handler = e => dispatch('change', {
    		value: e.target.value,
    		checked: e.target.checked,
    		nativeEvent: e
    	});

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(1, _class = $$new_props.class);
    		if ('inputClass' in $$new_props) $$invalidate(2, inputClass = $$new_props.inputClass);
    		if ('selectorClass' in $$new_props) $$invalidate(3, selectorClass = $$new_props.selectorClass);
    		if ('selectorStyle' in $$new_props) $$invalidate(4, selectorStyle = $$new_props.selectorStyle);
    		if ('checked' in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ('value' in $$new_props) $$invalidate(5, value = $$new_props.value);
    		if ('disabled' in $$new_props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ('slotLeft' in $$new_props) $$invalidate(7, slotLeft = $$new_props.slotLeft);
    		if ('round' in $$new_props) $$invalidate(8, round = $$new_props.round);
    		if ('title' in $$new_props) $$invalidate(9, title = $$new_props.title);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		classes,
    		_class,
    		inputClass,
    		selectorClass,
    		selectorStyle,
    		checked,
    		value,
    		disabled,
    		slotLeft,
    		round,
    		title,
    		dispatch
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('_class' in $$props) $$invalidate(1, _class = $$new_props._class);
    		if ('inputClass' in $$props) $$invalidate(2, inputClass = $$new_props.inputClass);
    		if ('selectorClass' in $$props) $$invalidate(3, selectorClass = $$new_props.selectorClass);
    		if ('selectorStyle' in $$props) $$invalidate(4, selectorStyle = $$new_props.selectorStyle);
    		if ('checked' in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ('value' in $$props) $$invalidate(5, value = $$new_props.value);
    		if ('disabled' in $$props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ('slotLeft' in $$props) $$invalidate(7, slotLeft = $$new_props.slotLeft);
    		if ('round' in $$props) $$invalidate(8, round = $$new_props.round);
    		if ('title' in $$props) $$invalidate(9, title = $$new_props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		checked,
    		_class,
    		inputClass,
    		selectorClass,
    		selectorStyle,
    		value,
    		disabled,
    		slotLeft,
    		round,
    		title,
    		dispatch,
    		$$restProps,
    		$$scope,
    		slots,
    		input_change_handler,
    		change_handler
    	];
    }

    class Checkbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			class: 1,
    			inputClass: 2,
    			selectorClass: 3,
    			selectorStyle: 4,
    			checked: 0,
    			value: 5,
    			disabled: 6,
    			slotLeft: 7,
    			round: 8,
    			title: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkbox",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[5] === undefined && !('value' in props)) {
    			console.warn("<Checkbox> was created without expected prop 'value'");
    		}
    	}

    	get class() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputClass() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputClass(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectorClass() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectorClass(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectorStyle() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectorStyle(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get slotLeft() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set slotLeft(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get round() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set round(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Checkbox$1 = Checkbox;

    /* node_modules\attractions\chip\radio-chip.svelte generated by Svelte v3.47.0 */
    const file$m = "node_modules\\attractions\\chip\\radio-chip.svelte";

    // (86:10) {value}
    function fallback_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*value*/ ctx[4]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 16) set_data_dev(t, /*value*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$3.name,
    		type: "fallback",
    		source: "(86:10) {value}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let label;
    	let input;
    	let input_class_value;
    	let t;
    	let div;
    	let div_class_value;
    	let ripple_action;
    	let label_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{ __value: /*value*/ ctx[4] },
    		{ name: /*name*/ ctx[5] },
    		{ type: "radio" },
    		{
    			class: input_class_value = classes(/*inputClass*/ ctx[2])
    		},
    		{ disabled: /*disabled*/ ctx[6] },
    		/*$$restProps*/ ctx[12]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
    	const default_slot_or_fallback = default_slot || fallback_block$3(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t = space();
    			div = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(input, input_data);
    			/*$$binding_groups*/ ctx[16][0].push(input);
    			toggle_class(input, "svelte-kwof33", true);
    			add_location(input, file$m, 67, 2, 1798);
    			attr_dev(div, "title", /*title*/ ctx[7]);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(classes('chip', /*chipClass*/ ctx[3])) + " svelte-kwof33"));
    			toggle_class(div, "small", /*small*/ ctx[8]);
    			toggle_class(div, "outline", /*outline*/ ctx[9]);
    			toggle_class(div, "no-padding", /*noPadding*/ ctx[10]);
    			add_location(div, file$m, 77, 2, 2002);
    			attr_dev(label, "class", label_class_value = "" + (null_to_empty(classes('input-chip radio-chip', /*_class*/ ctx[1])) + " svelte-kwof33"));
    			add_location(label, file$m, 66, 0, 1739);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			if (input.autofocus) input.focus();
    			input.checked = input.__value === /*group*/ ctx[0];
    			append_dev(label, t);
    			append_dev(label, div);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[15]),
    					listen_dev(input, "change", /*change_handler*/ ctx[17], false, false, false),
    					action_destroyer(ripple_action = ripple.call(null, div, { disabled: /*disabled*/ ctx[6] }))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				(!current || dirty & /*value*/ 16) && { __value: /*value*/ ctx[4] },
    				(!current || dirty & /*name*/ 32) && { name: /*name*/ ctx[5] },
    				{ type: "radio" },
    				(!current || dirty & /*inputClass*/ 4 && input_class_value !== (input_class_value = classes(/*inputClass*/ ctx[2]))) && { class: input_class_value },
    				(!current || dirty & /*disabled*/ 64) && { disabled: /*disabled*/ ctx[6] },
    				dirty & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12]
    			]));

    			if (dirty & /*group*/ 1) {
    				input.checked = input.__value === /*group*/ ctx[0];
    			}

    			toggle_class(input, "svelte-kwof33", true);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*value*/ 16)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (!current || dirty & /*title*/ 128) {
    				attr_dev(div, "title", /*title*/ ctx[7]);
    			}

    			if (!current || dirty & /*chipClass*/ 8 && div_class_value !== (div_class_value = "" + (null_to_empty(classes('chip', /*chipClass*/ ctx[3])) + " svelte-kwof33"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (ripple_action && is_function(ripple_action.update) && dirty & /*disabled*/ 64) ripple_action.update.call(null, { disabled: /*disabled*/ ctx[6] });

    			if (dirty & /*chipClass, small*/ 264) {
    				toggle_class(div, "small", /*small*/ ctx[8]);
    			}

    			if (dirty & /*chipClass, outline*/ 520) {
    				toggle_class(div, "outline", /*outline*/ ctx[9]);
    			}

    			if (dirty & /*chipClass, noPadding*/ 1032) {
    				toggle_class(div, "no-padding", /*noPadding*/ ctx[10]);
    			}

    			if (!current || dirty & /*_class*/ 2 && label_class_value !== (label_class_value = "" + (null_to_empty(classes('input-chip radio-chip', /*_class*/ ctx[1])) + " svelte-kwof33"))) {
    				attr_dev(label, "class", label_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[16][0].splice(/*$$binding_groups*/ ctx[16][0].indexOf(input), 1);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"class","inputClass","chipClass","value","name","disabled","group","title","small","outline","noPadding"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Radio_chip', slots, ['default']);
    	let { class: _class = null } = $$props;
    	let { inputClass = null } = $$props;
    	let { chipClass = null } = $$props;
    	let { value } = $$props;
    	let { name } = $$props;
    	let { disabled = false } = $$props;
    	let { group = null } = $$props;
    	let { title = null } = $$props;
    	let { small = false } = $$props;
    	let { outline = false } = $$props;
    	let { noPadding = false } = $$props;
    	const dispatch = createEventDispatcher();
    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		group = this.__value;
    		$$invalidate(0, group);
    	}

    	const change_handler = e => dispatch('change', { value, nativeEvent: e });

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(1, _class = $$new_props.class);
    		if ('inputClass' in $$new_props) $$invalidate(2, inputClass = $$new_props.inputClass);
    		if ('chipClass' in $$new_props) $$invalidate(3, chipClass = $$new_props.chipClass);
    		if ('value' in $$new_props) $$invalidate(4, value = $$new_props.value);
    		if ('name' in $$new_props) $$invalidate(5, name = $$new_props.name);
    		if ('disabled' in $$new_props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ('group' in $$new_props) $$invalidate(0, group = $$new_props.group);
    		if ('title' in $$new_props) $$invalidate(7, title = $$new_props.title);
    		if ('small' in $$new_props) $$invalidate(8, small = $$new_props.small);
    		if ('outline' in $$new_props) $$invalidate(9, outline = $$new_props.outline);
    		if ('noPadding' in $$new_props) $$invalidate(10, noPadding = $$new_props.noPadding);
    		if ('$$scope' in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		classes,
    		ripple,
    		_class,
    		inputClass,
    		chipClass,
    		value,
    		name,
    		disabled,
    		group,
    		title,
    		small,
    		outline,
    		noPadding,
    		dispatch
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('_class' in $$props) $$invalidate(1, _class = $$new_props._class);
    		if ('inputClass' in $$props) $$invalidate(2, inputClass = $$new_props.inputClass);
    		if ('chipClass' in $$props) $$invalidate(3, chipClass = $$new_props.chipClass);
    		if ('value' in $$props) $$invalidate(4, value = $$new_props.value);
    		if ('name' in $$props) $$invalidate(5, name = $$new_props.name);
    		if ('disabled' in $$props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ('group' in $$props) $$invalidate(0, group = $$new_props.group);
    		if ('title' in $$props) $$invalidate(7, title = $$new_props.title);
    		if ('small' in $$props) $$invalidate(8, small = $$new_props.small);
    		if ('outline' in $$props) $$invalidate(9, outline = $$new_props.outline);
    		if ('noPadding' in $$props) $$invalidate(10, noPadding = $$new_props.noPadding);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		group,
    		_class,
    		inputClass,
    		chipClass,
    		value,
    		name,
    		disabled,
    		title,
    		small,
    		outline,
    		noPadding,
    		dispatch,
    		$$restProps,
    		$$scope,
    		slots,
    		input_change_handler,
    		$$binding_groups,
    		change_handler
    	];
    }

    class Radio_chip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			class: 1,
    			inputClass: 2,
    			chipClass: 3,
    			value: 4,
    			name: 5,
    			disabled: 6,
    			group: 0,
    			title: 7,
    			small: 8,
    			outline: 9,
    			noPadding: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Radio_chip",
    			options,
    			id: create_fragment$n.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[4] === undefined && !('value' in props)) {
    			console.warn("<Radio_chip> was created without expected prop 'value'");
    		}

    		if (/*name*/ ctx[5] === undefined && !('name' in props)) {
    			console.warn("<Radio_chip> was created without expected prop 'name'");
    		}
    	}

    	get class() {
    		throw new Error("<Radio_chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Radio_chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputClass() {
    		throw new Error("<Radio_chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputClass(value) {
    		throw new Error("<Radio_chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get chipClass() {
    		throw new Error("<Radio_chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chipClass(value) {
    		throw new Error("<Radio_chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Radio_chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Radio_chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Radio_chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Radio_chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Radio_chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Radio_chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Radio_chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Radio_chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Radio_chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Radio_chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get small() {
    		throw new Error("<Radio_chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set small(value) {
    		throw new Error("<Radio_chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Radio_chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Radio_chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noPadding() {
    		throw new Error("<Radio_chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noPadding(value) {
    		throw new Error("<Radio_chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var RadioChip = Radio_chip;

    /* node_modules\attractions\chip\radio-chip-group.svelte generated by Svelte v3.47.0 */

    const { console: console_1$b } = globals;
    const file$l = "node_modules\\attractions\\chip\\radio-chip-group.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (44:0) {#if items != null && items.length !== 0}
    function create_if_block$e(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let div_class_value;
    	let current;
    	let each_value = /*items*/ ctx[4];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[9].value;
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(classes(/*_class*/ ctx[1])) + " svelte-15v276f"));
    			attr_dev(div, "role", "radiogroup");
    			add_location(div, file$l, 44, 2, 1343);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name, items, classes, radioClass, $$restProps, value, labelClass*/ 125) {
    				each_value = /*items*/ ctx[4];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$3, null, get_each_context$3);
    				check_outros();
    			}

    			if (!current || dirty & /*_class*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(classes(/*_class*/ ctx[1])) + " svelte-15v276f"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(44:0) {#if items != null && items.length !== 0}",
    		ctx
    	});

    	return block;
    }

    // (58:8) {:else}
    function create_else_block$4(ctx) {
    	let t_value = (/*item*/ ctx[9].label || /*item*/ ctx[9].value) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 16 && t_value !== (t_value = (/*item*/ ctx[9].label || /*item*/ ctx[9].value) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(58:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (56:8) {#if labelClass != null}
    function create_if_block_1$c(ctx) {
    	let span;
    	let t_value = (/*item*/ ctx[9].label || /*item*/ ctx[9].value) + "";
    	let t;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", span_class_value = classes(/*labelClass*/ ctx[3]));
    			add_location(span, file$l, 56, 10, 1679);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 16 && t_value !== (t_value = (/*item*/ ctx[9].label || /*item*/ ctx[9].value) + "")) set_data_dev(t, t_value);

    			if (dirty & /*labelClass*/ 8 && span_class_value !== (span_class_value = classes(/*labelClass*/ ctx[3]))) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$c.name,
    		type: "if",
    		source: "(56:8) {#if labelClass != null}",
    		ctx
    	});

    	return block;
    }

    // (47:6) <RadioChip         {name}         bind:group={value}         value={item.value}         disabled={item.disabled}         class={classes(radioClass)}         on:change         {...$$restProps}       >
    function create_default_slot$7(ctx) {
    	let t;

    	function select_block_type(ctx, dirty) {
    		if (/*labelClass*/ ctx[3] != null) return create_if_block_1$c;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(47:6) <RadioChip         {name}         bind:group={value}         value={item.value}         disabled={item.disabled}         class={classes(radioClass)}         on:change         {...$$restProps}       >",
    		ctx
    	});

    	return block;
    }

    // (46:4) {#each items as item (item.value)}
    function create_each_block$3(key_1, ctx) {
    	let first;
    	let radiochip;
    	let updating_group;
    	let current;

    	const radiochip_spread_levels = [
    		{ name: /*name*/ ctx[5] },
    		{ value: /*item*/ ctx[9].value },
    		{ disabled: /*item*/ ctx[9].disabled },
    		{ class: classes(/*radioClass*/ ctx[2]) },
    		/*$$restProps*/ ctx[6]
    	];

    	function radiochip_group_binding(value) {
    		/*radiochip_group_binding*/ ctx[7](value);
    	}

    	let radiochip_props = {
    		$$slots: { default: [create_default_slot$7] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < radiochip_spread_levels.length; i += 1) {
    		radiochip_props = assign(radiochip_props, radiochip_spread_levels[i]);
    	}

    	if (/*value*/ ctx[0] !== void 0) {
    		radiochip_props.group = /*value*/ ctx[0];
    	}

    	radiochip = new RadioChip({ props: radiochip_props, $$inline: true });
    	binding_callbacks.push(() => bind(radiochip, 'group', radiochip_group_binding));
    	radiochip.$on("change", /*change_handler*/ ctx[8]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(radiochip.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(radiochip, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const radiochip_changes = (dirty & /*name, items, classes, radioClass, $$restProps*/ 116)
    			? get_spread_update(radiochip_spread_levels, [
    					dirty & /*name*/ 32 && { name: /*name*/ ctx[5] },
    					dirty & /*items*/ 16 && { value: /*item*/ ctx[9].value },
    					dirty & /*items*/ 16 && { disabled: /*item*/ ctx[9].disabled },
    					dirty & /*classes, radioClass*/ 4 && { class: classes(/*radioClass*/ ctx[2]) },
    					dirty & /*$$restProps*/ 64 && get_spread_object(/*$$restProps*/ ctx[6])
    				])
    			: {};

    			if (dirty & /*$$scope, labelClass, items*/ 4120) {
    				radiochip_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_group && dirty & /*value*/ 1) {
    				updating_group = true;
    				radiochip_changes.group = /*value*/ ctx[0];
    				add_flush_callback(() => updating_group = false);
    			}

    			radiochip.$set(radiochip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(radiochip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(radiochip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(radiochip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(46:4) {#each items as item (item.value)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*items*/ ctx[4] != null && /*items*/ ctx[4].length !== 0 && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*items*/ ctx[4] != null && /*items*/ ctx[4].length !== 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*items*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$e(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","radioClass","labelClass","items","value","name"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Radio_chip_group', slots, []);
    	let { class: _class = null } = $$props;
    	let { radioClass = null } = $$props;
    	let { labelClass = null } = $$props;
    	let { items } = $$props;
    	let { value = null } = $$props;
    	let { name } = $$props;

    	if (!items || items.length === 0) {
    		console.error('Must have at least one item in the radio chip group');
    	}

    	function radiochip_group_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(1, _class = $$new_props.class);
    		if ('radioClass' in $$new_props) $$invalidate(2, radioClass = $$new_props.radioClass);
    		if ('labelClass' in $$new_props) $$invalidate(3, labelClass = $$new_props.labelClass);
    		if ('items' in $$new_props) $$invalidate(4, items = $$new_props.items);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('name' in $$new_props) $$invalidate(5, name = $$new_props.name);
    	};

    	$$self.$capture_state = () => ({
    		classes,
    		RadioChip,
    		_class,
    		radioClass,
    		labelClass,
    		items,
    		value,
    		name
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('_class' in $$props) $$invalidate(1, _class = $$new_props._class);
    		if ('radioClass' in $$props) $$invalidate(2, radioClass = $$new_props.radioClass);
    		if ('labelClass' in $$props) $$invalidate(3, labelClass = $$new_props.labelClass);
    		if ('items' in $$props) $$invalidate(4, items = $$new_props.items);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('name' in $$props) $$invalidate(5, name = $$new_props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		_class,
    		radioClass,
    		labelClass,
    		items,
    		name,
    		$$restProps,
    		radiochip_group_binding,
    		change_handler
    	];
    }

    class Radio_chip_group extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			class: 1,
    			radioClass: 2,
    			labelClass: 3,
    			items: 4,
    			value: 0,
    			name: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Radio_chip_group",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[4] === undefined && !('items' in props)) {
    			console_1$b.warn("<Radio_chip_group> was created without expected prop 'items'");
    		}

    		if (/*name*/ ctx[5] === undefined && !('name' in props)) {
    			console_1$b.warn("<Radio_chip_group> was created without expected prop 'name'");
    		}
    	}

    	get class() {
    		throw new Error("<Radio_chip_group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Radio_chip_group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get radioClass() {
    		throw new Error("<Radio_chip_group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set radioClass(value) {
    		throw new Error("<Radio_chip_group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelClass() {
    		throw new Error("<Radio_chip_group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelClass(value) {
    		throw new Error("<Radio_chip_group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<Radio_chip_group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Radio_chip_group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Radio_chip_group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Radio_chip_group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Radio_chip_group>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Radio_chip_group>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var RadioChipGroup = Radio_chip_group;

    /* node_modules\attractions\modal\modal.svelte generated by Svelte v3.47.0 */
    const file$k = "node_modules\\attractions\\modal\\modal.svelte";
    const get_default_slot_changes_1 = dirty => ({});
    const get_default_slot_context_1 = ctx => ({ closeCallback: /*close*/ ctx[3] });
    const get_default_slot_changes = dirty => ({});
    const get_default_slot_context = ctx => ({ closeCallback: /*close*/ ctx[3] });

    // (38:0) {:else}
    function create_else_block$3(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], get_default_slot_context_1);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(classes('modal-overlay', /*_class*/ ctx[1])) + " svelte-rafkre"));
    			toggle_class(div, "open", /*open*/ ctx[0]);
    			add_location(div, file$k, 38, 2, 832);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, get_default_slot_changes_1),
    						get_default_slot_context_1
    					);
    				}
    			}

    			if (!current || dirty & /*_class*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(classes('modal-overlay', /*_class*/ ctx[1])) + " svelte-rafkre"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*_class, open*/ 3) {
    				toggle_class(div, "open", /*open*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(38:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (30:0) {#if !noClickaway}
    function create_if_block$d(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], get_default_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(classes('modal-overlay', /*_class*/ ctx[1])) + " svelte-rafkre"));
    			toggle_class(div, "open", /*open*/ ctx[0]);
    			add_location(div, file$k, 30, 2, 683);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", self(/*close*/ ctx[3]), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*_class*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(classes('modal-overlay', /*_class*/ ctx[1])) + " svelte-rafkre"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*_class, open*/ 3) {
    				toggle_class(div, "open", /*open*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(30:0) {#if !noClickaway}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$d, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*noClickaway*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	let { class: _class = null } = $$props;
    	let { open = false } = $$props;
    	let { noClickaway = false } = $$props;

    	function close() {
    		$$invalidate(0, open = false);
    	}

    	const dispatch = createEventDispatcher();
    	const writable_props = ['class', 'open', 'noClickaway'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(1, _class = $$props.class);
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('noClickaway' in $$props) $$invalidate(2, noClickaway = $$props.noClickaway);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		classes,
    		_class,
    		open,
    		noClickaway,
    		close,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('_class' in $$props) $$invalidate(1, _class = $$props._class);
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('noClickaway' in $$props) $$invalidate(2, noClickaway = $$props.noClickaway);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 1) {
    			dispatch('change', { value: open });
    		}
    	};

    	return [open, _class, noClickaway, close, $$scope, slots];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { class: 1, open: 0, noClickaway: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get class() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noClickaway() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noClickaway(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Modal$1 = Modal;

    /* node_modules\attractions\divider\divider.svelte generated by Svelte v3.47.0 */

    const file$j = "node_modules\\attractions\\divider\\divider.svelte";

    function create_fragment$k(ctx) {
    	let hr;
    	let hr_levels = [{ "data-text": /*text*/ ctx[0] }, /*$$restProps*/ ctx[1]];
    	let hr_data = {};

    	for (let i = 0; i < hr_levels.length; i += 1) {
    		hr_data = assign(hr_data, hr_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			set_attributes(hr, hr_data);
    			toggle_class(hr, "svelte-lhyupy", true);
    			add_location(hr, file$j, 8, 0, 129);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(hr, hr_data = get_spread_update(hr_levels, [
    				dirty & /*text*/ 1 && { "data-text": /*text*/ ctx[0] },
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]
    			]));

    			toggle_class(hr, "svelte-lhyupy", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	const omit_props_names = ["text"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Divider', slots, []);
    	let { text = null } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('text' in $$new_props) $$invalidate(0, text = $$new_props.text);
    	};

    	$$self.$capture_state = () => ({ text });

    	$$self.$inject_state = $$new_props => {
    		if ('text' in $$props) $$invalidate(0, text = $$new_props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, $$restProps];
    }

    class Divider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Divider",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get text() {
    		throw new Error("<Divider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Divider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Divider$1 = Divider;

    function sineOut(t) {
        return Math.sin((t * Math.PI) / 2);
    }

    /* node_modules\attractions\star-rating\star.svelte generated by Svelte v3.47.0 */

    const file$i = "node_modules\\attractions\\star-rating\\star.svelte";

    function create_fragment$j(ctx) {
    	let svg;
    	let polygon;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			polygon = svg_element("polygon");
    			attr_dev(polygon, "points", "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2");
    			add_location(polygon, file$i, 11, 2, 263);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			add_location(svg, file$i, 1, 0, 74);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, polygon);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Star', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Star> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Star extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Star",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    var Star$1 = Star;

    /**
     * Generates a semi-open range.
     * @param {number} start The beginning of the range (included)
     * @param {number} [end] The end of the range (excluded)
     * @param {number} [step=1] The distance between the numbers in the range
     * @returns {Generator<number, void, never>}
     */
    function* range(start, end, step = 1) {
      if (end == null) {
        end = start;
        start = 0;
      }

      if (step === 0) {
        throw new Error('Range must have a non-zero step.');
      }

      if ((start >= end && step > 0) || (start <= end && step < 0)) {
        return;
      }

      for (let i = start; start < end ? i < end : i > end; i += step) {
        yield i;
      }
    }

    /* node_modules\attractions\star-rating\star-rating.svelte generated by Svelte v3.47.0 */
    const file$h = "node_modules\\attractions\\star-rating\\star-rating.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});

    // (88:24)          
    function fallback_block$2(ctx) {
    	let star;
    	let current;
    	star = new Star$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(star.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(star, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(star.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(star.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(star, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(88:24)          ",
    		ctx
    	});

    	return block;
    }

    // (70:2) {#each [...range(max, 0, -1)] as i}
    function create_each_block$2(ctx) {
    	let input;
    	let input_value_value;
    	let input_id_value;
    	let eventsAction_action;
    	let t0;
    	let label;
    	let t1;
    	let label_class_value;
    	let label_for_value;
    	let ripple_action;
    	let current;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{
    			__value: input_value_value = /*i*/ ctx[15]
    		},
    		{ type: "radio" },
    		{ name: /*name*/ ctx[4] },
    		{
    			id: input_id_value = `${/*name*/ ctx[4]}-${/*i*/ ctx[15]}`
    		},
    		{ disabled: /*disabled*/ ctx[5] },
    		/*$$restProps*/ ctx[9]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const icon_slot_template = /*#slots*/ ctx[11].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[10], get_icon_slot_context);
    	const icon_slot_or_fallback = icon_slot || fallback_block$2(ctx);

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			if (icon_slot_or_fallback) icon_slot_or_fallback.c();
    			t1 = space();
    			set_attributes(input, input_data);
    			/*$$binding_groups*/ ctx[13][0].push(input);
    			toggle_class(input, "svelte-172gjzj", true);
    			add_location(input, file$h, 70, 4, 1917);
    			attr_dev(label, "class", label_class_value = "" + (null_to_empty(classes(/*starClass*/ ctx[2])) + " svelte-172gjzj"));
    			attr_dev(label, "for", label_for_value = `${/*name*/ ctx[4]}-${/*i*/ ctx[15]}`);
    			add_location(label, file$h, 82, 4, 2211);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			input.checked = input.__value === /*value*/ ctx[0];
    			insert_dev(target, t0, anchor);
    			insert_dev(target, label, anchor);

    			if (icon_slot_or_fallback) {
    				icon_slot_or_fallback.m(label, null);
    			}

    			append_dev(label, t1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[12]),
    					listen_dev(input, "change", /*change_handler*/ ctx[14], false, false, false),
    					listen_dev(input, "keydown", /*reverseArrowKeys*/ ctx[7], false, false, false),
    					action_destroyer(eventsAction_action = events.call(null, input, /*events*/ ctx[6])),
    					action_destroyer(ripple_action = ripple.call(null, label, { disabled: /*disabled*/ ctx[5] }))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				(!current || dirty & /*max*/ 8 && input_value_value !== (input_value_value = /*i*/ ctx[15])) && { __value: input_value_value },
    				{ type: "radio" },
    				(!current || dirty & /*name*/ 16) && { name: /*name*/ ctx[4] },
    				(!current || dirty & /*name, max*/ 24 && input_id_value !== (input_id_value = `${/*name*/ ctx[4]}-${/*i*/ ctx[15]}`)) && { id: input_id_value },
    				(!current || dirty & /*disabled*/ 32) && { disabled: /*disabled*/ ctx[5] },
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9]
    			]));

    			if (dirty & /*value*/ 1) {
    				input.checked = input.__value === /*value*/ ctx[0];
    			}

    			if (eventsAction_action && is_function(eventsAction_action.update) && dirty & /*events*/ 64) eventsAction_action.update.call(null, /*events*/ ctx[6]);
    			toggle_class(input, "svelte-172gjzj", true);

    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[10], dirty, get_icon_slot_changes),
    						get_icon_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*starClass*/ 4 && label_class_value !== (label_class_value = "" + (null_to_empty(classes(/*starClass*/ ctx[2])) + " svelte-172gjzj"))) {
    				attr_dev(label, "class", label_class_value);
    			}

    			if (!current || dirty & /*name, max*/ 24 && label_for_value !== (label_for_value = `${/*name*/ ctx[4]}-${/*i*/ ctx[15]}`)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (ripple_action && is_function(ripple_action.update) && dirty & /*disabled*/ 32) ripple_action.update.call(null, { disabled: /*disabled*/ ctx[5] });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*$$binding_groups*/ ctx[13][0].splice(/*$$binding_groups*/ ctx[13][0].indexOf(input), 1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(label);
    			if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(70:2) {#each [...range(max, 0, -1)] as i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	let each_value = [...range(/*max*/ ctx[3], 0, -1)];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "role", "group");
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(classes('star-rating', /*_class*/ ctx[1])) + " svelte-172gjzj"));
    			add_location(div, file$h, 68, 0, 1817);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*classes, starClass, name, range, max, disabled, $$scope, $$restProps, value, events, dispatch, reverseArrowKeys*/ 2045) {
    				each_value = [...range(/*max*/ ctx[3], 0, -1)];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*_class*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(classes('star-rating', /*_class*/ ctx[1])) + " svelte-172gjzj"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","starClass","max","value","name","disabled","events"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Star_rating', slots, ['icon']);
    	let { class: _class = null } = $$props;
    	let { starClass = null } = $$props;
    	let { max = 5 } = $$props;
    	let { value = 0 } = $$props;
    	let { name } = $$props;
    	let { disabled = false } = $$props;
    	let { events: events$1 = [] } = $$props;

    	function reverseArrowKeys(event) {
    		switch (event.key) {
    			case 'ArrowLeft':
    			case 'ArrowDown':
    				event.preventDefault();
    				$$invalidate(0, value = (value + (max + 1) - 1) % (max + 1));
    				if (value === 0) {
    					$$invalidate(0, value = max); // would otherwise get stuck at 1
    				}
    				break;
    			case 'ArrowRight':
    			case 'ArrowUp':
    				event.preventDefault();
    				$$invalidate(0, value = (value + 1) % (max + 1));
    				break;
    		}

    		$$invalidate(0, value = Math.max(value, 1));
    	}

    	const dispatch = createEventDispatcher();
    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		value = this.__value;
    		$$invalidate(0, value);
    	}

    	const change_handler = e => dispatch('change', { value, nativeEvent: e });

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(1, _class = $$new_props.class);
    		if ('starClass' in $$new_props) $$invalidate(2, starClass = $$new_props.starClass);
    		if ('max' in $$new_props) $$invalidate(3, max = $$new_props.max);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('name' in $$new_props) $$invalidate(4, name = $$new_props.name);
    		if ('disabled' in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('events' in $$new_props) $$invalidate(6, events$1 = $$new_props.events);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Star: Star$1,
    		range,
    		classes,
    		ripple,
    		eventsAction: events,
    		_class,
    		starClass,
    		max,
    		value,
    		name,
    		disabled,
    		events: events$1,
    		reverseArrowKeys,
    		dispatch
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('_class' in $$props) $$invalidate(1, _class = $$new_props._class);
    		if ('starClass' in $$props) $$invalidate(2, starClass = $$new_props.starClass);
    		if ('max' in $$props) $$invalidate(3, max = $$new_props.max);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('name' in $$props) $$invalidate(4, name = $$new_props.name);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('events' in $$props) $$invalidate(6, events$1 = $$new_props.events);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		_class,
    		starClass,
    		max,
    		name,
    		disabled,
    		events$1,
    		reverseArrowKeys,
    		dispatch,
    		$$restProps,
    		$$scope,
    		slots,
    		input_change_handler,
    		$$binding_groups,
    		change_handler
    	];
    }

    class Star_rating extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			class: 1,
    			starClass: 2,
    			max: 3,
    			value: 0,
    			name: 4,
    			disabled: 5,
    			events: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Star_rating",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[4] === undefined && !('name' in props)) {
    			console.warn("<Star_rating> was created without expected prop 'name'");
    		}
    	}

    	get class() {
    		throw new Error("<Star_rating>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Star_rating>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get starClass() {
    		throw new Error("<Star_rating>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set starClass(value) {
    		throw new Error("<Star_rating>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Star_rating>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Star_rating>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Star_rating>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Star_rating>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Star_rating>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Star_rating>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Star_rating>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Star_rating>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get events() {
    		throw new Error("<Star_rating>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set events(value) {
    		throw new Error("<Star_rating>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var StarRating = Star_rating;

    /* node_modules\attractions\dialog\x.svelte generated by Svelte v3.47.0 */

    const file$g = "node_modules\\attractions\\dialog\\x.svelte";

    function create_fragment$h(ctx) {
    	let svg;
    	let line0;
    	let line1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			attr_dev(line0, "x1", "18");
    			attr_dev(line0, "y1", "6");
    			attr_dev(line0, "x2", "6");
    			attr_dev(line0, "y2", "18");
    			add_location(line0, file$g, 12, 2, 274);
    			attr_dev(line1, "x1", "6");
    			attr_dev(line1, "y1", "6");
    			attr_dev(line1, "x2", "18");
    			attr_dev(line1, "y2", "18");
    			add_location(line1, file$g, 13, 2, 315);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			add_location(svg, file$g, 1, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, line0);
    			append_dev(svg, line1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('X', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<X> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class X extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "X",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    var X$1 = X;

    /* node_modules\attractions\dialog\dialog.svelte generated by Svelte v3.47.0 */
    const file$f = "node_modules\\attractions\\dialog\\dialog.svelte";
    const get_title_icon_slot_changes = dirty => ({});
    const get_title_icon_slot_context = ctx => ({});
    const get_close_icon_slot_changes = dirty => ({});
    const get_close_icon_slot_context = ctx => ({});

    // (41:2) {#if closeCallback != null}
    function create_if_block_1$b(ctx) {
    	let button;
    	let current;

    	button = new Button$1({
    			props: {
    				neutral: true,
    				round: true,
    				class: "close",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*closeCallback*/ ctx[3])) /*closeCallback*/ ctx[3].apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$b.name,
    		type: "if",
    		source: "(41:2) {#if closeCallback != null}",
    		ctx
    	});

    	return block;
    }

    // (43:30)          
    function fallback_block$1(ctx) {
    	let x;
    	let current;
    	x = new X$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(x.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(x, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(x.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(x.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(x, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(43:30)          ",
    		ctx
    	});

    	return block;
    }

    // (42:4) <Button neutral round class="close" on:click={closeCallback}>
    function create_default_slot$6(ctx) {
    	let current;
    	const close_icon_slot_template = /*#slots*/ ctx[6]["close-icon"];
    	const close_icon_slot = create_slot(close_icon_slot_template, ctx, /*$$scope*/ ctx[7], get_close_icon_slot_context);
    	const close_icon_slot_or_fallback = close_icon_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (close_icon_slot_or_fallback) close_icon_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (close_icon_slot_or_fallback) {
    				close_icon_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (close_icon_slot) {
    				if (close_icon_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						close_icon_slot,
    						close_icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(close_icon_slot_template, /*$$scope*/ ctx[7], dirty, get_close_icon_slot_changes),
    						get_close_icon_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close_icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close_icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (close_icon_slot_or_fallback) close_icon_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(42:4) <Button neutral round class=\\\"close\\\" on:click={closeCallback}>",
    		ctx
    	});

    	return block;
    }

    // (48:2) {#if title != null}
    function create_if_block$c(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let div_class_value;
    	let current;
    	const title_icon_slot_template = /*#slots*/ ctx[6]["title-icon"];
    	const title_icon_slot = create_slot(title_icon_slot_template, ctx, /*$$scope*/ ctx[7], get_title_icon_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (title_icon_slot) title_icon_slot.c();
    			t0 = space();
    			t1 = text(/*title*/ ctx[4]);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(classes('title', /*closeCallback*/ ctx[3] != null && 'close-padded', /*titleClass*/ ctx[1])) + " svelte-11akk9u"));
    			add_location(div, file$f, 48, 4, 1212);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (title_icon_slot) {
    				title_icon_slot.m(div, null);
    			}

    			append_dev(div, t0);
    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (title_icon_slot) {
    				if (title_icon_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						title_icon_slot,
    						title_icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(title_icon_slot_template, /*$$scope*/ ctx[7], dirty, get_title_icon_slot_changes),
    						get_title_icon_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*title*/ 16) set_data_dev(t1, /*title*/ ctx[4]);

    			if (!current || dirty & /*closeCallback, titleClass*/ 10 && div_class_value !== (div_class_value = "" + (null_to_empty(classes('title', /*closeCallback*/ ctx[3] != null && 'close-padded', /*titleClass*/ ctx[1])) + " svelte-11akk9u"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_icon_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_icon_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (title_icon_slot) title_icon_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(48:2) {#if title != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let div_class_value;
    	let current;
    	let if_block0 = /*closeCallback*/ ctx[3] != null && create_if_block_1$b(ctx);
    	let if_block1 = /*title*/ ctx[4] != null && create_if_block$c(ctx);
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(classes('dialog', /*_class*/ ctx[0])) + " svelte-11akk9u"));
    			toggle_class(div, "danger", /*danger*/ ctx[2]);
    			toggle_class(div, "constrain-width", /*constrainWidth*/ ctx[5]);
    			add_location(div, file$f, 35, 0, 910);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*closeCallback*/ ctx[3] != null) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*closeCallback*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$b(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*title*/ ctx[4] != null) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*title*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$c(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*_class*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(classes('dialog', /*_class*/ ctx[0])) + " svelte-11akk9u"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*_class, danger*/ 5) {
    				toggle_class(div, "danger", /*danger*/ ctx[2]);
    			}

    			if (dirty & /*_class, constrainWidth*/ 33) {
    				toggle_class(div, "constrain-width", /*constrainWidth*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dialog', slots, ['close-icon','title-icon','default']);
    	let { class: _class = null } = $$props;
    	let { titleClass = null } = $$props;
    	let { danger = false } = $$props;
    	let { closeCallback = null } = $$props;
    	let { title = null } = $$props;
    	let { constrainWidth = false } = $$props;
    	const writable_props = ['class', 'titleClass', 'danger', 'closeCallback', 'title', 'constrainWidth'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dialog> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, _class = $$props.class);
    		if ('titleClass' in $$props) $$invalidate(1, titleClass = $$props.titleClass);
    		if ('danger' in $$props) $$invalidate(2, danger = $$props.danger);
    		if ('closeCallback' in $$props) $$invalidate(3, closeCallback = $$props.closeCallback);
    		if ('title' in $$props) $$invalidate(4, title = $$props.title);
    		if ('constrainWidth' in $$props) $$invalidate(5, constrainWidth = $$props.constrainWidth);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Button: Button$1,
    		X: X$1,
    		classes,
    		_class,
    		titleClass,
    		danger,
    		closeCallback,
    		title,
    		constrainWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('_class' in $$props) $$invalidate(0, _class = $$props._class);
    		if ('titleClass' in $$props) $$invalidate(1, titleClass = $$props.titleClass);
    		if ('danger' in $$props) $$invalidate(2, danger = $$props.danger);
    		if ('closeCallback' in $$props) $$invalidate(3, closeCallback = $$props.closeCallback);
    		if ('title' in $$props) $$invalidate(4, title = $$props.title);
    		if ('constrainWidth' in $$props) $$invalidate(5, constrainWidth = $$props.constrainWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		_class,
    		titleClass,
    		danger,
    		closeCallback,
    		title,
    		constrainWidth,
    		slots,
    		$$scope
    	];
    }

    class Dialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			class: 0,
    			titleClass: 1,
    			danger: 2,
    			closeCallback: 3,
    			title: 4,
    			constrainWidth: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dialog",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get class() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleClass() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleClass(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get danger() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set danger(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeCallback() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeCallback(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get constrainWidth() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set constrainWidth(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Dialog$1 = Dialog;

    /* node_modules\attractions\loading\loading.svelte generated by Svelte v3.47.0 */
    const file$e = "node_modules\\attractions\\loading\\loading.svelte";

    function create_fragment$f(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let div3_class_value;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", "bounce1 svelte-5lyar3");
    			add_location(div0, file$e, 9, 2, 240);
    			attr_dev(div1, "class", "bounce2 svelte-5lyar3");
    			add_location(div1, file$e, 10, 2, 266);
    			attr_dev(div2, "class", "bounce3 svelte-5lyar3");
    			add_location(div2, file$e, 11, 2, 292);
    			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(classes('spinner', /*_class*/ ctx[0])) + " svelte-5lyar3"));
    			add_location(div3, file$e, 8, 0, 197);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*_class*/ 1 && div3_class_value !== (div3_class_value = "" + (null_to_empty(classes('spinner', /*_class*/ ctx[0])) + " svelte-5lyar3"))) {
    				attr_dev(div3, "class", div3_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loading', slots, []);
    	let { class: _class = null } = $$props;
    	const writable_props = ['class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, _class = $$props.class);
    	};

    	$$self.$capture_state = () => ({ classes, _class });

    	$$self.$inject_state = $$props => {
    		if ('_class' in $$props) $$invalidate(0, _class = $$props._class);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [_class];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { class: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get class() {
    		throw new Error("<Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Loading$1 = Loading;

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /**
     * @typedef {import('./types').SliderState} State
     * @typedef {import('./types').TickConfig} TickConfig
     */

    /**
     * Normalizes the event to be able to use the same handler for both mouse and touch events.
     * @param {MouseEvent | TouchEvent} e
     * @returns {Pick<MouseEvent, 'clientY' | 'clientX'>}
     */
    function normalizeEvent(e) {
      if (e.type.includes('touch')) {
        return /** @type {TouchEvent}*/ (e).touches[0];
      } else {
        return /** @type {MouseEvent}*/ (e);
      }
    }

    /**
     * Get position of mouse or touch event.
     * @param {boolean} vertical
     * @param {MouseEvent | TouchEvent} e
     * @returns {number}
     */
    function getPosition(vertical, e) {
      const normalizedE = normalizeEvent(e);
      return vertical ? normalizedE.clientY : normalizedE.clientX;
    }

    /**
     * Stop event propagation and cancel default operation.
     * @param {Event} e
     */
    function stopEvent(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    /**
     * Clamps the value to the provided min/max limits
     * @param {number} val
     * @param {{ min: number, max: number }} state
     * @returns {number}
     */
    function ensureValueInRange(val, { min, max }) {
      return Math.min(Math.max(val, min), max);
    }

    /**
     * Adjust resolution in-line with step.
     * @param {number} step
     * @returns {number}
     */
    function getPrecision(step) {
      const stepString = step.toString();
      let precision = 0;
      if (stepString.indexOf('.') >= 0) {
        precision = stepString.length - stepString.indexOf('.') - 1;
      }
      return precision;
    }

    /**
     * Calculate all the possible values in the range.
     * @param {number} step The increment between each value and the next.
     * @param {{ min: number, max: number }} state The minimum and maximum values.
     * @returns {number[]} An array of all the possible values.
     */
    function getSteps(step, { min, max }) {
      const steps = (max - min) / step;
      return Array.from({ length: steps + 1 }, (_, i) => min + i * step);
    }

    /**
     * Get the list of ticks depending on the ticks' `mode`.
     * @param {TickConfig} ticks The ticks configuration.
     * @param {number} min
     * @param {number} max
     * @returns {number[]}
     */
    function getTickValues(ticks, min, max) {
      if (ticks.mode === 'steps') return getSteps(ticks.step, { min, max });
      if (ticks.mode === 'values' && Array.isArray(ticks.values))
        return [...ticks.values];
      return [];
    }

    /**
     * Get the subTick values depending on the density.
     * @param {TickConfig} ticks The ticks configuration.
     * @param {number} min
     * @param {number} max
     * @param {number[]} [tickValues=[]] The values of the major ticks (to avoid collision).
     * @returns {number[]}
     */
    function getSubTickPositions(ticks, min, max, tickValues = []) {
      if (ticks.mode === 'none') return [];
      const { subDensity } = ticks;
      if (!subDensity) return [];
      const step = ((max - min) / 100) * subDensity;
      const subTicks = getSteps(step, { min, max }).filter(
        tick => !tickValues.includes(tick)
      );
      return subTicks;
    }

    /**
     * Find the closest step, including ticks, to the given value.
     * @param {number} val The value to find the closest step for.
     * @param {{ ticks: TickConfig, step: number, min: number, max: number }} state
     * @returns {number}
     */
    function getClosestPoint(val, { ticks, step, min, max }) {
      const points = getTickValues(ticks, min, max);
      if (step !== null) {
        const baseNum = 10 ** getPrecision(step);
        const maxSteps = Math.floor(
          (max * baseNum - min * baseNum) / (step * baseNum)
        );
        const steps = Math.min((val - min) / step, maxSteps);
        const closestStep = Math.round(steps) * step + min;
        points.push(closestStep);
      }
      const diffs = points.map(point => Math.abs(val - point));
      return points[diffs.indexOf(Math.min(...diffs))];
    }

    /**
     * Convert from slider value to percentage of the range [min .. max]
     * used for ticks too which are not an array value
     * @param {number} value
     * @param {{ min: number, max: number }} state
     * @returns {number}
     */
    function calcPercentOfRange(value, { min, max }) {
      const ratio = (value - min) / (max - min);
      return Math.max(0, ratio * 100);
    }

    /**
     * If using a single handle for the slider, give the user the value unnested.
     * @param {[number] | [number, number]} value
     * @returns {number | [number, number]}
     */
    function unnestSingle(value) {
      return value.length === 1 ? value[0] : value;
    }

    /**
     * @param {number} val
     * @param {{ ticks: TickConfig, step: number, min: number, max: number }} stateWithTicks
     * @returns {number}
     */
    function ensureValuePrecision(val, stateWithTicks) {
      const { step } = stateWithTicks;
      const possiblePoint = getClosestPoint(val, stateWithTicks);
      const closestPoint = isFinite(possiblePoint) ? possiblePoint : 0;
      return step === null
        ? closestPoint
        : parseFloat(closestPoint.toFixed(getPrecision(step)));
    }

    /**
     * Find the handle closest to the given value.
     * @param {number} value
     * @param {[number] | [number, number]} handleValues
     * @returns {number}
     */
    function getClosestHandle(value, handleValues) {
      let closestHandleIndex = 0;
      for (let i = 1; i < handleValues.length - 1; i += 1) {
        if (value >= handleValues[i]) {
          closestHandleIndex = i;
        }
      }
      if (
        Math.abs(handleValues[closestHandleIndex + 1] - value) <
        Math.abs(handleValues[closestHandleIndex] - value)
      ) {
        closestHandleIndex += 1;
      }
      return closestHandleIndex;
    }

    /**
     * An action that sets the position styles of the slider's handle depending on the slider value.
     * @param {HTMLElement} node The handle element
     * @param {{active: boolean, vertical: boolean, value: number}} props
     */
    function handleStyle(node, props) {
      /**
       * @param {{active: boolean, vertical: boolean, value: number}} props
       */
      function applyStyles({ vertical, value, active }) {
        if (vertical) {
          node.style.setProperty('bottom', `${value}%`);
        } else {
          node.style.setProperty('left', `${value}%`);
        }
        node.style.setProperty('z-index', `${active ? 3 : 2}`);
      }

      applyStyles(props);
      return {
        update: applyStyles,
      };
    }

    /**
     * Converts the current value range to styles on the range element
     * @param {HTMLElement} node The range element
     * @param {{value: [number] | [number, number], vertical: boolean, min: number, max: number}} props
     */
    function rangeStyle(node, props) {
      /**
       * @type {Map<string, string>}
       */
      const styles = new Map();
      /**
       * @param {{value: [number] | [number, number], vertical: boolean}} props
       */
      function applyStyles({ value, vertical }) {
        const isRange = value.length > 1;
        for (const property of styles.keys()) {
          node.style.removeProperty(property);
        }
        styles.clear();
        const offsets = value.map(v => calcPercentOfRange(v, props));
        // if offsets have crossed over
        offsets.sort((a, b) => a - b);

        // this offset is the percent length of the track
        const offset = isRange ? offsets[1] - offsets[0] : offsets[0];
        const sizeKey = vertical ? 'height' : 'width';
        styles.set(sizeKey, `${offset}%`);

        if (isRange) {
          const offsetKey = vertical ? 'bottom' : 'left';
          styles.set(offsetKey, `${offsets[0]}%`);
        }
        for (const [property, value] of styles.entries()) {
          node.style.setProperty(property, value);
        }
      }

      applyStyles(props);

      return {
        update: applyStyles,
      };
    }

    /* node_modules\attractions\slider\handle.svelte generated by Svelte v3.47.0 */
    const file$d = "node_modules\\attractions\\slider\\handle.svelte";

    const get_tooltips_slot_changes = dirty => ({
    	canShowActiveTooltip: dirty & /*canShowActiveTooltip*/ 256,
    	value: dirty & /*value*/ 1
    });

    const get_tooltips_slot_context = ctx => ({
    	canShowActiveTooltip: /*canShowActiveTooltip*/ ctx[8],
    	value: /*value*/ ctx[0]
    });

    function create_fragment$e(ctx) {
    	let div;
    	let div_class_value;
    	let div_tabindex_value;
    	let handleStyle_action;
    	let current;
    	let mounted;
    	let dispose;
    	const tooltips_slot_template = /*#slots*/ ctx[22].tooltips;
    	const tooltips_slot = create_slot(tooltips_slot_template, ctx, /*$$scope*/ ctx[21], get_tooltips_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (tooltips_slot) tooltips_slot.c();
    			attr_dev(div, "role", "slider");
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(`handle handle-${/*orientation*/ ctx[7]}`) + " svelte-1u2at4"));
    			attr_dev(div, "tabindex", div_tabindex_value = /*disabled*/ ctx[2] ? -1 : /*tabIndex*/ ctx[3]);
    			attr_dev(div, "aria-valuenow", /*value*/ ctx[0]);
    			attr_dev(div, "aria-orientation", /*orientation*/ ctx[7]);
    			attr_dev(div, "aria-disabled", /*disabled*/ ctx[2]);
    			toggle_class(div, "handle-active", /*active*/ ctx[1]);
    			toggle_class(div, "handle-focus", /*focus*/ ctx[5]);
    			toggle_class(div, "handle-disabled", /*disabled*/ ctx[2]);
    			add_location(div, file$d, 115, 0, 2162);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (tooltips_slot) {
    				tooltips_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[23](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(handleStyle_action = handleStyle.call(null, div, {
    						value: /*$tween*/ ctx[9],
    						active: /*active*/ ctx[1],
    						vertical: /*vertical*/ ctx[4]
    					})),
    					listen_dev(div, "keydown", /*handleKeyDown*/ ctx[10], false, false, false),
    					listen_dev(div, "mousedown", prevent_default(/*handleMouseDown*/ ctx[11]), false, true, false),
    					listen_dev(div, "mouseenter", /*handleMouseEnter*/ ctx[14], false, false, false),
    					listen_dev(div, "mouseleave", /*handleMouseLeave*/ ctx[15], false, false, false),
    					listen_dev(div, "focus", /*handleFocus*/ ctx[12], false, false, false),
    					listen_dev(div, "blur", /*handleBlur*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (tooltips_slot) {
    				if (tooltips_slot.p && (!current || dirty & /*$$scope, canShowActiveTooltip, value*/ 2097409)) {
    					update_slot_base(
    						tooltips_slot,
    						tooltips_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(tooltips_slot_template, /*$$scope*/ ctx[21], dirty, get_tooltips_slot_changes),
    						get_tooltips_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*orientation*/ 128 && div_class_value !== (div_class_value = "" + (null_to_empty(`handle handle-${/*orientation*/ ctx[7]}`) + " svelte-1u2at4"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*disabled, tabIndex*/ 12 && div_tabindex_value !== (div_tabindex_value = /*disabled*/ ctx[2] ? -1 : /*tabIndex*/ ctx[3])) {
    				attr_dev(div, "tabindex", div_tabindex_value);
    			}

    			if (!current || dirty & /*value*/ 1) {
    				attr_dev(div, "aria-valuenow", /*value*/ ctx[0]);
    			}

    			if (!current || dirty & /*orientation*/ 128) {
    				attr_dev(div, "aria-orientation", /*orientation*/ ctx[7]);
    			}

    			if (!current || dirty & /*disabled*/ 4) {
    				attr_dev(div, "aria-disabled", /*disabled*/ ctx[2]);
    			}

    			if (handleStyle_action && is_function(handleStyle_action.update) && dirty & /*$tween, active, vertical*/ 530) handleStyle_action.update.call(null, {
    				value: /*$tween*/ ctx[9],
    				active: /*active*/ ctx[1],
    				vertical: /*vertical*/ ctx[4]
    			});

    			if (dirty & /*orientation, active*/ 130) {
    				toggle_class(div, "handle-active", /*active*/ ctx[1]);
    			}

    			if (dirty & /*orientation, focus*/ 160) {
    				toggle_class(div, "handle-focus", /*focus*/ ctx[5]);
    			}

    			if (dirty & /*orientation, disabled*/ 132) {
    				toggle_class(div, "handle-disabled", /*disabled*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltips_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltips_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (tooltips_slot) tooltips_slot.d(detaching);
    			/*div_binding*/ ctx[23](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let offset;
    	let canShowActiveTooltip;
    	let orientation;
    	let $tween;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Handle', slots, ['tooltips']);
    	const dispatch = createEventDispatcher();
    	let { value } = $$props;
    	let { min } = $$props;
    	let { max } = $$props;
    	let { active } = $$props;
    	let { disabled = false } = $$props;
    	let { tabIndex = 0 } = $$props;
    	let { vertical = false } = $$props;

    	/**
     * @type {boolean}
     */
    	let focus = false;

    	/**
     * @type {boolean}
     */
    	let hovered = false;

    	/**
     * @type {HTMLDivElement}
     */
    	let handle;

    	/**
     * focus on keydown
     * @param {Event} _e
     */
    	function handleKeyDown(_e) {
    		$$invalidate(5, focus = false);
    	}

    	/**
     * focus on mousedown
     * @param {Event} _e
     */
    	function handleMouseDown(_e) {
    		$$invalidate(5, focus = true);
    		handle.focus();
    	}

    	/**
     * When the user focuses the handle of a slider, set it to active
     * @param {Event} _e the event from browser
     */
    	function handleFocus(_e) {
    		if (!disabled) {
    			$$invalidate(5, focus = true);
    			dispatch('focus', focus);
    		}
    	}

    	/**
     * When the user has unfocused (blurred) from the slider, deactivate all handles.
     * @param {Event} _e the event from browser
     */
    	function handleBlur(_e) {
    		$$invalidate(5, focus = false);
    		dispatch('focus', focus);
    	}

    	function handleMouseEnter() {
    		$$invalidate(19, hovered = true);
    	}

    	function handleMouseLeave() {
    		$$invalidate(19, hovered = false);
    	}

    	/**
     * @type {number}
     */
    	const initialPosition = calcPercentOfRange(value, { min, max });

    	const tween = tweened(initialPosition, { duration: 60, easing: sineOut });
    	validate_store(tween, 'tween');
    	component_subscribe($$self, tween, value => $$invalidate(9, $tween = value));
    	const writable_props = ['value', 'min', 'max', 'active', 'disabled', 'tabIndex', 'vertical'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Handle> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			handle = $$value;
    			$$invalidate(6, handle);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('min' in $$props) $$invalidate(17, min = $$props.min);
    		if ('max' in $$props) $$invalidate(18, max = $$props.max);
    		if ('active' in $$props) $$invalidate(1, active = $$props.active);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
    		if ('tabIndex' in $$props) $$invalidate(3, tabIndex = $$props.tabIndex);
    		if ('vertical' in $$props) $$invalidate(4, vertical = $$props.vertical);
    		if ('$$scope' in $$props) $$invalidate(21, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		tweened,
    		sineOut,
    		handleStyle,
    		calcPercentOfRange,
    		dispatch,
    		value,
    		min,
    		max,
    		active,
    		disabled,
    		tabIndex,
    		vertical,
    		focus,
    		hovered,
    		handle,
    		handleKeyDown,
    		handleMouseDown,
    		handleFocus,
    		handleBlur,
    		handleMouseEnter,
    		handleMouseLeave,
    		initialPosition,
    		tween,
    		orientation,
    		canShowActiveTooltip,
    		offset,
    		$tween
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('min' in $$props) $$invalidate(17, min = $$props.min);
    		if ('max' in $$props) $$invalidate(18, max = $$props.max);
    		if ('active' in $$props) $$invalidate(1, active = $$props.active);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
    		if ('tabIndex' in $$props) $$invalidate(3, tabIndex = $$props.tabIndex);
    		if ('vertical' in $$props) $$invalidate(4, vertical = $$props.vertical);
    		if ('focus' in $$props) $$invalidate(5, focus = $$props.focus);
    		if ('hovered' in $$props) $$invalidate(19, hovered = $$props.hovered);
    		if ('handle' in $$props) $$invalidate(6, handle = $$props.handle);
    		if ('orientation' in $$props) $$invalidate(7, orientation = $$props.orientation);
    		if ('canShowActiveTooltip' in $$props) $$invalidate(8, canShowActiveTooltip = $$props.canShowActiveTooltip);
    		if ('offset' in $$props) $$invalidate(20, offset = $$props.offset);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value, min, max*/ 393217) {
    			/**
     * @type {number}
     */
    			$$invalidate(20, offset = calcPercentOfRange(value, { min, max }));
    		}

    		if ($$self.$$.dirty & /*offset*/ 1048576) {
    			tween.set(offset);
    		}

    		if ($$self.$$.dirty & /*active, focus, hovered*/ 524322) {
    			/**
     * @type {boolean}
     */
    			$$invalidate(8, canShowActiveTooltip = active && focus || hovered);
    		}

    		if ($$self.$$.dirty & /*vertical*/ 16) {
    			/**
     * @type {'vertical' | 'horizontal'}
     */
    			$$invalidate(7, orientation = vertical ? 'vertical' : 'horizontal');
    		}
    	};

    	return [
    		value,
    		active,
    		disabled,
    		tabIndex,
    		vertical,
    		focus,
    		handle,
    		orientation,
    		canShowActiveTooltip,
    		$tween,
    		handleKeyDown,
    		handleMouseDown,
    		handleFocus,
    		handleBlur,
    		handleMouseEnter,
    		handleMouseLeave,
    		tween,
    		min,
    		max,
    		hovered,
    		offset,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Handle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			value: 0,
    			min: 17,
    			max: 18,
    			active: 1,
    			disabled: 2,
    			tabIndex: 3,
    			vertical: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Handle",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<Handle> was created without expected prop 'value'");
    		}

    		if (/*min*/ ctx[17] === undefined && !('min' in props)) {
    			console.warn("<Handle> was created without expected prop 'min'");
    		}

    		if (/*max*/ ctx[18] === undefined && !('max' in props)) {
    			console.warn("<Handle> was created without expected prop 'max'");
    		}

    		if (/*active*/ ctx[1] === undefined && !('active' in props)) {
    			console.warn("<Handle> was created without expected prop 'active'");
    		}
    	}

    	get value() {
    		throw new Error("<Handle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Handle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<Handle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<Handle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Handle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Handle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Handle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Handle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Handle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Handle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabIndex() {
    		throw new Error("<Handle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabIndex(value) {
    		throw new Error("<Handle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<Handle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<Handle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Handle$1 = Handle;

    /* node_modules\attractions\slider\slider.svelte generated by Svelte v3.47.0 */

    const { window: window_1 } = globals;
    const file$c = "node_modules\\attractions\\slider\\slider.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    const get_tick_value_slot_changes = dirty => ({ value: dirty[0] & /*tickValues*/ 128 });
    const get_tick_value_slot_context = ctx => ({ value: /*tick*/ ctx[36] });

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[41] = i;
    	return child_ctx;
    }

    const get_tooltip_content_slot_changes = dirty => ({ value: dirty[0] & /*value*/ 1 });
    const get_tooltip_content_slot_context = ctx => ({ value: /*value*/ ctx[0] });
    const get_rail_content_slot_changes = dirty => ({});
    const get_rail_content_slot_context = ctx => ({});

    // (313:8) {#if tooltips === 'always' || (tooltips === 'active' && canShowActiveTooltip)}
    function create_if_block$b(ctx) {
    	let div1;
    	let div0;
    	let div1_class_value;
    	let current;
    	const tooltip_content_slot_template = /*#slots*/ ctx[22]["tooltip-content"];
    	const tooltip_content_slot = create_slot(tooltip_content_slot_template, ctx, /*$$scope*/ ctx[25], get_tooltip_content_slot_context);
    	const tooltip_content_slot_or_fallback = tooltip_content_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (tooltip_content_slot_or_fallback) tooltip_content_slot_or_fallback.c();
    			attr_dev(div0, "class", "handle-tooltip-content svelte-1o2b9u1");
    			add_location(div0, file$c, 317, 12, 7743);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`handle-tooltip handle-tooltip-${/*orientation*/ ctx[13]}`) + " svelte-1o2b9u1"));
    			toggle_class(div1, "handle-tooltip-disabled", /*disabled*/ ctx[4]);
    			add_location(div1, file$c, 313, 10, 7594);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (tooltip_content_slot_or_fallback) {
    				tooltip_content_slot_or_fallback.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (tooltip_content_slot) {
    				if (tooltip_content_slot.p && (!current || dirty[0] & /*$$scope, value*/ 33554433)) {
    					update_slot_base(
    						tooltip_content_slot,
    						tooltip_content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(tooltip_content_slot_template, /*$$scope*/ ctx[25], dirty, get_tooltip_content_slot_changes),
    						get_tooltip_content_slot_context
    					);
    				}
    			} else {
    				if (tooltip_content_slot_or_fallback && tooltip_content_slot_or_fallback.p && (!current || dirty[0] & /*value*/ 1)) {
    					tooltip_content_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*orientation*/ 8192 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`handle-tooltip handle-tooltip-${/*orientation*/ ctx[13]}`) + " svelte-1o2b9u1"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty[0] & /*orientation, disabled*/ 8208) {
    				toggle_class(div1, "handle-tooltip-disabled", /*disabled*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip_content_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip_content_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (tooltip_content_slot_or_fallback) tooltip_content_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(313:8) {#if tooltips === 'always' || (tooltips === 'active' && canShowActiveTooltip)}",
    		ctx
    	});

    	return block;
    }

    // (319:51)                  
    function fallback_block_1(ctx) {
    	let t_value = /*value*/ ctx[0] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1 && t_value !== (t_value = /*value*/ ctx[0] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(319:51)                  ",
    		ctx
    	});

    	return block;
    }

    // (312:6) 
    function create_tooltips_slot(ctx) {
    	let div;
    	let current;
    	let if_block = (/*tooltips*/ ctx[5] === 'always' || /*tooltips*/ ctx[5] === 'active' && /*canShowActiveTooltip*/ ctx[42]) && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "slot", "tooltips");
    			add_location(div, file$c, 311, 6, 7440);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*tooltips*/ ctx[5] === 'always' || /*tooltips*/ ctx[5] === 'active' && /*canShowActiveTooltip*/ ctx[42]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*tooltips*/ 32 | dirty[1] & /*canShowActiveTooltip*/ 2048) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltips_slot.name,
    		type: "slot",
    		source: "(312:6) ",
    		ctx
    	});

    	return block;
    }

    // (302:2) {#each internalValue as val, index}
    function create_each_block_2(ctx) {
    	let handle;
    	let current;

    	function focus_handler() {
    		return /*focus_handler*/ ctx[23](/*index*/ ctx[41]);
    	}

    	handle = new Handle$1({
    			props: {
    				value: /*val*/ ctx[39],
    				min: /*min*/ ctx[1],
    				max: /*max*/ ctx[2],
    				vertical: /*vertical*/ ctx[3],
    				disabled: /*disabled*/ ctx[4],
    				active: /*activeHandle*/ ctx[9] === /*index*/ ctx[41],
    				$$slots: {
    					tooltips: [
    						create_tooltips_slot,
    						({ canShowActiveTooltip, value }) => ({ 42: canShowActiveTooltip, 0: value }),
    						({ canShowActiveTooltip, value }) => [value ? 1 : 0, canShowActiveTooltip ? 2048 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	handle.$on("focus", focus_handler);

    	const block = {
    		c: function create() {
    			create_component(handle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(handle, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const handle_changes = {};
    			if (dirty[0] & /*internalValue*/ 2048) handle_changes.value = /*val*/ ctx[39];
    			if (dirty[0] & /*min*/ 2) handle_changes.min = /*min*/ ctx[1];
    			if (dirty[0] & /*max*/ 4) handle_changes.max = /*max*/ ctx[2];
    			if (dirty[0] & /*vertical*/ 8) handle_changes.vertical = /*vertical*/ ctx[3];
    			if (dirty[0] & /*disabled*/ 16) handle_changes.disabled = /*disabled*/ ctx[4];
    			if (dirty[0] & /*activeHandle*/ 512) handle_changes.active = /*activeHandle*/ ctx[9] === /*index*/ ctx[41];

    			if (dirty[0] & /*$$scope, orientation, disabled, value, tooltips*/ 33562673 | dirty[1] & /*canShowActiveTooltip*/ 2048) {
    				handle_changes.$$scope = { dirty, ctx };
    			}

    			handle.$set(handle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(handle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(handle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(handle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(302:2) {#each internalValue as val, index}",
    		ctx
    	});

    	return block;
    }

    // (346:45)            
    function fallback_block(ctx) {
    	let t_value = /*tick*/ ctx[36] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*tickValues*/ 128 && t_value !== (t_value = /*tick*/ ctx[36] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(346:45)            ",
    		ctx
    	});

    	return block;
    }

    // (333:2) {#each tickValues as tick}
    function create_each_block_1(ctx) {
    	let span1;
    	let span0;
    	let span0_class_value;
    	let span1_class_value;
    	let span1_style_value;
    	let current;
    	const tick_value_slot_template = /*#slots*/ ctx[22]["tick-value"];
    	const tick_value_slot = create_slot(tick_value_slot_template, ctx, /*$$scope*/ ctx[25], get_tick_value_slot_context);
    	const tick_value_slot_or_fallback = tick_value_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			if (tick_value_slot_or_fallback) tick_value_slot_or_fallback.c();
    			attr_dev(span0, "class", span0_class_value = "" + (null_to_empty(`tick-value tick-value-${/*orientation*/ ctx[13]}`) + " svelte-1o2b9u1"));
    			toggle_class(span0, "tick-value-disabled", /*disabled*/ ctx[4]);
    			add_location(span0, file$c, 341, 6, 8391);
    			attr_dev(span1, "class", span1_class_value = "" + (null_to_empty(`tick tick-${/*orientation*/ ctx[13]}`) + " svelte-1o2b9u1"));
    			attr_dev(span1, "style", span1_style_value = "" + ((/*vertical*/ ctx[3] ? 'bottom' : 'left') + ": " + calcPercentOfRange(/*tick*/ ctx[36], { min: /*min*/ ctx[1], max: /*max*/ ctx[2] }) + "%;"));
    			toggle_class(span1, "tick-disabled", /*disabled*/ ctx[4]);
    			add_location(span1, file$c, 333, 4, 8183);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);

    			if (tick_value_slot_or_fallback) {
    				tick_value_slot_or_fallback.m(span0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (tick_value_slot) {
    				if (tick_value_slot.p && (!current || dirty[0] & /*$$scope, tickValues*/ 33554560)) {
    					update_slot_base(
    						tick_value_slot,
    						tick_value_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(tick_value_slot_template, /*$$scope*/ ctx[25], dirty, get_tick_value_slot_changes),
    						get_tick_value_slot_context
    					);
    				}
    			} else {
    				if (tick_value_slot_or_fallback && tick_value_slot_or_fallback.p && (!current || dirty[0] & /*tickValues*/ 128)) {
    					tick_value_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*orientation*/ 8192 && span0_class_value !== (span0_class_value = "" + (null_to_empty(`tick-value tick-value-${/*orientation*/ ctx[13]}`) + " svelte-1o2b9u1"))) {
    				attr_dev(span0, "class", span0_class_value);
    			}

    			if (dirty[0] & /*orientation, disabled*/ 8208) {
    				toggle_class(span0, "tick-value-disabled", /*disabled*/ ctx[4]);
    			}

    			if (!current || dirty[0] & /*orientation*/ 8192 && span1_class_value !== (span1_class_value = "" + (null_to_empty(`tick tick-${/*orientation*/ ctx[13]}`) + " svelte-1o2b9u1"))) {
    				attr_dev(span1, "class", span1_class_value);
    			}

    			if (!current || dirty[0] & /*vertical, tickValues, min, max*/ 142 && span1_style_value !== (span1_style_value = "" + ((/*vertical*/ ctx[3] ? 'bottom' : 'left') + ": " + calcPercentOfRange(/*tick*/ ctx[36], { min: /*min*/ ctx[1], max: /*max*/ ctx[2] }) + "%;"))) {
    				attr_dev(span1, "style", span1_style_value);
    			}

    			if (dirty[0] & /*orientation, disabled*/ 8208) {
    				toggle_class(span1, "tick-disabled", /*disabled*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tick_value_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tick_value_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			if (tick_value_slot_or_fallback) tick_value_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(333:2) {#each tickValues as tick}",
    		ctx
    	});

    	return block;
    }

    // (352:2) {#each subTicks as sub}
    function create_each_block$1(ctx) {
    	let span;
    	let span_class_value;
    	let span_style_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", span_class_value = "" + (null_to_empty(`tick tick-${/*orientation*/ ctx[13]} tick-${/*orientation*/ ctx[13]}-sub`) + " svelte-1o2b9u1"));
    			attr_dev(span, "style", span_style_value = "" + ((/*vertical*/ ctx[3] ? 'bottom' : 'left') + ": " + calcPercentOfRange(/*sub*/ ctx[33], { min: /*min*/ ctx[1], max: /*max*/ ctx[2] }) + "%;"));
    			toggle_class(span, "tick-disabled", /*disabled*/ ctx[4]);
    			add_location(span, file$c, 352, 4, 8650);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*orientation*/ 8192 && span_class_value !== (span_class_value = "" + (null_to_empty(`tick tick-${/*orientation*/ ctx[13]} tick-${/*orientation*/ ctx[13]}-sub`) + " svelte-1o2b9u1"))) {
    				attr_dev(span, "class", span_class_value);
    			}

    			if (dirty[0] & /*vertical, subTicks, min, max*/ 4110 && span_style_value !== (span_style_value = "" + ((/*vertical*/ ctx[3] ? 'bottom' : 'left') + ": " + calcPercentOfRange(/*sub*/ ctx[33], { min: /*min*/ ctx[1], max: /*max*/ ctx[2] }) + "%;"))) {
    				attr_dev(span, "style", span_style_value);
    			}

    			if (dirty[0] & /*orientation, disabled*/ 8208) {
    				toggle_class(span, "tick-disabled", /*disabled*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(352:2) {#each subTicks as sub}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div2;
    	let div0;
    	let div0_class_value;
    	let t0;
    	let t1;
    	let div1;
    	let div1_class_value;
    	let rangeStyle_action;
    	let t2;
    	let t3;
    	let div2_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const rail_content_slot_template = /*#slots*/ ctx[22]["rail-content"];
    	const rail_content_slot = create_slot(rail_content_slot_template, ctx, /*$$scope*/ ctx[25], get_rail_content_slot_context);
    	let each_value_2 = /*internalValue*/ ctx[11];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks_2[i], 1, 1, () => {
    		each_blocks_2[i] = null;
    	});

    	let each_value_1 = /*tickValues*/ ctx[7];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out_1 = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*subTicks*/ ctx[12];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let div2_levels = [
    		{
    			class: div2_class_value = classes(`slider slider-${/*orientation*/ ctx[13]}`, /*_class*/ ctx[6])
    		},
    		/*$$restProps*/ ctx[18]
    	];

    	let div2_data = {};

    	for (let i = 0; i < div2_levels.length; i += 1) {
    		div2_data = assign(div2_data, div2_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			if (rail_content_slot) rail_content_slot.c();
    			t0 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t1 = space();
    			div1 = element("div");
    			t2 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(`rail rail-${/*orientation*/ ctx[13]}`) + " svelte-1o2b9u1"));
    			toggle_class(div0, "rail-disabled", /*disabled*/ ctx[4]);
    			add_location(div0, file$c, 298, 2, 7104);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`range-selection range-selection-${/*orientation*/ ctx[13]}`) + " svelte-1o2b9u1"));
    			toggle_class(div1, "range-selection-disabled", /*disabled*/ ctx[4]);
    			add_location(div1, file$c, 327, 2, 7967);
    			set_attributes(div2, div2_data);
    			toggle_class(div2, "slider-active", /*sliderActive*/ ctx[10]);
    			toggle_class(div2, "slider-disabled", /*disabled*/ ctx[4]);
    			toggle_class(div2, "svelte-1o2b9u1", true);
    			add_location(div2, file$c, 288, 0, 6849);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			if (rail_content_slot) {
    				rail_content_slot.m(div0, null);
    			}

    			append_dev(div2, t0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div2, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div2, t2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div2, null);
    			}

    			append_dev(div2, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			/*div2_binding*/ ctx[24](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "mousemove", /*onMove*/ ctx[15], false, false, false),
    					listen_dev(window_1, "touchmove", /*onMove*/ ctx[15], false, false, false),
    					listen_dev(window_1, "mouseup", /*onEnd*/ ctx[16], false, false, false),
    					listen_dev(window_1, "touchend", /*onEnd*/ ctx[16], false, false, false),
    					action_destroyer(rangeStyle_action = rangeStyle.call(null, div1, {
    						value: /*internalValue*/ ctx[11],
    						vertical: /*vertical*/ ctx[3],
    						min: /*min*/ ctx[1],
    						max: /*max*/ ctx[2]
    					})),
    					listen_dev(div2, "touchstart", /*onStart*/ ctx[14], false, false, false),
    					listen_dev(div2, "mousedown", /*onStart*/ ctx[14], false, false, false),
    					listen_dev(div2, "keydown", /*onKeyDown*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (rail_content_slot) {
    				if (rail_content_slot.p && (!current || dirty[0] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						rail_content_slot,
    						rail_content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(rail_content_slot_template, /*$$scope*/ ctx[25], dirty, get_rail_content_slot_changes),
    						get_rail_content_slot_context
    					);
    				}
    			}

    			if (!current || dirty[0] & /*orientation*/ 8192 && div0_class_value !== (div0_class_value = "" + (null_to_empty(`rail rail-${/*orientation*/ ctx[13]}`) + " svelte-1o2b9u1"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty[0] & /*orientation, disabled*/ 8208) {
    				toggle_class(div0, "rail-disabled", /*disabled*/ ctx[4]);
    			}

    			if (dirty[0] & /*internalValue, min, max, vertical, disabled, activeHandle, orientation, value, $$scope, tooltips*/ 33565247 | dirty[1] & /*canShowActiveTooltip*/ 2048) {
    				each_value_2 = /*internalValue*/ ctx[11];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    						transition_in(each_blocks_2[i], 1);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						transition_in(each_blocks_2[i], 1);
    						each_blocks_2[i].m(div2, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_2.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*orientation*/ 8192 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`range-selection range-selection-${/*orientation*/ ctx[13]}`) + " svelte-1o2b9u1"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (rangeStyle_action && is_function(rangeStyle_action.update) && dirty[0] & /*internalValue, vertical, min, max*/ 2062) rangeStyle_action.update.call(null, {
    				value: /*internalValue*/ ctx[11],
    				vertical: /*vertical*/ ctx[3],
    				min: /*min*/ ctx[1],
    				max: /*max*/ ctx[2]
    			});

    			if (dirty[0] & /*orientation, disabled*/ 8208) {
    				toggle_class(div1, "range-selection-disabled", /*disabled*/ ctx[4]);
    			}

    			if (dirty[0] & /*orientation, vertical, tickValues, min, max, disabled, $$scope*/ 33562782) {
    				each_value_1 = /*tickValues*/ ctx[7];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div2, t3);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (dirty[0] & /*orientation, vertical, subTicks, min, max, disabled*/ 12318) {
    				each_value = /*subTicks*/ ctx[12];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			set_attributes(div2, div2_data = get_spread_update(div2_levels, [
    				(!current || dirty[0] & /*orientation, _class*/ 8256 && div2_class_value !== (div2_class_value = classes(`slider slider-${/*orientation*/ ctx[13]}`, /*_class*/ ctx[6]))) && { class: div2_class_value },
    				dirty[0] & /*$$restProps*/ 262144 && /*$$restProps*/ ctx[18]
    			]));

    			toggle_class(div2, "slider-active", /*sliderActive*/ ctx[10]);
    			toggle_class(div2, "slider-disabled", /*disabled*/ ctx[4]);
    			toggle_class(div2, "svelte-1o2b9u1", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rail_content_slot, local);

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rail_content_slot, local);
    			each_blocks_2 = each_blocks_2.filter(Boolean);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				transition_out(each_blocks_2[i]);
    			}

    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (rail_content_slot) rail_content_slot.d(detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			/*div2_binding*/ ctx[24](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let internalValue;
    	let orientation;
    	let tickValues;
    	let subTicks;

    	const omit_props_names = [
    		"min","max","step","vertical","disabled","value","ticks","rangeBehavior","tooltips","class"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slider', slots, ['rail-content','tooltip-content','tick-value']);
    	const dispatch = createEventDispatcher();
    	let { min } = $$props;
    	let { max } = $$props;
    	let { step = 1 } = $$props;
    	let { vertical = false } = $$props;
    	let { disabled = false } = $$props;
    	let { value = max < min ? min : min + (max - min) / 2 } = $$props;
    	let { ticks = { mode: 'none' } } = $$props;
    	let { rangeBehavior = 'block' } = $$props;
    	let { tooltips = 'never' } = $$props;
    	let { class: _class = null } = $$props;

    	/**
     * @type {HTMLDivElement}
     */
    	let slider;

    	let activeHandle = 0;
    	let sliderActive = false;

    	/**
     * @param {MouseEvent | TouchEvent} e
     */
    	function onStart(e) {
    		if (!sliderActive) {
    			$$invalidate(10, sliderActive = true);
    			const pos = getPosition(vertical, e);
    			const nextValue = calcValByPos(pos);
    			$$invalidate(9, activeHandle = getClosestHandle(nextValue, internalValue));
    			dispatch('focus');
    		}
    	}

    	/**
     * Normalize value.
     * @param {number} v
     */
    	function trimAlignValue(v) {
    		if (v === null) {
    			return 0;
    		}

    		const val = ensureValueInRange(v, { min, max });
    		return ensureValuePrecision(val, { min, max, ticks, step });
    	}

    	/**
     * Get the position of min in the document
     * @return {number}
     */
    	function getSliderStart() {
    		const rect = slider.getBoundingClientRect();

    		if (vertical) {
    			return rect.top;
    		}

    		return window.pageXOffset + rect.left;
    	}

    	/**
     * Get the total length of the slider from min to max in the document
     * @return {number}
     */
    	function getSliderLength() {
    		if (!slider) {
    			return 0;
    		}

    		const { height, width } = slider.getBoundingClientRect();
    		return vertical ? height : width;
    	}

    	/**
     * @param {number} offset
     * @return {number}
     */
    	function calcValue(offset) {
    		const ratio = Math.max(offset, 0) / getSliderLength();

    		const value = vertical
    		? (1 - ratio) * (max - min) + min
    		: ratio * (max - min) + min;

    		return value;
    	}

    	/**
     * @param {number} position
     * @return {number}
     */
    	function calcValByPos(position) {
    		const pixelOffset = position - getSliderStart();
    		return trimAlignValue(calcValue(pixelOffset));
    	}

    	/**
     * change value based on mouse position, causing handle to move
     * @param {MouseEvent | TouchEvent} e
     */
    	function onMove(e) {
    		if (disabled || !sliderActive) {
    			return;
    		}

    		const pos = getPosition(vertical, e);
    		const nextValue = calcValByPos(pos);
    		stopEvent(e);
    		moveHandle(activeHandle, nextValue);
    	}

    	/**
     * @param {number} index
     * @param {number} nextValue
     */
    	function moveHandle(index, nextValue) {
    		if (nextValue === value[index]) {
    			return;
    		}

    		/** @type {[number] | [number, number]} */
    		const next = [...internalValue];

    		next[index] = nextValue;
    		let skip = false;

    		if (internalValue.length > 1 && rangeBehavior !== 'free') {
    			next.forEach((handle, handleIndex) => {
    				if (handleIndex === index) {
    					return;
    				}

    				const direction = handle < value[index] ? '<-' : '->';

    				const willCrossOver = direction === '<-'
    				? handle => handle >= nextValue
    				: handle => handle <= nextValue;

    				if (rangeBehavior === 'push' && willCrossOver(handle)) {
    					if (direction === '<-') {
    						next[handleIndex] = next[index] - 1;
    					} else {
    						next[handleIndex] = next[index] + 1;
    					}
    				} else if (rangeBehavior === 'block' && willCrossOver(handle)) {
    					skip = true;
    				}
    			});
    		}

    		if (!skip) {
    			$$invalidate(11, internalValue = next);
    			$$invalidate(0, value = unnestSingle(internalValue));
    			dispatch('change', value);
    		}
    	}

    	/**
     * @param {MouseEvent | TouchEvent} e
     */
    	function onEnd(e) {
    		const el = e.target;

    		if (sliderActive) {
    			if (el === slider || slider.contains(/** @type {HTMLElement} */
    			el)) {
    				onMove(e);
    			}

    			dispatch('blur');
    			$$invalidate(10, sliderActive = false);
    		}
    	}

    	/**
     * @param {KeyboardEvent} e
     */
    	function onKeyDown(e) {
    		if (disabled) {
    			return;
    		}

    		let delta = 0;

    		switch (e.key) {
    			case 'Up':
    			case 'ArrowUp':
    			case 'Right':
    			case 'ArrowRight':
    				delta = step;
    				break;
    			case 'Down':
    			case 'ArrowDown':
    			case 'Left':
    			case 'ArrowLeft':
    				delta = -step;
    				break;
    			case 'End':
    				delta = max - internalValue[activeHandle];
    				break;
    			case 'Home':
    				delta = min - internalValue[activeHandle];
    				break;
    			case 'PageUp':
    				delta = step * 2;
    				break;
    			case 'PageDown':
    				delta = -step * 2;
    				break;
    		}

    		const move = ensureValueInRange(internalValue[activeHandle] + delta, { min, max });
    		moveHandle(activeHandle, move);
    		stopEvent(e);
    	}

    	const focus_handler = index => $$invalidate(9, activeHandle = index);

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			slider = $$value;
    			$$invalidate(8, slider);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(18, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('min' in $$new_props) $$invalidate(1, min = $$new_props.min);
    		if ('max' in $$new_props) $$invalidate(2, max = $$new_props.max);
    		if ('step' in $$new_props) $$invalidate(19, step = $$new_props.step);
    		if ('vertical' in $$new_props) $$invalidate(3, vertical = $$new_props.vertical);
    		if ('disabled' in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('ticks' in $$new_props) $$invalidate(20, ticks = $$new_props.ticks);
    		if ('rangeBehavior' in $$new_props) $$invalidate(21, rangeBehavior = $$new_props.rangeBehavior);
    		if ('tooltips' in $$new_props) $$invalidate(5, tooltips = $$new_props.tooltips);
    		if ('class' in $$new_props) $$invalidate(6, _class = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(25, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Handle: Handle$1,
    		getPosition,
    		stopEvent,
    		ensureValueInRange,
    		ensureValuePrecision,
    		getClosestHandle,
    		calcPercentOfRange,
    		getTickValues,
    		getSubTickPositions,
    		unnestSingle,
    		rangeStyle,
    		classes,
    		dispatch,
    		min,
    		max,
    		step,
    		vertical,
    		disabled,
    		value,
    		ticks,
    		rangeBehavior,
    		tooltips,
    		_class,
    		slider,
    		activeHandle,
    		sliderActive,
    		onStart,
    		trimAlignValue,
    		getSliderStart,
    		getSliderLength,
    		calcValue,
    		calcValByPos,
    		onMove,
    		moveHandle,
    		onEnd,
    		onKeyDown,
    		internalValue,
    		tickValues,
    		subTicks,
    		orientation
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('min' in $$props) $$invalidate(1, min = $$new_props.min);
    		if ('max' in $$props) $$invalidate(2, max = $$new_props.max);
    		if ('step' in $$props) $$invalidate(19, step = $$new_props.step);
    		if ('vertical' in $$props) $$invalidate(3, vertical = $$new_props.vertical);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('ticks' in $$props) $$invalidate(20, ticks = $$new_props.ticks);
    		if ('rangeBehavior' in $$props) $$invalidate(21, rangeBehavior = $$new_props.rangeBehavior);
    		if ('tooltips' in $$props) $$invalidate(5, tooltips = $$new_props.tooltips);
    		if ('_class' in $$props) $$invalidate(6, _class = $$new_props._class);
    		if ('slider' in $$props) $$invalidate(8, slider = $$new_props.slider);
    		if ('activeHandle' in $$props) $$invalidate(9, activeHandle = $$new_props.activeHandle);
    		if ('sliderActive' in $$props) $$invalidate(10, sliderActive = $$new_props.sliderActive);
    		if ('internalValue' in $$props) $$invalidate(11, internalValue = $$new_props.internalValue);
    		if ('tickValues' in $$props) $$invalidate(7, tickValues = $$new_props.tickValues);
    		if ('subTicks' in $$props) $$invalidate(12, subTicks = $$new_props.subTicks);
    		if ('orientation' in $$props) $$invalidate(13, orientation = $$new_props.orientation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*value*/ 1) {
    			/** @type {[number] | [number, number]} */
    			$$invalidate(11, internalValue = typeof value === 'number' ? [value] : value);
    		}

    		if ($$self.$$.dirty[0] & /*vertical*/ 8) {
    			/**
     * @type {'vertical' | 'horizontal'}
     */
    			$$invalidate(13, orientation = vertical ? 'vertical' : 'horizontal');
    		}

    		if ($$self.$$.dirty[0] & /*ticks, min, max*/ 1048582) {
    			/**
     * @type {number[]}
     */
    			$$invalidate(7, tickValues = getTickValues(ticks, min, max));
    		}

    		if ($$self.$$.dirty[0] & /*ticks, min, max, tickValues*/ 1048710) {
    			/**
     * @type {number[]}
     */
    			$$invalidate(12, subTicks = ticks.mode !== 'none' && ticks.subDensity
    			? getSubTickPositions(ticks, min, max, tickValues)
    			: []);
    		}
    	};

    	return [
    		value,
    		min,
    		max,
    		vertical,
    		disabled,
    		tooltips,
    		_class,
    		tickValues,
    		slider,
    		activeHandle,
    		sliderActive,
    		internalValue,
    		subTicks,
    		orientation,
    		onStart,
    		onMove,
    		onEnd,
    		onKeyDown,
    		$$restProps,
    		step,
    		ticks,
    		rangeBehavior,
    		slots,
    		focus_handler,
    		div2_binding,
    		$$scope
    	];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$d,
    			create_fragment$d,
    			safe_not_equal,
    			{
    				min: 1,
    				max: 2,
    				step: 19,
    				vertical: 3,
    				disabled: 4,
    				value: 0,
    				ticks: 20,
    				rangeBehavior: 21,
    				tooltips: 5,
    				class: 6
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*min*/ ctx[1] === undefined && !('min' in props)) {
    			console.warn("<Slider> was created without expected prop 'min'");
    		}

    		if (/*max*/ ctx[2] === undefined && !('max' in props)) {
    			console.warn("<Slider> was created without expected prop 'max'");
    		}
    	}

    	get min() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ticks() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ticks(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rangeBehavior() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rangeBehavior(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltips() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltips(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Slider$1 = Slider;

    /* src\bricks\Header.svelte generated by Svelte v3.47.0 */

    const { console: console_1$a } = globals;
    const file$b = "src\\bricks\\Header.svelte";

    // (211:8) { #if unauth === false }
    function create_if_block_17(ctx) {
    	let button;
    	let current;

    	button = new Button$1({
    			props: {
    				filled: true,
    				style: "\r\n              font-size: 15px;\r\n              padding: 13px 42px 16px;\r\n              margin-top: 13px;\r\n              margin-bottom: 20px;\r\n            ",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[19]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(211:8) { #if unauth === false }",
    		ctx
    	});

    	return block;
    }

    // (213:10) <Button               filled              style="                font-size: 15px;                padding: 13px 42px 16px;                margin-top: 13px;                margin-bottom: 20px;              "              on:click={() => showModal = false}            >
    function create_default_slot_9$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Все понятно спасибо");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(213:10) <Button               filled              style=\\\"                font-size: 15px;                padding: 13px 42px 16px;                margin-top: 13px;                margin-bottom: 20px;              \\\"              on:click={() => showModal = false}            >",
    		ctx
    	});

    	return block;
    }

    // (225:8) { #if unauth === true }
    function create_if_block_16(ctx) {
    	let button;
    	let current;

    	button = new Button$1({
    			props: {
    				filled: true,
    				style: "\r\n              font-size: 15px;\r\n              padding: 13px 42px 16px;\r\n              margin-top: 13px;\r\n              margin-bottom: 20px;\r\n            ",
    				$$slots: { default: [create_default_slot_8$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_1*/ ctx[20]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(225:8) { #if unauth === true }",
    		ctx
    	});

    	return block;
    }

    // (227:10) <Button               filled              style="                font-size: 15px;                padding: 13px 42px 16px;                margin-top: 13px;                margin-bottom: 20px;              "              on:click={() => {                                 showModal = false                authCheck.set({                  auth: false,                  passID: 'none',                  userID: 'none'                })                              }}            >
    function create_default_slot_8$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Выйти из аккаунта");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$2.name,
    		type: "slot",
    		source: "(227:10) <Button               filled              style=\\\"                font-size: 15px;                padding: 13px 42px 16px;                margin-top: 13px;                margin-bottom: 20px;              \\\"              on:click={() => {                                 showModal = false                authCheck.set({                  auth: false,                  passID: 'none',                  userID: 'none'                })                              }}            >",
    		ctx
    	});

    	return block;
    }

    // (184:4) <Dialog title="" {closeCallback}>
    function create_default_slot_7$2(ctx) {
    	let div;
    	let h3;
    	let t0;
    	let t1;
    	let svg;
    	let style;
    	let t2;
    	let path;
    	let t3;
    	let t4;
    	let t5;
    	let span;
    	let current;
    	let if_block0 = /*unauth*/ ctx[3] === false && create_if_block_17(ctx);
    	let if_block1 = /*unauth*/ ctx[3] === true && create_if_block_16(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(/*modalMessage*/ ctx[1]);
    			t1 = space();
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t2 = text("svg.bellIcon{\r\n              fill:#4300b0;\r\n              margin-bottom:12px;\r\n            }\r\n          ");
    			path = svg_element("path");
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			span = element("span");
    			span.textContent = "Помощь в использовании";
    			set_style(h3, "margin-top", "28px");
    			set_style(h3, "margin-bottom", "20px");
    			add_location(h3, file$b, 194, 8, 4328);
    			add_location(style, file$b, 201, 10, 4577);
    			attr_dev(path, "d", "M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z");
    			add_location(path, file$b, 207, 10, 4722);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "33px");
    			attr_dev(svg, "viewBox", "0 0 448 512");
    			toggle_class(svg, "bellIcon", true);
    			add_location(svg, file$b, 195, 8, 4410);
    			set_style(span, "color", "gray");
    			set_style(span, "opacity", "0.6");
    			set_style(span, "margin-bottom", "28px");
    			set_style(span, "cursor", "pointer");
    			add_location(span, file$b, 248, 8, 6079);
    			set_style(div, "width", "100%");
    			set_style(div, "display", "flex");
    			set_style(div, "flex-direction", "column");
    			set_style(div, "align-items", "center");
    			set_style(div, "justify-content", "flex-start");
    			set_style(div, "margin-top", "14px");
    			add_location(div, file$b, 184, 6, 4089);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    			append_dev(div, svg);
    			append_dev(svg, style);
    			append_dev(style, t2);
    			append_dev(svg, path);
    			append_dev(div, t3);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t4);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t5);
    			append_dev(div, span);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*modalMessage*/ 2) set_data_dev(t0, /*modalMessage*/ ctx[1]);

    			if (/*unauth*/ ctx[3] === false) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*unauth*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_17(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t4);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*unauth*/ ctx[3] === true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*unauth*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_16(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t5);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(184:4) <Dialog title=\\\"\\\" {closeCallback}>",
    		ctx
    	});

    	return block;
    }

    // (183:2) <Modal bind:open={showModal} let:closeCallback>
    function create_default_slot_6$2(ctx) {
    	let dialog;
    	let current;

    	dialog = new Dialog$1({
    			props: {
    				title: "",
    				closeCallback: /*closeCallback*/ ctx[38],
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dialog.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialog, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dialog_changes = {};
    			if (dirty[1] & /*closeCallback*/ 128) dialog_changes.closeCallback = /*closeCallback*/ ctx[38];

    			if (dirty[0] & /*showModal, unauth, modalMessage*/ 138 | dirty[1] & /*$$scope*/ 256) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			dialog.$set(dialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialog, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(183:2) <Modal bind:open={showModal} let:closeCallback>",
    		ctx
    	});

    	return block;
    }

    // (273:4) { #if AUTH == false }
    function create_if_block_15(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "войти в систему";
    			set_style(span, "color", "#FDFCF9");
    			set_style(span, "letter-spacing", "1px");
    			set_style(span, "cursor", "pointer");
    			set_style(span, "display", "block");
    			set_style(span, "position", "absolute");
    			set_style(span, "left", "100%");
    			set_style(span, "margin-left", "-400px");
    			set_style(span, "margin-top", "-5px");
    			add_location(span, file$b, 274, 6, 6539);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_2*/ ctx[22], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(273:4) { #if AUTH == false }",
    		ctx
    	});

    	return block;
    }

    // (299:4) { #if AUTH == true }
    function create_if_block_14(ctx) {
    	let span1;
    	let t0;
    	let t1;
    	let span0;
    	let t2;
    	let t3;
    	let svg;
    	let style;
    	let t4;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			t0 = text(/*UID*/ ctx[2]);
    			t1 = space();
    			span0 = element("span");
    			t2 = text(/*userMail*/ ctx[4]);
    			t3 = space();
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t4 = text("svg.userIcon{\r\n              fill:#ffffff;\r\n              display: block;\r\n              position: absolute;\r\n              top: 0;\r\n              left: 0;\r\n              margin-left: -48px;\r\n              margin-top: 4.4px;\r\n            }\r\n          ");
    			path = svg_element("path");
    			set_style(span0, "display", "block");
    			set_style(span0, "position", "absolute");
    			set_style(span0, "opacity", "0.8");
    			set_style(span0, "font-size", "14px");
    			set_style(span0, "margin-top", "3px");
    			add_location(span0, file$b, 320, 8, 7513);
    			add_location(style, file$b, 337, 10, 7928);
    			attr_dev(path, "d", "M370.7 96.1C346.1 39.5 289.7 0 224 0S101.9 39.5 77.3 96.1C60.9 97.5 48 111.2 48 128v64c0 16.8 12.9 30.5 29.3 31.9C101.9 280.5 158.3 320 224 320s122.1-39.5 146.7-96.1c16.4-1.4 29.3-15.1 29.3-31.9V128c0-16.8-12.9-30.5-29.3-31.9zM336 144v16c0 53-43 96-96 96H208c-53 0-96-43-96-96V144c0-26.5 21.5-48 48-48H288c26.5 0 48 21.5 48 48zM189.3 162.7l-6-21.2c-.9-3.3-3.9-5.5-7.3-5.5s-6.4 2.2-7.3 5.5l-6 21.2-21.2 6c-3.3 .9-5.5 3.9-5.5 7.3s2.2 6.4 5.5 7.3l21.2 6 6 21.2c.9 3.3 3.9 5.5 7.3 5.5s6.4-2.2 7.3-5.5l6-21.2 21.2-6c3.3-.9 5.5-3.9 5.5-7.3s-2.2-6.4-5.5-7.3l-21.2-6zM112.7 316.5C46.7 342.6 0 407 0 482.3C0 498.7 13.3 512 29.7 512H128V448c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64l98.3 0c16.4 0 29.7-13.3 29.7-29.7c0-75.3-46.7-139.7-112.7-165.8C303.9 338.8 265.5 352 224 352s-79.9-13.2-111.3-35.5zM176 448c-8.8 0-16 7.2-16 16v48h32V464c0-8.8-7.2-16-16-16zm96 32a16 16 0 1 0 0-32 16 16 0 1 0 0 32z");
    			add_location(path, file$b, 348, 10, 8220);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "36px");
    			attr_dev(svg, "viewBox", "0 0 448 512");
    			toggle_class(svg, "userIcon", true);
    			add_location(svg, file$b, 331, 8, 7761);
    			set_style(span1, "color", "#FDFCF9");
    			set_style(span1, "letter-spacing", "1px");
    			set_style(span1, "cursor", "pointer");
    			set_style(span1, "display", "block");
    			set_style(span1, "position", "absolute");
    			set_style(span1, "left", "100%");
    			set_style(span1, "margin-left", "-400px");
    			set_style(span1, "margin-top", "-20px");
    			add_location(span1, file$b, 300, 6, 7060);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t0);
    			append_dev(span1, t1);
    			append_dev(span1, span0);
    			append_dev(span0, t2);
    			append_dev(span1, t3);
    			append_dev(span1, svg);
    			append_dev(svg, style);
    			append_dev(style, t4);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(span1, "click", /*click_handler_3*/ ctx[23], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*UID*/ 4) set_data_dev(t0, /*UID*/ ctx[2]);
    			if (dirty[0] & /*userMail*/ 16) set_data_dev(t2, /*userMail*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(299:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (356:2) { #if opacity == 0 }
    function create_if_block_1$a(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let button;
    	let t1;
    	let span;
    	let t3;
    	let svg;
    	let style;
    	let t4;
    	let path;
    	let t5;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*regActive*/ ctx[6] === false && create_if_block_7$3(ctx);

    	button = new Button$1({
    			props: {
    				disabled: /*regActive*/ ctx[6],
    				filled: true,
    				style: "\r\n            font-size: 15px;\r\n            padding: 13px 22px 16px;\r\n          ",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_8*/ ctx[29]);
    	let if_block1 = /*regActive*/ ctx[6] === true && create_if_block_2$a(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			create_component(button.$$.fragment);
    			t1 = space();
    			span = element("span");
    			span.textContent = "Простые правила нашего сервиса";
    			t3 = space();
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t4 = text("svg { fill: gray; cursor: pointer; }\r\n          \r\n          ");
    			path = svg_element("path");
    			t5 = space();
    			if (if_block1) if_block1.c();
    			set_style(span, "color", "gray");
    			set_style(span, "opacity", "0.8");
    			set_style(span, "cursor", "pointer");
    			set_style(span, "display", "block");
    			set_style(span, "margin-left", "20px");
    			set_style(span, "margin-right", "13px");
    			add_location(span, file$b, 546, 8, 14394);
    			add_location(style, file$b, 567, 10, 14939);
    			attr_dev(path, "d", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z");
    			add_location(path, file$b, 572, 10, 15042);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "22px");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$b, 562, 8, 14805);
    			set_style(div0, "display", "flex");
    			set_style(div0, "flex-direction", "row");
    			set_style(div0, "align-items", "center");
    			set_style(div0, "margin-top", "0px");
    			add_location(div0, file$b, 527, 6, 13941);
    			attr_dev(div1, "class", "svelte-1pjyu2a");
    			toggle_class(div1, "authForm", true);
    			add_location(div1, file$b, 357, 4, 9218);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(button, div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, span);
    			append_dev(div0, t3);
    			append_dev(div0, svg);
    			append_dev(svg, style);
    			append_dev(style, t4);
    			append_dev(svg, path);
    			append_dev(div1, t5);
    			if (if_block1) if_block1.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_9*/ ctx[30], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*regActive*/ ctx[6] === false) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*regActive*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_7$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const button_changes = {};
    			if (dirty[0] & /*regActive*/ 64) button_changes.disabled = /*regActive*/ ctx[6];

    			if (dirty[1] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (/*regActive*/ ctx[6] === true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*regActive*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$a(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(button.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(button.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			destroy_component(button);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(356:2) { #if opacity == 0 }",
    		ctx
    	});

    	return block;
    }

    // (360:6) { #if regActive === false }
    function create_if_block_7$3(ctx) {
    	let t0;
    	let t1;
    	let div;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let svg;
    	let style;
    	let t6;
    	let path;
    	let t7;
    	let span;
    	let current;
    	let if_block0 = /*isRestore*/ ctx[8] == false && create_if_block_13(ctx);
    	let if_block1 = /*isRestore*/ ctx[8] == true && create_if_block_12(ctx);
    	let if_block2 = /*isRestore*/ ctx[8] == false && create_if_block_11(ctx);
    	let if_block3 = /*isRestore*/ ctx[8] == true && create_if_block_10$2(ctx);
    	let if_block4 = /*isRestore*/ ctx[8] == false && create_if_block_9$2(ctx);
    	let if_block5 = /*isRestore*/ ctx[8] == true && create_if_block_8$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div = element("div");
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (if_block5) if_block5.c();
    			t5 = space();
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t6 = text("svg { fill: gray; cursor: pointer; }\r\n            \r\n            ");
    			path = svg_element("path");
    			t7 = space();
    			span = element("span");
    			span.textContent = "Чтобы зарегистрироваться в системе, нажмите на кнопку ниже";
    			add_location(style, file$b, 502, 12, 12967);
    			attr_dev(path, "d", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z");
    			add_location(path, file$b, 507, 12, 13078);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "22px");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$b, 497, 10, 12823);
    			set_style(div, "display", "flex");
    			set_style(div, "flex-direction", "row");
    			set_style(div, "align-items", "center");
    			set_style(div, "margin-top", "30px");
    			add_location(div, file$b, 411, 8, 10743);
    			set_style(span, "color", "gray");
    			set_style(span, "opacity", "0.8");
    			set_style(span, "cursor", "pointer");
    			set_style(span, "display", "block");
    			set_style(span, "margin-top", "25px");
    			set_style(span, "margin-bottom", "31.1px");
    			add_location(span, file$b, 512, 8, 13597);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t2);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t3);
    			if (if_block4) if_block4.m(div, null);
    			append_dev(div, t4);
    			if (if_block5) if_block5.m(div, null);
    			append_dev(div, t5);
    			append_dev(div, svg);
    			append_dev(svg, style);
    			append_dev(style, t6);
    			append_dev(svg, path);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, span, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*isRestore*/ ctx[8] == false) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_13(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*isRestore*/ ctx[8] == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_12(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*isRestore*/ ctx[8] == false) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*isRestore*/ 256) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_11(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*isRestore*/ ctx[8] == true) {
    				if (if_block3) {
    					if (dirty[0] & /*isRestore*/ 256) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_10$2(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div, t3);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*isRestore*/ ctx[8] == false) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_9$2(ctx);
    					if_block4.c();
    					if_block4.m(div, t4);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*isRestore*/ ctx[8] == true) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_8$3(ctx);
    					if_block5.c();
    					if_block5.m(div, t5);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block2);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block2);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$3.name,
    		type: "if",
    		source: "(360:6) { #if regActive === false }",
    		ctx
    	});

    	return block;
    }

    // (362:8) { #if isRestore == false }
    function create_if_block_13(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "maxlength", "100");
    			attr_dev(input, "placeholder", "Введите ваш мастер-пароль от системы");
    			set_style(input, "display", "block");
    			set_style(input, "position", "relative");
    			set_style(input, "box-sizing", "border-box");
    			set_style(input, "width", "100%");
    			set_style(input, "height", "48px");
    			set_style(input, "border", "none");
    			set_style(input, "outline", "none");
    			set_style(input, "text-align", "center");
    			set_style(input, "border-radius", "6px");
    			set_style(input, "background-color", "transparent");
    			set_style(input, "letter-spacing", "0.8px");
    			set_style(input, "border-bottom", "2px solid rgb(67, 0, 176)");
    			add_location(input, file$b, 363, 10, 9340);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*MASTER_PASS*/ ctx[12]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[24]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*MASTER_PASS*/ 4096 && input.value !== /*MASTER_PASS*/ ctx[12]) {
    				set_input_value(input, /*MASTER_PASS*/ ctx[12]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(362:8) { #if isRestore == false }",
    		ctx
    	});

    	return block;
    }

    // (387:8) { #if isRestore == true }
    function create_if_block_12(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "maxlength", "100");
    			attr_dev(input, "placeholder", "Введите email - тот на который регистрировались");
    			set_style(input, "display", "block");
    			set_style(input, "position", "relative");
    			set_style(input, "box-sizing", "border-box");
    			set_style(input, "width", "100%");
    			set_style(input, "height", "48px");
    			set_style(input, "border", "none");
    			set_style(input, "outline", "none");
    			set_style(input, "text-align", "center");
    			set_style(input, "border-radius", "6px");
    			set_style(input, "background-color", "transparent");
    			set_style(input, "letter-spacing", "0.8px");
    			set_style(input, "border-bottom", "2px solid rgb(67, 0, 176)");
    			add_location(input, file$b, 388, 10, 10055);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*RESTORE_PASS*/ ctx[13]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[25]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*RESTORE_PASS*/ 8192 && input.value !== /*RESTORE_PASS*/ ctx[13]) {
    				set_input_value(input, /*RESTORE_PASS*/ ctx[13]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(387:8) { #if isRestore == true }",
    		ctx
    	});

    	return block;
    }

    // (421:10) { #if isRestore == false }
    function create_if_block_11(ctx) {
    	let button;
    	let current;

    	button = new Button$1({
    			props: {
    				disabled: /*regActive*/ ctx[6],
    				filled: true,
    				style: "\r\n                font-size: 15px;\r\n                padding: 13px 22px 16px;\r\n              ",
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_4*/ ctx[26]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty[0] & /*regActive*/ 64) button_changes.disabled = /*regActive*/ ctx[6];

    			if (dirty[0] & /*passValue*/ 16384 | dirty[1] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(421:10) { #if isRestore == false }",
    		ctx
    	});

    	return block;
    }

    // (423:12) <Button                 on:click={() => {                    if ( MASTER_PASS.length < 10 ) {                      passValue = 'Введите пароль'                    setTimeout(() => {                      passValue = 'Авторизоваться'                    }, 2000)                    } else {                      autorization()                    }                  }}                disabled={regActive}                filled                style="                  font-size: 15px;                  padding: 13px 22px 16px;                "              >
    function create_default_slot_5$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*passValue*/ ctx[14]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*passValue*/ 16384) set_data_dev(t, /*passValue*/ ctx[14]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(423:12) <Button                 on:click={() => {                    if ( MASTER_PASS.length < 10 ) {                      passValue = 'Введите пароль'                    setTimeout(() => {                      passValue = 'Авторизоваться'                    }, 2000)                    } else {                      autorization()                    }                  }}                disabled={regActive}                filled                style=\\\"                  font-size: 15px;                  padding: 13px 22px 16px;                \\\"              >",
    		ctx
    	});

    	return block;
    }

    // (449:10) { #if isRestore == true }
    function create_if_block_10$2(ctx) {
    	let button;
    	let current;

    	button = new Button$1({
    			props: {
    				disabled: true,
    				filled: true,
    				style: "\r\n                font-size: 15px;\r\n                padding: 13px 22px 16px;\r\n              ",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", click_handler_5);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$2.name,
    		type: "if",
    		source: "(449:10) { #if isRestore == true }",
    		ctx
    	});

    	return block;
    }

    // (451:12) <Button                 on:click={() => {}}                disabled={true}                filled                style="                  font-size: 15px;                  padding: 13px 22px 16px;                "              >
    function create_default_slot_4$2(ctx) {
    	let t_value = "Восстановить пароль" + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(451:12) <Button                 on:click={() => {}}                disabled={true}                filled                style=\\\"                  font-size: 15px;                  padding: 13px 22px 16px;                \\\"              >",
    		ctx
    	});

    	return block;
    }

    // (463:10) { #if isRestore == false }
    function create_if_block_9$2(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Помогите вспомнить пароль";
    			set_style(span, "color", "gray");
    			set_style(span, "opacity", "0.8");
    			set_style(span, "cursor", "pointer");
    			set_style(span, "display", "block");
    			set_style(span, "margin-left", "20px");
    			set_style(span, "margin-right", "13px");
    			add_location(span, file$b, 464, 12, 11959);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_6*/ ctx[27], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$2.name,
    		type: "if",
    		source: "(463:10) { #if isRestore == false }",
    		ctx
    	});

    	return block;
    }

    // (480:10) { #if isRestore == true }
    function create_if_block_8$3(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Вернуться назад к авторизации";
    			set_style(span, "color", "gray");
    			set_style(span, "opacity", "0.8");
    			set_style(span, "cursor", "pointer");
    			set_style(span, "display", "block");
    			set_style(span, "margin-left", "20px");
    			set_style(span, "margin-right", "13px");
    			add_location(span, file$b, 481, 12, 12408);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_7*/ ctx[28], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$3.name,
    		type: "if",
    		source: "(480:10) { #if isRestore == true }",
    		ctx
    	});

    	return block;
    }

    // (536:8) <Button             on:click={() => {              regActive = true            }}            disabled={regActive}            filled            style="              font-size: 15px;              padding: 13px 22px 16px;            "          >
    function create_default_slot_3$2(ctx) {
    	let t_value = "Зарегистрироваться" + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(536:8) <Button             on:click={() => {              regActive = true            }}            disabled={regActive}            filled            style=\\\"              font-size: 15px;              padding: 13px 22px 16px;            \\\"          >",
    		ctx
    	});

    	return block;
    }

    // (579:6) { #if regActive === true }
    function create_if_block_2$a(ctx) {
    	let div3;
    	let input0;
    	let t0;
    	let div0;
    	let svg0;
    	let if_block0_anchor;
    	let path0;
    	let t1;
    	let span0;
    	let t3;
    	let svg1;
    	let if_block2_anchor;
    	let path1;
    	let t4;
    	let checkbox0;
    	let t5;
    	let div1;
    	let span1;
    	let t7;
    	let input1;
    	let t8;
    	let checkbox1;
    	let t9;
    	let div2;
    	let button;
    	let t10;
    	let span2;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*sex*/ ctx[10] == 'male' && create_if_block_6$4(ctx);
    	let if_block1 = /*sex*/ ctx[10] == 'female' && create_if_block_5$6(ctx);
    	let if_block2 = /*sex*/ ctx[10] == 'male' && create_if_block_4$a(ctx);
    	let if_block3 = /*sex*/ ctx[10] == 'female' && create_if_block_3$a(ctx);

    	checkbox0 = new Checkbox$1({
    			props: {
    				disabled: true,
    				name: "male",
    				value: "male",
    				title: "select male",
    				selectorStyle: "\r\n                border: 2px solid #4300B0;\r\n                width: 19px;\r\n                height: 19px;\r\n                margin-left: 28px;\r\n                margin-right: 11px;\r\n              ",
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox1 = new Checkbox$1({
    			props: {
    				disabled: true,
    				name: "male",
    				value: "male",
    				title: "select male",
    				selectorStyle: "\r\n                border: 2px solid #4300B0;\r\n                width: 19px;\r\n                height: 19px;\r\n                margin-left: 28px;\r\n                margin-right: 11px;\r\n              ",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button$1({
    			props: {
    				filled: true,
    				style: "\r\n                font-size: 15px;\r\n                padding: 13px 22px 16px;\r\n              ",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*registration*/ ctx[18]);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			input0 = element("input");
    			t0 = space();
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			path0 = svg_element("path");
    			t1 = space();
    			span0 = element("span");
    			span0.textContent = "выберите ваш пол";
    			t3 = space();
    			svg1 = svg_element("svg");
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			if (if_block3) if_block3.c();
    			path1 = svg_element("path");
    			t4 = space();
    			create_component(checkbox0.$$.fragment);
    			t5 = space();
    			div1 = element("div");
    			span1 = element("span");
    			span1.textContent = "Укажите ваш возраст";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			create_component(checkbox1.$$.fragment);
    			t9 = space();
    			div2 = element("div");
    			create_component(button.$$.fragment);
    			t10 = space();
    			span2 = element("span");
    			span2.textContent = "Вернуться назад";
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "maxlength", "100");
    			attr_dev(input0, "placeholder", "Введите адрес вашей электронной почты для связи");
    			set_style(input0, "display", "block");
    			set_style(input0, "position", "relative");
    			set_style(input0, "box-sizing", "border-box");
    			set_style(input0, "height", "48px");
    			set_style(input0, "text-align", "center");
    			set_style(input0, "width", "100%");
    			set_style(input0, "border", "none");
    			set_style(input0, "outline", "none");
    			set_style(input0, "border-radius", "6px");
    			set_style(input0, "background-color", "transparent");
    			set_style(input0, "letter-spacing", "0.8px");
    			set_style(input0, "margin-top", "24px");
    			set_style(input0, "border-bottom", "2px solid rgb(67, 0, 176)");
    			add_location(input0, file$b, 581, 10, 15608);
    			attr_dev(path0, "d", "M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z");
    			add_location(path0, file$b, 616, 14, 16910);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "height", "70px");
    			attr_dev(svg0, "viewBox", "0 0 320 512");
    			toggle_class(svg0, "svgMale", true);
    			add_location(svg0, file$b, 603, 12, 16405);
    			set_style(span0, "margin-left", "26px");
    			set_style(span0, "margin-right", "28px");
    			add_location(span0, file$b, 618, 12, 17295);
    			attr_dev(path1, "d", "M160 0a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM88 384H70.2c-10.9 0-18.6-10.7-15.2-21.1L93.3 248.1 59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l53.6-89.2c20.3-33.7 56.7-54.3 96-54.3h11.6c39.3 0 75.7 20.6 96 54.3l53.6 89.2c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9l-33.9-56.3L265 362.9c3.5 10.4-4.3 21.1-15.2 21.1H232v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384H152v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z");
    			add_location(path1, file$b, 632, 14, 17898);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "height", "70px");
    			attr_dev(svg1, "viewBox", "0 0 320 512");
    			toggle_class(svg1, "svgfemale", true);
    			add_location(svg1, file$b, 619, 12, 17385);
    			set_style(div0, "margin-top", "30px");
    			set_style(div0, "display", "flex");
    			set_style(div0, "flex-direction", "row");
    			set_style(div0, "align-items", "center");
    			add_location(div0, file$b, 602, 10, 16303);
    			add_location(span1, file$b, 651, 12, 18952);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "maxlength", "2");
    			attr_dev(input1, "placeholder", "30");
    			set_style(input1, "display", "block");
    			set_style(input1, "position", "relative");
    			set_style(input1, "box-sizing", "border-box");
    			set_style(input1, "width", "60px");
    			set_style(input1, "height", "44px");
    			set_style(input1, "text-align", "center");
    			set_style(input1, "border", "none");
    			set_style(input1, "outline", "none");
    			set_style(input1, "border-radius", "6px");
    			set_style(input1, "background-color", "#FDFCF9");
    			set_style(input1, "margin-left", "28px");
    			add_location(input1, file$b, 652, 12, 18998);
    			set_style(div1, "margin-top", "36px");
    			set_style(div1, "display", "flex");
    			set_style(div1, "flex-direction", "row");
    			set_style(div1, "align-items", "center");
    			add_location(div1, file$b, 650, 10, 18850);
    			set_style(span2, "color", "gray");
    			set_style(span2, "opacity", "0.8");
    			set_style(span2, "cursor", "pointer");
    			set_style(span2, "display", "block");
    			set_style(span2, "margin-left", "20px");
    			set_style(span2, "margin-right", "13px");
    			add_location(span2, file$b, 703, 12, 20513);
    			set_style(div2, "display", "flex");
    			set_style(div2, "flex-direction", "row");
    			set_style(div2, "align-items", "center");
    			set_style(div2, "margin-top", "30px");
    			add_location(div2, file$b, 687, 10, 20076);
    			add_location(div3, file$b, 580, 8, 15591);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, input0);
    			set_input_value(input0, /*login*/ ctx[11]);
    			append_dev(div3, t0);
    			append_dev(div3, div0);
    			append_dev(div0, svg0);
    			if (if_block0) if_block0.m(svg0, null);
    			append_dev(svg0, if_block0_anchor);
    			if (if_block1) if_block1.m(svg0, null);
    			append_dev(svg0, path0);
    			append_dev(div0, t1);
    			append_dev(div0, span0);
    			append_dev(div0, t3);
    			append_dev(div0, svg1);
    			if (if_block2) if_block2.m(svg1, null);
    			append_dev(svg1, if_block2_anchor);
    			if (if_block3) if_block3.m(svg1, null);
    			append_dev(svg1, path1);
    			append_dev(div0, t4);
    			mount_component(checkbox0, div0, null);
    			append_dev(div3, t5);
    			append_dev(div3, div1);
    			append_dev(div1, span1);
    			append_dev(div1, t7);
    			append_dev(div1, input1);
    			set_input_value(input1, /*age*/ ctx[9]);
    			append_dev(div1, t8);
    			mount_component(checkbox1, div1, null);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			mount_component(button, div2, null);
    			append_dev(div2, t10);
    			append_dev(div2, span2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[31]),
    					listen_dev(svg0, "click", /*click_handler_10*/ ctx[32], false, false, false),
    					listen_dev(svg1, "click", /*click_handler_11*/ ctx[33], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[34]),
    					listen_dev(span2, "click", /*click_handler_12*/ ctx[35], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*login*/ 2048 && input0.value !== /*login*/ ctx[11]) {
    				set_input_value(input0, /*login*/ ctx[11]);
    			}

    			if (/*sex*/ ctx[10] == 'male') {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_6$4(ctx);
    					if_block0.c();
    					if_block0.m(svg0, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*sex*/ ctx[10] == 'female') {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_5$6(ctx);
    					if_block1.c();
    					if_block1.m(svg0, path0);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*sex*/ ctx[10] == 'male') {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_4$a(ctx);
    					if_block2.c();
    					if_block2.m(svg1, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*sex*/ ctx[10] == 'female') {
    				if (if_block3) ; else {
    					if_block3 = create_if_block_3$a(ctx);
    					if_block3.c();
    					if_block3.m(svg1, path1);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			const checkbox0_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				checkbox0_changes.$$scope = { dirty, ctx };
    			}

    			checkbox0.$set(checkbox0_changes);

    			if (dirty[0] & /*age*/ 512 && input1.value !== /*age*/ ctx[9]) {
    				set_input_value(input1, /*age*/ ctx[9]);
    			}

    			const checkbox1_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				checkbox1_changes.$$scope = { dirty, ctx };
    			}

    			checkbox1.$set(checkbox1_changes);
    			const button_changes = {};

    			if (dirty[0] & /*regValue*/ 32768 | dirty[1] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox0.$$.fragment, local);
    			transition_in(checkbox1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox0.$$.fragment, local);
    			transition_out(checkbox1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			destroy_component(checkbox0);
    			destroy_component(checkbox1);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$a.name,
    		type: "if",
    		source: "(579:6) { #if regActive === true }",
    		ctx
    	});

    	return block;
    }

    // (611:14) { #if sex == 'male' }
    function create_if_block_6$4(ctx) {
    	let style;
    	let t;

    	const block = {
    		c: function create() {
    			style = svg_element("style");
    			t = text("svg.svgMale{fill:#4300b0;cursor:pointer;}");
    			add_location(style, file$b, 611, 16, 16679);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, style, anchor);
    			append_dev(style, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(style);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$4.name,
    		type: "if",
    		source: "(611:14) { #if sex == 'male' }",
    		ctx
    	});

    	return block;
    }

    // (614:14) { #if sex == 'female' }
    function create_if_block_5$6(ctx) {
    	let style;
    	let t;

    	const block = {
    		c: function create() {
    			style = svg_element("style");
    			t = text("svg.svgMale{fill:#323835;cursor:pointer;}");
    			add_location(style, file$b, 614, 16, 16815);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, style, anchor);
    			append_dev(style, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(style);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$6.name,
    		type: "if",
    		source: "(614:14) { #if sex == 'female' }",
    		ctx
    	});

    	return block;
    }

    // (627:14) { #if sex == 'male' }
    function create_if_block_4$a(ctx) {
    	let style;
    	let t;

    	const block = {
    		c: function create() {
    			style = svg_element("style");
    			t = text("svg.svgfemale{fill:#323835;cursor:pointer;}");
    			add_location(style, file$b, 627, 16, 17663);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, style, anchor);
    			append_dev(style, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(style);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$a.name,
    		type: "if",
    		source: "(627:14) { #if sex == 'male' }",
    		ctx
    	});

    	return block;
    }

    // (630:14) { #if sex == 'female' }
    function create_if_block_3$a(ctx) {
    	let style;
    	let t;

    	const block = {
    		c: function create() {
    			style = svg_element("style");
    			t = text("svg.svgfemale{fill:#4300b0;cursor:pointer;}");
    			add_location(style, file$b, 630, 16, 17801);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, style, anchor);
    			append_dev(style, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(style);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$a.name,
    		type: "if",
    		source: "(630:14) { #if sex == 'female' }",
    		ctx
    	});

    	return block;
    }

    // (635:12) <Checkbox                disabled                name="male"                value="male"                title="select male"                selectorStyle="                  border: 2px solid #4300B0;                  width: 19px;                  height: 19px;                  margin-left: 28px;                  margin-right: 11px;                "              >
    function create_default_slot_2$5(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Пол не указан";
    			set_style(span, "font-size", "14px");
    			add_location(span, file$b, 647, 14, 18744);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(635:12) <Checkbox                disabled                name=\\\"male\\\"                value=\\\"male\\\"                title=\\\"select male\\\"                selectorStyle=\\\"                  border: 2px solid #4300B0;                  width: 19px;                  height: 19px;                  margin-left: 28px;                  margin-right: 11px;                \\\"              >",
    		ctx
    	});

    	return block;
    }

    // (672:12) <Checkbox                disabled                name="male"                value="male"                title="select male"                selectorStyle="                  border: 2px solid #4300B0;                  width: 19px;                  height: 19px;                  margin-left: 28px;                  margin-right: 11px;                "              >
    function create_default_slot_1$5(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Возраст не указан";
    			set_style(span, "font-size", "14px");
    			add_location(span, file$b, 684, 14, 19966);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(672:12) <Checkbox                disabled                name=\\\"male\\\"                value=\\\"male\\\"                title=\\\"select male\\\"                selectorStyle=\\\"                  border: 2px solid #4300B0;                  width: 19px;                  height: 19px;                  margin-left: 28px;                  margin-right: 11px;                \\\"              >",
    		ctx
    	});

    	return block;
    }

    // (696:12) <Button                 on:click={registration}                filled                style="                  font-size: 15px;                  padding: 13px 22px 16px;                "              >
    function create_default_slot$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*regValue*/ ctx[15]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*regValue*/ 32768) set_data_dev(t, /*regValue*/ ctx[15]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(696:12) <Button                 on:click={registration}                filled                style=\\\"                  font-size: 15px;                  padding: 13px 22px 16px;                \\\"              >",
    		ctx
    	});

    	return block;
    }

    // (727:2) { #if opacity == 0 }
    function create_if_block$a(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "свернуть окно авторизации";
    			set_style(span, "display", "block");
    			set_style(span, "position", "absolute");
    			set_style(span, "box-sizing", "border-box");
    			set_style(span, "color", "gray");
    			set_style(span, "opacity", "0.6");
    			set_style(span, "width", "300px");
    			set_style(span, "left", "50%");
    			set_style(span, "margin-left", "-150px");
    			set_style(span, "text-align", "center");
    			set_style(span, "cursor", "pointer");
    			set_style(span, "top", "100%");
    			set_style(span, "margin-top", "-44px");
    			add_location(span, file$b, 727, 4, 21030);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_13*/ ctx[36], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(727:2) { #if opacity == 0 }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let section;
    	let modal;
    	let updating_open;
    	let t0;
    	let div;
    	let img;
    	let img_src_value;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let current;

    	function modal_open_binding(value) {
    		/*modal_open_binding*/ ctx[21](value);
    	}

    	let modal_props = {
    		$$slots: {
    			default: [
    				create_default_slot_6$2,
    				({ closeCallback }) => ({ 38: closeCallback }),
    				({ closeCallback }) => [0, closeCallback ? 128 : 0]
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*showModal*/ ctx[7] !== void 0) {
    		modal_props.open = /*showModal*/ ctx[7];
    	}

    	modal = new Modal$1({ props: modal_props, $$inline: true });
    	binding_callbacks.push(() => bind(modal, 'open', modal_open_binding));
    	let if_block0 = /*AUTH*/ ctx[0] == false && create_if_block_15(ctx);
    	let if_block1 = /*AUTH*/ ctx[0] == true && create_if_block_14(ctx);
    	let if_block2 = /*opacity*/ ctx[5] == 0 && create_if_block_1$a(ctx);
    	let if_block3 = /*opacity*/ ctx[5] == 0 && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(modal.$$.fragment);
    			t0 = space();
    			div = element("div");
    			img = element("img");
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(img, "alt", "");
    			if (!src_url_equal(img.src, img_src_value = /*logo*/ ctx[16])) attr_dev(img, "src", img_src_value);
    			set_style(img, "width", "160px");
    			set_style(img, "margin-left", "-22px");
    			add_location(img, file$b, 263, 4, 6380);
    			attr_dev(div, "class", "svelte-1pjyu2a");
    			toggle_class(div, "headerLogo", true);
    			add_location(div, file$b, 262, 2, 6345);
    			set_style(section, "height", (/*opacity*/ ctx[5] == 1 ? 80 : 600) + "px");
    			attr_dev(section, "class", "svelte-1pjyu2a");
    			toggle_class(section, "header", true);
    			add_location(section, file$b, 180, 0, 3913);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(modal, section, null);
    			append_dev(section, t0);
    			append_dev(section, div);
    			append_dev(div, img);
    			append_dev(div, t1);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t2);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(section, t3);
    			if (if_block2) if_block2.m(section, null);
    			append_dev(section, t4);
    			if (if_block3) if_block3.m(section, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_changes = {};

    			if (dirty[0] & /*showModal, unauth, modalMessage*/ 138 | dirty[1] & /*$$scope, closeCallback*/ 384) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_open && dirty[0] & /*showModal*/ 128) {
    				updating_open = true;
    				modal_changes.open = /*showModal*/ ctx[7];
    				add_flush_callback(() => updating_open = false);
    			}

    			modal.$set(modal_changes);

    			if (/*AUTH*/ ctx[0] == false) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_15(ctx);
    					if_block0.c();
    					if_block0.m(div, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*AUTH*/ ctx[0] == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_14(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*opacity*/ ctx[5] == 0) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*opacity*/ 32) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1$a(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(section, t4);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*opacity*/ ctx[5] == 0) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block$a(ctx);
    					if_block3.c();
    					if_block3.m(section, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (!current || dirty[0] & /*opacity*/ 32) {
    				set_style(section, "height", (/*opacity*/ ctx[5] == 1 ? 80 : 600) + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(modal);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler_5 = () => {
    	
    };

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let modalMessage = 'Вы успешно зарегистрировались';

    	// ----------------------------------------------------------------
    	// ----------------------------------------------------------------
    	let AUTH;

    	let UID;
    	let unauth = false;
    	let userMail;
    	let opacity;
    	let regActive = false;
    	let showModal = false;
    	let isRestore = false;
    	let age = '';
    	let sex = 'male';
    	let login = '';
    	let MASTER_PASS = '';
    	let RESTORE_PASS = '';
    	let passValue = 'Авторизоваться';
    	let regValue = 'Создать новый аккаунт';
    	let logo = 'image/default.svg';

    	const saveAuth = param => {
    		localStorage.setItem("auth", param);
    	};

    	const autorization = () => {
    		let sendData = { login: MASTER_PASS };

    		fetch('http://localhost:3008/get-auth', {
    			method: 'POST',
    			headers: {
    				'Content-Type': 'application/json;charset=utf-8'
    			},
    			body: JSON.stringify(sendData)
    		}).then(res => res.json()).then(data => {
    			if (data.correct === MASTER_PASS) {
    				authCheck.set({
    					auth: true,
    					passID: MASTER_PASS,
    					userID: MASTER_PASS,
    					userMail: data.email,
    					age: data.params.age,
    					gender: data.params.gender,
    					style: data.params.style
    				});

    				saveAuth(MASTER_PASS);
    				$$invalidate(1, modalMessage = 'Вы успешно авторизовались');
    				$$invalidate(7, showModal = true);
    				contentOpacity.set(1);
    				pageRoute.set('list-questions');
    			} else {
    				$$invalidate(3, unauth = false);
    				$$invalidate(1, modalMessage = 'Мастер-пароль не найден');
    				$$invalidate(7, showModal = true);
    			}
    		});
    	};

    	const registration = () => {
    		let sendData = { login, age, gender: sex };

    		if (login.length > 0 && age.length > 0) {
    			console.log(sendData);

    			fetch('http://localhost:3008/add-auth', {
    				method: 'POST',
    				headers: {
    					'Content-Type': 'application/json;charset=utf-8'
    				},
    				body: JSON.stringify(sendData)
    			}).then(res => res.json()).then(data => {
    				if (data.uid !== 'email-uncorrect') {
    					// ----------------------------------------------------------------
    					// console.log(data)
    					// showModal = true
    					// contentOpacity.set(1)
    					// ----------------------------------------------------------------
    					// ----------------------------------------------------------------
    					// authCheck.set({
    					//   auth: true,
    					//   passID: data.uid,
    					//   userID: data.uid,
    					//   userMail: login
    					// })
    					// ----------------------------------------------------------------
    					// ----------------------------------------------------------------
    					// pageRoute.set('my-cabinet')
    					// ----------------------------------------------------------------
    					$$invalidate(1, modalMessage = `
            все отлично - проверьте ваш email, отправили доступы
          `);

    					$$invalidate(7, showModal = true);
    					contentOpacity.set(1);
    					$$invalidate(3, unauth = false);
    				} else {
    					$$invalidate(11, login = 'почта уже используется в системе');
    				}
    			});
    		} else {
    			$$invalidate(15, regValue = 'Заполните все данные');

    			setTimeout(
    				() => {
    					$$invalidate(15, regValue = 'Создать новый аккаунт');
    				},
    				2000
    			);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$a.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(7, showModal = false);

    	const click_handler_1 = () => {
    		$$invalidate(7, showModal = false);

    		authCheck.set({
    			auth: false,
    			passID: 'none',
    			userID: 'none'
    		});
    	};

    	function modal_open_binding(value) {
    		showModal = value;
    		$$invalidate(7, showModal);
    	}

    	const click_handler_2 = () => {
    		$$invalidate(6, regActive = false);

    		if (!authCheck.auth) {
    			contentOpacity.set(0);
    		}
    	};

    	const click_handler_3 = () => {
    		$$invalidate(1, modalMessage = 'Хотите выйти из аккаунта?');
    		$$invalidate(3, unauth = true);
    		$$invalidate(7, showModal = true);
    	};

    	function input_input_handler() {
    		MASTER_PASS = this.value;
    		$$invalidate(12, MASTER_PASS);
    	}

    	function input_input_handler_1() {
    		RESTORE_PASS = this.value;
    		$$invalidate(13, RESTORE_PASS);
    	}

    	const click_handler_4 = () => {
    		if (MASTER_PASS.length < 10) {
    			$$invalidate(14, passValue = 'Введите пароль');

    			setTimeout(
    				() => {
    					$$invalidate(14, passValue = 'Авторизоваться');
    				},
    				2000
    			);
    		} else {
    			autorization();
    		}
    	};

    	const click_handler_6 = () => $$invalidate(8, isRestore = true);
    	const click_handler_7 = () => $$invalidate(8, isRestore = false);

    	const click_handler_8 = () => {
    		$$invalidate(6, regActive = true);
    	};

    	const click_handler_9 = () => {
    		pageRoute.set('about');
    		contentOpacity.set(1);
    	};

    	function input0_input_handler() {
    		login = this.value;
    		$$invalidate(11, login);
    	}

    	const click_handler_10 = () => $$invalidate(10, sex = 'male');
    	const click_handler_11 = () => $$invalidate(10, sex = 'female');

    	function input1_input_handler() {
    		age = this.value;
    		$$invalidate(9, age);
    	}

    	const click_handler_12 = () => {
    		$$invalidate(6, regActive = false);
    	};

    	const click_handler_13 = () => contentOpacity.set(1);

    	$$self.$capture_state = () => ({
    		authCheck,
    		contentOpacity,
    		pageRoute,
    		Button: Button$1,
    		Checkbox: Checkbox$1,
    		Modal: Modal$1,
    		Dialog: Dialog$1,
    		modalMessage,
    		AUTH,
    		UID,
    		unauth,
    		userMail,
    		opacity,
    		regActive,
    		showModal,
    		isRestore,
    		age,
    		sex,
    		login,
    		MASTER_PASS,
    		RESTORE_PASS,
    		passValue,
    		regValue,
    		logo,
    		saveAuth,
    		autorization,
    		registration
    	});

    	$$self.$inject_state = $$props => {
    		if ('modalMessage' in $$props) $$invalidate(1, modalMessage = $$props.modalMessage);
    		if ('AUTH' in $$props) $$invalidate(0, AUTH = $$props.AUTH);
    		if ('UID' in $$props) $$invalidate(2, UID = $$props.UID);
    		if ('unauth' in $$props) $$invalidate(3, unauth = $$props.unauth);
    		if ('userMail' in $$props) $$invalidate(4, userMail = $$props.userMail);
    		if ('opacity' in $$props) $$invalidate(5, opacity = $$props.opacity);
    		if ('regActive' in $$props) $$invalidate(6, regActive = $$props.regActive);
    		if ('showModal' in $$props) $$invalidate(7, showModal = $$props.showModal);
    		if ('isRestore' in $$props) $$invalidate(8, isRestore = $$props.isRestore);
    		if ('age' in $$props) $$invalidate(9, age = $$props.age);
    		if ('sex' in $$props) $$invalidate(10, sex = $$props.sex);
    		if ('login' in $$props) $$invalidate(11, login = $$props.login);
    		if ('MASTER_PASS' in $$props) $$invalidate(12, MASTER_PASS = $$props.MASTER_PASS);
    		if ('RESTORE_PASS' in $$props) $$invalidate(13, RESTORE_PASS = $$props.RESTORE_PASS);
    		if ('passValue' in $$props) $$invalidate(14, passValue = $$props.passValue);
    		if ('regValue' in $$props) $$invalidate(15, regValue = $$props.regValue);
    		if ('logo' in $$props) $$invalidate(16, logo = $$props.logo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*AUTH*/ 1) {
    			{
    				authCheck.subscribe(value => {
    					$$invalidate(0, AUTH = value.auth);
    					$$invalidate(2, UID = value.userID);
    					$$invalidate(4, userMail = value.userMail);
    				});

    				if (AUTH == false) {
    					pageRoute.set('unauth');
    				}
    			}
    		}
    	};

    	{
    		contentOpacity.subscribe(value => {
    			$$invalidate(5, opacity = value);
    		});
    	}

    	return [
    		AUTH,
    		modalMessage,
    		UID,
    		unauth,
    		userMail,
    		opacity,
    		regActive,
    		showModal,
    		isRestore,
    		age,
    		sex,
    		login,
    		MASTER_PASS,
    		RESTORE_PASS,
    		passValue,
    		regValue,
    		logo,
    		autorization,
    		registration,
    		click_handler,
    		click_handler_1,
    		modal_open_binding,
    		click_handler_2,
    		click_handler_3,
    		input_input_handler,
    		input_input_handler_1,
    		click_handler_4,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		input0_input_handler,
    		click_handler_10,
    		click_handler_11,
    		input1_input_handler,
    		click_handler_12,
    		click_handler_13
    	];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\bricks\views\Main.svelte generated by Svelte v3.47.0 */

    const { console: console_1$9 } = globals;
    const file$a = "src\\bricks\\views\\Main.svelte";

    // (129:4) { #if AUTH == true }
    function create_if_block_5$5(ctx) {
    	let div1;
    	let span0;
    	let t1;
    	let div0;
    	let span1;
    	let t3;
    	let span2;
    	let t5;
    	let span3;
    	let t7;
    	let span4;
    	let t9;
    	let span6;
    	let t10;
    	let span5;
    	let t11;
    	let span7;
    	let t13;
    	let span8;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "основное меню hint";
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "мои вопросы";
    			t3 = space();
    			span2 = element("span");
    			span2.textContent = "*";
    			t5 = space();
    			span3 = element("span");
    			span3.textContent = "мои хинты";
    			t7 = space();
    			span4 = element("span");
    			span4.textContent = "*";
    			t9 = space();
    			span6 = element("span");
    			t10 = text("новый вопрос\r\n            ");
    			span5 = element("span");
    			t11 = space();
    			span7 = element("span");
    			span7.textContent = "*";
    			t13 = space();
    			span8 = element("span");
    			span8.textContent = "список вопросов";
    			attr_dev(span0, "class", "svelte-17sb0vh");
    			toggle_class(span0, "mainViewMenuItemLine", true);
    			add_location(span0, file$a, 131, 8, 3007);
    			set_style(span1, "margin-top", "11px");
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-17sb0vh");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$a, 133, 10, 3177);
    			set_style(span2, "margin-top", "12px");
    			set_style(span2, "cursor", "pointer");
    			set_style(span2, "color", "#4300b0");
    			set_style(span2, "margin-left", "30px");
    			attr_dev(span2, "class", "svelte-17sb0vh");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$a, 142, 10, 3447);
    			set_style(span3, "margin-top", "6px");
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-17sb0vh");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$a, 148, 10, 3650);
    			set_style(span4, "margin-top", "12px");
    			set_style(span4, "cursor", "pointer");
    			set_style(span4, "color", "#4300b0");
    			set_style(span4, "margin-left", "30px");
    			attr_dev(span4, "class", "svelte-17sb0vh");
    			toggle_class(span4, "mainViewMenuItemLine", true);
    			add_location(span4, file$a, 157, 10, 3913);
    			set_style(span5, "display", "block");
    			set_style(span5, "position", "absolute");
    			set_style(span5, "width", "3px");
    			set_style(span5, "height", "20px");
    			set_style(span5, "background-color", "#4300b0");
    			set_style(span5, "top", "50%");
    			set_style(span5, "left", "0");
    			set_style(span5, "margin-top", "-10px");
    			set_style(span5, "margin-left", "-10px");
    			set_style(span5, "border-radius", "2px");
    			add_location(span5, file$a, 171, 12, 4361);
    			set_style(span6, "margin-top", "6px");
    			set_style(span6, "cursor", "pointer");
    			attr_dev(span6, "class", "svelte-17sb0vh");
    			toggle_class(span6, "mainViewMenuItemLine", true);
    			add_location(span6, file$a, 163, 10, 4116);
    			set_style(span7, "margin-top", "12px");
    			set_style(span7, "cursor", "pointer");
    			set_style(span7, "color", "#4300b0");
    			set_style(span7, "margin-left", "30px");
    			attr_dev(span7, "class", "svelte-17sb0vh");
    			toggle_class(span7, "mainViewMenuItemLine", true);
    			add_location(span7, file$a, 186, 10, 4790);
    			set_style(span8, "margin-top", "6px");
    			set_style(span8, "cursor", "pointer");
    			attr_dev(span8, "class", "svelte-17sb0vh");
    			toggle_class(span8, "mainViewMenuItemLine", true);
    			add_location(span8, file$a, 192, 10, 4993);
    			set_style(div0, "margin-top", "0px");
    			set_style(div0, "margin-bottom", "0px");
    			attr_dev(div0, "class", "svelte-17sb0vh");
    			toggle_class(div0, "mainViewMenuItemSub", true);
    			add_location(div0, file$a, 132, 8, 3082);
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$a, 130, 6, 2962);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span1);
    			append_dev(div0, t3);
    			append_dev(div0, span2);
    			append_dev(div0, t5);
    			append_dev(div0, span3);
    			append_dev(div0, t7);
    			append_dev(div0, span4);
    			append_dev(div0, t9);
    			append_dev(div0, span6);
    			append_dev(span6, t10);
    			append_dev(span6, span5);
    			append_dev(div0, t11);
    			append_dev(div0, span7);
    			append_dev(div0, t13);
    			append_dev(div0, span8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*click_handler*/ ctx[15], false, false, false),
    					listen_dev(span3, "click", /*click_handler_1*/ ctx[16], false, false, false),
    					listen_dev(span6, "click", /*click_handler_2*/ ctx[17], false, false, false),
    					listen_dev(span8, "click", /*click_handler_3*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$5.name,
    		type: "if",
    		source: "(129:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (207:4) { #if AUTH == true }
    function create_if_block_4$9(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "мои характеристики";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-17sb0vh");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$a, 209, 8, 5410);
    			set_style(div, "margin-top", "11px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$a, 208, 6, 5339);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_4*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$9.name,
    		type: "if",
    		source: "(207:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (223:4) { #if AUTH == true }
    function create_if_block_3$9(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "главная страница";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-17sb0vh");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$a, 225, 8, 5776);
    			set_style(div, "margin-top", "6px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$a, 224, 6, 5706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_5*/ ctx[20], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$9.name,
    		type: "if",
    		source: "(223:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (238:4) { #if AUTH == false }
    function create_if_block_2$9(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "войти в аккаунт";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-17sb0vh");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$a, 240, 8, 6135);
    			set_style(div, "margin-top", "6px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$a, 239, 6, 6065);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_6*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$9.name,
    		type: "if",
    		source: "(238:4) { #if AUTH == false }",
    		ctx
    	});

    	return block;
    }

    // (381:8) <Checkbox            name="male"            value="male"            checked={male}            disabled={isLoading}            on:change={() => male = !male}            title="select male"            selectorStyle="              border: 2px solid #4300B0;              width: 19px;              height: 19px;              margin-left: 30px;              margin-right: 11px;            "          >
    function create_default_slot_8$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Мужчины";
    			set_style(span, "font-size", "14px");
    			add_location(span, file$a, 395, 10, 10851);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(381:8) <Checkbox            name=\\\"male\\\"            value=\\\"male\\\"            checked={male}            disabled={isLoading}            on:change={() => male = !male}            title=\\\"select male\\\"            selectorStyle=\\\"              border: 2px solid #4300B0;              width: 19px;              height: 19px;              margin-left: 30px;              margin-right: 11px;            \\\"          >",
    		ctx
    	});

    	return block;
    }

    // (398:8) <Checkbox            name="female"            value="female"            checked={female}            disabled={isLoading}            on:change={() => female = !female}            title="select male"            selectorStyle="              border: 2px solid #4300B0;              width: 19px;              height: 19px;              margin-left: 20px;              margin-right: 11px;            "          >
    function create_default_slot_7$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Женщины";
    			set_style(span, "font-size", "14px");
    			add_location(span, file$a, 412, 10, 11345);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(398:8) <Checkbox            name=\\\"female\\\"            value=\\\"female\\\"            checked={female}            disabled={isLoading}            on:change={() => female = !female}            title=\\\"select male\\\"            selectorStyle=\\\"              border: 2px solid #4300B0;              width: 19px;              height: 19px;              margin-left: 20px;              margin-right: 11px;            \\\"          >",
    		ctx
    	});

    	return block;
    }

    // (434:6) <Checkbox          name="male"          value="male"          checked={emoParam1}          disabled={isLoading}          on:change={() => emoParam1 = !emoParam1}          title="select male"          selectorStyle="            border: 2px solid #4300B0;            width: 19px;            height: 19px;            margin-left: 22px;            margin-right: 11px;          "        >
    function create_default_slot_6$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Рассудительно";
    			set_style(span, "font-size", "14px");
    			add_location(span, file$a, 448, 8, 12385);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(434:6) <Checkbox          name=\\\"male\\\"          value=\\\"male\\\"          checked={emoParam1}          disabled={isLoading}          on:change={() => emoParam1 = !emoParam1}          title=\\\"select male\\\"          selectorStyle=\\\"            border: 2px solid #4300B0;            width: 19px;            height: 19px;            margin-left: 22px;            margin-right: 11px;          \\\"        >",
    		ctx
    	});

    	return block;
    }

    // (451:6) <Checkbox          name="male"          value="male"          checked={emoParam2}          disabled={isLoading}          on:change={() => emoParam2 = !emoParam2}          title="select male"          selectorStyle="            border: 2px solid #4300B0;            width: 19px;            height: 19px;            margin-left: 20px;            margin-right: 11px;          "        >
    function create_default_slot_5$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Эмоционально";
    			set_style(span, "font-size", "14px");
    			add_location(span, file$a, 465, 8, 12856);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(451:6) <Checkbox          name=\\\"male\\\"          value=\\\"male\\\"          checked={emoParam2}          disabled={isLoading}          on:change={() => emoParam2 = !emoParam2}          title=\\\"select male\\\"          selectorStyle=\\\"            border: 2px solid #4300B0;            width: 19px;            height: 19px;            margin-left: 20px;            margin-right: 11px;          \\\"        >",
    		ctx
    	});

    	return block;
    }

    // (468:6) <Checkbox          name="male"          value="male"          checked={emoParam3}          disabled={isLoading}          on:change={() => emoParam3 = !emoParam3}          title="select male"          selectorStyle="            border: 2px solid #4300B0;            width: 19px;            height: 19px;            margin-left: 20px;            margin-right: 11px;          "        >
    function create_default_slot_4$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Радикально";
    			set_style(span, "font-size", "14px");
    			add_location(span, file$a, 482, 8, 13326);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(468:6) <Checkbox          name=\\\"male\\\"          value=\\\"male\\\"          checked={emoParam3}          disabled={isLoading}          on:change={() => emoParam3 = !emoParam3}          title=\\\"select male\\\"          selectorStyle=\\\"            border: 2px solid #4300B0;            width: 19px;            height: 19px;            margin-left: 20px;            margin-right: 11px;          \\\"        >",
    		ctx
    	});

    	return block;
    }

    // (485:6) <Checkbox          name="male"          value="male"          checked={emoParam4}          disabled={isLoading}          on:change={() => emoParam4 = !emoParam4}          title="select male"          selectorStyle="            border: 2px solid #4300B0;            width: 19px;            height: 19px;            margin-left: 20px;            margin-right: 11px;          "        >
    function create_default_slot_3$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Сдержанно";
    			set_style(span, "font-size", "14px");
    			add_location(span, file$a, 499, 8, 13794);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(485:6) <Checkbox          name=\\\"male\\\"          value=\\\"male\\\"          checked={emoParam4}          disabled={isLoading}          on:change={() => emoParam4 = !emoParam4}          title=\\\"select male\\\"          selectorStyle=\\\"            border: 2px solid #4300B0;            width: 19px;            height: 19px;            margin-left: 20px;            margin-right: 11px;          \\\"        >",
    		ctx
    	});

    	return block;
    }

    // (514:6) { :else }
    function create_else_block$2(ctx) {
    	let button;
    	let current;

    	button = new Button$1({
    			props: {
    				filled: true,
    				style: "\r\n            font-size: 15px;\r\n            padding: 13px 22px 16px;\r\n            margin-top: 44px;\r\n            background-color: #FDFCF9;\r\n          ",
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 32) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(514:6) { :else }",
    		ctx
    	});

    	return block;
    }

    // (504:6) { #if isLoading === false }
    function create_if_block_1$9(ctx) {
    	let button;
    	let current;

    	button = new Button$1({
    			props: {
    				filled: true,
    				style: "\r\n            font-size: 15px;\r\n            padding: 13px 22px 16px;\r\n            margin-top: 44px;\r\n          ",
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*newQuestion*/ ctx[14]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty[0] & /*sendButton*/ 2048 | dirty[1] & /*$$scope*/ 32) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(504:6) { #if isLoading === false }",
    		ctx
    	});

    	return block;
    }

    // (515:8) <Button             filled            style="              font-size: 15px;              padding: 13px 22px 16px;              margin-top: 44px;              background-color: #FDFCF9;            "          >
    function create_default_slot_2$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Ожидание загрузки..");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(515:8) <Button             filled            style=\\\"              font-size: 15px;              padding: 13px 22px 16px;              margin-top: 44px;              background-color: #FDFCF9;            \\\"          >",
    		ctx
    	});

    	return block;
    }

    // (505:8) <Button             on:click={newQuestion}            filled            style="              font-size: 15px;              padding: 13px 22px 16px;              margin-top: 44px;            "          >
    function create_default_slot_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*sendButton*/ ctx[11]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sendButton*/ 2048) set_data_dev(t, /*sendButton*/ ctx[11]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(505:8) <Button             on:click={newQuestion}            filled            style=\\\"              font-size: 15px;              padding: 13px 22px 16px;              margin-top: 44px;            \\\"          >",
    		ctx
    	});

    	return block;
    }

    // (525:6) <Button           filled          disabled          style="            font-size: 15px;            padding: 13px 22px 16px;            margin-top: 44px;            margin-left: 16px;          "        >
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Запасная кнопка на будущее");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(525:6) <Button           filled          disabled          style=\\\"            font-size: 15px;            padding: 13px 22px 16px;            margin-top: 44px;            margin-left: 16px;          \\\"        >",
    		ctx
    	});

    	return block;
    }

    // (535:6) { #if isLoading }
    function create_if_block$9(ctx) {
    	let div;
    	let loading;
    	let current;
    	loading = new Loading$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(loading.$$.fragment);
    			set_style(div, "display", "block");
    			set_style(div, "margin-top", "42px");
    			set_style(div, "margin-left", "40px");
    			set_style(div, "transform", "scale(140%) ");
    			add_location(div, file$a, 535, 8, 14776);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(loading, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(loading);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(535:6) { #if isLoading }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div10;
    	let div3;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let span0;
    	let t4;
    	let div0;
    	let span1;
    	let t6;
    	let div1;
    	let span2;
    	let t8;
    	let div2;
    	let span3;
    	let t10;
    	let div9;
    	let h3;
    	let t12;
    	let radiochipgroup;
    	let t13;
    	let div4;
    	let textarea;
    	let t14;
    	let span4;
    	let svg;
    	let style;
    	let t15;
    	let path;
    	let t16;
    	let div6;
    	let div5;
    	let span5;
    	let t18;
    	let span6;
    	let t19;
    	let t20;
    	let span7;
    	let t21;
    	let t22;
    	let checkbox0;
    	let t23;
    	let checkbox1;
    	let t24;
    	let slider;
    	let t25;
    	let div7;
    	let span8;
    	let t27;
    	let checkbox2;
    	let t28;
    	let checkbox3;
    	let t29;
    	let checkbox4;
    	let t30;
    	let checkbox5;
    	let t31;
    	let div8;
    	let current_block_type_index;
    	let if_block4;
    	let t32;
    	let button;
    	let t33;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*AUTH*/ ctx[0] == true && create_if_block_5$5(ctx);
    	let if_block1 = /*AUTH*/ ctx[0] == true && create_if_block_4$9(ctx);
    	let if_block2 = /*AUTH*/ ctx[0] == true && create_if_block_3$9(ctx);
    	let if_block3 = /*AUTH*/ ctx[0] == false && create_if_block_2$9(ctx);

    	radiochipgroup = new RadioChipGroup({
    			props: {
    				items: /*categories*/ ctx[12],
    				name: "categories"
    			},
    			$$inline: true
    		});

    	radiochipgroup.$on("change", /*changeCategory*/ ctx[13]);

    	checkbox0 = new Checkbox$1({
    			props: {
    				name: "male",
    				value: "male",
    				checked: /*male*/ ctx[5],
    				disabled: /*isLoading*/ ctx[1],
    				title: "select male",
    				selectorStyle: "\r\n            border: 2px solid #4300B0;\r\n            width: 19px;\r\n            height: 19px;\r\n            margin-left: 30px;\r\n            margin-right: 11px;\r\n          ",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox0.$on("change", /*change_handler*/ ctx[27]);

    	checkbox1 = new Checkbox$1({
    			props: {
    				name: "female",
    				value: "female",
    				checked: /*female*/ ctx[6],
    				disabled: /*isLoading*/ ctx[1],
    				title: "select male",
    				selectorStyle: "\r\n            border: 2px solid #4300B0;\r\n            width: 19px;\r\n            height: 19px;\r\n            margin-left: 20px;\r\n            margin-right: 11px;\r\n          ",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox1.$on("change", /*change_handler_1*/ ctx[28]);

    	slider = new Slider$1({
    			props: {
    				value: [18, 58],
    				min: 18,
    				max: 58,
    				step: 1,
    				tooltips: "never",
    				disabled: /*isLoading*/ ctx[1],
    				ticks: {
    					mode: 'values',
    					values: [18, 23, 28, 33, 38, 43, 48, 53, 58]
    				}
    			},
    			$$inline: true
    		});

    	slider.$on("change", /*change_handler_2*/ ctx[29]);

    	checkbox2 = new Checkbox$1({
    			props: {
    				name: "male",
    				value: "male",
    				checked: /*emoParam1*/ ctx[7],
    				disabled: /*isLoading*/ ctx[1],
    				title: "select male",
    				selectorStyle: "\r\n          border: 2px solid #4300B0;\r\n          width: 19px;\r\n          height: 19px;\r\n          margin-left: 22px;\r\n          margin-right: 11px;\r\n        ",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox2.$on("change", /*change_handler_3*/ ctx[30]);

    	checkbox3 = new Checkbox$1({
    			props: {
    				name: "male",
    				value: "male",
    				checked: /*emoParam2*/ ctx[8],
    				disabled: /*isLoading*/ ctx[1],
    				title: "select male",
    				selectorStyle: "\r\n          border: 2px solid #4300B0;\r\n          width: 19px;\r\n          height: 19px;\r\n          margin-left: 20px;\r\n          margin-right: 11px;\r\n        ",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox3.$on("change", /*change_handler_4*/ ctx[31]);

    	checkbox4 = new Checkbox$1({
    			props: {
    				name: "male",
    				value: "male",
    				checked: /*emoParam3*/ ctx[9],
    				disabled: /*isLoading*/ ctx[1],
    				title: "select male",
    				selectorStyle: "\r\n          border: 2px solid #4300B0;\r\n          width: 19px;\r\n          height: 19px;\r\n          margin-left: 20px;\r\n          margin-right: 11px;\r\n        ",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox4.$on("change", /*change_handler_5*/ ctx[32]);

    	checkbox5 = new Checkbox$1({
    			props: {
    				name: "male",
    				value: "male",
    				checked: /*emoParam4*/ ctx[10],
    				disabled: /*isLoading*/ ctx[1],
    				title: "select male",
    				selectorStyle: "\r\n          border: 2px solid #4300B0;\r\n          width: 19px;\r\n          height: 19px;\r\n          margin-left: 20px;\r\n          margin-right: 11px;\r\n        ",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox5.$on("change", /*change_handler_6*/ ctx[33]);
    	const if_block_creators = [create_if_block_1$9, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isLoading*/ ctx[1] === false) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block4 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	button = new Button$1({
    			props: {
    				filled: true,
    				disabled: true,
    				style: "\r\n          font-size: 15px;\r\n          padding: 13px 22px 16px;\r\n          margin-top: 44px;\r\n          margin-left: 16px;\r\n        ",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block5 = /*isLoading*/ ctx[1] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div3 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			span0 = element("span");
    			t4 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "о сервисе";
    			t6 = space();
    			div1 = element("div");
    			span2 = element("span");
    			span2.textContent = "конфиденциальность";
    			t8 = space();
    			div2 = element("div");
    			span3 = element("span");
    			span3.textContent = "служба качества";
    			t10 = space();
    			div9 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Написать новый вопрос";
    			t12 = space();
    			create_component(radiochipgroup.$$.fragment);
    			t13 = space();
    			div4 = element("div");
    			textarea = element("textarea");
    			t14 = space();
    			span4 = element("span");
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t15 = text("svg{fill:#fdfcf9}\r\n          ");
    			path = svg_element("path");
    			t16 = space();
    			div6 = element("div");
    			div5 = element("div");
    			span5 = element("span");
    			span5.textContent = "Выберите возраст аудитории";
    			t18 = space();
    			span6 = element("span");
    			t19 = text(/*valueStart*/ ctx[2]);
    			t20 = space();
    			span7 = element("span");
    			t21 = text(/*valueEnd*/ ctx[3]);
    			t22 = space();
    			create_component(checkbox0.$$.fragment);
    			t23 = space();
    			create_component(checkbox1.$$.fragment);
    			t24 = space();
    			create_component(slider.$$.fragment);
    			t25 = space();
    			div7 = element("div");
    			span8 = element("span");
    			span8.textContent = "Выберите стилистику ответов";
    			t27 = space();
    			create_component(checkbox2.$$.fragment);
    			t28 = space();
    			create_component(checkbox3.$$.fragment);
    			t29 = space();
    			create_component(checkbox4.$$.fragment);
    			t30 = space();
    			create_component(checkbox5.$$.fragment);
    			t31 = space();
    			div8 = element("div");
    			if_block4.c();
    			t32 = space();
    			create_component(button.$$.fragment);
    			t33 = space();
    			if (if_block5) if_block5.c();
    			set_style(span0, "display", "block");
    			set_style(span0, "position", "relative");
    			set_style(span0, "width", "80%");
    			set_style(span0, "height", "2px");
    			set_style(span0, "background-color", "gray");
    			set_style(span0, "opacity", "0.4");
    			set_style(span0, "border-radius", "1px");
    			set_style(span0, "margin-top", "20px");
    			add_location(span0, file$a, 253, 4, 6394);
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-17sb0vh");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$a, 266, 6, 6715);
    			set_style(div0, "margin-top", "18px");
    			toggle_class(div0, "mainViewMenuItem", true);
    			add_location(div0, file$a, 265, 4, 6646);
    			set_style(span2, "cursor", "pointer");
    			attr_dev(span2, "class", "svelte-17sb0vh");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$a, 277, 6, 7001);
    			set_style(div1, "margin-top", "11px");
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$a, 276, 4, 6932);
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-17sb0vh");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$a, 288, 6, 7297);
    			set_style(div2, "margin-top", "11px");
    			toggle_class(div2, "mainViewMenuItem", true);
    			add_location(div2, file$a, 287, 4, 7228);
    			set_style(div3, "width", "20%");
    			toggle_class(div3, "mainViewMenu", true);
    			add_location(div3, file$a, 126, 2, 2873);
    			attr_dev(h3, "class", "svelte-17sb0vh");
    			toggle_class(h3, "mainViewContentTitle", true);
    			add_location(h3, file$a, 301, 4, 7576);
    			attr_dev(textarea, "type", "text");
    			textarea.disabled = /*isLoading*/ ctx[1];
    			attr_dev(textarea, "placeholder", "Напишите ваш вопрос здесь - постарайтесь лаконично но подробно все описать, ограничение 1000 символов, минимальный объем текста 150 символов");
    			attr_dev(textarea, "maxlength", "1100");
    			attr_dev(textarea, "class", "svelte-17sb0vh");
    			toggle_class(textarea, "mainViewContentText", true);
    			add_location(textarea, file$a, 304, 6, 7749);
    			add_location(style, file$a, 338, 10, 8895);
    			attr_dev(path, "d", "M576 128c0-35.3-28.7-64-64-64H205.3c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7H512c35.3 0 64-28.7 64-64V128zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z");
    			add_location(path, file$a, 341, 10, 8965);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "28px");
    			attr_dev(svg, "viewBox", "0 0 576 512");
    			add_location(svg, file$a, 333, 8, 8761);
    			set_style(span4, "display", "flex");
    			set_style(span4, "flex-direction", "row");
    			set_style(span4, "align-items", "center");
    			set_style(span4, "justify-content", "space-around");
    			set_style(span4, "position", "absolute");
    			set_style(span4, "width", "66px");
    			set_style(span4, "height", "66px");
    			set_style(span4, "border-radius", "33px");
    			set_style(span4, "background-color", "#D33639");
    			set_style(span4, "margin-top", "-40px");
    			set_style(span4, "left", "100%");
    			set_style(span4, "margin-left", "-40px");
    			set_style(span4, "padding-right", "5px");
    			set_style(span4, "box-sizing", "border-box");
    			set_style(span4, "cursor", "pointer");
    			set_style(span4, "box-shadow", "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)");
    			add_location(span4, file$a, 312, 6, 8086);
    			add_location(div4, file$a, 303, 4, 7736);
    			set_style(span5, "display", "block");
    			add_location(span5, file$a, 347, 8, 9575);
    			set_style(span6, "display", "block");
    			set_style(span6, "width", "60px");
    			set_style(span6, "height", "38px");
    			set_style(span6, "background-color", "#FDFCF9");
    			set_style(span6, "border-radius", "6px");
    			set_style(span6, "font-size", "14px");
    			set_style(span6, "line-height", "36px");
    			set_style(span6, "text-align", "center");
    			set_style(span6, "margin-left", "22px");
    			set_style(span6, "margin-right", "14px");
    			add_location(span6, file$a, 350, 8, 9670);
    			set_style(span7, "display", "block");
    			set_style(span7, "width", "60px");
    			set_style(span7, "height", "38px");
    			set_style(span7, "background-color", "#FDFCF9");
    			set_style(span7, "border-radius", "6px");
    			set_style(span7, "font-size", "14px");
    			set_style(span7, "line-height", "36px");
    			set_style(span7, "text-align", "center");
    			add_location(span7, file$a, 366, 8, 10090);
    			set_style(div5, "display", "flex");
    			set_style(div5, "flex-direction", "row");
    			set_style(div5, "align-items", "center");
    			set_style(div5, "margin-bottom", "20px");
    			add_location(div5, file$a, 346, 6, 9474);
    			set_style(div6, "margin-top", "30px");
    			add_location(div6, file$a, 345, 4, 9435);
    			set_style(span8, "display", "block");
    			add_location(span8, file$a, 430, 6, 11902);
    			set_style(div7, "display", "flex");
    			set_style(div7, "flex-direction", "row");
    			set_style(div7, "align-items", "center");
    			set_style(div7, "margin-top", "58px");
    			add_location(div7, file$a, 429, 4, 11806);
    			set_style(div8, "display", "flex");
    			set_style(div8, "flex-direction", "row");
    			set_style(div8, "align-items", "center");
    			add_location(div8, file$a, 502, 4, 13878);
    			attr_dev(div9, "class", "svelte-17sb0vh");
    			toggle_class(div9, "mainViewContent", true);
    			add_location(div9, file$a, 299, 2, 7530);
    			attr_dev(div10, "class", "svelte-17sb0vh");
    			toggle_class(div10, "mainView", true);
    			add_location(div10, file$a, 125, 0, 2842);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div3);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div3, t0);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t1);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t2);
    			if (if_block3) if_block3.m(div3, null);
    			append_dev(div3, t3);
    			append_dev(div3, span0);
    			append_dev(div3, t4);
    			append_dev(div3, div0);
    			append_dev(div0, span1);
    			append_dev(div3, t6);
    			append_dev(div3, div1);
    			append_dev(div1, span2);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, span3);
    			append_dev(div10, t10);
    			append_dev(div10, div9);
    			append_dev(div9, h3);
    			append_dev(div9, t12);
    			mount_component(radiochipgroup, div9, null);
    			append_dev(div9, t13);
    			append_dev(div9, div4);
    			append_dev(div4, textarea);
    			set_input_value(textarea, /*text*/ ctx[4]);
    			append_dev(div4, t14);
    			append_dev(div4, span4);
    			append_dev(span4, svg);
    			append_dev(svg, style);
    			append_dev(style, t15);
    			append_dev(svg, path);
    			append_dev(div9, t16);
    			append_dev(div9, div6);
    			append_dev(div6, div5);
    			append_dev(div5, span5);
    			append_dev(div5, t18);
    			append_dev(div5, span6);
    			append_dev(span6, t19);
    			append_dev(div5, t20);
    			append_dev(div5, span7);
    			append_dev(span7, t21);
    			append_dev(div5, t22);
    			mount_component(checkbox0, div5, null);
    			append_dev(div5, t23);
    			mount_component(checkbox1, div5, null);
    			append_dev(div6, t24);
    			mount_component(slider, div6, null);
    			append_dev(div9, t25);
    			append_dev(div9, div7);
    			append_dev(div7, span8);
    			append_dev(div7, t27);
    			mount_component(checkbox2, div7, null);
    			append_dev(div7, t28);
    			mount_component(checkbox3, div7, null);
    			append_dev(div7, t29);
    			mount_component(checkbox4, div7, null);
    			append_dev(div7, t30);
    			mount_component(checkbox5, div7, null);
    			append_dev(div9, t31);
    			append_dev(div9, div8);
    			if_blocks[current_block_type_index].m(div8, null);
    			append_dev(div8, t32);
    			mount_component(button, div8, null);
    			append_dev(div8, t33);
    			if (if_block5) if_block5.m(div8, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*click_handler_7*/ ctx[22], false, false, false),
    					listen_dev(span2, "click", /*click_handler_8*/ ctx[23], false, false, false),
    					listen_dev(span3, "click", /*click_handler_9*/ ctx[24], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[25]),
    					listen_dev(span4, "click", /*click_handler_10*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*AUTH*/ ctx[0] == true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5$5(ctx);
    					if_block0.c();
    					if_block0.m(div3, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*AUTH*/ ctx[0] == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4$9(ctx);
    					if_block1.c();
    					if_block1.m(div3, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*AUTH*/ ctx[0] == true) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3$9(ctx);
    					if_block2.c();
    					if_block2.m(div3, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*AUTH*/ ctx[0] == false) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_2$9(ctx);
    					if_block3.c();
    					if_block3.m(div3, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (!current || dirty[0] & /*isLoading*/ 2) {
    				prop_dev(textarea, "disabled", /*isLoading*/ ctx[1]);
    			}

    			if (dirty[0] & /*text*/ 16) {
    				set_input_value(textarea, /*text*/ ctx[4]);
    			}

    			if (!current || dirty[0] & /*valueStart*/ 4) set_data_dev(t19, /*valueStart*/ ctx[2]);
    			if (!current || dirty[0] & /*valueEnd*/ 8) set_data_dev(t21, /*valueEnd*/ ctx[3]);
    			const checkbox0_changes = {};
    			if (dirty[0] & /*male*/ 32) checkbox0_changes.checked = /*male*/ ctx[5];
    			if (dirty[0] & /*isLoading*/ 2) checkbox0_changes.disabled = /*isLoading*/ ctx[1];

    			if (dirty[1] & /*$$scope*/ 32) {
    				checkbox0_changes.$$scope = { dirty, ctx };
    			}

    			checkbox0.$set(checkbox0_changes);
    			const checkbox1_changes = {};
    			if (dirty[0] & /*female*/ 64) checkbox1_changes.checked = /*female*/ ctx[6];
    			if (dirty[0] & /*isLoading*/ 2) checkbox1_changes.disabled = /*isLoading*/ ctx[1];

    			if (dirty[1] & /*$$scope*/ 32) {
    				checkbox1_changes.$$scope = { dirty, ctx };
    			}

    			checkbox1.$set(checkbox1_changes);
    			const slider_changes = {};
    			if (dirty[0] & /*isLoading*/ 2) slider_changes.disabled = /*isLoading*/ ctx[1];
    			slider.$set(slider_changes);
    			const checkbox2_changes = {};
    			if (dirty[0] & /*emoParam1*/ 128) checkbox2_changes.checked = /*emoParam1*/ ctx[7];
    			if (dirty[0] & /*isLoading*/ 2) checkbox2_changes.disabled = /*isLoading*/ ctx[1];

    			if (dirty[1] & /*$$scope*/ 32) {
    				checkbox2_changes.$$scope = { dirty, ctx };
    			}

    			checkbox2.$set(checkbox2_changes);
    			const checkbox3_changes = {};
    			if (dirty[0] & /*emoParam2*/ 256) checkbox3_changes.checked = /*emoParam2*/ ctx[8];
    			if (dirty[0] & /*isLoading*/ 2) checkbox3_changes.disabled = /*isLoading*/ ctx[1];

    			if (dirty[1] & /*$$scope*/ 32) {
    				checkbox3_changes.$$scope = { dirty, ctx };
    			}

    			checkbox3.$set(checkbox3_changes);
    			const checkbox4_changes = {};
    			if (dirty[0] & /*emoParam3*/ 512) checkbox4_changes.checked = /*emoParam3*/ ctx[9];
    			if (dirty[0] & /*isLoading*/ 2) checkbox4_changes.disabled = /*isLoading*/ ctx[1];

    			if (dirty[1] & /*$$scope*/ 32) {
    				checkbox4_changes.$$scope = { dirty, ctx };
    			}

    			checkbox4.$set(checkbox4_changes);
    			const checkbox5_changes = {};
    			if (dirty[0] & /*emoParam4*/ 1024) checkbox5_changes.checked = /*emoParam4*/ ctx[10];
    			if (dirty[0] & /*isLoading*/ 2) checkbox5_changes.disabled = /*isLoading*/ ctx[1];

    			if (dirty[1] & /*$$scope*/ 32) {
    				checkbox5_changes.$$scope = { dirty, ctx };
    			}

    			checkbox5.$set(checkbox5_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block4 = if_blocks[current_block_type_index];

    				if (!if_block4) {
    					if_block4 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block4.c();
    				} else {
    					if_block4.p(ctx, dirty);
    				}

    				transition_in(if_block4, 1);
    				if_block4.m(div8, t32);
    			}

    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 32) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (/*isLoading*/ ctx[1]) {
    				if (if_block5) {
    					if (dirty[0] & /*isLoading*/ 2) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block$9(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(div8, null);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(radiochipgroup.$$.fragment, local);
    			transition_in(checkbox0.$$.fragment, local);
    			transition_in(checkbox1.$$.fragment, local);
    			transition_in(slider.$$.fragment, local);
    			transition_in(checkbox2.$$.fragment, local);
    			transition_in(checkbox3.$$.fragment, local);
    			transition_in(checkbox4.$$.fragment, local);
    			transition_in(checkbox5.$$.fragment, local);
    			transition_in(if_block4);
    			transition_in(button.$$.fragment, local);
    			transition_in(if_block5);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(radiochipgroup.$$.fragment, local);
    			transition_out(checkbox0.$$.fragment, local);
    			transition_out(checkbox1.$$.fragment, local);
    			transition_out(slider.$$.fragment, local);
    			transition_out(checkbox2.$$.fragment, local);
    			transition_out(checkbox3.$$.fragment, local);
    			transition_out(checkbox4.$$.fragment, local);
    			transition_out(checkbox5.$$.fragment, local);
    			transition_out(if_block4);
    			transition_out(button.$$.fragment, local);
    			transition_out(if_block5);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			destroy_component(radiochipgroup);
    			destroy_component(checkbox0);
    			destroy_component(checkbox1);
    			destroy_component(slider);
    			destroy_component(checkbox2);
    			destroy_component(checkbox3);
    			destroy_component(checkbox4);
    			destroy_component(checkbox5);
    			if_blocks[current_block_type_index].d();
    			destroy_component(button);
    			if (if_block5) if_block5.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);

    	const categories = [
    		{ value: '1', label: 'Общее' },
    		{ value: '2', label: 'Карьера' },
    		{ value: '3', label: 'Личная жизнь' },
    		{ value: '4', label: 'Родственники' },
    		{ value: '5', label: 'Привычки и жизнь' },
    		{ value: '6', label: 'Психология' }
    	];

    	let isLoading = false;
    	let category = 0;
    	let AUTH = false;
    	let UID;
    	let valueStart = 18;
    	let valueEnd = 58;
    	let text = '';
    	let male = true;
    	let female = true;
    	let emoParam1 = true;
    	let emoParam2 = false;
    	let emoParam3 = false;
    	let emoParam4 = false;
    	let sendButton = 'Создать новый вопрос';

    	const changeCategory = event => {
    		category = event.detail.value;
    	};

    	const newQuestion = () => {
    		let sendData = {
    			uid: UID,
    			text,
    			category,
    			count: 5,
    			age: [valueStart, valueEnd],
    			gender: [male, female],
    			style: [
    				emoParam1 ? 'rass' : '',
    				emoParam2 ? 'emo' : '',
    				emoParam3 ? 'radi' : '',
    				emoParam4 ? 'sder' : ''
    			]
    		};

    		if (text.length >= 80 && (emoParam1 || emoParam2 || emoParam3 || emoParam4) && (male || female) && category != 0) {
    			$$invalidate(1, isLoading = true);

    			fetch('http://localhost:3008/add-data', {
    				method: 'POST',
    				headers: {
    					'Content-Type': 'application/json;charset=utf-8'
    				},
    				body: JSON.stringify(sendData)
    			}).then(res => res.json()).then(data => {
    				setTimeout(
    					async () => {
    						let updateMyQuestions = await fetch('http://localhost:3008/get-data', {
    							method: 'POST',
    							headers: {
    								'Content-Type': 'application/json;charset=utf-8'
    							},
    							body: JSON.stringify({})
    						}).then(res => res.json());

    						myQuestionsData.set(updateMyQuestions.data);
    						allQuestionsData.set(updateMyQuestions.data);
    						console.log(data);
    						pageRoute.set('my-questions');
    						$$invalidate(1, isLoading = false);
    					},
    					2000
    				);
    			});
    		} else {
    			$$invalidate(11, sendButton = 'Заполните все поля');
    			setTimeout(() => $$invalidate(11, sendButton = 'Создать новый вопрос'), 2000);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$9.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		pageRoute.set('my-questions');
    	};

    	const click_handler_1 = () => {
    		pageRoute.set('my-hints');
    	};

    	const click_handler_2 = () => {
    		pageRoute.set('main');
    	};

    	const click_handler_3 = () => {
    		pageRoute.set('list-questions');
    	};

    	const click_handler_4 = () => {
    		pageRoute.set('my-cabinet');
    	};

    	const click_handler_5 = () => {
    		pageRoute.set('unauth');
    	};

    	const click_handler_6 = () => {
    		pageRoute.set('unauth');
    	};

    	const click_handler_7 = () => {
    		pageRoute.set('about');
    	};

    	const click_handler_8 = () => {
    		pageRoute.set('polici');
    	};

    	const click_handler_9 = () => {
    		pageRoute.set('support');
    	};

    	function textarea_input_handler() {
    		text = this.value;
    		$$invalidate(4, text);
    	}

    	const click_handler_10 = () => $$invalidate(4, text = '');
    	const change_handler = () => $$invalidate(5, male = !male);
    	const change_handler_1 = () => $$invalidate(6, female = !female);

    	const change_handler_2 = event => {
    		$$invalidate(2, valueStart = event.detail[0]);
    		$$invalidate(3, valueEnd = event.detail[1]);
    	};

    	const change_handler_3 = () => $$invalidate(7, emoParam1 = !emoParam1);
    	const change_handler_4 = () => $$invalidate(8, emoParam2 = !emoParam2);
    	const change_handler_5 = () => $$invalidate(9, emoParam3 = !emoParam3);
    	const change_handler_6 = () => $$invalidate(10, emoParam4 = !emoParam4);

    	$$self.$capture_state = () => ({
    		pageRoute,
    		authCheck,
    		myQuestionsData,
    		allQuestionsData,
    		Slider: Slider$1,
    		Checkbox: Checkbox$1,
    		Button: Button$1,
    		Loading: Loading$1,
    		RadioChipGroup,
    		categories,
    		isLoading,
    		category,
    		AUTH,
    		UID,
    		valueStart,
    		valueEnd,
    		text,
    		male,
    		female,
    		emoParam1,
    		emoParam2,
    		emoParam3,
    		emoParam4,
    		sendButton,
    		changeCategory,
    		newQuestion
    	});

    	$$self.$inject_state = $$props => {
    		if ('isLoading' in $$props) $$invalidate(1, isLoading = $$props.isLoading);
    		if ('category' in $$props) category = $$props.category;
    		if ('AUTH' in $$props) $$invalidate(0, AUTH = $$props.AUTH);
    		if ('UID' in $$props) UID = $$props.UID;
    		if ('valueStart' in $$props) $$invalidate(2, valueStart = $$props.valueStart);
    		if ('valueEnd' in $$props) $$invalidate(3, valueEnd = $$props.valueEnd);
    		if ('text' in $$props) $$invalidate(4, text = $$props.text);
    		if ('male' in $$props) $$invalidate(5, male = $$props.male);
    		if ('female' in $$props) $$invalidate(6, female = $$props.female);
    		if ('emoParam1' in $$props) $$invalidate(7, emoParam1 = $$props.emoParam1);
    		if ('emoParam2' in $$props) $$invalidate(8, emoParam2 = $$props.emoParam2);
    		if ('emoParam3' in $$props) $$invalidate(9, emoParam3 = $$props.emoParam3);
    		if ('emoParam4' in $$props) $$invalidate(10, emoParam4 = $$props.emoParam4);
    		if ('sendButton' in $$props) $$invalidate(11, sendButton = $$props.sendButton);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*AUTH*/ 1) {
    			{
    				authCheck.subscribe(value => {
    					$$invalidate(0, AUTH = value.auth);
    					UID = value.userID;
    				});

    				console.log(AUTH);
    			}
    		}
    	};

    	return [
    		AUTH,
    		isLoading,
    		valueStart,
    		valueEnd,
    		text,
    		male,
    		female,
    		emoParam1,
    		emoParam2,
    		emoParam3,
    		emoParam4,
    		sendButton,
    		categories,
    		changeCategory,
    		newQuestion,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		textarea_input_handler,
    		click_handler_10,
    		change_handler,
    		change_handler_1,
    		change_handler_2,
    		change_handler_3,
    		change_handler_4,
    		change_handler_5,
    		change_handler_6
    	];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\bricks\views\AllQuestions.svelte generated by Svelte v3.47.0 */

    const { console: console_1$8 } = globals;
    const file$9 = "src\\bricks\\views\\AllQuestions.svelte";

    // (156:4) { #if AUTH == true }
    function create_if_block_10$1(ctx) {
    	let div1;
    	let span0;
    	let t1;
    	let div0;
    	let span1;
    	let t3;
    	let span2;
    	let t5;
    	let span3;
    	let t7;
    	let span4;
    	let t9;
    	let span5;
    	let t11;
    	let span6;
    	let t13;
    	let span8;
    	let t14;
    	let span7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "основное меню hint";
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "мои вопросы";
    			t3 = space();
    			span2 = element("span");
    			span2.textContent = "*";
    			t5 = space();
    			span3 = element("span");
    			span3.textContent = "мои хинты";
    			t7 = space();
    			span4 = element("span");
    			span4.textContent = "*";
    			t9 = space();
    			span5 = element("span");
    			span5.textContent = "новый вопрос";
    			t11 = space();
    			span6 = element("span");
    			span6.textContent = "*";
    			t13 = space();
    			span8 = element("span");
    			t14 = text("список вопросов\r\n            ");
    			span7 = element("span");
    			attr_dev(span0, "class", "svelte-10ufo0x");
    			toggle_class(span0, "mainViewMenuItemLine", true);
    			add_location(span0, file$9, 158, 8, 3777);
    			set_style(span1, "margin-top", "11px");
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-10ufo0x");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$9, 160, 10, 3947);
    			set_style(span2, "margin-top", "12px");
    			set_style(span2, "cursor", "pointer");
    			set_style(span2, "color", "#4300b0");
    			set_style(span2, "margin-left", "30px");
    			attr_dev(span2, "class", "svelte-10ufo0x");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$9, 169, 10, 4217);
    			set_style(span3, "margin-top", "6px");
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-10ufo0x");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$9, 175, 10, 4420);
    			set_style(span4, "margin-top", "12px");
    			set_style(span4, "cursor", "pointer");
    			set_style(span4, "color", "#4300b0");
    			set_style(span4, "margin-left", "30px");
    			attr_dev(span4, "class", "svelte-10ufo0x");
    			toggle_class(span4, "mainViewMenuItemLine", true);
    			add_location(span4, file$9, 184, 10, 4683);
    			set_style(span5, "margin-top", "6px");
    			set_style(span5, "cursor", "pointer");
    			attr_dev(span5, "class", "svelte-10ufo0x");
    			toggle_class(span5, "mainViewMenuItemLine", true);
    			add_location(span5, file$9, 190, 10, 4886);
    			set_style(span6, "margin-top", "12px");
    			set_style(span6, "cursor", "pointer");
    			set_style(span6, "color", "#4300b0");
    			set_style(span6, "margin-left", "30px");
    			attr_dev(span6, "class", "svelte-10ufo0x");
    			toggle_class(span6, "mainViewMenuItemLine", true);
    			add_location(span6, file$9, 199, 10, 5148);
    			set_style(span7, "display", "block");
    			set_style(span7, "position", "absolute");
    			set_style(span7, "width", "3px");
    			set_style(span7, "height", "20px");
    			set_style(span7, "background-color", "#4300b0");
    			set_style(span7, "top", "50%");
    			set_style(span7, "left", "0");
    			set_style(span7, "margin-top", "-10px");
    			set_style(span7, "margin-left", "-10px");
    			set_style(span7, "border-radius", "2px");
    			add_location(span7, file$9, 213, 12, 5609);
    			set_style(span8, "margin-top", "6px");
    			set_style(span8, "cursor", "pointer");
    			attr_dev(span8, "class", "svelte-10ufo0x");
    			toggle_class(span8, "mainViewMenuItemLine", true);
    			add_location(span8, file$9, 205, 10, 5351);
    			set_style(div0, "margin-top", "0px");
    			set_style(div0, "margin-bottom", "0px");
    			attr_dev(div0, "class", "svelte-10ufo0x");
    			toggle_class(div0, "mainViewMenuItemSub", true);
    			add_location(div0, file$9, 159, 8, 3852);
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$9, 157, 6, 3732);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span1);
    			append_dev(div0, t3);
    			append_dev(div0, span2);
    			append_dev(div0, t5);
    			append_dev(div0, span3);
    			append_dev(div0, t7);
    			append_dev(div0, span4);
    			append_dev(div0, t9);
    			append_dev(div0, span5);
    			append_dev(div0, t11);
    			append_dev(div0, span6);
    			append_dev(div0, t13);
    			append_dev(div0, span8);
    			append_dev(span8, t14);
    			append_dev(span8, span7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*click_handler*/ ctx[15], false, false, false),
    					listen_dev(span3, "click", /*click_handler_1*/ ctx[16], false, false, false),
    					listen_dev(span5, "click", /*click_handler_2*/ ctx[17], false, false, false),
    					listen_dev(span8, "click", /*click_handler_3*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(156:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (234:4) { #if AUTH == true }
    function create_if_block_9$1(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "мои характеристики";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-10ufo0x");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$9, 236, 8, 6180);
    			set_style(div, "margin-top", "11px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$9, 235, 6, 6109);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_4*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(234:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (250:4) { #if AUTH == true }
    function create_if_block_8$2(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "главная страница";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-10ufo0x");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$9, 252, 8, 6546);
    			set_style(div, "margin-top", "6px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$9, 251, 6, 6476);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_5*/ ctx[20], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$2.name,
    		type: "if",
    		source: "(250:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (265:4) { #if AUTH == false }
    function create_if_block_7$2(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "войти в аккаунт";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-10ufo0x");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$9, 267, 8, 6905);
    			set_style(div, "margin-top", "6px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$9, 266, 6, 6835);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_6*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$2.name,
    		type: "if",
    		source: "(265:4) { #if AUTH == false }",
    		ctx
    	});

    	return block;
    }

    // (342:10) <Button               filled              style="                font-size: 15px;                padding: 13px 22px 16px;                margin-top: 22px;                margin-bottom: 28px;              "            >
    function create_default_slot_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Подтвердить оценку");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(342:10) <Button               filled              style=\\\"                font-size: 15px;                padding: 13px 22px 16px;                margin-top: 22px;                margin-bottom: 28px;              \\\"            >",
    		ctx
    	});

    	return block;
    }

    // (329:6) <Dialog title="" {closeCallback}>
    function create_default_slot_1$3(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let starrating;
    	let updating_value;
    	let t2;
    	let button;
    	let current;

    	function starrating_value_binding(value) {
    		/*starrating_value_binding*/ ctx[25](value);
    	}

    	let starrating_props = { style: "margin: 0;", name: "default" };

    	if (/*hintRate*/ ctx[3] !== void 0) {
    		starrating_props.value = /*hintRate*/ ctx[3];
    	}

    	starrating = new StarRating({ props: starrating_props, $$inline: true });
    	binding_callbacks.push(() => bind(starrating, 'value', starrating_value_binding));

    	button = new Button$1({
    			props: {
    				filled: true,
    				style: "\r\n              font-size: 15px;\r\n              padding: 13px 22px 16px;\r\n              margin-top: 22px;\r\n              margin-bottom: 28px;\r\n            ",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Насколько этот хинт был полезным";
    			t1 = space();
    			create_component(starrating.$$.fragment);
    			t2 = space();
    			create_component(button.$$.fragment);
    			set_style(h3, "margin-top", "28px");
    			set_style(h3, "margin-bottom", "14px");
    			add_location(h3, file$9, 339, 10, 8701);
    			set_style(div, "width", "100%");
    			set_style(div, "display", "flex");
    			set_style(div, "flex-direction", "column");
    			set_style(div, "align-items", "center");
    			set_style(div, "justify-content", "flex-start");
    			set_style(div, "margin-top", "14px");
    			add_location(div, file$9, 329, 8, 8442);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			mount_component(starrating, div, null);
    			append_dev(div, t2);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const starrating_changes = {};

    			if (!updating_value && dirty[0] & /*hintRate*/ 8) {
    				updating_value = true;
    				starrating_changes.value = /*hintRate*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			starrating.$set(starrating_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(starrating.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(starrating.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(starrating);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(329:6) <Dialog title=\\\"\\\" {closeCallback}>",
    		ctx
    	});

    	return block;
    }

    // (328:4) <Modal bind:open={showModal} let:closeCallback>
    function create_default_slot$3(ctx) {
    	let dialog;
    	let current;

    	dialog = new Dialog$1({
    			props: {
    				title: "",
    				closeCallback: /*closeCallback*/ ctx[30],
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dialog.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialog, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dialog_changes = {};
    			if (dirty[0] & /*closeCallback*/ 1073741824) dialog_changes.closeCallback = /*closeCallback*/ ctx[30];

    			if (dirty[0] & /*hintRate*/ 8 | dirty[1] & /*$$scope*/ 1) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			dialog.$set(dialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialog, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(328:4) <Modal bind:open={showModal} let:closeCallback>",
    		ctx
    	});

    	return block;
    }

    // (413:8) { #if questionsDataFilter.length > 0 }
    function create_if_block_2$8(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = (/*filterCategory*/ ctx[1] == 0 || /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].category == /*filterCategory*/ ctx[1]) && create_if_block_3$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*filterCategory*/ ctx[1] == 0 || /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].category == /*filterCategory*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*filterCategory, questionsDataFilter, questionsIndex*/ 1538) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$8.name,
    		type: "if",
    		source: "(413:8) { #if questionsDataFilter.length > 0 }",
    		ctx
    	});

    	return block;
    }

    // (415:12) { #if filterCategory == 0 || questionsDataFilter[questionsIndex].category == filterCategory }
    function create_if_block_3$8(ctx) {
    	let div3;
    	let span1;
    	let svg0;
    	let style0;
    	let t0;
    	let path0;
    	let t1;
    	let span0;
    	let t2;
    	let t3_value = /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].quid.split('*').join('') + "";
    	let t3;
    	let t4;

    	let t5_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].category == 1
    	? 'Общее'
    	: /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].category == 2
    		? 'Карьера'
    		: /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].category == 3
    			? 'Личная жизнь'
    			: /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].category == 4
    				? 'Родственники'
    				: /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].category == 5
    					? 'Привычки и жизнь'
    					: /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].category == 6
    						? 'Психология'
    						: 'Общий совет') + "";

    	let t5;
    	let t6;
    	let t7;
    	let divider;
    	let t8;
    	let div0;
    	let span2;
    	let t10;
    	let span3;
    	let t11;
    	let t12_value = /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.age[0] + "";
    	let t12;
    	let t13;
    	let t14_value = /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.age[1] + "";
    	let t14;
    	let t15;
    	let t16;
    	let span4;
    	let t17;
    	let t18_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.gender[0] && "мужской") + "";
    	let t18;
    	let t19;
    	let t20_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.gender[0] && " и ") + "";
    	let t20;
    	let t21;
    	let t22_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.gender[1] && "женский") + "";
    	let t22;
    	let t23;
    	let div1;
    	let span5;
    	let t25;
    	let span6;

    	let t26_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.style[0] != ''
    	? 'рассудительно'
    	: '') + "";

    	let t26;
    	let t27;
    	let span7;

    	let t28_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.style[1] != ''
    	? ' * эмоционально'
    	: '') + "";

    	let t28;
    	let t29;
    	let span8;

    	let t30_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.style[2] != ''
    	? ' * радикально'
    	: '') + "";

    	let t30;
    	let t31;
    	let span9;

    	let t32_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.style[3] != ''
    	? ' * сдержанно'
    	: '') + "";

    	let t32;
    	let t33;
    	let div2;
    	let textarea;
    	let t34;
    	let span10;
    	let svg1;
    	let style1;
    	let t35;
    	let path1;
    	let t36;
    	let t37;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*userAge*/ ctx[5] >= /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.age[0] && /*userAge*/ ctx[5] <= /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.age[1] && (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.gender[0] == true && /*userGender*/ ctx[6] == 'male' || /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.gender[1] == true && /*userGender*/ ctx[6] == 'female')) return create_if_block_6$3;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	divider = new Divider$1({
    			props: {
    				style: "margin-top: 33px; margin-bottom: 30px;",
    				text: "написать хинт для этого вопроса - " + /*text*/ ctx[7].length + " символов"
    			},
    			$$inline: true
    		});

    	let if_block1 = /*text*/ ctx[7].length >= 40 && create_if_block_5$4(ctx);
    	let if_block2 = /*text*/ ctx[7].length < 40 && create_if_block_4$8(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			span1 = element("span");
    			svg0 = svg_element("svg");
    			style0 = svg_element("style");
    			t0 = text("svg.localSvg { fill: #4300b0; }\r\n                    \r\n                    ");
    			path0 = svg_element("path");
    			t1 = space();
    			span0 = element("span");
    			t2 = text("вопрос \r\n                    ");
    			t3 = text(t3_value);
    			t4 = text(" | \r\n                    ");
    			t5 = text(t5_value);
    			t6 = space();
    			if_block0.c();
    			t7 = space();
    			create_component(divider.$$.fragment);
    			t8 = space();
    			div0 = element("div");
    			span2 = element("span");
    			span2.textContent = "Предпочтения:";
    			t10 = space();
    			span3 = element("span");
    			t11 = text("возраст ");
    			t12 = text(t12_value);
    			t13 = text(" - ");
    			t14 = text(t14_value);
    			t15 = text(" *");
    			t16 = space();
    			span4 = element("span");
    			t17 = text("пол ");
    			t18 = text(t18_value);
    			t19 = space();
    			t20 = text(t20_value);
    			t21 = space();
    			t22 = text(t22_value);
    			t23 = space();
    			div1 = element("div");
    			span5 = element("span");
    			span5.textContent = "Стилистика ответов:";
    			t25 = space();
    			span6 = element("span");
    			t26 = text(t26_value);
    			t27 = space();
    			span7 = element("span");
    			t28 = text(t28_value);
    			t29 = space();
    			span8 = element("span");
    			t30 = text(t30_value);
    			t31 = space();
    			span9 = element("span");
    			t32 = text(t32_value);
    			t33 = space();
    			div2 = element("div");
    			textarea = element("textarea");
    			t34 = space();
    			span10 = element("span");
    			svg1 = svg_element("svg");
    			style1 = svg_element("style");
    			t35 = text("svg { fill: #fdfcf9 }\r\n                      ");
    			path1 = svg_element("path");
    			t36 = space();
    			if (if_block1) if_block1.c();
    			t37 = space();
    			if (if_block2) if_block2.c();
    			add_location(style0, file$9, 437, 20, 11973);
    			attr_dev(path0, "d", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z");
    			add_location(path0, file$9, 442, 20, 12125);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "height", "24px");
    			attr_dev(svg0, "viewBox", "0 0 512 512");
    			toggle_class(svg0, "localSvg", true);
    			add_location(svg0, file$9, 431, 18, 11746);
    			set_style(span0, "margin-left", "11px");
    			add_location(span0, file$9, 446, 18, 12662);
    			set_style(span1, "color", "gray");
    			set_style(span1, "width", "100%");
    			set_style(span1, "display", "flex");
    			set_style(span1, "flex-direction", "row");
    			set_style(span1, "align-items", "center");
    			set_style(span1, "margin-bottom", "13px");
    			set_style(span1, "font-size", "13px");
    			set_style(span1, "letter-spacing", "1px");
    			set_style(span1, "font-weight", "500");
    			set_style(span1, "opacity", "0.6");
    			add_location(span1, file$9, 417, 16, 11265);
    			set_style(span2, "color", "#656565");
    			set_style(span2, "font-size", "15px");
    			set_style(span2, "opacity", "0.8");
    			add_location(span2, file$9, 499, 18, 15133);
    			set_style(span3, "color", "#656565");
    			set_style(span3, "font-size", "15px");
    			set_style(span3, "opacity", "0.8");
    			add_location(span3, file$9, 500, 18, 15234);
    			set_style(span4, "color", "#656565");
    			set_style(span4, "font-size", "15px");
    			set_style(span4, "opacity", "0.8");
    			add_location(span4, file$9, 501, 18, 15441);
    			add_location(div0, file$9, 498, 16, 15108);
    			set_style(span5, "color", "#656565");
    			set_style(span5, "font-size", "15px");
    			set_style(span5, "opacity", "0.8");
    			add_location(span5, file$9, 504, 18, 15785);
    			set_style(span6, "color", "#656565");
    			set_style(span6, "font-size", "15px");
    			set_style(span6, "opacity", "0.8");
    			add_location(span6, file$9, 505, 18, 15892);
    			set_style(span7, "color", "#656565");
    			set_style(span7, "font-size", "15px");
    			set_style(span7, "opacity", "0.8");
    			add_location(span7, file$9, 506, 18, 16064);
    			set_style(span8, "color", "#656565");
    			set_style(span8, "font-size", "15px");
    			set_style(span8, "opacity", "0.8");
    			add_location(span8, file$9, 507, 18, 16238);
    			set_style(span9, "color", "#656565");
    			set_style(span9, "font-size", "15px");
    			set_style(span9, "opacity", "0.8");
    			add_location(span9, file$9, 508, 18, 16410);
    			add_location(div1, file$9, 503, 16, 15760);
    			attr_dev(textarea, "type", "text");
    			attr_dev(textarea, "placeholder", "Будьте собой, пишите так, как будто даете совет близкому другу, но помните, что один из главных принципов сервиса - не навредить другому. Ограничение по символам - от 40 до 1000 символов");
    			attr_dev(textarea, "maxlength", "1000");
    			attr_dev(textarea, "class", "svelte-10ufo0x");
    			toggle_class(textarea, "mainViewContentText", true);
    			add_location(textarea, file$9, 512, 18, 16671);
    			add_location(style1, file$9, 546, 22, 18275);
    			attr_dev(path1, "d", "M576 128c0-35.3-28.7-64-64-64H205.3c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7H512c35.3 0 64-28.7 64-64V128zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z");
    			add_location(path1, file$9, 549, 22, 18385);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "height", "33px");
    			attr_dev(svg1, "viewBox", "0 0 576 512");
    			toggle_class(svg1, "svg-clear", true);
    			add_location(svg1, file$9, 540, 20, 18035);
    			set_style(span10, "display", "flex");
    			set_style(span10, "flex-direction", "row");
    			set_style(span10, "align-items", "center");
    			set_style(span10, "justify-content", "space-around");
    			set_style(span10, "position", "absolute");
    			set_style(span10, "width", "80px");
    			set_style(span10, "height", "80px");
    			set_style(span10, "border-radius", "40px");
    			set_style(span10, "background-color", "#D33639");
    			set_style(span10, "margin-top", "-40px");
    			set_style(span10, "left", "100%");
    			set_style(span10, "margin-left", "-40px");
    			set_style(span10, "padding-right", "5px");
    			set_style(span10, "box-sizing", "border-box");
    			set_style(span10, "cursor", "pointer");
    			set_style(span10, "box-shadow", "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)");
    			add_location(span10, file$9, 519, 18, 17108);
    			set_style(div2, "width", "100%");
    			set_style(div2, "position", "relative");
    			add_location(div2, file$9, 511, 16, 16605);
    			set_style(div3, "margin-top", "20px");
    			attr_dev(div3, "class", "svelte-10ufo0x");
    			toggle_class(div3, "mainViewContentQuestion", true);
    			add_location(div3, file$9, 416, 14, 11179);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, span1);
    			append_dev(span1, svg0);
    			append_dev(svg0, style0);
    			append_dev(style0, t0);
    			append_dev(svg0, path0);
    			append_dev(span1, t1);
    			append_dev(span1, span0);
    			append_dev(span0, t2);
    			append_dev(span0, t3);
    			append_dev(span0, t4);
    			append_dev(span0, t5);
    			append_dev(div3, t6);
    			if_block0.m(div3, null);
    			append_dev(div3, t7);
    			mount_component(divider, div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, div0);
    			append_dev(div0, span2);
    			append_dev(div0, t10);
    			append_dev(div0, span3);
    			append_dev(span3, t11);
    			append_dev(span3, t12);
    			append_dev(span3, t13);
    			append_dev(span3, t14);
    			append_dev(span3, t15);
    			append_dev(div0, t16);
    			append_dev(div0, span4);
    			append_dev(span4, t17);
    			append_dev(span4, t18);
    			append_dev(span4, t19);
    			append_dev(span4, t20);
    			append_dev(span4, t21);
    			append_dev(span4, t22);
    			append_dev(div3, t23);
    			append_dev(div3, div1);
    			append_dev(div1, span5);
    			append_dev(div1, t25);
    			append_dev(div1, span6);
    			append_dev(span6, t26);
    			append_dev(div1, t27);
    			append_dev(div1, span7);
    			append_dev(span7, t28);
    			append_dev(div1, t29);
    			append_dev(div1, span8);
    			append_dev(span8, t30);
    			append_dev(div1, t31);
    			append_dev(div1, span9);
    			append_dev(span9, t32);
    			append_dev(div3, t33);
    			append_dev(div3, div2);
    			append_dev(div2, textarea);
    			set_input_value(textarea, /*text*/ ctx[7]);
    			append_dev(div2, t34);
    			append_dev(div2, span10);
    			append_dev(span10, svg1);
    			append_dev(svg1, style1);
    			append_dev(style1, t35);
    			append_dev(svg1, path1);
    			append_dev(div2, t36);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t37);
    			if (if_block2) if_block2.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[27]),
    					listen_dev(span10, "click", /*click_handler_10*/ ctx[28], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*questionsDataFilter, questionsIndex*/ 1536) && t3_value !== (t3_value = /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].quid.split('*').join('') + "")) set_data_dev(t3, t3_value);

    			if ((!current || dirty[0] & /*questionsDataFilter, questionsIndex*/ 1536) && t5_value !== (t5_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].category == 1
    			? 'Общее'
    			: /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].category == 2
    				? 'Карьера'
    				: /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].category == 3
    					? 'Личная жизнь'
    					: /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].category == 4
    						? 'Родственники'
    						: /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].category == 5
    							? 'Привычки и жизнь'
    							: /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].category == 6
    								? 'Психология'
    								: 'Общий совет') + "")) set_data_dev(t5, t5_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div3, t7);
    				}
    			}

    			const divider_changes = {};
    			if (dirty[0] & /*text*/ 128) divider_changes.text = "написать хинт для этого вопроса - " + /*text*/ ctx[7].length + " символов";
    			divider.$set(divider_changes);
    			if ((!current || dirty[0] & /*questionsDataFilter, questionsIndex*/ 1536) && t12_value !== (t12_value = /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.age[0] + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty[0] & /*questionsDataFilter, questionsIndex*/ 1536) && t14_value !== (t14_value = /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.age[1] + "")) set_data_dev(t14, t14_value);
    			if ((!current || dirty[0] & /*questionsDataFilter, questionsIndex*/ 1536) && t18_value !== (t18_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.gender[0] && "мужской") + "")) set_data_dev(t18, t18_value);
    			if ((!current || dirty[0] & /*questionsDataFilter, questionsIndex*/ 1536) && t20_value !== (t20_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.gender[0] && " и ") + "")) set_data_dev(t20, t20_value);
    			if ((!current || dirty[0] & /*questionsDataFilter, questionsIndex*/ 1536) && t22_value !== (t22_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.gender[1] && "женский") + "")) set_data_dev(t22, t22_value);

    			if ((!current || dirty[0] & /*questionsDataFilter, questionsIndex*/ 1536) && t26_value !== (t26_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.style[0] != ''
    			? 'рассудительно'
    			: '') + "")) set_data_dev(t26, t26_value);

    			if ((!current || dirty[0] & /*questionsDataFilter, questionsIndex*/ 1536) && t28_value !== (t28_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.style[1] != ''
    			? ' * эмоционально'
    			: '') + "")) set_data_dev(t28, t28_value);

    			if ((!current || dirty[0] & /*questionsDataFilter, questionsIndex*/ 1536) && t30_value !== (t30_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.style[2] != ''
    			? ' * радикально'
    			: '') + "")) set_data_dev(t30, t30_value);

    			if ((!current || dirty[0] & /*questionsDataFilter, questionsIndex*/ 1536) && t32_value !== (t32_value = (/*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].target.style[3] != ''
    			? ' * сдержанно'
    			: '') + "")) set_data_dev(t32, t32_value);

    			if (dirty[0] & /*text*/ 128) {
    				set_input_value(textarea, /*text*/ ctx[7]);
    			}

    			if (/*text*/ ctx[7].length >= 40) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_5$4(ctx);
    					if_block1.c();
    					if_block1.m(div2, t37);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*text*/ ctx[7].length < 40) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_4$8(ctx);
    					if_block2.c();
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(divider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(divider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_block0.d();
    			destroy_component(divider);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$8.name,
    		type: "if",
    		source: "(415:12) { #if filterCategory == 0 || questionsDataFilter[questionsIndex].category == filterCategory }",
    		ctx
    	});

    	return block;
    }

    // (479:16) { :else }
    function create_else_block$1(ctx) {
    	let span0;
    	let t0_value = /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].text + "";
    	let t0;
    	let t1;
    	let span1;

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = `${"Пожелания к характеристикам пользователей, которые могут дать ответ, отличаются от ваших. В стадии бета-тестирования вы можете видеть сам вопрос и пожелания по аудитории к нему"}`;
    			set_style(span0, "filter", "blur(3px)");
    			add_location(span0, file$9, 480, 18, 14241);
    			set_style(span1, "width", "100%");
    			set_style(span1, "display", "block");
    			set_style(span1, "color", "rgb(101, 101, 101)");
    			set_style(span1, "font-size", "15px");
    			set_style(span1, "opacity", "0.8");
    			set_style(span1, "margin-top", "8px");
    			add_location(span1, file$9, 481, 18, 14344);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			append_dev(span0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, span1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*questionsDataFilter, questionsIndex*/ 1536 && t0_value !== (t0_value = /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].text + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(479:16) { :else }",
    		ctx
    	});

    	return block;
    }

    // (465:16) { #if userAge >= questionsDataFilter[questionsIndex].target.age[0]                                       && userAge <= questionsDataFilter[questionsIndex].target.age[1]                    && (                                             ( questionsDataFilter[questionsIndex].target.gender[0] == true && userGender == 'male' ) ||                      ( questionsDataFilter[questionsIndex].target.gender[1] == true && userGender == 'female' )                                           )                                       }
    function create_if_block_6$3(ctx) {
    	let span;
    	let t_value = /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$9, 476, 18, 14133);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*questionsDataFilter, questionsIndex*/ 1536 && t_value !== (t_value = /*questionsDataFilter*/ ctx[9][/*questionsIndex*/ ctx[10]].text + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$3.name,
    		type: "if",
    		source: "(465:16) { #if userAge >= questionsDataFilter[questionsIndex].target.age[0]                                       && userAge <= questionsDataFilter[questionsIndex].target.age[1]                    && (                                             ( questionsDataFilter[questionsIndex].target.gender[0] == true && userGender == 'male' ) ||                      ( questionsDataFilter[questionsIndex].target.gender[1] == true && userGender == 'female' )                                           )                                       }",
    		ctx
    	});

    	return block;
    }

    // (554:18) { #if text.length >= 40 }
    function create_if_block_5$4(ctx) {
    	let span;
    	let svg;
    	let style;
    	let t;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t = text("svg { fill: #fdfcf9 }\r\n                        ");
    			path = svg_element("path");
    			add_location(style, file$9, 584, 24, 20248);
    			attr_dev(path, "d", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z");
    			add_location(path, file$9, 587, 24, 20364);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "33px");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			toggle_class(svg, "svg-ok", true);
    			add_location(svg, file$9, 578, 22, 19999);
    			set_style(span, "display", "flex");
    			set_style(span, "flex-direction", "row");
    			set_style(span, "align-items", "center");
    			set_style(span, "justify-content", "space-around");
    			set_style(span, "position", "absolute");
    			set_style(span, "width", "80px");
    			set_style(span, "height", "80px");
    			set_style(span, "border-radius", "40px");
    			set_style(span, "background-color", "#468DA4");
    			set_style(span, "top", "100%");
    			set_style(span, "margin-top", "-40px");
    			set_style(span, "left", "100%");
    			set_style(span, "margin-left", "-133px");
    			set_style(span, "padding-right", "0px");
    			set_style(span, "box-sizing", "border-box");
    			set_style(span, "cursor", "pointer");
    			set_style(span, "box-shadow", "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)");
    			attr_dev(span, "class", "svelte-10ufo0x");
    			toggle_class(span, "sendingData", /*sendData*/ ctx[8] ? true : false);
    			add_location(span, file$9, 555, 20, 18932);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, svg);
    			append_dev(svg, style);
    			append_dev(style, t);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*addHint*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sendData*/ 256) {
    				toggle_class(span, "sendingData", /*sendData*/ ctx[8] ? true : false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$4.name,
    		type: "if",
    		source: "(554:18) { #if text.length >= 40 }",
    		ctx
    	});

    	return block;
    }

    // (593:18) { #if text.length < 40 }
    function create_if_block_4$8(ctx) {
    	let span;
    	let svg;
    	let style;
    	let t;
    	let path;

    	const block = {
    		c: function create() {
    			span = element("span");
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t = text("svg { fill: #fdfcf9 }\r\n                        ");
    			path = svg_element("path");
    			add_location(style, file$9, 622, 24, 21978);
    			attr_dev(path, "d", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z");
    			add_location(path, file$9, 625, 24, 22094);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "33px");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			toggle_class(svg, "svg-ok", true);
    			add_location(svg, file$9, 616, 22, 21729);
    			set_style(span, "display", "flex");
    			set_style(span, "flex-direction", "row");
    			set_style(span, "align-items", "center");
    			set_style(span, "justify-content", "space-around");
    			set_style(span, "position", "absolute");
    			set_style(span, "width", "80px");
    			set_style(span, "height", "80px");
    			set_style(span, "border-radius", "40px");
    			set_style(span, "background-color", "#468DA4");
    			set_style(span, "top", "100%");
    			set_style(span, "margin-top", "-40px");
    			set_style(span, "left", "100%");
    			set_style(span, "margin-left", "-133px");
    			set_style(span, "padding-right", "0px");
    			set_style(span, "box-sizing", "border-box");
    			set_style(span, "cursor", "pointer");
    			set_style(span, "filter", "grayscale(1)");
    			set_style(span, "box-shadow", "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)");
    			add_location(span, file$9, 594, 20, 20726);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, svg);
    			append_dev(svg, style);
    			append_dev(style, t);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$8.name,
    		type: "if",
    		source: "(593:18) { #if text.length < 40 }",
    		ctx
    	});

    	return block;
    }

    // (639:8) { #if questionsDataFilter.length === 0 }
    function create_if_block_1$8(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "вопросов в данной категории не обнаружено";
    			set_style(span, "color", "gray");
    			set_style(span, "opacity", "0.8");
    			set_style(span, "margin-top", "26px");
    			set_style(span, "display", "block");
    			add_location(span, file$9, 640, 10, 22544);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(639:8) { #if questionsDataFilter.length === 0 }",
    		ctx
    	});

    	return block;
    }

    // (644:8) { #if questionsData.length === 0 }
    function create_if_block$8(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "вопросы не обнаружены в системе";
    			set_style(span, "color", "gray");
    			set_style(span, "opacity", "0.8");
    			set_style(span, "margin-top", "26px");
    			set_style(span, "display", "block");
    			add_location(span, file$9, 645, 10, 22744);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(644:8) { #if questionsData.length === 0 }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div8;
    	let div3;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let span0;
    	let t4;
    	let div0;
    	let span1;
    	let t6;
    	let div1;
    	let span2;
    	let t8;
    	let div2;
    	let span3;
    	let t10;
    	let div7;
    	let modal;
    	let updating_open;
    	let t11;
    	let div6;
    	let div5;
    	let h3;
    	let t13;
    	let div4;
    	let radiochipgroup;
    	let t14;
    	let svg;
    	let style;
    	let t15;
    	let path;
    	let t16;
    	let t17;
    	let t18;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*AUTH*/ ctx[2] == true && create_if_block_10$1(ctx);
    	let if_block1 = /*AUTH*/ ctx[2] == true && create_if_block_9$1(ctx);
    	let if_block2 = /*AUTH*/ ctx[2] == true && create_if_block_8$2(ctx);
    	let if_block3 = /*AUTH*/ ctx[2] == false && create_if_block_7$2(ctx);

    	function modal_open_binding(value) {
    		/*modal_open_binding*/ ctx[26](value);
    	}

    	let modal_props = {
    		$$slots: {
    			default: [
    				create_default_slot$3,
    				({ closeCallback }) => ({ 30: closeCallback }),
    				({ closeCallback }) => [closeCallback ? 1073741824 : 0]
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*showModal*/ ctx[4] !== void 0) {
    		modal_props.open = /*showModal*/ ctx[4];
    	}

    	modal = new Modal$1({ props: modal_props, $$inline: true });
    	binding_callbacks.push(() => bind(modal, 'open', modal_open_binding));

    	radiochipgroup = new RadioChipGroup({
    			props: {
    				items: /*categories*/ ctx[11],
    				name: "categories"
    			},
    			$$inline: true
    		});

    	radiochipgroup.$on("change", /*changeCategory*/ ctx[12]);
    	let if_block4 = /*questionsDataFilter*/ ctx[9].length > 0 && create_if_block_2$8(ctx);
    	let if_block5 = /*questionsDataFilter*/ ctx[9].length === 0 && create_if_block_1$8(ctx);
    	let if_block6 = /*questionsData*/ ctx[0].length === 0 && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div3 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			span0 = element("span");
    			t4 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "о сервисе";
    			t6 = space();
    			div1 = element("div");
    			span2 = element("span");
    			span2.textContent = "конфиденциальность";
    			t8 = space();
    			div2 = element("div");
    			span3 = element("span");
    			span3.textContent = "служба качества";
    			t10 = space();
    			div7 = element("div");
    			create_component(modal.$$.fragment);
    			t11 = space();
    			div6 = element("div");
    			div5 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Список всех вопросов в системе";
    			t13 = space();
    			div4 = element("div");
    			create_component(radiochipgroup.$$.fragment);
    			t14 = space();
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t15 = text("svg.resetCategory { \r\n                fill:#4300b0;\r\n                margin-top: 5px; \r\n                cursor: pointer;\r\n                display: none;\r\n              }\r\n            ");
    			path = svg_element("path");
    			t16 = space();
    			if (if_block4) if_block4.c();
    			t17 = space();
    			if (if_block5) if_block5.c();
    			t18 = space();
    			if (if_block6) if_block6.c();
    			set_style(span0, "display", "block");
    			set_style(span0, "position", "relative");
    			set_style(span0, "width", "80%");
    			set_style(span0, "height", "2px");
    			set_style(span0, "background-color", "gray");
    			set_style(span0, "opacity", "0.4");
    			set_style(span0, "border-radius", "1px");
    			set_style(span0, "margin-top", "20px");
    			add_location(span0, file$9, 279, 4, 7162);
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-10ufo0x");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$9, 292, 6, 7483);
    			set_style(div0, "margin-top", "18px");
    			toggle_class(div0, "mainViewMenuItem", true);
    			add_location(div0, file$9, 291, 4, 7414);
    			set_style(span2, "cursor", "pointer");
    			attr_dev(span2, "class", "svelte-10ufo0x");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$9, 303, 6, 7769);
    			set_style(div1, "margin-top", "11px");
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$9, 302, 4, 7700);
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-10ufo0x");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$9, 314, 6, 8065);
    			set_style(div2, "margin-top", "11px");
    			toggle_class(div2, "mainViewMenuItem", true);
    			add_location(div2, file$9, 313, 4, 7996);
    			set_style(div3, "width", "20%");
    			set_style(div3, "padding-top", "30px");
    			toggle_class(div3, "mainViewMenu", true);
    			add_location(div3, file$9, 153, 2, 3624);
    			attr_dev(h3, "class", "svelte-10ufo0x");
    			toggle_class(h3, "mainViewContentTitle", true);
    			add_location(h3, file$9, 382, 8, 9857);
    			add_location(style, file$9, 398, 12, 10418);
    			attr_dev(path, "d", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z");
    			add_location(path, file$9, 406, 12, 10646);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "24px");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			toggle_class(svg, "resetCategory", true);
    			add_location(svg, file$9, 392, 10, 10234);
    			set_style(div4, "display", "flex");
    			set_style(div4, "flex-direction", "row");
    			set_style(div4, "align-items", "center");
    			set_style(div4, "justify-content", "flex-start");
    			add_location(div4, file$9, 383, 8, 9940);
    			set_style(div5, "width", "calc(100% + 30px)");
    			set_style(div5, "overflow-y", "scroll");
    			set_style(div5, "padding-right", "30px");
    			set_style(div5, "box-sizing", "border-box");
    			set_style(div5, "height", "100%");
    			add_location(div5, file$9, 355, 6, 9253);
    			set_style(div6, "width", "100%");
    			set_style(div6, "height", "100%");
    			set_style(div6, "overflow", "hidden");
    			add_location(div6, file$9, 354, 4, 9187);
    			attr_dev(div7, "class", "svelte-10ufo0x");
    			toggle_class(div7, "mainViewContent", true);
    			add_location(div7, file$9, 325, 2, 8298);
    			attr_dev(div8, "class", "svelte-10ufo0x");
    			toggle_class(div8, "mainView", true);
    			add_location(div8, file$9, 152, 0, 3593);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div3);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div3, t0);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t1);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t2);
    			if (if_block3) if_block3.m(div3, null);
    			append_dev(div3, t3);
    			append_dev(div3, span0);
    			append_dev(div3, t4);
    			append_dev(div3, div0);
    			append_dev(div0, span1);
    			append_dev(div3, t6);
    			append_dev(div3, div1);
    			append_dev(div1, span2);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, span3);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			mount_component(modal, div7, null);
    			append_dev(div7, t11);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, h3);
    			append_dev(div5, t13);
    			append_dev(div5, div4);
    			mount_component(radiochipgroup, div4, null);
    			append_dev(div4, t14);
    			append_dev(div4, svg);
    			append_dev(svg, style);
    			append_dev(style, t15);
    			append_dev(svg, path);
    			append_dev(div5, t16);
    			if (if_block4) if_block4.m(div5, null);
    			append_dev(div5, t17);
    			if (if_block5) if_block5.m(div5, null);
    			append_dev(div5, t18);
    			if (if_block6) if_block6.m(div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*click_handler_7*/ ctx[22], false, false, false),
    					listen_dev(span2, "click", /*click_handler_8*/ ctx[23], false, false, false),
    					listen_dev(span3, "click", /*click_handler_9*/ ctx[24], false, false, false),
    					listen_dev(div5, "mousewheel", /*mousewheel_handler*/ ctx[29], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*AUTH*/ ctx[2] == true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_10$1(ctx);
    					if_block0.c();
    					if_block0.m(div3, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*AUTH*/ ctx[2] == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_9$1(ctx);
    					if_block1.c();
    					if_block1.m(div3, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*AUTH*/ ctx[2] == true) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_8$2(ctx);
    					if_block2.c();
    					if_block2.m(div3, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*AUTH*/ ctx[2] == false) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_7$2(ctx);
    					if_block3.c();
    					if_block3.m(div3, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			const modal_changes = {};

    			if (dirty[0] & /*closeCallback, hintRate*/ 1073741832 | dirty[1] & /*$$scope*/ 1) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_open && dirty[0] & /*showModal*/ 16) {
    				updating_open = true;
    				modal_changes.open = /*showModal*/ ctx[4];
    				add_flush_callback(() => updating_open = false);
    			}

    			modal.$set(modal_changes);

    			if (/*questionsDataFilter*/ ctx[9].length > 0) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty[0] & /*questionsDataFilter*/ 512) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_2$8(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div5, t17);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*questionsDataFilter*/ ctx[9].length === 0) {
    				if (if_block5) ; else {
    					if_block5 = create_if_block_1$8(ctx);
    					if_block5.c();
    					if_block5.m(div5, t18);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*questionsData*/ ctx[0].length === 0) {
    				if (if_block6) ; else {
    					if_block6 = create_if_block$8(ctx);
    					if_block6.c();
    					if_block6.m(div5, null);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			transition_in(radiochipgroup.$$.fragment, local);
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			transition_out(radiochipgroup.$$.fragment, local);
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			destroy_component(modal);
    			destroy_component(radiochipgroup);
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AllQuestions', slots, []);

    	let categories = [
    		// ----------------------------------------------------------------
    		{ value: '0', label: 'Все' },
    		// ----------------------------------------------------------------
    		{ value: '1', label: 'Общее' },
    		{ value: '2', label: 'Карьера' },
    		{ value: '3', label: 'Личная жизнь' },
    		{ value: '4', label: 'Родственники' },
    		{ value: '5', label: 'Привычки и жизнь' },
    		{ value: '6', label: 'Психология' }
    	];

    	let filterCategory = '0';
    	let hintRate = 1;
    	let showModal = false;
    	let userAge;
    	let userGender;
    	let AUTH = false;
    	let UID;
    	let text = '';
    	let sendData = false;
    	let { questionsData } = $$props;
    	let questionsDataFilter = questionsData;
    	let questionsIndex = 0;

    	const changeCategory = event => {
    		console.log(event.detail.value);
    		$$invalidate(1, filterCategory = event.detail.value);
    		$$invalidate(10, questionsIndex = 0);

    		if (event.detail.value != '0') {
    			$$invalidate(9, questionsDataFilter = questionsData.filter(item => item.category == filterCategory));
    		} else {
    			$$invalidate(9, questionsDataFilter = questionsData);
    		}
    	};

    	const addHint = async () => {
    		console.log(questionsData[questionsIndex].quid);

    		if (text.length >= 40) {
    			await fetch('http://localhost:3008/add-hint', {
    				method: 'POST',
    				headers: {
    					'Content-Type': 'application/json;charset=utf-8'
    				},
    				body: JSON.stringify({
    					uid: UID,
    					quid: questionsData[questionsIndex].quid,
    					text
    				})
    			}).then(res => res.json());

    			$$invalidate(8, sendData = true);

    			setTimeout(
    				async () => {
    					$$invalidate(8, sendData = false);
    					$$invalidate(7, text = '');

    					let updateMyQuestions = await fetch('http://localhost:3008/get-data', {
    						method: 'POST',
    						headers: {
    							'Content-Type': 'application/json;charset=utf-8'
    						},
    						body: JSON.stringify({})
    					}).then(res => res.json());

    					myQuestionsData.set(updateMyQuestions.data);
    					allQuestionsData.set(updateMyQuestions.data);
    					console.log(updateMyQuestions);
    				},
    				1000
    			);
    		} else {
    			$$invalidate(8, sendData = true);

    			setTimeout(
    				() => {
    					$$invalidate(8, sendData = false);
    				},
    				1000
    			);
    		}
    	};

    	onMount(() => {
    		console.log(userAge);
    	});

    	const writable_props = ['questionsData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<AllQuestions> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		pageRoute.set('my-questions');
    	};

    	const click_handler_1 = () => {
    		pageRoute.set('my-hints');
    	};

    	const click_handler_2 = () => {
    		pageRoute.set('main');
    	};

    	const click_handler_3 = () => {
    		pageRoute.set('list-questions');
    	};

    	const click_handler_4 = () => {
    		pageRoute.set('my-cabinet');
    	};

    	const click_handler_5 = () => {
    		pageRoute.set('unauth');
    	};

    	const click_handler_6 = () => {
    		pageRoute.set('unauth');
    	};

    	const click_handler_7 = () => {
    		pageRoute.set('about');
    	};

    	const click_handler_8 = () => {
    		pageRoute.set('polici');
    	};

    	const click_handler_9 = () => {
    		pageRoute.set('support');
    	};

    	function starrating_value_binding(value) {
    		hintRate = value;
    		$$invalidate(3, hintRate);
    	}

    	function modal_open_binding(value) {
    		showModal = value;
    		$$invalidate(4, showModal);
    	}

    	function textarea_input_handler() {
    		text = this.value;
    		$$invalidate(7, text);
    	}

    	const click_handler_10 = () => $$invalidate(7, text = '');

    	const mousewheel_handler = event => {
    		if (event.deltaY < 0) {
    			if (questionsIndex !== 0) {
    				$$invalidate(10, questionsIndex = questionsIndex - 1);
    			}
    		} else {
    			if (questionsIndex < questionsDataFilter.length - 1) {
    				$$invalidate(10, questionsIndex = questionsIndex + 1);
    			}
    		}
    	};

    	$$self.$$set = $$props => {
    		if ('questionsData' in $$props) $$invalidate(0, questionsData = $$props.questionsData);
    	};

    	$$self.$capture_state = () => ({
    		pageRoute,
    		authCheck,
    		myQuestionsData,
    		allQuestionsData,
    		Divider: Divider$1,
    		Modal: Modal$1,
    		Dialog: Dialog$1,
    		StarRating,
    		Button: Button$1,
    		RadioChipGroup,
    		onMount,
    		categories,
    		filterCategory,
    		hintRate,
    		showModal,
    		userAge,
    		userGender,
    		AUTH,
    		UID,
    		text,
    		sendData,
    		questionsData,
    		questionsDataFilter,
    		questionsIndex,
    		changeCategory,
    		addHint
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) $$invalidate(11, categories = $$props.categories);
    		if ('filterCategory' in $$props) $$invalidate(1, filterCategory = $$props.filterCategory);
    		if ('hintRate' in $$props) $$invalidate(3, hintRate = $$props.hintRate);
    		if ('showModal' in $$props) $$invalidate(4, showModal = $$props.showModal);
    		if ('userAge' in $$props) $$invalidate(5, userAge = $$props.userAge);
    		if ('userGender' in $$props) $$invalidate(6, userGender = $$props.userGender);
    		if ('AUTH' in $$props) $$invalidate(2, AUTH = $$props.AUTH);
    		if ('UID' in $$props) $$invalidate(14, UID = $$props.UID);
    		if ('text' in $$props) $$invalidate(7, text = $$props.text);
    		if ('sendData' in $$props) $$invalidate(8, sendData = $$props.sendData);
    		if ('questionsData' in $$props) $$invalidate(0, questionsData = $$props.questionsData);
    		if ('questionsDataFilter' in $$props) $$invalidate(9, questionsDataFilter = $$props.questionsDataFilter);
    		if ('questionsIndex' in $$props) $$invalidate(10, questionsIndex = $$props.questionsIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*filterCategory, questionsData, AUTH, UID*/ 16391) {
    			{
    				// ----------------------------------------------------------------
    				// ----------------------------------------------------------------
    				if (filterCategory != '0') {
    					$$invalidate(9, questionsDataFilter = questionsData.filter(item => item.category == filterCategory));
    				} else if (filterCategory == '0') {
    					$$invalidate(9, questionsDataFilter = questionsData);
    				}

    				// ----------------------------------------------------------------
    				// ----------------------------------------------------------------
    				authCheck.subscribe(value => {
    					$$invalidate(2, AUTH = value.auth);
    					$$invalidate(14, UID = value.userID);
    					$$invalidate(5, userAge = value.age);
    					$$invalidate(6, userGender = value.gender);
    				});

    				console.log(AUTH);
    				console.log(UID);
    			}
    		}
    	};

    	return [
    		questionsData,
    		filterCategory,
    		AUTH,
    		hintRate,
    		showModal,
    		userAge,
    		userGender,
    		text,
    		sendData,
    		questionsDataFilter,
    		questionsIndex,
    		categories,
    		changeCategory,
    		addHint,
    		UID,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		starrating_value_binding,
    		modal_open_binding,
    		textarea_input_handler,
    		click_handler_10,
    		mousewheel_handler
    	];
    }

    class AllQuestions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { questionsData: 0 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AllQuestions",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*questionsData*/ ctx[0] === undefined && !('questionsData' in props)) {
    			console_1$8.warn("<AllQuestions> was created without expected prop 'questionsData'");
    		}
    	}

    	get questionsData() {
    		throw new Error("<AllQuestions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set questionsData(value) {
    		throw new Error("<AllQuestions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\bricks\views\MyHints.svelte generated by Svelte v3.47.0 */

    const { console: console_1$7 } = globals;
    const file$8 = "src\\bricks\\views\\MyHints.svelte";

    // (33:4) { #if AUTH == true }
    function create_if_block_5$3(ctx) {
    	let div1;
    	let span0;
    	let t1;
    	let div0;
    	let span1;
    	let t3;
    	let span2;
    	let t5;
    	let span4;
    	let t6;
    	let span3;
    	let t7;
    	let span5;
    	let t9;
    	let span6;
    	let t11;
    	let span7;
    	let t13;
    	let span8;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "основное меню hint";
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "мои вопросы";
    			t3 = space();
    			span2 = element("span");
    			span2.textContent = "*";
    			t5 = space();
    			span4 = element("span");
    			t6 = text("мои хинты\r\n            ");
    			span3 = element("span");
    			t7 = space();
    			span5 = element("span");
    			span5.textContent = "*";
    			t9 = space();
    			span6 = element("span");
    			span6.textContent = "новый вопрос";
    			t11 = space();
    			span7 = element("span");
    			span7.textContent = "*";
    			t13 = space();
    			span8 = element("span");
    			span8.textContent = "список вопросов";
    			attr_dev(span0, "class", "svelte-1uzqah4");
    			toggle_class(span0, "mainViewMenuItemLine", true);
    			add_location(span0, file$8, 35, 8, 726);
    			set_style(span1, "margin-top", "11px");
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-1uzqah4");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$8, 37, 10, 896);
    			set_style(span2, "margin-top", "12px");
    			set_style(span2, "cursor", "pointer");
    			set_style(span2, "color", "#4300b0");
    			set_style(span2, "margin-left", "30px");
    			attr_dev(span2, "class", "svelte-1uzqah4");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$8, 46, 10, 1166);
    			set_style(span3, "display", "block");
    			set_style(span3, "position", "absolute");
    			set_style(span3, "width", "3px");
    			set_style(span3, "height", "20px");
    			set_style(span3, "background-color", "#4300b0");
    			set_style(span3, "top", "50%");
    			set_style(span3, "left", "0");
    			set_style(span3, "margin-top", "-10px");
    			set_style(span3, "margin-left", "-10px");
    			set_style(span3, "border-radius", "2px");
    			add_location(span3, file$8, 60, 12, 1615);
    			set_style(span4, "margin-top", "6px");
    			set_style(span4, "cursor", "pointer");
    			attr_dev(span4, "class", "svelte-1uzqah4");
    			toggle_class(span4, "mainViewMenuItemLine", true);
    			add_location(span4, file$8, 52, 10, 1369);
    			set_style(span5, "margin-top", "12px");
    			set_style(span5, "cursor", "pointer");
    			set_style(span5, "color", "#4300b0");
    			set_style(span5, "margin-left", "30px");
    			attr_dev(span5, "class", "svelte-1uzqah4");
    			toggle_class(span5, "mainViewMenuItemLine", true);
    			add_location(span5, file$8, 75, 10, 2044);
    			set_style(span6, "margin-top", "6px");
    			set_style(span6, "cursor", "pointer");
    			attr_dev(span6, "class", "svelte-1uzqah4");
    			toggle_class(span6, "mainViewMenuItemLine", true);
    			add_location(span6, file$8, 81, 10, 2247);
    			set_style(span7, "margin-top", "12px");
    			set_style(span7, "cursor", "pointer");
    			set_style(span7, "color", "#4300b0");
    			set_style(span7, "margin-left", "30px");
    			attr_dev(span7, "class", "svelte-1uzqah4");
    			toggle_class(span7, "mainViewMenuItemLine", true);
    			add_location(span7, file$8, 90, 10, 2509);
    			set_style(span8, "margin-top", "6px");
    			set_style(span8, "cursor", "pointer");
    			attr_dev(span8, "class", "svelte-1uzqah4");
    			toggle_class(span8, "mainViewMenuItemLine", true);
    			add_location(span8, file$8, 96, 10, 2712);
    			set_style(div0, "margin-top", "0px");
    			set_style(div0, "margin-bottom", "0px");
    			attr_dev(div0, "class", "svelte-1uzqah4");
    			toggle_class(div0, "mainViewMenuItemSub", true);
    			add_location(div0, file$8, 36, 8, 801);
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$8, 34, 6, 681);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span1);
    			append_dev(div0, t3);
    			append_dev(div0, span2);
    			append_dev(div0, t5);
    			append_dev(div0, span4);
    			append_dev(span4, t6);
    			append_dev(span4, span3);
    			append_dev(div0, t7);
    			append_dev(div0, span5);
    			append_dev(div0, t9);
    			append_dev(div0, span6);
    			append_dev(div0, t11);
    			append_dev(div0, span7);
    			append_dev(div0, t13);
    			append_dev(div0, span8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(span4, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(span6, "click", /*click_handler_2*/ ctx[8], false, false, false),
    					listen_dev(span8, "click", /*click_handler_3*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$3.name,
    		type: "if",
    		source: "(33:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (111:4) { #if AUTH == true }
    function create_if_block_4$7(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "мои характеристики";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-1uzqah4");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$8, 113, 8, 3130);
    			set_style(div, "margin-top", "11px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$8, 112, 6, 3059);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_4*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$7.name,
    		type: "if",
    		source: "(111:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (127:4) { #if AUTH == true }
    function create_if_block_3$7(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "главная страница";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-1uzqah4");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$8, 129, 8, 3496);
    			set_style(div, "margin-top", "6px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$8, 128, 6, 3426);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_5*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$7.name,
    		type: "if",
    		source: "(127:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (142:4) { #if AUTH == false }
    function create_if_block_2$7(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "войти в аккаунт";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-1uzqah4");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$8, 144, 8, 3855);
    			set_style(div, "margin-top", "6px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$8, 143, 6, 3785);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_6*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$7.name,
    		type: "if",
    		source: "(142:4) { #if AUTH == false }",
    		ctx
    	});

    	return block;
    }

    // (220:10) <Button               filled              style="                font-size: 15px;                padding: 13px 22px 16px;                margin-top: 22px;                margin-bottom: 28px;              "            >
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Подтвердить оценку");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(220:10) <Button               filled              style=\\\"                font-size: 15px;                padding: 13px 22px 16px;                margin-top: 22px;                margin-bottom: 28px;              \\\"            >",
    		ctx
    	});

    	return block;
    }

    // (207:6) <Dialog title="" {closeCallback}>
    function create_default_slot_1$2(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let starrating;
    	let updating_value;
    	let t2;
    	let button;
    	let current;

    	function starrating_value_binding(value) {
    		/*starrating_value_binding*/ ctx[16](value);
    	}

    	let starrating_props = { style: "margin: 0;", name: "default" };

    	if (/*hintRate*/ ctx[3] !== void 0) {
    		starrating_props.value = /*hintRate*/ ctx[3];
    	}

    	starrating = new StarRating({ props: starrating_props, $$inline: true });
    	binding_callbacks.push(() => bind(starrating, 'value', starrating_value_binding));

    	button = new Button$1({
    			props: {
    				filled: true,
    				style: "\r\n              font-size: 15px;\r\n              padding: 13px 22px 16px;\r\n              margin-top: 22px;\r\n              margin-bottom: 28px;\r\n            ",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Насколько этот хинт был полезным";
    			t1 = space();
    			create_component(starrating.$$.fragment);
    			t2 = space();
    			create_component(button.$$.fragment);
    			set_style(h3, "margin-top", "28px");
    			set_style(h3, "margin-bottom", "14px");
    			add_location(h3, file$8, 217, 10, 5653);
    			set_style(div, "width", "100%");
    			set_style(div, "display", "flex");
    			set_style(div, "flex-direction", "column");
    			set_style(div, "align-items", "center");
    			set_style(div, "justify-content", "flex-start");
    			set_style(div, "margin-top", "14px");
    			add_location(div, file$8, 207, 8, 5394);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			mount_component(starrating, div, null);
    			append_dev(div, t2);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const starrating_changes = {};

    			if (!updating_value && dirty & /*hintRate*/ 8) {
    				updating_value = true;
    				starrating_changes.value = /*hintRate*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			starrating.$set(starrating_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(starrating.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(starrating.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(starrating);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(207:6) <Dialog title=\\\"\\\" {closeCallback}>",
    		ctx
    	});

    	return block;
    }

    // (206:4) <Modal bind:open={showModal} let:closeCallback>
    function create_default_slot$2(ctx) {
    	let dialog;
    	let current;

    	dialog = new Dialog$1({
    			props: {
    				title: "",
    				closeCallback: /*closeCallback*/ ctx[20],
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dialog.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialog, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dialog_changes = {};
    			if (dirty & /*closeCallback*/ 1048576) dialog_changes.closeCallback = /*closeCallback*/ ctx[20];

    			if (dirty & /*$$scope, hintRate*/ 2097160) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			dialog.$set(dialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialog, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(206:4) <Modal bind:open={showModal} let:closeCallback>",
    		ctx
    	});

    	return block;
    }

    // (263:8) { #if questionsData.length > 0 }
    function create_if_block_1$7(ctx) {
    	let div1;
    	let span1;
    	let svg;
    	let style;
    	let t0;
    	let path;
    	let t1;
    	let span0;
    	let t2;
    	let t3_value = /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].quid.split('*').join('') + "";
    	let t3;
    	let t4;

    	let t5_value = (/*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].category == 1
    	? 'Общее'
    	: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].category == 2
    		? 'Карьера'
    		: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].category == 3
    			? 'Личная жизнь'
    			: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].category == 4
    				? 'Родственники'
    				: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].category == 5
    					? 'Привычки и жизнь'
    					: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].category == 6
    						? 'Психология'
    						: 'Общий совет') + "";

    	let t5;
    	let t6;
    	let span2;
    	let t7_value = /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].text + "";
    	let t7;
    	let t8;
    	let divider;
    	let t9;
    	let div0;
    	let span3;
    	let t10_value = /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].hints.filter(/*func*/ ctx[18])[0].hint + "";
    	let t10;
    	let t11;
    	let span4;
    	let current;

    	divider = new Divider$1({
    			props: {
    				style: "margin-top: 30px; margin-bottom: 40px;",
    				text: "мой хинт на данный вопрос"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span1 = element("span");
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t0 = text("svg.localSvg { fill: #4300b0; }\r\n                \r\n                ");
    			path = svg_element("path");
    			t1 = space();
    			span0 = element("span");
    			t2 = text("вопрос \r\n                ");
    			t3 = text(t3_value);
    			t4 = text(" | \r\n                ");
    			t5 = text(t5_value);
    			t6 = space();
    			span2 = element("span");
    			t7 = text(t7_value);
    			t8 = space();
    			create_component(divider.$$.fragment);
    			t9 = space();
    			div0 = element("div");
    			span3 = element("span");
    			t10 = text(t10_value);
    			t11 = space();
    			span4 = element("span");
    			span4.textContent = "* * *";
    			add_location(style, file$8, 285, 16, 7642);
    			attr_dev(path, "d", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z");
    			add_location(path, file$8, 290, 16, 7774);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "24px");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			toggle_class(svg, "localSvg", true);
    			add_location(svg, file$8, 279, 14, 7439);
    			set_style(span0, "margin-left", "11px");
    			add_location(span0, file$8, 294, 14, 8295);
    			set_style(span1, "color", "gray");
    			set_style(span1, "width", "100%");
    			set_style(span1, "display", "flex");
    			set_style(span1, "flex-direction", "row");
    			set_style(span1, "align-items", "center");
    			set_style(span1, "margin-bottom", "13px");
    			set_style(span1, "font-size", "13px");
    			set_style(span1, "letter-spacing", "1px");
    			set_style(span1, "font-weight", "500");
    			set_style(span1, "opacity", "0.6");
    			add_location(span1, file$8, 265, 12, 7014);
    			add_location(span2, file$8, 311, 12, 9106);
    			attr_dev(span3, "class", "svelte-1uzqah4");
    			toggle_class(span3, "mainViewContentHint", true);
    			add_location(span3, file$8, 315, 14, 9399);
    			set_style(span4, "cursor", "pointer");
    			set_style(span4, "color", "gray");
    			set_style(span4, "opacity", "0.6");
    			add_location(span4, file$8, 318, 14, 9581);
    			set_style(div0, "display", "flex");
    			set_style(div0, "flex-direction", "column");
    			set_style(div0, "align-items", "center");
    			set_style(div0, "margin-bottom", "8px");
    			add_location(div0, file$8, 314, 12, 9290);
    			set_style(div1, "margin-top", "20px");
    			attr_dev(div1, "class", "svelte-1uzqah4");
    			toggle_class(div1, "mainViewContentQuestion", true);
    			add_location(div1, file$8, 264, 10, 6932);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span1);
    			append_dev(span1, svg);
    			append_dev(svg, style);
    			append_dev(style, t0);
    			append_dev(svg, path);
    			append_dev(span1, t1);
    			append_dev(span1, span0);
    			append_dev(span0, t2);
    			append_dev(span0, t3);
    			append_dev(span0, t4);
    			append_dev(span0, t5);
    			append_dev(div1, t6);
    			append_dev(div1, span2);
    			append_dev(span2, t7);
    			append_dev(div1, t8);
    			mount_component(divider, div1, null);
    			append_dev(div1, t9);
    			append_dev(div1, div0);
    			append_dev(div0, span3);
    			append_dev(span3, t10);
    			append_dev(div0, t11);
    			append_dev(div0, span4);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*questionsData, questionsIndex*/ 33) && t3_value !== (t3_value = /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].quid.split('*').join('') + "")) set_data_dev(t3, t3_value);

    			if ((!current || dirty & /*questionsData, questionsIndex*/ 33) && t5_value !== (t5_value = (/*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].category == 1
    			? 'Общее'
    			: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].category == 2
    				? 'Карьера'
    				: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].category == 3
    					? 'Личная жизнь'
    					: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].category == 4
    						? 'Родственники'
    						: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].category == 5
    							? 'Привычки и жизнь'
    							: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].category == 6
    								? 'Психология'
    								: 'Общий совет') + "")) set_data_dev(t5, t5_value);

    			if ((!current || dirty & /*questionsData, questionsIndex*/ 33) && t7_value !== (t7_value = /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].text + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty & /*questionsData, questionsIndex, UID*/ 37) && t10_value !== (t10_value = /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[5]].hints.filter(/*func*/ ctx[18])[0].hint + "")) set_data_dev(t10, t10_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(divider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(divider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(divider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(263:8) { #if questionsData.length > 0 }",
    		ctx
    	});

    	return block;
    }

    // (325:8) { #if questionsData.length === 0 }
    function create_if_block$7(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "вы пока не дали ни одного ответа";
    			set_style(span, "color", "gray");
    			set_style(span, "opacity", "0.8");
    			set_style(span, "margin-top", "26px");
    			set_style(span, "display", "block");
    			add_location(span, file$8, 326, 10, 9768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(325:8) { #if questionsData.length === 0 }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div7;
    	let div3;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let span0;
    	let t4;
    	let div0;
    	let span1;
    	let t6;
    	let div1;
    	let span2;
    	let t8;
    	let div2;
    	let span3;
    	let t10;
    	let div6;
    	let modal;
    	let updating_open;
    	let t11;
    	let div5;
    	let div4;
    	let h3;
    	let t13;
    	let t14;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*AUTH*/ ctx[1] == true && create_if_block_5$3(ctx);
    	let if_block1 = /*AUTH*/ ctx[1] == true && create_if_block_4$7(ctx);
    	let if_block2 = /*AUTH*/ ctx[1] == true && create_if_block_3$7(ctx);
    	let if_block3 = /*AUTH*/ ctx[1] == false && create_if_block_2$7(ctx);

    	function modal_open_binding(value) {
    		/*modal_open_binding*/ ctx[17](value);
    	}

    	let modal_props = {
    		$$slots: {
    			default: [
    				create_default_slot$2,
    				({ closeCallback }) => ({ 20: closeCallback }),
    				({ closeCallback }) => closeCallback ? 1048576 : 0
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*showModal*/ ctx[4] !== void 0) {
    		modal_props.open = /*showModal*/ ctx[4];
    	}

    	modal = new Modal$1({ props: modal_props, $$inline: true });
    	binding_callbacks.push(() => bind(modal, 'open', modal_open_binding));
    	let if_block4 = /*questionsData*/ ctx[0].length > 0 && create_if_block_1$7(ctx);
    	let if_block5 = /*questionsData*/ ctx[0].length === 0 && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div3 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			span0 = element("span");
    			t4 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "о сервисе";
    			t6 = space();
    			div1 = element("div");
    			span2 = element("span");
    			span2.textContent = "конфиденциальность";
    			t8 = space();
    			div2 = element("div");
    			span3 = element("span");
    			span3.textContent = "служба качества";
    			t10 = space();
    			div6 = element("div");
    			create_component(modal.$$.fragment);
    			t11 = space();
    			div5 = element("div");
    			div4 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Мои ответы для пользователей";
    			t13 = space();
    			if (if_block4) if_block4.c();
    			t14 = space();
    			if (if_block5) if_block5.c();
    			set_style(span0, "display", "block");
    			set_style(span0, "position", "relative");
    			set_style(span0, "width", "80%");
    			set_style(span0, "height", "2px");
    			set_style(span0, "background-color", "gray");
    			set_style(span0, "opacity", "0.4");
    			set_style(span0, "border-radius", "1px");
    			set_style(span0, "margin-top", "20px");
    			add_location(span0, file$8, 157, 4, 4114);
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-1uzqah4");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$8, 170, 6, 4435);
    			set_style(div0, "margin-top", "18px");
    			toggle_class(div0, "mainViewMenuItem", true);
    			add_location(div0, file$8, 169, 4, 4366);
    			set_style(span2, "cursor", "pointer");
    			attr_dev(span2, "class", "svelte-1uzqah4");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$8, 181, 6, 4721);
    			set_style(div1, "margin-top", "11px");
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$8, 180, 4, 4652);
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-1uzqah4");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$8, 192, 6, 5017);
    			set_style(div2, "margin-top", "11px");
    			toggle_class(div2, "mainViewMenuItem", true);
    			add_location(div2, file$8, 191, 4, 4948);
    			set_style(div3, "width", "20%");
    			set_style(div3, "padding-top", "30px");
    			toggle_class(div3, "mainViewMenu", true);
    			add_location(div3, file$8, 30, 2, 573);
    			attr_dev(h3, "class", "svelte-1uzqah4");
    			toggle_class(h3, "mainViewContentTitle", true);
    			add_location(h3, file$8, 260, 8, 6803);
    			set_style(div4, "width", "calc(100% + 30px)");
    			set_style(div4, "overflow-y", "scroll");
    			set_style(div4, "padding-right", "30px");
    			set_style(div4, "box-sizing", "border-box");
    			set_style(div4, "height", "100%");
    			add_location(div4, file$8, 233, 6, 6205);
    			set_style(div5, "width", "100%");
    			set_style(div5, "height", "100%");
    			set_style(div5, "overflow", "hidden");
    			add_location(div5, file$8, 232, 4, 6139);
    			attr_dev(div6, "class", "svelte-1uzqah4");
    			toggle_class(div6, "mainViewContent", true);
    			add_location(div6, file$8, 203, 2, 5250);
    			attr_dev(div7, "class", "svelte-1uzqah4");
    			toggle_class(div7, "mainView", true);
    			add_location(div7, file$8, 29, 0, 542);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div3);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div3, t0);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t1);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t2);
    			if (if_block3) if_block3.m(div3, null);
    			append_dev(div3, t3);
    			append_dev(div3, span0);
    			append_dev(div3, t4);
    			append_dev(div3, div0);
    			append_dev(div0, span1);
    			append_dev(div3, t6);
    			append_dev(div3, div1);
    			append_dev(div1, span2);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, span3);
    			append_dev(div7, t10);
    			append_dev(div7, div6);
    			mount_component(modal, div6, null);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, h3);
    			append_dev(div4, t13);
    			if (if_block4) if_block4.m(div4, null);
    			append_dev(div4, t14);
    			if (if_block5) if_block5.m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*click_handler_7*/ ctx[13], false, false, false),
    					listen_dev(span2, "click", /*click_handler_8*/ ctx[14], false, false, false),
    					listen_dev(span3, "click", /*click_handler_9*/ ctx[15], false, false, false),
    					listen_dev(div4, "mousewheel", /*mousewheel_handler*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*AUTH*/ ctx[1] == true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5$3(ctx);
    					if_block0.c();
    					if_block0.m(div3, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*AUTH*/ ctx[1] == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4$7(ctx);
    					if_block1.c();
    					if_block1.m(div3, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*AUTH*/ ctx[1] == true) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3$7(ctx);
    					if_block2.c();
    					if_block2.m(div3, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*AUTH*/ ctx[1] == false) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_2$7(ctx);
    					if_block3.c();
    					if_block3.m(div3, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			const modal_changes = {};

    			if (dirty & /*$$scope, closeCallback, hintRate*/ 3145736) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_open && dirty & /*showModal*/ 16) {
    				updating_open = true;
    				modal_changes.open = /*showModal*/ ctx[4];
    				add_flush_callback(() => updating_open = false);
    			}

    			modal.$set(modal_changes);

    			if (/*questionsData*/ ctx[0].length > 0) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty & /*questionsData*/ 1) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_1$7(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div4, t14);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*questionsData*/ ctx[0].length === 0) {
    				if (if_block5) ; else {
    					if_block5 = create_if_block$7(ctx);
    					if_block5.c();
    					if_block5.m(div4, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			destroy_component(modal);
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyHints', slots, []);
    	let hintRate = 1;
    	let showModal = false;
    	let AUTH = false;
    	let UID;
    	let { questionsData } = $$props;
    	let questionsIndex = 0;
    	const writable_props = ['questionsData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<MyHints> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		pageRoute.set('my-questions');
    	};

    	const click_handler_1 = () => {
    		pageRoute.set('my-hints');
    	};

    	const click_handler_2 = () => {
    		pageRoute.set('main');
    	};

    	const click_handler_3 = () => {
    		pageRoute.set('list-questions');
    	};

    	const click_handler_4 = () => {
    		pageRoute.set('my-cabinet');
    	};

    	const click_handler_5 = () => {
    		pageRoute.set('unauth');
    	};

    	const click_handler_6 = () => {
    		pageRoute.set('unauth');
    	};

    	const click_handler_7 = () => {
    		pageRoute.set('about');
    	};

    	const click_handler_8 = () => {
    		pageRoute.set('polici');
    	};

    	const click_handler_9 = () => {
    		pageRoute.set('support');
    	};

    	function starrating_value_binding(value) {
    		hintRate = value;
    		$$invalidate(3, hintRate);
    	}

    	function modal_open_binding(value) {
    		showModal = value;
    		$$invalidate(4, showModal);
    	}

    	const func = hintOne => hintOne.uid === UID;

    	const mousewheel_handler = event => {
    		if (event.deltaY < 0) {
    			if (questionsIndex !== 0) {
    				$$invalidate(5, questionsIndex = questionsIndex - 1);
    			}
    		} else {
    			if (questionsIndex < questionsData.length - 1) {
    				$$invalidate(5, questionsIndex = questionsIndex + 1);
    			}
    		}
    	};

    	$$self.$$set = $$props => {
    		if ('questionsData' in $$props) $$invalidate(0, questionsData = $$props.questionsData);
    	};

    	$$self.$capture_state = () => ({
    		pageRoute,
    		authCheck,
    		Divider: Divider$1,
    		Modal: Modal$1,
    		Dialog: Dialog$1,
    		StarRating,
    		Button: Button$1,
    		hintRate,
    		showModal,
    		AUTH,
    		UID,
    		questionsData,
    		questionsIndex
    	});

    	$$self.$inject_state = $$props => {
    		if ('hintRate' in $$props) $$invalidate(3, hintRate = $$props.hintRate);
    		if ('showModal' in $$props) $$invalidate(4, showModal = $$props.showModal);
    		if ('AUTH' in $$props) $$invalidate(1, AUTH = $$props.AUTH);
    		if ('UID' in $$props) $$invalidate(2, UID = $$props.UID);
    		if ('questionsData' in $$props) $$invalidate(0, questionsData = $$props.questionsData);
    		if ('questionsIndex' in $$props) $$invalidate(5, questionsIndex = $$props.questionsIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*AUTH, UID*/ 6) {
    			{
    				authCheck.subscribe(value => {
    					$$invalidate(1, AUTH = value.auth);
    					$$invalidate(2, UID = value.userID);
    				});

    				console.log(AUTH);
    				console.log(UID);
    			}
    		}
    	};

    	return [
    		questionsData,
    		AUTH,
    		UID,
    		hintRate,
    		showModal,
    		questionsIndex,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		starrating_value_binding,
    		modal_open_binding,
    		func,
    		mousewheel_handler
    	];
    }

    class MyHints extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { questionsData: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyHints",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*questionsData*/ ctx[0] === undefined && !('questionsData' in props)) {
    			console_1$7.warn("<MyHints> was created without expected prop 'questionsData'");
    		}
    	}

    	get questionsData() {
    		throw new Error("<MyHints>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set questionsData(value) {
    		throw new Error("<MyHints>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\bricks\views\MyQuestions.svelte generated by Svelte v3.47.0 */

    const { console: console_1$6 } = globals;
    const file$7 = "src\\bricks\\views\\MyQuestions.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    // (58:4) { #if AUTH == true }
    function create_if_block_6$2(ctx) {
    	let div1;
    	let span0;
    	let t1;
    	let div0;
    	let span2;
    	let t2;
    	let span1;
    	let t3;
    	let span3;
    	let t5;
    	let span4;
    	let t7;
    	let span5;
    	let t9;
    	let span6;
    	let t11;
    	let span7;
    	let t13;
    	let span8;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "основное меню hint";
    			t1 = space();
    			div0 = element("div");
    			span2 = element("span");
    			t2 = text("мои вопросы\r\n            ");
    			span1 = element("span");
    			t3 = space();
    			span3 = element("span");
    			span3.textContent = "*";
    			t5 = space();
    			span4 = element("span");
    			span4.textContent = "мои хинты";
    			t7 = space();
    			span5 = element("span");
    			span5.textContent = "*";
    			t9 = space();
    			span6 = element("span");
    			span6.textContent = "новый вопрос";
    			t11 = space();
    			span7 = element("span");
    			span7.textContent = "*";
    			t13 = space();
    			span8 = element("span");
    			span8.textContent = "список вопросов";
    			attr_dev(span0, "class", "svelte-1uzqah4");
    			toggle_class(span0, "mainViewMenuItemLine", true);
    			add_location(span0, file$7, 60, 8, 1241);
    			set_style(span1, "display", "block");
    			set_style(span1, "position", "absolute");
    			set_style(span1, "width", "3px");
    			set_style(span1, "height", "20px");
    			set_style(span1, "background-color", "#4300b0");
    			set_style(span1, "top", "50%");
    			set_style(span1, "left", "0");
    			set_style(span1, "margin-top", "-10px");
    			set_style(span1, "margin-left", "-10px");
    			set_style(span1, "border-radius", "2px");
    			add_location(span1, file$7, 70, 12, 1664);
    			set_style(span2, "margin-top", "11px");
    			set_style(span2, "cursor", "pointer");
    			attr_dev(span2, "class", "svelte-1uzqah4");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$7, 62, 10, 1411);
    			set_style(span3, "margin-top", "12px");
    			set_style(span3, "cursor", "pointer");
    			set_style(span3, "color", "#4300b0");
    			set_style(span3, "margin-left", "30px");
    			attr_dev(span3, "class", "svelte-1uzqah4");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$7, 85, 10, 2093);
    			set_style(span4, "margin-top", "6px");
    			set_style(span4, "cursor", "pointer");
    			attr_dev(span4, "class", "svelte-1uzqah4");
    			toggle_class(span4, "mainViewMenuItemLine", true);
    			add_location(span4, file$7, 91, 10, 2296);
    			set_style(span5, "margin-top", "12px");
    			set_style(span5, "cursor", "pointer");
    			set_style(span5, "color", "#4300b0");
    			set_style(span5, "margin-left", "30px");
    			attr_dev(span5, "class", "svelte-1uzqah4");
    			toggle_class(span5, "mainViewMenuItemLine", true);
    			add_location(span5, file$7, 100, 10, 2559);
    			set_style(span6, "margin-top", "6px");
    			set_style(span6, "cursor", "pointer");
    			attr_dev(span6, "class", "svelte-1uzqah4");
    			toggle_class(span6, "mainViewMenuItemLine", true);
    			add_location(span6, file$7, 106, 10, 2762);
    			set_style(span7, "margin-top", "12px");
    			set_style(span7, "cursor", "pointer");
    			set_style(span7, "color", "#4300b0");
    			set_style(span7, "margin-left", "30px");
    			attr_dev(span7, "class", "svelte-1uzqah4");
    			toggle_class(span7, "mainViewMenuItemLine", true);
    			add_location(span7, file$7, 115, 10, 3024);
    			set_style(span8, "margin-top", "6px");
    			set_style(span8, "cursor", "pointer");
    			attr_dev(span8, "class", "svelte-1uzqah4");
    			toggle_class(span8, "mainViewMenuItemLine", true);
    			add_location(span8, file$7, 121, 10, 3227);
    			set_style(div0, "margin-top", "0px");
    			set_style(div0, "margin-bottom", "0px");
    			attr_dev(div0, "class", "svelte-1uzqah4");
    			toggle_class(div0, "mainViewMenuItemSub", true);
    			add_location(div0, file$7, 61, 8, 1316);
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$7, 59, 6, 1196);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span2);
    			append_dev(span2, t2);
    			append_dev(span2, span1);
    			append_dev(div0, t3);
    			append_dev(div0, span3);
    			append_dev(div0, t5);
    			append_dev(div0, span4);
    			append_dev(div0, t7);
    			append_dev(div0, span5);
    			append_dev(div0, t9);
    			append_dev(div0, span6);
    			append_dev(div0, t11);
    			append_dev(div0, span7);
    			append_dev(div0, t13);
    			append_dev(div0, span8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span2, "click", /*click_handler*/ ctx[8], false, false, false),
    					listen_dev(span4, "click", /*click_handler_1*/ ctx[9], false, false, false),
    					listen_dev(span6, "click", /*click_handler_2*/ ctx[10], false, false, false),
    					listen_dev(span8, "click", /*click_handler_3*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(58:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (136:4) { #if AUTH == true }
    function create_if_block_5$2(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "мои характеристики";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-1uzqah4");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$7, 138, 8, 3644);
    			set_style(div, "margin-top", "11px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$7, 137, 6, 3573);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_4*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(136:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (152:4) { #if AUTH == true }
    function create_if_block_4$6(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "главная страница";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-1uzqah4");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$7, 154, 8, 4010);
    			set_style(div, "margin-top", "6px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$7, 153, 6, 3940);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_5*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$6.name,
    		type: "if",
    		source: "(152:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (167:4) { #if AUTH == false }
    function create_if_block_3$6(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "войти в аккаунт";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-1uzqah4");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$7, 169, 8, 4369);
    			set_style(div, "margin-top", "6px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$7, 168, 6, 4299);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_6*/ ctx[14], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$6.name,
    		type: "if",
    		source: "(167:4) { #if AUTH == false }",
    		ctx
    	});

    	return block;
    }

    // (245:10) <Button               on:click={sendRateItem}              filled              style="                font-size: 15px;                padding: 13px 22px 16px;                margin-top: 28px;                margin-bottom: 20px;              "            >
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Поставить оценку хинту");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(245:10) <Button               on:click={sendRateItem}              filled              style=\\\"                font-size: 15px;                padding: 13px 22px 16px;                margin-top: 28px;                margin-bottom: 20px;              \\\"            >",
    		ctx
    	});

    	return block;
    }

    // (232:6) <Dialog title="" {closeCallback}>
    function create_default_slot_1$1(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let starrating;
    	let updating_value;
    	let t2;
    	let button;
    	let t3;
    	let span;
    	let current;

    	function starrating_value_binding(value) {
    		/*starrating_value_binding*/ ctx[18](value);
    	}

    	let starrating_props = { name: "default" };

    	if (/*hintRate*/ ctx[2] !== void 0) {
    		starrating_props.value = /*hintRate*/ ctx[2];
    	}

    	starrating = new StarRating({ props: starrating_props, $$inline: true });
    	binding_callbacks.push(() => bind(starrating, 'value', starrating_value_binding));

    	button = new Button$1({
    			props: {
    				filled: true,
    				style: "\r\n              font-size: 15px;\r\n              padding: 13px 22px 16px;\r\n              margin-top: 28px;\r\n              margin-bottom: 20px;\r\n            ",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*sendRateItem*/ ctx[7]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Насколько этот хинт был полезным";
    			t1 = space();
    			create_component(starrating.$$.fragment);
    			t2 = space();
    			create_component(button.$$.fragment);
    			t3 = space();
    			span = element("span");
    			span.textContent = "Пожаловаться на этот хинт";
    			set_style(h3, "margin-top", "28px");
    			set_style(h3, "margin-bottom", "20px");
    			add_location(h3, file$7, 242, 10, 6171);
    			set_style(span, "color", "gray");
    			set_style(span, "opacity", "0.6");
    			set_style(span, "margin-bottom", "28px");
    			set_style(span, "cursor", "pointer");
    			add_location(span, file$7, 254, 10, 6632);
    			set_style(div, "width", "100%");
    			set_style(div, "display", "flex");
    			set_style(div, "flex-direction", "column");
    			set_style(div, "align-items", "center");
    			set_style(div, "justify-content", "flex-start");
    			set_style(div, "margin-top", "14px");
    			add_location(div, file$7, 232, 8, 5912);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			mount_component(starrating, div, null);
    			append_dev(div, t2);
    			mount_component(button, div, null);
    			append_dev(div, t3);
    			append_dev(div, span);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const starrating_changes = {};

    			if (!updating_value && dirty & /*hintRate*/ 4) {
    				updating_value = true;
    				starrating_changes.value = /*hintRate*/ ctx[2];
    				add_flush_callback(() => updating_value = false);
    			}

    			starrating.$set(starrating_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 134217728) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(starrating.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(starrating.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(starrating);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(232:6) <Dialog title=\\\"\\\" {closeCallback}>",
    		ctx
    	});

    	return block;
    }

    // (231:4) <Modal bind:open={showModal} let:closeCallback>
    function create_default_slot$1(ctx) {
    	let dialog;
    	let current;

    	dialog = new Dialog$1({
    			props: {
    				title: "",
    				closeCallback: /*closeCallback*/ ctx[26],
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dialog.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialog, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dialog_changes = {};
    			if (dirty & /*closeCallback*/ 67108864) dialog_changes.closeCallback = /*closeCallback*/ ctx[26];

    			if (dirty & /*$$scope, hintRate*/ 134217732) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			dialog.$set(dialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialog, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(231:4) <Modal bind:open={showModal} let:closeCallback>",
    		ctx
    	});

    	return block;
    }

    // (300:8) { #if questionsData.length > 0 }
    function create_if_block_1$6(ctx) {
    	let div;
    	let span1;
    	let svg;
    	let style;
    	let t0;
    	let path;
    	let t1;
    	let span0;
    	let t2;
    	let t3_value = /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].quid.split('*').join('') + "";
    	let t3;
    	let t4;

    	let t5_value = (/*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].category == 1
    	? 'Общее'
    	: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].category == 2
    		? 'Карьера'
    		: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].category == 3
    			? 'Личная жизнь'
    			: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].category == 4
    				? 'Родственники'
    				: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].category == 5
    					? 'Привычки и жизнь'
    					: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].category == 6
    						? 'Психология'
    						: 'Общий совет') + "";

    	let t5;
    	let t6;
    	let span2;
    	let t7_value = /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].text + "";
    	let t7;
    	let t8;
    	let divider;
    	let t9;
    	let t10;
    	let current;

    	divider = new Divider$1({
    			props: {
    				style: "margin-top: 30px; margin-bottom: 40px;",
    				text: "хинты на данный вопрос"
    			},
    			$$inline: true
    		});

    	let if_block = /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].hints.length === 0 && create_if_block_2$6(ctx);
    	let each_value = /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].hints;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span1 = element("span");
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t0 = text("svg.localSvg { fill: #4300b0; }\r\n                \r\n                ");
    			path = svg_element("path");
    			t1 = space();
    			span0 = element("span");
    			t2 = text("вопрос \r\n                ");
    			t3 = text(t3_value);
    			t4 = text(" | \r\n                ");
    			t5 = text(t5_value);
    			t6 = space();
    			span2 = element("span");
    			t7 = text(t7_value);
    			t8 = space();
    			create_component(divider.$$.fragment);
    			t9 = space();
    			if (if_block) if_block.c();
    			t10 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(style, file$7, 322, 16, 8429);
    			attr_dev(path, "d", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z");
    			add_location(path, file$7, 327, 16, 8561);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "24px");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			toggle_class(svg, "localSvg", true);
    			add_location(svg, file$7, 316, 14, 8226);
    			set_style(span0, "margin-left", "11px");
    			add_location(span0, file$7, 331, 14, 9082);
    			set_style(span1, "color", "gray");
    			set_style(span1, "width", "100%");
    			set_style(span1, "display", "flex");
    			set_style(span1, "flex-direction", "row");
    			set_style(span1, "align-items", "center");
    			set_style(span1, "margin-bottom", "13px");
    			set_style(span1, "font-size", "13px");
    			set_style(span1, "letter-spacing", "1px");
    			set_style(span1, "font-weight", "500");
    			set_style(span1, "opacity", "0.6");
    			add_location(span1, file$7, 302, 12, 7801);
    			add_location(span2, file$7, 349, 12, 9911);
    			set_style(div, "margin-top", "20px");
    			attr_dev(div, "class", "svelte-1uzqah4");
    			toggle_class(div, "mainViewContentQuestion", true);
    			add_location(div, file$7, 301, 10, 7719);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span1);
    			append_dev(span1, svg);
    			append_dev(svg, style);
    			append_dev(style, t0);
    			append_dev(svg, path);
    			append_dev(span1, t1);
    			append_dev(span1, span0);
    			append_dev(span0, t2);
    			append_dev(span0, t3);
    			append_dev(span0, t4);
    			append_dev(span0, t5);
    			append_dev(div, t6);
    			append_dev(div, span2);
    			append_dev(span2, t7);
    			append_dev(div, t8);
    			mount_component(divider, div, null);
    			append_dev(div, t9);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*questionsData, questionsIndex*/ 65) && t3_value !== (t3_value = /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].quid.split('*').join('') + "")) set_data_dev(t3, t3_value);

    			if ((!current || dirty & /*questionsData, questionsIndex*/ 65) && t5_value !== (t5_value = (/*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].category == 1
    			? 'Общее'
    			: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].category == 2
    				? 'Карьера'
    				: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].category == 3
    					? 'Личная жизнь'
    					: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].category == 4
    						? 'Родственники'
    						: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].category == 5
    							? 'Привычки и жизнь'
    							: /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].category == 6
    								? 'Психология'
    								: 'Общий совет') + "")) set_data_dev(t5, t5_value);

    			if ((!current || dirty & /*questionsData, questionsIndex*/ 65) && t7_value !== (t7_value = /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].text + "")) set_data_dev(t7, t7_value);

    			if (/*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].hints.length === 0) {
    				if (if_block) ; else {
    					if_block = create_if_block_2$6(ctx);
    					if_block.c();
    					if_block.m(div, t10);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*showModal, hintUID, questionsData, questionsIndex, hintText*/ 121) {
    				each_value = /*questionsData*/ ctx[0][/*questionsIndex*/ ctx[6]].hints;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(divider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(divider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(divider);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(300:8) { #if questionsData.length > 0 }",
    		ctx
    	});

    	return block;
    }

    // (354:12) { #if questionsData[questionsIndex].hints.length === 0 }
    function create_if_block_2$6(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "На ваш вопрос пока не было хинтов";
    			set_style(span, "width", "100%");
    			set_style(span, "text-align", "center");
    			set_style(span, "display", "block");
    			set_style(span, "margin-bottom", "15px");
    			add_location(span, file$7, 355, 14, 10168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(354:12) { #if questionsData[questionsIndex].hints.length === 0 }",
    		ctx
    	});

    	return block;
    }

    // (369:12) { #each questionsData[questionsIndex].hints as hint }
    function create_each_block(ctx) {
    	let div2;
    	let span0;
    	let t0_value = /*hint*/ ctx[23].hint + "";
    	let t0;
    	let t1;
    	let div0;
    	let span1;
    	let t3;
    	let svg;
    	let style;
    	let t4;
    	let path;
    	let t5;
    	let div1;
    	let span2;
    	let t7;
    	let mounted;
    	let dispose;

    	function click_handler_10() {
    		return /*click_handler_10*/ ctx[20](/*hint*/ ctx[23]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "Оценить этот хинт";
    			t3 = space();
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t4 = text("svg.svgLike { fill: #4300b0; opacity: 0.6; margin-top: -5px; cursor: pointer; }");
    			path = svg_element("path");
    			t5 = space();
    			div1 = element("div");
    			span2 = element("span");
    			span2.textContent = "На данном этапе вы можете многократно оценивать каждый хинт - оценки в таком случае не будут суммироваться, а просто произойдет перезапись для каждого хинта";
    			t7 = space();
    			attr_dev(span0, "class", "svelte-1uzqah4");
    			toggle_class(span0, "mainViewContentHint", true);
    			add_location(span0, file$7, 371, 16, 10692);
    			set_style(span1, "cursor", "pointer");
    			set_style(span1, "margin-right", "10px");
    			add_location(span1, file$7, 382, 18, 11115);
    			add_location(style, file$7, 396, 20, 11589);
    			attr_dev(path, "d", "M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z");
    			add_location(path, file$7, 397, 20, 11705);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "22px");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			toggle_class(svg, "svgLike", true);
    			add_location(svg, file$7, 390, 18, 11363);
    			set_style(div0, "display", "flex");
    			set_style(div0, "flex-direction", "row");
    			set_style(div0, "align-items", "center");
    			add_location(div0, file$7, 374, 16, 10807);
    			set_style(span2, "cursor", "pointer");
    			set_style(span2, "color", "gray");
    			set_style(span2, "opacity", "0.6");
    			set_style(span2, "text-align", "center");
    			set_style(span2, "margin-top", "10px");
    			add_location(span2, file$7, 404, 18, 12525);
    			set_style(div1, "display", "flex");
    			set_style(div1, "flex-direction", "row");
    			set_style(div1, "align-items", "center");
    			add_location(div1, file$7, 400, 16, 12357);
    			set_style(div2, "display", "flex");
    			set_style(div2, "flex-direction", "column");
    			set_style(div2, "align-items", "center");
    			set_style(div2, "margin-bottom", "26px");
    			add_location(div2, file$7, 370, 14, 10580);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, span0);
    			append_dev(span0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, span1);
    			append_dev(div0, t3);
    			append_dev(div0, svg);
    			append_dev(svg, style);
    			append_dev(style, t4);
    			append_dev(svg, path);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, span2);
    			append_dev(div2, t7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", click_handler_10, false, false, false),
    					listen_dev(div1, "click", click_handler_11, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*questionsData, questionsIndex*/ 65 && t0_value !== (t0_value = /*hint*/ ctx[23].hint + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(369:12) { #each questionsData[questionsIndex].hints as hint }",
    		ctx
    	});

    	return block;
    }

    // (425:8) { #if questionsData.length === 0 }
    function create_if_block$6(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "вы пока не опубликовали ни одного вопроса";
    			set_style(span, "color", "gray");
    			set_style(span, "opacity", "0.8");
    			set_style(span, "margin-top", "26px");
    			set_style(span, "display", "block");
    			add_location(span, file$7, 426, 10, 13187);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(425:8) { #if questionsData.length === 0 }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div7;
    	let div3;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let span0;
    	let t4;
    	let div0;
    	let span1;
    	let t6;
    	let div1;
    	let span2;
    	let t8;
    	let div2;
    	let span3;
    	let t10;
    	let div6;
    	let modal;
    	let updating_open;
    	let t11;
    	let div5;
    	let div4;
    	let h3;
    	let t13;
    	let t14;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*AUTH*/ ctx[1] == true && create_if_block_6$2(ctx);
    	let if_block1 = /*AUTH*/ ctx[1] == true && create_if_block_5$2(ctx);
    	let if_block2 = /*AUTH*/ ctx[1] == true && create_if_block_4$6(ctx);
    	let if_block3 = /*AUTH*/ ctx[1] == false && create_if_block_3$6(ctx);

    	function modal_open_binding(value) {
    		/*modal_open_binding*/ ctx[19](value);
    	}

    	let modal_props = {
    		$$slots: {
    			default: [
    				create_default_slot$1,
    				({ closeCallback }) => ({ 26: closeCallback }),
    				({ closeCallback }) => closeCallback ? 67108864 : 0
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*showModal*/ ctx[5] !== void 0) {
    		modal_props.open = /*showModal*/ ctx[5];
    	}

    	modal = new Modal$1({ props: modal_props, $$inline: true });
    	binding_callbacks.push(() => bind(modal, 'open', modal_open_binding));
    	let if_block4 = /*questionsData*/ ctx[0].length > 0 && create_if_block_1$6(ctx);
    	let if_block5 = /*questionsData*/ ctx[0].length === 0 && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div3 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			span0 = element("span");
    			t4 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "о сервисе";
    			t6 = space();
    			div1 = element("div");
    			span2 = element("span");
    			span2.textContent = "конфиденциальность";
    			t8 = space();
    			div2 = element("div");
    			span3 = element("span");
    			span3.textContent = "служба качества";
    			t10 = space();
    			div6 = element("div");
    			create_component(modal.$$.fragment);
    			t11 = space();
    			div5 = element("div");
    			div4 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Мои вопросы в системе";
    			t13 = space();
    			if (if_block4) if_block4.c();
    			t14 = space();
    			if (if_block5) if_block5.c();
    			set_style(span0, "display", "block");
    			set_style(span0, "position", "relative");
    			set_style(span0, "width", "80%");
    			set_style(span0, "height", "2px");
    			set_style(span0, "background-color", "gray");
    			set_style(span0, "opacity", "0.4");
    			set_style(span0, "border-radius", "1px");
    			set_style(span0, "margin-top", "20px");
    			add_location(span0, file$7, 182, 4, 4632);
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-1uzqah4");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$7, 195, 6, 4953);
    			set_style(div0, "margin-top", "18px");
    			toggle_class(div0, "mainViewMenuItem", true);
    			add_location(div0, file$7, 194, 4, 4884);
    			set_style(span2, "cursor", "pointer");
    			attr_dev(span2, "class", "svelte-1uzqah4");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$7, 206, 6, 5239);
    			set_style(div1, "margin-top", "11px");
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$7, 205, 4, 5170);
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-1uzqah4");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$7, 217, 6, 5535);
    			set_style(div2, "margin-top", "11px");
    			toggle_class(div2, "mainViewMenuItem", true);
    			add_location(div2, file$7, 216, 4, 5466);
    			set_style(div3, "width", "20%");
    			set_style(div3, "padding-top", "30px");
    			toggle_class(div3, "mainViewMenu", true);
    			add_location(div3, file$7, 55, 2, 1088);
    			attr_dev(h3, "class", "svelte-1uzqah4");
    			toggle_class(h3, "mainViewContentTitle", true);
    			add_location(h3, file$7, 297, 8, 7597);
    			set_style(div4, "width", "calc(100% + 30px)");
    			set_style(div4, "overflow-y", "scroll");
    			set_style(div4, "padding-right", "30px");
    			set_style(div4, "box-sizing", "border-box");
    			set_style(div4, "height", "100%");
    			add_location(div4, file$7, 269, 6, 6997);
    			set_style(div5, "width", "100%");
    			set_style(div5, "height", "100%");
    			set_style(div5, "overflow", "hidden");
    			add_location(div5, file$7, 268, 4, 6931);
    			attr_dev(div6, "class", "svelte-1uzqah4");
    			toggle_class(div6, "mainViewContent", true);
    			add_location(div6, file$7, 228, 2, 5768);
    			attr_dev(div7, "class", "svelte-1uzqah4");
    			toggle_class(div7, "mainView", true);
    			add_location(div7, file$7, 54, 0, 1057);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div3);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div3, t0);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t1);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t2);
    			if (if_block3) if_block3.m(div3, null);
    			append_dev(div3, t3);
    			append_dev(div3, span0);
    			append_dev(div3, t4);
    			append_dev(div3, div0);
    			append_dev(div0, span1);
    			append_dev(div3, t6);
    			append_dev(div3, div1);
    			append_dev(div1, span2);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, span3);
    			append_dev(div7, t10);
    			append_dev(div7, div6);
    			mount_component(modal, div6, null);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, h3);
    			append_dev(div4, t13);
    			if (if_block4) if_block4.m(div4, null);
    			append_dev(div4, t14);
    			if (if_block5) if_block5.m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*click_handler_7*/ ctx[15], false, false, false),
    					listen_dev(span2, "click", /*click_handler_8*/ ctx[16], false, false, false),
    					listen_dev(span3, "click", /*click_handler_9*/ ctx[17], false, false, false),
    					listen_dev(div4, "mousewheel", /*mousewheel_handler*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*AUTH*/ ctx[1] == true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_6$2(ctx);
    					if_block0.c();
    					if_block0.m(div3, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*AUTH*/ ctx[1] == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_5$2(ctx);
    					if_block1.c();
    					if_block1.m(div3, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*AUTH*/ ctx[1] == true) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_4$6(ctx);
    					if_block2.c();
    					if_block2.m(div3, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*AUTH*/ ctx[1] == false) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_3$6(ctx);
    					if_block3.c();
    					if_block3.m(div3, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			const modal_changes = {};

    			if (dirty & /*$$scope, closeCallback, hintRate*/ 201326596) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_open && dirty & /*showModal*/ 32) {
    				updating_open = true;
    				modal_changes.open = /*showModal*/ ctx[5];
    				add_flush_callback(() => updating_open = false);
    			}

    			modal.$set(modal_changes);

    			if (/*questionsData*/ ctx[0].length > 0) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty & /*questionsData*/ 1) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_1$6(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div4, t14);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*questionsData*/ ctx[0].length === 0) {
    				if (if_block5) ; else {
    					if_block5 = create_if_block$6(ctx);
    					if_block5.c();
    					if_block5.m(div4, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			destroy_component(modal);
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler_11 = () => {
    	
    };

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyQuestions', slots, []);
    	let hintRate = 5;
    	let hintUID = '';
    	let hintText = '';
    	let showModal = false;
    	let { questionsData } = $$props;
    	let questionsIndex = 0;
    	let AUTH = false;
    	let UID = '';

    	const sendRateItem = () => {
    		fetch('http://localhost:3008/add-data-rate', {
    			method: 'POST',
    			headers: {
    				'Content-Type': 'application/json;charset=utf-8'
    			},
    			body: JSON.stringify({
    				uid: hintUID,
    				rate: hintRate,
    				from: UID,
    				text: hintText
    			})
    		}).then(res => res.json()).then(data => {
    			console.log(data);
    			$$invalidate(5, showModal = false);
    		});
    	};

    	const writable_props = ['questionsData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<MyQuestions> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		pageRoute.set('my-questions');
    	};

    	const click_handler_1 = () => {
    		pageRoute.set('my-hints');
    	};

    	const click_handler_2 = () => {
    		pageRoute.set('main');
    	};

    	const click_handler_3 = () => {
    		pageRoute.set('list-questions');
    	};

    	const click_handler_4 = () => {
    		pageRoute.set('my-cabinet');
    	};

    	const click_handler_5 = () => {
    		pageRoute.set('unauth');
    	};

    	const click_handler_6 = () => {
    		pageRoute.set('unauth');
    	};

    	const click_handler_7 = () => {
    		pageRoute.set('about');
    	};

    	const click_handler_8 = () => {
    		pageRoute.set('polici');
    	};

    	const click_handler_9 = () => {
    		pageRoute.set('support');
    	};

    	function starrating_value_binding(value) {
    		hintRate = value;
    		$$invalidate(2, hintRate);
    	}

    	function modal_open_binding(value) {
    		showModal = value;
    		$$invalidate(5, showModal);
    	}

    	const click_handler_10 = hint => {
    		$$invalidate(5, showModal = true);
    		$$invalidate(3, hintUID = hint.uid);
    		$$invalidate(4, hintText = hint.hint);
    	};

    	const mousewheel_handler = event => {
    		if (event.deltaY < 0) {
    			if (questionsIndex !== 0) {
    				$$invalidate(6, questionsIndex = questionsIndex - 1);
    			}
    		} else {
    			if (questionsIndex < questionsData.length - 1) {
    				$$invalidate(6, questionsIndex = questionsIndex + 1);
    			}
    		}
    	};

    	$$self.$$set = $$props => {
    		if ('questionsData' in $$props) $$invalidate(0, questionsData = $$props.questionsData);
    	};

    	$$self.$capture_state = () => ({
    		pageRoute,
    		authCheck,
    		Divider: Divider$1,
    		Modal: Modal$1,
    		Dialog: Dialog$1,
    		StarRating,
    		Button: Button$1,
    		hintRate,
    		hintUID,
    		hintText,
    		showModal,
    		questionsData,
    		questionsIndex,
    		AUTH,
    		UID,
    		sendRateItem
    	});

    	$$self.$inject_state = $$props => {
    		if ('hintRate' in $$props) $$invalidate(2, hintRate = $$props.hintRate);
    		if ('hintUID' in $$props) $$invalidate(3, hintUID = $$props.hintUID);
    		if ('hintText' in $$props) $$invalidate(4, hintText = $$props.hintText);
    		if ('showModal' in $$props) $$invalidate(5, showModal = $$props.showModal);
    		if ('questionsData' in $$props) $$invalidate(0, questionsData = $$props.questionsData);
    		if ('questionsIndex' in $$props) $$invalidate(6, questionsIndex = $$props.questionsIndex);
    		if ('AUTH' in $$props) $$invalidate(1, AUTH = $$props.AUTH);
    		if ('UID' in $$props) UID = $$props.UID;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*AUTH*/ 2) {
    			{
    				authCheck.subscribe(value => {
    					$$invalidate(1, AUTH = value.auth);
    					UID = value.userID;
    				});

    				console.log(AUTH);
    			}
    		}
    	};

    	return [
    		questionsData,
    		AUTH,
    		hintRate,
    		hintUID,
    		hintText,
    		showModal,
    		questionsIndex,
    		sendRateItem,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		starrating_value_binding,
    		modal_open_binding,
    		click_handler_10,
    		mousewheel_handler
    	];
    }

    class MyQuestions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { questionsData: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyQuestions",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*questionsData*/ ctx[0] === undefined && !('questionsData' in props)) {
    			console_1$6.warn("<MyQuestions> was created without expected prop 'questionsData'");
    		}
    	}

    	get questionsData() {
    		throw new Error("<MyQuestions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set questionsData(value) {
    		throw new Error("<MyQuestions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\bricks\views\MyCabinet.svelte generated by Svelte v3.47.0 */

    const { console: console_1$5 } = globals;
    const file$6 = "src\\bricks\\views\\MyCabinet.svelte";

    // (233:4) { #if AUTH == true }
    function create_if_block_10(ctx) {
    	let div1;
    	let span0;
    	let t1;
    	let div0;
    	let span1;
    	let t3;
    	let span2;
    	let t5;
    	let span3;
    	let t7;
    	let span4;
    	let t9;
    	let span5;
    	let t11;
    	let span6;
    	let t13;
    	let span7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "основное меню hint";
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "мои вопросы";
    			t3 = space();
    			span2 = element("span");
    			span2.textContent = "*";
    			t5 = space();
    			span3 = element("span");
    			span3.textContent = "мои хинты";
    			t7 = space();
    			span4 = element("span");
    			span4.textContent = "*";
    			t9 = space();
    			span5 = element("span");
    			span5.textContent = "новый вопрос";
    			t11 = space();
    			span6 = element("span");
    			span6.textContent = "*";
    			t13 = space();
    			span7 = element("span");
    			span7.textContent = "список вопросов";
    			attr_dev(span0, "class", "svelte-aolj48");
    			toggle_class(span0, "mainViewMenuItemLine", true);
    			add_location(span0, file$6, 235, 8, 5001);
    			set_style(span1, "margin-top", "11px");
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-aolj48");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$6, 237, 10, 5171);
    			set_style(span2, "margin-top", "12px");
    			set_style(span2, "cursor", "pointer");
    			set_style(span2, "color", "#4300b0");
    			set_style(span2, "margin-left", "30px");
    			attr_dev(span2, "class", "svelte-aolj48");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$6, 246, 10, 5441);
    			set_style(span3, "margin-top", "6px");
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-aolj48");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$6, 252, 10, 5644);
    			set_style(span4, "margin-top", "12px");
    			set_style(span4, "cursor", "pointer");
    			set_style(span4, "color", "#4300b0");
    			set_style(span4, "margin-left", "30px");
    			attr_dev(span4, "class", "svelte-aolj48");
    			toggle_class(span4, "mainViewMenuItemLine", true);
    			add_location(span4, file$6, 261, 10, 5907);
    			set_style(span5, "margin-top", "6px");
    			set_style(span5, "cursor", "pointer");
    			attr_dev(span5, "class", "svelte-aolj48");
    			toggle_class(span5, "mainViewMenuItemLine", true);
    			add_location(span5, file$6, 267, 10, 6110);
    			set_style(span6, "margin-top", "12px");
    			set_style(span6, "cursor", "pointer");
    			set_style(span6, "color", "#4300b0");
    			set_style(span6, "margin-left", "30px");
    			attr_dev(span6, "class", "svelte-aolj48");
    			toggle_class(span6, "mainViewMenuItemLine", true);
    			add_location(span6, file$6, 276, 10, 6372);
    			set_style(span7, "margin-top", "6px");
    			set_style(span7, "cursor", "pointer");
    			attr_dev(span7, "class", "svelte-aolj48");
    			toggle_class(span7, "mainViewMenuItemLine", true);
    			add_location(span7, file$6, 282, 10, 6575);
    			set_style(div0, "margin-top", "0px");
    			set_style(div0, "margin-bottom", "0px");
    			attr_dev(div0, "class", "svelte-aolj48");
    			toggle_class(div0, "mainViewMenuItemSub", true);
    			add_location(div0, file$6, 236, 8, 5076);
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$6, 234, 6, 4956);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span1);
    			append_dev(div0, t3);
    			append_dev(div0, span2);
    			append_dev(div0, t5);
    			append_dev(div0, span3);
    			append_dev(div0, t7);
    			append_dev(div0, span4);
    			append_dev(div0, t9);
    			append_dev(div0, span5);
    			append_dev(div0, t11);
    			append_dev(div0, span6);
    			append_dev(div0, t13);
    			append_dev(div0, span7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*click_handler*/ ctx[23], false, false, false),
    					listen_dev(span3, "click", /*click_handler_1*/ ctx[24], false, false, false),
    					listen_dev(span5, "click", /*click_handler_2*/ ctx[25], false, false, false),
    					listen_dev(span7, "click", /*click_handler_3*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(233:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (297:4) { #if AUTH == true }
    function create_if_block_9(ctx) {
    	let div;
    	let span1;
    	let t;
    	let span0;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span1 = element("span");
    			t = text("мои характеристики\r\n          ");
    			span0 = element("span");
    			set_style(span0, "display", "block");
    			set_style(span0, "position", "absolute");
    			set_style(span0, "width", "3px");
    			set_style(span0, "height", "20px");
    			set_style(span0, "background-color", "#4300b0");
    			set_style(span0, "top", "50%");
    			set_style(span0, "left", "0");
    			set_style(span0, "margin-top", "-10px");
    			set_style(span0, "margin-left", "-10px");
    			set_style(span0, "border-radius", "2px");
    			add_location(span0, file$6, 307, 10, 7216);
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-aolj48");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$6, 299, 8, 6992);
    			set_style(div, "margin-top", "11px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$6, 298, 6, 6921);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span1);
    			append_dev(span1, t);
    			append_dev(span1, span0);

    			if (!mounted) {
    				dispose = listen_dev(span1, "click", /*click_handler_4*/ ctx[27], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(297:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (327:4) { #if AUTH == true }
    function create_if_block_8$1(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "главная страница";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-aolj48");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$6, 329, 8, 7742);
    			set_style(div, "margin-top", "6px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$6, 328, 6, 7672);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_5*/ ctx[28], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(327:4) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (342:4) { #if AUTH == false }
    function create_if_block_7$1(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "войти в аккаунт";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-aolj48");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$6, 344, 8, 8101);
    			set_style(div, "margin-top", "6px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$6, 343, 6, 8031);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_6*/ ctx[29], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(342:4) { #if AUTH == false }",
    		ctx
    	});

    	return block;
    }

    // (419:10) <Button               filled              style="                font-size: 15px;                padding: 13px 22px 16px;                margin-top: 22px;                margin-bottom: 28px;              "            >
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Подтвердить оценку");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(419:10) <Button               filled              style=\\\"                font-size: 15px;                padding: 13px 22px 16px;                margin-top: 22px;                margin-bottom: 28px;              \\\"            >",
    		ctx
    	});

    	return block;
    }

    // (406:6) <Dialog title="" {closeCallback}>
    function create_default_slot_10(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let starrating;
    	let t2;
    	let button;
    	let current;

    	starrating = new StarRating({
    			props: {
    				style: "margin: 0;",
    				name: "default",
    				value: /*hintRate*/ ctx[15],
    				disabled: true
    			},
    			$$inline: true
    		});

    	button = new Button$1({
    			props: {
    				filled: true,
    				style: "\r\n              font-size: 15px;\r\n              padding: 13px 22px 16px;\r\n              margin-top: 22px;\r\n              margin-bottom: 28px;\r\n            ",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Насколько этот хинт был полезным";
    			t1 = space();
    			create_component(starrating.$$.fragment);
    			t2 = space();
    			create_component(button.$$.fragment);
    			set_style(h3, "margin-top", "28px");
    			set_style(h3, "margin-bottom", "14px");
    			add_location(h3, file$6, 416, 10, 9897);
    			set_style(div, "width", "100%");
    			set_style(div, "display", "flex");
    			set_style(div, "flex-direction", "column");
    			set_style(div, "align-items", "center");
    			set_style(div, "justify-content", "flex-start");
    			set_style(div, "margin-top", "14px");
    			add_location(div, file$6, 406, 8, 9638);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			mount_component(starrating, div, null);
    			append_dev(div, t2);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(starrating.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(starrating.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(starrating);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(406:6) <Dialog title=\\\"\\\" {closeCallback}>",
    		ctx
    	});

    	return block;
    }

    // (405:4) <Modal bind:open={showModal} let:closeCallback>
    function create_default_slot_9(ctx) {
    	let dialog;
    	let current;

    	dialog = new Dialog$1({
    			props: {
    				title: "",
    				closeCallback: /*closeCallback*/ ctx[40],
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dialog.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialog, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dialog_changes = {};
    			if (dirty[1] & /*closeCallback*/ 512) dialog_changes.closeCallback = /*closeCallback*/ ctx[40];

    			if (dirty[1] & /*$$scope*/ 1024) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			dialog.$set(dialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialog, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(405:4) <Modal bind:open={showModal} let:closeCallback>",
    		ctx
    	});

    	return block;
    }

    // (492:12) { #if sex == 'male' }
    function create_if_block_6$1(ctx) {
    	let style;
    	let t;

    	const block = {
    		c: function create() {
    			style = svg_element("style");
    			t = text("svg.svgMale{fill:#4300b0;cursor:pointer;}");
    			add_location(style, file$6, 492, 14, 12617);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, style, anchor);
    			append_dev(style, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(style);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(492:12) { #if sex == 'male' }",
    		ctx
    	});

    	return block;
    }

    // (495:12) { #if sex == 'female' }
    function create_if_block_5$1(ctx) {
    	let style;
    	let t;

    	const block = {
    		c: function create() {
    			style = svg_element("style");
    			t = text("svg.svgMale{fill:#323835;cursor:pointer;}");
    			add_location(style, file$6, 495, 14, 12747);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, style, anchor);
    			append_dev(style, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(style);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(495:12) { #if sex == 'female' }",
    		ctx
    	});

    	return block;
    }

    // (498:12) { #if sex == 'none' }
    function create_if_block_4$5(ctx) {
    	let style;
    	let t;

    	const block = {
    		c: function create() {
    			style = svg_element("style");
    			t = text("svg.svgMale{fill:#323835;cursor:pointer;}");
    			add_location(style, file$6, 498, 14, 12875);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, style, anchor);
    			append_dev(style, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(style);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$5.name,
    		type: "if",
    		source: "(498:12) { #if sex == 'none' }",
    		ctx
    	});

    	return block;
    }

    // (514:12) { #if sex == 'male' }
    function create_if_block_3$5(ctx) {
    	let style;
    	let t;

    	const block = {
    		c: function create() {
    			style = svg_element("style");
    			t = text("svg.svgfemale{fill:#323835;cursor:pointer;}");
    			add_location(style, file$6, 514, 14, 13763);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, style, anchor);
    			append_dev(style, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(style);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$5.name,
    		type: "if",
    		source: "(514:12) { #if sex == 'male' }",
    		ctx
    	});

    	return block;
    }

    // (517:12) { #if sex == 'female' }
    function create_if_block_2$5(ctx) {
    	let style;
    	let t;

    	const block = {
    		c: function create() {
    			style = svg_element("style");
    			t = text("svg.svgfemale{fill:#4300b0;cursor:pointer;}");
    			add_location(style, file$6, 517, 14, 13895);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, style, anchor);
    			append_dev(style, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(style);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(517:12) { #if sex == 'female' }",
    		ctx
    	});

    	return block;
    }

    // (520:12) { #if sex == 'none' }
    function create_if_block_1$5(ctx) {
    	let style;
    	let t;

    	const block = {
    		c: function create() {
    			style = svg_element("style");
    			t = text("svg.svgfemale{fill:#323835;cursor:pointer;}");
    			add_location(style, file$6, 520, 14, 14025);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, style, anchor);
    			append_dev(style, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(style);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(520:12) { #if sex == 'none' }",
    		ctx
    	});

    	return block;
    }

    // (525:10) <Checkbox              on:change={changeGender}              checked={noneGender}              name="male"              title="select male"              selectorStyle="                border: 2px solid #4300B0;                width: 19px;                height: 19px;                margin-left: 28px;                margin-right: 11px;              "            >
    function create_default_slot_8(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Пол не указан";
    			set_style(span, "font-size", "14px");
    			add_location(span, file$6, 537, 12, 14958);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(525:10) <Checkbox              on:change={changeGender}              checked={noneGender}              name=\\\"male\\\"              title=\\\"select male\\\"              selectorStyle=\\\"                border: 2px solid #4300B0;                width: 19px;                height: 19px;                margin-left: 28px;                margin-right: 11px;              \\\"            >",
    		ctx
    	});

    	return block;
    }

    // (577:10) <Checkbox              on:change={changeAge}              name="male"              value="male"              title="select male"              selectorStyle="                border: 2px solid #4300B0;                width: 19px;                height: 19px;                margin-left: 28px;                margin-right: 11px;              "            >
    function create_default_slot_7(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Возраст не указан";
    			set_style(span, "font-size", "14px");
    			add_location(span, file$6, 589, 12, 16528);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(577:10) <Checkbox              on:change={changeAge}              name=\\\"male\\\"              value=\\\"male\\\"              title=\\\"select male\\\"              selectorStyle=\\\"                border: 2px solid #4300B0;                width: 19px;                height: 19px;                margin-left: 28px;                margin-right: 11px;              \\\"            >",
    		ctx
    	});

    	return block;
    }

    // (611:10) <Checkbox              checked={rass}              on:change={changeRass}              name="male"              value="male"              title="select male"              selectorStyle="                border: 2px solid #4300B0;                width: 19px;                height: 19px;                margin-left: 22px;                margin-right: 11px;              "            >
    function create_default_slot_6(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Рассудительно";
    			set_style(span, "font-size", "14px");
    			add_location(span, file$6, 624, 12, 17595);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(611:10) <Checkbox              checked={rass}              on:change={changeRass}              name=\\\"male\\\"              value=\\\"male\\\"              title=\\\"select male\\\"              selectorStyle=\\\"                border: 2px solid #4300B0;                width: 19px;                height: 19px;                margin-left: 22px;                margin-right: 11px;              \\\"            >",
    		ctx
    	});

    	return block;
    }

    // (627:10) <Checkbox              checked={emo}              on:change={changeEmo}              name="male"              value="male"              title="select male"              selectorStyle="                border: 2px solid #4300B0;                width: 19px;                height: 19px;                margin-left: 20px;                margin-right: 11px;              "            >
    function create_default_slot_5(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Эмоционально";
    			set_style(span, "font-size", "14px");
    			add_location(span, file$6, 640, 12, 18075);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(627:10) <Checkbox              checked={emo}              on:change={changeEmo}              name=\\\"male\\\"              value=\\\"male\\\"              title=\\\"select male\\\"              selectorStyle=\\\"                border: 2px solid #4300B0;                width: 19px;                height: 19px;                margin-left: 20px;                margin-right: 11px;              \\\"            >",
    		ctx
    	});

    	return block;
    }

    // (643:10) <Checkbox              checked={radi}              on:change={changeRadi}              name="male"              value="male"              title="select male"              selectorStyle="                border: 2px solid #4300B0;                width: 19px;                height: 19px;                margin-left: 20px;                margin-right: 11px;              "            >
    function create_default_slot_4(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Радикально";
    			set_style(span, "font-size", "14px");
    			add_location(span, file$6, 656, 12, 18556);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(643:10) <Checkbox              checked={radi}              on:change={changeRadi}              name=\\\"male\\\"              value=\\\"male\\\"              title=\\\"select male\\\"              selectorStyle=\\\"                border: 2px solid #4300B0;                width: 19px;                height: 19px;                margin-left: 20px;                margin-right: 11px;              \\\"            >",
    		ctx
    	});

    	return block;
    }

    // (659:10) <Checkbox              checked={sder}              on:change={changeSder}              name="male"              value="male"              title="select male"              selectorStyle="                border: 2px solid #4300B0;                width: 19px;                height: 19px;                margin-left: 20px;                margin-right: 11px;              "            >
    function create_default_slot_3(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Сдержанно";
    			set_style(span, "font-size", "14px");
    			add_location(span, file$6, 672, 12, 19035);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(659:10) <Checkbox              checked={sder}              on:change={changeSder}              name=\\\"male\\\"              value=\\\"male\\\"              title=\\\"select male\\\"              selectorStyle=\\\"                border: 2px solid #4300B0;                width: 19px;                height: 19px;                margin-left: 20px;                margin-right: 11px;              \\\"            >",
    		ctx
    	});

    	return block;
    }

    // (687:10) { :else }
    function create_else_block(ctx) {
    	let button;
    	let current;

    	button = new Button$1({
    			props: {
    				filled: true,
    				style: "\r\n                font-size: 15px;\r\n                padding: 13px 22px 16px;\r\n                margin-top: 46px;\r\n                background-color: #FDFCF9;\r\n              ",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(687:10) { :else }",
    		ctx
    	});

    	return block;
    }

    // (677:10) { #if isLoading === false }
    function create_if_block$5(ctx) {
    	let button;
    	let current;

    	button = new Button$1({
    			props: {
    				filled: true,
    				style: "\r\n                font-size: 15px;\r\n                padding: 13px 22px 16px;\r\n                margin-top: 46px;\r\n              ",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*validate*/ ctx[22]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(677:10) { #if isLoading === false }",
    		ctx
    	});

    	return block;
    }

    // (688:12) <Button                 filled                style="                  font-size: 15px;                  padding: 13px 22px 16px;                  margin-top: 46px;                  background-color: #FDFCF9;                "              >
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Ожидание загрузки..");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(688:12) <Button                 filled                style=\\\"                  font-size: 15px;                  padding: 13px 22px 16px;                  margin-top: 46px;                  background-color: #FDFCF9;                \\\"              >",
    		ctx
    	});

    	return block;
    }

    // (678:12) <Button                 on:click={validate}                filled                style="                  font-size: 15px;                  padding: 13px 22px 16px;                  margin-top: 46px;                "              >
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Обновить личные данные");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(678:12) <Button                 on:click={validate}                filled                style=\\\"                  font-size: 15px;                  padding: 13px 22px 16px;                  margin-top: 46px;                \\\"              >",
    		ctx
    	});

    	return block;
    }

    // (698:10) <Button               filled              disabled              style="                font-size: 15px;                padding: 13px 22px 16px;                margin-top: 46px;                margin-left: 16px;              "            >
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Запасная кнопка на будущее");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(698:10) <Button               filled              disabled              style=\\\"                font-size: 15px;                padding: 13px 22px 16px;                margin-top: 46px;                margin-left: 16px;              \\\"            >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div12;
    	let div3;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let span0;
    	let t4;
    	let div0;
    	let span1;
    	let t6;
    	let div1;
    	let span2;
    	let t8;
    	let div2;
    	let span3;
    	let t10;
    	let div11;
    	let modal;
    	let updating_open;
    	let t11;
    	let div10;
    	let div9;
    	let h3;
    	let t12;
    	let t13;
    	let t14;
    	let div4;
    	let starrating;
    	let t15;
    	let span4;

    	let t16_value = (/*userRate*/ ctx[13]
    	? /*userRate*/ ctx[13].toFixed(2)
    	: 5) + "";

    	let t16;
    	let t17;
    	let span5;
    	let t19;
    	let div5;
    	let svg0;
    	let if_block4_anchor;
    	let if_block5_anchor;
    	let path0;
    	let t20;
    	let span6;
    	let t22;
    	let svg1;
    	let if_block7_anchor;
    	let if_block8_anchor;
    	let path1;
    	let t23;
    	let checkbox0;
    	let t24;
    	let hr0;
    	let t25;
    	let div6;
    	let span7;
    	let t27;
    	let input;
    	let t28;
    	let checkbox1;
    	let t29;
    	let hr1;
    	let t30;
    	let div7;
    	let span8;
    	let t32;
    	let checkbox2;
    	let t33;
    	let checkbox3;
    	let t34;
    	let checkbox4;
    	let t35;
    	let checkbox5;
    	let t36;
    	let div8;
    	let current_block_type_index;
    	let if_block10;
    	let t37;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*AUTH*/ ctx[1] == true && create_if_block_10(ctx);
    	let if_block1 = /*AUTH*/ ctx[1] == true && create_if_block_9(ctx);
    	let if_block2 = /*AUTH*/ ctx[1] == true && create_if_block_8$1(ctx);
    	let if_block3 = /*AUTH*/ ctx[1] == false && create_if_block_7$1(ctx);

    	function modal_open_binding(value) {
    		/*modal_open_binding*/ ctx[33](value);
    	}

    	let modal_props = {
    		$$slots: {
    			default: [
    				create_default_slot_9,
    				({ closeCallback }) => ({ 40: closeCallback }),
    				({ closeCallback }) => [0, closeCallback ? 512 : 0]
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*showModal*/ ctx[3] !== void 0) {
    		modal_props.open = /*showModal*/ ctx[3];
    	}

    	modal = new Modal$1({ props: modal_props, $$inline: true });
    	binding_callbacks.push(() => bind(modal, 'open', modal_open_binding));

    	starrating = new StarRating({
    			props: {
    				style: "margin: 0;",
    				name: "default",
    				value: /*userRate*/ ctx[13]
    				? Math.floor(/*userRate*/ ctx[13])
    				: 5
    			},
    			$$inline: true
    		});

    	let if_block4 = /*sex*/ ctx[4] == 'male' && create_if_block_6$1(ctx);
    	let if_block5 = /*sex*/ ctx[4] == 'female' && create_if_block_5$1(ctx);
    	let if_block6 = /*sex*/ ctx[4] == 'none' && create_if_block_4$5(ctx);
    	let if_block7 = /*sex*/ ctx[4] == 'male' && create_if_block_3$5(ctx);
    	let if_block8 = /*sex*/ ctx[4] == 'female' && create_if_block_2$5(ctx);
    	let if_block9 = /*sex*/ ctx[4] == 'none' && create_if_block_1$5(ctx);

    	checkbox0 = new Checkbox$1({
    			props: {
    				checked: /*noneGender*/ ctx[5],
    				name: "male",
    				title: "select male",
    				selectorStyle: "\r\n              border: 2px solid #4300B0;\r\n              width: 19px;\r\n              height: 19px;\r\n              margin-left: 28px;\r\n              margin-right: 11px;\r\n            ",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox0.$on("change", /*changeGender*/ ctx[20]);

    	checkbox1 = new Checkbox$1({
    			props: {
    				name: "male",
    				value: "male",
    				title: "select male",
    				selectorStyle: "\r\n              border: 2px solid #4300B0;\r\n              width: 19px;\r\n              height: 19px;\r\n              margin-left: 28px;\r\n              margin-right: 11px;\r\n            ",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox1.$on("change", /*changeAge*/ ctx[21]);

    	checkbox2 = new Checkbox$1({
    			props: {
    				checked: /*rass*/ ctx[8],
    				name: "male",
    				value: "male",
    				title: "select male",
    				selectorStyle: "\r\n              border: 2px solid #4300B0;\r\n              width: 19px;\r\n              height: 19px;\r\n              margin-left: 22px;\r\n              margin-right: 11px;\r\n            ",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox2.$on("change", /*changeRass*/ ctx[16]);

    	checkbox3 = new Checkbox$1({
    			props: {
    				checked: /*emo*/ ctx[9],
    				name: "male",
    				value: "male",
    				title: "select male",
    				selectorStyle: "\r\n              border: 2px solid #4300B0;\r\n              width: 19px;\r\n              height: 19px;\r\n              margin-left: 20px;\r\n              margin-right: 11px;\r\n            ",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox3.$on("change", /*changeEmo*/ ctx[17]);

    	checkbox4 = new Checkbox$1({
    			props: {
    				checked: /*radi*/ ctx[10],
    				name: "male",
    				value: "male",
    				title: "select male",
    				selectorStyle: "\r\n              border: 2px solid #4300B0;\r\n              width: 19px;\r\n              height: 19px;\r\n              margin-left: 20px;\r\n              margin-right: 11px;\r\n            ",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox4.$on("change", /*changeRadi*/ ctx[18]);

    	checkbox5 = new Checkbox$1({
    			props: {
    				checked: /*sder*/ ctx[11],
    				name: "male",
    				value: "male",
    				title: "select male",
    				selectorStyle: "\r\n              border: 2px solid #4300B0;\r\n              width: 19px;\r\n              height: 19px;\r\n              margin-left: 20px;\r\n              margin-right: 11px;\r\n            ",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox5.$on("change", /*changeSder*/ ctx[19]);
    	const if_block_creators = [create_if_block$5, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isLoading*/ ctx[2] === false) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block10 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	button = new Button$1({
    			props: {
    				filled: true,
    				disabled: true,
    				style: "\r\n              font-size: 15px;\r\n              padding: 13px 22px 16px;\r\n              margin-top: 46px;\r\n              margin-left: 16px;\r\n            ",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			div3 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			span0 = element("span");
    			t4 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "о сервисе";
    			t6 = space();
    			div1 = element("div");
    			span2 = element("span");
    			span2.textContent = "конфиденциальность";
    			t8 = space();
    			div2 = element("div");
    			span3 = element("span");
    			span3.textContent = "служба качества";
    			t10 = space();
    			div11 = element("div");
    			create_component(modal.$$.fragment);
    			t11 = space();
    			div10 = element("div");
    			div9 = element("div");
    			h3 = element("h3");
    			t12 = text("Личный кабинет | ");
    			t13 = text(/*userMail*/ ctx[12]);
    			t14 = space();
    			div4 = element("div");
    			create_component(starrating.$$.fragment);
    			t15 = space();
    			span4 = element("span");
    			t16 = text(t16_value);
    			t17 = space();
    			span5 = element("span");
    			span5.textContent = "Сервис hint - максимально обезличенный, поэтому вам не удастся настроить ваше имя, ник или аватар в виде вашей фотки. Однако сервис позволяет настроить вам ваши характеристики, как одного из представителей глобальной аудитории hint. Вам будут показываться те вопросы, таргетинг которых соответствует вашему портрету. Надеемся, что вам понравится в hint";
    			t19 = space();
    			div5 = element("div");
    			svg0 = svg_element("svg");
    			if (if_block4) if_block4.c();
    			if_block4_anchor = empty();
    			if (if_block5) if_block5.c();
    			if_block5_anchor = empty();
    			if (if_block6) if_block6.c();
    			path0 = svg_element("path");
    			t20 = space();
    			span6 = element("span");
    			span6.textContent = "выберите ваш пол";
    			t22 = space();
    			svg1 = svg_element("svg");
    			if (if_block7) if_block7.c();
    			if_block7_anchor = empty();
    			if (if_block8) if_block8.c();
    			if_block8_anchor = empty();
    			if (if_block9) if_block9.c();
    			path1 = svg_element("path");
    			t23 = space();
    			create_component(checkbox0.$$.fragment);
    			t24 = space();
    			hr0 = element("hr");
    			t25 = space();
    			div6 = element("div");
    			span7 = element("span");
    			span7.textContent = "Укажите ваш возраст";
    			t27 = space();
    			input = element("input");
    			t28 = space();
    			create_component(checkbox1.$$.fragment);
    			t29 = space();
    			hr1 = element("hr");
    			t30 = space();
    			div7 = element("div");
    			span8 = element("span");
    			span8.textContent = "Выберите ваш характер";
    			t32 = space();
    			create_component(checkbox2.$$.fragment);
    			t33 = space();
    			create_component(checkbox3.$$.fragment);
    			t34 = space();
    			create_component(checkbox4.$$.fragment);
    			t35 = space();
    			create_component(checkbox5.$$.fragment);
    			t36 = space();
    			div8 = element("div");
    			if_block10.c();
    			t37 = space();
    			create_component(button.$$.fragment);
    			set_style(span0, "display", "block");
    			set_style(span0, "position", "relative");
    			set_style(span0, "width", "80%");
    			set_style(span0, "height", "2px");
    			set_style(span0, "background-color", "gray");
    			set_style(span0, "opacity", "0.4");
    			set_style(span0, "border-radius", "1px");
    			set_style(span0, "margin-top", "20px");
    			add_location(span0, file$6, 356, 4, 8358);
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-aolj48");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$6, 369, 6, 8679);
    			set_style(div0, "margin-top", "18px");
    			toggle_class(div0, "mainViewMenuItem", true);
    			add_location(div0, file$6, 368, 4, 8610);
    			set_style(span2, "cursor", "pointer");
    			attr_dev(span2, "class", "svelte-aolj48");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$6, 380, 6, 8965);
    			set_style(div1, "margin-top", "11px");
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$6, 379, 4, 8896);
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-aolj48");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$6, 391, 6, 9261);
    			set_style(div2, "margin-top", "11px");
    			toggle_class(div2, "mainViewMenuItem", true);
    			add_location(div2, file$6, 390, 4, 9192);
    			set_style(div3, "width", "20%");
    			set_style(div3, "padding-top", "30px");
    			toggle_class(div3, "mainViewMenu", true);
    			add_location(div3, file$6, 230, 2, 4848);
    			set_style(span4, "margin-top", "7.5px");
    			set_style(span4, "margin-left", "10px");
    			set_style(span4, "font-size", "24px");
    			add_location(span4, file$6, 474, 12, 11578);
    			set_style(div4, "display", "flex");
    			set_style(div4, "flex-direction", "row");
    			set_style(div4, "items-align", "center");
    			set_style(div4, "position", "absolute");
    			set_style(div4, "top", "0");
    			set_style(div4, "left", "100%");
    			set_style(div4, "margin-top", "20px");
    			set_style(div4, "margin-left", "-300px");
    			add_location(div4, file$6, 461, 10, 11146);
    			attr_dev(h3, "class", "svelte-aolj48");
    			toggle_class(h3, "mainViewContentTitle", true);
    			add_location(h3, file$6, 459, 8, 11055);
    			set_style(span5, "line-height", "24px");
    			set_style(span5, "margin-top", "20px");
    			set_style(span5, "display", "block");
    			add_location(span5, file$6, 477, 8, 11735);
    			attr_dev(path0, "d", "M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z");
    			add_location(path0, file$6, 500, 12, 12966);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "height", "70px");
    			attr_dev(svg0, "viewBox", "0 0 320 512");
    			toggle_class(svg0, "svgMale", true);
    			add_location(svg0, file$6, 481, 10, 12293);
    			set_style(span6, "margin-left", "26px");
    			set_style(span6, "margin-right", "28px");
    			add_location(span6, file$6, 502, 10, 13347);
    			attr_dev(path1, "d", "M160 0a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM88 384H70.2c-10.9 0-18.6-10.7-15.2-21.1L93.3 248.1 59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l53.6-89.2c20.3-33.7 56.7-54.3 96-54.3h11.6c39.3 0 75.7 20.6 96 54.3l53.6 89.2c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9l-33.9-56.3L265 362.9c3.5 10.4-4.3 21.1-15.2 21.1H232v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384H152v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z");
    			add_location(path1, file$6, 522, 12, 14118);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "height", "70px");
    			attr_dev(svg1, "viewBox", "0 0 320 512");
    			toggle_class(svg1, "svgfemale", true);
    			add_location(svg1, file$6, 503, 10, 13435);
    			set_style(div5, "margin-top", "30px");
    			set_style(div5, "display", "flex");
    			set_style(div5, "flex-direction", "row");
    			set_style(div5, "align-items", "center");
    			add_location(div5, file$6, 480, 8, 12193);
    			set_style(hr0, "display", "block");
    			set_style(hr0, "position", "relative");
    			set_style(hr0, "border", "none");
    			set_style(hr0, "background-color", "gray");
    			set_style(hr0, "opacity", "0.4");
    			set_style(hr0, "height", "2px");
    			set_style(hr0, "box-sizing", "border-box");
    			set_style(hr0, "border-radius", "1px");
    			set_style(hr0, "margin-top", "38px");
    			set_style(hr0, "margin-bottom", "38px");
    			add_location(hr0, file$6, 540, 8, 15058);
    			add_location(span7, file$6, 555, 10, 15529);
    			input.disabled = /*noneAge*/ ctx[7];
    			attr_dev(input, "type", "text");
    			attr_dev(input, "maxlength", "2");
    			attr_dev(input, "placeholder", "30");
    			set_style(input, "display", "block");
    			set_style(input, "position", "relative");
    			set_style(input, "box-sizing", "border-box");
    			set_style(input, "width", "60px");
    			set_style(input, "height", "44px");
    			set_style(input, "text-align", "center");
    			set_style(input, "border", "none");
    			set_style(input, "outline", "none");
    			set_style(input, "border-radius", "6px");
    			set_style(input, "background-color", "#FDFCF9");
    			set_style(input, "margin-left", "28px");
    			add_location(input, file$6, 556, 10, 15573);
    			set_style(div6, "margin-top", "0px");
    			set_style(div6, "display", "flex");
    			set_style(div6, "flex-direction", "row");
    			set_style(div6, "align-items", "center");
    			add_location(div6, file$6, 554, 8, 15430);
    			set_style(hr1, "display", "block");
    			set_style(hr1, "position", "relative");
    			set_style(hr1, "border", "none");
    			set_style(hr1, "background-color", "gray");
    			set_style(hr1, "opacity", "0.4");
    			set_style(hr1, "height", "2px");
    			set_style(hr1, "box-sizing", "border-box");
    			set_style(hr1, "border-radius", "1px");
    			set_style(hr1, "margin-top", "38px");
    			set_style(hr1, "margin-bottom", "38px");
    			add_location(hr1, file$6, 592, 8, 16632);
    			set_style(span8, "display", "block");
    			add_location(span8, file$6, 607, 10, 17103);
    			set_style(div7, "display", "flex");
    			set_style(div7, "flex-direction", "row");
    			set_style(div7, "align-items", "center");
    			set_style(div7, "margin-top", "0px");
    			add_location(div7, file$6, 606, 8, 17004);
    			set_style(div8, "display", "flex");
    			set_style(div8, "flex-direction", "row");
    			set_style(div8, "align-items", "center");
    			add_location(div8, file$6, 675, 8, 19131);
    			set_style(div9, "width", "calc(100% + 30px)");
    			set_style(div9, "overflow-y", "scroll");
    			set_style(div9, "padding-right", "30px");
    			set_style(div9, "box-sizing", "border-box");
    			set_style(div9, "height", "100%");
    			add_location(div9, file$6, 432, 6, 10453);
    			set_style(div10, "width", "100%");
    			set_style(div10, "height", "100%");
    			set_style(div10, "overflow", "hidden");
    			add_location(div10, file$6, 431, 4, 10387);
    			attr_dev(div11, "class", "svelte-aolj48");
    			toggle_class(div11, "mainViewContent", true);
    			add_location(div11, file$6, 402, 2, 9494);
    			attr_dev(div12, "class", "svelte-aolj48");
    			toggle_class(div12, "mainView", true);
    			add_location(div12, file$6, 229, 0, 4817);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div3);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div3, t0);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t1);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t2);
    			if (if_block3) if_block3.m(div3, null);
    			append_dev(div3, t3);
    			append_dev(div3, span0);
    			append_dev(div3, t4);
    			append_dev(div3, div0);
    			append_dev(div0, span1);
    			append_dev(div3, t6);
    			append_dev(div3, div1);
    			append_dev(div1, span2);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, span3);
    			append_dev(div12, t10);
    			append_dev(div12, div11);
    			mount_component(modal, div11, null);
    			append_dev(div11, t11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, h3);
    			append_dev(h3, t12);
    			append_dev(h3, t13);
    			append_dev(h3, t14);
    			append_dev(h3, div4);
    			mount_component(starrating, div4, null);
    			append_dev(div4, t15);
    			append_dev(div4, span4);
    			append_dev(span4, t16);
    			append_dev(div9, t17);
    			append_dev(div9, span5);
    			append_dev(div9, t19);
    			append_dev(div9, div5);
    			append_dev(div5, svg0);
    			if (if_block4) if_block4.m(svg0, null);
    			append_dev(svg0, if_block4_anchor);
    			if (if_block5) if_block5.m(svg0, null);
    			append_dev(svg0, if_block5_anchor);
    			if (if_block6) if_block6.m(svg0, null);
    			append_dev(svg0, path0);
    			append_dev(div5, t20);
    			append_dev(div5, span6);
    			append_dev(div5, t22);
    			append_dev(div5, svg1);
    			if (if_block7) if_block7.m(svg1, null);
    			append_dev(svg1, if_block7_anchor);
    			if (if_block8) if_block8.m(svg1, null);
    			append_dev(svg1, if_block8_anchor);
    			if (if_block9) if_block9.m(svg1, null);
    			append_dev(svg1, path1);
    			append_dev(div5, t23);
    			mount_component(checkbox0, div5, null);
    			append_dev(div9, t24);
    			append_dev(div9, hr0);
    			append_dev(div9, t25);
    			append_dev(div9, div6);
    			append_dev(div6, span7);
    			append_dev(div6, t27);
    			append_dev(div6, input);
    			set_input_value(input, /*ageNumber*/ ctx[6]);
    			append_dev(div6, t28);
    			mount_component(checkbox1, div6, null);
    			append_dev(div9, t29);
    			append_dev(div9, hr1);
    			append_dev(div9, t30);
    			append_dev(div9, div7);
    			append_dev(div7, span8);
    			append_dev(div7, t32);
    			mount_component(checkbox2, div7, null);
    			append_dev(div7, t33);
    			mount_component(checkbox3, div7, null);
    			append_dev(div7, t34);
    			mount_component(checkbox4, div7, null);
    			append_dev(div7, t35);
    			mount_component(checkbox5, div7, null);
    			append_dev(div9, t36);
    			append_dev(div9, div8);
    			if_blocks[current_block_type_index].m(div8, null);
    			append_dev(div8, t37);
    			mount_component(button, div8, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*click_handler_7*/ ctx[30], false, false, false),
    					listen_dev(span2, "click", /*click_handler_8*/ ctx[31], false, false, false),
    					listen_dev(span3, "click", /*click_handler_9*/ ctx[32], false, false, false),
    					listen_dev(svg0, "click", /*click_handler_10*/ ctx[34], false, false, false),
    					listen_dev(svg1, "click", /*click_handler_11*/ ctx[35], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[36]),
    					listen_dev(div9, "mousewheel", /*mousewheel_handler*/ ctx[37], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*AUTH*/ ctx[1] == true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					if_block0.m(div3, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*AUTH*/ ctx[1] == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_9(ctx);
    					if_block1.c();
    					if_block1.m(div3, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*AUTH*/ ctx[1] == true) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_8$1(ctx);
    					if_block2.c();
    					if_block2.m(div3, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*AUTH*/ ctx[1] == false) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_7$1(ctx);
    					if_block3.c();
    					if_block3.m(div3, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			const modal_changes = {};

    			if (dirty[1] & /*$$scope, closeCallback*/ 1536) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_open && dirty[0] & /*showModal*/ 8) {
    				updating_open = true;
    				modal_changes.open = /*showModal*/ ctx[3];
    				add_flush_callback(() => updating_open = false);
    			}

    			modal.$set(modal_changes);
    			if (!current || dirty[0] & /*userMail*/ 4096) set_data_dev(t13, /*userMail*/ ctx[12]);
    			const starrating_changes = {};

    			if (dirty[0] & /*userRate*/ 8192) starrating_changes.value = /*userRate*/ ctx[13]
    			? Math.floor(/*userRate*/ ctx[13])
    			: 5;

    			starrating.$set(starrating_changes);

    			if ((!current || dirty[0] & /*userRate*/ 8192) && t16_value !== (t16_value = (/*userRate*/ ctx[13]
    			? /*userRate*/ ctx[13].toFixed(2)
    			: 5) + "")) set_data_dev(t16, t16_value);

    			if (/*sex*/ ctx[4] == 'male') {
    				if (if_block4) ; else {
    					if_block4 = create_if_block_6$1(ctx);
    					if_block4.c();
    					if_block4.m(svg0, if_block4_anchor);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*sex*/ ctx[4] == 'female') {
    				if (if_block5) ; else {
    					if_block5 = create_if_block_5$1(ctx);
    					if_block5.c();
    					if_block5.m(svg0, if_block5_anchor);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*sex*/ ctx[4] == 'none') {
    				if (if_block6) ; else {
    					if_block6 = create_if_block_4$5(ctx);
    					if_block6.c();
    					if_block6.m(svg0, path0);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*sex*/ ctx[4] == 'male') {
    				if (if_block7) ; else {
    					if_block7 = create_if_block_3$5(ctx);
    					if_block7.c();
    					if_block7.m(svg1, if_block7_anchor);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (/*sex*/ ctx[4] == 'female') {
    				if (if_block8) ; else {
    					if_block8 = create_if_block_2$5(ctx);
    					if_block8.c();
    					if_block8.m(svg1, if_block8_anchor);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (/*sex*/ ctx[4] == 'none') {
    				if (if_block9) ; else {
    					if_block9 = create_if_block_1$5(ctx);
    					if_block9.c();
    					if_block9.m(svg1, path1);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			const checkbox0_changes = {};
    			if (dirty[0] & /*noneGender*/ 32) checkbox0_changes.checked = /*noneGender*/ ctx[5];

    			if (dirty[1] & /*$$scope*/ 1024) {
    				checkbox0_changes.$$scope = { dirty, ctx };
    			}

    			checkbox0.$set(checkbox0_changes);

    			if (!current || dirty[0] & /*noneAge*/ 128) {
    				prop_dev(input, "disabled", /*noneAge*/ ctx[7]);
    			}

    			if (dirty[0] & /*ageNumber*/ 64 && input.value !== /*ageNumber*/ ctx[6]) {
    				set_input_value(input, /*ageNumber*/ ctx[6]);
    			}

    			const checkbox1_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				checkbox1_changes.$$scope = { dirty, ctx };
    			}

    			checkbox1.$set(checkbox1_changes);
    			const checkbox2_changes = {};
    			if (dirty[0] & /*rass*/ 256) checkbox2_changes.checked = /*rass*/ ctx[8];

    			if (dirty[1] & /*$$scope*/ 1024) {
    				checkbox2_changes.$$scope = { dirty, ctx };
    			}

    			checkbox2.$set(checkbox2_changes);
    			const checkbox3_changes = {};
    			if (dirty[0] & /*emo*/ 512) checkbox3_changes.checked = /*emo*/ ctx[9];

    			if (dirty[1] & /*$$scope*/ 1024) {
    				checkbox3_changes.$$scope = { dirty, ctx };
    			}

    			checkbox3.$set(checkbox3_changes);
    			const checkbox4_changes = {};
    			if (dirty[0] & /*radi*/ 1024) checkbox4_changes.checked = /*radi*/ ctx[10];

    			if (dirty[1] & /*$$scope*/ 1024) {
    				checkbox4_changes.$$scope = { dirty, ctx };
    			}

    			checkbox4.$set(checkbox4_changes);
    			const checkbox5_changes = {};
    			if (dirty[0] & /*sder*/ 2048) checkbox5_changes.checked = /*sder*/ ctx[11];

    			if (dirty[1] & /*$$scope*/ 1024) {
    				checkbox5_changes.$$scope = { dirty, ctx };
    			}

    			checkbox5.$set(checkbox5_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block10 = if_blocks[current_block_type_index];

    				if (!if_block10) {
    					if_block10 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block10.c();
    				} else {
    					if_block10.p(ctx, dirty);
    				}

    				transition_in(if_block10, 1);
    				if_block10.m(div8, t37);
    			}

    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			transition_in(starrating.$$.fragment, local);
    			transition_in(checkbox0.$$.fragment, local);
    			transition_in(checkbox1.$$.fragment, local);
    			transition_in(checkbox2.$$.fragment, local);
    			transition_in(checkbox3.$$.fragment, local);
    			transition_in(checkbox4.$$.fragment, local);
    			transition_in(checkbox5.$$.fragment, local);
    			transition_in(if_block10);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			transition_out(starrating.$$.fragment, local);
    			transition_out(checkbox0.$$.fragment, local);
    			transition_out(checkbox1.$$.fragment, local);
    			transition_out(checkbox2.$$.fragment, local);
    			transition_out(checkbox3.$$.fragment, local);
    			transition_out(checkbox4.$$.fragment, local);
    			transition_out(checkbox5.$$.fragment, local);
    			transition_out(if_block10);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			destroy_component(modal);
    			destroy_component(starrating);
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			destroy_component(checkbox0);
    			destroy_component(checkbox1);
    			destroy_component(checkbox2);
    			destroy_component(checkbox3);
    			destroy_component(checkbox4);
    			destroy_component(checkbox5);
    			if_blocks[current_block_type_index].d();
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyCabinet', slots, []);
    	let isLoading = false;
    	let hintRate = 5;
    	let showModal = false;
    	let sex = 'male';
    	let noneGender = false;
    	let defaultAgeNumber;
    	let ageNumber = '';
    	let noneAge = false;
    	let rass = false;
    	let emo = false;
    	let radi = false;
    	let sder = false;
    	let AUTH = false;
    	let userMail;
    	let userId;
    	let userRate;
    	let { questionsData } = $$props;
    	let questionsIndex = 0;
    	const changeRass = event => $$invalidate(8, rass = event.detail.checked);
    	const changeEmo = event => $$invalidate(9, emo = event.detail.checked);
    	const changeRadi = event => $$invalidate(10, radi = event.detail.checked);
    	const changeSder = event => $$invalidate(11, sder = event.detail.checked);

    	const changeGender = event => {
    		console.log(event.detail.checked);

    		if (event.detail.checked == true) {
    			$$invalidate(4, sex = 'none');
    			$$invalidate(5, noneGender = true);
    		} else {
    			$$invalidate(4, sex = 'male');
    			$$invalidate(5, noneGender = false);
    		}
    	};

    	const changeAge = event => {
    		console.log(event.detail.checked);

    		if (event.detail.checked == true) {
    			$$invalidate(6, ageNumber = '');
    			$$invalidate(7, noneAge = true);
    		} else {
    			$$invalidate(6, ageNumber = '30');
    			$$invalidate(7, noneAge = false);
    		}
    	};

    	const validate = () => {
    		$$invalidate(2, isLoading = true);

    		console.log({
    			age: ageNumber,
    			gender: sex,
    			style: [{ rass }, { emo }, { radi }, { sder }]
    		});

    		fetch('http://localhost:3008/add-data-user', {
    			method: 'POST',
    			headers: {
    				'Content-Type': 'application/json;charset=utf-8'
    			},
    			body: JSON.stringify({
    				uid: userId,
    				age: ageNumber != '' ? ageNumber : defaultAgeNumber,
    				gender: sex,
    				style: [{ rass }, { emo }, { radi }, { sder }]
    			})
    		}).then(res => res.json()).then(data => {
    			authCheck.update(data => {
    				return {
    					...data,
    					age: ageNumber,
    					gender: sex,
    					style: [{ rass }, { emo }, { radi }, { sder }]
    				};
    			});

    			setTimeout(
    				() => {
    					fetch('http://localhost:3008/send-data-user', {
    						method: 'POST',
    						headers: {
    							'Content-Type': 'application/json;charset=utf-8'
    						},
    						body: JSON.stringify({ uid: userId })
    					}).then(res => res.json()).then(data => {
    						console.log(data);
    						$$invalidate(4, sex = data.body.gender);
    						$$invalidate(6, ageNumber = data.body.age);
    						defaultAgeNumber = data.body.age;
    						$$invalidate(13, userRate = data.rate.reduce((a, b) => a + b) / data.rate.length);

    						if (sex == 'none') {
    							$$invalidate(5, noneGender = true);
    						}

    						if (data.body.style) {
    							$$invalidate(8, rass = data.body.style[0].rass);
    							$$invalidate(9, emo = data.body.style[1].emo);
    							$$invalidate(10, radi = data.body.style[2].radi);
    							$$invalidate(11, sder = data.body.style[3].sder);
    						}

    						$$invalidate(2, isLoading = false);
    					});
    				},
    				1000
    			);
    		}).catch(err => console.log(err));
    	};

    	onMount(() => {
    		fetch('http://localhost:3008/send-data-user', {
    			method: 'POST',
    			headers: {
    				'Content-Type': 'application/json;charset=utf-8'
    			},
    			body: JSON.stringify({ uid: userId })
    		}).then(res => res.json()).then(data => {
    			console.log(data);
    			$$invalidate(4, sex = data.body.gender);
    			$$invalidate(6, ageNumber = data.body.age);
    			defaultAgeNumber = data.body.age;
    			$$invalidate(13, userRate = data.rate.reduce((a, b) => a.rate + b.rate) / data.rate.length);
    			console.log(userRate);

    			if (sex == 'none') {
    				$$invalidate(5, noneGender = true);
    			}

    			if (data.body.style) {
    				$$invalidate(8, rass = data.body.style[0].rass);
    				$$invalidate(9, emo = data.body.style[1].emo);
    				$$invalidate(10, radi = data.body.style[2].radi);
    				$$invalidate(11, sder = data.body.style[3].sder);
    			}
    		});
    	});

    	const writable_props = ['questionsData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<MyCabinet> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		pageRoute.set('my-questions');
    	};

    	const click_handler_1 = () => {
    		pageRoute.set('my-hints');
    	};

    	const click_handler_2 = () => {
    		pageRoute.set('main');
    	};

    	const click_handler_3 = () => {
    		pageRoute.set('list-questions');
    	};

    	const click_handler_4 = () => {
    		pageRoute.set('my-cabinet');
    	};

    	const click_handler_5 = () => {
    		pageRoute.set('unauth');
    	};

    	const click_handler_6 = () => {
    		pageRoute.set('unauth');
    	};

    	const click_handler_7 = () => {
    		pageRoute.set('about');
    	};

    	const click_handler_8 = () => {
    		pageRoute.set('polici');
    	};

    	const click_handler_9 = () => {
    		pageRoute.set('support');
    	};

    	function modal_open_binding(value) {
    		showModal = value;
    		$$invalidate(3, showModal);
    	}

    	const click_handler_10 = () => {
    		$$invalidate(4, sex = 'male');
    		$$invalidate(5, noneGender = false);
    	};

    	const click_handler_11 = () => {
    		$$invalidate(4, sex = 'female');
    		$$invalidate(5, noneGender = false);
    	};

    	function input_input_handler() {
    		ageNumber = this.value;
    		$$invalidate(6, ageNumber);
    	}

    	const mousewheel_handler = event => {
    		if (event.deltaY == -200) {
    			if (questionsIndex !== 0) {
    				$$invalidate(14, questionsIndex = questionsIndex - 1);
    			}
    		} else {
    			if (questionsIndex < questionsData.length - 1) {
    				$$invalidate(14, questionsIndex = questionsIndex + 1);
    			}
    		}
    	};

    	$$self.$$set = $$props => {
    		if ('questionsData' in $$props) $$invalidate(0, questionsData = $$props.questionsData);
    	};

    	$$self.$capture_state = () => ({
    		pageRoute,
    		authCheck,
    		Modal: Modal$1,
    		Dialog: Dialog$1,
    		StarRating,
    		Button: Button$1,
    		Checkbox: Checkbox$1,
    		onMount,
    		isLoading,
    		hintRate,
    		showModal,
    		sex,
    		noneGender,
    		defaultAgeNumber,
    		ageNumber,
    		noneAge,
    		rass,
    		emo,
    		radi,
    		sder,
    		AUTH,
    		userMail,
    		userId,
    		userRate,
    		questionsData,
    		questionsIndex,
    		changeRass,
    		changeEmo,
    		changeRadi,
    		changeSder,
    		changeGender,
    		changeAge,
    		validate
    	});

    	$$self.$inject_state = $$props => {
    		if ('isLoading' in $$props) $$invalidate(2, isLoading = $$props.isLoading);
    		if ('hintRate' in $$props) $$invalidate(15, hintRate = $$props.hintRate);
    		if ('showModal' in $$props) $$invalidate(3, showModal = $$props.showModal);
    		if ('sex' in $$props) $$invalidate(4, sex = $$props.sex);
    		if ('noneGender' in $$props) $$invalidate(5, noneGender = $$props.noneGender);
    		if ('defaultAgeNumber' in $$props) defaultAgeNumber = $$props.defaultAgeNumber;
    		if ('ageNumber' in $$props) $$invalidate(6, ageNumber = $$props.ageNumber);
    		if ('noneAge' in $$props) $$invalidate(7, noneAge = $$props.noneAge);
    		if ('rass' in $$props) $$invalidate(8, rass = $$props.rass);
    		if ('emo' in $$props) $$invalidate(9, emo = $$props.emo);
    		if ('radi' in $$props) $$invalidate(10, radi = $$props.radi);
    		if ('sder' in $$props) $$invalidate(11, sder = $$props.sder);
    		if ('AUTH' in $$props) $$invalidate(1, AUTH = $$props.AUTH);
    		if ('userMail' in $$props) $$invalidate(12, userMail = $$props.userMail);
    		if ('userId' in $$props) userId = $$props.userId;
    		if ('userRate' in $$props) $$invalidate(13, userRate = $$props.userRate);
    		if ('questionsData' in $$props) $$invalidate(0, questionsData = $$props.questionsData);
    		if ('questionsIndex' in $$props) $$invalidate(14, questionsIndex = $$props.questionsIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*AUTH*/ 2) {
    			{
    				authCheck.subscribe(value => {
    					$$invalidate(1, AUTH = value.auth);
    					$$invalidate(12, userMail = value.userMail);
    					userId = value.userID;
    				});

    				console.log(AUTH);
    			}
    		}
    	};

    	return [
    		questionsData,
    		AUTH,
    		isLoading,
    		showModal,
    		sex,
    		noneGender,
    		ageNumber,
    		noneAge,
    		rass,
    		emo,
    		radi,
    		sder,
    		userMail,
    		userRate,
    		questionsIndex,
    		hintRate,
    		changeRass,
    		changeEmo,
    		changeRadi,
    		changeSder,
    		changeGender,
    		changeAge,
    		validate,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		modal_open_binding,
    		click_handler_10,
    		click_handler_11,
    		input_input_handler,
    		mousewheel_handler
    	];
    }

    class MyCabinet extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { questionsData: 0 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyCabinet",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*questionsData*/ ctx[0] === undefined && !('questionsData' in props)) {
    			console_1$5.warn("<MyCabinet> was created without expected prop 'questionsData'");
    		}
    	}

    	get questionsData() {
    		throw new Error("<MyCabinet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set questionsData(value) {
    		throw new Error("<MyCabinet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\bricks\views\Unauth.svelte generated by Svelte v3.47.0 */

    const { console: console_1$4 } = globals;
    const file$5 = "src\\bricks\\views\\Unauth.svelte";

    // (30:2) { #if helloDownload === true }
    function create_if_block_4$4(ctx) {
    	let div;
    	let svg;
    	let style;
    	let t0;
    	let path;
    	let t1;
    	let loading;
    	let current;
    	loading = new Loading$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t0 = text("svg.helloLogo { fill:#fdfcf9; margin-bottom: 20px; }\r\n        \r\n        ");
    			path = svg_element("path");
    			t1 = space();
    			create_component(loading.$$.fragment);
    			add_location(style, file$5, 48, 8, 907);
    			attr_dev(path, "d", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z");
    			add_location(path, file$5, 53, 8, 1018);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "60px");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			toggle_class(svg, "helloLogo", true);
    			add_location(svg, file$5, 42, 6, 751);
    			set_style(div, "display", "flex");
    			set_style(div, "flex-direction", "column");
    			set_style(div, "align-items", "center");
    			set_style(div, "justify-content", "flex-start");
    			set_style(div, "position", "relative");
    			set_style(div, "width", "100%");
    			set_style(div, "margin-top", "100px");
    			add_location(div, file$5, 31, 4, 503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, style);
    			append_dev(style, t0);
    			append_dev(svg, path);
    			append_dev(div, t1);
    			mount_component(loading, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(loading);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$4.name,
    		type: "if",
    		source: "(30:2) { #if helloDownload === true }",
    		ctx
    	});

    	return block;
    }

    // (63:2) { #if helloDownload === false }
    function create_if_block_1$4(ctx) {
    	let div4;
    	let t0;
    	let t1;
    	let div0;
    	let span1;
    	let t2;
    	let span0;
    	let t3;
    	let span2;
    	let t4;
    	let div1;
    	let span3;
    	let t6;
    	let div2;
    	let span4;
    	let t8;
    	let div3;
    	let span5;
    	let mounted;
    	let dispose;
    	let if_block0 = /*AUTH*/ ctx[0] == true && create_if_block_3$4(ctx);
    	let if_block1 = /*AUTH*/ ctx[0] == true && create_if_block_2$4(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			t2 = text("главная страница\r\n          ");
    			span0 = element("span");
    			t3 = space();
    			span2 = element("span");
    			t4 = space();
    			div1 = element("div");
    			span3 = element("span");
    			span3.textContent = "о сервисе";
    			t6 = space();
    			div2 = element("div");
    			span4 = element("span");
    			span4.textContent = "конфиденциальность";
    			t8 = space();
    			div3 = element("div");
    			span5 = element("span");
    			span5.textContent = "служба качества";
    			set_style(span0, "display", "block");
    			set_style(span0, "position", "absolute");
    			set_style(span0, "width", "3px");
    			set_style(span0, "height", "20px");
    			set_style(span0, "background-color", "#4300b0");
    			set_style(span0, "top", "50%");
    			set_style(span0, "left", "0");
    			set_style(span0, "margin-top", "-10px");
    			set_style(span0, "margin-left", "-10px");
    			set_style(span0, "border-radius", "2px");
    			add_location(span0, file$5, 155, 10, 4395);
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-16inkut");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$5, 147, 8, 4177);
    			set_style(div0, "margin-top", "6px");
    			toggle_class(div0, "mainViewMenuItem", true);
    			add_location(div0, file$5, 146, 6, 4107);
    			set_style(span2, "display", "block");
    			set_style(span2, "position", "relative");
    			set_style(span2, "width", "80%");
    			set_style(span2, "height", "2px");
    			set_style(span2, "background-color", "gray");
    			set_style(span2, "opacity", "0.4");
    			set_style(span2, "border-radius", "1px");
    			set_style(span2, "margin-top", "20px");
    			add_location(span2, file$5, 171, 6, 4806);
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-16inkut");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$5, 184, 8, 5153);
    			set_style(div1, "margin-top", "18px");
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$5, 183, 6, 5082);
    			set_style(span4, "cursor", "pointer");
    			attr_dev(span4, "class", "svelte-16inkut");
    			toggle_class(span4, "mainViewMenuItemLine", true);
    			add_location(span4, file$5, 195, 8, 5461);
    			set_style(div2, "margin-top", "11px");
    			toggle_class(div2, "mainViewMenuItem", true);
    			add_location(div2, file$5, 194, 6, 5390);
    			set_style(span5, "cursor", "pointer");
    			attr_dev(span5, "class", "svelte-16inkut");
    			toggle_class(span5, "mainViewMenuItemLine", true);
    			add_location(span5, file$5, 206, 8, 5779);
    			set_style(div3, "margin-top", "11px");
    			toggle_class(div3, "mainViewMenuItem", true);
    			add_location(div3, file$5, 205, 6, 5708);
    			set_style(div4, "width", "20%");
    			toggle_class(div4, "mainViewMenu", true);
    			add_location(div4, file$5, 64, 4, 1588);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t0);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(div4, t1);
    			append_dev(div4, div0);
    			append_dev(div0, span1);
    			append_dev(span1, t2);
    			append_dev(span1, span0);
    			append_dev(div4, t3);
    			append_dev(div4, span2);
    			append_dev(div4, t4);
    			append_dev(div4, div1);
    			append_dev(div1, span3);
    			append_dev(div4, t6);
    			append_dev(div4, div2);
    			append_dev(div2, span4);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, span5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*click_handler_5*/ ctx[9], false, false, false),
    					listen_dev(span3, "click", /*click_handler_6*/ ctx[10], false, false, false),
    					listen_dev(span4, "click", /*click_handler_7*/ ctx[11], false, false, false),
    					listen_dev(span5, "click", /*click_handler_8*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*AUTH*/ ctx[0] == true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$4(ctx);
    					if_block0.c();
    					if_block0.m(div4, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*AUTH*/ ctx[0] == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$4(ctx);
    					if_block1.c();
    					if_block1.m(div4, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(63:2) { #if helloDownload === false }",
    		ctx
    	});

    	return block;
    }

    // (67:6) { #if AUTH == true }
    function create_if_block_3$4(ctx) {
    	let div1;
    	let span0;
    	let t1;
    	let div0;
    	let span1;
    	let t3;
    	let span2;
    	let t5;
    	let span3;
    	let t7;
    	let span4;
    	let t9;
    	let span5;
    	let t11;
    	let span6;
    	let t13;
    	let span7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "основное меню hint";
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "мои вопросы";
    			t3 = space();
    			span2 = element("span");
    			span2.textContent = "*";
    			t5 = space();
    			span3 = element("span");
    			span3.textContent = "мои хинты";
    			t7 = space();
    			span4 = element("span");
    			span4.textContent = "*";
    			t9 = space();
    			span5 = element("span");
    			span5.textContent = "новый вопрос";
    			t11 = space();
    			span6 = element("span");
    			span6.textContent = "*";
    			t13 = space();
    			span7 = element("span");
    			span7.textContent = "список вопросов";
    			attr_dev(span0, "class", "svelte-16inkut");
    			toggle_class(span0, "mainViewMenuItemLine", true);
    			add_location(span0, file$5, 69, 10, 1728);
    			set_style(span1, "margin-top", "11px");
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-16inkut");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$5, 71, 12, 1902);
    			set_style(span2, "margin-top", "12px");
    			set_style(span2, "cursor", "pointer");
    			set_style(span2, "color", "#4300b0");
    			set_style(span2, "margin-left", "30px");
    			attr_dev(span2, "class", "svelte-16inkut");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$5, 80, 12, 2190);
    			set_style(span3, "margin-top", "6px");
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-16inkut");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$5, 86, 12, 2405);
    			set_style(span4, "margin-top", "12px");
    			set_style(span4, "cursor", "pointer");
    			set_style(span4, "color", "#4300b0");
    			set_style(span4, "margin-left", "30px");
    			attr_dev(span4, "class", "svelte-16inkut");
    			toggle_class(span4, "mainViewMenuItemLine", true);
    			add_location(span4, file$5, 95, 12, 2686);
    			set_style(span5, "margin-top", "6px");
    			set_style(span5, "cursor", "pointer");
    			attr_dev(span5, "class", "svelte-16inkut");
    			toggle_class(span5, "mainViewMenuItemLine", true);
    			add_location(span5, file$5, 101, 12, 2901);
    			set_style(span6, "margin-top", "12px");
    			set_style(span6, "cursor", "pointer");
    			set_style(span6, "color", "#4300b0");
    			set_style(span6, "margin-left", "30px");
    			attr_dev(span6, "class", "svelte-16inkut");
    			toggle_class(span6, "mainViewMenuItemLine", true);
    			add_location(span6, file$5, 110, 12, 3181);
    			set_style(span7, "margin-top", "6px");
    			set_style(span7, "cursor", "pointer");
    			attr_dev(span7, "class", "svelte-16inkut");
    			toggle_class(span7, "mainViewMenuItemLine", true);
    			add_location(span7, file$5, 116, 12, 3396);
    			set_style(div0, "margin-top", "0px");
    			set_style(div0, "margin-bottom", "0px");
    			attr_dev(div0, "class", "svelte-16inkut");
    			toggle_class(div0, "mainViewMenuItemSub", true);
    			add_location(div0, file$5, 70, 10, 1805);
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$5, 68, 8, 1681);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span1);
    			append_dev(div0, t3);
    			append_dev(div0, span2);
    			append_dev(div0, t5);
    			append_dev(div0, span3);
    			append_dev(div0, t7);
    			append_dev(div0, span4);
    			append_dev(div0, t9);
    			append_dev(div0, span5);
    			append_dev(div0, t11);
    			append_dev(div0, span6);
    			append_dev(div0, t13);
    			append_dev(div0, span7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(span3, "click", /*click_handler_1*/ ctx[5], false, false, false),
    					listen_dev(span5, "click", /*click_handler_2*/ ctx[6], false, false, false),
    					listen_dev(span7, "click", /*click_handler_3*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(67:6) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (131:6) { #if AUTH == true }
    function create_if_block_2$4(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "мои характеристики";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-16inkut");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$5, 133, 8, 3837);
    			set_style(div, "margin-top", "11px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$5, 132, 6, 3766);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_4*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(131:6) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (221:2) { #if helloDownload === false }
    function create_if_block$4(ctx) {
    	let div1;
    	let h3;
    	let i;
    	let t1;
    	let t2;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t3;
    	let img1;
    	let img1_src_value;
    	let t4;
    	let img2;
    	let img2_src_value;
    	let t5;
    	let span;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h3 = element("h3");
    			i = element("i");
    			i.textContent = "HINT";
    			t1 = text(" - советы онлайн по вашим вопросам");
    			t2 = space();
    			div0 = element("div");
    			img0 = element("img");
    			t3 = space();
    			img1 = element("img");
    			t4 = space();
    			img2 = element("img");
    			t5 = space();
    			span = element("span");
    			span.textContent = "Получайте анонимные советы и мнения на вашу проблему - от живых пользователей, совершенно бесплатно. Настраивайте аудиторию, от которой хотите получить совет, оценивайте ответы и давайте советы сами";
    			set_style(i, "font-style", "normal");
    			set_style(i, "letter-spacing", "2px");
    			add_location(i, file$5, 225, 8, 6184);
    			attr_dev(h3, "class", "svelte-16inkut");
    			toggle_class(h3, "mainViewContentTitle", true);
    			add_location(h3, file$5, 224, 6, 6136);
    			attr_dev(img0, "alt", "");
    			if (!src_url_equal(img0.src, img0_src_value = /*titleImage1*/ ctx[2])) attr_dev(img0, "src", img0_src_value);
    			set_style(img0, "display", "block");
    			set_style(img0, "width", "300px");
    			set_style(img0, "margin", "0 auto");
    			set_style(img0, "margin-top", "34px");
    			set_style(img0, "box-shadow", "2px 2px 7px rgb(183, 183, 183), inset -5px -5px 12px white");
    			set_style(img0, "border-radius", "8px");
    			add_location(img0, file$5, 234, 8, 6425);
    			attr_dev(img1, "alt", "");
    			if (!src_url_equal(img1.src, img1_src_value = /*titleImage2*/ ctx[3])) attr_dev(img1, "src", img1_src_value);
    			set_style(img1, "display", "block");
    			set_style(img1, "width", "300px");
    			set_style(img1, "margin", "0 auto");
    			set_style(img1, "margin-top", "34px");
    			set_style(img1, "box-shadow", "2px 2px 7px rgb(183, 183, 183), inset -5px -5px 12px white");
    			set_style(img1, "border-radius", "8px");
    			add_location(img1, file$5, 246, 8, 6767);
    			attr_dev(img2, "alt", "");
    			if (!src_url_equal(img2.src, img2_src_value = /*titleImage1*/ ctx[2])) attr_dev(img2, "src", img2_src_value);
    			set_style(img2, "display", "block");
    			set_style(img2, "width", "300px");
    			set_style(img2, "margin", "0 auto");
    			set_style(img2, "margin-top", "34px");
    			set_style(img2, "box-shadow", "2px 2px 7px rgb(183, 183, 183), inset -5px -5px 12px white");
    			set_style(img2, "border-radius", "8px");
    			add_location(img2, file$5, 258, 8, 7109);
    			set_style(div0, "display", "flex");
    			set_style(div0, "flex-flow", "row");
    			set_style(div0, "gap", "22px");
    			add_location(div0, file$5, 227, 6, 6299);
    			set_style(span, "text-align", "center");
    			set_style(span, "color", "#323835");
    			set_style(span, "opacity", "0.99");
    			set_style(span, "margin", "0 auto");
    			set_style(span, "margin-top", "30px");
    			set_style(span, "line-height", "23px");
    			set_style(span, "display", "block");
    			add_location(span, file$5, 271, 6, 7463);
    			attr_dev(div1, "class", "svelte-16inkut");
    			toggle_class(div1, "mainViewContent", true);
    			add_location(div1, file$5, 222, 4, 6086);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(h3, i);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t3);
    			append_dev(div0, img1);
    			append_dev(div0, t4);
    			append_dev(div0, img2);
    			append_dev(div1, t5);
    			append_dev(div1, span);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(221:2) { #if helloDownload === false }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let current;
    	let if_block0 = /*helloDownload*/ ctx[1] === true && create_if_block_4$4(ctx);
    	let if_block1 = /*helloDownload*/ ctx[1] === false && create_if_block_1$4(ctx);
    	let if_block2 = /*helloDownload*/ ctx[1] === false && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div, "class", "svelte-16inkut");
    			toggle_class(div, "mainView", true);
    			add_location(div, file$5, 27, 0, 432);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*helloDownload*/ ctx[1] === true) {
    				if (if_block0) {
    					if (dirty & /*helloDownload*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4$4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*helloDownload*/ ctx[1] === false) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$4(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*helloDownload*/ ctx[1] === false) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$4(ctx);
    					if_block2.c();
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Unauth', slots, []);
    	let AUTH = false;
    	let titleImage1 = 'image/hintTitle1.png';
    	let titleImage2 = 'image/hintTitle2.png';
    	let helloDownload = true;

    	setTimeout(
    		() => {
    			$$invalidate(1, helloDownload = false);
    		},
    		1400
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Unauth> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		pageRoute.set('my-questions');
    	};

    	const click_handler_1 = () => {
    		pageRoute.set('my-hints');
    	};

    	const click_handler_2 = () => {
    		pageRoute.set('main');
    	};

    	const click_handler_3 = () => {
    		pageRoute.set('list-questions');
    	};

    	const click_handler_4 = () => {
    		pageRoute.set('my-cabinet');
    	};

    	const click_handler_5 = () => {
    		pageRoute.set('unauth');
    	};

    	const click_handler_6 = () => {
    		pageRoute.set('about');
    	};

    	const click_handler_7 = () => {
    		pageRoute.set('polici');
    	};

    	const click_handler_8 = () => {
    		pageRoute.set('support');
    	};

    	$$self.$capture_state = () => ({
    		pageRoute,
    		authCheck,
    		Loading: Loading$1,
    		AUTH,
    		titleImage1,
    		titleImage2,
    		helloDownload
    	});

    	$$self.$inject_state = $$props => {
    		if ('AUTH' in $$props) $$invalidate(0, AUTH = $$props.AUTH);
    		if ('titleImage1' in $$props) $$invalidate(2, titleImage1 = $$props.titleImage1);
    		if ('titleImage2' in $$props) $$invalidate(3, titleImage2 = $$props.titleImage2);
    		if ('helloDownload' in $$props) $$invalidate(1, helloDownload = $$props.helloDownload);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*AUTH*/ 1) {
    			{
    				authCheck.subscribe(value => $$invalidate(0, AUTH = value.auth));
    				console.log(AUTH);
    			}
    		}
    	};

    	return [
    		AUTH,
    		helloDownload,
    		titleImage1,
    		titleImage2,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8
    	];
    }

    class Unauth extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Unauth",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\bricks\views\About.svelte generated by Svelte v3.47.0 */

    const { console: console_1$3 } = globals;
    const file$4 = "src\\bricks\\views\\About.svelte";

    // (29:2) { #if helloDownload === true }
    function create_if_block_4$3(ctx) {
    	let div;
    	let svg;
    	let style;
    	let t0;
    	let path;
    	let t1;
    	let loading;
    	let current;
    	loading = new Loading$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t0 = text("svg.helloLogo { fill:#fdfcf9; margin-bottom: 20px; }\r\n        \r\n        ");
    			path = svg_element("path");
    			t1 = space();
    			create_component(loading.$$.fragment);
    			add_location(style, file$4, 47, 8, 905);
    			attr_dev(path, "d", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z");
    			add_location(path, file$4, 52, 8, 1016);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "60px");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			toggle_class(svg, "helloLogo", true);
    			add_location(svg, file$4, 41, 6, 749);
    			set_style(div, "display", "flex");
    			set_style(div, "flex-direction", "column");
    			set_style(div, "align-items", "center");
    			set_style(div, "justify-content", "flex-start");
    			set_style(div, "position", "relative");
    			set_style(div, "width", "100%");
    			set_style(div, "margin-top", "100px");
    			add_location(div, file$4, 30, 4, 501);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, style);
    			append_dev(style, t0);
    			append_dev(svg, path);
    			append_dev(div, t1);
    			mount_component(loading, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(loading);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(29:2) { #if helloDownload === true }",
    		ctx
    	});

    	return block;
    }

    // (62:2) { #if helloDownload === false }
    function create_if_block_1$3(ctx) {
    	let div4;
    	let t0;
    	let t1;
    	let div0;
    	let span0;
    	let t3;
    	let span1;
    	let t4;
    	let div1;
    	let span3;
    	let t5;
    	let span2;
    	let t6;
    	let div2;
    	let span4;
    	let t8;
    	let div3;
    	let span5;
    	let mounted;
    	let dispose;
    	let if_block0 = /*AUTH*/ ctx[0] == true && create_if_block_3$3(ctx);
    	let if_block1 = /*AUTH*/ ctx[0] == true && create_if_block_2$3(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "главная страница";
    			t3 = space();
    			span1 = element("span");
    			t4 = space();
    			div1 = element("div");
    			span3 = element("span");
    			t5 = text("о сервисе\r\n          ");
    			span2 = element("span");
    			t6 = space();
    			div2 = element("div");
    			span4 = element("span");
    			span4.textContent = "конфиденциальность";
    			t8 = space();
    			div3 = element("div");
    			span5 = element("span");
    			span5.textContent = "служба качества";
    			set_style(span0, "cursor", "pointer");
    			attr_dev(span0, "class", "svelte-16inkut");
    			toggle_class(span0, "mainViewMenuItemLine", true);
    			add_location(span0, file$4, 146, 8, 4197);
    			set_style(div0, "margin-top", "6px");
    			toggle_class(div0, "mainViewMenuItem", true);
    			add_location(div0, file$4, 145, 6, 4127);
    			set_style(span1, "display", "block");
    			set_style(span1, "position", "relative");
    			set_style(span1, "width", "80%");
    			set_style(span1, "height", "2px");
    			set_style(span1, "background-color", "gray");
    			set_style(span1, "opacity", "0.4");
    			set_style(span1, "border-radius", "1px");
    			set_style(span1, "margin-top", "20px");
    			add_location(span1, file$4, 156, 6, 4442);
    			set_style(span2, "display", "block");
    			set_style(span2, "position", "absolute");
    			set_style(span2, "width", "3px");
    			set_style(span2, "height", "20px");
    			set_style(span2, "background-color", "#4300b0");
    			set_style(span2, "top", "50%");
    			set_style(span2, "left", "0");
    			set_style(span2, "margin-top", "-10px");
    			set_style(span2, "margin-left", "-10px");
    			set_style(span2, "border-radius", "2px");
    			add_location(span2, file$4, 177, 10, 4999);
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-16inkut");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$4, 169, 8, 4789);
    			set_style(div1, "margin-top", "18px");
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$4, 168, 6, 4718);
    			set_style(span4, "cursor", "pointer");
    			attr_dev(span4, "class", "svelte-16inkut");
    			toggle_class(span4, "mainViewMenuItemLine", true);
    			add_location(span4, file$4, 194, 8, 5481);
    			set_style(div2, "margin-top", "11px");
    			toggle_class(div2, "mainViewMenuItem", true);
    			add_location(div2, file$4, 193, 6, 5410);
    			set_style(span5, "cursor", "pointer");
    			attr_dev(span5, "class", "svelte-16inkut");
    			toggle_class(span5, "mainViewMenuItemLine", true);
    			add_location(span5, file$4, 205, 8, 5799);
    			set_style(div3, "margin-top", "11px");
    			toggle_class(div3, "mainViewMenuItem", true);
    			add_location(div3, file$4, 204, 6, 5728);
    			set_style(div4, "width", "20%");
    			toggle_class(div4, "mainViewMenu", true);
    			add_location(div4, file$4, 63, 4, 1586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t0);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(div4, t1);
    			append_dev(div4, div0);
    			append_dev(div0, span0);
    			append_dev(div4, t3);
    			append_dev(div4, span1);
    			append_dev(div4, t4);
    			append_dev(div4, div1);
    			append_dev(div1, span3);
    			append_dev(span3, t5);
    			append_dev(span3, span2);
    			append_dev(div4, t6);
    			append_dev(div4, div2);
    			append_dev(div2, span4);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, span5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span0, "click", /*click_handler_5*/ ctx[9], false, false, false),
    					listen_dev(span3, "click", /*click_handler_6*/ ctx[10], false, false, false),
    					listen_dev(span4, "click", /*click_handler_7*/ ctx[11], false, false, false),
    					listen_dev(span5, "click", /*click_handler_8*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*AUTH*/ ctx[0] == true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$3(ctx);
    					if_block0.c();
    					if_block0.m(div4, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*AUTH*/ ctx[0] == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$3(ctx);
    					if_block1.c();
    					if_block1.m(div4, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(62:2) { #if helloDownload === false }",
    		ctx
    	});

    	return block;
    }

    // (66:6) { #if AUTH == true }
    function create_if_block_3$3(ctx) {
    	let div1;
    	let span0;
    	let t1;
    	let div0;
    	let span1;
    	let t3;
    	let span2;
    	let t5;
    	let span3;
    	let t7;
    	let span4;
    	let t9;
    	let span5;
    	let t11;
    	let span6;
    	let t13;
    	let span7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "основное меню hint";
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "мои вопросы";
    			t3 = space();
    			span2 = element("span");
    			span2.textContent = "*";
    			t5 = space();
    			span3 = element("span");
    			span3.textContent = "мои хинты";
    			t7 = space();
    			span4 = element("span");
    			span4.textContent = "*";
    			t9 = space();
    			span5 = element("span");
    			span5.textContent = "новый вопрос";
    			t11 = space();
    			span6 = element("span");
    			span6.textContent = "*";
    			t13 = space();
    			span7 = element("span");
    			span7.textContent = "список вопросов";
    			attr_dev(span0, "class", "svelte-16inkut");
    			toggle_class(span0, "mainViewMenuItemLine", true);
    			add_location(span0, file$4, 68, 10, 1726);
    			set_style(span1, "margin-top", "11px");
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-16inkut");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$4, 70, 12, 1900);
    			set_style(span2, "margin-top", "12px");
    			set_style(span2, "cursor", "pointer");
    			set_style(span2, "color", "#4300b0");
    			set_style(span2, "margin-left", "30px");
    			attr_dev(span2, "class", "svelte-16inkut");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$4, 79, 12, 2188);
    			set_style(span3, "margin-top", "6px");
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-16inkut");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$4, 85, 12, 2403);
    			set_style(span4, "margin-top", "12px");
    			set_style(span4, "cursor", "pointer");
    			set_style(span4, "color", "#4300b0");
    			set_style(span4, "margin-left", "30px");
    			attr_dev(span4, "class", "svelte-16inkut");
    			toggle_class(span4, "mainViewMenuItemLine", true);
    			add_location(span4, file$4, 94, 12, 2684);
    			set_style(span5, "margin-top", "6px");
    			set_style(span5, "cursor", "pointer");
    			attr_dev(span5, "class", "svelte-16inkut");
    			toggle_class(span5, "mainViewMenuItemLine", true);
    			add_location(span5, file$4, 100, 12, 2899);
    			set_style(span6, "margin-top", "12px");
    			set_style(span6, "cursor", "pointer");
    			set_style(span6, "color", "#4300b0");
    			set_style(span6, "margin-left", "30px");
    			attr_dev(span6, "class", "svelte-16inkut");
    			toggle_class(span6, "mainViewMenuItemLine", true);
    			add_location(span6, file$4, 109, 12, 3179);
    			set_style(span7, "margin-top", "6px");
    			set_style(span7, "cursor", "pointer");
    			attr_dev(span7, "class", "svelte-16inkut");
    			toggle_class(span7, "mainViewMenuItemLine", true);
    			add_location(span7, file$4, 115, 12, 3394);
    			set_style(div0, "margin-top", "0px");
    			set_style(div0, "margin-bottom", "0px");
    			attr_dev(div0, "class", "svelte-16inkut");
    			toggle_class(div0, "mainViewMenuItemSub", true);
    			add_location(div0, file$4, 69, 10, 1803);
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$4, 67, 8, 1679);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span1);
    			append_dev(div0, t3);
    			append_dev(div0, span2);
    			append_dev(div0, t5);
    			append_dev(div0, span3);
    			append_dev(div0, t7);
    			append_dev(div0, span4);
    			append_dev(div0, t9);
    			append_dev(div0, span5);
    			append_dev(div0, t11);
    			append_dev(div0, span6);
    			append_dev(div0, t13);
    			append_dev(div0, span7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(span3, "click", /*click_handler_1*/ ctx[5], false, false, false),
    					listen_dev(span5, "click", /*click_handler_2*/ ctx[6], false, false, false),
    					listen_dev(span7, "click", /*click_handler_3*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(66:6) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (130:6) { #if AUTH == true }
    function create_if_block_2$3(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "мои характеристики";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-16inkut");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$4, 132, 10, 3839);
    			set_style(div, "margin-top", "11px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$4, 131, 8, 3766);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_4*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(130:6) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (220:2) { #if helloDownload === false }
    function create_if_block$3(ctx) {
    	let div1;
    	let h3;
    	let i;
    	let t1;
    	let t2;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t3;
    	let img1;
    	let img1_src_value;
    	let t4;
    	let img2;
    	let img2_src_value;
    	let t5;
    	let span;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h3 = element("h3");
    			i = element("i");
    			i.textContent = "HINT";
    			t1 = text(" - для чего нужен наш сервис?");
    			t2 = space();
    			div0 = element("div");
    			img0 = element("img");
    			t3 = space();
    			img1 = element("img");
    			t4 = space();
    			img2 = element("img");
    			t5 = space();
    			span = element("span");
    			span.textContent = "Получайте анонимные советы и мнения на вашу проблему - от живых пользователей, совершенно бесплатно. Настраивайте аудиторию, от которой хотите получить совет, оценивайте ответы и давайте советы сами";
    			set_style(i, "font-style", "normal");
    			set_style(i, "letter-spacing", "2px");
    			add_location(i, file$4, 224, 8, 6204);
    			attr_dev(h3, "class", "svelte-16inkut");
    			toggle_class(h3, "mainViewContentTitle", true);
    			add_location(h3, file$4, 223, 6, 6156);
    			attr_dev(img0, "alt", "");
    			if (!src_url_equal(img0.src, img0_src_value = /*titleImage1*/ ctx[2])) attr_dev(img0, "src", img0_src_value);
    			set_style(img0, "display", "block");
    			set_style(img0, "width", "300px");
    			set_style(img0, "margin", "0 auto");
    			set_style(img0, "margin-top", "34px");
    			set_style(img0, "box-shadow", "2px 2px 7px rgb(183, 183, 183), inset -5px -5px 12px white");
    			set_style(img0, "border-radius", "8px");
    			add_location(img0, file$4, 233, 8, 6440);
    			attr_dev(img1, "alt", "");
    			if (!src_url_equal(img1.src, img1_src_value = /*titleImage2*/ ctx[3])) attr_dev(img1, "src", img1_src_value);
    			set_style(img1, "display", "block");
    			set_style(img1, "width", "300px");
    			set_style(img1, "margin", "0 auto");
    			set_style(img1, "margin-top", "34px");
    			set_style(img1, "box-shadow", "2px 2px 7px rgb(183, 183, 183), inset -5px -5px 12px white");
    			set_style(img1, "border-radius", "8px");
    			add_location(img1, file$4, 245, 8, 6782);
    			attr_dev(img2, "alt", "");
    			if (!src_url_equal(img2.src, img2_src_value = /*titleImage1*/ ctx[2])) attr_dev(img2, "src", img2_src_value);
    			set_style(img2, "display", "block");
    			set_style(img2, "width", "300px");
    			set_style(img2, "margin", "0 auto");
    			set_style(img2, "margin-top", "34px");
    			set_style(img2, "box-shadow", "2px 2px 7px rgb(183, 183, 183), inset -5px -5px 12px white");
    			set_style(img2, "border-radius", "8px");
    			add_location(img2, file$4, 257, 8, 7124);
    			set_style(div0, "display", "flex");
    			set_style(div0, "flex-flow", "row");
    			set_style(div0, "gap", "22px");
    			add_location(div0, file$4, 226, 6, 6314);
    			set_style(span, "text-align", "center");
    			set_style(span, "color", "#323835");
    			set_style(span, "opacity", "0.99");
    			set_style(span, "margin", "0 auto");
    			set_style(span, "margin-top", "30px");
    			set_style(span, "line-height", "23px");
    			set_style(span, "display", "block");
    			add_location(span, file$4, 270, 6, 7478);
    			attr_dev(div1, "class", "svelte-16inkut");
    			toggle_class(div1, "mainViewContent", true);
    			add_location(div1, file$4, 221, 4, 6106);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(h3, i);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t3);
    			append_dev(div0, img1);
    			append_dev(div0, t4);
    			append_dev(div0, img2);
    			append_dev(div1, t5);
    			append_dev(div1, span);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(220:2) { #if helloDownload === false }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let current;
    	let if_block0 = /*helloDownload*/ ctx[1] === true && create_if_block_4$3(ctx);
    	let if_block1 = /*helloDownload*/ ctx[1] === false && create_if_block_1$3(ctx);
    	let if_block2 = /*helloDownload*/ ctx[1] === false && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div, "class", "svelte-16inkut");
    			toggle_class(div, "mainView", true);
    			add_location(div, file$4, 26, 0, 430);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*helloDownload*/ ctx[1] === true) {
    				if (if_block0) {
    					if (dirty & /*helloDownload*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*helloDownload*/ ctx[1] === false) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$3(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*helloDownload*/ ctx[1] === false) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$3(ctx);
    					if_block2.c();
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	let AUTH = false;
    	let titleImage1 = 'image/hintTitle1.png';
    	let titleImage2 = 'image/hintTitle2.png';
    	let helloDownload = true;

    	setTimeout(
    		() => {
    			$$invalidate(1, helloDownload = false);
    		},
    		1400
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		pageRoute.set('my-questions');
    	};

    	const click_handler_1 = () => {
    		pageRoute.set('my-hints');
    	};

    	const click_handler_2 = () => {
    		pageRoute.set('main');
    	};

    	const click_handler_3 = () => {
    		pageRoute.set('list-questions');
    	};

    	const click_handler_4 = () => {
    		pageRoute.set('my-cabinet');
    	};

    	const click_handler_5 = () => {
    		pageRoute.set('unauth');
    	};

    	const click_handler_6 = () => {
    		pageRoute.set('about');
    	};

    	const click_handler_7 = () => {
    		pageRoute.set('polici');
    	};

    	const click_handler_8 = () => {
    		pageRoute.set('support');
    	};

    	$$self.$capture_state = () => ({
    		pageRoute,
    		authCheck,
    		Loading: Loading$1,
    		AUTH,
    		titleImage1,
    		titleImage2,
    		helloDownload
    	});

    	$$self.$inject_state = $$props => {
    		if ('AUTH' in $$props) $$invalidate(0, AUTH = $$props.AUTH);
    		if ('titleImage1' in $$props) $$invalidate(2, titleImage1 = $$props.titleImage1);
    		if ('titleImage2' in $$props) $$invalidate(3, titleImage2 = $$props.titleImage2);
    		if ('helloDownload' in $$props) $$invalidate(1, helloDownload = $$props.helloDownload);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*AUTH*/ 1) {
    			{
    				authCheck.subscribe(value => $$invalidate(0, AUTH = value.auth));
    				console.log(AUTH);
    			}
    		}
    	};

    	return [
    		AUTH,
    		helloDownload,
    		titleImage1,
    		titleImage2,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8
    	];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\bricks\views\Polici.svelte generated by Svelte v3.47.0 */

    const { console: console_1$2 } = globals;
    const file$3 = "src\\bricks\\views\\Polici.svelte";

    // (30:2) { #if helloDownload === true }
    function create_if_block_4$2(ctx) {
    	let div;
    	let svg;
    	let style;
    	let t0;
    	let path;
    	let t1;
    	let loading;
    	let current;
    	loading = new Loading$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t0 = text("svg.helloLogo { fill:#fdfcf9; margin-bottom: 20px; }\r\n        \r\n        ");
    			path = svg_element("path");
    			t1 = space();
    			create_component(loading.$$.fragment);
    			add_location(style, file$3, 48, 8, 907);
    			attr_dev(path, "d", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z");
    			add_location(path, file$3, 53, 8, 1018);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "60px");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			toggle_class(svg, "helloLogo", true);
    			add_location(svg, file$3, 42, 6, 751);
    			set_style(div, "display", "flex");
    			set_style(div, "flex-direction", "column");
    			set_style(div, "align-items", "center");
    			set_style(div, "justify-content", "flex-start");
    			set_style(div, "position", "relative");
    			set_style(div, "width", "100%");
    			set_style(div, "margin-top", "100px");
    			add_location(div, file$3, 31, 4, 503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, style);
    			append_dev(style, t0);
    			append_dev(svg, path);
    			append_dev(div, t1);
    			mount_component(loading, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(loading);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(30:2) { #if helloDownload === true }",
    		ctx
    	});

    	return block;
    }

    // (63:2) { #if helloDownload === false }
    function create_if_block_1$2(ctx) {
    	let div4;
    	let t0;
    	let t1;
    	let div0;
    	let span0;
    	let t3;
    	let span1;
    	let t4;
    	let div1;
    	let span2;
    	let t6;
    	let div2;
    	let span4;
    	let t7;
    	let span3;
    	let t8;
    	let div3;
    	let span5;
    	let mounted;
    	let dispose;
    	let if_block0 = /*AUTH*/ ctx[0] == true && create_if_block_3$2(ctx);
    	let if_block1 = /*AUTH*/ ctx[0] == true && create_if_block_2$2(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "главная страница";
    			t3 = space();
    			span1 = element("span");
    			t4 = space();
    			div1 = element("div");
    			span2 = element("span");
    			span2.textContent = "о сервисе";
    			t6 = space();
    			div2 = element("div");
    			span4 = element("span");
    			t7 = text("конфиденциальность\r\n          ");
    			span3 = element("span");
    			t8 = space();
    			div3 = element("div");
    			span5 = element("span");
    			span5.textContent = "служба качества";
    			set_style(span0, "cursor", "pointer");
    			attr_dev(span0, "class", "svelte-16inkut");
    			toggle_class(span0, "mainViewMenuItemLine", true);
    			add_location(span0, file$3, 147, 8, 4199);
    			set_style(div0, "margin-top", "6px");
    			toggle_class(div0, "mainViewMenuItem", true);
    			add_location(div0, file$3, 146, 6, 4129);
    			set_style(span1, "display", "block");
    			set_style(span1, "position", "relative");
    			set_style(span1, "width", "80%");
    			set_style(span1, "height", "2px");
    			set_style(span1, "background-color", "gray");
    			set_style(span1, "opacity", "0.4");
    			set_style(span1, "border-radius", "1px");
    			set_style(span1, "margin-top", "20px");
    			add_location(span1, file$3, 157, 6, 4444);
    			set_style(span2, "cursor", "pointer");
    			attr_dev(span2, "class", "svelte-16inkut");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$3, 170, 8, 4791);
    			set_style(div1, "margin-top", "18px");
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$3, 169, 6, 4720);
    			set_style(span3, "display", "block");
    			set_style(span3, "position", "absolute");
    			set_style(span3, "width", "3px");
    			set_style(span3, "height", "20px");
    			set_style(span3, "background-color", "#4300b0");
    			set_style(span3, "top", "50%");
    			set_style(span3, "left", "0");
    			set_style(span3, "margin-top", "-10px");
    			set_style(span3, "margin-left", "-10px");
    			set_style(span3, "border-radius", "2px");
    			add_location(span3, file$3, 189, 10, 5319);
    			set_style(span4, "cursor", "pointer");
    			attr_dev(span4, "class", "svelte-16inkut");
    			toggle_class(span4, "mainViewMenuItemLine", true);
    			add_location(span4, file$3, 181, 8, 5099);
    			set_style(div2, "margin-top", "11px");
    			toggle_class(div2, "mainViewMenuItem", true);
    			add_location(div2, file$3, 180, 6, 5028);
    			set_style(span5, "cursor", "pointer");
    			attr_dev(span5, "class", "svelte-16inkut");
    			toggle_class(span5, "mainViewMenuItemLine", true);
    			add_location(span5, file$3, 206, 8, 5801);
    			set_style(div3, "margin-top", "11px");
    			toggle_class(div3, "mainViewMenuItem", true);
    			add_location(div3, file$3, 205, 6, 5730);
    			set_style(div4, "width", "20%");
    			toggle_class(div4, "mainViewMenu", true);
    			add_location(div4, file$3, 64, 4, 1588);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t0);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(div4, t1);
    			append_dev(div4, div0);
    			append_dev(div0, span0);
    			append_dev(div4, t3);
    			append_dev(div4, span1);
    			append_dev(div4, t4);
    			append_dev(div4, div1);
    			append_dev(div1, span2);
    			append_dev(div4, t6);
    			append_dev(div4, div2);
    			append_dev(div2, span4);
    			append_dev(span4, t7);
    			append_dev(span4, span3);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, span5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span0, "click", /*click_handler_5*/ ctx[9], false, false, false),
    					listen_dev(span2, "click", /*click_handler_6*/ ctx[10], false, false, false),
    					listen_dev(span4, "click", /*click_handler_7*/ ctx[11], false, false, false),
    					listen_dev(span5, "click", /*click_handler_8*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*AUTH*/ ctx[0] == true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$2(ctx);
    					if_block0.c();
    					if_block0.m(div4, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*AUTH*/ ctx[0] == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$2(ctx);
    					if_block1.c();
    					if_block1.m(div4, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(63:2) { #if helloDownload === false }",
    		ctx
    	});

    	return block;
    }

    // (67:6) { #if AUTH == true }
    function create_if_block_3$2(ctx) {
    	let div1;
    	let span0;
    	let t1;
    	let div0;
    	let span1;
    	let t3;
    	let span2;
    	let t5;
    	let span3;
    	let t7;
    	let span4;
    	let t9;
    	let span5;
    	let t11;
    	let span6;
    	let t13;
    	let span7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "основное меню hint";
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "мои вопросы";
    			t3 = space();
    			span2 = element("span");
    			span2.textContent = "*";
    			t5 = space();
    			span3 = element("span");
    			span3.textContent = "мои хинты";
    			t7 = space();
    			span4 = element("span");
    			span4.textContent = "*";
    			t9 = space();
    			span5 = element("span");
    			span5.textContent = "новый вопрос";
    			t11 = space();
    			span6 = element("span");
    			span6.textContent = "*";
    			t13 = space();
    			span7 = element("span");
    			span7.textContent = "список вопросов";
    			attr_dev(span0, "class", "svelte-16inkut");
    			toggle_class(span0, "mainViewMenuItemLine", true);
    			add_location(span0, file$3, 69, 10, 1728);
    			set_style(span1, "margin-top", "11px");
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-16inkut");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$3, 71, 12, 1902);
    			set_style(span2, "margin-top", "12px");
    			set_style(span2, "cursor", "pointer");
    			set_style(span2, "color", "#4300b0");
    			set_style(span2, "margin-left", "30px");
    			attr_dev(span2, "class", "svelte-16inkut");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$3, 80, 12, 2190);
    			set_style(span3, "margin-top", "6px");
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-16inkut");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$3, 86, 12, 2405);
    			set_style(span4, "margin-top", "12px");
    			set_style(span4, "cursor", "pointer");
    			set_style(span4, "color", "#4300b0");
    			set_style(span4, "margin-left", "30px");
    			attr_dev(span4, "class", "svelte-16inkut");
    			toggle_class(span4, "mainViewMenuItemLine", true);
    			add_location(span4, file$3, 95, 12, 2686);
    			set_style(span5, "margin-top", "6px");
    			set_style(span5, "cursor", "pointer");
    			attr_dev(span5, "class", "svelte-16inkut");
    			toggle_class(span5, "mainViewMenuItemLine", true);
    			add_location(span5, file$3, 101, 12, 2901);
    			set_style(span6, "margin-top", "12px");
    			set_style(span6, "cursor", "pointer");
    			set_style(span6, "color", "#4300b0");
    			set_style(span6, "margin-left", "30px");
    			attr_dev(span6, "class", "svelte-16inkut");
    			toggle_class(span6, "mainViewMenuItemLine", true);
    			add_location(span6, file$3, 110, 12, 3181);
    			set_style(span7, "margin-top", "6px");
    			set_style(span7, "cursor", "pointer");
    			attr_dev(span7, "class", "svelte-16inkut");
    			toggle_class(span7, "mainViewMenuItemLine", true);
    			add_location(span7, file$3, 116, 12, 3396);
    			set_style(div0, "margin-top", "0px");
    			set_style(div0, "margin-bottom", "0px");
    			attr_dev(div0, "class", "svelte-16inkut");
    			toggle_class(div0, "mainViewMenuItemSub", true);
    			add_location(div0, file$3, 70, 10, 1805);
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$3, 68, 8, 1681);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span1);
    			append_dev(div0, t3);
    			append_dev(div0, span2);
    			append_dev(div0, t5);
    			append_dev(div0, span3);
    			append_dev(div0, t7);
    			append_dev(div0, span4);
    			append_dev(div0, t9);
    			append_dev(div0, span5);
    			append_dev(div0, t11);
    			append_dev(div0, span6);
    			append_dev(div0, t13);
    			append_dev(div0, span7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(span3, "click", /*click_handler_1*/ ctx[5], false, false, false),
    					listen_dev(span5, "click", /*click_handler_2*/ ctx[6], false, false, false),
    					listen_dev(span7, "click", /*click_handler_3*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(67:6) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (131:6) { #if AUTH == true }
    function create_if_block_2$2(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "мои характеристики";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-16inkut");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$3, 133, 10, 3841);
    			set_style(div, "margin-top", "11px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$3, 132, 8, 3768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_4*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(131:6) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (221:2) { #if helloDownload === false }
    function create_if_block$2(ctx) {
    	let div1;
    	let h3;
    	let i;
    	let t1;
    	let t2;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t3;
    	let img1;
    	let img1_src_value;
    	let t4;
    	let img2;
    	let img2_src_value;
    	let t5;
    	let span;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h3 = element("h3");
    			i = element("i");
    			i.textContent = "HINT";
    			t1 = text(" - политика анонимности пользователей");
    			t2 = space();
    			div0 = element("div");
    			img0 = element("img");
    			t3 = space();
    			img1 = element("img");
    			t4 = space();
    			img2 = element("img");
    			t5 = space();
    			span = element("span");
    			span.textContent = "Получайте анонимные советы и мнения на вашу проблему - от живых пользователей, совершенно бесплатно. Настраивайте аудиторию, от которой хотите получить совет, оценивайте ответы и давайте советы сами";
    			set_style(i, "font-style", "normal");
    			set_style(i, "letter-spacing", "2px");
    			add_location(i, file$3, 225, 8, 6206);
    			attr_dev(h3, "class", "svelte-16inkut");
    			toggle_class(h3, "mainViewContentTitle", true);
    			add_location(h3, file$3, 224, 6, 6158);
    			attr_dev(img0, "alt", "");
    			if (!src_url_equal(img0.src, img0_src_value = /*titleImage1*/ ctx[2])) attr_dev(img0, "src", img0_src_value);
    			set_style(img0, "display", "block");
    			set_style(img0, "width", "300px");
    			set_style(img0, "margin", "0 auto");
    			set_style(img0, "margin-top", "34px");
    			set_style(img0, "box-shadow", "2px 2px 7px rgb(183, 183, 183), inset -5px -5px 12px white");
    			set_style(img0, "border-radius", "8px");
    			add_location(img0, file$3, 234, 8, 6450);
    			attr_dev(img1, "alt", "");
    			if (!src_url_equal(img1.src, img1_src_value = /*titleImage2*/ ctx[3])) attr_dev(img1, "src", img1_src_value);
    			set_style(img1, "display", "block");
    			set_style(img1, "width", "300px");
    			set_style(img1, "margin", "0 auto");
    			set_style(img1, "margin-top", "34px");
    			set_style(img1, "box-shadow", "2px 2px 7px rgb(183, 183, 183), inset -5px -5px 12px white");
    			set_style(img1, "border-radius", "8px");
    			add_location(img1, file$3, 246, 8, 6792);
    			attr_dev(img2, "alt", "");
    			if (!src_url_equal(img2.src, img2_src_value = /*titleImage1*/ ctx[2])) attr_dev(img2, "src", img2_src_value);
    			set_style(img2, "display", "block");
    			set_style(img2, "width", "300px");
    			set_style(img2, "margin", "0 auto");
    			set_style(img2, "margin-top", "34px");
    			set_style(img2, "box-shadow", "2px 2px 7px rgb(183, 183, 183), inset -5px -5px 12px white");
    			set_style(img2, "border-radius", "8px");
    			add_location(img2, file$3, 258, 8, 7134);
    			set_style(div0, "display", "flex");
    			set_style(div0, "flex-flow", "row");
    			set_style(div0, "gap", "22px");
    			add_location(div0, file$3, 227, 6, 6324);
    			set_style(span, "text-align", "center");
    			set_style(span, "color", "#323835");
    			set_style(span, "opacity", "0.99");
    			set_style(span, "margin", "0 auto");
    			set_style(span, "margin-top", "30px");
    			set_style(span, "line-height", "23px");
    			set_style(span, "display", "block");
    			add_location(span, file$3, 271, 6, 7488);
    			attr_dev(div1, "class", "svelte-16inkut");
    			toggle_class(div1, "mainViewContent", true);
    			add_location(div1, file$3, 222, 4, 6108);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(h3, i);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t3);
    			append_dev(div0, img1);
    			append_dev(div0, t4);
    			append_dev(div0, img2);
    			append_dev(div1, t5);
    			append_dev(div1, span);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(221:2) { #if helloDownload === false }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let current;
    	let if_block0 = /*helloDownload*/ ctx[1] === true && create_if_block_4$2(ctx);
    	let if_block1 = /*helloDownload*/ ctx[1] === false && create_if_block_1$2(ctx);
    	let if_block2 = /*helloDownload*/ ctx[1] === false && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div, "class", "svelte-16inkut");
    			toggle_class(div, "mainView", true);
    			add_location(div, file$3, 27, 0, 432);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*helloDownload*/ ctx[1] === true) {
    				if (if_block0) {
    					if (dirty & /*helloDownload*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*helloDownload*/ ctx[1] === false) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*helloDownload*/ ctx[1] === false) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$2(ctx);
    					if_block2.c();
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Polici', slots, []);
    	let AUTH = false;
    	let titleImage1 = 'image/hintTitle1.png';
    	let titleImage2 = 'image/hintTitle2.png';
    	let helloDownload = true;

    	setTimeout(
    		() => {
    			$$invalidate(1, helloDownload = false);
    		},
    		1400
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Polici> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		pageRoute.set('my-questions');
    	};

    	const click_handler_1 = () => {
    		pageRoute.set('my-hints');
    	};

    	const click_handler_2 = () => {
    		pageRoute.set('main');
    	};

    	const click_handler_3 = () => {
    		pageRoute.set('list-questions');
    	};

    	const click_handler_4 = () => {
    		pageRoute.set('my-cabinet');
    	};

    	const click_handler_5 = () => {
    		pageRoute.set('unauth');
    	};

    	const click_handler_6 = () => {
    		pageRoute.set('about');
    	};

    	const click_handler_7 = () => {
    		pageRoute.set('polici');
    	};

    	const click_handler_8 = () => {
    		pageRoute.set('support');
    	};

    	$$self.$capture_state = () => ({
    		pageRoute,
    		authCheck,
    		Loading: Loading$1,
    		AUTH,
    		titleImage1,
    		titleImage2,
    		helloDownload
    	});

    	$$self.$inject_state = $$props => {
    		if ('AUTH' in $$props) $$invalidate(0, AUTH = $$props.AUTH);
    		if ('titleImage1' in $$props) $$invalidate(2, titleImage1 = $$props.titleImage1);
    		if ('titleImage2' in $$props) $$invalidate(3, titleImage2 = $$props.titleImage2);
    		if ('helloDownload' in $$props) $$invalidate(1, helloDownload = $$props.helloDownload);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*AUTH*/ 1) {
    			{
    				authCheck.subscribe(value => $$invalidate(0, AUTH = value.auth));
    				console.log(AUTH);
    			}
    		}
    	};

    	return [
    		AUTH,
    		helloDownload,
    		titleImage1,
    		titleImage2,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8
    	];
    }

    class Polici extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Polici",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\bricks\views\Support.svelte generated by Svelte v3.47.0 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\bricks\\views\\Support.svelte";

    // (30:2) { #if helloDownload === true }
    function create_if_block_4$1(ctx) {
    	let div;
    	let svg;
    	let style;
    	let t0;
    	let path;
    	let t1;
    	let loading;
    	let current;
    	loading = new Loading$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t0 = text("svg.helloLogo { fill:#fdfcf9; margin-bottom: 20px; }\r\n        \r\n        ");
    			path = svg_element("path");
    			t1 = space();
    			create_component(loading.$$.fragment);
    			add_location(style, file$2, 48, 8, 907);
    			attr_dev(path, "d", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z");
    			add_location(path, file$2, 53, 8, 1018);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "60px");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			toggle_class(svg, "helloLogo", true);
    			add_location(svg, file$2, 42, 6, 751);
    			set_style(div, "display", "flex");
    			set_style(div, "flex-direction", "column");
    			set_style(div, "align-items", "center");
    			set_style(div, "justify-content", "flex-start");
    			set_style(div, "position", "relative");
    			set_style(div, "width", "100%");
    			set_style(div, "margin-top", "100px");
    			add_location(div, file$2, 31, 4, 503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, style);
    			append_dev(style, t0);
    			append_dev(svg, path);
    			append_dev(div, t1);
    			mount_component(loading, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(loading);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(30:2) { #if helloDownload === true }",
    		ctx
    	});

    	return block;
    }

    // (63:2) { #if helloDownload === false }
    function create_if_block_1$1(ctx) {
    	let div4;
    	let t0;
    	let t1;
    	let div0;
    	let span0;
    	let t3;
    	let span1;
    	let t4;
    	let div1;
    	let span2;
    	let t6;
    	let div2;
    	let span3;
    	let t8;
    	let div3;
    	let span5;
    	let t9;
    	let span4;
    	let mounted;
    	let dispose;
    	let if_block0 = /*AUTH*/ ctx[0] == true && create_if_block_3$1(ctx);
    	let if_block1 = /*AUTH*/ ctx[0] == true && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "главная страница";
    			t3 = space();
    			span1 = element("span");
    			t4 = space();
    			div1 = element("div");
    			span2 = element("span");
    			span2.textContent = "о сервисе";
    			t6 = space();
    			div2 = element("div");
    			span3 = element("span");
    			span3.textContent = "конфиденциальность";
    			t8 = space();
    			div3 = element("div");
    			span5 = element("span");
    			t9 = text("служба качества\r\n          ");
    			span4 = element("span");
    			set_style(span0, "cursor", "pointer");
    			attr_dev(span0, "class", "svelte-16inkut");
    			toggle_class(span0, "mainViewMenuItemLine", true);
    			add_location(span0, file$2, 147, 8, 4199);
    			set_style(div0, "margin-top", "6px");
    			toggle_class(div0, "mainViewMenuItem", true);
    			add_location(div0, file$2, 146, 6, 4129);
    			set_style(span1, "display", "block");
    			set_style(span1, "position", "relative");
    			set_style(span1, "width", "80%");
    			set_style(span1, "height", "2px");
    			set_style(span1, "background-color", "gray");
    			set_style(span1, "opacity", "0.4");
    			set_style(span1, "border-radius", "1px");
    			set_style(span1, "margin-top", "20px");
    			add_location(span1, file$2, 157, 6, 4444);
    			set_style(span2, "cursor", "pointer");
    			attr_dev(span2, "class", "svelte-16inkut");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$2, 170, 8, 4791);
    			set_style(div1, "margin-top", "18px");
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$2, 169, 6, 4720);
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-16inkut");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$2, 181, 8, 5099);
    			set_style(div2, "margin-top", "11px");
    			toggle_class(div2, "mainViewMenuItem", true);
    			add_location(div2, file$2, 180, 6, 5028);
    			set_style(span4, "display", "block");
    			set_style(span4, "position", "absolute");
    			set_style(span4, "width", "3px");
    			set_style(span4, "height", "20px");
    			set_style(span4, "background-color", "#4300b0");
    			set_style(span4, "top", "50%");
    			set_style(span4, "left", "0");
    			set_style(span4, "margin-top", "-10px");
    			set_style(span4, "margin-left", "-10px");
    			set_style(span4, "border-radius", "2px");
    			add_location(span4, file$2, 200, 10, 5635);
    			set_style(span5, "cursor", "pointer");
    			attr_dev(span5, "class", "svelte-16inkut");
    			toggle_class(span5, "mainViewMenuItemLine", true);
    			add_location(span5, file$2, 192, 8, 5417);
    			set_style(div3, "margin-top", "11px");
    			toggle_class(div3, "mainViewMenuItem", true);
    			add_location(div3, file$2, 191, 6, 5346);
    			set_style(div4, "width", "20%");
    			toggle_class(div4, "mainViewMenu", true);
    			add_location(div4, file$2, 64, 4, 1588);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t0);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(div4, t1);
    			append_dev(div4, div0);
    			append_dev(div0, span0);
    			append_dev(div4, t3);
    			append_dev(div4, span1);
    			append_dev(div4, t4);
    			append_dev(div4, div1);
    			append_dev(div1, span2);
    			append_dev(div4, t6);
    			append_dev(div4, div2);
    			append_dev(div2, span3);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, span5);
    			append_dev(span5, t9);
    			append_dev(span5, span4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span0, "click", /*click_handler_5*/ ctx[9], false, false, false),
    					listen_dev(span2, "click", /*click_handler_6*/ ctx[10], false, false, false),
    					listen_dev(span3, "click", /*click_handler_7*/ ctx[11], false, false, false),
    					listen_dev(span5, "click", /*click_handler_8*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*AUTH*/ ctx[0] == true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					if_block0.m(div4, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*AUTH*/ ctx[0] == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$1(ctx);
    					if_block1.c();
    					if_block1.m(div4, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(63:2) { #if helloDownload === false }",
    		ctx
    	});

    	return block;
    }

    // (67:6) { #if AUTH == true }
    function create_if_block_3$1(ctx) {
    	let div1;
    	let span0;
    	let t1;
    	let div0;
    	let span1;
    	let t3;
    	let span2;
    	let t5;
    	let span3;
    	let t7;
    	let span4;
    	let t9;
    	let span5;
    	let t11;
    	let span6;
    	let t13;
    	let span7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "основное меню hint";
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "мои вопросы";
    			t3 = space();
    			span2 = element("span");
    			span2.textContent = "*";
    			t5 = space();
    			span3 = element("span");
    			span3.textContent = "мои хинты";
    			t7 = space();
    			span4 = element("span");
    			span4.textContent = "*";
    			t9 = space();
    			span5 = element("span");
    			span5.textContent = "новый вопрос";
    			t11 = space();
    			span6 = element("span");
    			span6.textContent = "*";
    			t13 = space();
    			span7 = element("span");
    			span7.textContent = "список вопросов";
    			attr_dev(span0, "class", "svelte-16inkut");
    			toggle_class(span0, "mainViewMenuItemLine", true);
    			add_location(span0, file$2, 69, 10, 1728);
    			set_style(span1, "margin-top", "11px");
    			set_style(span1, "cursor", "pointer");
    			attr_dev(span1, "class", "svelte-16inkut");
    			toggle_class(span1, "mainViewMenuItemLine", true);
    			add_location(span1, file$2, 71, 12, 1902);
    			set_style(span2, "margin-top", "12px");
    			set_style(span2, "cursor", "pointer");
    			set_style(span2, "color", "#4300b0");
    			set_style(span2, "margin-left", "30px");
    			attr_dev(span2, "class", "svelte-16inkut");
    			toggle_class(span2, "mainViewMenuItemLine", true);
    			add_location(span2, file$2, 80, 12, 2190);
    			set_style(span3, "margin-top", "6px");
    			set_style(span3, "cursor", "pointer");
    			attr_dev(span3, "class", "svelte-16inkut");
    			toggle_class(span3, "mainViewMenuItemLine", true);
    			add_location(span3, file$2, 86, 12, 2405);
    			set_style(span4, "margin-top", "12px");
    			set_style(span4, "cursor", "pointer");
    			set_style(span4, "color", "#4300b0");
    			set_style(span4, "margin-left", "30px");
    			attr_dev(span4, "class", "svelte-16inkut");
    			toggle_class(span4, "mainViewMenuItemLine", true);
    			add_location(span4, file$2, 95, 12, 2686);
    			set_style(span5, "margin-top", "6px");
    			set_style(span5, "cursor", "pointer");
    			attr_dev(span5, "class", "svelte-16inkut");
    			toggle_class(span5, "mainViewMenuItemLine", true);
    			add_location(span5, file$2, 101, 12, 2901);
    			set_style(span6, "margin-top", "12px");
    			set_style(span6, "cursor", "pointer");
    			set_style(span6, "color", "#4300b0");
    			set_style(span6, "margin-left", "30px");
    			attr_dev(span6, "class", "svelte-16inkut");
    			toggle_class(span6, "mainViewMenuItemLine", true);
    			add_location(span6, file$2, 110, 12, 3181);
    			set_style(span7, "margin-top", "6px");
    			set_style(span7, "cursor", "pointer");
    			attr_dev(span7, "class", "svelte-16inkut");
    			toggle_class(span7, "mainViewMenuItemLine", true);
    			add_location(span7, file$2, 116, 12, 3396);
    			set_style(div0, "margin-top", "0px");
    			set_style(div0, "margin-bottom", "0px");
    			attr_dev(div0, "class", "svelte-16inkut");
    			toggle_class(div0, "mainViewMenuItemSub", true);
    			add_location(div0, file$2, 70, 10, 1805);
    			toggle_class(div1, "mainViewMenuItem", true);
    			add_location(div1, file$2, 68, 8, 1681);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span1);
    			append_dev(div0, t3);
    			append_dev(div0, span2);
    			append_dev(div0, t5);
    			append_dev(div0, span3);
    			append_dev(div0, t7);
    			append_dev(div0, span4);
    			append_dev(div0, t9);
    			append_dev(div0, span5);
    			append_dev(div0, t11);
    			append_dev(div0, span6);
    			append_dev(div0, t13);
    			append_dev(div0, span7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(span3, "click", /*click_handler_1*/ ctx[5], false, false, false),
    					listen_dev(span5, "click", /*click_handler_2*/ ctx[6], false, false, false),
    					listen_dev(span7, "click", /*click_handler_3*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(67:6) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (131:6) { #if AUTH == true }
    function create_if_block_2$1(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "мои характеристики";
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "class", "svelte-16inkut");
    			toggle_class(span, "mainViewMenuItemLine", true);
    			add_location(span, file$2, 133, 10, 3841);
    			set_style(div, "margin-top", "11px");
    			toggle_class(div, "mainViewMenuItem", true);
    			add_location(div, file$2, 132, 8, 3768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_4*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(131:6) { #if AUTH == true }",
    		ctx
    	});

    	return block;
    }

    // (221:2) { #if helloDownload === false }
    function create_if_block$1(ctx) {
    	let div1;
    	let h3;
    	let i;
    	let t1;
    	let t2;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t3;
    	let img1;
    	let img1_src_value;
    	let t4;
    	let img2;
    	let img2_src_value;
    	let t5;
    	let span;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h3 = element("h3");
    			i = element("i");
    			i.textContent = "HINT";
    			t1 = text(" - вопросы в нашу службу поддержки");
    			t2 = space();
    			div0 = element("div");
    			img0 = element("img");
    			t3 = space();
    			img1 = element("img");
    			t4 = space();
    			img2 = element("img");
    			t5 = space();
    			span = element("span");
    			span.textContent = "Получайте анонимные советы и мнения на вашу проблему - от живых пользователей, совершенно бесплатно. Настраивайте аудиторию, от которой хотите получить совет, оценивайте ответы и давайте советы сами";
    			set_style(i, "font-style", "normal");
    			set_style(i, "letter-spacing", "2px");
    			add_location(i, file$2, 225, 8, 6206);
    			attr_dev(h3, "class", "svelte-16inkut");
    			toggle_class(h3, "mainViewContentTitle", true);
    			add_location(h3, file$2, 224, 6, 6158);
    			attr_dev(img0, "alt", "");
    			if (!src_url_equal(img0.src, img0_src_value = /*titleImage1*/ ctx[2])) attr_dev(img0, "src", img0_src_value);
    			set_style(img0, "display", "block");
    			set_style(img0, "width", "300px");
    			set_style(img0, "margin", "0 auto");
    			set_style(img0, "margin-top", "34px");
    			set_style(img0, "box-shadow", "2px 2px 7px rgb(183, 183, 183), inset -5px -5px 12px white");
    			set_style(img0, "border-radius", "8px");
    			add_location(img0, file$2, 234, 8, 6447);
    			attr_dev(img1, "alt", "");
    			if (!src_url_equal(img1.src, img1_src_value = /*titleImage2*/ ctx[3])) attr_dev(img1, "src", img1_src_value);
    			set_style(img1, "display", "block");
    			set_style(img1, "width", "300px");
    			set_style(img1, "margin", "0 auto");
    			set_style(img1, "margin-top", "34px");
    			set_style(img1, "box-shadow", "2px 2px 7px rgb(183, 183, 183), inset -5px -5px 12px white");
    			set_style(img1, "border-radius", "8px");
    			add_location(img1, file$2, 246, 8, 6789);
    			attr_dev(img2, "alt", "");
    			if (!src_url_equal(img2.src, img2_src_value = /*titleImage1*/ ctx[2])) attr_dev(img2, "src", img2_src_value);
    			set_style(img2, "display", "block");
    			set_style(img2, "width", "300px");
    			set_style(img2, "margin", "0 auto");
    			set_style(img2, "margin-top", "34px");
    			set_style(img2, "box-shadow", "2px 2px 7px rgb(183, 183, 183), inset -5px -5px 12px white");
    			set_style(img2, "border-radius", "8px");
    			add_location(img2, file$2, 258, 8, 7131);
    			set_style(div0, "display", "flex");
    			set_style(div0, "flex-flow", "row");
    			set_style(div0, "gap", "22px");
    			add_location(div0, file$2, 227, 6, 6321);
    			set_style(span, "text-align", "center");
    			set_style(span, "color", "#323835");
    			set_style(span, "opacity", "0.99");
    			set_style(span, "margin", "0 auto");
    			set_style(span, "margin-top", "30px");
    			set_style(span, "line-height", "23px");
    			set_style(span, "display", "block");
    			add_location(span, file$2, 271, 6, 7485);
    			attr_dev(div1, "class", "svelte-16inkut");
    			toggle_class(div1, "mainViewContent", true);
    			add_location(div1, file$2, 222, 4, 6108);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(h3, i);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t3);
    			append_dev(div0, img1);
    			append_dev(div0, t4);
    			append_dev(div0, img2);
    			append_dev(div1, t5);
    			append_dev(div1, span);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(221:2) { #if helloDownload === false }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let current;
    	let if_block0 = /*helloDownload*/ ctx[1] === true && create_if_block_4$1(ctx);
    	let if_block1 = /*helloDownload*/ ctx[1] === false && create_if_block_1$1(ctx);
    	let if_block2 = /*helloDownload*/ ctx[1] === false && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div, "class", "svelte-16inkut");
    			toggle_class(div, "mainView", true);
    			add_location(div, file$2, 27, 0, 432);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*helloDownload*/ ctx[1] === true) {
    				if (if_block0) {
    					if (dirty & /*helloDownload*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*helloDownload*/ ctx[1] === false) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*helloDownload*/ ctx[1] === false) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Support', slots, []);
    	let AUTH = false;
    	let titleImage1 = 'image/hintTitle1.png';
    	let titleImage2 = 'image/hintTitle2.png';
    	let helloDownload = true;

    	setTimeout(
    		() => {
    			$$invalidate(1, helloDownload = false);
    		},
    		1400
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Support> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		pageRoute.set('my-questions');
    	};

    	const click_handler_1 = () => {
    		pageRoute.set('my-hints');
    	};

    	const click_handler_2 = () => {
    		pageRoute.set('main');
    	};

    	const click_handler_3 = () => {
    		pageRoute.set('list-questions');
    	};

    	const click_handler_4 = () => {
    		pageRoute.set('my-cabinet');
    	};

    	const click_handler_5 = () => {
    		pageRoute.set('unauth');
    	};

    	const click_handler_6 = () => {
    		pageRoute.set('about');
    	};

    	const click_handler_7 = () => {
    		pageRoute.set('polici');
    	};

    	const click_handler_8 = () => {
    		pageRoute.set('support');
    	};

    	$$self.$capture_state = () => ({
    		pageRoute,
    		authCheck,
    		Loading: Loading$1,
    		AUTH,
    		titleImage1,
    		titleImage2,
    		helloDownload
    	});

    	$$self.$inject_state = $$props => {
    		if ('AUTH' in $$props) $$invalidate(0, AUTH = $$props.AUTH);
    		if ('titleImage1' in $$props) $$invalidate(2, titleImage1 = $$props.titleImage1);
    		if ('titleImage2' in $$props) $$invalidate(3, titleImage2 = $$props.titleImage2);
    		if ('helloDownload' in $$props) $$invalidate(1, helloDownload = $$props.helloDownload);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*AUTH*/ 1) {
    			{
    				authCheck.subscribe(value => $$invalidate(0, AUTH = value.auth));
    				console.log(AUTH);
    			}
    		}
    	};

    	return [
    		AUTH,
    		helloDownload,
    		titleImage1,
    		titleImage2,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8
    	];
    }

    class Support extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Support",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\bricks\Body.svelte generated by Svelte v3.47.0 */

    const { console: console_1 } = globals;

    const file$1 = "src\\bricks\\Body.svelte";

    // (74:2) { #if route === 'main' }
    function create_if_block_8(ctx) {
    	let main;
    	let current;
    	main = new Main({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(main.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(main, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(main, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(74:2) { #if route === 'main' }",
    		ctx
    	});

    	return block;
    }

    // (79:2) { #if route === 'my-questions' }
    function create_if_block_7(ctx) {
    	let myquestions;
    	let current;

    	myquestions = new MyQuestions({
    			props: {
    				questionsData: /*myQuestions*/ ctx[2].filter(/*func*/ ctx[6])
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(myquestions.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(myquestions, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const myquestions_changes = {};
    			if (dirty & /*myQuestions, UID*/ 20) myquestions_changes.questionsData = /*myQuestions*/ ctx[2].filter(/*func*/ ctx[6]);
    			myquestions.$set(myquestions_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(myquestions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(myquestions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(myquestions, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(79:2) { #if route === 'my-questions' }",
    		ctx
    	});

    	return block;
    }

    // (84:2) { #if route === 'my-hints' }
    function create_if_block_6(ctx) {
    	let myhints;
    	let current;

    	myhints = new MyHints({
    			props: {
    				questionsData: /*allQuestions*/ ctx[3].filter(/*func_1*/ ctx[7])
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(myhints.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(myhints, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const myhints_changes = {};
    			if (dirty & /*allQuestions, UID*/ 24) myhints_changes.questionsData = /*allQuestions*/ ctx[3].filter(/*func_1*/ ctx[7]);
    			myhints.$set(myhints_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(myhints.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(myhints.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(myhints, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(84:2) { #if route === 'my-hints' }",
    		ctx
    	});

    	return block;
    }

    // (114:2) { #if route === 'list-questions' }
    function create_if_block_5(ctx) {
    	let allquestions;
    	let current;

    	allquestions = new AllQuestions({
    			props: {
    				questionsData: /*allQuestions*/ ctx[3].filter(/*func_2*/ ctx[8]).filter(/*func_3*/ ctx[9])
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(allquestions.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(allquestions, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const allquestions_changes = {};
    			if (dirty & /*allQuestions, UID*/ 24) allquestions_changes.questionsData = /*allQuestions*/ ctx[3].filter(/*func_2*/ ctx[8]).filter(/*func_3*/ ctx[9]);
    			allquestions.$set(allquestions_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(allquestions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(allquestions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(allquestions, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(114:2) { #if route === 'list-questions' }",
    		ctx
    	});

    	return block;
    }

    // (146:2) { #if route === 'my-cabinet' }
    function create_if_block_4(ctx) {
    	let mycabinet;
    	let current;

    	mycabinet = new MyCabinet({
    			props: { questionsData: /*questionsData*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mycabinet.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mycabinet, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mycabinet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mycabinet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mycabinet, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(146:2) { #if route === 'my-cabinet' }",
    		ctx
    	});

    	return block;
    }

    // (151:2) { #if route === 'unauth' }
    function create_if_block_3(ctx) {
    	let unauth;
    	let current;
    	unauth = new Unauth({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(unauth.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(unauth, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(unauth.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(unauth.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(unauth, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(151:2) { #if route === 'unauth' }",
    		ctx
    	});

    	return block;
    }

    // (156:2) { #if route === 'about' }
    function create_if_block_2(ctx) {
    	let about;
    	let current;
    	about = new About({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(about.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(about, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(about.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(about.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(about, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(156:2) { #if route === 'about' }",
    		ctx
    	});

    	return block;
    }

    // (161:2) { #if route === 'polici' }
    function create_if_block_1(ctx) {
    	let polici;
    	let current;
    	polici = new Polici({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(polici.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(polici, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(polici.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(polici.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(polici, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(161:2) { #if route === 'polici' }",
    		ctx
    	});

    	return block;
    }

    // (166:2) { #if route === 'support' }
    function create_if_block(ctx) {
    	let support;
    	let current;
    	support = new Support({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(support.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(support, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(support.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(support.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(support, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(166:2) { #if route === 'support' }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let current;
    	let if_block0 = /*route*/ ctx[1] === 'main' && create_if_block_8(ctx);
    	let if_block1 = /*route*/ ctx[1] === 'my-questions' && create_if_block_7(ctx);
    	let if_block2 = /*route*/ ctx[1] === 'my-hints' && create_if_block_6(ctx);
    	let if_block3 = /*route*/ ctx[1] === 'list-questions' && create_if_block_5(ctx);
    	let if_block4 = /*route*/ ctx[1] === 'my-cabinet' && create_if_block_4(ctx);
    	let if_block5 = /*route*/ ctx[1] === 'unauth' && create_if_block_3(ctx);
    	let if_block6 = /*route*/ ctx[1] === 'about' && create_if_block_2(ctx);
    	let if_block7 = /*route*/ ctx[1] === 'polici' && create_if_block_1(ctx);
    	let if_block8 = /*route*/ ctx[1] === 'support' && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (if_block5) if_block5.c();
    			t5 = space();
    			if (if_block6) if_block6.c();
    			t6 = space();
    			if (if_block7) if_block7.c();
    			t7 = space();
    			if (if_block8) if_block8.c();
    			set_style(section, "opacity", /*opacity*/ ctx[0]);
    			attr_dev(section, "class", "svelte-1v51z6y");
    			toggle_class(section, "container", true);
    			add_location(section, file$1, 72, 0, 2714);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t0);
    			if (if_block1) if_block1.m(section, null);
    			append_dev(section, t1);
    			if (if_block2) if_block2.m(section, null);
    			append_dev(section, t2);
    			if (if_block3) if_block3.m(section, null);
    			append_dev(section, t3);
    			if (if_block4) if_block4.m(section, null);
    			append_dev(section, t4);
    			if (if_block5) if_block5.m(section, null);
    			append_dev(section, t5);
    			if (if_block6) if_block6.m(section, null);
    			append_dev(section, t6);
    			if (if_block7) if_block7.m(section, null);
    			append_dev(section, t7);
    			if (if_block8) if_block8.m(section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*route*/ ctx[1] === 'main') {
    				if (if_block0) {
    					if (dirty & /*route*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(section, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*route*/ ctx[1] === 'my-questions') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*route*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_7(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(section, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*route*/ ctx[1] === 'my-hints') {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*route*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_6(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(section, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*route*/ ctx[1] === 'list-questions') {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*route*/ 2) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_5(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(section, t3);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*route*/ ctx[1] === 'my-cabinet') {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty & /*route*/ 2) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_4(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(section, t4);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*route*/ ctx[1] === 'unauth') {
    				if (if_block5) {
    					if (dirty & /*route*/ 2) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block_3(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(section, t5);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}

    			if (/*route*/ ctx[1] === 'about') {
    				if (if_block6) {
    					if (dirty & /*route*/ 2) {
    						transition_in(if_block6, 1);
    					}
    				} else {
    					if_block6 = create_if_block_2(ctx);
    					if_block6.c();
    					transition_in(if_block6, 1);
    					if_block6.m(section, t6);
    				}
    			} else if (if_block6) {
    				group_outros();

    				transition_out(if_block6, 1, 1, () => {
    					if_block6 = null;
    				});

    				check_outros();
    			}

    			if (/*route*/ ctx[1] === 'polici') {
    				if (if_block7) {
    					if (dirty & /*route*/ 2) {
    						transition_in(if_block7, 1);
    					}
    				} else {
    					if_block7 = create_if_block_1(ctx);
    					if_block7.c();
    					transition_in(if_block7, 1);
    					if_block7.m(section, t7);
    				}
    			} else if (if_block7) {
    				group_outros();

    				transition_out(if_block7, 1, 1, () => {
    					if_block7 = null;
    				});

    				check_outros();
    			}

    			if (/*route*/ ctx[1] === 'support') {
    				if (if_block8) {
    					if (dirty & /*route*/ 2) {
    						transition_in(if_block8, 1);
    					}
    				} else {
    					if_block8 = create_if_block(ctx);
    					if_block8.c();
    					transition_in(if_block8, 1);
    					if_block8.m(section, null);
    				}
    			} else if (if_block8) {
    				group_outros();

    				transition_out(if_block8, 1, 1, () => {
    					if_block8 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*opacity*/ 1) {
    				set_style(section, "opacity", /*opacity*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			transition_in(if_block6);
    			transition_in(if_block7);
    			transition_in(if_block8);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			transition_out(if_block6);
    			transition_out(if_block7);
    			transition_out(if_block8);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Body', slots, []);
    	let opacity;
    	let route;
    	let myQuestions;
    	let allQuestions;
    	let UID;

    	let questionsData = [
    		'Равным образом рамки и место обучения кадров требуют от нас анализа направлений прогрессивного развития. Задача организации, в особенности же рамки и место обучения кадров позволяет выполнять важные задания по разработке новых предложений. Значимость этих проблем настолько очевидна, что постоянный количественный рост и сфера нашей активности представляет собой интересный эксперимент проверки форм развития.',
    		'Задача организации, в особенности же рамки и место обучения кадров требуют от нас анализа позиций, занимаемых участниками в отношении поставленных задач. С другой стороны реализация намеченных плановых заданий требуют определения и уточнения новых предложений. Разнообразный и богатый опыт укрепление и развитие структуры требуют определения и уточнения существенных финансовых и административных условий.',
    		'Повседневная практика показывает, что укрепление и развитие структуры требуют от нас анализа модели развития. Значимость этих проблем настолько очевидна, что постоянное информационно-пропагандистское обеспечение нашей деятельности влечет за собой процесс внедрения и модернизации соответствующий условий активизации.'
    	];

    	pageRoute.subscribe(value => $$invalidate(1, route = value));
    	authCheck.subscribe(value => $$invalidate(4, UID = value.userID));

    	const getDataQuestions = async () => {
    		let updateMyQuestions = await fetch('http://localhost:3008/get-data', {
    			method: 'POST',
    			headers: {
    				'Content-Type': 'application/json;charset=utf-8'
    			},
    			body: JSON.stringify({})
    		}).then(res => res.json());

    		myQuestionsData.set(updateMyQuestions.data);
    		allQuestionsData.set(updateMyQuestions.data);
    	};

    	getDataQuestions();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Body> was created with unknown prop '${key}'`);
    	});

    	const func = item => item.uid === UID;

    	const func_1 = item => {
    		let hints = item.hints;
    		let checker = 0;

    		hints.forEach(hint => {
    			if (hint.uid === UID) {
    				checker++;
    			}
    		});

    		if (checker === 1) {
    			return item;
    		}
    	};

    	const func_2 = item => item.uid !== UID;

    	const func_3 = item => {
    		let hints = item.hints;
    		let checker = 0;

    		hints.forEach(hint => {
    			if (hint.uid === UID) {
    				checker++;
    			}
    		});

    		if (checker === 0) {
    			return item;
    		}
    	};

    	$$self.$capture_state = () => ({
    		Main,
    		AllQuestions,
    		MyHints,
    		MyQuestions,
    		MyCabinet,
    		Unauth,
    		About,
    		Polici,
    		Support,
    		pageRoute,
    		myQuestionsData,
    		contentOpacity,
    		authCheck,
    		allQuestionsData,
    		opacity,
    		route,
    		myQuestions,
    		allQuestions,
    		UID,
    		questionsData,
    		getDataQuestions
    	});

    	$$self.$inject_state = $$props => {
    		if ('opacity' in $$props) $$invalidate(0, opacity = $$props.opacity);
    		if ('route' in $$props) $$invalidate(1, route = $$props.route);
    		if ('myQuestions' in $$props) $$invalidate(2, myQuestions = $$props.myQuestions);
    		if ('allQuestions' in $$props) $$invalidate(3, allQuestions = $$props.allQuestions);
    		if ('UID' in $$props) $$invalidate(4, UID = $$props.UID);
    		if ('questionsData' in $$props) $$invalidate(5, questionsData = $$props.questionsData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	{
    		myQuestionsData.subscribe(value => {
    			console.log(value);
    			$$invalidate(2, myQuestions = value);
    		});

    		allQuestionsData.subscribe(value => {
    			console.log(value);
    			$$invalidate(3, allQuestions = value);
    		});

    		contentOpacity.subscribe(value => {
    			$$invalidate(0, opacity = value);
    		});
    	}

    	return [
    		opacity,
    		route,
    		myQuestions,
    		allQuestions,
    		UID,
    		questionsData,
    		func,
    		func_1,
    		func_2,
    		func_3
    	];
    }

    class Body extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Body",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\bricks\Footer.svelte generated by Svelte v3.47.0 */

    function create_fragment$1(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.47.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let t0;
    	let body;
    	let t1;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });
    	body = new Body({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(body.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    			add_location(main, file, 7, 0, 159);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			mount_component(body, main, null);
    			append_dev(main, t1);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(body.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(body.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(body);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Header, Body, Footer });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({ 
    	
    	target: document.body 

    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
