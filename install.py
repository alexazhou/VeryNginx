#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-04-04 23:48
# @Author  : Alexa (AlexaZhou@163.com)
# @Link    : https://github.com/alexazhou/VeryNginx
# @Disc    : install VeryNginx

import os
import sys
import getopt

openresty_pkg_url = 'https://openresty.org/download/openresty-1.9.7.3.tar.gz'
openresty_pkg = 'openresty-1.9.7.3.tar.gz'

work_path = os.getcwd()

def install_openresty( ):
    #check if the old version of VeryNginx installed
    if os.path.exists('/opt/VeryNginx/VeryNginx') == True:
        print("Seems that a old version of VeryNginx was installed in /opt/VeryNginx/...\nBefore install, please delete it and backup the configs if you need.")
        return
    
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
        exec_sys_cmd('rm -f ' + openresty_pkg)
        exec_sys_cmd( 'wget ' + openresty_pkg_url )
    else:
        print('### use local openresty package...')
    
    print('### release the package ...')
    exec_sys_cmd( 'tar -xzf ' + openresty_pkg )

    #configure && compile && install openresty
    print('### configure openrestry ...')
    os.chdir( openresty_pkg.replace('.tar.gz','') )
    #exec_sys_cmd( './configure --prefix=/opt/verynginx/openrestry --user=nginx --group=nginx --with-http_stub_status_module --with-luajit' )
    
    print('### compile openrestry ...')
    #exec_sys_cmd( 'make' )
    
    print('### install openrestry ...')
    #exec_sys_cmd( 'make install' )

def install_verynginx():
    #install VeryNginx file
    print('### copy VeryNginx files ...')
    os.chdir( work_path )
    exec_sys_cmd( 'pwd' )
    if os.path.exists('/opt/verynginx/') == False:
        exec_sys_cmd( 'mkdir -p /opt/verynginx' )
    
    exec_sys_cmd( 'cp -r -f ./verynginx /opt/verynginx/verynginx' )

def update_verynginx():
    install_verynginx()    


def exec_sys_cmd(cmd):
    print( cmd )
    os.system( cmd )


def common_input( s ):
    if sys.version_info.major == 3:
        return input( s )
    else:
        return raw_input( s )

def safe_pop(l):
    if len(l) == 0:
        return None
    else:
        return l.pop(0)

def show_help_and_exit():
    help_doc = 'usage: install.py <cmd> ... \n\
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

    print('All work finished successfully, enjoy it~')


else:
    print ('install.py had been imported as a module')

