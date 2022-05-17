"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from py4web.utils.url_signer import URLSigner
from .models import get_user_email, get_user_name

url_signer = URLSigner(session)


@action('index')
@action.uses('index.html', db, auth.user, url_signer)
def index():
    return dict(
        get_user_email_url=URL('get_current_user_email', signer=url_signer),
        get_posts_url=URL('get_posts', signer=url_signer),
        add_post_url=URL('add_post', signer=url_signer),
        del_post_url=URL('del_post', signer=url_signer),
        get_likes_url=URL('get_likes', signer=url_signer),
        like_post_url=URL('like_post', signer=url_signer),
        dislike_post_url=URL('dislike_post', signer=url_signer)
    )


@action('get_posts')
@action.uses(url_signer.verify(), db)
def get_posts():
    posts = db(db.posts).select().as_list()
    posts.reverse()
    return dict(posts=posts)


@action('get_likes')
@action.uses(url_signer.verify(), db)
def get_likes():
    post_id = request.params.get('post_id')
    assert post_id is not None
    likes = db(db.likes.post_id == post_id).select().as_list()
    return dict(likes=likes)


@action('like_post', method='POST')
@action.uses(url_signer.verify(), db, auth.user)
def like_post():
    post_id = request.json.get('post_id')
    remove = request.json.get('remove')
    assert post_id is not None
    assert remove is not None

    if remove:
        db(db.likes.post_id == post_id and db.likes.user_email ==
           get_user_email() and db.likes.is_like == "true").delete()
    else:
        db.likes.insert(
            post_id=post_id,
            name=get_user_name(),
            is_like="true"
        )

    return "ok"


@action('dislike_post', method='POST')
@action.uses(url_signer.verify(), db, auth.user)
def dislike_post():
    post_id = request.json.get('post_id')
    remove = request.json.get('remove')
    assert post_id is not None
    assert remove is not None

    if remove:
        db(db.likes.post_id == post_id and db.likes.user_email ==
           get_user_email() and db.likes.is_like == "false").delete()
    else:
        db.likes.insert(
            post_id=post_id,
            name=get_user_name(),
            is_like="false"
        )

    return "ok"


@action('get_current_user_email')
@action.uses(url_signer.verify(), db)
def get_current_user_email():
    return dict(user_email=get_user_email())


@action('add_post', method='POST')
@action.uses(url_signer.verify(), db, auth.user)
def add_post():
    name = get_user_name()
    content = request.json.get('content')
    assert content is not None
    db.posts.insert(
        name=name,
        content=content
    )
    return "ok"


@action('del_post', method='POST')
@action.uses(url_signer.verify(), db, auth.user)
def del_post():
    post_id = request.json.get('post_id')
    assert post_id is not None
    db(db.posts.id == post_id).delete()
    db(db.likes.post_id == post_id).delete()
    return "ok"
