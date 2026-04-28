/* WRITE YOUR JS HERE... YOU MAY REQUIRE MORE THAN ONE JS FILE. IF SO SAVE IT SEPARATELY IN THE SCRIPTS DIRECTORY */
const STAGES = ['Development', 'Pre-Production', 'Production', 'Post-Production', 'Distribution'];
const TOTAL_DECISIONS = 9;
const STAGE_BG_CLASSES = [
    'sim-bg-development',
    'sim-bg-preproduction',
    'sim-bg-production',
    'sim-bg-postproduction',
    'sim-bg-distribution'
];

function updateSimBackground(stageIdx) {
    const ma = document.getElementById('sim-main');
    if (!ma) return;
    STAGE_BG_CLASSES.forEach(cls => ma.classList.remove(cls));
    if (STAGE_BG_CLASSES[stageIdx]) {
        ma.classList.add(STAGE_BG_CLASSES[stageIdx]);
    }
}



/*SIMULATE*/
let simState = {
    budget:      2000,
    time:        24,
    risk:        10,
    progress:    0,
    stageIdx:    0,
    decisionIdx: 0,
    history:     []
};

const SCENARIOS = [
  {
    stage: 0,
    title: 'The rights deal',
    body: "A journalist's investigative piece about a corruption scandal has gone viral. The rights are available, but three other producers are circling. Move fast with a low offer, wait and bid high, or develop an original script instead.",
    emergency: false,
    choices: [
      {
        text: "Move fast. Low offer now — first mover advantage matters more than price.",
        label: 'Move first',
        budget: -60, time: 0, risk: 18, progress: 10,
        fb: 'You got the rights. The journalist is lukewarm.',
        why: "Fast acquisitions protect against competition but create fragile relationships. Rights holders who feel undervalued become difficult collaborators.",
        good: true
      },
      {
        text: "Take a week, then bid high and win cleanly.",
        label: 'Bid strong',
        budget: -140, time: -1, risk: 5, progress: 10,
        fb: 'Clean acquisition. Genuine collaborator now.',
        why: "Paying fair market rate aligns incentives. The time cost is real but the trust earned compounds positively.",
        good: true
      },
      {
        text: "Develop an original script — lower cost, full ownership.",
        label: 'Go original',
        budget: -30, time: -2, risk: -5, progress: 8,
        fb: 'More creative freedom. Development will take longer.',
        why: "Original IP avoids rights complications. The timeline extends, but you own everything outright.",
        good: true
      }
    ]
  },
  {
    stage: 0,
    title: 'The script problem',
    body: "Your writer delivered a first draft. It's ambitious but structurally broken — the second act collapses. Hire a script doctor for a fast fix, go back to your writer with notes, or bring in a second writer without telling the first.",
    emergency: false,
    choices: [
      {
        text: "Hire a script doctor. Targeted structural fix.",
        label: 'Bring in a doctor',
        budget: -80, time: 0, risk: 8, progress: 10,
        fb: 'Fixed in 3 weeks. Writer is bruised but script is better.',
        why: "Script doctors are specialists — fast but expensive, and their involvement can damage the original writer's investment.",
        good: true
      },
      {
        text: "Go back to your writer with thorough notes.",
        label: 'Develop with writer',
        budget: -20, time: -2, risk: -5, progress: 9,
        fb: 'Six weeks later, a much stronger draft. Relationship intact.',
        why: "The original writer understands the story's soul in a way no outside hire can. Slower but more coherent.",
        good: true
      },
      {
        text: "Bring in a second writer quietly. Merge the best of both.",
        label: 'Ghost the rewrite',
        budget: -100, time: -1, risk: 22, progress: 9,
        fb: 'Word gets out. Both writers are furious. PR mess.',
        why: "The WGA has strict rules about undisclosed rewrites. Word travels fast — this damages your reputation as a producer.",
        good: false
      }
    ]
  },
  {
    stage: 1,
    title: 'Director attachment',
    body: "A director fresh off a festival hit wants to attach. Bold vision, slow shoot style. A less buzzy director would keep you on schedule — but won't unlock the same financing.",
    emergency: false,
    choices: [
      {
        text: "Attach the festival director. Chase the financing their name unlocks.",
        label: 'Chase the heat',
        budget: 280, time: -3, risk: 20, progress: 12,
        fb: 'Financing locked. Schedule already slipping.',
        why: "A name director can unlock $300K+ in financing. But slow shooters cost $8K–$40K per extra day.",
        good: true
      },
      {
        text: "Go with the efficient director. Less heat, more control.",
        label: 'Stay in control',
        budget: -40, time: 0, risk: -10, progress: 12,
        fb: 'Clean pre-production. Film lives on its story.',
        why: "Efficient directors are underrated. A film that comes in on schedule and budget has options — one that runs over rarely does.",
        good: true
      },
      {
        text: "Offer both directors the script. See who pitches harder.",
        label: 'Hold a pitch-off',
        budget: -15, time: -2, risk: 10, progress: 10,
        fb: 'One drops out. The other starts suspicious of you.',
        why: "Directors talk to each other. A pitch-off signals you don't know what you want — undermining trust before production begins.",
        good: false
      }
    ]
  },
  {
    stage: 1,
    title: 'The casting decision',
    body: "Your lead role is uncast. A recognizable name wants the part — they bring financing but are known for being difficult. An unknown gave the best audition you've ever seen.",
    emergency: false,
    choices: [
      {
        text: "Cast the name. Their profile makes distribution easier.",
        label: 'Cast the name',
        budget: 150, time: 0, risk: 25, progress: 12,
        fb: 'Financing locked. Director is nervous.',
        why: "Bankable talent adds $1–2M in pre-sales through international deals. The risk: a difficult actor disrupts morale and causes costly delays.",
        good: true
      },
      {
        text: "Cast the unknown. Bet on talent.",
        label: 'Bet on talent',
        budget: -50, time: 0, risk: -8, progress: 12,
        fb: "Director thrilled. Distribution will be harder.",
        why: "Unknown actors are often hungrier and create less on-set chaos. The tradeoff: you're selling the film on concept and execution alone.",
        good: true
      },
      {
        text: "Offer the unknown role to the name actor at a lower rate.",
        label: 'Try to reframe',
        budget: -10, time: -1, risk: 15, progress: 10,
        fb: 'Their agent laughed. Week wasted.',
        why: "Name actors' agents know market rates. Below-rate offers signal disrespect — you lose a week and end up casting the unknown anyway.",
        good: false
      }
    ]
  },
  {
    stage: 1,
    title: 'Location or build it?',
    body: "Your script's centerpiece is a 1970s hotel lobby. You have three options: scout a real period location, rent a standing set at a studio backlot, or build a custom set from scratch. Each choice shapes the budget, the schedule, and the creative result.",
    emergency: false,
    choices: [
      {
        text: "Scout a real location. A genuine period hotel adds authenticity you can't fake.",
        label: 'Real location',
        budget: -70, time: -1, risk: 14, progress: 12,
        fb: 'Found a perfect match three hours away. Travel logistics add complexity.',
        why: "Real locations deliver production value no set can replicate, but they come with constraints — limited shoot windows, noise, weather, and no ability to move walls for the camera.",
        good: true
      },
      {
        text: "Rent a standing set at the studio backlot. Practical and fast.",
        label: 'Backlot standing set',
        budget: -110, time: 0, risk: 5, progress: 12,
        fb: 'Set is dressed and ready in two days. Full control over the space.',
        why: "Backlot sets are expensive per day but give the crew maximum control. No weather, no noise, moveable walls, and a familiar environment for the team.",
        good: true
      },
      {
        text: "Build a custom set. Exactly what the director imagined.",
        label: 'Build custom',
        budget: -200, time: -2, risk: 10, progress: 13,
        fb: "The set is stunning. Production designer delivered something extraordinary.",
        why: "Custom builds are the most expensive option but give complete creative control. When the set is this central to the story, it can be worth it — but only if the budget can absorb the cost.",
        good: true
      }
    ]
  },
  {
    stage: 2,
    title: 'Day 12 — the actor no-show',
    body: "Your lead missed morning call. Agent isn't answering. 40 crew on the clock at $8K/hour, location locked, scene can't shoot without them.",
    emergency: true,
    timerSecs: 15,
    choices: [
      {
        text: "Restructure the day. Shoot supporting scenes, push the lead's scenes.",
        label: 'Restructure the day',
        budget: -60, time: -1, risk: 12, progress: 11,
        fb: 'Smart. One day lost. Shoot survived.',
        why: "Restructuring keeps crew productive. $60K loss on a restructured day beats $160K+ lost waiting. Core production skill.",
        good: true
      },
      {
        text: "Hold location and wait two hours. Maybe they show.",
        label: 'Wait it out',
        budget: -160, time: -1, risk: 22, progress: 11,
        fb: 'Showed up three hours late. Very expensive. Morale dropped.',
        why: "Waiting is always the most expensive option. It also signals no-shows have no consequences — which compounds into future problems.",
        good: false
      },
      {
        text: "Call their lawyer. Issue a formal breach warning.",
        label: 'Escalate hard',
        budget: -40, time: -1, risk: 8, progress: 11,
        fb: 'On set within the hour. No further no-shows.',
        why: "Formal breach warnings almost always work. Actors know a breach finding voids their pay and damages their insurability.",
        good: true
      }
    ]
  },
  {
    stage: 2,
    title: 'The location permit pulled',
    body: "Your key exterior location just had its permit pulled. 48 hours to find an alternative or restructure. The scene is 12 pivotal pages.",
    emergency: true,
    timerSecs: 18,
    choices: [
      {
        text: "Call your location scout. Premium fee to find a match overnight.",
        label: 'Find an alternative',
        budget: -90, time: 0, risk: 10, progress: 11,
        fb: 'New location by morning. Director makes it work.',
        why: "Experienced scouts have networks and can find alternatives fast — for a price. Preserves the scene and keeps schedule intact.",
        good: true
      },
      {
        text: "Push those 12 pages to end of schedule. Fight the permit.",
        label: 'Fight the permit',
        budget: -30, time: -2, risk: 18, progress: 10,
        fb: 'Permit back day three. Schedule compressed throughout.',
        why: "Fighting the permit is cheap but slow. Compressed schedule afterward increases pressure on all remaining days — mistakes compound.",
        good: false
      },
      {
        text: "Rewrite the scene with the director — interior version.",
        label: 'Rewrite for interior',
        budget: -20, time: -1, risk: 5, progress: 11,
        fb: 'The constraint produced something better.',
        why: "Constraints are one of cinema's most reliable creative engines. Forced pivots often become the right choice in retrospect.",
        good: true
      }
    ]
  },
  {
    stage: 3,
    title: "The director's cut",
    body: "Director delivered at 2h52m. Distributor wants under 2 hours. Editor says 1h55m works. Director says anything under 2h20m kills the film. Test screenings loved the long version.",
    emergency: false,
    choices: [
      {
        text: "Stand behind the director. Go out at 2h20m, negotiate with distributor.",
        label: 'Defend the vision',
        budget: 0, time: -2, risk: 20, progress: 14,
        fb: "Some distributors walk. Those who stay are committed.",
        why: "2h20m limits theatrical slots and makes streaming acquisitions harder. But committed distributors are worth more than reluctant ones.",
        good: true
      },
      {
        text: "Trust the editor. Cut to 1h55m.",
        label: 'Trust the editor',
        budget: 0, time: 0, risk: -8, progress: 14,
        fb: "Distribution deal closed. Director doesn't speak to you for months.",
        why: "1h55m is the sweet spot for theatrical economics. But overruling the director without buy-in is a relationship-ending move in a small industry.",
        good: false
      },
      {
        text: "Commission a second test screening. Let data lead.",
        label: 'Get more data',
        budget: -40, time: -1, risk: 5, progress: 13,
        fb: 'Long cut wins significantly. You have leverage now.',
        why: "Test data turns a creative argument into an evidence-based one. Directors respond to audience data in a way they can't respond to executive opinion.",
        good: true
      }
    ]
  },
  {
    stage: 4,
    title: 'The release decision',
    body: "A major streaming platform wants to buy for $1.8M — you break even with a small profit. Or go full theatrical with an awards push: real upside, real downside. A hybrid deal is also on the table.",
    emergency: false,
    choices: [
      {
        text: "Take the streaming deal. Protect your investors.",
        label: 'Take the deal',
        budget: 1800, time: 0, risk: -30, progress: 14,
        fb: 'Safe and smart. Investors will back you again.',
        why: "A $1.8M acquisition guarantees investor return. In an era where most films lose money theatrically, this is rational — not a compromise.",
        good: true
      },
      {
        text: "Go full theatrical. Awards season push.",
        label: 'Go theatrical',
        budget: -180, time: -3, risk: 35, progress: 14,
        fb: 'High stakes. All in.',
        why: "Theatrical releases cost $500K–$2M in P&A just to compete. Going theatrical with a depleted budget is gambling investors' money.",
        good: true
      },
      {
        text: "Take the hybrid deal. 45-day theatrical window, then streaming.",
        label: 'Hybrid deal',
        budget: 1200, time: -1, risk: 8, progress: 14,
        fb: 'Reasonable compromise. Solid outcome.',
        why: "The 45-day window is now industry standard. Gives the film a theatrical presence for awards without the full P&A gamble.",
        good: true
      }
    ]
  }
];

