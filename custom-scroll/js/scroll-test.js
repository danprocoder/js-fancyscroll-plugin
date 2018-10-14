/**
 * scroll.js
 *
 * @author Daniel Austin
 */
function ScrollWindow(e) {
    this.e = e;

    this.listeners = [];

    this.container = document.createElement('div');
    this.container.className = 'inner';
    
    this.content = document.createElement('div');
    this.content.className = 'scroll-content';
    this.content.innerHTML = this.e.innerHTML;
    this.container.appendChild(this.content);

    this.e.innerHTML = '';
    this.e.appendChild(this.container);

    this.addScrollBar = function(scrollbar) {
        this.container.appendChild(scrollbar.scrollbarContainer);
    };

    this.setContent = function(content) {
        this.content.innerHTML = '';
        this.addContent(content);
    };

    this.addContent = function(content) {
        if (typeof content == 'object')
            this.content.appendChild(content);
        else
            this.content.innerHTML += content;

        if (this._hasScrollBar('vertical'))
            this.vScrollbar.resize();
        if (this._hasScrollBar('horizontal'))
            this.hScrollbar.resize();
    };
    
    // Scroll to positions.
    this.scrollToTop = function() {
        this.scrollToPosition('vertical', 0);
    };

    this.scrollToBottom = function() {
        var y = Math.abs(this.content.clientHeight - this.container.clientHeight);
        this.scrollToPosition('vertical', -y);
    };
    
    this.scrollToLeft = function() {
        this.scrollToPosition('horizontal', 0);
    };
    
    this.scrollToRight = function() {
        var x = Math.abs(this.content.clientWidth - this.container.clientWidth);
        this.scrollToPosition('horizontal', -x);
    };
    
    this.scrollToPosition = function(orientation, pos) {
        if (orientation == 'vertical' && this._hasScrollBar('vertical')) {
            this.content.style.top = pos + 'px';
            this.vScrollbar._onContentMove(pos);
        } else if (orientation == 'horizontal' && this._hasScrollBar('horizontal')) {
            this.content.style.left = pos + 'px';
            this.hScrollbar._onContentMove(pos);
        }
    };
    
    this._hasScrollBar = function(orientation) {
        if (orientation == 'vertical')
            return typeof this.vScrollbar == 'object' && this.vScrollbar instanceof ScrollBar;
        else if (orientation == 'horizontal')
            return typeof this.hScrollbar == 'object' && this.hScrollbar instanceof ScrollBar;
    };

    this._getListenerIndex = function(fn) {
        var i;
        for (i = 0; i < this.listeners.length; i++)
            if (this.listeners[i] == fn)
                return i;
        return -1;
    };
    
    this.addScrollListener = function(fn) {
        if (typeof fn != 'function')
            return;
        
        if (this._getListenerIndex(fn) == -1)
            this.listeners.push(fn);
    };

    this.removeScrollListener = function(fn) {
        var i = this._getListenerIndex(fn);
        if (i > -1)
            this.listeners.splice(i, 1);
    };
    
    this._callListeners = function(scrollProperty) {
        var i;
        for (i = 0; i < this.listeners.length; i++)
            this.listeners[i](scrollProperty);
    };
    
    // Create scrollbars.
    if (e.className.match(/(^|\s)scroll-vertical(\s|$)/g))
        this.vScrollbar = new ScrollBar(this, 'vertical');
    if (e.className.match(/(^|\s)scroll-horizontal(\s|$)/g))
        this.hScrollbar = new ScrollBar(this, 'horizontal');
    
    // Set scrollbar sizes
    if (this.vScrollbar) this.vScrollbar.resize();
    if (this.hScrollbar) this.hScrollbar.resize();
}

