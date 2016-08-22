import os
import time
import unittest

class Base_Case(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(Base_Case, self).__init__(*args, **kwargs)
        self.ngx_conf = None
    def setUp(self):
        print( 'base case setup' )
    def tearDown(self):
        print( 'base case down' )