function fmtBudget(v) {
    return v >= 1000 ? '$' + (v / 1000).toFixed(1) + 'M' : '$' + v + 'K';
}

function riskLabel(r) {
    if (r <= 20) return 'Low';
    if (r <= 45) return 'Medium';
    if (r <= 70) return 'High';
    return 'Critical';
}

function riskColor(r) {
    if (r <= 20) return '#3a9c6e';
    if (r <= 45) return '#FDDC43';
    if (r <= 70) return '#EF9F27';
    return '#E24B4A';
}

function budgetColor(pct) {
    if (pct > 50) return '#3a9c6e';
    if (pct > 25) return '#FDDC43';
    return '#E24B4A';
}



let timerInterval = null;

function updateHUD() {
    const bPct = Math.max(0, Math.min(100, Math.round(simState.budget / 2000 * 100)));
    const tPct = Math.max(0, Math.min(100, Math.round(simState.time / 24 * 100)));
    const rPct = Math.max(0, Math.min(100, simState.risk));
    const pPct = Math.max(0, Math.min(100, simState.progress));

    document.getElementById('s-budget').textContent = fmtBudget(simState.budget);
    document.getElementById('s-time').textContent = Math.max(0, simState.time) + ' wks';
    document.getElementById('s-risk').textContent = riskLabel(simState.risk);
    document.getElementById('s-progress').textContent = pPct + '%';

    const bFill = document.getElementById('b-fill');
    bFill.style.width = bPct + '%';
    bFill.style.background = budgetColor(bPct);

    const tFill = document.getElementById('t-fill');
    tFill.style.width = tPct + '%';
    tFill.style.background = budgetColor(tPct);

    const rFill = document.getElementById('r-fill');
    rFill.style.width = rPct + '%';
    rFill.style.background = riskColor(simState.risk);

    document.getElementById('p-fill').style.width = pPct + '%';

    STAGES.forEach((_, i) => {
        const el = document.getElementById('pip-' + i);
        if (i < simState.stageIdx)        el.className = 'pip-stage done';
        else if (i === simState.stageIdx) el.className = 'pip-stage active';
        else                              el.className = 'pip-stage future';
    });

    document.getElementById('qcount').textContent = simState.decisionIdx + ' / ' + TOTAL_DECISIONS;

    const pt = document.getElementById('prog-track');
    if (pt) pt.style.width = Math.round(simState.decisionIdx / TOTAL_DECISIONS * 100) + '%';
}

