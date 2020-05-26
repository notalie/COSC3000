from OpenGL.GL import *
import glfw
import numpy as np
import math
from PIL import Image
import imgui

import lab_utils as lu
from lab_utils import vec3, vec2
from ObjModel import ObjModel

class Prop:
    position = vec3(0,0,0)
    heading = vec3(1,0,0)
    model = None

    def render(self, view, renderingSystem):
        top = [0,0,1]
        modelInWorld = lu.make_mat4_from_zAxis(self.position, self.heading, top)
        renderingSystem.drawObjModel(self.model, modelInWorld, view)

    def load(self, objModelName, position):
    # TODO 2.3: Load the prop
        self.position = position

        self.model = ObjModel(objModelName)
        