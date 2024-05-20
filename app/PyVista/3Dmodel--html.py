# -*- coding: utf-8 -*-

#######################################################################################
# Nuitka memo
# https://www.idnet.co.jp/column/page_245.html
# https://blog.tsukumijima.net/article/python-nuitka-usage/#toc2

#--- @CMD -------------------------------------
# cd (#Directory to export the result .exe)
# pipenv shell
# py -m pip install -r "C:\Users\yuya.kitano\Desktop\TEMP\Codes\Python\0031_3DmodelView\requirements.txt"
# py -m pip list

# (#Check) "C:\Users\yuya.kitano\Desktop\TEMP\Codes\Python\0031_3DmodelView\3DmodelView.py" "C:\Users\yuya.kitano\Desktop\TEMP\Codes\Python\0031_3DmodelView\PotatoChips.obj"

# nuitka --mingw64 --follow-imports --onefile --disable-console --enable-plugin=tk-inter "3Dmodel--html.py"
#######################################################################################
# * pip-licenses *
# https://dev.classmethod.jp/articles/python-pipdeptree_licenses/#:~:text=python%2Dlicenses.csv%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AB%E5%87%BA%E5%8A%9B
# (#Check) py -m pip install pipdeptree pip-licenses
# (#Check) pip-licenses --with-urls --format=csv --with-description --output-file=python-licenses.csv
#######################################################################################

# https://qiita.com/natsuriver/items/72a5e180c1a65a8c8e92

# ===================================================================
# pip install pyvista[all,trame]
####### pip uninstall vtk -y
# pip install --extra-index-url https://wheels.vtk.org vtk-osmesa

 # nuitka --mingw64 --follow-imports --onefile --disable-console --enable-plugin=tk-inter pyvista.plotter.export_html_.py
 
 # pip3 install pytk
# ===================================================================

import io
import os
import sys
import numpy as np
from tkinter import Tk
from tkinter import messagebox
from tkinter import TclError
import pyvista as pv
import trimesh

from pyvista import examples
from pyvista import themes

path_me = os.path.abspath(os.path.realpath(__file__))
pathd_me = os.path.abspath(os.path.dirname(path_me))
basename_me = os.path.splitext(os.path.basename(path_me))[0]
os.chdir(pathd_me)

if len(sys.argv) != 2:
    root = Tk()
    root.withdraw()
    try:
        root.after(5000, root.destroy)  # in milliseconds 
        messagebox.Message(title='Error', message='Specify just one model file ( .stl ) as argument !', icon='error', master=root).show()
    except TclError:
        pass
    sys.exit()

path_3d = os.path.abspath(sys.argv[1])
pathd_3d = os.path.abspath(os.path.dirname(path_3d))
basename_3d = os.path.splitext(os.path.basename(path_3d))[0]

#Parameters
res_theta = 10
res_phi = 10
color_pcl = '#E0C89A'
color_grid = '#34C363'
color_x = '#DF143F'
color_y = '#34C363'
color_z = '#2468D0'

