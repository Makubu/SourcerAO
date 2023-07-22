
from manim import *


class Collaboration(Scene):
    def construct(self):
        self.idea()
        self.graph()

    def get_text(self, text, font_size=90):
        return Text(text, font="Consolas", font_size=font_size)

    def idea(self):
        person = SVGMobject("img/business.svg").scale(1)
        text = self.get_text("Someones has an idea of an Open-Source feature", font_size=30)
        text[-18:-7].set_color_by_gradient(BLUE, GREEN)
        text.next_to(person, DOWN*2)
        self.play(Write(text, run_time=2))
        round = Circle(radius=1.3, color=RED)
        round_fill = Circle(radius=1.3, color=RED, fill_opacity=1)
        # round.align_to(person)
        person.move_to(round)
        self.play(*[FadeIn(obj) for obj in [person, round]])
        self.play(Flash(person, flash_radius=1.4, num_lines=20))
        self.play(*[FadeOut(person), FadeTransform(round, round_fill)])

        new_text = self.get_text("He might not be the only one to want that feature", font_size=30)
        new_text[-7:].set_color_by_gradient(BLUE, GREEN)
        new_text.next_to(text, DOWN*2)
        self.play(Transform(text, new_text, run_time=2))
        self.play(round_fill.animate.scale(0.1).move_to(UP*0.95 + RIGHT*1.3))
        self.wait()
        self.play(Unwrite(text, run_time=0.5))
        self.round = round_fill


    def graph(self):
        # the graph class expects a list of vertices and edges
        vertices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        edges = [(1, 2), (2, 3), (3, 4), (2, 4), (2, 5), (6, 5),
                 (1, 7), (5, 7), (2, 8), (1, 9), (10, 8), (5, 11),
                 ]
        vertex_config = {i: {"fill_color": RED} for i in vertices}
        g = Graph(vertices, edges, layout_config={"seed": 77},
                  vertex_config=vertex_config,
                  edge_config={"stroke_width": 3, "color": RED},
                  ).scale(2)
        text = self.get_text("People might want to invest to get that feature", font_size=30)
        text[-7:].set_color_by_gradient(BLUE, GREEN)
        text.next_to(g, DOWN*2)
        self.play(*[Write(g, run_time=2), FadeOut(self.round), ])
        self.play(Write(text, run_time=2))
        for v in vertices[:6]:
            self.play(Flash(g.vertices[v], color=YELLOW, flash_radius=0.3, run_time=0.4))
        self.play(g.animate.shift(LEFT * 3), Unwrite(text))
        text = self.get_text("Creating a community of Contributors", font_size=30)
        text.to_edge(DOWN)
        text[-12:].set_color_by_gradient(BLUE, GREEN)
        vertices = [i for i in range(1, 12)]
        edges = [(1, i) for i in range(2, 12)]
        # Create the graph using the Graph class
        vertex_config[1] = {"fill_color": BLUE}
        graph = Graph(vertices, edges, vertex_config=vertex_config, layout="circular",
                      edge_config={"stroke_width": 3, "color": WHITE},).scale(1.3).move_to(LEFT*3)
        # Show the graph
        sub_text = self.get_text("Creating a bounty", font_size=30)
        sub_text[-6:].set_color_by_gradient(BLUE, GREEN)
        sub_text.to_edge(DOWN)
        self.play(*[Write(graph, run_time=2), FadeOut(g), Write(sub_text, run_time=1)])

        position = UP*2.2 + RIGHT * 3
        relative = position + DOWN*0.3
        contour = Rectangle(width=5, height=1.8, color=WHITE, fill_opacity=0).move_to(position)
        square = Rectangle(width=2, height=2, color=RED, fill_opacity=1).scale(0.1).move_to(relative)
        text = self.get_text("Bounty:", font_size=30).move_to(position + UP*0.3)
        text.set_color_by_gradient(BLUE, GREEN)
        self.play(FadeIn(square), FadeIn(contour), Write(text, run_time=1))
        width = 2
        for v in vertices[1:]:
            width += 2
            new_square = Rectangle(width=width, height=2, color=RED, fill_opacity=1).scale(0.1).move_to(
                relative)
            self.play(*[
                Flash(graph.vertices[v], color=YELLOW, flash_radius=0.5, run_time=0.2),
                FadeToColor(graph.vertices[v], RED, run_time=0.2),
                FadeToColor(graph.edges[(1, v)], RED, run_time=0.2),
                Transform(square, new_square, run_time=0.2),
            ]
            )

        all_bounty = VGroup(text, square, contour)
        business = VGroup(*[SVGMobject("img/business.svg").scale(0.3) for _ in range(20)]).arrange_in_grid(buff= 0.1, rows=4).move_to(LEFT*5)
        self.play(*[FadeOut(sub_text), FadeTransform(graph, business), all_bounty.animate.move_to(ORIGIN).scale(0.8)], FadeOut(new_square, run_time=0.01))
        self.wait()



if __name__ == "__main__":
    Collaboration()
