makeSameHeight
==============

A simple jQuery UI widget to make all elements that match a selector the same height.


Attach this UI widget to a parent node and provide a jQuery selector to
specify all the child nodes that you want to make the same height.
This widget scans the child nodes and makes them all the same height
as the tallest child. When destroyed, this widget returns elements to
their original heights.


Version:
--------
- 0.0.2 - Added "heightClosestMultiple"
- 0.0.1 - Created

Usage Example 1:
----------------
Make all li elements in an unordered list the same height
$('ul').makeSameHeight({selector:'li'})



Usage Example 2:
You can also specify the minimum and/or maximum allowable height in pixels.
$('ul').makeSameHeight({
 selector:'li',
  minHeight: 100,
  maxHeight: 400
});

Usage Example 3:
----------------
Lastly, you can just set the height manually, which makes it generally
pointless to use this widget.  You could just use jQuery.  The only
benefit is that this widget cleans up after it is destroyed, which
would restore the original heights to the child nodes.

$('ul').makeSameHeight({
  selector:'li',
  height:100
});
# or you could skip the widget and do $('ul > li').height(100);
 

Event Example 1:
----------------
You can tap into the event 'makesameheight.error' if you
want to detect failure.  This event is attached to the parent node.

$('ul').bind('makesameheight.error',function(ev){
  alert(ev.description);
});

Event Example 2:
----------------
Users can also tap into the event 'onHeightEqualized' if the want to
detect when this widget has finished making everything the same height.
It returns the new height.

$('ul').bind('makesameheight.onComplete',function(ev){
  alert(ev.height);
});