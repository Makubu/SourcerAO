import math
import os

import numpy as np
from manim import *


class OpeningManim(Scene):


    def brouillon(self):
        text = Text("Here is a text", font="Consolas", font_size=90)
        difference = Text(
            """
            The most important difference between Text and TexText is that\n
            you can change the font more easily, but can't use the LaTeX grammar
            """,
            font="Arial", font_size=24,
            # t2c is a dict that you can choose color for different text t2c={"Text": BLUE}
        )
        # with register_font("font/Consolas.ttf"):
        text = Text("HELLO THIS IS A TEST", font="Consolas")
        text[7:12].set_color_by_gradient(BLUE, GREEN)
        VGroup(text, difference).arrange(DOWN, buff=1)
        self.play(Write(text, run_time=1))
        self.play(FadeIn(difference, text))

    def get_text(self, text, font_size=90):
        return Text(text, font="Consolas", font_size=font_size)

    def creation_vs_code(self):
        vs_code = ImageMobject("img/vs_code.png").scale(2.5)
        self.play(FadeIn(vs_code))
        texts = []
        texts.append(self.get_text("Visual Studio Code is an open-source code", font_size=30))
        texts[-1][:16].set_color_by_gradient(BLUE, GREEN)
        texts[-1].next_to(vs_code, DOWN)
        self.play(Write(texts[-1]), run_time=1)
        texts.append(self.get_text("Visual Studio Code is used by 14M+ developers", font_size=30))
        texts[-1][:16].set_color_by_gradient(BLUE, GREEN)
        texts[-1].next_to(vs_code, DOWN)
        self.play(Transform(texts[-2], texts[-1], run_time=1))
        self.wait(1)
        texts.append(self.get_text("How many are contributors ?", font_size=30))
        texts[-1].set_color_by_gradient(BLUE, RED)
        texts[-1].next_to(vs_code, DOWN)
        self.play(*[Transform(texts[-2], texts[-1], run_time=2), FadeOut(texts[0])])
        self.wait(2)
        UPPER_LEFT_CORNER = np.array([-6, 3.5, 0])
        self.play(*[vs_code.animate.scale(0.25).move_to(UPPER_LEFT_CORNER),
                    FadeOut(texts[-2])
                    ])
        self.vs_code = vs_code

    def square_group(self, rows, cols = 10, scale = 0.2, color = WHITE):
        square_count = rows * cols
        squares = [
            Square(fill_color=color, fill_opacity=1).scale(scale)
            for _ in range(square_count)
        ]
        return squares

    def fill_rect(self):
        rows = 10
        squares = self.square_group(rows)
        group = VGroup(*squares).arrange_in_grid(rows=rows)
        self.play(*[FadeIn(group)])
        all_colors = [RED]
        all_colors = all_colors + [BLUE] * (len(group) - 1)
        text = self.get_text("1 contributor out of ", font_size=30)
        text.set_color_by_gradient(RED, BLUE)
        text.next_to(group, DOWN)
        self.play(
            *[
        AnimationGroup(
            *[s.animate.set_color(all_colors[i]) for i, s in enumerate(squares)],
            lag_ratio=0.01,
        ),
            Write(text)]
        )
        target_position = UP + LEFT
        # Define the scale factor for the zooming out effect
        scale_factor = 0.1
        # Create the animation to zoom out and move the object to the target position
        self.play(
            group.animate.scale(scale_factor).move_to(target_position),
            run_time=0.5
        )
        # new_groups = VGroup(*[group.copy() for _ in range(100)])
        self.play(*[g.animate.shift(LEFT*5+UP*1.5) for g in group], run_time=1)
        new_squares = self.square_group(10, cols=10, scale=0.25, color=BLUE)
        new_groups = VGroup(*new_squares).arrange_in_grid(rows=5, cols=20, buff=(0.1, 0.3))
        for new_group in new_groups:
            new_group.set_color(BLUE)
        new_groups.next_to(group, DOWN + RIGHT * 0.1)
        self.play(FadeIn(new_groups))
        new_text = self.get_text("1 contributor out of 10 000 users", font_size=30)
        new_text.set_color_by_gradient(RED, BLUE)
        new_text.align_to(text, DOWN)
        self.play(ReplacementTransform(text, new_text))
        all_groups = VGroup(group, *new_groups)
        self.play(*[FadeOut(all_groups),FadeOut(text), FadeOut(new_text)])


    def play_open_source(self):
        self.play(self.vs_code.animate.move_to(ORIGIN+RIGHT*2.3+DOWN*1.5))
        text = self.get_text("It happens for all open-source projects", font_size=30)
        text[15:].set_color_by_gradient(BLUE, GREEN)
        text.move_to(DOWN*3)
        basename = os.path.join("img", "open_source")
        img_paths = [os.path.join(basename, name) for name in os.listdir(basename)]
        images = [SVGMobject(img_path).scale(0.5) for img_path in img_paths]
        group = VGroup(*images).arrange_in_grid(rows=3, buff=.5)
        self.play(*[Write(text), FadeIn(group)])
        self.play(*[
            group.animate.scale(0.1),
            FadeOut(text), FadeOut(self.vs_code)
        ], )
        self.play(FadeOut(group))

    def vs_code_scenario(self):
        self.creation_vs_code()
        self.fill_rect()
        self.play_open_source()

    def construct(self):
        self.vs_code_scenario()

if __name__ == "__main__":
    OpeningManim()



