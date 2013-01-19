import webapp2

import jinja2
import os
import re
import sys
import logging

sys.path.append(os.path.join(os.path.dirname(__file__), 'lib'))
from my.db import MyModel

# -- Pages --#

class Index(webapp2.RequestHandler):
  def get(self):

    my_models = MyModel.all()

    template_values = {
      'message': 'It works.',
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))

# -- Setup -- #

#logging.getLogger().setLevel(logging.DEBUG)

## Jinja Setup
jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__) + '/tpl'))

"""
def some_func(arg):
  return arg

jinja_environment.filters['some_func'] = some_func
"""

## Route Setup
app = webapp2.WSGIApplication([('/', Index),
                               # ('/path', PageClass),
                              ],
                              debug=True)
