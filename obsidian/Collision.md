Expansion: change from startX or startY to endX or endY.
For example startX = 50, endX = 0, delta = -50
divided by how many entries I want (maybe minus 2, one for startX one for endX)
so, for example,
one entity at some pos moving at speed 1000 towards right
another moving at speed 50 to left.

so, I put 50,50 and 0,0 as start and end position
and fill the remaining 998 elements by the result of -50/1000 (something like -0.0005 I suppose, probably missed or added one incorrect zero) So I just say currentX (50) +(-0.0005*currentLoopIndex)

So yeah this seems to be a pretty interesting and working idea.
After that I just compare the arrays, and I have my answer of yes or no, yay, I mean about if the entities collide. The answer will always be accurate enough for my purposes, at least, I think, according to the logic outlined.