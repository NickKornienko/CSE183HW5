// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        user_email: "",
        user_name: "",
        posts: [],
        post_likes: {},
        new_post: "",
        post_open: false,
        temp_id: -1,
        post_liked_by_user: {},
        post_disliked_by_user: {},
        post_like_names: {},
        post_dislike_names: {},
    };

    app.liked = function (post_id) {
        let likes = app.vue.post_likes[post_id];

        let is_liked = false;
        let is_disliked = false;

        if (likes) {
            for (let like of likes) {
                if (like.user_email == app.vue.user_email) {
                    if (like.is_like == "true") {
                        is_liked = true;
                    }
                    else {
                        is_disliked = true;
                    }
                }
            }
        }
        Vue.set(app.vue.post_liked_by_user, post_id, is_liked);
        Vue.set(app.vue.post_disliked_by_user, post_id, is_disliked);
    };

    app.clear_post_like_names = function (post_id) {
        Vue.set(app.vue.post_like_names, post_id, "");
        Vue.set(app.vue.post_dislike_names, post_id, "");
    }

    app.get_post_like_names = function (post_id) {
        app.get_post_dislike_names(post_id);

        let likes = app.vue.post_likes[post_id];

        if (!likes) {
            Vue.set(app.vue.post_like_names, post_id, "");
            // app.vue.post_like_names[post_id] = "";
            return;
        }

        let post_like_names = "Liked by ";

        for (let like of likes) {
            if (like.is_like == "false") {
                continue;
            }

            if (post_like_names != "Liked by ") {
                post_like_names += ", "
            }
            post_like_names += like.name;
        }

        if (post_like_names == "Liked by ") {
            Vue.set(app.vue.post_like_names, post_id, "");
            //app.vue.post_like_names[post_id] = "";
            return;
        }

        Vue.set(app.vue.post_like_names, post_id, post_like_names);
        // app.vue.post_like_names[post_id] = post_like_names;
    }

    app.get_post_dislike_names = function (post_id) {
        let likes = app.vue.post_likes[post_id];

        if (!likes) {
            Vue.set(app.vue.post_dislike_names, post_id, "");
            return;
        }

        let post_dislike_names = "Disliked by ";

        for (let like of likes) {
            if (like.is_like == "true") {
                continue;
            }

            if (post_dislike_names != "Disliked by ") {
                post_dislike_names += ", "
            }
            post_dislike_names += like.name;
        }

        if (post_dislike_names == "Disliked by ") {
            Vue.set(app.vue.post_dislike_names, post_id, "");
            return;
        }

        Vue.set(app.vue.post_dislike_names, post_id, post_dislike_names);
    }


    app.add_post = function () {
        axios.post(add_post_url, { content: app.vue.new_post, temp_id: app.vue.temp_id });

        let post = {
            content: app.vue.new_post,
            id: app.vue.temp_id--,
            name: app.vue.user_name,
            user_email: app.vue.user_email
        };

        app.vue.posts.push(post);
        app.vue.new_post = "";
    };

    app.cancel_post = function () {
        app.vue.post_open = false;
        app.vue.new_post = "";
    };

    app.open_post = function () {
        app.vue.post_open = true;
    }

    app.del_post = function (post_id) {
        axios.post(del_post_url, { post_id: post_id });
        for (let i = 0; i < app.vue.posts.length; i++) {
            if (app.vue.posts[i].id == post_id) {
                app.vue.posts.splice(i, 1);
            }
        }
    };

    app.like_post = function (post_id, is_toggled) {
        axios.post(like_post_url, { post_id: post_id, remove: is_toggled });

        if (!app.vue.post_likes[post_id]) {
            app.vue.post_likes[post_id] = [];
        }

        let likes = app.vue.post_likes[post_id];
        for (let i = 0; i < likes.length; i++) {
            if (likes[i].post_id == post_id &&
                likes[i].user_email == app.vue.user_email) {
                likes.splice(i, 1);
            }
        }

        if (!is_toggled) {
            let like = {
                id: null,
                is_like: "true",
                name: app.vue.user_name,
                user_email: app.vue.user_email,
                post_id: post_id
            };

            app.vue.post_likes[post_id].push(like);
        }

        app.liked(post_id);
    };

    app.dislike_post = function (post_id, is_toggled) {
        axios.post(dislike_post_url, { post_id: post_id, remove: is_toggled });

        if (!app.vue.post_likes[post_id]) {
            app.vue.post_likes[post_id] = [];
        }

        let likes = app.vue.post_likes[post_id];
        for (let i = 0; i < likes.length; i++) {
            if (likes[i].post_id == post_id &&
                likes[i].user_email == app.vue.user_email) {
                likes.splice(i, 1);
            }
        }

        if (!is_toggled) {
            let like = {
                id: null,
                is_like: "false",
                name: app.vue.user_name,
                user_email: app.vue.user_email,
                post_id: post_id
            };

            app.vue.post_likes[post_id].push(like);
        }

        app.liked(post_id);
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => { e._idx = k++; });
        return a;
    };


    // This contains all the methods.
    app.methods = {
        add_post: app.add_post,
        cancel_post: app.cancel_post,
        open_post: app.open_post,
        del_post: app.del_post,
        like_post: app.like_post,
        dislike_post: app.dislike_post,
        liked: app.liked,
        get_post_like_names: app.get_post_like_names,
        get_post_dislike_names: app.get_post_dislike_names,
        clear_post_like_names: app.clear_post_like_names
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    // And this initializes it.
    app.init = () => {
        axios.get(get_user_email_url)
            .then((result) => {
                let user_email = result.data.user_email;
                app.vue.user_email = user_email;
            })

        axios.get(get_user_name_url)
            .then((result) => {
                let user_name = result.data.user_name;
                app.vue.user_name = user_name;
            })

        axios.get(get_posts_url)
            .then((result) => {
                let posts = result.data.posts;
                app.vue.posts = posts;
            })
            .then(() => {
                let post_likes_temp = {};
                for (let post of app.vue.posts) {
                    axios.get(get_likes_url, { params: { post_id: post.id } })
                        .then((result) => {
                            let likes = result.data.likes;
                            Vue.set(app.vue.post_likes, post.id, likes);
                            app.liked(post.id);
                        })
                }
            })
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
