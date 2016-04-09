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

work_path = os.curdir

def install_openresty( ):
    #check if the old version of VeryNginx installed
    if os.path.exists('/opt/VeryNginx/VeryNginx') == True:
        print("Seems that a old version of VeryNginx was installed in /opt/VeryNginx/...\nBefore install, please delete it and backup the configs if you need.")
        return
    
    #makesure the dir is clean
    print('### makesure the work directory is clean')
    exec('rm ' + openresty_pkg)
    exec('rm -rf ' + openresty_pkg.replace('.tar.gz',''))
    
    #download openresty
    print('### start download openresty package...')
    exec( 'wget ' + openresty_pkg_url )
    
    print('### release the package ...')
    exec( 'tar -xzf ' + openresty_pkg )

    #configure && compile && install openresty
    print('### configure openrestry ...')
    os.chdir( openresty_pkg.replace('.tar.gz','') )
    exec( './configure --prefix=/opt/verynginx/openrestry --user=nginx --group=nginx --with-http_stub_status_module --with-luajit' )
    
    print('### compile openrestry ...')
    exec( 'make' )
    
    print('### install openrestry ...')
    exec( 'make install' )

def install_verynginx():
    #install VeryNginx file
    print('### copy VeryNginx files ...')
    os.chdir( work_path )
    exec( 'cp -r -f ./verynginx /opt/verynginx/verynginx' )

def update_verynginx():
    install_verynginx()    

def exec( cmd ):
    print( cmd )
    os.system( cmd )


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


else:
    print ('install.py had been imported as a module')

