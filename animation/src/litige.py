
from manim import *


class Litigation(MovingCameraScene):
    def init_last_scene(self, to_add=True):
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
        contract = SVGMobject("img/contract.svg").scale(0.8)
        round = Circle(radius=1.3, color=GREEN).to_edge(RIGHT)
        developer = SVGMobject("img/programer.svg").scale(0.9).move_to(round)
        developer = VGroup(developer, round)
        source_code = SVGMobject("img/source_code.svg").scale(0.3).next_to(contract, UP)
        if to_add:
            self.add(source_code)
            self.add(developer, contract)
            self.add(header)
            self.developer = developer
            self.header = header
            self.contract = contract
            self.source_code = source_code
            self.business = business
        return developer, contract, source_code, header, business


    def construct(self):
        self.litigation()
        self.refuse_project()
        self.abritration()
        self.bounty_distribution()
        self.reward()


    def litigation(self):
        developer, contract, source_code, header, business = self.init_last_scene(True)
        self.play(*[FadeOut(i) for i in [developer, contract, source_code, header, business]])
        text = self.get_text("Case 2: Litigation", font_size=77)
        text.set_color_by_gradient(BLUE, RED)
        self.play(Write(text))
        footer = self.get_text("Case 2: Litigation", font_size=20).to_corner(DL)
        self.play(*[FadeIn(i) for i in [footer, developer, contract, source_code, header, business]], FadeOut(text))

    def refuse_project(self):
        business = self.business
        accept_text, refuse_text = self.get_text("Accept", font_size=20).next_to(business, RIGHT+UP),\
                                   self.get_text("Refuse", font_size=20).next_to(business, RIGHT+DOWN)
        accept_text.color, refuse_text.color = GREEN, RED
        accept_counters = [Rectangle(width=0, height=0.2, color=GREEN, fill_opacity=1).next_to(accept_text, RIGHT)]
        refuse_counters = [Rectangle(width=0, height=0.2, color=RED, fill_opacity=1).next_to(refuse_text, RIGHT)]
        self.play(Write(accept_text), Write(refuse_text))
        index_agree = [0,2,7]
        index_disagree = [3,18,5, 4, 7, 8, 10, 13, 19, 1 ]
        width_agree, width_disagree = 0, 0
        for i, funder in enumerate(business):
            color = GREEN if i in index_agree else RED if i in index_disagree else None
            if color:
                width_agree+=0.1*(color==GREEN)
                width_disagree+=0.1*(color==RED)
                to_play = [Flash(funder, color=color, run_time=0.3, line_length=0.2, num_lines=20) ]
                rec_to_up = accept_counters if color==GREEN else refuse_counters
                counter_text = accept_text if color==GREEN else refuse_text
                width_select = width_agree if color==GREEN else width_disagree
                rec_to_up.append(Rectangle(width=width_select, height=0.3, color=color, fill_opacity=1).next_to(counter_text, RIGHT))
                to_play.append(FadeTransform(rec_to_up[-2], rec_to_up[-1], run_time=0.3))
                self.play(*to_play)
        agrees = VGroup(*accept_counters, accept_text)
        disagrees = VGroup(*refuse_counters, refuse_text)
        self.play(*[
            FadeOut(agrees),
            disagrees.animate.next_to(self.business, RIGHT),
            FadeOut(self.source_code, self.contract)
        ])
        self.play(FadeOut(disagrees))

    def abritration(self):
        text = self.get_text("Arbritrator selection", font_size=30)
        text[:11].set_color_by_gradient(BLUE, GREEN)
        self.play(Write(text))
        advisors = self._get_advisors().to_edge(DOWN)
        self.play(*[FadeIn(advisors), FadeOut(text)])
        colors = [GREEN]
        decisions = []
        text = self.get_text("Arbitrator decision", font_size=30)
        self.play(Write(text))
        for advisor, color in zip(advisors, colors):
            decision = self._decision_advisor(advisor, color)
            decisions.append(decision)
        decisions = VGroup(*decisions)
        final_decision = SVGMobject("img/yes.svg").scale(0.2).next_to(advisors, UP)
        new_text = self.get_text("Project accepted", font_size=30)
        new_text.set_color_by_gradient(BLUE, GREEN)
        self.play(*[Transform(decisions, final_decision), Transform(text, new_text)])
        self.play(*[
            FadeOut(final_decision),
            FadeOut(decisions)
        ])
        self.play(FadeOut(text))
        self.advisors = advisors

    def bounty_distribution(self):
        bail_text, bail_amout, bail_dev = self.header[3], self.header[4], self.header[-1]
        bail = VGroup(bail_text, bail_amout, bail_dev)
        text = self.get_text("Bail redistribution", font_size=30).move_to(UP)
        self.play(*[bail.animate.center(), Write(text)])
        self.play(
            *[
                bail[1].animate.next_to(self.advisors, UP),
                bail[2].animate.next_to(self.developer, LEFT),
                FadeOut(bail[0])
            ]
        )
        new_text = self.get_text("Arbitrator reward", font_size=30).move_to(UP)
        self.play(*[
            Transform(text, new_text)
        ])
        self.play(*[
            FadeOut(bail[2], text)
        ])
        self.play(FadeOut(self.advisors, bail[1]))
        bounty_text, bounty_amount = self.header[1], self.header[2]
        bounty = VGroup(bounty_text, bounty_amount)
        new_text0 = self.get_text("Bounty distribution", font_size=30).move_to(UP)
        self.play(*[bounty.animate.center(), Write(new_text0)])
        self.play(
            *[
                bounty[1].animate.next_to(self.developer, LEFT),
                FadeOut(bounty[0], new_text0)
            ]
        )
        self.play(FadeOut(bounty[1]))


    def reward(self):
        reward = SVGMobject("img/reward.svg").scale(0.3).next_to(self.developer, LEFT+DOWN*0.5)
        square = Rectangle(width=0.5, height = 2, color=WHITE, fill_opacity=0).next_to(reward, UP)
        self.play(*[
            FadeIn(reward),
            FadeIn(square)
        ])
        height = 0
        rew = [Rectangle(width=0.5, height=0, color=GREEN, fill_opacity=1).align_to(square)]
        text = self.get_text("Reward reputation", font_size=30).to_edge(DOWN)
        text[:6].set_color_by_gradient(BLUE, GREEN)
        self.play(Write(text))
        for i in range(10):
            height+=0.1
            rew.append(Rectangle(width=0.5, height=height, color=GREEN, fill_opacity=1).next_to(reward, UP))
            self.play(
                FadeTransform(rew[-2], rew[-1], run_time=0.1)
            )
        self.play(*[
            Unwrite(text, run_time=1),
            FadeOut(square, reward, rew[-1]),
        ])

    def _decision_advisor(self, advisor, color):
        name = "img/yes.svg" if color == GREEN else "img/red_cross.svg"
        decision = SVGMobject(name).scale(0.2).next_to(advisor, UP)
        self.play(*[
            Flash(advisor, color=color, run_time=0.3, line_length=0.2, num_lines=20),
            FadeIn(decision)
        ])
        return decision


    def _get_advisors(self):
        advisor = SVGMobject("img/expert.svg").scale(0.5)
        reward = SVGMobject("img/reward.svg").scale(0.2).next_to(advisor, LEFT)
        advisor_final = VGroup(advisor, reward)
        return advisor_final

    def share_bounty(self):
        self.wait()

    def get_text(self, text, font_size=90):
        return Text(text, font="Consolas", font_size=font_size)