#=========================================================================
def main():
    #-------------------------------------------------------------------------
    #Count Arguments
    if len(sys.argv) != 2:
        root = Tk()
        root.withdraw()
        try:
            root.after(5000, root.destroy)  # in milliseconds 
            messagebox.Message(title='Error', message='Specify just one model file ( .stl | .obj | .glb | .gltf ) as argument !', icon='error', master=root).show()
        except TclError:
            pass
        sys.exit()
    
    path_3d = os.path.abspath(sys.argv[1])
    pathd_3d = os.path.abspath(os.path.dirname(path_3d))
    basename_3d = os.path.splitext(os.path.basename(path_3d))[0]
    
    #Filter by Extention
    if os.path.splitext(path_3d)[1] != '.stl' and \
       os.path.splitext(path_3d)[1] != '.obj' and \
       os.path.splitext(path_3d)[1] != '.glb' and \
       os.path.splitext(path_3d)[1] != '.gltf':
        root = Tk()
        root.withdraw()
        try:
            root.after(5000, root.destroy)  # in milliseconds 
            messagebox.Message(title='Error', message='Just a .stl or .obj or .glb or .gltf file available !', icon='error', master=root).show()
        except TclError:
            pass
        sys.exit()
    #-------------------------------------------------------------------------
    #Launch PyVista
    pl = launch_pyvista()
    #-------------------------------------------------------------------------
    #Load mesh
    if os.path.splitext(path_3d)[1] == '.obj' or \
       os.path.splitext(path_3d)[1] == '.glb'or \
       os.path.splitext(path_3d)[1] == '.gltf':
        #-----------------------------------
        #Convert .obj to .glb w/ Trimesh
        if os.path.splitext(path_3d)[1] == '.obj':
            path_3d_glb = os.path.join(os.path.split(path_3d)[0], os.path.splitext(os.path.split(path_3d)[1])[0] + '.glb')
            if os.path.isfile(path_3d_glb) == False:
                # https://trimesh.org/trimesh.exchange.load.html#trimesh.exchange.load.load:~:text=For%20%E2%80%98mesh%E2%80%99%3A%20try%20to%20coerce%20scenes%20into%20a%20single%20mesh
                mesh = trimesh.load(path_3d, force = 'mesh')
                
                #Add PBR material
                # https://trimesh.org/trimesh.visual.material.html
                mat_pbr = mesh.visual.material.to_pbr()
                mat_pbr.doubleSided = True
                mat_pbr.alphaMode = 'OPAQUE'
                mat_pbr.metallicFactor = 0.0
                mat_pbr.roughnessFactor = 0.7
                mat_pbr.emissiveFactor = [0.0, 0.0, 0.0]
                mesh.visual.material = mat_pbr
                
                # https://trimesh.org/trimesh.html#trimesh.Trimesh.export:~:text=Supported%20formats%20are%20stl%2C%20off%2C%20ply%2C%20collada%2C%20json%2C%20dict%2C%20glb%2C%20dict64%2C%20msgpack.
                mesh.export(file_type = "glb", file_obj = path_3d_glb)
                if os.path.isfile(path_3d_glb) == False:
                    root = Tk()
                    root.withdraw()
                    try:
                        root.after(5000, root.destroy)  # in milliseconds 
                        messagebox.Message(title='Error', message='Failed to convert .obj to .glb ...', icon='error', master=root).show()
                    except TclError:
                        pass
                    sys.exit()
            path_3d = path_3d_glb
        #-----------------------------------
        # https://pypi.org/project/pygltflib/#converting-files:~:text=of%20binary%20data%3E-,Converting%20files,-First%20method
        pl.import_gltf(path_3d)
        xmin = pl.bounds[0]
        xmax = pl.bounds[1]
        ymin = pl.bounds[2]
        ymax = pl.bounds[3]
        zmin = pl.bounds[4]
        zmax = pl.bounds[5]
    else:
        mesh = pv.read(path_3d)
        # https://docs.pyvista.org/version/stable/api/plotting/_autosummary/pyvista.Plotter.add_mesh.html#pyvista.Plotter.add_mesh
        pl.add_mesh(
            mesh,
            color = pv.Color(color_pcl, opacity = 0.5),
            smooth_shading = True,
            ambient = 1.0,
            diffuse = 1.0,
            specular = 0.1,
            specular_power = 1,
            pbr = True,
            metallic = 0.0,
            roughness = 0.5,
            show_edges = True,
            edge_color = pv.Color([146,128,92], opacity = 0.1),
        )
        xmin = mesh.bounds[0]
        xmax = mesh.bounds[1]
        ymin = mesh.bounds[2]
        ymax = mesh.bounds[3]
        zmin = mesh.bounds[4]
        zmax = mesh.bounds[5]
    #-------------------------------------------------------------------------
    #Set Bounds
    # https://docs.pyvista.org/version/stable/api/plotting/_autosummary/pyvista.Plotter.show_bounds.html
    cube_axes_actor = pl.show_bounds(
        xtitle = 'x',
        ytitle = 'y',
        ztitle = 'z',
        bounds = [xmin, xmax, ymin, ymax, zmin, zmax],
        n_xlabels = 5,
        n_ylabels = 5,
        n_zlabels = 5,
        color = color_grid,
        grid = 'back',
        all_edges = True,
        location = 'outer',
        font_family = 'courier',
        font_size = 10,
        padding = 0.1,
        use_3d_text = False,
    )
    # https://docs.pyvista.org/version/stable/api/plotting/_autosummary/pyvista.CubeAxesActor.html
    cube_axes_actor.x_label_format = '%.3f'
    cube_axes_actor.y_label_format = '%.3f'
    cube_axes_actor.z_label_format = '%.3f'
    actor, prop = pl.add_actor(cube_axes_actor)
    #-------------------------------------------------------------------------
    #View Point
    # https://docs.pyvista.org/version/stable/api/plotting/_autosummary/pyvista.Plotter.camera_position.html
    pl.camera.up = (0.0, 1.0, 0.0)
    pl.camera_position = 'xy'
    pl.camera.zoom(0.8)
    # pl.camera.azimuth = -45.0
    # pl.camera.elevation = 30.0
    #-------------------------------------------------------------------------
    #Environment
    # https://docs.pyvista.org/version/stable/api/examples/_autosummary/pyvista.examples.downloads.html#
    # pl.set_environment_texture(pv.examples.download_dikhololo_night())
    pv.global_theme.lighting_params.specular = 1.0
    pv.global_theme.lighting_params.specular_power = 128
    prop = pv.Property()
    prop.specular = 0.2
    prop.specular_power = 128
    # https://docs.pyvista.org/version/stable/api/core/_autosummary/pyvista.Light.html
    light = pv.Light(
        color = 'white',
        light_type = 'headlight',
        intensity = 1.0,
        positional = False,
    )
    pl.add_light(light)
    #-------------------------------------------------------------------------
    ## Export in html
    
    pl.set_background('#000C40')
    
    path_html = basename_3d + ".html"
    other = pl.export_html(path_html)
    #-------------------------------------------------------------------------
    # https://docs.pyvista.org/version/stable/api/plotting/_autosummary/pyvista.Plotter.show.html#pyvista.Plotter.show
    # pl.show(
        # title = basename_me,
        # window_size = None,
        # interactive = True,
        # interactive_update = False,
        # full_screen = False,
        # screenshot = False,
        # return_cpos = False,
        # return_img = False,
        # return_viewer = False,
        # auto_close = True,
    # )
