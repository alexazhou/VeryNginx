import base_case
import requests
import os

class Case(base_case.Base_Case):
    def __init__(self, *args, **kwargs):
        super(Case, self).__init__(*args, **kwargs)
        self.desc = "test verynginx start without config.json"
        self.vn_conf = None

    def test_vn_start_without_conf(self):
        r = requests.get('http://127.0.0.1')
        assert r.status_code == 200
        assert r.headers.get('content-type') == 'text/html'
        f = open('/opt/verynginx/openresty/nginx/html/index.html', 'rb')
        index_content = f.read(1*1024*1024)
        f.close()
        assert index_content==r.content 
        self.check_ngx_stderr()

