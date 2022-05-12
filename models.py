"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth
from pydal.validators import *


def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None


def get_user_name():
    return f"{auth.current_user.get('first_name')} {auth.current_user.get('last_name')}" if auth.current_user else None


def get_time():
    return datetime.datetime.utcnow()


db.define_table(
    'posts',
    Field('user_email', default=get_user_email),
    Field('name', requires=IS_NOT_EMPTY()),
    Field('content', requires=IS_NOT_EMPTY()),
)

db.define_table(
    'likes',
    Field('post_id', requires=IS_NOT_EMPTY()),
    Field('user_email', default=get_user_email),
    Field('name', requires=IS_NOT_EMPTY()),
    Field('is_like', requires=IS_NOT_EMPTY()),
)

db.commit()
