
window.Tour = (function(my, options) {

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
    if(!!this.tip) {
        this.overlay.children[0].removeChild(this.tip);
    }
    this.tip = createTip.call(this, step, this.tipClasses + " " + step.position || "bottom");
    setPosition(this.overlay, position);
  }

  my.prototype.showOverlay = function() {
    this.shadow = this.shadow || createShadow.call(this);
    this.container.appendChild(this.shadow);
    this.shadow.onclick = this.end.bind(this);
  }

  my.prototype.end = function() {
    this.container.removeChild(this.shadow);
    this.shadow = this.overlay = this.tip = null;
  }

  var createShadow = function() {
    var shadow = document.createElement("div");
    shadow.className = "ttour-shadow";
    shadow.appendChild(this.overlay = createOverlay());
    return shadow;
  }

  var createOverlay = function() {
    var overlay = document.createElement("div");
    var wrapper = document.createElement("div");
    overlay.className = "ttour-overlay";
    wrapper.className = "ttour-wrapper";
    overlay.appendChild(wrapper);
    return overlay;
  }

  var setPosition = function(el, position) {
    el.style.left = position.left + "px";
    el.style.top = position.top + "px";
    el.style.width = position.width + "px";
    el.style.height = position.height + "px";
  }

  var createArrow = function() {
    var arrow = document.createElement("div");
    arrow.className = "ttour-arrow";
    return arrow
  }

  var createTip = function(step, classes) {
    var tip = document.createElement("div");
    tip.className = "ttour-tip tip-"+ this.current + " " + classes;
    tip.appendChild(tipHeader(step.title));
    tip.appendChild(tipBody(step.description));
    tip.appendChild(tipFooter.call(this))
    tip.appendChild(createArrow());
    tip.style.position = 'absolute';
    tip.onclick = function(e) { e.stopPropagation(); }
    this.overlay.children[0].appendChild(tip);
    return tip;
  }

  var tipHeader = function(title) {
    var header = document.createElement("div");
    header.className = "ttour-header";
    header.appendChild(tipTitle(title))
    return header;
  }

  var tipBody = function(description) {
    var tbody = document.createElement("div");
    tbody.className = "ttour-body";
    tbody.innerHTML = description;
    return tbody;
  }

  var tipFooter = function() {
    var tfoot = document.createElement("div");
    tfoot.className = "ttour-footer";
    tfoot.appendChild(createBullets(this.steps.length, this.current))
    tfoot.appendChild(nextButton.call(this, (this.steps.length - 1) == this.current))
    if(this.current > 0)
      tfoot.appendChild(prevButton.call(this))
    return tfoot;
  }

  var createBullets = function(totalSteps, current) {
    var bullets = document.createElement("div");
    bullets.className = "ttour-bullets";
    for(var i = 0; i < totalSteps; i++) {
      bullets.appendChild(createBullet(i == current));
    }
    return bullets;
  }

  var createBullet = function(active) {
    var bullet = document.createElement("div");
    bullet.className = "ttour-bullet " + (active ? 'active' : '');
    return bullet;
  }

  var nextButton = function(last) {
    var button = document.createElement("button");
    button.className = "next";
    button.innerText = last ? this.doneText : this.nextText;
    button.onclick = this.nextStep.bind(this);
    return button;
  }

  var prevButton = function() {
    var button = document.createElement("button");
    button.className = "prev";
    button.innerText = this.prevText;
    button.onclick = this.prevStep.bind(this);
    return button
  }

  var tipTitle = function(titleText) {
    var title = document.createElement('h1');
    title.innerText = titleText;
    return title;
  }

  var elementPosition = function(element, parentEl, padding) {
    var el = parentEl.querySelector(element);
    var position = el.getBoundingClientRect();
    return {
      left: parentEl.scrollLeft + position.left - padding,
      top: parentEl.scrollTop + position.top - padding,
      width: position.width + padding * 2,
      height: position.height + padding * 2
    }
  }

  var defaults = function() {
    return {
      steps: [],
      padding: 3,
      container: document.body,
      nextText: "Next",
      doneText: "Done",
      prevText: "Prev",
      tipClasses: ""
    }
  }

  return my;

})(window.tour || function(options) { this.init(options || {}) })
