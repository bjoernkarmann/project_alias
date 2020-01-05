"""
Project Alias - Rename your assistant and makes sure it never listens.
Copyright (C) 2020  Bjørn Karmann & Tore Knudsen

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
"""

from modules import apa102
global LED

class Pixels:
    PIXELS_N = 3

    def __init__(self):
        self.dev = apa102.APA102(num_led=self.PIXELS_N)

    def on(self, dim):
        for i in range(self.PIXELS_N):
            self.dev.set_pixel(i, 255, 180, 0,dim)
        self.dev.show()

    def listen(self):
        for i in range(self.PIXELS_N):
            self.dev.set_pixel(i, 200, 200, 0,50)
        self.dev.show()

    def off(self):
        for i in range(self.PIXELS_N):
            self.dev.set_pixel(i, 0, 0, 0)
        self.dev.show()

LED = Pixels()
