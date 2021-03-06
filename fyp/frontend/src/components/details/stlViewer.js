function StlViewer(e, t) {
    var o = this;
    this.error = null, this.options = t, this.parent_element = e, this.get_opt = function (e, t) {
        return o.options ? !1 !== o.options[e] && (o.options[e] ? o.options[e] : t) : t
    }, this.canvas_width = o.get_opt("width", "100%"), this.canvas_height = o.get_opt("height", "100%"), this.bg_color = o.get_opt("bgcolor", "transparent"), this.models_to_add = o.get_opt("models", null), this.models = new Array, this.models_count = 0, this.models_ref = new Array, this.allow_drag_and_drop = o.get_opt("allow_drag_and_drop", !1), this.model_loaded_callback = o.get_opt("model_loaded_callback", null), this.all_loaded_callback = o.get_opt("all_loaded_callback", null), this.loading_progress_callback = o.get_opt("loading_progress_callback", null), this.max_model_id = 0, this.load_status = new Array, this.load_session = 0, this.loaded_models_arr = new Array, this.status = 0, this.onmousedown_callback = o.get_opt("on_model_mousedown", null), this.zoom = o.get_opt("zoom", -1), this.camerax = o.get_opt("camerax", 0), this.cameray = o.get_opt("cameray", 0), this.auto_rotate = o.get_opt("auto_rotate", !1), this.mouse_zoom = o.get_opt("mouse_zoom", !0), this.load_three_files = o.get_opt("load_three_files", ""), this.ready = "undefined" != typeof THREE, this.ready_callback = o.get_opt("ready_callback", null), this.auto_resize = o.get_opt("auto_resize", !0), this.on_model_drop = o.get_opt("on_model_drop", null), this.center_models = o.get_opt("center_models", !0), this.is_ie = !!window.MSStream, this.zoom >= 0 ? this.cameraz = this.zoom : this.cameraz = o.get_opt("cameraz", 0), this.MSG2WORKER_DATA = 0, this.MSG2WORKER_LOAD = 1, this.MSG2WORKER_ERROR = 2, this.MSGFROMWORKER_STL_LOADED = 3, this.MSGFROMWORKER_LOAD_IN_PROGRESS = 4, this.load_model = function (e, t) {
        return t = t || !1, o.max_model_id = Math.max(o.max_model_id, e.id), t || o.models_count++, e.filename || e.local_file ? o.load_from_stl_file(e, !1) : e.mesh ? o.add_from_existing_mesh(e) : void o.models_count--
    }, this.add_from_existing_mesh = function (e) {
        o.set_model_custom_props(e), e.mesh.model_id = e.id, o.set_geo_minmax(e), o.recalc_dims(e), o.scene.add(e.mesh), o.model_loaded(e.id), o.check_loading_status(e, 0, 0), e.mesh.geometry.boundingBox || e.mesh.geometry.computeBoundingBox(), o.model_loaded_callback && o.model_loaded_callback(e.id)
    }, this.load_from_stl_file = function (e) {
        var t = new Worker(("string" == typeof o.load_three_files ? o.load_three_files : "") + "load_stl.min.js");
        t.onmessage = function (a) {
            switch (a.data.msg_type) {
                case o.MSGFROMWORKER_STL_LOADED:
                    e.colors = a.data.colors;
                    var i = o.vf_to_geo(a.data.vertices, a.data.faces, !!a.data.colors && a.data.colors);
                    if (i) {
                        var s = new THREE.MeshLambertMaterial({
                            color: 9474192,
                            overdraw: 1,
                            wireframe: !1,
                            vertexColors: THREE.FaceColors
                        });
                        o.is_ie || (s.side = THREE.DoubleSide), e.display || (e.display = "flat"), o.set_material_display(e.display, s, i), e.mesh = new THREE.Mesh(i, s), o.set_model_custom_props(e), o.set_geo_minmax(e), e.mesh.model_id = e.id, o.recalc_dims(e), o.scene.add(e.mesh), o.model_loaded(e.id), o.model_loaded_callback && o.model_loaded_callback(e.id)
                    } else console.log("Error VF data ");
                    t.terminate(), t = void 0;
                    break;
                case o.MSGFROMWORKER_LOAD_IN_PROGRESS:
                    o.check_loading_status(e, a.data.loaded, a.data.total);
                    break;
                case o.MSG2WORKER_ERROR:
                    o.models_count--, o.model_error("ERROR: " + a.data.data)
            }
        }, e.bytes_loaded = 0, e.bytes_total = 0, t.postMessage({
            msg_type: o.MSG2WORKER_DATA,
            data: e,
            get_progress: null != o.loading_progress_callback
        }), t.postMessage({
            msg_type: o.MSG2WORKER_LOAD
        })
    }, this.model_loaded = function (e) {
        o.loaded_models_arr[e] = 1, Object.keys(o.loaded_models_arr).length >= o.models_count && (o.set_zoom(), o.set_light(), o.load_session++, o.all_loaded_callback && o.all_loaded_callback())
    }, this.remove_model = function (e) {
        if (void 0 === o.models_ref[e]) return o.model_error("remove_model - id not found: " + e);
        var t = o.models[o.models_ref[e]];
        t && (o.models.splice(o.models_ref[e], 1), o.models_ref.splice(e, 1), o.loaded_models_arr.splice(e, 1), o.models_count = Object.keys(o.models).length, o.scene.remove(t.mesh))
    }, this.zoom_done = !1, this.set_zoom = function (e, t) {
        if (e && (o.zoom = e), !(o.zoom_done && !t && o.zoom >= 0)) {
            o.zoom_done = !0;
            var a = Math.max(2 * o.maxx, 2 * o.maxy, o.maxz);
            o.camera.position.set(o.camera.position.x, o.camera.position.y, o.zoom >= 0 ? o.zoom : 1.2 * a * Math.max(1, o.camera.aspect / 2))
        }
    }, this.set_center_models = function (e) {
        o.center_models = e
    }, this.set_light = function () {
        o.directionalLight.position.x = 2 * o.maxy, o.directionalLight.position.y = 2 * o.miny, o.directionalLight.position.z = 2 * o.maxz, o.pointLight.position.x = (o.miny + o.maxy) / 2, o.pointLight.position.y = (o.miny + o.maxy) / 2, o.pointLight.position.z = 2 * o.maxz
    }, this.stop_auto_zoom = function () {
        o.zoom = o.camera.position.z
    }, this.set_camera = function (e, t, a) {
        t && (o.zoom = t), o.camera.position.set(e || o.camera.position.x, t || o.camera.position.y, o.zoom >= 0 ? o.zoom : Math.max(3 * o.maxx, 3 * o.maxy, 3.5 * o.maxz))
    }, this.set_auto_zoom = function () {
        o.set_zoom(-1)
    }, this.check_loading_status = function (e, t, a) {
        e && (o.load_status[e.id] = {
            loaded: t,
            total: a,
            load_session: o.load_session
        }), o.loading_progress_callback && Object.keys(o.load_status).length == o.models_count && o.loading_progress_callback(o.load_status, o.load_session)
    }, this.set_edges = function (e, t) {
        if (void 0 === o.models_ref[e]) return o.model_error("set_edges - id not found: " + e);
        var a = o.models[o.models_ref[e]];
        a && o.set_or_update_geo_edges(a, t)
    }, this.set_or_update_geo_edges = function (e, t, a) {
        if (t && !a || (e.edges && o.scene.remove(e.edges), e.edges = null, t)) {
            var i = !1;
            if (a = a || !1, !e.edges || a) {
                var s = e.mesh.geometry;
                e.edges = new THREE.LineSegments(new THREE.EdgesGeometry(s), o.edges_material), i = !0
            }(e.x || e.y || e.z) && e.edges.position.set(e.x ? e.x : 0, e.y ? e.y : 0, e.z ? e.z : 0), e.edges.rotation.setFromRotationMatrix(e.mesh.matrix), i && o.scene.add(e.edges)
        }
    }, this.set_model_custom_props = function (e) {
        e.x = e.x ? e.x : 0, e.y = e.y ? e.y : 0, e.z = e.z ? e.z : 0, e.mesh.position.set(e.x, e.y, e.z), e.colors ? o.update_mesh_color(e.mesh, "#FFFFFF") : e.color && o.update_mesh_color(e.mesh, e.color), e.rotationx = e.rotationx ? e.rotationx : 0, e.rotationy = e.rotationy ? e.rotationy : 0, e.rotationz = e.rotationz ? e.rotationz : 0, (e.rotationx || e.rotationy || e.rotationz) && this.rotate(e.id, e.rotationx, e.rotationy, e.rotationz);
        var t = void 0 !== e.scale ? e.scale : 1,
            a = void 0 !== e.scalex ? e.scalex : t,
            i = void 0 !== e.scaley ? e.scaley : t,
            s = void 0 !== e.scalez ? e.scalez : t;
        e.scalex = a, e.scaley = i, e.scalez = s, 1 == a && 1 == i && 1 == s || o.scale_geo(e.mesh.geometry, a, i, s), e.view_edges && o.set_or_update_geo_edges(e, !0), e.opacity && this.set_material_opacity(e.mesh.material, e.opacity), e.animation && (o.animation[e.id] = 1)
    }, this.set_scale = function (e, t, a, i) {
        if (void 0 === o.models_ref[e]) return o.model_error("set_scale - id not found: " + e);
        var s = o.models[o.models_ref[e]];
        if (s && s.mesh && s.mesh.geometry) {
            var n = Math.max(s.scalex, .01),
                r = Math.max(s.scaley, .01),
                l = Math.max(s.scalez, .01);
            t && (s.scalex = Math.max(t, .01)), s.scaley = Math.max(a || t, .01), s.scalez = Math.max(i || t, .01), o.scale_geo(s.mesh.geometry, s.scalex / n, s.scaley / r, s.scalez / l), s.edges && o.set_or_update_geo_edges(s, !0, !0)
        }
    }, this.scale_geo = function (e, t, o, a) {
        e.scale(t, o, a)
    }, this.recalc_dims = function (e) {
        var t = e.mesh.geometry;
        o.maxx = o.maxx ? Math.max(o.maxx, t.maxx + e.x) : t.maxx + e.x, o.maxy = o.maxy ? Math.max(o.maxy, t.maxy + e.y) : t.maxy + e.y, o.maxz = o.maxz ? Math.max(o.maxz, t.maxz + e.z) : t.maxz + e.z, o.minx = o.maxx ? Math.min(o.minx, t.minx + e.x) : t.minx + e.x, o.miny = o.maxy ? Math.min(o.miny, t.miny + e.y) : t.miny + e.y, o.minz = o.maxz ? Math.min(o.minz, t.minz + e.z) : t.minz + e.z
    }, this.update_mesh_color = function (e, t) {
        null != e && ("transparent" != t ? (e.traverse(function (e) {
            e.visible = !0
        }), e.material.color.set(parseInt(t.substr(1), 16))) : e.traverse(function (e) {
            e.visible = !1
        }))
    }, this.set_color = function (e, t) {
        if (void 0 === o.models_ref[e]) return o.model_error("set_color - id not found: " + e);
        var a = o.models[o.models_ref[e]];
        a && a.mesh && (a.color = t, o.update_mesh_color(a.mesh, t))
    }, this.error_in_model = function (e) {
        return e.id || 0 == e.id || -1 == e.id ? Number.isInteger(e.id) ? e.id < -1 ? o.model_error("id must be positive") : e.filename || e.mesh || e.local_file ? o.models_ref[e.id] ? o.model_error("such model ID already exists: " + e.id) : null : o.model_error("missing filename or mesh") : o.model_error("invalid id") : o.model_error("missing id")
    }, this.model_error = function (e) {
        return console.log(e), o.status = -1, o.error = e, e
    }, this.set_bg_color = function (e) {
        "transparent" == e ? this.renderer.setClearColor(0, 0) : this.renderer.setClearColor(e, 1)
    }, this.set_display = function (e, t) {
        if (void 0 === o.models_ref[e]) return o.model_error("set_display - id not found: " + e);
        var a = o.models[o.models_ref[e]];
        a && (o.set_material_display(t, a.mesh.material, a.mesh.geometry), a.display = t, a.mesh && (a.mesh.normalsNeedUpdate = !0))
    }, this.set_opacity = function (e, t) {
        if (void 0 === o.models_ref[e]) return o.model_error("set_display - id not found: " + e);
        var a = o.models[o.models_ref[e]];
        a && this.set_material_opacity(a.mesh.material, t)
    }, this.set_material_opacity = function (e, t) {
        e && (t < 1 ? (e.opacity = t, e.transparent = !0) : (e.opacity = 1, e.transparent = !1))
    }, this.set_on_model_mousedown = function (e) {
        o.onmousedown_callback = e, o.parent_element.onmousedown = e ? o.onmousedown : null
    }, this.onmousedown = function (e) {
        e.preventDefault(), o.mouse.x = (e.clientX - o.parent_element.offsetLeft) / o.parent_element.clientWidth * 2 - 1, o.mouse.y = -(e.clientY - o.parent_element.offsetTop) / o.parent_element.clientHeight * 2 + 1, o.raycaster.setFromCamera(o.mouse, o.camera);
        var t = o.raycaster.intersectObjects(o.scene.children);
        if (t.length > 0) {
            if (void 0 === t[0].object.model_id) return;
            o.onmousedown_callback && o.onmousedown_callback(t[0].object.model_id)
        }
    }, this.set_position = function (e, t, a, i) {
        if (void 0 === o.models_ref[e]) return o.model_error("set_position - id not found: " + e);
        var s = o.models[o.models_ref[e]];
        s && s.mesh && (s.x = t || s.x, s.y = a || s.y, s.z = i || s.z, s.mesh.position.set(s.x, s.y, s.z), s.edges && o.set_or_update_geo_edges(s, !0, !0))
    }, this.set_material_display = function (e, t, o) {
        switch (e.toLowerCase()) {
            case "wireframe":
                t.wireframe = !0;
                break;
            case "smooth":
                t.wireframe = !1, t.shading = THREE.SmoothShading, o && (o.mergeVertices(), o.computeVertexNormals());
                break;
            case "flat":
                t.wireframe = !1, t.shading = THREE.FlatShading, o && o.computeFlatVertexNormals()
        }
    }, this.rotate = function (e, t, a, i) {
        if (void 0 === o.models_ref[e]) return o.model_error("rotate - id not found: " + e);
        var s = o.models[o.models_ref[e]];
        s && (t && o.rotateAroundWorldAxis(s.mesh, o.WORLD_X_VECTOR, t), a && o.rotateAroundWorldAxis(s.mesh, o.WORLD_Y_VECTOR, a), i && o.rotateAroundWorldAxis(s.mesh, o.WORLD_Z_VECTOR, i), s.edges && o.set_or_update_geo_edges(s, !0))
    }, this.rotateAroundWorldAxis = function (e, t, o) {
        var a = new THREE.Matrix4;
        a.makeRotationAxis(t, o), a.multiply(e.matrix), e.matrix = a, e.rotation.setFromRotationMatrix(e.matrix)
    }, this.add_model = function (e, t) {
        if (Array.isArray(e)) return o.add_models(e);
        if (!o.ready) return o.models_to_add.push(e), o.model_error("THREE JS files are not ready");
        void 0 === e.id && (e.id = -1);
        var a = o.error_in_model(e);
        if (a) return a; - 1 == e.id && (e.id = ++o.max_model_id), o.models.push(e);
        var i = o.models.indexOf(e);
        return o.models_ref[e.id] = i, o.load_model(e, t), o.status
    }, this.add_models = function (e) {
        if (!Array.isArray(e)) return o.add_model(e);
        o.status = 0;
        var t = Object.keys(e);
        return o.models_count += t.length, t.forEach(function (t) {
            o.add_model(e[t], !0)
        }), o.status
    }, this.calc_volume_and_area = function (e) {
        var t, o, a, i, s, n, r, l, d, m, _, c, h, u, f = e.faces.length,
            x = 0,
            p = 0;
        for (m = 0; m < f; m++) t = e.vertices[e.faces[m].a].x, i = e.vertices[e.faces[m].a].y, r = e.vertices[e.faces[m].a].z, o = e.vertices[e.faces[m].b].x, s = e.vertices[e.faces[m].b].y, l = e.vertices[e.faces[m].b].z, x += -(a = e.vertices[e.faces[m].c].x) * s * r + o * (n = e.vertices[e.faces[m].c].y) * r + a * i * l - t * n * l - o * i * (d = e.vertices[e.faces[m].c].z) + t * s * d, u = ((_ = e.vertices[e.faces[m].a].distanceTo(e.vertices[e.faces[m].b])) + (c = e.vertices[e.faces[m].b].distanceTo(e.vertices[e.faces[m].c])) + (h = e.vertices[e.faces[m].c].distanceTo(e.vertices[e.faces[m].a]))) / 2, p += Math.sqrt(u * (u - _) * (u - c) * (u - h));
        return [Math.abs(x / 6), p, e.faces.length]
    }, this.get_model_info = function (e) {
        if (void 0 === o.models_ref[e]) return o.model_error("get_model_info - id not found: " + e);
        var t = o.models[o.models_ref[e]];
        if (t) {
            var a = t.mesh.geometry ? o.calc_volume_and_area(t.mesh.geometry) : [0, 0, 0];
            return {
                name: t.filename ? t.filename : t.local_file ? t.local_file.name : "",
                position: {
                    x: t.x,
                    y: t.y,
                    z: t.z
                },
                dims: {
                    x: t.mesh.geometry.maxx - t.mesh.geometry.minx,
                    y: t.mesh.geometry.maxy - t.mesh.geometry.miny,
                    z: t.mesh.geometry.maxz - t.mesh.geometry.minz
                },
                rotation: {
                    x: t.mesh.rotation.x,
                    y: t.mesh.rotation.y,
                    z: t.mesh.rotation.z
                },
                display: t.display ? t.display : null,
                color: t.color ? t.color : null,
                scale: {
                    x: t.scalex,
                    y: t.scaley,
                    z: t.scalez
                },
                volume: a[0],
                area: a[1],
                triangles: a[2]
            }
        }
    }, this.get_model_mesh = function (e) {
        if (void 0 === o.models_ref[e]) return o.model_error("get_model_mesh - id not found: " + e);
        var t = o.models[o.models_ref[e]];
        return t && t.mesh ? t.mesh.clone() : void 0
    }, this.set_auto_rotate = function (e) {
        o.controls.autoRotate = e
    }, this.set_mouse_zoom = function (e) {
        o.controls.noZoom = !e
    }, this.WORLD_X_VECTOR = null, this.WORLD_Y_VECTOR = null, this.WORLD_Z_VECTOR = null, this.maxx = null, this.maxy = null, this.maxz = null, this.minx = null, this.miny = null, this.minz = null, this.edges_material = null, this.raycaster = null, this.mouse = null, this.scene = null, this.is_webgl = null, this.renderer = null, this.camera = null, this.ambientLight = null, this.directionalLight = null, this.pointLight = null, this.controls = null, this.do_resize = function () {
        var e = o.parent_element.getBoundingClientRect(),
            t = e.width,
            a = e.height;
        o.camera.aspect = t / a, o.camera.updateProjectionMatrix(), o.renderer.setSize(t - 5, a - 5)
    }, this.animation = new Array, this.animate = function () {
        Object.keys(o.animation).forEach(function (e) {
            void 0 !== o.models_ref[e] && o.do_model_animation(o.models[o.models_ref[e]])
        }), requestAnimationFrame(o.animate), o.renderer.render(o.scene, o.camera), o.controls.update()
    }, this.do_model_animation = function (e) {
        if (e.animation) {
            var t = Date.now();
            if (e.animation.start_time || (e.animation.start_time = t), e.animation.delta) {
                var a = (t - e.animation.start_time) / e.animation.delta.msec,
                    i = e.animation.last_time ? (t - e.animation.last_time) / e.animation.delta.msec : a;
                if (o.animation_next_delta(e, e.animation.delta, i), a >= 1) {
                    if (!e.animation.delta.loop) return void o.remove_model_animation(e, !0);
                    e.animation.delta.start_time = null
                }
            }
            if (e.animation.exact) {
                i = (t - (e.animation.last_time ? e.animation.last_time : e.animation.start_time)) / e.animation.exact.msec;
                if (o.animation_next_exact(e, e.animation.exact, i), t >= e.animation.start_time + e.animation.exact.msec) return void o.remove_model_animation(e, !1, !0)
            }
            e.animation.last_time = t
        }
    }, this.animation_next_delta = function (e, t, a) {
        var i = !1,
            s = !1,
            n = !1;
        Object.keys(t).forEach(function (r) {
            switch (r) {
                case "x":
                case "y":
                case "z":
                    i || (i = !0, o.set_position(e.id, e.x + (void 0 !== t.x ? t.x * a : 0), e.y + (void 0 !== t.y ? t.y * a : 0), e.z + (void 0 !== t.z ? t.z * a : 0)));
                    break;
                case "rotationx":
                case "rotationy":
                case "rotationz":
                    s || (s = !0, o.rotate(e.id, void 0 !== t.rotationx ? t.rotationx * a : 0, void 0 !== t.rotationy ? t.rotationy * a : 0, void 0 !== t.rotationz ? t.rotationz * a : 0));
                    break;
                case "scale":
                case "scalex":
                case "scaley":
                case "scalez":
                    n || (n = !0, t.scalex = t.scalex ? t.scalex : t.scale ? t.scale : null, t.scaley = t.scaley ? t.scaley : t.scale ? t.scale : null, t.scalez = t.scalez ? t.scalez : t.scale ? t.scale : null, o.set_scale(e.id, e.scalex + (void 0 !== t.scalex ? t.scalex * a : 0), e.scaley + (void 0 !== t.scaley ? t.scaley * a : 0), e.scalez + (void 0 !== t.scalez ? t.scalez * a : 0)))
            }
        })
    }, this.animation_next_exact = function (e, t, a) {
        var i = !1,
            s = !1,
            n = !1;
        Object.keys(t).forEach(function (r) {
            switch (r) {
                case "x":
                case "y":
                case "z":
                    i || (i = !0, void 0 === t.xtotal && (t.xtotal = t.x - e.x), void 0 === t.ytotal && (t.ytotal = t.y - e.y), void 0 === t.ztotal && (t.ztotal = t.z - e.z), o.set_position(e.id, e.x + (void 0 !== t.x ? t.xtotal * a : 0), e.y + (void 0 !== t.y ? t.ytotal * a : 0), e.z + (void 0 !== t.z ? t.ztotal * a : 0)));
                    break;
                case "rotationx":
                case "rotationy":
                case "rotationz":
                    if (!s) {
                        s = !0;
                        var l = e.mesh.getWorldRotation();
                        void 0 === t.rotxtotal && (t.rotxtotal = t.rotationx - l.x), void 0 === t.rotytotal && (t.rotytotal = t.rotationy - l.y), void 0 === t.rotztotal && (t.rotztotal = t.rotationz - l.z), o.rotate(e.id, void 0 !== t.rotationx ? t.rotxtotal * a : 0, void 0 !== t.rotationy ? t.rotytotal * a : 0, void 0 !== t.rotationz ? t.rotztotal * a : 0)
                    }
                    break;
                case "scale":
                case "scalex":
                case "scaley":
                case "scalez":
                    n || (n = !0, t.scalex = t.scalex ? t.scalex : t.scale ? t.scale : null, t.scaley = t.scaley ? t.scaley : t.scale ? t.scale : null, t.scalez = t.scalez ? t.scalez : t.scale ? t.scale : null, void 0 === t.scalextotal && (t.scalextotal = t.scalex - e.scalex), void 0 === t.scaleytotal && (t.scaleytotal = t.scaley - e.scaley), void 0 === t.scaleztotal && (t.scaleztotal = t.scalez - e.scalez), o.set_scale(e.id, e.scalex + (void 0 !== t.scalex ? t.scalextotal * a : 0), e.scaley + (void 0 !== t.scaley ? t.scaleytotal * a : 0), e.scalez + (void 0 !== t.scalez ? t.scaleztotal * a : 0)))
            }
        })
    }, this.remove_model_animation = function (e, t, a) {
        t && (e.animation.delta = null), a && (e.animation.exact = null), e.animation.delta || e.animation.exact || (e.animation = null, delete o.animation[e.id])
    }, this.animate_model = function (e, t) {
        if (void 0 === o.models_ref[e]) return o.model_error("animate-model - id not found: " + e);
        var a = o.models[o.models_ref[e]];
        if (a) {
            if (!t) return o.remove_model_animation(a, !0, !0);
            a.animation = JSON.parse(JSON.stringify(t)), a.animation.delta && (a.animation.delta.msec || (a.animation.delta.msec = 300)), a.animation.exact && (a.animation.exact.msec || (a.animation.exact.msec = 300)), o.animation[e] = 1
        }
    }, this.init = function () {
        o.WORLD_X_VECTOR = new THREE.Vector3(1, 0, 0), o.WORLD_Y_VECTOR = new THREE.Vector3(0, 1, 0), o.WORLD_Z_VECTOR = new THREE.Vector3(0, 0, 1), o.edges_material = new THREE.LineBasicMaterial({
            color: 0
        }), o.raycaster = new THREE.Raycaster, o.mouse = new THREE.Vector2, o.scene = new THREE.Scene, o.is_webgl = webgl_Detector.webgl, o.renderer = o.is_webgl ? new THREE.WebGLRenderer({
            preserveDrawingBuffer: !0,
            alpha: !0
        }) : new THREE.CanvasRenderer({
            alpha: !0
        }), o.camera = new THREE.PerspectiveCamera(45, 1, .1, 1e4), o.set_bg_color(o.bg_color), o.parent_element.appendChild(o.renderer.domElement), o.camera.position.set(o.camerax, o.cameray, o.cameraz), o.scene.add(o.camera), o.do_resize(), o.ambientLight = new THREE.AmbientLight(2105376), o.camera.add(o.ambientLight), o.directionalLight = new THREE.DirectionalLight(16777215, .75), o.directionalLight.position.x = 1, o.directionalLight.position.y = 1, o.directionalLight.position.z = 2, o.directionalLight.position.normalize(), o.camera.add(o.directionalLight), o.pointLight = new THREE.PointLight(16777215, .3), o.pointLight.position.x = 0, o.pointLight.position.y = -25, o.pointLight.position.z = 10, o.camera.add(o.pointLight), o.controls = new THREE.OrbitControls(o.camera, o.renderer.domElement), o.controls.autoRotate = o.auto_rotate, !1 === o.mouse_zoom && o.set_mouse_zoom(o.mouse_zoom), o.animate(), o.models_to_add && o.add_models(o.models_to_add), o.set_auto_resize(o.auto_resize)
    }, this.set_auto_resize = function (e) {
        e ? window.addEventListener("resize", o.do_resize) : window.removeEventListener("resize", o.do_resize)
    }, this.vf_to_geo = function (e, t, a) {
        if (!e) return null;
        if (!t) return null;
        var s = [],
            n = [],
            r = e.length;
        for (i = 0; i < r; i++) s.push(new THREE.Vector3(e[i][0], e[i][1], e[i][2]));
        r = t.length;
        if (a)
            for (i = 0; i < r; i++) {
                var l = new THREE.Face3(t[i][0], t[i][1], t[i][2]);
                l.color.setRGB(t[i][3], t[i][4], t[i][5]), n.push(l)
            } else
                for (i = 0; i < r; i++) n.push(new THREE.Face3(t[i][0], t[i][1], t[i][2]));
        var d = new THREE.Geometry;
        return d.vertices = s, d.faces = n, d.computeBoundingBox(), d.computeFaceNormals(), d.computeVertexNormals(), o.center_models && d.center(d), d
    }, this.set_geo_minmax = function (e) {
        var t = e.mesh.geometry;
        if (t.boundingBox) t.minx = t.boundingBox.min.x, t.miny = t.boundingBox.min.y, t.minz = t.boundingBox.min.z, t.maxx = t.boundingBox.max.x, t.maxy = t.boundingBox.max.y, t.maxz = t.boundingBox.max.z;
        else {
            for (var o = t.vertices, a = o[0].x, i = o[0].y, s = o[0].z, n = o[0].x, r = o[0].y, l = o[0].z, d = o.length; d--;) o[d].x < a && (a = o[d].x), o[d].y < i && (i = o[d].y), o[d].z < s && (s = o[d].z), o[d].x > n && (n = o[d].x), o[d].y > r && (r = o[d].y), o[d].z > l && (l = o[d].z);
            t.minx = a + e.x, t.miny = i + e.y, t.minz = s + e.z, t.maxx = n + e.x, t.maxy = r + e.y, t.maxz = l + e.z
        }
    }, this.handleDragOver = function (e) {
        e.stopPropagation(), e.preventDefault(), e.dataTransfer.dropEffect = "copy"
    }, this.handleFileDrop = function (e) {
        if (e.stopPropagation(), e.preventDefault(), e.dataTransfer.files.length > 0) {
            for (var t = new Array, a = e.dataTransfer.files.length, i = 0; i < a; i++) t.push({
                id: -1,
                local_file: e.dataTransfer.files[i]
            }), o.on_model_drop && o.on_model_drop(e.dataTransfer.files[i].name);
            o.add_models(t)
        } else "string" == typeof e.dataTransfer.getData("Text") && (o.add_model({
            id: -1,
            filename: e.dataTransfer.getData("Text")
        }), o.on_model_drop && o.on_model_drop(e.dataTransfer.getData("Text")))
    }, this.clean = function () {
        if (o.scene) {
            var e = o.scene;
            for (i = e.children.length; i--;) "Mesh" === e.children[i].type && e.remove(e.children[i]);
            o.camera.position.set(o.camerax, o.cameray, o.cameraz), o.models = new Array, o.models_count = 0, o.models_ref = new Array, o.max_model_id = 0, o.load_status = new Array, o.load_session = 0, o.loaded_models_arr = new Array, o.animation = new Array
        }
    }, this.reset_parent_element = function (e) {
        o.parent_element = e, o.allow_drag_and_drop && o.set_drag_and_drop(!0), o.set_on_model_mousedown(this.onmousedown_callback), o.parent_element.appendChild(o.renderer.domElement)
    }, this.set_drag_and_drop = function (e) {
        e ? (o.parent_element.addEventListener("dragover", o.handleDragOver), o.parent_element.addEventListener("drop", o.handleFileDrop)) : (o.parent_element.removeEventListener("dragover", o.handleDragOver), o.parent_element.removeEventListener("drop", o.handleFileDrop))
    }, o.allow_drag_and_drop && o.set_drag_and_drop(!0), this.set_on_model_mousedown(this.onmousedown_callback), this.scripts_loader = null, this.external_files_loaded = function () {
        o.ready = !0, o.init(), o.ready_callback && o.ready_callback()
    }, this.load_three = function (e) {
        "string" != typeof o.load_three_files && (o.load_three_files = ""), o.scripts_loader = new ScriptsLoader, o.scripts_loader.load_scripts(new Array(e + "three.min.js", e + "webgl_detector.js", e + "Projector.js", e + "CanvasRenderer.js", e + "OrbitControls.js"), o.external_files_loaded)
    }, o.ready ? (o.init(), o.ready_callback && o.ready_callback()) : !1 !== o.load_three_files ? o.load_three(o.load_three_files) : o.model_error("No THREE files were loaded")
}

