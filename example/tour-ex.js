
window.onload = function() {
  window.tour = new Tour({
    padding: 0,
    nextText: 'More',
    doneText: 'Finito',
    prevText: 'Less',
    tipClasses: 'tip-class active',
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
        element: ".three",
        title: "Blue",
        description: "Almost too blue! Reminds of a default anchor tag.",
        position: "bottom"
      },
      {
        element: ".four",
        title: "Green",
        description: "Trees!",
        position: "left"
      },
      {
        element: ".five",
        title: "Purple",
        description: "Because there should probably be five of these.",
        position: "top"
      }
    ]
  })

  tour.override('showStep', function(self, step) {
    self(step);
  })

  tour.override('end', function(self, step) {
    self(step);
  })

  tour.start();
}
