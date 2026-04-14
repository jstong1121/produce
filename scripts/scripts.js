/* WRITE YOUR JS HERE... YOU MAY REQUIRE MORE THAN ONE JS FILE. IF SO SAVE IT SEPARATELY IN THE SCRIPTS DIRECTORY */
const STAGES = ['Development', 'Pre-Production', 'Production', 'Post-Production', 'Distribution'];
const TOTAL_DECISIONS = 9;

/*TERMS*/
const TERMS = {
  producer:     "A producer oversees all aspects of a film's creation, from concept to release. They are legally and financially responsible for the project.",
  greenlight:   "To greenlight a film means a studio or financier officially approves it to move into production with a confirmed budget.",
  hyphenate:    "A hyphenate holds two roles at once, such as writer-director or producer-director. Common in independent film.",
  development:  "The phase where a film's concept, script, and financing are shaped. It is the longest and most uncertain stage of the process.",
  script:       "The screenplay is the written blueprint for the film.",
  option:       "Paying a fee to exclusively control a property for a set period, typically 12 to 18 months.",
  financing:    "Securing money to fund a film. Sources include studios, investors, tax incentives, co-productions, and pre-sales.",
  presales:     "Selling the distribution rights to a film in specific territories before production begins. Pre-sale agreements give producers upfront cash that can be used to finance the shoot.",
  taxcredit:    "A government incentive that allows film productions to recover a percentage of qualifying local spend. Many regions offer these to attract productions and create local jobs.",
  gapfinancing: "A loan that covers the difference between a film's confirmed pre-sales and its total budget. Lenders take on the risk that unsold territories will eventually generate enough revenue to repay the loan.",
  budget:       "The total money allocated to make the film, split into above-the-line costs (talent, script) and below-the-line costs (crew, equipment).",
  depthead:     "Department heads lead each crew department. The producer hires them.",
  schedule:     "Maps out when and where each scene films, balancing actor availability, location costs, and daylight.",
  talentdeal:   "A contract negotiated with an actor, director, or key crew member that defines their fee, credit, creative approvals, and any backend participation in the film's profits.",
  sagaftra:     "SAG-AFTRA is the American union representing film and television performers. Productions that sign a SAG-AFTRA agreement must meet minimum pay rates, working conditions, and safety standards. Most professional US productions are SAG-AFTRA signatory.",
  principal:    "Principal photography is the main shooting period and the most expensive phase of production.",
  overage:      "When production spends beyond its approved budget line. Producers must approve the excess or find offsets elsewhere.",
  editing:      "Assembling raw footage into a coherent film across multiple rounds of cuts.",
  vfx:          "Visual Effects are computer-generated elements added after shooting, ranging from subtle wire removal to fully digital environments.",
  prodbible:    "A comprehensive reference document that captures the vision, tone, world, and characters of a film or series. Used to align the creative team and pitch the project to financiers and distributors.",
  distributor:  "A company that licenses the film and manages how it reaches audiences.",
  festival:     "Festivals like Sundance, Cannes, or TIFF can launch films and attract distribution deals.",

};

/*TERMS TOOLTIP*/
(function initTooltip() {
  const tip = document.getElementById('tooltip');

  document.addEventListener('mouseover', e => {
    const el = e.target.closest('mark[data-term]');
    if (el) {
      const def = TERMS[el.getAttribute('data-term')];
      if (def) {
        tip.textContent = def;
        tip.classList.add('show');
      }
    }
  });

  document.addEventListener('mousemove', e => {
    let x = e.clientX + 14;
    let y = e.clientY - 10;
    if (x + 260 > window.innerWidth) x = e.clientX - 260;
    tip.style.left = x + 'px';
    tip.style.top  = y + 'px';
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest('mark[data-term]')) {
      tip.classList.remove('show');
    }
  });
})();

/*SCREEN NAVIGATION*/
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    // Show the target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    // Update nav button active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('href') === '#' + screenId) {
            btn.classList.add('active');
        }
    });
}

function handleNavClick(event) {
    const href = event.target.getAttribute('href');
    if (href && href.startsWith('#')) {
        const screenId = href.substring(1);
        window.location.hash = href;
        showScreen(screenId);
        event.preventDefault();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to nav buttons
    document.querySelectorAll('.nav-btn, .home-btn1, .home-btn2, .cta-btn, .nav-title').forEach(btn => {
        btn.addEventListener('click', handleNavClick);
    });

    // Handle initial load and hash changes
    function handleHashChange() {
        const hash = window.location.hash.substring(1) || 'home';
        showScreen(hash);
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial call

    // Stages accordion
    document.querySelectorAll('.stage-title').forEach(title => {
        title.addEventListener('click', () => {
            const desc = title.nextElementSibling;
            const arrow = title.querySelector('.arrow');
            if (desc && desc.classList.contains('stage-desc')) {
                desc.classList.toggle('expanded');
                title.classList.toggle('expanded');
                if (arrow) {
                    arrow.classList.toggle('rotated');
                }
            }
        });
    });
});