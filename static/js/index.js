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
        new_post: "",
    };

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
        del_post: app.del_post
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
            })
            .then(() => {
                // TODO: Get like information
            });
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