function ScrollBar(win, orientation) {
    this.win = win,
    this.orientation = orientation;
    
    // Create scrollbar container.
    this.init = function() {
        this.scrollbarContainer = document.createElement('div'),
        this.scrollbar = document.createElement('div');

        if (this.orientation == 'vertical')
            this.scrollbarContainer.className = 'scrollbar-container scrollbar-vertical-container';
        else if (this.orientation == 'horizontal')
            this.scrollbarContainer.className = 'scrollbar-container scrollbar-horizontal-container';

        // Create scrollbar.
        this.scrollbar.className = 'scrollbar';
        this.scrollbarContainer.appendChild(this.scrollbar);
        
        this.win.addScrollBar(this);
    }

    /**
     * Resizes the scrollbar.
     */
    this.resize = function() {
        var hasBothScrollbars = this.win._hasScrollBar('horizontal') && this.win._hasScrollBar('vertical'),
            minSize = 1; // Minimum width (for horizontal scrollbars) and
                         // maximum height (for vertical scrollbars) in pixels.
        
        if (this.orientation == 'vertical') {
            // Calculate scrollbar container height.
            var containerHeight = this.win.container.clientHeight;
            if (hasBothScrollbars)
                containerHeight -= this.scrollbarContainer.clientWidth;
            this.scrollbarContainer.style.height = containerHeight + 'px';

            // Calculate scrollbar height.
            var scrollbarHeight = (containerHeight * this.win.container.clientHeight) / this.win.content.clientHeight;
            if (scrollbarHeight < minSize)
                scrollbarHeight = minSize;
            else if (scrollbarHeight > containerHeight)
                scrollbarHeight = containerHeight;
            this.scrollbar.style.height = scrollbarHeight + 'px';
        } else if (this.orientation == 'horizontal') {
            // Calculate scrollbar container width.
            var containerWidth = this.win.container.clientWidth;
            if (hasBothScrollbars)
                containerWidth -= this.scrollbarContainer.clientHeight;
            this.scrollbarContainer.style.width = containerWidth + 'px';

            // Calculate scrollbar width.
            var scrollbarWidth = (containerWidth * this.win.container.clientWidth) / this.win.content.clientWidth;
            if (scrollbarWidth < minSize)
                scrollbarWidth = minSize;
            else if (scrollbarWidth > containerWidth)
                scrollbarWidth = containerWidth;
            this.scrollbar.style.width = scrollbarWidth + 'px';
        }
    };
    
    /**
     * Moves the scrollbar when dragged with the mouse.
     */
    this._move = function(newX, newY) {
        var scrollbarContainerRect = this.scrollbarContainer.getBoundingClientRect(),
            xy = 0;
        switch (this.orientation) {
        case 'vertical':
            var newY = newY - scrollbarContainerRect.top - this.mouseY;
            if (newY < 0) {
                this.scrollbar.style.top = '0',
                xy = 0;
            } else if (newY + this.scrollbar.clientHeight > this.scrollbarContainer.clientHeight) {
                xy = this.scrollbarContainer.clientHeight - this.scrollbar.clientHeight,
                this.scrollbar.style.top = xy + 'px';
            } else {
                this.scrollbar.style.top = newY + 'px',
                xy = newY;
            }
            break;
        case 'horizontal':
            var newX = newX - scrollbarContainerRect.left - this.mouseX;
            if (newX < 0) {
                this.scrollbar.style.left = '0',
                xy = 0;
            } else if (newX + this.scrollbar.clientWidth > this.scrollbarContainer.clientWidth) {
                xy = this.scrollbarContainer.clientWidth - this.scrollbar.clientWidth,
                this.scrollbar.style.left = xy + 'px';
            } else {
                this.scrollbar.style.left = newX + 'px',
                xy = newX;
            }
            break;
        }
        this.onMove(xy);
    };

    this.init();

    this.mouseX = 0, // Initial x coordinate of the mouse on the scrollbar relative to the top of the scrollbar.
    this.mouseY = 0; // Initial y coordinate of the mouse on the scrollbar relative to the top of the scrollbar.
    var scrollbarObject = this;

    this.scrollbar.onmousedown = function(e) {
        e = e || window.event;
        var scrollbarRect = scrollbarObject.scrollbar.getBoundingClientRect();
        scrollbarObject.mouseX = e.clientX - scrollbarRect.left,
        scrollbarObject.mouseY = e.clientY - scrollbarRect.top;

        window.activeScrollbar = scrollbarObject;
        
        // Disable text selection.
        addEventCallback(document, 'selectstart', disableDocumentTextSelection);
    };
    
    // Scrollbar container and scrollbar gets bigger when the mouse hovers over it.
    this.scrollbarContainer.onmouseover = function() {
        if (this.expandTimeout && this.expandTimeout != null) {
            clearTimeout(this.expandTimeout);
            this.expandTimeout = null;
        }
        this.className += ' expanded';
    };
    // Scrollbar container collapses when the mouse moves out.
    this.scrollbarContainer.onmouseout = function() {
        var scrollbarContainer = this;
        this.expandTimeout = setTimeout(function(){
            scrollbarContainer.className = scrollbarContainer.className.replace(/(^|\s+)expanded(?=\s|$)/g, '').replace(/\s+$/, '');
        }, 500);
    };
    
    this.scrollbarContainer.onclick = function(e) {
        e = e || window.event;
        if ((e.target || e.srcElement) != scrollbarObject.scrollbarContainer)
            return;
        
        // Disable text selection.
        addEventCallback(document, 'selectstart', disableDocumentTextSelection);
        
        var pos = 0;
        switch (scrollbarObject.orientation) {
        case 'horizontal':
            // x coordinate of the scrollbar relative to the scrollbar window.
            var scrollbarRectLeft = scrollbarObject.scrollbar.getBoundingClientRect().left,
            // x coordinate of the scrollbar relative to the scrollbar container.
            x = scrollbarRectLeft - scrollbarObject.scrollbarContainer.getBoundingClientRect().left,
            // Difference between x coordinate of mouse and x coordinate of 
            // scrollbar (relative to browser window).
            dx = e.clientX - scrollbarRectLeft,
            scrollbarWidth = scrollbarObject.scrollbar.clientWidth;
            if (dx < 0) {
                pos = x - scrollbarWidth;
                if (pos < 0)
                    pos = 0;
            } else if (dx > 0) {
                pos = x + scrollbarWidth;
                var containerWidth = scrollbarObject.scrollbarContainer.clientWidth;
                if (pos + scrollbarWidth > containerWidth)
                    pos = containerWidth - scrollbarWidth;
            }
            scrollbarObject.scrollbar.style.left = pos + 'px';
            break;
        case 'vertical':
            var scrollbarRectTop = scrollbarObject.scrollbar.getBoundingClientRect().top,
                y = scrollbarRectTop - scrollbarObject.scrollbarContainer.getBoundingClientRect().top, // y coordinate of scrollbar.
                dy = e.clientY - scrollbarRectTop,
                scrollbarHeight = scrollbarObject.scrollbar.clientHeight;
            if (dy < 0) {
                pos = y - scrollbarHeight;
                if (pos < 0)
                    pos = 0;
            } else if (dy > 0) {
                pos = y + scrollbarHeight;
                var containerHeight = scrollbarObject.scrollbarContainer.clientHeight;
                if (pos + scrollbarHeight > containerHeight)
                    pos = containerHeight - scrollbarHeight;
            }
            scrollbarObject.scrollbar.style.top = pos + 'px';
            break;
        }
        
        scrollbarObject.onMove(pos);
    };
    
    /**
     * Called when scroll bar is moved to position the scroll content.
     *
     * @param {float|int} pos The x or y (depending on the orientation) coordinate of the scroll bar 
     *            relative to the scroll container.
     * @private
     */
    this.onMove = function(pos) {
        var scrollProperty = {'orientation':this.orientation};
        switch (this.orientation) {
        case 'vertical':
            var y = Math.floor((this.win.content.clientHeight * pos) / this.scrollbarContainer.clientHeight);
            this.win.content.style.top = -y + 'px';
            scrollProperty['scrollY'] = -y;
            break;
        case 'horizontal':
            var x = Math.floor((this.win.content.clientWidth * pos) / this.scrollbarContainer.clientWidth);
            this.win.content.style.left = -x + 'px';
            scrollProperty['scrollX'] = -x;
            break;
        }
        this.win._callListeners(scrollProperty);
    };

    /**
     * Called when the positioning of the scroll content changes to reposition
     * the scrollbar.
     *
     * @param {float|int} pos The x or y (depending on the orientation) coordinate of the scroll content.
     * @private
     */
    this._onContentMove = function(pos) {
        var scrollProperty = {'orientation':this.orientation};
        switch (this.orientation) {
        case 'vertical':
            this.scrollbar.style.top = Math.abs((this.scrollbarContainer.clientHeight * pos) / this.win.content.clientHeight) + 'px';
            scrollProperty['scrollY'] = pos;
            break;
        case 'horizontal':
            this.scrollbar.style.left = Math.abs((this.scrollbarContainer.clientWidth * pos) / this.win.content.clientWidth) + 'px';
            scrollProperty['scrollX'] = pos;
            break;
        }
        this.win._callListeners(scrollProperty);
    };
}

