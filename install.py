#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-04-04 23:48
# @Author  : Alexa (AlexaZhou@163.com)
# @Link    : https://github.com/alexazhou/VeryNginx
# @Disc    : install VeryNginx
# @Disc    : support python 2.x and 3.x

import os
import sys
import getopt
import filecmp

#最新版openresty

openresty_pkg_url = 'https://openresty.org/download/openresty-1.15.8.1.tar.gz'
openresty_pkg = 'openresty-1.15.8.1.tar.gz'

work_path = os.getcwd()

def install_openresty( ):
    #check if the old version of VeryNginx installed( use upcase directory )
    if os.path.exists('/opt/VeryNginx/VeryNginx') == True:
        print("Seems that a old version of VeryNginx was installed in /opt/verynginx/...\nBefore install, please delete it and backup the configs if you need.")
        sys.exit(1)
    
    #makesure the dir is clean
    print('### makesure the work directory is clean')
    exec_sys_cmd('rm -rf ' + openresty_pkg.replace('.tar.gz',''))
    
    #download openresty
    down_flag = True
    if os.path.exists( './' + openresty_pkg ):
        ans = ''
        while ans not in ['y','n']:
            ans = common_input(' Found %s in current directory, use it?(y/n)'%openresty_pkg)
        if ans == 'y':
            down_flag = False

    if down_flag == True:
        print('### start download openresty package...')
        exec_sys_cmd('rm -rf ' + openresty_pkg)
        exec_sys_cmd( 'wget ' + openresty_pkg_url )
    else:
        print('### use local openresty package...')
    
    print('### release the package ...')
    exec_sys_cmd( 'tar -xzf ' + openresty_pkg )

    #configure && compile && install openresty
    print('### configure openresty ...')
    os.chdir( openresty_pkg.replace('.tar.gz','') )
    exec_sys_cmd( './configure --prefix=/opt/verynginx/openresty --user=nginx --group=nginx --with-http_v2_module --with-http_sub_module --with-http_stub_status_module --with-luajit' )
    
    print('### compile openresty ...')
    exec_sys_cmd( 'make' )
    
    print('### install openresty ...')
    exec_sys_cmd( 'make install' )

    # print('### make nginx into PATH ...')
    # May Not Work in CI
    # exec_sys_cmd( 'export PATH=/opt/verynginx/openresty/nginx/sbin:$PATH' )

    # print('### add user and group nginx:nginx')
    # May Not Work in CI
    # exec_sys_cmd( 'sudo groupadd -f nginx && useradd -g nginx nginx' )

def install_verynginx():
    
    #install VeryNginx file
    print('### copy VeryNginx files ...')
    os.chdir( work_path )
    if os.path.exists('/opt/verynginx/') == False:
        exec_sys_cmd( 'mkdir -p /opt/verynginx' )
    
    exec_sys_cmd( 'cp -r -f ./verynginx /opt/verynginx' )

    #copy nginx config file to openresty
    if os.path.exists('/opt/verynginx/openresty') == True:
        if filecmp.cmp( '/opt/verynginx/openresty/nginx/conf/nginx.conf', '/opt/verynginx/openresty/nginx/conf/nginx.conf.default', False ) == True:
            print('cp nginx config file to openresty')
            exec_sys_cmd( 'cp -f ./nginx.conf  /opt/verynginx/openresty/nginx/conf/' )
    else:
        print( 'openresty not fount, so not copy nginx.conf' )

    # set mask for the path which used for save configs
    # file too open;
    # exec_sys_cmd( 'chmod -R 777 /opt/verynginx/verynginx/configs' )
    exec_sys_cmd( 'chmod -R 755 /opt/verynginx/verynginx/configs' )


def update_verynginx():
    install_verynginx()    


def exec_sys_cmd(cmd, accept_failed = False):
    print( cmd )
    ret = os.system( cmd )
    if  ret == 0:
        return ret
    else:
        if accept_failed == False:
            print('*** The installing stopped because something was wrong')
            exit(1)
        else:
            return False

def common_input( s ):
    if sys.version_info[0] == 3:
        return input( s )
    else:
        return raw_input( s )

def safe_pop(l):
    if len(l) == 0:
        return None
    else:
        return l.pop(0)

def show_help_and_exit():
    help_doc = 'usage: install.py <cmd> <args> ... \n\n\
install cmds and args:\n\
    install\n\
        all        :  install verynginx and openresty(default)\n\
        openresty  :  install openresty\n\
        verynginx  :  install verynginx\n\
    update\n\
        verynginx  :  update the installed verynginx\n\
    '
    print(help_doc)
    exit()


if __name__ == '__main__':

    opts, args = getopt.getopt(sys.argv[1:], '', []) 
  
    cmd = safe_pop(args)
    if cmd == 'install':
        cmd = safe_pop(args)
        if cmd == 'all' or cmd == None:
            install_openresty()
            install_verynginx()
        elif cmd == 'openresty':
            install_openresty()
        elif cmd == 'verynginx':
            install_verynginx()
        else:
            show_help_and_exit()
    elif cmd == 'update':
        cmd = safe_pop(args)
        if cmd == 'verynginx':
            update_verynginx()
        else:
            show_help_and_exit()
    else:
        show_help_and_exit()

    print('*** All work finished successfully, enjoy it~')


else:
    print ('install.py had been imported as a module')
    print ('please add group and user nginx:nginx')
    print ('to use nginx, add it in PATH: \nexport PATH=/opt/verynginx/openresty/nginx/sbin:$PATH')