#=========================================================================
def launch_pyvista():
    #Launch PyVista
    theme_custom = pv.themes.DocumentTheme()
    theme_custom.font.family = 'courier'
    theme_custom.font.size = 20
    theme_custom.font.color = color_grid
    print('\n### PyVista ################################')
    print('  Version: {}'.format(pv.__version__))
    print(theme_custom)
    print('############################################')
    pl = pv.Plotter(theme = theme_custom, lighting = 'three lights')
    #-------------------------------------------------------------------------
    #BackGround
    #https://uigradients.com/#WhatliesBeyond
    pl.set_background('#F0F2F0', top='#000C40')
    #-------------------------------------------------------------------------
    #https://docs.pyvista.org/version/stable/api/plotting/_autosummary/pyvista.create_axes_marker.html#pyvista.create_axes_marker
    pl.add_axes(
        xlabel = 'x',
        ylabel = 'y',
        zlabel = 'z',
        x_color = color_x,
        y_color = color_y,
        z_color = color_z,
        line_width = 5,
        cone_radius = 0.6,
        shaft_length = 0.7,
        tip_length = 0.3,
        ambient = 0.5,
        label_size = (0.3, 0.12),
        interactive = True,
    )
    #-------------------------------------------------------------------------
    # https://docs.pyvista.org/version/stable/api/plotting/_autosummary/pyvista.Plotter.add_text.html
    pl.add_text(
        '\n' + \
        '   LeftDrag                      : Rotate\n' + \
        '   Shift+LeftDrag or MiddleDrag  : Pan\n' + \
        '   Ctrl+LeftDrag                 : Rotate in 2D (View-plane)\n' + \
        '   Wheel or RightDrag            : Zoom\n' + \
        '\n' + \
        '    v : Isometric View\n' + \
        '    r : Bring to Center\n' + \
        '    f : Focus/Zoom in on a point\n' + \
        '    w : Wireframe mode\n' + \
        '    s : FillSurface mode\n' + \
        '\n' + \
        '    q : Close the Window',
        position = 'upper_left',
        font = 'courier',
        font_size = 8,
        color='#F0F2F0',
        shadow = False,
    )
    #-------------------------------------------------------------------------
    return pl
#=========================================================================
if __name__ == "__main__":
    main()