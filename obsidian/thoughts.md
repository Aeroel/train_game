Split updateState in game loop on server
Into two stages, one called updateState
Another updatePositions.
So, current base entity udpate state will become instead updatePositions.
The reasoning is this: if a car wall gets moved through updateState and its car is next in the entity iteration loop, this will cause desync between car position and wall position and there isn't much that I can see could be done. However, if I first only update forces in updateState, then the wall will eventually get its correct force distribution from the car and after all processing is done we could call updatePositions to iterate over all entites again and actually update their positions
Are there gotchas  with this idea? 
Overall it seems a decent alternative to my current one
Now what I think about it, does it even make  any practical difference? Even if I keep all stuff in each updateState
The positions, visually, will remain rigidly correct, right? Practically speaking, there might be no point in the split, not sure

So two main things I guess I have to do:
1. The split forces (the usage of "split" is found here, but not related the concept is to the above idea. Split forces are about... Well, instead of having fixed numerical values for each of the four (up, down, left, right) forces,
I instead use an array of objects. So... these objects still have the values and are combined to be used as now, but I can tag the objects, for example a wall of a car would have tag "fromThisCar", value 35. Car can always find the exact object using tag, keep the force value what it needs to be and, the essential point, remove it at any time.
For example, car switches rail, goes down instead of left, remove the left tagged force, push the down tagged force. So, this will be a good idea and solve the current thingie ... I guess )
2. The percentage of distance covered from fixed rail end 1 and rail end 2 calculation to be used for rail switching once the distance is at say 95 percent. Something about reversing when reversing mov dir on same rail moving while I mean...



Train located on right side of a rail. Back is facing right rail end. Moving forward.
So, expected percentage: 5 percent
Calculating percentages: 
1. dist 100,

...So, if I am moving in direction x along the rail, then the starting point is the rail end closest to the opposite of x side of the car.
so I do
if(moving forward){
    startRailEnd = closest to backside

} else if moving backwards {
    startRailEnd = closest to front side
}
and the opposite way for endRailEnd


0 - 95 = -95
0 - 100 = -100
(-95/-100)*100 = 95%

100 - 95 = 5
100 - 0 = 100
(5/100)*100=5%

Okay, this seems to work well...