function disableDocumentTextSelection(e) {
    e = e || window.event;
    if (e.preventDefault()) {
        e.preventDefault();
    }
    return false;
}

function addEventCallback(element, type, callback) {
    if (element.attachEvent) {
        element.attachEvent('on' + type, callback);
    } else if (element.addEventListener) {
        element.addEventListener(type, callback)
    }
}

function removeEventCallback(element, type, callback) {
    if (element.detachEvent) {
       element.detachEvent('on' + type, callback); 
    } else if (element.removeEventListener) {
        element.removeEventListener(type, callback);
    }
}

addEventCallback(document, 'mousemove', function(e) {
    if (window.activeScrollbar && window.activeScrollbar instanceof ScrollBar) {
        e = e || window.event;
        window.activeScrollbar._move(e.clientX, e.clientY);
    }
});

addEventCallback(document, 'mouseup', function() {
    if (window.activeScrollbar) {
        window.activeScrollbar = null;
    }
    
    // Enable text selection.
    removeEventCallback(document, 'selectstart', disableDocumentTextSelection);
});

// Include css file.
var style = document.createElement('link');
style.rel = 'stylesheet';
style.href = navigator.userAgent.match(/MSIE/g) ? 'css/scroll-ie.css' : 'css/scroll.css';
document.getElementsByTagName('head')[0].appendChild(style);

var fancyscroll = {
    'init': function() {
        var scrollWindows = this.getFancyScrollWindows(), i;
        for (i = 0; i < scrollWindows.length; i++)
            scrollWindows[i].fancyscroll = new ScrollWindow(scrollWindows[i]);
    },

    'getFancyScrollWindows': function() {
        var scrollWindows = [],
            divs = document.getElementsByTagName('div'),
            i;
        for (i = 0; i < divs.length; i++)
            if (divs[i].className.match(/(^|\s)scroll-window(\s|$)/g))
                scrollWindows.push(divs[i]);

        return scrollWindows;
    }
};
