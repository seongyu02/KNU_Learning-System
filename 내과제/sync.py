# -*- coding: utf-8 -*-
"""ASCII 이름의 진입점.

`동기화.bat` 은 반드시 ASCII 로만 써야 한다. cmd.exe 는 .bat 파일을 콘솔 코드페이지로
읽기 때문에, 파일 안에 한글 경로가 들어 있으면 콘솔 설정에 따라 명령이 통째로 깨진다.
그래서 배치 파일은 `python sync.py` 만 부르고, 한글 경로는 파이썬이 다룬다.

사용: python sync.py [--html]
"""
import os
import sys
import importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
TARGET = os.path.join(HERE, "일정가져오기.py")

spec = importlib.util.spec_from_file_location("ical_fetch", TARGET)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

if __name__ == "__main__":
    if "--html" not in sys.argv:
        sys.argv.append("--html")
    mod.main()