function addLog(text) {
    const el = document.createElement('div');
    el.className = 'log-entry new';
    el.textContent = '> ' + text;
    document.getElementById('log').prepend(el);
    setTimeout(() => el.classList.remove('new'), 2000);
}

function renderScene() {
    clearInterval(timerInterval);

    if (simState.decisionIdx >= TOTAL_DECISIONS) {
        showOutcome();
        return;
    }

    const sc = SCENARIOS[simState.decisionIdx];
    simState.stageIdx = sc.stage;
    updateSimBackground(sc.stage);
    updateHUD();

    const ma = document.getElementById('sim-main');
    const isEmg = sc.emergency;
    const pct = Math.round(simState.decisionIdx / TOTAL_DECISIONS * 100);

    ma.innerHTML = `
        <div class="progress-track">
            <div class="progress-active" id="prog-track" style="width:${pct}%"></div>
        </div>
        <div class="scene-card${isEmg ? ' emergency' : ''}">
            <p class="scene-stage">${isEmg ? '// EMERGENCY — ' : '// '}${STAGES[sc.stage].toLowerCase()} — decision ${simState.decisionIdx + 1} of ${TOTAL_DECISIONS}</p>
            <h3 class="scene-title">${sc.title}</h3>
            <p class="scene-body">${sc.body}</p>
            ${isEmg && sc.timerSecs ? `
                <div class="timer-bar"><div class="timer-fill" id="tfill" style="width:100%"></div></div>
                <p class="timer-text" id="timer-txt">${sc.timerSecs}s to decide</p>
            ` : ''}
        </div>
        <div class="choices" id="choices-area"></div>
        <div id="feedback-area"></div>
    `;

    const ca = document.getElementById('choices-area');
    sc.choices.forEach((c, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `<span class="choice-label">${c.label}</span>${c.text}`;
        btn.onclick = () => choose(i);
        ca.appendChild(btn);
    });

    if (isEmg && sc.timerSecs) {
        let secs = sc.timerSecs;
        timerInterval = setInterval(() => {
            secs--;
            const tf = document.getElementById('tfill');
            const tt = document.getElementById('timer-txt');
            if (tf) tf.style.width = Math.round(secs / sc.timerSecs * 100) + '%';
            if (tt) tt.textContent = secs + 's to decide';
            if (secs <= 0) { clearInterval(timerInterval); choose(1); }
        }, 1000);
    }
}

