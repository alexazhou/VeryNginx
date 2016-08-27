import base_case
import requests
import os

class Case(base_case.Base_Case):
    def __init__(self, *args, **kwargs):
        super(Case, self).__init__(*args, **kwargs)
        self.desc = "test matcher with multiform condition of referer"
        self.vn_conf_dir = os.path.dirname(os.path.abspath(__file__))

    def test_referer_equal(self): 
        r = requests.get('http://127.0.0.1/test_referer_equal',headers={'Referer':'vntestflag'})
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_equal',headers={'Referer':'vntestflag1'})
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_equal',headers={'Referer':'otherflag'})
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()
        
        r = requests.get('http://127.0.0.1/test_referer_equal',headers={'Referer':''})
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_equal',headers={'Referer':None})
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

    def test_referer_not_equal(self): 
        r = requests.get('http://127.0.0.1/test_referer_not_equal',headers={'Referer':'otherflag'})
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_not_equal',headers={'Referer':'vntestflagz'})
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_not_equal',headers={'Referer':''})
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_not_equal',headers={'Referer':None})
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_not_equal',headers={'Referer':'vntestflag'})
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

    def test_referer_match(self): 
        r = requests.get('http://127.0.0.1/test_referer_match',headers={'Referer':'aaatestbbb'})
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_match',headers={'Referer':'aaaotherbbb'})
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_match',headers={'Referer':'aaazestbbb'})
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_match',headers={'Referer':''})
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_match',headers={'Referer':None})
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

    def test_referer_not_match(self): 
        r = requests.get('http://127.0.0.1/test_referer_not_match',headers={'Referer':'aaaotherbbb'})
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_not_match',headers={'Referer':'aaazestbbb'})
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_not_match',headers={'Referer':''})
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_not_match',headers={'Referer':None})
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_not_match',headers={'Referer':'aaatestbbb'})
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

    def test_referer_existed(self): 
        r = requests.get('http://127.0.0.1/test_referer_existed',headers={'Referer':'aaatestbbb'})
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_existed',headers={'Referer':'aaaotherbbb'})
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_existed',headers={'Referer':''})
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_existed',headers={'Referer':None})
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

    def test_referer_not_existed(self): 
        r = requests.get('http://127.0.0.1/test_referer_not_existed',headers={'Referer':None})
        assert r.status_code == 400
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_not_existed',headers={'Referer':'aaatestbbb'})
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()

        r = requests.get('http://127.0.0.1/test_referer_not_existed',headers={'Referer':'aaaotherbbb'})
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()
        
        r = requests.get('http://127.0.0.1/test_referer_not_existed',headers={'Referer':''})
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert 'hited' not in r.text
        self.check_ngx_stderr()






    
