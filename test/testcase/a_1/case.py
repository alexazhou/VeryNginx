import base_case
import requests
import os

class Case(base_case.Base_Case):
    def __init__(self, *args, **kwargs):
        super(Case, self).__init__(*args, **kwargs)
        self.desc = "VeryNginx start"
        self.vn_conf = None

    def runTest(self):
        r = requests.get('http://127.0.0.1')
        assert r.status_code == 200
        f = open('/opt/verynginx/openresty/nginx/html/index.html', 'rb')
        index_content = f.read(1*1024*1024)
        f.close()
        assert index_content==r.content 
        self.check_ngx_stderr()

