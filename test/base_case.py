import os
import time
import unittest



class Base_Case(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(Base_Case, self).__init__(*args, **kwargs)
        self.ngx_bin = '/opt/verynginx/openresty/nginx/sbin/nginx'

        self.ngx_conf_dir = os.path.dirname( os.path.abspath(__file__) )
        self.ngx_conf = None
        self.vn_conf_dir = self.ngx_conf_dir
        self.vn_conf = 'config.json'

    def exec_sys_cmd(self, cmd):
        ret = os.system(cmd)
        assert ret == 0
    
    def cfg_str(self):
        if self.ngx_conf == None:
            return ''
        else:
            return ' -c %s'%self.ngx_conf
        
    def setUp(self):
        self.exec_sys_cmd('rm -rf /opt/verynginx/verynginx/configs/*')
        #prepare config.json for verynginx
        if self.vn_conf != None:
            self.exec_sys_cmd('cp %s/%s /opt/verynginx/verynginx/configs/'%(self.vn_conf_dir, self.vn_conf))
        #start nginx
        self.exec_sys_cmd(self.ngx_bin + self.cfg_str())
    
    def tearDown(self):
        #stop nginx
        self.exec_sys_cmd(self.ngx_bin + self.cfg_str() + ' -s stop')
