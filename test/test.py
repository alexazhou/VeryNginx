#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-08-21 23:06
# @Author  : Alexa (AlexaZhou@163.com)
# @Link    : https://github.com/alexazhou/VeryNginx
# @Disc    : test VeryNginx
# @Disc    : support python 3.x

import os
import time
import unittest


def load_test_case():
    ret = {}

    dir_filter = lambda x:os.path.exists( './testcase/' + x + '/case.py' )
    case_list = list(filter( dir_filter, os.listdir('./testcase/') ))
   
    for case in case_list:
        tmp = __import__( 'testcase.%s.case'%case )
        ret[case] = eval( 'tmp.%s.case'%case )
    
    return ret


if __name__ == "__main__":

    script_path = os.path.dirname( os.path.abspath(__file__) )
    os.chdir( script_path )

    all_case = load_test_case()
    major_suite = unittest.TestSuite()
    for k in all_case.keys():
        suite = unittest.defaultTestLoader.loadTestsFromTestCase(all_case[k].Case)
        major_suite.addTests( suite )
    
    runner = unittest.TextTestRunner()
    ret = runner.run(major_suite)
    assert ret.wasSuccessful()