function choose(idx) {
    clearInterval(timerInterval);

    const sc = SCENARIOS[simState.decisionIdx];
    const c = sc.choices[idx];

    simState.budget   = Math.max(0, simState.budget + c.budget);
    simState.time     = Math.max(0, simState.time + c.time);
    simState.risk     = Math.max(0, Math.min(100, simState.risk + c.risk));
    simState.progress = Math.min(100, simState.progress + c.progress);

    simState.history.push({
        scIdx:       simState.decisionIdx,
        choiceIdx:   idx,
        label:       c.label,
        title:       sc.title,
        budgetDelta: c.budget,
        riskDelta:   c.risk,
        stage:       STAGES[sc.stage]
    });

    simState.decisionIdx++;
    if (simState.decisionIdx < TOTAL_DECISIONS) {
        simState.stageIdx = SCENARIOS[simState.decisionIdx].stage;
    const STAGE_BG_CLASSES = [
    'sim-bg-development',
    'sim-bg-preproduction',
    'sim-bg-production',
    'sim-bg-postproduction',
    'sim-bg-distribution'
    ];

    function updateSimBackground(stageIdx) {
      const ma = document.getElementById('sim-main');
      if (!ma) return;
        STAGE_BG_CLASSES.forEach(cls => ma.classList.remove(cls));
      if (STAGE_BG_CLASSES[stageIdx]) {
        ma.classList.add(STAGE_BG_CLASSES[stageIdx]);
    }
}       updateSimBackground(sc.stage);
    }

    addLog('[' + STAGES[sc.stage].substring(0, 4) + '] ' + c.label);
    document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);

    updateHUD();

