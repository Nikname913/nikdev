
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
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
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
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

    /* src\bricks\Header.svelte generated by Svelte v3.47.0 */

    const file$4 = "src\\bricks\\Header.svelte";

    function create_fragment$5(ctx) {
    	let section;
    	let div1;
    	let span;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let h1;
    	let t2;
    	let div0;
    	let a;
    	let t4;
    	let img1;
    	let img1_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div1 = element("div");
    			span = element("span");
    			img0 = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "nikdeveloper";
    			t2 = space();
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "nikname913";
    			t4 = space();
    			img1 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = /*src*/ ctx[0])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "class", "svelte-e582v2");
    			add_location(img0, file$4, 11, 6, 214);
    			attr_dev(span, "class", "svelte-e582v2");
    			toggle_class(span, "headerLogo", true);
    			add_location(span, file$4, 9, 4, 168);
    			attr_dev(h1, "class", "svelte-e582v2");
    			add_location(h1, file$4, 14, 4, 260);
    			attr_dev(a, "href", "https://t.me/nikname913");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-e582v2");
    			add_location(a, file$4, 19, 6, 387);
    			if (!src_url_equal(img1.src, img1_src_value = /*telegram*/ ctx[1])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "telegram logo");
    			attr_dev(img1, "class", "svelte-e582v2");
    			toggle_class(img1, "telegramIcon", true);
    			add_location(img1, file$4, 20, 6, 459);
    			attr_dev(div0, "class", "svelte-e582v2");
    			toggle_class(div0, "headerContacts", true);
    			add_location(div0, file$4, 16, 4, 289);
    			attr_dev(div1, "class", "svelte-e582v2");
    			toggle_class(div1, "headerContent", true);
    			add_location(div1, file$4, 8, 2, 130);
    			attr_dev(section, "class", "svelte-e582v2");
    			toggle_class(section, "header", true);
    			add_location(section, file$4, 7, 0, 97);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div1);
    			append_dev(div1, span);
    			append_dev(span, img0);
    			append_dev(div1, t0);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, a);
    			append_dev(div0, t4);
    			append_dev(div0, img1);

    			if (!mounted) {
    				dispose = listen_dev(img1, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			mounted = false;
    			dispose();
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
    	validate_slots('Header', slots, []);
    	let src = "/image/ava.jpg";
    	let telegram = "/image/telegram.png";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => window.open('https://t.me/nikname913');
    	$$self.$capture_state = () => ({ src, telegram });

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('telegram' in $$props) $$invalidate(1, telegram = $$props.telegram);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src, telegram, click_handler];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\bricks\MessageFrom.svelte generated by Svelte v3.47.0 */

    const file$3 = "src\\bricks\\MessageFrom.svelte";

    // (10:2) { #if message.split('::')[1] }
    function create_if_block$1(ctx) {
    	let p;
    	let t_value = /*message*/ ctx[0].split('::')[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-kupfaa");
    			toggle_class(p, "time", true);
    			add_location(p, file$3, 11, 4, 172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 1 && t_value !== (t_value = /*message*/ ctx[0].split('::')[1] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(10:2) { #if message.split('::')[1] }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let p;
    	let raw_value = /*message*/ ctx[0].split('::')[0] + "";
    	let t;
    	let show_if = /*message*/ ctx[0].split('::')[1];
    	let if_block = show_if && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(p, "class", "svelte-kupfaa");
    			add_location(p, file$3, 7, 2, 87);
    			attr_dev(div, "class", "svelte-kupfaa");
    			toggle_class(div, "messageFrom", true);
    			add_location(div, file$3, 5, 0, 49);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			p.innerHTML = raw_value;
    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*message*/ 1 && raw_value !== (raw_value = /*message*/ ctx[0].split('::')[0] + "")) p.innerHTML = raw_value;			if (dirty & /*message*/ 1) show_if = /*message*/ ctx[0].split('::')[1];

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
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
    	validate_slots('MessageFrom', slots, []);
    	let { message } = $$props;
    	const writable_props = ['message'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MessageFrom> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	$$self.$capture_state = () => ({ message });

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [message];
    }

    class MessageFrom extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { message: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessageFrom",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*message*/ ctx[0] === undefined && !('message' in props)) {
    			console.warn("<MessageFrom> was created without expected prop 'message'");
    		}
    	}

    	get message() {
    		throw new Error("<MessageFrom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<MessageFrom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\bricks\MessageTo.svelte generated by Svelte v3.47.0 */

    const file$2 = "src\\bricks\\MessageTo.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let p0;
    	let t0_value = /*message*/ ctx[0].split('::')[1] + "";
    	let t0;
    	let t1;
    	let p1;
    	let t2_value = /*message*/ ctx[0].split('::')[0] + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			attr_dev(p0, "class", "svelte-s91rau");
    			toggle_class(p0, "time", true);
    			add_location(p0, file$2, 7, 2, 83);
    			attr_dev(p1, "class", "svelte-s91rau");
    			add_location(p1, file$2, 8, 2, 138);
    			attr_dev(div, "class", "svelte-s91rau");
    			toggle_class(div, "messageTo", true);
    			add_location(div, file$2, 5, 0, 49);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, t0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(p1, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*message*/ 1 && t0_value !== (t0_value = /*message*/ ctx[0].split('::')[1] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*message*/ 1 && t2_value !== (t2_value = /*message*/ ctx[0].split('::')[0] + "")) set_data_dev(t2, t2_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	validate_slots('MessageTo', slots, []);
    	let { message } = $$props;
    	const writable_props = ['message'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MessageTo> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	$$self.$capture_state = () => ({ message });

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [message];
    }

    class MessageTo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { message: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessageTo",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*message*/ ctx[0] === undefined && !('message' in props)) {
    			console.warn("<MessageTo> was created without expected prop 'message'");
    		}
    	}

    	get message() {
    		throw new Error("<MessageTo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<MessageTo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const messages = {
      startMessages: [
        { message: 'привет, меня зовут николай' },
        { message: 'я занимаюсь фронтенд разработкой на библиотеке react' },
        { message: 'основные направления - веб и мобильные приложения' },
        { message: 'последние разрабатываю с помощью react native + expo' },
        { message: 'суммарный опыт разработки в целом - около 5 лет' },
      ],
      otherMessagesOne: [
        { type: 'me', text: 'мой основной стек: react + react native, expo, firebase, mongo, svelte и php' },
        { type: 'me', text: 'если говорить про технологии, владею ES6 и выше, react 16-17-18, styled components. проекты собираю вебпаком, люблю ui библиотеки, могу собрать апи на nodejs + express' }
      ],
      otherMessagesTwo: [ 
        { type: 'me', text: 'сейчас расскажу, постараюсь без воды и лирики)' },
        { type: 'me', text: 'я работал штатным разработчиком в веб-студии айтекс, сделал там онлайн отчет' },
        { type: 'me', text: 'он собирал данные из яндекс директа и яндекс метрики и выдавал их в красивом виде с графиками и комментариями' },
        { type: 'me', text: 'можно было менять периоды, у каждого клиента была персональная ссылка' },
        { type: 'me', text: 'реализована внутренняя платформа для менеджеров, с интеграцией с битрикс24' },
        { type: 'me', text: 'мы собирали данные по звонкам, письмам, выполненным задачам, все данные отправлялись руководителю отдела, также в удобном и наглядном формате' },
        { type: 'me', text: 'а, кстати, возвращаясь к отчету метрики, был сделан телеграм бот, который также отдавал краткую сводку по кампаниям, в сжатом формате' },
        { type: 'me', text: 'еще была сделана система электронной коммерции, наподобие решения от яндекса, но более упрощенная, тк многим клиентам сложно ориентироваться в куче вкладок' },
        { type: 'me', text: 'про сервисы для клиентов, которые я сделал можно почитать тут, лендинг до сих живой. на всех сервисах делал и бек и фронт' },
        { type: 'me', text: 'http://cstr.tilda.ws/products' },
        { type: 'me', text: 'отдельно стоит отметить сервис для маркетологов' },
        { type: 'me', text: 'он позволял без помощи программистов ставить цели яндекс метрики на сайт' },
        { type: 'me', text: 'буквально в несколько кликов. формировался код который просто нужно вставить в сайт и цели готовы. это был самый цельный наш продукт' },
        { type: 'me', text: 'итогом стала презентация на форуме internet expo 2019' },
        { type: 'me', text: 'подробнее можно прочитать по ссылке ниже' },
        { type: 'me', text: 'http://cstr.tilda.ws' },
        { type: 'me', text: 'сейчас та версия, насколько я знаю, не функционирует, но я разрабатываю обновленный сервис, с большим набором функций' },
        { type: 'me', text: 'так, с айтексом вроде закончили' },
        { type: 'me', text: 'далее я работал как самозанятый, работал на свои проекты + сотрудничал за эти три года с двумя компаниями' },
        { type: 'me', text: 'deltaplan group и brandpol, за время работы участвовал в разработке внутренней полноценной crm системы, создал с нуля интерфейс сервиса для клиентов, полностью рабочая crud, готовый функционал, а также участвовал в командной разработке двух мобильных приложений, одно из которых по сути создавал сам с нуля. стек nativescript + react native + expo' },
      ],
      otherMessagesThree: [
        { type: 'me', text: 'сайты делаю. если говорить о предпочтениях, то это либо большие сложные проекты, наподобие интернет-магазинов или онлайн-школ, либо что компактное, лендинги, карточки, нравится даже тильда. собирать миллионный одинаковый сайт на вордпрессе очень не хочется, короче упор на что-то самописное)' },
      ],
      otherMessagesFour: [
        { type: 'me', text: 'стоимость разработки стандартного веб-приложения начинается от 60 тысяч рублей, конечная стоимость сильно зависит от типа проекта' },
        { type: 'me', text: 'в эту стоимость входит составление и согласование технического задания' },
        { type: 'me', text: 'если требуется, составление плана разработки, разбивка его на адекватные сроки, заведение проекта на таск-менеджере для простоты отслеживания моей работы и наконец сама разработка, разбитая на недельные спринты' },
        { type: 'me', text: 'в случае необходимости возможна работа по договору типа "договор с физлицом, имеющим налог на профессиональную деятельность". я не дизайнер, поэтому помочь разработать полноценный дизайн с нуля к сожалению не смогу' },
        { type: 'me', text: 'но сейчас есть много готовых решений с красивыми ux интерфейсами, во многих случаях достаточно использовать их' },
        { type: 'me', text: 'для остальных случаев у меня есть хороший дизайнер, обожающий креатив и готовый придумывать вам красивые кнопочки и рамочки ночами напролет' }
      ],
      otherMessagesFive: [
        { type: 'me', text: 'конечно, вот ссылка на мой профиль, копируйте' },
        { type: 'me', text: 'https://github.com/Nikname913' },
      ],
      otherMessagesSix: [
        { type: 'me', text: 'стоимость разработки мобильного приложения начинается от 20 тысяч' },
        { type: 'me', text: 'порядок работ и все организационные моменты такие же, как для веб-приложений, могу рассказать и про них тоже' },
        { type: 'me', text: 'разработка ведется на языке javascript, с использованием библиотек react native и expo. возможно, возмусь за разработку решения на no-code платформе, нужно смотреть' },
      ],
      otherMessagesSeven: [
        { type: 'me', text: 'интернет-магазин: цена стартует от 30 тысяч рублей' },
        { type: 'me', text: 'разработка лендинга: от 10 до 20 тысяч рублей' },
        { type: 'me', text: 'разработка лендинга на тильде 8 тысяч рублей' },
        { type: 'me', text: 'это примерные расценки, рекомендую написать мне и обсудить по тз' },
        { type: 'me', text: 'либо составить его и потом обсудить предметно' },
        { type: 'me', text: 'очень много факторов влияющих на сложность и стоимость, в общем' },
      ],
    };

    /* src\bricks\Body.svelte generated by Svelte v3.47.0 */
    const file$1 = "src\\bricks\\Body.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    // (346:4) { #each startMessages as mes }
    function create_each_block_2(ctx) {
    	let messagefrom;
    	let current;

    	messagefrom = new MessageFrom({
    			props: {
    				message: /*mes*/ ctx[19].message + '::' + /*startTime*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(messagefrom.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(messagefrom, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const messagefrom_changes = {};
    			if (dirty & /*startTime*/ 8) messagefrom_changes.message = /*mes*/ ctx[19].message + '::' + /*startTime*/ ctx[3];
    			messagefrom.$set(messagefrom_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(messagefrom.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(messagefrom.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(messagefrom, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(346:4) { #each startMessages as mes }",
    		ctx
    	});

    	return block;
    }

    // (358:6) { :else }
    function create_else_block(ctx) {
    	let messageto;
    	let current;

    	messageto = new MessageTo({
    			props: { message: /*mes*/ ctx[19].text },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(messageto.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(messageto, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const messageto_changes = {};
    			if (dirty & /*dialog*/ 1) messageto_changes.message = /*mes*/ ctx[19].text;
    			messageto.$set(messageto_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(messageto.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(messageto.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(messageto, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(358:6) { :else }",
    		ctx
    	});

    	return block;
    }

    // (354:6) { #if mes.type == 'me' }
    function create_if_block_1(ctx) {
    	let messagefrom;
    	let current;

    	messagefrom = new MessageFrom({
    			props: { message: /*mes*/ ctx[19].text },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(messagefrom.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(messagefrom, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const messagefrom_changes = {};
    			if (dirty & /*dialog*/ 1) messagefrom_changes.message = /*mes*/ ctx[19].text;
    			messagefrom.$set(messagefrom_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(messagefrom.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(messagefrom.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(messagefrom, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(354:6) { #if mes.type == 'me' }",
    		ctx
    	});

    	return block;
    }

    // (352:4) { #each dialog as mes }
    function create_each_block_1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*mes*/ ctx[19].type == 'me') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
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
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(352:4) { #each dialog as mes }",
    		ctx
    	});

    	return block;
    }

    // (371:6) { #if item.id !== '0' }
    function create_if_block(ctx) {
    	let span;
    	let t0_value = /*item*/ ctx[16].text + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*item*/ ctx[16]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "class", "svelte-fcou6m");
    			toggle_class(span, "answer", true);
    			add_location(span, file$1, 372, 8, 8868);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*answers*/ 2 && t0_value !== (t0_value = /*item*/ ctx[16].text + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(371:6) { #if item.id !== '0' }",
    		ctx
    	});

    	return block;
    }

    // (369:4) { #each answers as item }
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*item*/ ctx[16].id !== '0' && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*item*/ ctx[16].id !== '0') {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(369:4) { #each answers as item }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let each_value_2 = /*startMessages*/ ctx[4];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks_2[i], 1, 1, () => {
    		each_blocks_2[i] = null;
    	});

    	let each_value_1 = /*dialog*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out_1 = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*answers*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t0 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "chatScroll svelte-fcou6m");
    			add_location(div0, file$1, 340, 2, 8346);
    			attr_dev(div1, "class", "svelte-fcou6m");
    			toggle_class(div1, "chatAnswers", true);
    			add_location(div1, file$1, 366, 2, 8758);
    			attr_dev(section, "class", "svelte-fcou6m");
    			toggle_class(section, "chat", true);
    			add_location(section, file$1, 339, 0, 8315);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div0, null);
    			}

    			append_dev(div0, t0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			/*div0_binding*/ ctx[6](div0);
    			append_dev(section, t1);
    			append_dev(section, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*startMessages, startTime*/ 24) {
    				each_value_2 = /*startMessages*/ ctx[4];
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
    						each_blocks_2[i].m(div0, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_2.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*dialog*/ 1) {
    				each_value_1 = /*dialog*/ ctx[0];
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
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*changeAnswers, answers*/ 34) {
    				each_value = /*answers*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
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

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
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
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			/*div0_binding*/ ctx[6](null);
    			destroy_each(each_blocks, detaching);
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
    	let chatScroll;
    	let dialog = [];

    	let answers = [
    		{
    			text: 'какие проекты ты выполнял, где работал?',
    			id: '2'
    		},
    		{
    			text: 'расскажи, какой стек ты используешь',
    			id: '1'
    		},
    		{
    			text: 'что насчет разработки новых сайтов?',
    			id: '3'
    		},
    		{
    			text: 'сколько стоит сделать мне приложение?',
    			id: '4'
    		},
    		{
    			text: 'сколько будет стоить разработка мобильного приложения?',
    			id: '6'
    		}
    	];

    	let { startMessages, otherMessagesOne, otherMessagesTwo, otherMessagesThree, otherMessagesFour, otherMessagesFive, otherMessagesSix, otherMessagesSeven } = messages;
    	let startDate = new Date();
    	let startTime = '';

    	startDate.getMinutes() < 10
    	? startTime = `${startDate.getHours()} : 0${startDate.getMinutes()}`
    	: startTime = `${startDate.getHours()} : ${startDate.getMinutes()}`;

    	function changeAnswers(param) {
    		let { id, type, text } = param;

    		switch (id) {
    			case '1':
    				let date1 = new Date();
    				let time1 = '';
    				date1.getMinutes() < 10
    				? time1 = `${date1.getHours()} : 0${date1.getMinutes()}`
    				: time1 = `${date1.getHours()} : ${date1.getMinutes()}`;
    				let message1 = text + '::' + time1;
    				dialog.push({ type, text: message1 });
    				$$invalidate(0, dialog);
    				setTimeout(
    					() => {
    						otherMessagesOne.forEach(item => {
    							let date = new Date();
    							let time = '';

    							date.getMinutes() < 10
    							? time = `${date.getHours()} : 0${date.getMinutes()}`
    							: time = `${date.getHours()} : ${date.getMinutes()}`;

    							item.text = item.text + '::' + time;
    							dialog.push(item);
    						});

    						$$invalidate(0, dialog);
    					},
    					1200
    				);
    				answers.forEach(item => {
    					if (item.id === id) {
    						item.id = '0';
    					}
    				});
    				answers.push({
    					text: 'можно посмотреть твой профиль на github или gitlab, что-то такое?',
    					id: '5'
    				});
    				$$invalidate(1, answers);
    				break;
    			case '2':
    				let date2 = new Date();
    				let time2 = '';
    				date2.getMinutes() < 10
    				? time2 = `${date2.getHours()} : 0${date2.getMinutes()}`
    				: time2 = `${date2.getHours()} : ${date2.getMinutes()}`;
    				let message2 = text + '::' + time2;
    				dialog.push({ type, text: message2 });
    				$$invalidate(0, dialog);
    				setTimeout(
    					() => {
    						otherMessagesTwo.forEach(item => {
    							let date = new Date();
    							let time = '';

    							date.getMinutes() < 10
    							? time = `${date.getHours()} : 0${date.getMinutes()}`
    							: time = `${date.getHours()} : ${date.getMinutes()}`;

    							item.text = item.text + '::' + time;
    							dialog.push(item);
    						});

    						$$invalidate(0, dialog);
    					},
    					1200
    				);
    				answers.forEach(item => {
    					if (item.id === id) {
    						item.id = '0';
    					}
    				});
    				$$invalidate(1, answers);
    				break;
    			case '3':
    				let date3 = new Date();
    				let time3 = '';
    				date3.getMinutes() < 10
    				? time3 = `${date3.getHours()} : 0${date3.getMinutes()}`
    				: time3 = `${date3.getHours()} : ${date3.getMinutes()}`;
    				let message3 = text + '::' + time3;
    				dialog.push({ type, text: message3 });
    				$$invalidate(0, dialog);
    				setTimeout(
    					() => {
    						otherMessagesThree.forEach(item => {
    							let date = new Date();
    							let time = '';

    							date.getMinutes() < 10
    							? time = `${date.getHours()} : 0${date.getMinutes()}`
    							: time = `${date.getHours()} : ${date.getMinutes()}`;

    							item.text = item.text + '::' + time;
    							dialog.push(item);
    						});

    						$$invalidate(0, dialog);
    					},
    					1200
    				);
    				answers.forEach(item => {
    					if (item.id === id) {
    						item.id = '0';
    					}
    				});
    				answers.push({
    					text: 'можешь сказать какие расценки на сайты?',
    					id: '7'
    				});
    				$$invalidate(1, answers);
    				break;
    			case '4':
    				let date4 = new Date();
    				let time4 = '';
    				date4.getMinutes() < 10
    				? time4 = `${date4.getHours()} : 0${date4.getMinutes()}`
    				: time4 = `${date4.getHours()} : ${date4.getMinutes()}`;
    				let message4 = text + '::' + time4;
    				dialog.push({ type, text: message4 });
    				$$invalidate(0, dialog);
    				setTimeout(
    					() => {
    						otherMessagesFour.forEach(item => {
    							let date = new Date();
    							let time = '';

    							date.getMinutes() < 10
    							? time = `${date.getHours()} : 0${date.getMinutes()}`
    							: time = `${date.getHours()} : ${date.getMinutes()}`;

    							item.text = item.text + '::' + time;
    							dialog.push(item);
    						});

    						$$invalidate(0, dialog);
    					},
    					1200
    				);
    				answers.forEach(item => {
    					if (item.id === id) {
    						item.id = '0';
    					}
    				});
    				$$invalidate(1, answers);
    				break;
    			case '5':
    				let date5 = new Date();
    				let time5 = '';
    				date5.getMinutes() < 10
    				? time5 = `${date5.getHours()} : 0${date5.getMinutes()}`
    				: time5 = `${date5.getHours()} : ${date5.getMinutes()}`;
    				let message5 = text + '::' + time5;
    				dialog.push({ type, text: message5 });
    				$$invalidate(0, dialog);
    				setTimeout(
    					() => {
    						otherMessagesFive.forEach(item => {
    							let date = new Date();
    							let time = '';

    							date.getMinutes() < 10
    							? time = `${date.getHours()} : 0${date.getMinutes()}`
    							: time = `${date.getHours()} : ${date.getMinutes()}`;

    							item.text = item.text + '::' + time;
    							dialog.push(item);
    						});

    						$$invalidate(0, dialog);
    					},
    					1200
    				);
    				answers.forEach(item => {
    					if (item.id === id) {
    						item.id = '0';
    					}
    				});
    				$$invalidate(1, answers);
    				break;
    			case '6':
    				let date6 = new Date();
    				let time6 = '';
    				date6.getMinutes() < 10
    				? time6 = `${date6.getHours()} : 0${date6.getMinutes()}`
    				: time6 = `${date6.getHours()} : ${date6.getMinutes()}`;
    				let message6 = text + '::' + time6;
    				dialog.push({ type, text: message6 });
    				$$invalidate(0, dialog);
    				setTimeout(
    					() => {
    						otherMessagesSix.forEach(item => {
    							let date = new Date();
    							let time = '';

    							date.getMinutes() < 10
    							? time = `${date.getHours()} : 0${date.getMinutes()}`
    							: time = `${date.getHours()} : ${date.getMinutes()}`;

    							item.text = item.text + '::' + time;
    							dialog.push(item);
    						});

    						$$invalidate(0, dialog);
    					},
    					1200
    				);
    				answers.forEach(item => {
    					if (item.id === id) {
    						item.id = '0';
    					}
    				});
    				$$invalidate(1, answers);
    				break;
    			case '7':
    				let date7 = new Date();
    				let time7 = '';
    				date7.getMinutes() < 10
    				? time7 = `${date7.getHours()} : 0${date7.getMinutes()}`
    				: time7 = `${date7.getHours()} : ${date7.getMinutes()}`;
    				let message7 = text + '::' + time7;
    				dialog.push({ type, text: message7 });
    				$$invalidate(0, dialog);
    				setTimeout(
    					() => {
    						otherMessagesSeven.forEach(item => {
    							let date = new Date();
    							let time = '';

    							date.getMinutes() < 10
    							? time = `${date.getHours()} : 0${date.getMinutes()}`
    							: time = `${date.getHours()} : ${date.getMinutes()}`;

    							item.text = item.text + '::' + time;
    							dialog.push(item);
    						});

    						$$invalidate(0, dialog);
    					},
    					1200
    				);
    				answers.forEach(item => {
    					if (item.id === id) {
    						item.id = '0';
    					}
    				});
    				$$invalidate(1, answers);
    				break;
    		}
    	}

    	afterUpdate(() => {
    		$$invalidate(2, chatScroll.scrollTop = 100000, chatScroll);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Body> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			chatScroll = $$value;
    			$$invalidate(2, chatScroll);
    		});
    	}

    	const click_handler = item => {
    		changeAnswers({
    			id: item.id,
    			type: 'user',
    			text: item.text
    		});
    	};

    	$$self.$capture_state = () => ({
    		MessageFrom,
    		MessageTo,
    		afterUpdate,
    		messages,
    		chatScroll,
    		dialog,
    		answers,
    		startMessages,
    		otherMessagesOne,
    		otherMessagesTwo,
    		otherMessagesThree,
    		otherMessagesFour,
    		otherMessagesFive,
    		otherMessagesSix,
    		otherMessagesSeven,
    		startDate,
    		startTime,
    		changeAnswers
    	});

    	$$self.$inject_state = $$props => {
    		if ('chatScroll' in $$props) $$invalidate(2, chatScroll = $$props.chatScroll);
    		if ('dialog' in $$props) $$invalidate(0, dialog = $$props.dialog);
    		if ('answers' in $$props) $$invalidate(1, answers = $$props.answers);
    		if ('startMessages' in $$props) $$invalidate(4, startMessages = $$props.startMessages);
    		if ('otherMessagesOne' in $$props) otherMessagesOne = $$props.otherMessagesOne;
    		if ('otherMessagesTwo' in $$props) otherMessagesTwo = $$props.otherMessagesTwo;
    		if ('otherMessagesThree' in $$props) otherMessagesThree = $$props.otherMessagesThree;
    		if ('otherMessagesFour' in $$props) otherMessagesFour = $$props.otherMessagesFour;
    		if ('otherMessagesFive' in $$props) otherMessagesFive = $$props.otherMessagesFive;
    		if ('otherMessagesSix' in $$props) otherMessagesSix = $$props.otherMessagesSix;
    		if ('otherMessagesSeven' in $$props) otherMessagesSeven = $$props.otherMessagesSeven;
    		if ('startDate' in $$props) startDate = $$props.startDate;
    		if ('startTime' in $$props) $$invalidate(3, startTime = $$props.startTime);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dialog, answers*/ 3) ;
    	};

    	return [
    		dialog,
    		answers,
    		chatScroll,
    		startTime,
    		startMessages,
    		changeAnswers,
    		div0_binding,
    		click_handler
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
    			add_location(main, file, 7, 0, 152);
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
