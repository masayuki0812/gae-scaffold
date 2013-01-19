from google.appengine.ext import db

class MyModel(db.Model):
    param = db.StringProperty(required=True)
