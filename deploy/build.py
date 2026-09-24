# -*- coding: utf-8 -*-
"""화면 파일을 deploy/public/ 으로 옮긴다.

화면은 한 벌만 관리한다. 내과제/웹앱.html 이 원본이고, Claude 아티팩트와
Cloudflare Worker 가 같은 파일을 쓴다. 여기서 하는 일은 복사뿐이다.

사용: python deploy/build.py
"""
import os
import shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "내과제", "웹앱.html")
DST_DIR = os.path.join(HERE, "public")
DST = os.path.join(DST_DIR, "app.html")

os.makedirs(DST_DIR, exist_ok=True)
shutil.copyfile(SRC, DST)
print("복사 완료: %s -> %s (%d bytes)" % (
    os.path.relpath(SRC, HERE), os.path.relpath(DST, HERE), os.path.getsize(DST)))
