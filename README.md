# Github Website

Currently this is just the host for Silly Clock, a very silly project, although I plan on hosting other project descriptions on this site.

Silly Clock is one of my oldest independent coding projects, centering around an idea from a lunchtime conversation with my friend Stephanie: 
What if the actual hours in a day got longer an shorter as the 'daytime' changed durations?

6:00 AM is sunrise, and 6:00 PM is sunset. All other times fill into the gaps proportionally, resulting in different hour durations during day and night.
Initially, this was made using a table of times in Boston, but I had dreams of the clock working anywhere* anytime*

**with exceptions to places where sunrise and sunset can become irregular, such as Antarctica*

I saw the vision of the math to make this possible over winter break of '23-'24.

Imagine 2 vectors. One points from the center of the earth to a static location, assuming a radius of 1. Longitude and Latitude mark the angles this vector takes.
The second vector points from the center of the earth to the point on the surface the sun is directly over.
The sun rises and sets when the dot product of these vectors is 0, i.e. the vectors are perpendicular**.
The location vector is unchanging. The sun is given a latitude based on the distance to the solstices, and the longitude based on the time of day***.
The solution to this equation can't be perfectly calculated, but with some assumed slopes from sine functions, a solution can be narrowed in on.

***Technically, the angle should be slightly more than perpendicular, to account for the size of the sun.*
*I have decided that I prefer the times without accounting for this, but I have code to deal with it if my mind is changed.*

****There's a small correction equation here, as the sun is on average over the prime meridian at noon UTC+0, but this has some variance.*

I would like to add a way for manual location selection, since some browsers are iffy on location requests.
