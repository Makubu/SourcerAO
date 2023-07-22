
from manim import *


class Contract(MovingCameraScene):
    def construct(self):
        self.init_last_scene()
        self.choose_contract()
        self.choose_devs()

    def get_text(self, text, font_size=90):

        return Text(text, font="Consolas", font_size=font_size)

    def init_last_scene(self):
        position = UP*2.2 + RIGHT * 3
        relative = position + DOWN*0.3
        square = Rectangle(width=20, height=2, color=RED, fill_opacity=1).scale(0.1).move_to(relative)
        text = self.get_text("Bounty:", font_size=30).move_to(position + UP*0.3)
        text.set_color_by_gradient(BLUE, GREEN)
        contour = Rectangle(width=5, height=1.8, color=WHITE, fill_opacity=0).move_to(position)
        all_bounty = VGroup(text, square, contour).move_to(ORIGIN).scale(0.8)
        business = VGroup(*[SVGMobject("img/business.svg").scale(0.3) for _ in range(20)]).arrange_in_grid(buff= 0.1, rows=4).move_to(LEFT*5)
        self.play(*[FadeIn(all_bounty, business)])
        self.business = business
        self.all_bounty = all_bounty

    def choose_contract(self):
        text = self.get_text('"We want syntax coloring for a new programming language"', font_size=25)
        text[7:15].set_color_by_gradient(BLUE, GREEN)
        text.next_to(self.business, RIGHT)
        self.play(*[Write(text), self.all_bounty.animate.move_to(UP*3)])
        move = LEFT*1.8 + UP * 0.05
        new_text = self.get_text("Mission: ", font_size=24).move_to(self.all_bounty[0].get_center() + move + RIGHT * 3)
        icon = SVGMobject("img/vs_code.svg").scale(0.2).next_to(new_text, DOWN+LEFT)
        mission_text = self.get_text("Securisation", font_size = 22).next_to(icon, RIGHT)
        group_mission = VGroup(new_text, icon, mission_text)
        new_text.set_color_by_gradient(BLUE, GREEN)
        new_rectangle = Rectangle(width = 8, height = 1.5, color=WHITE, fill_opacity=0).move_to(UP * 3).scale(0.8)
        self.play(*[FadeTransform(self.all_bounty[2], new_rectangle), self.all_bounty[0].animate.shift(move), self.all_bounty[1].animate.shift(move),
                    FadeIn(group_mission)])
        self.play(Unwrite(text))
        self.wait()

    def choose_devs(self):
        contract = SVGMobject("img/contract.svg").scale(0.8)
        self.play(FadeIn(contract))
        round = Circle(radius=1.3, color=BLUE).to_edge(RIGHT)
        round_fill = Circle(radius=1.3, color=BLUE, fill_opacity=1).to_edge(RIGHT)
        developer = SVGMobject("img/programer.svg").scale(0.9).move_to(round)
        self.play(FadeIn(round, developer))
        self.play(Flash(developer, flash_radius=1.4, num_lines=20))
        skill = SVGMobject("img/skills.svg").scale(0.4).next_to(round, LEFT)
        ipfs = ImageMobject("img/ipfs.png").scale(0.1).next_to(contract, DOWN)
        text = self.get_text("A developer apply and share its CV with IPFS", font_size=25).to_edge(DOWN)
        text[-4:].set_color_by_gradient(BLUE, GREEN)
        self.play(*[FadeIn(skill, ipfs), Write(text)])
        self.play(skill.animate.next_to(self.business, RIGHT))
        self.play(*[
            FadeOut(skill),
            Transform(round, round_fill),
            FadeOut(developer)
        ])
        all_circles = VGroup(*[Circle(radius=0.15, color=BLUE, fill_opacity=1) for _ in range(100)])
        all_circles.arrange_in_grid(cols=10, rows=10, buff=0.1).to_edge(RIGHT)
        new_text = self.get_text("Other developers apply", font_size=25).to_edge(DOWN)
        self.play(*[Transform(round, all_circles), Transform(text, new_text)])
        for i in [1, 4, 6, 86, 34, 57, 24, 66]:
            self.play(Flash(all_circles[i], flash_radius=0.2, num_lines=20, run_time=0.3))
        circle_selection = Circle(radius = 0.16, color = GREEN, fill_opacity=0).next_to(self.business, RIGHT)
        new_text1 = self.get_text("The community chooses a developer", font_size=25).to_edge(DOWN)
        new_text1[3:12].set_color_by_gradient(BLUE, GREEN)
        self.play(*[FadeIn(circle_selection), Transform(text, new_text1), FadeOut(new_text)] )
        self.play(*[circle_selection.animate.move_to(all_circles[17].get_center()),
                    all_circles[17].animate.set_color(GREEN),
                    ])
        new_round = Circle(radius=1.3, color=GREEN).to_edge(RIGHT)
        new_developer = SVGMobject("img/programer.svg").scale(0.9).move_to(new_round)
        dev_group = VGroup(new_developer, new_round)
        selected_circle = all_circles[17]
        self.play(*[
            *[FadeOut(circle) for circle in all_circles if circle != selected_circle],
            FadeOut(circle_selection),
            FadeOut(round, ipfs),
            Transform(selected_circle, dev_group),
            Unwrite(new_text1), FadeOut(text)
        ])
        bounty = Rectangle(width=5, height=2, color=GREEN, fill_opacity=1).scale(0.1).next_to(dev_group, LEFT).scale(0.8)
        text = self.get_text("The developer stakes a Bail", font_size=30).to_edge(DOWN)
        text[-6:].set_color_by_gradient(BLUE, GREEN)
        self.play(*[FadeIn(bounty), Write(text)])
        self.play(bounty.animate.next_to(self.all_bounty[1], RIGHT))
        old_bounty = VGroup(self.all_bounty[1], bounty)
        new_bounty = Rectangle(width=25, height=2, color=RED, fill_opacity=1).scale(0.1).move_to(self.all_bounty[1]).scale(0.8)
        self.play(*[Transform(old_bounty, new_bounty), Unwrite(text)])
        self.wait()

if __name__ == "__main__":
    Contract()