function ScriptsLoader() {
    var e = this;
    this.all_loaded_callback = null, this.scripts_to_load = new Array, this.loading_scripts = new Array, this.loaded_scripts = new Array, this.scripts_are_loaded = function (t) {
        var o = Object.keys(t);
        for (i = o.length; i--;)
            if (!e.loaded_scripts[e.get_full_name(t[i])]) return !1;
        return !0
    }, this.get_short_name = function (e) {
        return e ? e.substring(e.lastIndexOf("/") + 1) : ""
    }, this.load_scripts = function (t, o) {
        o && (e.all_loaded_callback = o), Object.keys(t).forEach(function (o) {
            var a = e.get_short_name(t[o]); - 1 == e.scripts_to_load.indexOf(a) && (e.loading_scripts[a] || e.loaded_scripts[a] || e.scripts_to_load.push(t[o]))
        }), e.load_files()
    }, this.load_files = function () {
        if (0 != e.scripts_to_load.length)
            for (; e.scripts_to_load.length;) {
                var t = e.scripts_to_load.shift();
                if (!e.loading_scripts[t]) {
                    e.loading_scripts[t] = 1;
                    var o = document.createElement("script");
                    return o.onload = function () {
                        var t = e.get_short_name(o.src);
                        e.loaded_scripts[t] = 1, e.loading_scripts[t] = 0, e.load_files()
                    }, o.src = t, void document.head.appendChild(o)
                }
            } else e.all_loaded_callback && e.all_loaded_callback()
    }
}
Number.isInteger = Number.isInteger || function (e) {
    return "number" == typeof e && isFinite(e) && Math.floor(e) === e
};