const ph = document.getElementById('hud-playhead');
if (ph) ph.style.left = Math.round(simState.decisionIdx / TOTAL_DECISIONS * 100) + '%';

const ma = document.getElementById('sim-main');
const content = ma.querySelector('.progress-track') ? ma : ma;

/* Fade out only the inner content, not the container */
ma.style.setProperty('--content-opacity', '0');

const inner = document.createElement('div');
inner.className = 'sim-content-wrap';
inner.style.opacity = '0';
inner.style.transition = 'opacity 0.4s ease';

setTimeout(() => {
    ma.innerHTML = `
        <div class="sim-content-wrap" style="opacity:0; transition: opacity 0.4s ease;">
            <div class="scene-loader">
                <div class="loader-block">
                    <div class="loader-scan"></div>
                    <div class="loader-lines">
                        <div class="loader-line"></div>
                        <div class="loader-line"></div>
                        <div class="loader-line"></div>
                        <div class="loader-line"></div>
                        <div class="loader-line"></div>
                    </div>
                </div>
                <p class="loader-text">processing<span class="loader-dots"></span></p>
            </div>
        </div>
    `;
    const wrap = ma.querySelector('.sim-content-wrap');
    requestAnimationFrame(() => {
        wrap.style.opacity = '1';
    });

    setTimeout(() => {
        wrap.style.opacity = '0';
        setTimeout(() => {
            renderScene();
        }, 400);
    }, 1200);
}, 400);
}

