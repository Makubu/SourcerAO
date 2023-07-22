
from manim import *


class NoLitigation(MovingCameraScene):
    def init_last_scene(self):
        business = VGroup(*[SVGMobject("img/business.svg").scale(0.3) for _ in range(20)]).arrange_in_grid(buff= 0.1, rows=4).move_to(LEFT*5)
        self.add(business)
        move = LEFT*3.5 + UP * 0.05
        text = self.get_text("Bounty:", font_size=30).shift(UP*3.3+LEFT*4.5)
        text.set_color_by_gradient(BLUE, GREEN)
        square = Rectangle(width=20, height=2, color=RED, fill_opacity=1).scale(0.1).next_to(text, DOWN)
        contour = Rectangle(width=12, height=1.5, color=WHITE, fill_opacity=0).shift(UP * 3)
        all_bounty = VGroup(text, square, contour).shift(ORIGIN).scale(0.8)
        all_bounty.shift(move)
        all_bounty.move_to(UP*3)
        bail = self.get_text("Bail: ", font_size=24).next_to(all_bounty[0], RIGHT * 5)
        bail.set_color_by_gradient(BLUE, GREEN)
        new_text = self.get_text("Mission: ", font_size=24).next_to(bail, RIGHT * 10)
        icon = SVGMobject("img/vs_code.svg").scale(0.2).next_to(new_text, DOWN+LEFT)
        mission_text = self.get_text("Syntax Coloration", font_size=22).next_to(icon, RIGHT)
        new_text.set_color_by_gradient(BLUE, GREEN)
        bail_amounts = Rectangle(width=20*0.05, height=0.2, color=PURPLE, fill_opacity=1).next_to(bail, DOWN).scale(0.8)
        bail_dev = Rectangle(width=5, height=1.5, color=PURPLE_A, fill_opacity=1).scale(0.1).next_to(bail_amounts, RIGHT)
        header = VGroup(contour, text, square, bail, bail_amounts, new_text, icon, mission_text, bail_dev)
        self.add(header)
        contract = SVGMobject("img/contract.svg").scale(0.8)
        round = Circle(radius=1.3, color=GREEN).to_edge(RIGHT)
        developer = SVGMobject("img/programer.svg").scale(0.9).move_to(round)
        developer = VGroup(developer, round)
        source_code = SVGMobject("img/source_code.svg").scale(0.3).next_to(contract, UP)
        self.add(source_code)
        self.add(developer, contract)
        self.developer = developer
        self.header = header
        self.contract = contract
        self.source_code = source_code


    def construct(self):
        self.init_last_scene()

    def get_text(self, text, font_size=90):
        return Text(text, font="Consolas", font_size=font_size)
