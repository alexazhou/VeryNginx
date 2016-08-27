import base_case
import requests
import os

class Case(base_case.Base_Case):
    def __init__(self, *args, **kwargs):
        super(Case, self).__init__(*args, **kwargs)
        self.desc = "test matcher with multiform condition of host"
        self.vn_conf_dir = os.path.dirname(os.path.abspath(__file__))

    def test_host_equal(self):
        r = requests.get('http://a.vntest.com/testhostequal')
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()
    
        r = requests.get('http://b.vntest.com/testhostequal')
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

        r = requests.get('http://c.vntest.com/testhostequal')
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()
    
    def test_host_not_equal(self): 
        r = requests.get('http://b.vntest.com/testhostnotequal')
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://c.vntest.com/testhostnotequal')
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()
        
        r = requests.get('http://a.vntest.com/testhostnotequal')
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

    def test_host_match(self): 
        r = requests.get('http://a.vntest.com/testhostmatch')
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://b.vntest.com/testhostmatch')
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()
    
        r = requests.get('http://127.0.0.1/testhostmatch')
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

    def test_host_not_match(self): 
        r = requests.get('http://127.0.0.1/testhostnotmatch')
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()
        
        r = requests.get('http://a.vntest.com/testhostnotmatch')
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

        r = requests.get('http://b.vntest.com/testhostnotmatch')
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

