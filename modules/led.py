from modules import apa102

class Pixels:
    PIXELS_N = 3

    def __init__(self):
        self.dev = apa102.APA102(num_led=self.PIXELS_N)

    def on(self):
        for i in range(self.PIXELS_N):
            self.dev.set_pixel(i, 0, 0, 200,50)
        self.dev.show()

    def listen(self):
        for i in range(self.PIXELS_N):
            self.dev.set_pixel(i, 200, 200, 0,50)
        self.dev.show()

    def off(self):
        for i in range(self.PIXELS_N):
            self.dev.set_pixel(i, 0, 0, 0)
        self.dev.show()