function getTopImpactDecisions() {
    if (!simState.history.length) return [];
    const scored = simState.history.map(h => {
        const score = Math.abs(h.budgetDelta) * 0.6 + Math.abs(h.riskDelta) * 8;
        return { ...h, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 2);
}

function showOutcome() {
    const bPct = Math.round(simState.budget / 2000 * 100);
    let title, sub, col, film, filmDesc, longWhy;

    if (simState.budget > 1300 && simState.risk < 40) {
        title = 'WIDE RELEASE'; col = '#FDDC43';
        sub = 'Your film opens in over 1,200 theaters and critics are calling it a revelation. Two studios have already reached out about your next project.';
        film = 'Everything Everywhere All at Once (2022)';
        filmDesc = "Made for around $14M by A24 with the Daniels directing. A disciplined limited-to-wide release strategy turned it into the most awarded film in Oscar history and a genuine cultural phenomenon.";
        longWhy = "You made disciplined decisions throughout and protected your budget. Low risk means no compounding crises, you solved problems before they spiraled. Films that hit wide release aren't always the most ambitious. They're the ones where the producer never let a single bad decision compound.";
    } else if (simState.budget > 900 && simState.risk < 60) {
        title = 'FESTIVAL CIRCUIT'; col = '#C5C1D8';
        sub = 'The film premieres at a Tier 1 festival and streaming rights sell within the week. Not the wide release you looked for, but it got made and found its audience.';
        film = 'Moonlight (2016)';
        filmDesc = 'Produced for $1.5M under constant budget pressure, Barry Jenkins and producer Adele Romanski kept every decision tight. It premiered at Telluride, sold to A24 for a careful limited release, and won Best Picture.';
        longWhy = "You made mostly solid decisions but absorbed a few costly hits along the way. Risk crept up through compounding choices rather than one catastrophic call. The story was strong enough to survive the turbulence, but by distribution the numbers did not support a wide push.";
    } else if (simState.budget > 400) {
        title = 'LIMITED RELEASE'; col = '#8884A8';
        sub = 'The film plays in around 40 cities and finds a small but devoted audience. You learned more making this than any amount of planning could have taught you.';
        film = 'Beasts of the Southern Wild (2012)';
        filmDesc = 'Shot for under $2M in genuinely brutal conditions with a non-professional cast, producer Dan Janvey held the production together through constant logistical crises. It earned an Oscar nomination and became a cult classic precisely because of the constraints it refused to be defeated by.';
        longWhy = "Your production survived but was significantly drained at some point along the way, likely by at least one decision that compounded badly when you could least afford it. Limited release is not failure. Most independent films never get this far. But the path here usually involved a ghost rewrite, waiting out the no-show, or going fully theatrical with a budget that could not support it.";
    } else {
        title = 'SHELVED'; col = '#E24B4A';
        sub = "The film never reaches release. Budget overruns and distribution problems pulled it under before it could find an audience. The question now is what you do next.";
        film = 'The Man Who Killed Don Quixote (2000–2018)';
        filmDesc = "Terry Gilliam's passion project collapsed on day two of principal photography due to a flash flood, a lead actor's injury, and military jets ruining the location sound. Legal battles and budget crises kept it in limbo for 18 years. It finally released in 2018, not the film anyone intended to make.";
        longWhy = "You ran out of money before the film could reach an audience. This almost always comes from a cluster of expensive early mistakes that compounded without a recovery window between them. Each individual decision might have been survivable on its own. Together they were not.";
    }

    const topTwo = getTopImpactDecisions();
    let impactHTML = '';
    if (topTwo.length) {
        impactHTML = `<hr class="outcome-divider"><p class="outcome-section-label">// decisions that tipped the scales</p>`;
        topTwo.forEach((d, i) => {
            const bStr = d.budgetDelta >= 0 ? '+' + fmtBudget(d.budgetDelta) : fmtBudget(d.budgetDelta);
            const rStr = d.riskDelta >= 0 ? 'risk +' + d.riskDelta : 'risk ' + d.riskDelta;
            const isHeavy = d.budgetDelta <= -100 || d.riskDelta >= 20 || d.budgetDelta >= 500;
            const accent = isHeavy ? '#E24B4A' : '#3a9c6e';
            const dColor = d.budgetDelta < 0 ? '#E24B4A' : '#3a9c6e';
            const sc = SCENARIOS[d.scIdx];
            impactHTML += `
                <div class="impact-item" style="border-left: 2px solid ${accent}">
                    <div class="impact-header">
                        <span class="impact-meta">#${i + 1} highest impact — ${d.stage}</span>
                        <span class="impact-delta" style="color:${dColor}">${bStr} / ${rStr}</span>
                    </div>
                    <p class="impact-title">${d.title} — "${d.label}"</p>
                    <p class="impact-why">${sc.choices[d.choiceIdx].why}</p>
                </div>
            `;
        });
    }

    const pPct = Math.max(0, Math.min(100, simState.progress));

    document.getElementById('sim-main').innerHTML = `
        <div class="outcome-card">
            <p class="outcome-label">// FINAL CUT — ${TOTAL_DECISIONS} decisions made</p>
            <h2 class="outcome-title" style="color:${col}">${title}</h2>
            <p class="outcome-sub">${sub}</p>
            <div class="outcome-stats">
                <div class="ostat">
                    <p class="ostat-val" style="color:${budgetColor(bPct)}">${fmtBudget(simState.budget)}</p>
                    <p class="ostat-label">budget</p>
                </div>
                <div class="ostat">
                    <p class="ostat-val" style="color:${simState.time > 12 ? '#3a9c6e' : simState.time > 5 ? '#FDDC43' : '#E24B4A'}">${simState.time}wks</p>
                    <p class="ostat-label">time</p>
                </div>
                <div class="ostat">
                    <p class="ostat-val" style="color:${riskColor(simState.risk)}">${riskLabel(simState.risk)}</p>
                    <p class="ostat-label">risk</p>
                </div>
                <div class="ostat">
                    <p class="ostat-val" style="color:#FDDC43">${pPct}%</p>
                    <p class="ostat-label">progress</p>
                </div>
            </div>
            ${impactHTML}
            <hr class="outcome-divider">
            <p class="outcome-section-label">// what this outcome means</p>
            <p class="outcome-body">${longWhy}</p>
            <hr class="outcome-divider">
            <p class="outcome-section-label">// real-world parallel</p>
            <p class="outcome-film-title">${film}</p>
            <p class="outcome-film-desc">${filmDesc}</p>
            <div class="outcome-buttons">
                <button class="ticket-btn ticket-btn-primary" onclick="restart()">
                    <span class="ticket-label">PRODUCE AGAIN</span>
                    <span class="ticket-arrow">→</span>
                </button>
                <button class="ticket-btn ticket-btn-ghost" onclick="showScreen('results')">
                    <span class="ticket-label">SEE ALL OUTCOMES</span>
                    <span class="ticket-arrow">→</span>
                </button>
            </div>
        </div>
    `;

    simState.stageIdx = 4;
    updateHUD();
    document.getElementById('sim-main').scrollTop = 0;
}

function restart() {
    clearInterval(timerInterval);
    simState = {
        budget: 2000, time: 24, risk: 10,
        progress: 0, stageIdx: 0, decisionIdx: 0, history: []
    };
    document.getElementById('log').innerHTML = '';
    renderScene();
}



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

              if (el.closest('.stage-desc')) {
                tip.style.background = '#0d1148';
                tip.style.color = '#C3D4E6';
                tip.style.border = '1px solid rgba(253, 220, 67, 0.3)';
            } else {
                tip.style.background = '#FDDC43';
                tip.style.color = '#060934';
                tip.style.border = 'none';
            }
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
    // Scroll to top when showing a new screen
    window.scrollTo(0, 0);
    // Update nav button active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('href') === '#' + screenId) {
            btn.classList.add('active');
        }
    });
}

