REM ###################
REM ## Python 3.11 用
REM ###################

REM https://qiita.com/natsuriver/items/72a5e180c1a65a8c8e92#linux-%E3%81%AE%E5%A0%B4%E5%90%88


set PATH=%PATH%;C:\home\python3111x64\Scripts

C:\home\python3111x64\python.exe -m pip install --upgrade pip
 
C:\home\python3111x64\python.exe -m pip install pyvista[all,trame]
C:\home\python3111x64\python.exe -m pip uninstall vtk -y
C:\home\python3111x64\python.exe -m pip install --extra-index-url https://wheels.vtk.org vtk-osmesa
C:\home\python3111x64\python.exe -m pip install vtk
C:\home\python3111x64\python.exe -m pip install matplotlib

C:\home\python3111x64\python.exe -m pip list
