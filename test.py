import random
colours = [5,6]
color_id = [5]
new_color = random.choice(list(set(colours) - set(color_id)))
print(new_color)