'use strict';

var testOptions = {
  padding: 0,
  next: 'More',
  prev: 'Less',
  done: 'Finito',
  steps: [
    {
      element: ".one",
      title: "Tourquoise",
      description: "This box is tourqoise!",
      position: "right"
    },
    {
      element: ".two",
      title: "Red",
      description: "Look how red this box is!",
      data: "Custom Data",
      position: "bottom"
    },
    {
      element: ".doesnt-exist",
      title: "Red",
      description: "Look how red this box is!",
      data: "Custom Data",
      position: "bottom"
    }
  ]
}

var tour;
beforeEach(function(){
  tour = new Tour(testOptions);
})

afterEach(function() {
  var tour = document.querySelector('.ttour-shadow');
  if(!!tour)
    document.body.removeChild(tour)
})

describe('Tour', function() {
  describe('#init', function() {

    it('should set reasonable defaults for a new Tour()', function() {
      var tour = new Tour();
      expect(tour.steps.length).to.equal(0);
      expect(tour.padding).to.equal(3);
      expect(tour.container).to.equal(document.body);
      expect(tour.next).to.equal("Next");
      expect(tour.done).to.equal("Done");
      expect(tour.prev).to.equal("Prev");
    })

    it('should override default options with provided options', function() {
      expect(tour.steps.length).to.equal(testOptions.steps.length);
      expect(tour.padding).to.equal(0);
      expect(tour.next).to.equal("More");
      expect(tour.done).to.equal("Finito");
      expect(tour.prev).to.equal("Less");
    })

  })

  describe('#override', function() {

    it('should override a prototype function', function() {
      tour.override('start', function() {
        return 'overridden'
      })

      expect(tour.start()).to.equal('overridden');
    })

    it('should share the same context as the original "this" == "tour (this)"', function() {
      tour.override('start', function() {
        return this.next;
      })

      expect(tour.start()).to.equal('More');
    })
  })

  describe('#start', function() {

    it('should set the "current" index to 0', function() {
      tour.start();
      expect(tour.current).to.equal(0);
    })

    it('should show the current step', function() {
      tour.start();
      assertTipElements(0);
    })
  });

  describe('#goToStep', function() {
    it('should go to the specified step (0 indexed)', function() {
      tour.start();
      tour.goToStep(1);
      expect(tour.current).to.equal(1);
    })

    it('should show the current step', function() {
      tour.start();
      tour.goToStep(1);
      assertTipElements(1);
    })

    it('should throw an error if the step is not found', function() {
      tour.start()
      try {
        // This should throw an error since there is no step at this index
        tour.goToStep(testOptions.steps.length);
        assert(false);
      } catch (e) {
        assert(true);
      }
    });

    // NOTE: The second to last step should be one that doesn't have an element
    it('should use the parent element position if no element is found', function() {
      tour.start();
      tour.goToStep(testOptions.steps.length - 1);
      assertTipPosition(document.body.getBoundingClientRect());
    });
  });

  describe('#nextStep', function() {

    it('should increment the current step', function() {
      tour.start();
      tour.nextStep();
      expect(tour.current).to.equal(1);
    })

    it('should show the current step', function() {
      tour.start();
      tour.nextStep();
      assertTipElements(1);
    })
  });

  describe('#prevStep', function() {
    it('should go back a step', function() {
      tour.start();
      tour.nextStep();
      tour.prevStep();
      expect(tour.current).to.equal(0);
    })

    it('should show the current step', function() {
      tour.start();
      tour.nextStep();
      tour.prevStep();
      assertTipElements(0);
    })
  });

  // describe('#showStep', function() {
  // });

  // describe('#showOverlay', function() {
  // });

  describe('#end', function() {
    it('should remove the tip from the dom', function() {
      tour.start();
      var el = document.querySelector('ttour-shadow');
      expect(el).not.to.be.null;
      tour.end();
      el = document.querySelector('ttour-shadow');
      expect(el).to.be.null;
    })
  });

})

var assertTipElements = function(tipIndex) {
  var tip = testOptions.steps[tipIndex];
  assertTipHeader(tip.title);
  assertTipBody(tip.description);
  assertNextButton(tipIndex);
  assertPrevButton(tipIndex);
  assertTipBullets(tipIndex);
}

var assertTipHeader = function(text) {
  var header = document.querySelector('.ttour-header h1').innerText;
  expect(header).to.equal(text);
}

var assertTipBody = function(text) {
  var body = document.querySelector('.ttour-body').innerText;
  expect(body).to.equal(text);
}

var assertNextButton = function(tipIndex) {
  var el = document.querySelector('.ttour-footer button.next');
  if(tipIndex != testOptions.steps.length - 1)
    expect(el.innerText).to.equal(testOptions.next)
  else
    expect(el.innerText).to.equal(testOptions.done)
}

var assertPrevButton = function(tipIndex) {
  var el = document.querySelector('.ttour-footer button.prev');
  if(tipIndex != 0)
    expect(el.innerText).to.equal(testOptions.prev)
  else
    expect(el).to.be.null
}

var assertTipBullets = function(tipIndex) {
  var bullets = document.querySelectorAll('.ttour-bullet');
  expect(bullets.length).to.equal(testOptions.steps.length);
  expect(/active/.test(bullets[tipIndex].className)).to.be.true
}

var assertTipPosition = function(position) {
  var el = document.querySelector('.ttour-overlay');
  var elPos = el.getBoundingClientRect();
  expect(elPos.left).to.equal(position.left);
  expect(elPos.top).to.equal(position.top);
  expect(elPos.width).to.equal(position.width);
  expect(elPos.height).to.equal(position.height);
}
