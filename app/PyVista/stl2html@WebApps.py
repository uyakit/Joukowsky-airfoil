# -*- coding: utf-8 -*-


#######################################################################################
# Installation
#
# https://qiita.com/natsuriver/items/72a5e180c1a65a8c8e92#linux-%E3%81%AE%E5%A0%B4%E5%90%88

# py -m pip install pyvista[all,trame]
# py -m pip uninstall vtk -y
# py -m pip install --extra-index-url https://wheels.vtk.org vtk-osmesa
# py -m pip install vtk
# py -m pip install matplotlib

# py -m pip list

#######################################################################################


import io
import os
import sys

# from tkinter import Tk
# from tkinter import messagebox
# from tkinter import TclError

import pyvista as pv


path_me = os.path.abspath(os.path.realpath(__file__))
pathd_me = os.path.abspath(os.path.dirname(path_me))
basename_me = os.path.splitext(os.path.basename(path_me))[0]
os.chdir(pathd_me)

path_3d = os.path.abspath(sys.argv[1])
pathd_3d = os.path.abspath(os.path.dirname(path_3d))
basename_3d = os.path.splitext(os.path.basename(path_3d))[0]

#Parameters
color_pcl = '#E0C89A'
color_grid = '#34C363'
color_x = '#DF143F'
color_y = '#34C363'
color_z = '#2468D0'

#=========================================================================
def main():
    #-------------------------------------------------------------------------
    #Count Arguments
    # if len(sys.argv) != 2:
        # root = Tk()
        # root.withdraw()
        # try:
            # root.after(5000, root.destroy)  # in milliseconds 
            # messagebox.Message(title='Error', message='Specify just one stl file (.stl) as argument !', icon='error', master=root).show()
        # except TclError:
            # pass
        # sys.exit()
    
    path_3d = os.path.abspath(sys.argv[1])
    pathd_3d = os.path.abspath(os.path.dirname(path_3d))
    basename_3d = os.path.splitext(os.path.basename(path_3d))[0]
    
    # Filter by Extention
    # if os.path.splitext(path_3d)[1] != '.stl':
        # root = Tk()
        # root.withdraw()
        # try:
            # root.after(5000, root.destroy)  # in milliseconds 
            # messagebox.Message(title='Error', message='Specify just one stl file (.stl) as argument !', icon='error', master=root).show()
        # except TclError:
            # pass
        # sys.exit()
    #-------------------------------------------------------------------------
    #Launch PyVista
    pl = launch_pyvista()
    #-------------------------------------------------------------------------
    #Load mesh
    
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
    # print('\n### PyVista ################################')
    # print('  Version: {}'.format(pv.__version__))
    # print(theme_custom)
    # print('############################################')
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