function handleNavClick(event) {
  const source = event.currentTarget || event.target;
  const href = source.getAttribute && source.getAttribute('href');
  if (href && href.startsWith('#')) {
    const screenId = href.substring(1);
    window.location.hash = href;
    showScreen(screenId);
    if (screenId === 'simulate' && simState.decisionIdx === 0) {
      renderScene();
    }
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
    if (hash === 'simulate' && simState.decisionIdx === 0) {
        renderScene();
    }
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


/* ── HUD TIMECODE + FRAME COUNTER ─────────── */
(function initHUD() {
    let hudInterval = null;
    let frames = 0;
    let seconds = 0;
    let minutes = 0;

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function resetTimecode() {
        frames = 0;
        seconds = 0;
        minutes = 0;
        const tc = document.getElementById('hud-timecode');
        const fr = document.getElementById('hud-frame');
        if (tc) tc.textContent = '00:00:00:00';
        if (fr) fr.textContent = 'FRAME 01';
    }

    function startTimecode() {
        clearInterval(hudInterval);
        resetTimecode();
        hudInterval = setInterval(() => {
            frames++;
            if (frames >= 24) { frames = 0; seconds++; }
            if (seconds >= 60) { seconds = 0; minutes++; }

            const tc = document.getElementById('hud-timecode');
            const fr = document.getElementById('hud-frame');
            const totalFrames = (minutes * 60 * 24) + (seconds * 24) + frames;
            if (tc) tc.textContent = `${pad(0)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
            if (fr) fr.textContent = `FRAME ${String(totalFrames + 1).padStart(4, '0')}`;
        }, 1000 / 24);
    }

    function stopTimecode() {
        clearInterval(hudInterval);
    }

    function updatePlayhead() {
        const playhead = document.getElementById('hud-playhead');
        if (!playhead) return;
        const pct = Math.round(simState.decisionIdx / TOTAL_DECISIONS * 100);
        playhead.style.left = pct + '%';
    }

    /* Hook into screen navigation to start/stop/reset */
    const originalShowScreen = showScreen;
    window.showScreen = function(screenId) {
        originalShowScreen(screenId);
        if (screenId === 'simulate') {
            startTimecode();
            updatePlayhead();
        } else {
            stopTimecode();
        }
    };

    /* Also reset when restart() is called */
    const originalRestart = restart;
    window.restart = function() {
        originalRestart();
        resetTimecode();
        startTimecode();
        updatePlayhead();
    };

    window.updateHUDPlayhead = updatePlayhead;
})();
