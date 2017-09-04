
window.Tour = (function(my, options) {
  var OVERLAY = 'ttour-overlay';
  var WRAPPER = 'ttour-wrapper';
  var TIP = 'ttour-tip';

  my.prototype.init = function(options) {
    this.current = 0;
    Object.assign(this, defaults(), options);
  }

  my.prototype.override = function(name, newMethod) {
    var method = this[name];
    this[name] = newMethod.bind(this, method.bind(this))
  }

  my.prototype.start = function() {
    this.showOverlay();
    this.showStep(this.steps[this.current = 0]);
  }

  my.prototype.goToStep = function(index) {
    this.current = index;
    this.showStep(this.steps[this.current])
  }

  my.prototype.nextStep = function() {
    var step = this.steps[++this.current];
    !!step ? this.showStep(step) : this.end();
  }

  my.prototype.prevStep = function() {
    var step = this.steps[Math.max(--this.current, 0)];
    this.showStep(step);
  }

  my.prototype.showStep = function(step) {
    var position = elementPosition(step.element, this.container, this.padding);
    var wrapper = getElement(this, '.'+WRAPPER);
    var tip = getElement(this, '.'+TIP);
    if(!!tip) {
        wrapper.removeChild(tip);
    }
    tip = createTip.call(this, step, step.position || "bottom");
    wrapper.appendChild(tip);
    setPosition(getElement(this, '.' + OVERLAY), position);
  }

  my.prototype.showOverlay = function() {
    this.el = this.el || createShadow.call(this);
    this.container.appendChild(this.el);
  }

  my.prototype.end = function() {
    this.container.removeChild(this.el);
    this.el = null;
  }

  var getElement = function(self, selector) {
    return self.el.querySelector(selector);
  }

  var createShadow = function() {
    return newElement("div", {
      className: "ttour-shadow",
      onclick: this.end.bind(this)
    }, [
      createOverlay()
    ]);
  }

  var createOverlay = function() {
    var wrapper = newElement("div", {
      className: WRAPPER
    })

    return newElement("div", {
      className: OVERLAY
    }, [
      wrapper
    ]);
  }

  var setPosition = function(el, position) {
    el.style.left = position.left + "px";
    el.style.top = position.top + "px";
    el.style.width = position.width + "px";
    el.style.height = position.height + "px";
  }

  var createArrow = function() {
    return newElement("div", {
      className: "ttour-arrow"
    })
  }

  var createTip = function(step, classes) {
    return newElement("div", {
      className: TIP+" tip-"+ this.current + " " + classes,
      style: { position: 'absolute' },
      onclick: function(e) { e.stopPropagation(); }
    }, [
      tipHeader(step.title),
      tipBody(step.description),
      tipFooter.call(this),
      createArrow()
    ]);
  }

  var tipHeader = function(title) {
    return newElement("div", {
      className: "ttour-header"
    }, [
      tipTitle(title)
    ]);
  }

  var tipBody = function(description) {
    return newElement("div", {
      className: "ttour-body",
      innerHTML: description
    })
  }

  var tipFooter = function() {
    var children = [
      createBullets(this.steps.length, this.current),
      nextButton.call(this, (this.steps.length - 1) == this.current)
    ]

    if(this.current > 0)
      children.push(prevButton.call(this))

    var tfoot = newElement("div", {
      className: "ttour-footer"
    }, children)
    return tfoot;
  }

  var createBullets = function(totalSteps, current) {
    var children = []
    for(var i = 0; i < totalSteps; i++) {
      children.push(createBullet(i == current));
    }

    return newElement("div", {
      className: "ttour-bullets"
    }, children);
  }

  var createBullet = function(active) {
    return newElement("div", {
      className: "ttour-bullet " + (active ? 'active' : '')
    })
  }

  var nextButton = function(last) {
    return newElement("button", {
      className: "next",
      innerText: last ? this.done : this.next,
      onclick: this.nextStep.bind(this)
    });
  }

  var prevButton = function() {
    return newElement("button", {
      className: "prev",
      innerText: this.prev,
      onclick: this.prevStep.bind(this)
    });
  }

  var tipTitle = function(titleText) {
    return newElement("h1", {
      innerText: titleText
    })
  }

  var elementPosition = function(element, parentEl, padding) {
    // Default to the parentEl if we can't find the element. This should be obvious enough
    // to the caller that the element was not able to be found.
    var el = parentEl.querySelector(element) || parentEl;
    var position = el.getBoundingClientRect();
    return {
      left: parentEl.scrollLeft + position.left - padding,
      top: parentEl.scrollTop + position.top - padding,
      width: position.width + padding * 2,
      height: position.height + padding * 2
    }
  }

  var newElement = function(tag, attributes, children) {
    var el = document.createElement(tag);
    Object.assign(el, attributes);
    for(var i = 0; i < (children || []).length; i++) {
      el.appendChild(children[i]);
    }
    return el;
  }

  var defaults = function() {
    return {
      steps: [],
      padding: 3,
      container: document.body,
      next: "Next",
      done: "Done",
      prev: "Prev"
    }
  }

  return my;

})(window.tour || function(options) { this.init(options || {}) })
