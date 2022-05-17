// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        user_email: "",
        posts: [],
        post_likes: {},
        new_post: "",
    };

    app.liked = function (post_id) {
        let likes = app.vue.post_likes[post_id];

        if (!likes) {
            return false;
        }

        for (let like of likes) {
            if (like.user_email == app.vue.user_email) {
                if (like.is_like == "true") {
                    return true;
                }
            }
        }
        return false;
    };

    app.disliked = function (post_id) {
        let likes = app.vue.post_likes[post_id];

        if (!likes) {
            return "false";
        }

        for (let like of likes) {
            if (like.user_email == app.vue.user_email) {
                if (like.is_like == "false") {
                    return true;
                }
            }
        }
        return false;
    };

    app.get_post_like_names = function (post_id) {
        let likes = app.vue.post_likes[post_id];

        if (!likes) {
            return "";
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
            return "";
        }

        return post_like_names;
    }

    app.get_post_dislike_names = function (post_id) {
        let likes = app.vue.post_likes[post_id];

        if (!likes) {
            return "";
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
            return "";
        }

        return post_dislike_names;
    }


    app.add_post = function () {
        axios.post(add_post_url, { content: app.vue.new_post });
        app.vue.new_post = "";
    };

    app.cancel_post = function () {
        app.vue.new_post = "";
    };

    app.del_post = function (post_id) {
        axios.post(del_post_url, { post_id: post_id });
    };

    app.like_post = function (post_id, is_toggled) {
        axios.post(like_post_url, { post_id: post_id, remove: is_toggled });
    };

    app.dislike_post = function (post_id, is_toggled) {
        axios.post(dislike_post_url, { post_id: post_id, remove: is_toggled });
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
        del_post: app.del_post,
        like_post: app.like_post,
        dislike_post: app.dislike_post,
        liked: app.liked,
        disliked: app.disliked,
        get_post_like_names: app.get_post_like_names,
        get_post_dislike_names: app.get_post_dislike_names
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
                let user_email = result.data.user_email
                app.vue.user_email = user_email
            })

        axios.get(get_posts_url)
            .then((result) => {
                let posts = result.data.posts;
                app.vue.posts = posts;

                for (let post of app.vue.posts) {
                    axios.get(get_likes_url, { params: { post_id: post.id } })
                        .then((result) => {
                            let likes = result.data.likes;
                            app.vue.post_likes[post.id] = likes;
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
