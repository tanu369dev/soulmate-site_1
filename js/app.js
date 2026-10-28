/* =========================================================
   KISMET — app logic (plain JavaScript, no build step)
   Sections:
   1. Helpers & icons      2. Data           3. Portrait art
   4. Landing page         5. App shell      6. Discover (swipe)
   7. Likes                8. Chats          9. Play
   10. Profile             11. Overlays      12. Effects
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. HELPERS & ICONS ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('kismet.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('kismet.' + k, JSON.stringify(v)); } catch (e) {} }
  };

  var ICONS = {
    heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z',
    x: 'M18 6 6 18M6 6l12 12',
    star: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z',
    undo: 'M1 4v6h6M3.5 15a9 9 0 1 0 2.1-9.4L1 10',
    bolt: 'M13 2 3 14h9l-1 8 10-12h-9z',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
    chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    filter: 'M22 3H2l8 9.5V19l4 2v-8.5z',
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
    moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
    lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
    check: 'M20 6 9 17l-5-5',
    flame: 'M12 2s6 4.5 6 10a6 6 0 0 1-12 0c0-2.2 1-3.6 2-4.6 0 2 1 3 2 3 0-3-1-5 2-8.4z',
    send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
    info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01',
    pin: 'M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    video: 'M23 7l-7 5 7 5zM1 5h15v14H1z',
    mic: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4',
    calendar: 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
    dice: 'M3 3h18v18H3zM8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01',
    back: 'M15 18l-6-6 6-6',
    flag: 'M4 22V4M4 4h14l-2 4 2 4H4',
    eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    gift: 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
    globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z',
    music: 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8'
  };
  function icon(n) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS[n] + '"/></svg>'; }
  function fillIcons(root) { $$('[data-i]', root).forEach(function (el) { if (!el.firstChild) el.innerHTML = icon(el.dataset.i); }); }

  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.id);
    toast.id = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- 2. DATA (demo content: replace with your database later) ---------- */
  var ALL_TAGS = ['Travel', 'Coffee', 'Hiking', 'Film', 'Music', 'Cooking', 'Yoga', 'Gaming', 'Books', 'Dogs', 'Art', 'Gym', 'Photography', 'Dancing', 'Startups', 'Cricket', 'Foodie', 'Poetry'];
  var INTENTS = ['Relationship', 'Something casual', 'New friends', 'Not sure yet'];

  // h = base colour (hue) for the generated portrait, likes = already likes you (so a swipe right makes a match)
  var PEOPLE = [
    { id: 1, n: 'Aanya', a: 26, city: 'Mumbai', km: 3, job: 'UX designer', h: 340, v: true, likes: true, intent: 'Relationship', tags: ['Art', 'Coffee', 'Film', 'Travel'], bio: 'I redesign apps by day and judge cafes by night.', q: 'A perfect Sunday is', ans: 'Filter coffee, a long walk and no alarms.', song: 'Raataan Lambiyan' },
    { id: 2, n: 'Kabir', a: 29, city: 'Delhi', km: 6, job: 'Chef', h: 22, v: true, likes: false, intent: 'Relationship', tags: ['Cooking', 'Foodie', 'Music', 'Dogs'], bio: 'I will cook you dinner if you bring the playlist.', q: 'The way to win me over is', ans: 'Say yes to street food at midnight.', song: 'Kun Faya Kun' },
    { id: 3, n: 'Meera', a: 27, city: 'Bengaluru', km: 9, job: 'Doctor', h: 160, v: true, likes: true, intent: 'Relationship', tags: ['Yoga', 'Books', 'Hiking', 'Coffee'], bio: 'Night shifts, early trails. Looking for someone calm.', q: 'I am weirdly good at', ans: 'Finding the best chai in any city.', song: 'Ilahi' },
    { id: 4, n: 'Rohan', a: 30, city: 'Pune', km: 12, job: 'Startup founder', h: 250, v: false, likes: false, intent: 'Something casual', tags: ['Startups', 'Gym', 'Gaming', 'Travel'], bio: 'Building things, breaking records on weekends.', q: 'Two truths and a lie', ans: 'I ran a marathon, I cannot swim, I met Rahman.', song: 'Zinda' },
    { id: 5, n: 'Zoya', a: 25, city: 'Hyderabad', km: 5, job: 'Photographer', h: 300, v: true, likes: true, intent: 'New friends', tags: ['Photography', 'Travel', 'Dancing', 'Foodie'], bio: 'I will take your picture, you carry the tripod.', q: 'My simple pleasure is', ans: 'Golden hour on a rooftop.', song: 'Tum Hi Ho' },
    { id: 6, n: 'Dev', a: 28, city: 'Mumbai', km: 8, job: 'Musician', h: 200, v: true, likes: false, intent: 'Relationship', tags: ['Music', 'Poetry', 'Coffee', 'Film'], bio: 'Guitar player. Will write you a terrible, sweet song.', q: 'We will get along if', ans: 'You sing in the car without shame.', song: 'Agar Tum Saath Ho' },
    { id: 7, n: 'Naina', a: 24, city: 'Jaipur', km: 14, job: 'Architect', h: 12, v: false, likes: false, intent: 'Not sure yet', tags: ['Art', 'Books', 'Travel', 'Dogs'], bio: 'I like old buildings and new people.', q: 'I geek out on', ans: 'Stepwells, and why nobody builds them anymore.', song: 'Kabira' },
    { id: 8, n: 'Arjun', a: 31, city: 'Bengaluru', km: 4, job: 'Data scientist', h: 130, v: true, likes: true, intent: 'Relationship', tags: ['Cricket', 'Hiking', 'Cooking', 'Books'], bio: 'I use spreadsheets for everything, including trip plans.', q: 'My most controversial opinion', ans: 'Pineapple on pizza is correct.', song: 'Khairiyat' },
    { id: 9, n: 'Sana', a: 27, city: 'Delhi', km: 7, job: 'Journalist', h: 280, v: true, likes: false, intent: 'Relationship', tags: ['Books', 'Poetry', 'Coffee', 'Yoga'], bio: 'I ask a lot of questions. You will like it.', q: 'The last thing I learned', ans: 'How to make sourdough. It failed twice.', song: 'Tera Ban Jaunga' },
    { id: 10, n: 'Vihaan', a: 28, city: 'Chennai', km: 11, job: 'Pilot', h: 185, v: true, likes: false, intent: 'Something casual', tags: ['Travel', 'Gym', 'Foodie', 'Photography'], bio: 'Home is wherever the layover is good.', q: 'Take me anywhere and I will', ans: 'Try the local dish, no questions.', song: 'Safarnama' },
    { id: 11, n: 'Tara', a: 26, city: 'Goa', km: 16, job: 'Surf coach', h: 45, v: false, likes: true, intent: 'New friends', tags: ['Hiking', 'Dogs', 'Music', 'Dancing'], bio: 'Salt in my hair, sand in everything else.', q: 'You should message me if', ans: 'You have a good dog name ready.', song: 'Ik Vaari Aa' },
    { id: 12, n: 'Ishaan', a: 29, city: 'Kolkata', km: 10, job: 'Film editor', h: 320, v: true, likes: false, intent: 'Relationship', tags: ['Film', 'Poetry', 'Foodie', 'Cricket'], bio: 'I cut films for a living and arguments short at home.', q: 'My love language is', ans: 'Sending you the song that reminded me of you.', song: 'Tum Se Hi' }
  ];
  function byId(id) { return PEOPLE.filter(function (p) { return p.id === id; })[0]; }

  var ICEBREAKERS = [
    'What is a small thing that always makes your day better?', 'Which song would be playing in your movie?', 'Best meal you have ever had, and where?',
    'What is the most spontaneous thing you have done?', 'Which fictional place would you move to?', 'What is your go-to karaoke song?',
    'Describe your perfect lazy Sunday in three words.', 'What is a hill you will happily die on?', 'Which city feels like home even though it is not?',
    'What did you want to be when you were ten?', 'What is your most useless talent?', 'If we met for chai, what would we talk about for hours?'
  ];
  var WYR = [
    ['Beach holiday', 'Mountain trek'], ['Cook together', 'Order in and chill'], ['Text all day', 'One long call at night'],
    ['Movie night at home', 'Live concert'], ['Early morning walk', 'Late night drive'], ['Plan every detail', 'Go with the flow']
  ];
  var QUIZ = [
    { q: 'It is Friday night. Your plan?', a: [['Dinner with friends', 'S'], ['A film at home', 'C'], ['A spontaneous road trip', 'A'], ['A quiet walk and a talk', 'D']] },
    { q: 'How do you show you care?', a: [['Plan a surprise', 'A'], ['Remember small details', 'D'], ['Make them laugh', 'S'], ['Cook or bring food', 'C']] },
    { q: 'Pick a holiday.', a: [['Backpacking somewhere new', 'A'], ['A cosy cabin', 'C'], ['A city full of music', 'S'], ['Museums and long lunches', 'D']] },
    { q: 'A disagreement starts. You…', a: [['Talk it out right away', 'D'], ['Take a walk, then talk', 'C'], ['Lighten it with a joke', 'S'], ['Suggest we try something new', 'A']] },
    { q: 'Your ideal first date?', a: [['Coffee and bookshop', 'D'], ['Street food crawl', 'S'], ['Sunset hike', 'A'], ['Cook dinner together', 'C']] }
  ];
  var ARCHETYPES = {
    S: ['The Social Spark', 'You light up a room and make dates feel easy. You match best with people who love to laugh.'],
    C: ['The Cosy Romantic', 'You like warm, steady moments. You match best with people who value comfort and kindness.'],
    A: ['The Adventurer', 'You say yes to new things. You match best with people who are curious and spontaneous.'],
    D: ['The Deep Thinker', 'You want real conversation. You match best with people who listen and remember.']
  };
  var DATE_VIBES = ['Cosy', 'Adventurous', 'Foodie', 'Artsy', 'Sporty', 'Late night'];
  var DATE_PLACES = ['a rooftop café', 'a bookshop and chai', 'a sunrise trail', 'a night market', 'an open-mic evening', 'a pottery class', 'a seaside walk', 'a board game bar'];
  var DATE_TWISTS = ['No phones for an hour', 'Each pick one song', 'Swap a favourite book', 'Try something neither has eaten', 'Take one photo together', 'Ask only questions for 10 minutes'];
  var REPLIES = {
    greet: ['Hey you. Glad we matched.', 'Hi. I was hoping you would say something first.'],
    date: ['Yes, I would like that. Saturday evening?', 'Okay, you have my attention. Where were you thinking?'],
    q: ['Good question. Give me a second… I think I would say something that makes me laugh.', 'Ha, you are making me think. Let me ask you the same.'],
    thanks: ['Of course. That made me smile.'],
    any: ['Tell me more about that.', 'That is lovely. What got you into it?', 'I like how you think. Your turn to ask me something.', 'Ha. Same. We should compare notes over coffee.', 'Okay, now I am curious.']
  };
  var FEATURES = [
    ['flame', 'Swipe deck', 'Drag cards left, right or up with smooth physics. Keyboard shortcuts too.', 1],
    ['star', 'Super like', 'Stand out. They see you first and get a blue spotlight.'],
    ['undo', 'Rewind', 'Swiped the wrong way? Bring the last card back.'],
    ['bolt', 'Boost', 'Be one of the top profiles nearby for 30 minutes.'],
    ['dice', 'Flip-card icebreakers', 'Draw a question card and send it as your first message.', 1],
    ['heart', 'Compatibility score', 'See why you match, with shared interests highlighted.'],
    ['shield', 'Verified badge', 'A quick selfie check puts a blue tick on real people.'],
    ['filter', 'Smart filters', 'Age, distance, what they want, verified only.'],
    ['chat', 'Live chat', 'Typing indicators, reactions and one-tap icebreaker prompts.'],
    ['mic', 'Voice prompts', 'Answer a prompt in your own voice so your personality comes through.'],
    ['video', 'Video dates', 'Meet on a call first, safely, before you meet in person.'],
    ['calendar', 'Date planner', 'Spin for a vibe, place and twist, then send the plan.', 1],
    ['gift', 'Daily picks', 'Five handpicked profiles every day.'],
    ['eye', 'Incognito mode', 'Only people you like can see your profile.'],
    ['pin', 'Passport', 'Change your location before a trip and meet people there.'],
    ['music', 'Anthem', 'Pin the song that describes you to your profile.'],
    ['users', 'Friends mode', 'Looking for friends, not dates? Switch the intent.'],
    ['lock', 'Likes you', 'See who already likes you with Gold.'],
    ['flag', 'Report and block', 'Remove anyone in two taps. We review every report.'],
    ['sun', 'Light and dark', 'A theme for every time of day.']
  ];
  var SAFETY = [
    ['shield', 'Photo verification', 'Members take a live selfie to earn the blue tick.'],
    ['flag', 'Report and block', 'Two taps from any profile or chat.'],
    ['pin', 'Share my date', 'Send the place and time to a friend you trust.'],
    ['eye', 'Control your visibility', 'Hide your distance, go incognito, or pause your account.']
  ];
  var PLANS = [
    { n: 'Free', p: '₹0', per: '', f: ['Daily swipes', 'Chat with matches', 'Flip cards and games', 'Basic filters'] },
    { n: 'Gold', p: '₹499', per: '/month', hot: 1, f: ['See who likes you', 'Unlimited swipes and rewind', 'One free boost every month', '5 super likes a week', 'Advanced filters', 'Incognito mode'] },
    { n: 'Platinum', p: '₹999', per: '/month', f: ['Everything in Gold', 'Message before matching', 'Priority likes', 'Passport to any city', 'Weekly boost'] }
  ];

  /* ---------- 3. PORTRAIT ART (generated SVG so the site works with no photos) ----------
     To use real photos later, put images in /images and replace art() with an <img>. */
  var artN = 0;
  function art(p, i) {
    i = i || 0; artN++;
    var h1 = (p.h + i * 38) % 360, h2 = (p.h + 55 + i * 38) % 360, id = 'g' + artN;
    var cx = [150, 120, 185][i % 3];
    return '<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Portrait of ' + esc(p.n) + '">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(' + h1 + ' 85% 62%)"/><stop offset="1" stop-color="hsl(' + h2 + ' 75% 32%)"/></linearGradient></defs>' +
      '<rect width="300" height="400" fill="url(#' + id + ')"/>' +
      '<circle cx="' + (60 + i * 80) + '" cy="' + (80 + i * 30) + '" r="90" fill="hsl(' + h2 + ' 90% 75% / .28)"/>' +
      '<circle cx="' + (250 - i * 60) + '" cy="300" r="120" fill="hsl(' + h1 + ' 90% 70% / .22)"/>' +
      '<text x="' + cx + '" y="270" text-anchor="middle" font-family="Bricolage Grotesque,sans-serif" font-weight="800" font-size="300" fill="hsl(' + h1 + ' 100% 90% / .13)">' + esc(p.n[0]) + '</text>' +
      '<circle cx="' + cx + '" cy="165" r="50" fill="hsl(' + h2 + ' 40% 14% / .62)"/>' +
      '<path d="M' + (cx - 100) + ' 400C' + (cx - 100) + ' 290 ' + (cx - 50) + ' 238 ' + cx + ' 238S' + (cx + 100) + ' 290 ' + (cx + 100) + ' 400z" fill="hsl(' + h2 + ' 40% 14% / .62)"/></svg>';
  }
  var BADGE = '<span class="vbadge" title="Verified"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></span>';

  /* ---------- STATE ---------- */
  var state = {
    me: store.get('me', { name: 'You', age: 26, city: 'Mumbai', job: 'Creative', bio: 'Coffee, long walks and good conversation.', intent: 'Relationship', tags: ['Coffee', 'Travel', 'Music', 'Film'], verified: false }),
    settings: store.get('settings', { distance: true, incognito: false, readReceipts: true, notifs: true }),
    gold: store.get('gold', false),
    seen: store.get('seen', []),
    chats: store.get('chats', null),
    unread: store.get('unread', {}),
    filters: store.get('filters', { min: 18, max: 40, km: 25, intent: 'Any', verified: false }),
    queue: [], history: [], boostUntil: 0, view: 'discover', activeChat: null
  };
  if (!state.chats) {
    state.chats = {
      3: [{ f: 'them', t: 'Hey! Saw you also like trails. Which one is your favourite?' }],
      8: [{ f: 'them', t: 'Okay, serious question: pineapple on pizza. Yes or no?' }, { f: 'me', t: 'Absolutely yes.' }, { f: 'them', t: 'I knew I liked you.' }]
    };
    store.set('chats', state.chats);
  }
  function saveChats() { store.set('chats', state.chats); store.set('unread', state.unread); }

  function compat(p) {
    var shared = p.tags.filter(function (t) { return state.me.tags.indexOf(t) > -1; }).length;
    return Math.min(98, 58 + shared * 10 + (p.id * 7) % 17);
  }

  /* ---------- 4. LANDING PAGE ---------- */
  function buildLanding() {
    // headline word-by-word reveal
    var h = $('#heroTitle'), words = h.textContent.split(' ');
    h.innerHTML = words.map(function (w, i) {
      var hl = (w.toLowerCase().indexOf('first') === 0 || w.toLowerCase().indexOf('message') === 0) ? ' hl' : '';
      return '<span class="w' + hl + '" style="animation-delay:' + (0.08 * i + 0.1) + 's">' + esc(w) + '</span>';
    }).join(' ');

    var fc = [['#fc1', PEOPLE[2], 1], ['#fc2', PEOPLE[5], 2], ['#fc3', PEOPLE[0], 0]];
    fc.forEach(function (x) {
      $(x[0]).innerHTML = art(x[1], x[2]) + '<div class="cap">' + esc(x[1].n) + ', ' + x[1].a + '<small>' + esc(x[1].job) + ' · ' + esc(x[1].city) + '</small></div>';
    });
    $('#fc1').style.setProperty('--r', '-9deg'); $('#fc2').style.setProperty('--r', '8deg'); $('#fc3').style.setProperty('--r', '-2deg');

    var tags = ALL_TAGS.concat(ALL_TAGS);
    $('#marquee').innerHTML = tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');

    $('#featureGrid').innerHTML = FEATURES.map(function (f) {
      return '<article class="feat reveal' + (f[3] ? ' wide' : '') + '"><div class="ic">' + icon(f[0]) + '</div><h3>' + f[1] + '</h3><p>' + f[2] + '</p></article>';
    }).join('');

    var steps = [['Create a profile', 'Add photos, pick interests and answer a prompt. Verify with a selfie to earn the blue tick.'], ['Swipe and match', 'Like someone and if they like you back, you match. We show you why you are compatible.'], ['Break the ice and meet', 'Send a flip card, plan a date with the spinner, and share your plan with a friend.']];
    $('#steps').innerHTML = steps.map(function (s) { return '<li class="reveal"><h3>' + s[0] + '</h3><p>' + s[1] + '</p></li>'; }).join('');

    $('#safetyGrid').innerHTML = SAFETY.map(function (s) { return '<article class="feat reveal"><div class="ic">' + icon(s[0]) + '</div><h3>' + s[1] + '</h3><p>' + s[2] + '</p></article>'; }).join('');

    $('#plans').innerHTML = PLANS.map(function (p) {
      return '<article class="plan reveal' + (p.hot ? ' hot' : '') + '">' + (p.hot ? '<span class="tag">Most popular</span>' : '') + '<h3>' + p.n + '</h3><div class="price">' + p.p + '<small>' + p.per + '</small></div><ul>' +
        p.f.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><button class="btn ' + (p.hot ? 'btn-grad' : 'btn-ghost') + '" data-plan="' + p.n + '">' + (p.n === 'Free' ? 'Start free' : 'Try ' + p.n) + '</button></article>';
    }).join('');

    var lf = $('#landFlip'), lq = $('#landQ');
    lq.textContent = pick(ICEBREAKERS);
    lf.addEventListener('click', function () {
      if (lf.classList.contains('flipped')) { lf.classList.remove('flipped'); setTimeout(function () { lq.textContent = pick(ICEBREAKERS); }, 400); }
      else lf.classList.add('flipped');
    });

    // counters
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        if (e.target.dataset.count) countUp(e.target);
        e.target.classList.add('in');
      });
    }, { threshold: .15 });
    $$('[data-count], .reveal').forEach(function (el) { io.observe(el); });
    // safety net: never leave content hidden
    setTimeout(function () { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }, 4000);

    $$('[data-plan]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.plan !== 'Free') { state.gold = true; store.set('gold', true); toast(b.dataset.plan + ' unlocked for this demo'); }
        openApp('discover');
      });
    });
  }
  function fmt(n, k) { return k === 'm' ? (n / 1e6).toFixed(1) + 'M' : Math.round(n / 1000) + 'K'; }
  function countUp(el) {
    var end = +el.dataset.count, k = el.dataset.fmt;
    if (reduceMotion) { el.textContent = fmt(end, k); return; }
    var t0 = performance.now();
    (function tick(t) {
      var p = Math.min(1, (t - t0) / 1600), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(end * e, k);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ---------- 5. APP SHELL ---------- */
  function openApp(view) {
    document.body.classList.add('in-app');
    $('#app').hidden = false;
    window.scrollTo(0, 0);
    setView(typeof view === 'string' ? view : state.view);
    if (!store.get('welcomed', false)) { store.set('welcomed', true); toast('Welcome to Kismet. Swipe right on someone you like.'); }
  }
  function closeApp() {
    document.body.classList.remove('in-app');
    $('#app').hidden = true;
    window.scrollTo(0, 0);
  }
  function setView(v) {
    state.view = v;
    $$('.view').forEach(function (el) { el.hidden = el.id !== 'v-' + v; });
    $$('[data-view]').forEach(function (b) { b.classList.toggle('on', b.dataset.view === v); });
    if (v === 'discover') renderDeck();
    if (v === 'likes') renderLikes();
    if (v === 'chats') renderChats();
    if (v === 'play') renderPlay();
    if (v === 'profile') renderProfile();
    updateBadges();
  }
  function updateBadges() {
    var n = Object.keys(state.unread).filter(function (k) { return state.unread[k]; }).length;
    var b = $('#chatBadge'); b.hidden = !n; b.textContent = n;
    var likesLeft = PEOPLE.filter(function (p) { return p.likes && state.seen.indexOf(p.id) < 0 && !state.chats[p.id]; }).length;
    $('#likesBadge').hidden = !likesLeft; $('#likesBadge').textContent = likesLeft;
  }
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t); store.set('theme', t);
    $('#themeBtn').innerHTML = icon(t === 'dark' ? 'sun' : 'moon');
  }

  /* ---------- 6. DISCOVER (swipe deck) ---------- */
  function buildQueue() {
    var f = state.filters;
    state.queue = PEOPLE.filter(function (p) {
      return state.seen.indexOf(p.id) < 0 && p.a >= f.min && p.a <= f.max && p.km <= f.km &&
        (f.intent === 'Any' || p.intent === f.intent) && (!f.verified || p.v);
    });
    // boosted profile appears for others, so show the best matches first when boosted
    state.queue.sort(function (a, b) { return compat(b) - compat(a); });
  }
  function cardHTML(p, depth) {
    return '<article class="pcard' + (depth === 1 ? ' back1' : depth === 2 ? ' back2' : '') + '" data-id="' + p.id + '" data-photo="0">' +
      '<div class="ph">' + art(p, 0) + '</div>' +
      '<div class="bars"><i class="on"></i><i></i><i></i></div>' +
      '<div class="match-pct">' + compat(p) + '% match</div>' +
      '<div class="stamp like">LIKE</div><div class="stamp nope">NOPE</div><div class="stamp sup">SUPER</div>' +
      '<div class="shade"></div>' +
      '<div class="pinfo"><h3>' + esc(p.n) + ' <span>' + p.a + '</span>' + (p.v ? BADGE : '') + '</h3>' +
      '<div class="meta"><span>' + icon('pin') + (state.settings.distance ? p.km + ' km away' : esc(p.city)) + '</span><span>' + esc(p.job) + '</span></div>' +
      '<div class="tags">' + p.tags.slice(0, 3).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div></div></article>';
  }
  function renderDeck() {
    buildQueue();
    var deck = $('#deck'), q = state.queue;
    $('#deckEmpty').hidden = q.length > 0;
    $('#actions').style.visibility = q.length ? 'visible' : 'hidden';
    deck.innerHTML = q.slice(0, 3).map(function (p, i) { return cardHTML(p, i); }).reverse().join('');
    $('#discSub').textContent = q.length + ' people near you';
    bindTop(); renderInsight(); updateBadges();
  }
  function topCard() { var c = $$('.pcard', $('#deck')); return c[c.length - 1]; }
  function bindTop() {
    var el = topCard(); if (!el) return;
    var p = byId(+el.dataset.id), sx = 0, sy = 0, dx = 0, dy = 0, drag = false, moved = false;
    var like = $('.stamp.like', el), nope = $('.stamp.nope', el), sup = $('.stamp.sup', el);
    el.addEventListener('pointerdown', function (e) {
      drag = true; moved = false; sx = e.clientX; sy = e.clientY; dx = dy = 0;
      el.setPointerCapture(e.pointerId); el.style.transition = 'none';
    });
    el.addEventListener('pointermove', function (e) {
      if (!drag) return;
      dx = e.clientX - sx; dy = e.clientY - sy;
      if (Math.abs(dx) + Math.abs(dy) > 8) moved = true;
      el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + dx / 18 + 'deg)';
      like.style.opacity = Math.min(1, Math.max(0, dx / 90));
      nope.style.opacity = Math.min(1, Math.max(0, -dx / 90));
      sup.style.opacity = Math.min(1, Math.max(0, (-dy - 40) / 80));
    });
    function end(e) {
      if (!drag) return; drag = false; el.style.transition = '';
      if (dx > 110) return swipe('like');
      if (dx < -110) return swipe('nope');
      if (dy < -120) return swipe('super');
      el.style.transform = ''; like.style.opacity = nope.style.opacity = sup.style.opacity = 0;
      if (!moved && e && e.type === 'pointerup') {
        var r = el.getBoundingClientRect(), left = (e.clientX - r.left) < r.width / 2;
        cyclePhoto(el, p, left ? -1 : 1);
      }
    }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  }
  function cyclePhoto(el, p, dir) {
    var n = (+el.dataset.photo + dir + 3) % 3;
    el.dataset.photo = n;
    $('.ph', el).innerHTML = art(p, n);
    $$('.bars i', el).forEach(function (b, i) { b.classList.toggle('on', i === n); });
  }
  function swipe(kind) {
    var el = topCard(); if (!el || el.dataset.busy) return;
    var p = byId(+el.dataset.id); el.dataset.busy = 1;
    if (kind === 'super' && !state.gold && (store.get('supers', 0) >= 1)) { toast('You used your free super like today. Gold gives you 5 a week.'); delete el.dataset.busy; el.style.transform = ''; $$('.stamp', el).forEach(function (s) { s.style.opacity = 0; }); return; }
    if (kind === 'super') store.set('supers', store.get('supers', 0) + 1);
    var x = kind === 'like' ? 700 : kind === 'nope' ? -700 : 0, y = kind === 'super' ? -800 : 60, r = kind === 'like' ? 24 : kind === 'nope' ? -24 : 0;
    el.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + r + 'deg)'; el.style.opacity = 0;
    state.history.push(p.id); state.seen.push(p.id); store.set('seen', state.seen);
    var matched = (kind === 'like' && p.likes) || kind === 'super';
    setTimeout(function () {
      renderDeck();
      if (matched) makeMatch(p, kind === 'super');
      else if (kind === 'like') toast('You liked ' + p.n);
    }, reduceMotion ? 0 : 320);
  }
  function rewind() {
    if (!state.history.length) return toast('Nothing to rewind yet');
    if (!state.gold && store.get('rewinds', 0) >= 2) return toast('Free rewinds used up. Try Gold for unlimited.');
    store.set('rewinds', store.get('rewinds', 0) + 1);
    var id = state.history.pop();
    state.seen = state.seen.filter(function (s) { return s !== id; }); store.set('seen', state.seen);
    renderDeck(); toast('Brought ' + byId(id).n + ' back');
  }
  function renderInsight() {
    var box = $('#insight'), el = topCard();
    if (!el) { box.innerHTML = ''; return; }
    var p = byId(+el.dataset.id), pct = compat(p);
    box.innerHTML =
      '<div class="panel"><h4>Why you might match</h4><div class="insight-top"><div class="ring" style="--p:' + pct + '"><b>' + pct + '</b></div><p>Based on shared interests, what you are looking for and how far apart you are.</p></div></div>' +
      '<div class="panel"><h4>Interests</h4><div class="pills">' + p.tags.map(function (t) { return '<span class="' + (state.me.tags.indexOf(t) > -1 ? 'shared' : '') + '">' + esc(t) + '</span>'; }).join('') + '</div><p class="fine">Green means you share it.</p></div>' +
      '<div class="panel"><div class="prompt"><small>' + esc(p.q) + '</small><p>' + esc(p.ans) + '</p></div></div>' +
      '<div class="panel"><h4>Anthem</h4><p>' + icon('music').replace('class="i"', 'class="i" style="vertical-align:-5px;margin-right:6px"') + esc(p.song) + '</p></div>';
  }
  function updateBoost() {
    var b = $('#boostBtn'), left = state.boostUntil - Date.now();
    if (left > 0) {
      var m = Math.floor(left / 60000), s = Math.floor(left % 60000 / 1000);
      $('#boostLabel').textContent = m + ':' + (s < 10 ? '0' : '') + s; b.classList.add('on');
    } else { $('#boostLabel').textContent = 'Boost'; b.classList.remove('on'); }
  }
  function openFilters() {
    var f = state.filters;
    modal('<button class="icon-btn x" data-close aria-label="Close">' + icon('x') + '</button><h3>Filters</h3><p class="sub">Choose who you see.</p>' +
      '<div class="stack"><div><label for="fMin">Youngest <span id="fMinV">' + f.min + '</span></label><input id="fMin" type="range" min="18" max="60" value="' + f.min + '"></div>' +
      '<div><label for="fMax">Oldest <span id="fMaxV">' + f.max + '</span></label><input id="fMax" type="range" min="18" max="60" value="' + f.max + '"></div>' +
      '<div><label for="fKm">Distance <span id="fKmV">' + f.km + ' km</span></label><input id="fKm" type="range" min="2" max="50" value="' + f.km + '"></div>' +
      '<div><label>Looking for</label><div class="pills" id="fIntent">' + ['Any'].concat(INTENTS).map(function (i) { return '<button type="button" class="' + (f.intent === i ? 'on' : '') + '">' + i + '</button>'; }).join('') + '</div></div>' +
      '<div class="tg"><div><b>Verified only</b><small>Show people with the blue tick</small></div><button type="button" class="sw" id="fVer" role="switch" aria-checked="' + f.verified + '" aria-label="Verified only"></button></div>' +
      '<button class="btn btn-grad" id="fApply">Show results</button></div>');
    [['fMin', 'fMinV', ''], ['fMax', 'fMaxV', ''], ['fKm', 'fKmV', ' km']].forEach(function (x) {
      $('#' + x[0]).addEventListener('input', function (e) { $('#' + x[1]).textContent = e.target.value + x[2]; });
    });
    $('#fIntent').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; $$('#fIntent button').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); });
    $('#fVer').addEventListener('click', function (e) { var s = e.currentTarget; s.setAttribute('aria-checked', s.getAttribute('aria-checked') !== 'true'); });
    $('#fApply').addEventListener('click', function () {
      var mn = +$('#fMin').value, mx = +$('#fMax').value;
      state.filters = { min: Math.min(mn, mx), max: Math.max(mn, mx), km: +$('#fKm').value, intent: $('#fIntent .on').textContent, verified: $('#fVer').getAttribute('aria-checked') === 'true' };
      store.set('filters', state.filters); closeModal(); renderDeck();
    });
  }
  function openDetails(p) {
    modal('<button class="icon-btn x" data-close aria-label="Close">' + icon('x') + '</button><div class="det-photo">' + art(p, 1) + '</div>' +
      '<h3>' + esc(p.n) + ', ' + p.a + ' ' + (p.v ? BADGE : '') + '</h3><p class="sub">' + esc(p.job) + ' · ' + esc(p.city) + ' · ' + p.km + ' km away</p>' +
      '<div class="stack"><p>' + esc(p.bio) + '</p><div class="prompt"><small>' + esc(p.q) + '</small><p>' + esc(p.ans) + '</p></div>' +
      '<div class="pills"><span>Looking for: ' + esc(p.intent) + '</span>' + p.tags.map(function (t) { return '<span class="' + (state.me.tags.indexOf(t) > -1 ? 'shared' : '') + '">' + esc(t) + '</span>'; }).join('') + '</div>' +
      '<div class="row"><button class="btn btn-ghost" id="dBlock">' + 'Report or block' + '</button><button class="btn btn-grad" id="dLike">Like ' + esc(p.n) + '</button></div></div>');
    $('#dLike').addEventListener('click', function () { closeModal(); swipe('like'); });
    $('#dBlock').addEventListener('click', function () {
      modal('<h3>Report or block ' + esc(p.n) + '</h3><p class="sub">They will not see you and you will not see them. Tell us why (optional).</p><div class="checklist">' +
        ['Fake profile or spam', 'Inappropriate photos', 'Harassment', 'Under 18', 'Other'].map(function (r) { return '<label><input type="checkbox"> ' + r + '</label>'; }).join('') + '</div><div class="row" style="margin-top:16px"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-grad" id="doBlock">Block and report</button></div>');
      $('#doBlock').addEventListener('click', function () { state.seen.push(p.id); store.set('seen', state.seen); closeModal(); renderDeck(); toast(p.n + ' has been blocked and reported'); });
    });
  }

  /* ---------- 7. LIKES ---------- */
  function miniCard(p, locked, tag) {
    return '<button class="mcard' + (locked ? ' locked' : '') + '" data-p="' + p.id + '">' + art(p, 0) +
      (tag ? '<span class="newtag">' + tag + '</span>' : '') +
      (locked ? '<span class="lockic">' + icon('lock') + '</span>' : '') +
      '<div class="cap">' + (locked ? 'Someone' : esc(p.n) + ', ' + p.a) + '<small>' + (locked ? 'Upgrade to see' : esc(p.city)) + '</small></div></button>';
  }
  function renderLikes() {
    var likers = PEOPLE.filter(function (p) { return p.likes; });
    $('#likesSub').textContent = likers.length + ' people already like you';
    $('#goldBtn').textContent = state.gold ? 'Gold is on' : 'Try Gold';
    var picks = shuffle(PEOPLE.filter(function (p) { return !p.likes; })).slice(0, 5);
    $('#picks').innerHTML = picks.map(function (p) { return miniCard(p, false, 'Pick'); }).join('');
    $('#likesGrid').innerHTML = likers.map(function (p) { return miniCard(p, !state.gold, state.gold ? 'Likes you' : ''); }).join('');
  }

  /* ---------- 8. CHATS ---------- */
  function lastMsg(id) { var m = state.chats[id]; return m && m.length ? m[m.length - 1] : null; }
  function renderChats() {
    var ids = Object.keys(state.chats).map(Number);
    var fresh = ids.filter(function (id) { return !state.chats[id].length || (state.chats[id].length === 0); });
    $('#newMatches').innerHTML = ids.length ? ids.map(function (id) { var p = byId(id); return '<button class="nm" data-chat="' + id + '"><div class="av">' + art(p, 0) + '</div>' + esc(p.n) + '</button>'; }).join('') : '<p class="muted">Matches appear here.</p>';
    $('#chatList').innerHTML = ids.map(function (id) {
      var p = byId(id), m = lastMsg(id);
      return '<button class="li' + (state.activeChat === id ? ' on' : '') + '" data-chat="' + id + '"><div class="av">' + art(p, 0) + '</div><div class="tx"><b>' + esc(p.n) + '</b><small>' + esc(m ? (m.f === 'me' ? 'You: ' : '') + m.t : 'Say hello') + '</small></div>' + (state.unread[id] ? '<i class="dot"></i>' : '') + '</button>';
    }).join('');
    renderThread();
  }
  function renderThread() {
    var box = $('#thread'), id = state.activeChat;
    if (!id) { box.innerHTML = '<div class="th-empty"><h3>Pick a conversation</h3><p>Or open a match and send a flip card.</p></div>'; $('#chatsWrap').classList.remove('open'); return; }
    var p = byId(id);
    $('#chatsWrap').classList.add('open');
    box.innerHTML = '<div class="th-head"><button class="icon-btn th-back" id="thBack" aria-label="Back">' + icon('back') + '</button><div class="av">' + art(p, 0) + '</div><div><b>' + esc(p.n) + '</b><small>Online now</small></div>' +
      '<button class="icon-btn" id="thVideo" aria-label="Start video date" title="Video date">' + icon('video') + '</button><button class="icon-btn" id="thInfo" aria-label="Profile" title="Profile">' + icon('info') + '</button></div>' +
      '<div class="msgs" id="msgs"></div><div class="ice" id="ice"></div>' +
      '<form class="composer" id="composer"><label class="sr" for="msgIn" style="position:absolute;left:-9999px">Message</label><input id="msgIn" placeholder="Write a message" autocomplete="off"><button class="send" aria-label="Send">' + icon('send') + '</button></form>';
    state.chats[id].forEach(function (m) { addBubble(m, false); });
    $('#ice').innerHTML = shuffle(ICEBREAKERS).slice(0, 4).map(function (q) { return '<button type="button">' + esc(q) + '</button>'; }).join('');
    var msgs = $('#msgs'); msgs.scrollTop = msgs.scrollHeight;
    state.unread[id] = false; saveChats(); updateBadges();
  }
  function addBubble(m, scroll) {
    var d = document.createElement('div');
    d.className = 'msg ' + m.f + (m.card ? ' card-msg' : '');
    if (m.card) { d.innerHTML = '<small>Flip card</small>'; d.appendChild(document.createTextNode(m.t)); }
    else d.textContent = m.t;
    if (m.r) { var r = document.createElement('span'); r.className = 'react'; r.textContent = m.r; d.appendChild(r); }
    d.addEventListener('dblclick', function () { if (m.f === 'them') { m.r = '❤️'; saveChats(); if (!d.querySelector('.react')) { var s = document.createElement('span'); s.className = 'react'; s.textContent = '❤️'; d.appendChild(s); } } });
    $('#msgs').appendChild(d);
    if (scroll !== false) $('#msgs').scrollTop = $('#msgs').scrollHeight;
  }
  function sendMsg(text, card) {
    var id = state.activeChat; if (!id || !text.trim()) return;
    var m = { f: 'me', t: text.trim(), card: !!card };
    state.chats[id].push(m); saveChats(); addBubble(m);
    reply(id, text);
  }
  function reply(id, text) {
    var low = text.toLowerCase(), pool;
    if (/(hi|hello|hey)\b/.test(low)) pool = REPLIES.greet;
    else if (/coffee|date|dinner|meet|drink|lunch|walk/.test(low)) pool = REPLIES.date;
    else if (/thank/.test(low)) pool = REPLIES.thanks;
    else if (/\?/.test(low)) pool = REPLIES.q;
    else pool = REPLIES.any;
    var typing = document.createElement('div'); typing.className = 'typing'; typing.innerHTML = '<i></i><i></i><i></i>';
    setTimeout(function () {
      if (state.activeChat !== id) { deliver(); return; }
      $('#msgs').appendChild(typing); $('#msgs').scrollTop = $('#msgs').scrollHeight;
      setTimeout(deliver, 1300);
    }, 500);
    function deliver() {
      var m = { f: 'them', t: pick(pool) };
      state.chats[id].push(m);
      if (state.activeChat === id && view() === 'chats') { if (typing.parentNode) typing.remove(); addBubble(m); }
      else { state.unread[id] = true; toast(byId(id).n + ' sent you a message'); }
      saveChats(); updateBadges();
      if (view() === 'chats') { var lst = $('#chatList'); if (lst) renderChatListOnly(); }
    }
  }
  function renderChatListOnly() {
    var ids = Object.keys(state.chats).map(Number);
    $('#chatList').innerHTML = ids.map(function (id) {
      var p = byId(id), m = lastMsg(id);
      return '<button class="li' + (state.activeChat === id ? ' on' : '') + '" data-chat="' + id + '"><div class="av">' + art(p, 0) + '</div><div class="tx"><b>' + esc(p.n) + '</b><small>' + esc(m ? (m.f === 'me' ? 'You: ' : '') + m.t : 'Say hello') + '</small></div>' + (state.unread[id] ? '<i class="dot"></i>' : '') + '</button>';
    }).join('');
  }
  function view() { return state.view; }
  function makeMatch(p, isSuper) {
    if (!state.chats[p.id]) { state.chats[p.id] = []; saveChats(); }
    var ov = $('#matchOv');
    ov.innerHTML = '<h2>It\'s a match!</h2><p>' + (isSuper ? 'Your super like got ' + esc(p.n) + '\'s attention.' : 'You and ' + esc(p.n) + ' like each other.') + '</p>' +
      '<div class="faces"><div>' + art({ n: state.me.name || 'You', h: 30 }, 1) + '</div><div>' + art(p, 0) + '</div></div>' +
      '<div class="row"><button class="btn btn-grad btn-lg" id="mSay">Say hello</button><button class="btn btn-ghost btn-lg" id="mKeep">Keep swiping</button></div>';
    ov.hidden = false; confetti();
    $('#mSay').addEventListener('click', function () { ov.hidden = true; state.activeChat = p.id; setView('chats'); });
    $('#mKeep').addEventListener('click', function () { ov.hidden = true; });
    updateBadges();
  }

  /* ---------- 9. PLAY ---------- */
  var playTab = 'flip', quizAns = [], quizI = 0;
  function renderPlay() {
    $$('#playTabs button').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.tab === playTab); });
    var body = $('#playBody');
    if (playTab === 'flip') {
      body.innerHTML = '<div class="play-stage"><button class="flip" id="pFlip" aria-label="Flip the card"><span class="flip-in"><span class="face front"><svg viewBox="0 0 32 32" width="64" height="64"><path fill="#fff" fill-opacity=".9" d="M16 29S3 21 3 11.5A6.5 6.5 0 0 1 16 9a6.5 6.5 0 0 1 13 2.5C29 21 16 29 16 29z"/></svg><em>Tap to flip</em></span><span class="face back"><small>Icebreaker</small><strong id="pQ"></strong></span></span></button>' +
        '<div class="row"><button class="btn btn-ghost" id="pNext">Draw another</button><button class="btn btn-grad" id="pSend">Send to a match</button></div></div>';
      var f = $('#pFlip'), q = $('#pQ'); q.textContent = pick(ICEBREAKERS);
      f.addEventListener('click', function () { f.classList.toggle('flipped'); });
      $('#pNext').addEventListener('click', function () { f.classList.remove('flipped'); setTimeout(function () { q.textContent = pick(ICEBREAKERS); f.classList.add('flipped'); }, 450); });
      $('#pSend').addEventListener('click', function () {
        var ids = Object.keys(state.chats).map(Number);
        if (!ids.length) return toast('Match with someone first');
        modal('<button class="icon-btn x" data-close aria-label="Close">' + icon('x') + '</button><h3>Send to…</h3><p class="sub">' + esc(q.textContent) + '</p><div class="stack">' +
          ids.map(function (id) { return '<button class="li" data-send="' + id + '"><div class="av">' + art(byId(id), 0) + '</div><div class="tx"><b>' + esc(byId(id).n) + '</b></div></button>'; }).join('') + '</div>');
        $$('[data-send]').forEach(function (b) { b.addEventListener('click', function () { state.activeChat = +b.dataset.send; var t = q.textContent; closeModal(); setView('chats'); sendMsg(t, true); }); });
      });
    } else if (playTab === 'wyr') {
      var pair = pick(WYR);
      body.innerHTML = '<div class="play-stage"><div class="wyr"><h3>Would you rather…</h3><button class="opt" data-o="0"><span>' + pair[0] + '</span><i class="fill"></i><b class="pc"></b></button><button class="opt" data-o="1"><span>' + pair[1] + '</span><i class="fill"></i><b class="pc"></b></button></div><button class="btn btn-ghost" id="wNext">Next question</button></div>';
      $$('.opt').forEach(function (o) {
        o.addEventListener('click', function () {
          if (o.classList.contains('shown')) return;
          var a = 35 + Math.floor(Math.random() * 40), pc = [a, 100 - a], pickI = +o.dataset.o;
          $$('.opt').forEach(function (x, i) { x.classList.add('shown'); $('.fill', x).style.height = pc[i] + '%'; $('.pc', x).textContent = pc[i] + '% chose this'; });
          o.classList.add('pick'); toast('Share your pick with a match in chat');
        });
      });
      $('#wNext').addEventListener('click', renderPlay);
    } else if (playTab === 'quiz') {
      renderQuiz();
    } else {
      body.innerHTML = '<div class="play-stage"><div class="spin"><div class="reels"><div class="reel"><small>Vibe</small><b id="r0">?</b></div><div class="reel"><small>Place</small><b id="r1">?</b></div><div class="reel"><small>Twist</small><b id="r2">?</b></div></div>' +
        '<div class="row"><button class="btn btn-grad btn-lg" id="spinBtn">Spin</button><button class="btn btn-ghost btn-lg" id="spinSend" hidden>Send as a date plan</button></div></div></div>';
      var last = null;
      $('#spinBtn').addEventListener('click', function () {
        var sets = [DATE_VIBES, DATE_PLACES, DATE_TWISTS], reels = $$('.reel'), n = 0;
        $('#spinSend').hidden = true;
        reels.forEach(function (r, i) {
          r.classList.add('spinning');
          var iv = setInterval(function () { $('b', r).textContent = pick(sets[i]); }, 70);
          setTimeout(function () { clearInterval(iv); r.classList.remove('spinning'); $('b', r).textContent = pick(sets[i]); if (++n === 3) { last = 'A ' + $('#r0').textContent.toLowerCase() + ' date at ' + $('#r1').textContent + '. Twist: ' + $('#r2').textContent + '.'; $('#spinSend').hidden = false; confetti(30); } }, reduceMotion ? 50 : 900 + i * 450);
        });
      });
      $('#spinSend').addEventListener('click', function () {
        var ids = Object.keys(state.chats).map(Number);
        if (!ids.length) return toast('Match with someone first');
        state.activeChat = ids[0]; setView('chats'); sendMsg(last + ' Are you in?', false);
      });
    }
  }
  function renderQuiz() {
    var body = $('#playBody');
    if (quizI >= QUIZ.length) {
      var count = {}; quizAns.forEach(function (a) { count[a] = (count[a] || 0) + 1; });
      var top = Object.keys(count).sort(function (a, b) { return count[b] - count[a]; })[0], r = ARCHETYPES[top], pct = 72 + Math.floor(Math.random() * 24);
      body.innerHTML = '<div class="play-stage"><div class="result"><div class="ring" style="--p:' + pct + '"><b>' + pct + '%</b></div><h3>' + r[0] + '</h3><p>' + r[1] + '</p><button class="btn btn-grad" id="qAgain">Take it again</button></div></div>';
      confetti(60); $('#qAgain').addEventListener('click', function () { quizI = 0; quizAns = []; renderQuiz(); });
      return;
    }
    var q = QUIZ[quizI];
    body.innerHTML = '<div class="play-stage"><div class="quiz"><div class="qbar"><i style="width:' + (quizI / QUIZ.length * 100) + '%"></i></div><h3>' + q.q + '</h3><div class="ans">' + q.a.map(function (a, i) { return '<button data-a="' + i + '">' + a[0] + '</button>'; }).join('') + '</div></div></div>';
    $$('.ans button').forEach(function (b) { b.addEventListener('click', function () { quizAns.push(q.a[+b.dataset.a][1]); quizI++; renderQuiz(); }); });
  }

  /* ---------- 10. PROFILE ---------- */
  function renderProfile() {
    var m = state.me;
    $('#pName').value = m.name; $('#pAge').value = m.age; $('#pCity').value = m.city; $('#pJob').value = m.job; $('#pBio').value = m.bio;
    $('#bioCount').textContent = m.bio.length + '/160';
    $('#pIntent').innerHTML = INTENTS.map(function (i) { return '<button type="button" class="' + (m.intent === i ? 'on' : '') + '">' + i + '</button>'; }).join('');
    $('#pTags').innerHTML = ALL_TAGS.map(function (t) { return '<button type="button" class="' + (m.tags.indexOf(t) > -1 ? 'on' : '') + '">' + t + '</button>'; }).join('');
    var tg = [['distance', 'Show my distance', 'People see how far away you are'], ['incognito', 'Incognito mode', 'Only people you like can see you'], ['readReceipts', 'Read receipts', 'Show when you have read a message'], ['notifs', 'Notifications', 'Matches and messages']];
    $('#toggles').innerHTML = tg.map(function (t) { return '<div class="tg"><div><b>' + t[1] + '</b><small>' + t[2] + '</small></div><button type="button" class="sw" role="switch" data-set="' + t[0] + '" aria-checked="' + state.settings[t[0]] + '" aria-label="' + t[1] + '"></button></div>'; }).join('');
    $('#verifyBtn').textContent = m.verified ? 'You are verified' : 'Get verified';
    drawPreview();
  }
  function drawPreview() {
    var m = state.me, p = { n: m.name || 'You', h: 330 };
    $('#profPreview').innerHTML = '<div class="ph">' + art(p, 0) + '</div><div class="shade"></div><div class="pinfo"><h3>' + esc(m.name || 'You') + ' <span>' + (m.age || '') + '</span>' + (m.verified ? BADGE : '') + '</h3><div class="meta"><span>' + icon('pin') + esc(m.city) + '</span><span>' + esc(m.job) + '</span></div><div class="meta" style="margin-top:8px">' + esc(m.bio) + '</div><div class="tags">' + m.tags.slice(0, 4).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div></div>';
    var score = 20 + (m.bio.length > 30 ? 20 : 0) + (m.tags.length >= 4 ? 20 : m.tags.length * 4) + (m.job ? 10 : 0) + (m.city ? 10 : 0) + (m.verified ? 20 : 0);
    score = Math.min(100, score);
    $('#strength').innerHTML = '<div class="ring" style="--p:' + score + '"><b>' + score + '</b></div><p>' + (score < 100 ? (m.verified ? 'Add more interests and a longer bio to reach 100.' : 'Verify your profile and add a longer bio to reach 100.') : 'Your profile is complete. Nice.') + '</p>';
    $('#bioCount').textContent = m.bio.length + '/160';
  }
  function bindProfile() {
    var map = { pName: 'name', pAge: 'age', pCity: 'city', pJob: 'job', pBio: 'bio' };
    Object.keys(map).forEach(function (id) {
      $('#' + id).addEventListener('input', function (e) { state.me[map[id]] = e.target.value; store.set('me', state.me); drawPreview(); });
    });
    $('#profForm').addEventListener('submit', function (e) { e.preventDefault(); });
    $('#pIntent').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; state.me.intent = b.textContent; store.set('me', state.me); renderProfile(); });
    $('#pTags').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; var t = b.textContent, i = state.me.tags.indexOf(t);
      if (i > -1) state.me.tags.splice(i, 1); else if (state.me.tags.length >= 6) return toast('Pick up to 6 interests'); else state.me.tags.push(t);
      store.set('me', state.me); renderProfile();
    });
    $('#toggles').addEventListener('click', function (e) {
      var s = e.target.closest('.sw'); if (!s) return; var k = s.dataset.set; state.settings[k] = !state.settings[k]; store.set('settings', state.settings); s.setAttribute('aria-checked', state.settings[k]);
    });
    $('#verifyBtn').addEventListener('click', function () {
      if (state.me.verified) return toast('Already verified');
      modal('<button class="icon-btn x" data-close aria-label="Close">' + icon('x') + '</button><h3>Get verified</h3><p class="sub">Three quick steps. In this prototype, the selfie step is simulated.</p><div class="checklist"><label><input type="checkbox" checked disabled> Confirm your phone number</label><label><input type="checkbox" checked disabled> Take a selfie matching a pose</label><label><input type="checkbox" id="vOk"> I agree to the community guidelines</label></div><button class="btn btn-grad" id="vGo" style="margin-top:16px">Verify me</button>');
      $('#vGo').addEventListener('click', function () { if (!$('#vOk').checked) return toast('Please accept the guidelines first'); state.me.verified = true; store.set('me', state.me); closeModal(); renderProfile(); confetti(40); toast('You are verified'); });
    });
    $('#safetyBtn').addEventListener('click', openSafety);
  }
  function openSafety() {
    modal('<button class="icon-btn x" data-close aria-label="Close">' + icon('x') + '</button><h3>Safety centre</h3><p class="sub">Tick these off before you meet someone.</p><div class="checklist">' +
      ['Chat on Kismet first, and try a video date', 'Meet in a busy public place', 'Tell a friend where you are going', 'Arrange your own transport', 'Trust your instincts. Leave if it feels off'].map(function (t) { return '<label><input type="checkbox"> ' + t + '</label>'; }).join('') +
      '</div><div class="row" style="margin-top:16px"><button class="btn btn-ghost" id="sShare">Share my date plan</button><button class="btn btn-grad" data-close>Done</button></div>');
    $('#sShare').addEventListener('click', function () { toast('Date plan ready to share (demo)'); });
  }

  /* ---------- 11. OVERLAYS ---------- */
  var lastFocus = null;
  function modal(html) {
    lastFocus = document.activeElement;
    $('#modalBox').innerHTML = html; $('#modal').hidden = false; fillIcons($('#modalBox'));
    var f = $('#modalBox button, #modalBox input'); if (f) f.focus();
  }
  function closeModal() { $('#modal').hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function openGold() {
    modal('<button class="icon-btn x" data-close aria-label="Close">' + icon('x') + '</button><h3>Kismet Gold</h3><p class="sub">See who likes you, rewind without limits, and boost every month.</p><div class="checklist"><label>' + icon('heart') + ' See everyone who likes you</label><label>' + icon('undo') + ' Unlimited rewinds</label><label>' + icon('star') + ' 5 super likes a week</label><label>' + icon('bolt') + ' A free boost every month</label></div><button class="btn btn-grad btn-lg" id="goGold" style="margin-top:16px;width:100%">' + (state.gold ? 'Turn Gold off (demo)' : 'Try Gold free (demo)') + '</button>');
    $('#goGold').addEventListener('click', function () { state.gold = !state.gold; store.set('gold', state.gold); closeModal(); renderLikes(); toast(state.gold ? 'Gold is on' : 'Gold is off'); if (state.gold) confetti(50); });
  }

  /* ---------- 12. EFFECTS ---------- */
  // floating hearts background
  function startHearts() {
    var c = $('#hearts'), x = c.getContext('2d'), W, H, hs = [], mx = 0;
    function size() { var d = window.devicePixelRatio || 1; W = c.width = innerWidth * d; H = c.height = innerHeight * d; }
    size(); addEventListener('resize', size);
    addEventListener('pointermove', function (e) { mx = (e.clientX / innerWidth - .5) * 30; });
    for (var i = 0; i < 26; i++) hs.push(mk(true));
    function mk(init) { return { x: Math.random() * W, y: init ? Math.random() * H : H + 40, s: 8 + Math.random() * 18, v: .25 + Math.random() * .6, a: .08 + Math.random() * .2, p: Math.random() * 6, h: Math.random() < .5 ? 345 : 28 }; }
    function heart(px, py, s) { x.beginPath(); x.moveTo(px, py + s * .3); x.bezierCurveTo(px, py - s * .2, px - s, py - s * .2, px - s, py + s * .4); x.bezierCurveTo(px - s, py + s, px, py + s * 1.2, px, py + s * 1.6); x.bezierCurveTo(px, py + s * 1.2, px + s, py + s, px + s, py + s * .4); x.bezierCurveTo(px + s, py - s * .2, px, py - s * .2, px, py + s * .3); x.fill(); }
    var t = 0;
    (function loop() {
      x.clearRect(0, 0, W, H); t += .01;
      hs.forEach(function (h, i) {
        h.y -= h.v * (window.devicePixelRatio || 1); if (h.y < -60) hs[i] = mk(false);
        x.fillStyle = 'hsla(' + h.h + ',95%,65%,' + h.a + ')';
        heart(h.x + Math.sin(t + h.p) * 24 + mx * (h.s / 20), h.y, h.s * (window.devicePixelRatio || 1) / 1.4);
      });
      if (!reduceMotion) requestAnimationFrame(loop);
    })();
  }
  // confetti burst
  function confetti(n) {
    if (reduceMotion) return;
    n = n || 120;
    var c = $('#confetti'), x = c.getContext('2d'), d = window.devicePixelRatio || 1;
    c.width = innerWidth * d; c.height = innerHeight * d;
    var cols = ['#ff4f81', '#ffb067', '#b49bff', '#55e0b6', '#ffffff'], ps = [];
    for (var i = 0; i < n; i++) ps.push({ x: c.width / 2, y: c.height * .45, vx: (Math.random() - .5) * 18 * d, vy: (-Math.random() * 16 - 4) * d, r: Math.random() * 6, s: (4 + Math.random() * 7) * d, c: pick(cols), heart: Math.random() < .35 });
    var f = 0;
    (function tick() {
      x.clearRect(0, 0, c.width, c.height); f++;
      ps.forEach(function (p) {
        p.vy += .45 * d; p.x += p.vx; p.y += p.vy; p.r += .2; p.vx *= .99;
        x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c;
        if (p.heart) { x.font = p.s * 2.2 + 'px sans-serif'; x.fillText('♥', 0, 0); } else x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        x.restore();
      });
      if (f < 130) requestAnimationFrame(tick); else x.clearRect(0, 0, c.width, c.height);
    })();
  }

  /* ---------- EVENTS ---------- */
  function bind() {
    fillIcons(document);
    setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    $('#themeBtn').addEventListener('click', function () { setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });
    document.addEventListener('click', function (e) {
      var o = e.target.closest('[data-open-app]'); if (o) { openApp(o.dataset.openApp || 'discover'); return; }
      var v = e.target.closest('[data-view]'); if (v) { setView(v.dataset.view); return; }
      var cl = e.target.closest('[data-close]'); if (cl) { closeModal(); return; }
      var ch = e.target.closest('[data-chat]'); if (ch) { state.activeChat = +ch.dataset.chat; renderChats(); return; }
      var pc = e.target.closest('.mcard'); if (pc) { var p = byId(+pc.dataset.p); if (pc.classList.contains('locked')) openGold(); else openDetails(p); return; }
      if (e.target === $('#modal')) closeModal();
    });
    $('#exitApp').addEventListener('click', closeApp);
    $('#actions').addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return; var a = b.dataset.act;
      if (a === 'rewind') rewind(); else if (a === 'info') { var el = topCard(); if (el) openDetails(byId(+el.dataset.id)); } else swipe(a);
    });
    $('#filterBtn').addEventListener('click', openFilters);
    $('#emptyFilters').addEventListener('click', openFilters);
    $('#emptyReset').addEventListener('click', function () { state.seen = []; state.history = []; store.set('seen', []); renderDeck(); });
    $('#boostBtn').addEventListener('click', function () {
      if (state.boostUntil > Date.now()) return toast('Your boost is already running');
      state.boostUntil = Date.now() + 30 * 60 * 1000; updateBoost(); toast('Boost on. You are a top profile for 30 minutes.'); confetti(30);
    });
    $('#goldBtn').addEventListener('click', openGold);
    $('#playTabs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; playTab = b.dataset.tab; renderPlay(); });
    $('#thread').addEventListener('click', function (e) {
      if (e.target.closest('#thBack')) { state.activeChat = null; renderChats(); }
      else if (e.target.closest('#thInfo')) openDetails(byId(state.activeChat));
      else if (e.target.closest('#thVideo')) modal('<button class="icon-btn x" data-close aria-label="Close">' + icon('x') + '</button><h3>Video date</h3><p class="sub">Ask ' + esc(byId(state.activeChat).n) + ' to a video date. They will get a prompt and can pick a time. (Demo only.)</p><button class="btn btn-grad" data-close>Send invite</button>');
      else { var ice = e.target.closest('#ice button'); if (ice) sendMsg(ice.textContent, true); }
    });
    $('#thread').addEventListener('submit', function (e) { e.preventDefault(); var i = $('#msgIn'); sendMsg(i.value, false); i.value = ''; });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if (!$('#modal').hidden) closeModal(); if (!$('#matchOv').hidden) $('#matchOv').hidden = true; return; }
      if (state.view !== 'discover' || !$('#modal').hidden || !$('#matchOv').hidden || $('#app').hidden) return;
      var t = e.target.tagName; if (t === 'INPUT' || t === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') swipe('like'); else if (e.key === 'ArrowLeft') swipe('nope'); else if (e.key === 'ArrowUp') { e.preventDefault(); swipe('super'); }
      else if (e.key === 'z') rewind(); else if (e.key === 'i') { var el = topCard(); if (el) openDetails(byId(+el.dataset.id)); }
    });
    bindProfile();
    setInterval(updateBoost, 1000);
  }

  buildLanding(); bind(); startHearts();
  if (location.hash === '#app') openApp('discover');
})();
