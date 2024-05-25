REM ###################
REM ## Python 3.11 用
REM ###################

REM https://qiita.com/natsuriver/items/72a5e180c1a65a8c8e92#linux-%E3%81%AE%E5%A0%B4%E5%90%88

py -m pip install pyvista[all,trame]
py -m pip uninstall vtk -y
py -m pip install --extra-index-url https://wheels.vtk.org vtk-osmesa
py -m pip install vtk
py -m pip install matplotlib

py -m pip list