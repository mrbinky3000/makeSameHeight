/*
 * makeSameHeight
 *
 * Attach this UI widget to a parent node and provide a jQuery selector to
 * specify all the child nodes that you want to make the same height.
 * This widget scans the child nodes and makes them all the same height
 * as the tallest child. When destroyed, this widget returns elements to
 * their original heights.
 *
 * Version:
 * o 0.0.2 - Added "heightClosestMultiple"
 * o 0.0.1 - Created
 *
 * Example:
 * $('ul').makeSameHeight({selector:'li'})
 * The parent is UL and the LI's will be adjusted to be the same height.
 *
 * You can also specify the minimum and/or maximum allowable height in pixels.
 * Example:
 * $('ul').makeSameHeight({
 *     selector:'li',
 *     minHeight: 100,
 *     maxHeight: 400
 * });
 *
 * lastly, you can just set the height manually, which makes it generally
 * pointless to use this widget.  You could just use jQuery.  The only
 * benefit is that this widget cleans up after it is destroyed, which
 * would restore the original heights to the child nodes.
 *
 * Example:
 * $('ul').makeSameHeight({
 *      selector:'li',
 *      height:100
 * });
 * # or you could skip the widget and do $('ul > li').height(100);
 *
 * Users can tap into the event 'makesameheight.error' if they
 * want to detect failure.  This event is attached to the parent node.
 *
 * Example:
 * $('ul').bind('makesameheight.error',function(ev){
 *     alert(ev.description);
 * });
 *
 * Users can also tap into the event 'onHeightEqualized' if the want to
 * detect when this widget has finished making everything the same height.
 * It returns the new height.
 *
 * $('ul').bind('makesameheight.onComplete',function(ev){
 *     alert(ev.height);
 * });
 *
 * @author Matthew Toledo
 * @requires jquery.ui.core.js jquery.ui.widget.js
 */

;(function ( $, window, document, undefined ) {


    $.widget( "ri.makeSameHeight" , {

        //Options to be used as defaults
        options: {
            "selector": undefined,
            "minHeight": undefined,
            "maxHeight" : undefined,
            "height" : undefined,
            "multipleOf" : undefined
        },

        // called ONLY the FIRST time the plugin is called.  set up theme, bind events, etc.
        _create: function () {
            var that = this;
            $(this.element).find(this.options.selector).find('img').on('load',function(){
                that._makeSameHeight();
            });
        },

        // called EVERY TIME the plugin is called
        _init: function() {

            if (typeof this.options.height === 'undefined' && typeof this.options.selector !== 'undefined') {
                this._makeSameHeight();

            } else {
                $(this.element).trigger('makesameheight.error',{
                    description:'The selector was undefined'
                });
            }

        },

        // the main meat of the plugin
        _makeSameHeight: function() {
            var newHeight = 0;
            var selector = this.options.selector;
            var heightMultiple = this.options.multipleOf;

            if (typeof this.options.height === 'undefined') {
                // scan all children and make them the same height
                $(this.element)
                    .find(selector)
                    .each(function(){
                        // Store any previously declared height information for this node. Used by destroy method later.
                        $(this).data('original-height',$(this).css('height'));
                    })
                    .css('height','')
                    .each(function(i,el){
                        var $el = $(el);
                        //console.log('element',$el,'height',$el.outerHeight());
                        if ($el.outerHeight() > newHeight) {
                            newHeight = $el.outerHeight();
                            // console.info('new highwater mark:',newHeight);
                        }
                        if (typeof heightMultiple !== 'undefined') {
                            newHeight = heightMultiple * Math.round(newHeight / heightMultiple);
                            if (newHeight == 0 )  {
                                newHeight = heightMultiple;
                            }
                        }
                    });
                // optional minimum height limit
                if (typeof this.options.minHeight !== 'undefined' && this.options.minHeight > newHeight) {
                    newHeight = this.options.minHeight;
                }
                // optional maximum height limit
                if (typeof this.options.maxHeight !== 'undefined' &&  newHeight > this.options.maxHeight) {
                    newHeight = this.options.maxHeight;
                }
            } else {
                // we opted not to scan the children, just set the height manually (kinda pointless)
                newHeight = this.options.height;
            }
            // apply the new height
            $(this.element).find(selector).height(newHeight);
            // Send off an event notifying parent that we're all done. Also contains new height value.
            // $(this.element).trigger('makesameheight.onComplete',{"height":newHeight});
            this._trigger('complete',0,newHeight);
        },

        // Destroy an instantiated plugin and clean up
        // modifications the widget has made to the DOM
        destroy: function () {

            // remove any heights that this plugin may have attached to target children
            $(this.options.selector)
                .each(function(){
                    var $this = $(this);
                    var originalHeight = $this.data('original-height')
                    if (originalHeight) {
                        $this.css('height',originalHeight);
                    } else {
                        $this.css('height','');
                    }
                });

            $.Widget.prototype.destroy.call(this);
        }



    });

})( jQuery, window, document );