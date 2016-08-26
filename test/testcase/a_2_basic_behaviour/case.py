import base_case
import requests
import os

class Case(base_case.Base_Case):
    def __init__(self, *args, **kwargs):
        super(Case, self).__init__(*args, **kwargs)
        self.desc = "test basic behaviour with config.json"
        self.vn_conf_dir = os.path.dirname(os.path.abspath(__file__))

    def test_vn_start_with_conf(self):
        #test index.html
        r = requests.get('http://127.0.0.1')
        assert r.status_code == 200
        assert r.headers.get('content-type') == 'text/html'
        f = open('/opt/verynginx/openresty/nginx/html/index.html', 'rb')
        index_content = f.read(1*1024*1024)
        f.close()
        assert index_content==r.content 
        self.check_ngx_stderr()
    
    def test_404(self): 
        #test notexist.html
        r = requests.get('http://127.0.0.1/notexist.html')
        assert r.status_code == 404
        assert r.headers.get('content-type') == 'text/html'
        assert b'404' in r.content
        self.check_ngx_stderr()

    def test_vn_index(self):
        r = requests.get('http://127.0.0.1/verynginx/index.html')
        assert r.status_code == 200
        f = open('/opt/verynginx/verynginx/dashboard/index.html', 'rb')
        index_content = f.read(1*1024*1024)
        f.close()
        assert index_content==r.content
        self.check_ngx_stderr()

    def test_vn_index_with_short_url(self):
        r = requests.get('http://127.0.0.1/vn/index.html')
        assert r.status_code == 200
        f = open('/opt/verynginx/verynginx/dashboard/index.html', 'rb')
        index_content = f.read(1*1024*1024)
        f.close()
        assert index_content==r.content 
        self.check_ngx_stderr()

