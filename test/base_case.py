import os
import time
import unittest



class Base_Case(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(Base_Case, self).__init__(*args, **kwargs)
        self.desc = "Base Case"
        self.ngx_bin = '/opt/verynginx/openresty/nginx/sbin/nginx'
        self.ngx_errlog = '/opt/verynginx/openresty/nginx/logs/error.log'

        self.ngx_conf_dir = None
        self.ngx_conf = None
        
        self.vn_conf_dir = self.ngx_conf_dir
        self.vn_conf = 'config.json'
        
        self.f_ngx_errlog = None

    def exec_sys_cmd(self, cmd):
        ret = os.system(cmd)
        assert ret == 0
    
    def cfg_str(self):
        if self.ngx_conf == None:
            return ''
        else:
            return ' -c %s'%self.ngx_conf

    def get_ngx_stderr(self):
        self.exec_sys_cmd(self.ngx_bin + self.cfg_str() + ' -s reopen')#refresh nginx log
        ret = self.f_ngx_errlog.read() 
        assert len(self.f_ngx_errlog.read(1)) == 0 #make sure no more log
        return ret
    
    def check_ngx_stderr(self, log_str=None, ignore_flag=[]):
        if log_str == None:
            log_str = self.get_ngx_stderr()

        mark = [ '[lua]','stack traceback','coroutine','in function','aborted','runtime error' ]
        for item in ignore_flag:
            mark.remove(item)

        for item in mark:
            if item in log_str:
                print( 'Got unexpected flag "%s" in nginx error.log:%s'%(item,log_str))
                assert False

    def setUp(self):
        print('Run: %s'%self.desc)
        #open nginx error.log
        self.f_ngx_errlog = open(self.ngx_errlog,'r')
        self.f_ngx_errlog.seek(0,os.SEEK_END)
        
        #prepare config.json for verynginx
        self.exec_sys_cmd('rm -rf /opt/verynginx/verynginx/configs/*')
        if self.vn_conf != None:
            self.exec_sys_cmd('cp %s/%s /opt/verynginx/verynginx/configs/config.json'%(self.vn_conf_dir, self.vn_conf))

        #start nginx
        self.exec_sys_cmd(self.ngx_bin + self.cfg_str())
    
    def tearDown(self):
        #close nginx log file
        self.f_ngx_errlog.close()
        #stop nginx
        self.exec_sys_cmd(self.ngx_bin + self.cfg_str() + ' -s stop')
