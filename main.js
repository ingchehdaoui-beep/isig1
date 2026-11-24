/* ISIG — script principal : langue, menu, carte des parcours, quiz, formulaire, annonces, assistant */
{
  const root = document.documentElement;
  const btn = document.getElementById('lang');
  const T = (o) => o[root.lang];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const NS = 'http://www.w3.org/2000/svg';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hooks = [];

  /* menu mobile */
  const mb = document.getElementById('menu'), links = document.getElementById('links');
  if (mb && links) {
    mb.addEventListener('click', () => { const o = links.classList.toggle('open'); mb.setAttribute('aria-expanded', String(o)); });
    links.addEventListener('click', (e) => { if (e.target.closest('a')) { links.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); } });
  }

  /* data */
  const R = {
    dev: { c: '#3d9bff', s: -1,
      name: { fr: 'Technicien Spécialisé en Développement Informatique', ar: 'تقني متخصص في التنمية المعلوماتية' },
      st: [{ fr: 'Programmation', ar: 'البرمجة' }, { fr: 'Bases de données', ar: 'قواعد البيانات' }, { fr: 'Web et mobile', ar: 'الويب والمحمول' }, { fr: 'Stage', ar: 'التدريب' }],
      acc: { fr: 'Baccalauréat', ar: 'الباكالوريا' }, dip: { fr: 'Technicien Spécialisé', ar: 'تقني متخصص' },
      job: { fr: 'Développeur web et mobile', ar: 'مطور ويب ومحمول' } },
    ges: { c: '#ff8a1f', s: 1,
      name: { fr: 'Technicien en Gestion Informatisée', ar: 'تقني في إعلاميات التدبير' },
      st: [{ fr: 'Comptabilité', ar: 'المحاسبة' }, { fr: 'Gestion commerciale', ar: 'التدبير التجاري' }, { fr: 'Logiciels de gestion', ar: 'برامج التدبير' }, { fr: 'Stage', ar: 'التدريب' }],
      acc: { fr: 'Niveau 2e année Bac', ar: 'مستوى الثانية باك' }, dip: { fr: 'Technicien', ar: 'تقني' },
      job: { fr: 'Aide-comptable, assistant de gestion', ar: 'مساعد محاسب، مساعد التدبير' } }
  };
  const NODES = { start: { fr: 'Bac', ar: 'الباك' }, dip: { fr: 'Diplôme', ar: 'الدبلوم' }, end: { fr: 'Métier', ar: 'المهنة' } };
  const LBL = { acc: { fr: 'Accès', ar: 'الولوج' }, dur: { fr: 'Durée', ar: 'المدة' }, two: { fr: '2 ans', ar: 'سنتان' }, dip: { fr: 'Diplôme', ar: 'الدبلوم' }, job: { fr: 'Débouché type', ar: 'مثال مهنة' }, go: { fr: 'Je choisis cette ligne', ar: 'أختار هذا الخط' } };
  let sel = 'dev';

  /* route map */
  const svg = document.getElementById('map');
  if (svg) {
  const el = (n, a, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
  const TS = [0.2, 0.36, 0.52, 0.68];
  const draw = () => {
    const W = svg.clientWidth, H = svg.clientHeight; if (!W) return;
    svg.textContent = '';
    const rtl = root.dir === 'rtl', vert = W < 600;
    const pad = vert ? 30 : Math.max(64, W * 0.07);
    const L = (vert ? H : W) - 2 * pad;
    const P = (t, s) => {
      if (vert) { const x = rtl ? W - 34 : 34; return [x, pad + t * L]; }
      const amp = H * 0.29, x = pad + t * L;
      return [rtl ? W - x : x, H * 0.5 + s * amp];
    };
    const routes = vert ? [sel] : ['dev', 'ges'].sort((a) => (a === sel ? 1 : -1));
    for (const k of routes) {
      const r = R[k], s = vert ? 0 : r.s, on = k === sel;
      const p0 = P(0, 0), a = P(0.07, 0), b = P(0.06, s), c = P(0.14, s), d = P(0.74, s), e = P(0.8, s), f = P(0.76, 0), g = P(0.84, 0);
      const dpath = vert ? `M${p0} L${P(0.84, 0)}` : `M${p0} C${a} ${b} ${c} L${d} C${e} ${f} ${g}`;
      const path = el('path', { d: dpath, fill: 'none', stroke: r.c, 'stroke-width': on ? 10 : 6, 'stroke-linecap': 'round', opacity: on ? 1 : 0.3 });
      const hit = el('path', { d: dpath, fill: 'none', stroke: 'transparent', 'stroke-width': 30, class: 'hit' });
      hit.addEventListener('click', () => select(k));
      TS.forEach((t, i) => {
        const [x, y] = P(t, s);
        el('circle', { cx: x, cy: y, r: on ? 9 : 7, fill: on ? '#fff' : '#0b2257', stroke: r.c, 'stroke-width': 4, opacity: on ? 1 : 0.5 });
        let tx = x, ty = s < 0 ? y - 20 : y + 32, anc = 'middle';
        if (vert) { tx = rtl ? x - 24 : x + 24; ty = y + 5; anc = 'start'; }
        const tt = el('text', { x: tx, y: ty, 'text-anchor': anc, opacity: on ? 1 : 0.55, class: 'hit' });
        tt.textContent = T(r.st[i]);
        tt.addEventListener('click', () => select(k));
      });
      if (on && !reduce) {
        const tok = el('circle', { r: 6, fill: '#fff' });
        el('animateMotion', { dur: '7s', repeatCount: 'indefinite', path: dpath }, tok);
      }
    }
    el('path', { d: `M${P(0.84, 0)} L${P(1, 0)}`, stroke: '#ffffff', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-dasharray': '2 14', fill: 'none' });
    const pill = (t, label, fill, ink) => {
      const [x, y] = P(t, 0), g = el('g', { class: 'pill' });
      const tx = el('text', { x, y: y + 5, 'text-anchor': 'middle', fill: ink }, g); tx.textContent = label;
      const w = tx.getBBox().width + 32;
      const rc = el('rect', { x: x - w / 2, y: y - 18, width: w, height: 36, rx: 18, fill, stroke: '#0b2257', 'stroke-width': 3 }, g);
      g.insertBefore(rc, tx); tx.setAttribute('style', 'fill:' + ink);
    };
    pill(0, T(NODES.start), '#ffffff', '#0b2257');
    pill(0.84, T(NODES.dip), '#ffffff', '#0b2257');
    pill(1, T(NODES.end), '#ff8a1f', '#341600');
  };
  const info = document.getElementById('info');
  const renderInfo = () => {
    const r = R[sel];
    info.innerHTML = `<div><small>${esc(T(LBL.acc))}</small><b>${esc(T(r.acc))}</b></div><div><small>${esc(T(LBL.dur))}</small><b>${esc(T(LBL.two))}</b></div><div><small>${esc(T(LBL.dip))}</small><b>${esc(T(r.dip))}</b></div><div><small>${esc(T(LBL.job))}</small><b>${esc(T(r.job))}</b></div><a class="btn b-org" href="inscription.html?f=${sel}" id="go">${esc(T(LBL.go))}</a>`;
  };
  const select = (k) => {
    sel = k;
    for (const b of document.querySelectorAll('.seg button')) b.setAttribute('aria-pressed', String(b.dataset.k === k));
    draw(); renderInfo();
  };
  for (const b of document.querySelectorAll('.seg button')) b.addEventListener('click', () => select(b.dataset.k));
  const mapRO = new ResizeObserver(draw); mapRO.observe(svg);
  hooks.push(() => { draw(); renderInfo(); });
  if (document.fonts) document.fonts.ready.then(draw);
  }

  /* orientation quiz */
  const Q = {
    dev: { t: { fr: 'Technicien Spécialisé en Développement Informatique', ar: 'تقني متخصص في التنمية المعلوماتية' }, p: { fr: 'Vous aimez créer : cette ligne vous mène en deux ans au métier de développeur web et mobile.', ar: 'تحب الإبداع: هذا الخط يقودك في سنتين إلى مهنة مطور ويب ومحمول.' } },
    devNoBac: { t: { fr: 'Gestion informatisée, puis le Développement après le Bac', ar: 'إعلاميات التدبير، ثم التنمية المعلوماتية بعد الباك' }, p: { fr: 'Le Développement informatique demande le Bac. Avec votre niveau, commencez par la Gestion informatisée, très utilisée sur ordinateur, ou par une formation courte.', ar: 'التنمية المعلوماتية تتطلب الباكالوريا. بمستواك، ابدأ بإعلاميات التدبير التي تعتمد كثيرا على الحاسوب، أو بتكوين قصير.' }, k: 'ges' },
    ges: { t: { fr: 'Technicien en Gestion Informatisée', ar: 'تقني في إعلاميات التدبير' }, p: { fr: 'Vous aimez les chiffres et l’organisation : comptabilité, facturation et logiciels de gestion vous ouvrent les PME de la région.', ar: 'تحب الأرقام والتنظيم: المحاسبة والفوترة وبرامج التدبير تفتح لك أبواب المقاولات بالجهة.' } },
    all: { t: { fr: 'Langue allemande', ar: 'اللغة الألمانية' }, p: { fr: "Les langues ouvrent des portes, en particulier vers l'Allemagne pour étudier ou travailler.", ar: 'اللغات تفتح الأبواب، خاصة نحو ألمانيا للدراسة أو العمل.' } },
    dm: { t: { fr: 'Digital Marketing', ar: 'التسويق الرقمي' }, p: { fr: 'Pour communiquer et vendre en ligne : réseaux sociaux, contenu et publicité. Idéal pour lancer une activité.', ar: 'للتواصل والبيع عبر الإنترنت: شبكات التواصل والمحتوى والإعلان. مثالي لإطلاق مشروع.' } }
  };
  const X = {
    abroad: { fr: "Conseil : ajoutez l'allemand pour préparer un projet en Allemagne.", ar: 'نصيحة: أضف اللغة الألمانية لتحضير مشروع في ألمانيا.' },
    biz: { fr: 'Conseil : complétez avec la formation Digital Marketing pour faire connaître votre activité.', ar: 'نصيحة: أكمل بتكوين التسويق الرقمي للتعريف بمشروعك.' },
    lab: { fr: 'Notre conseil', ar: 'نقترح عليك' }, go: { fr: 'Me pré-inscrire', ar: 'التسجيل الأولي' }
  };
  const result = document.getElementById('result');
  if (result) {
  const renderQuiz = () => {
    const v = (n) => document.querySelector(`input[name=${n}]:checked`).value;
    const q1 = v('q1'), q2 = v('q2'), q3 = v('q3');
    let key = q2 === 'code' ? (q1 === 'bac2' ? 'devNoBac' : 'dev') : q2 === 'ges' ? 'ges' : (q3 === 'biz' ? 'dm' : 'all');
    const r = Q[key], fil = r.k || (key === 'devNoBac' ? 'ges' : key);
    let extra = '';
    if (q3 === 'abroad' && key !== 'all') extra = T(X.abroad);
    if (q3 === 'biz' && key !== 'dm') extra = T(X.biz);
    result.innerHTML = `<small>${esc(T(X.lab))}</small><h3>${esc(T(r.t))}</h3><p>${esc(T(r.p))}</p>${extra ? `<p style="margin-top:10px">${esc(extra)}</p>` : ''}<a class="btn b-org" href="inscription.html?f=${fil}" id="qgo">${esc(T(X.go))}</a>`;
  };
  document.getElementById('qs').addEventListener('change', renderQuiz);
  hooks.push(renderQuiz);
  }

  /* langue */
  const setLang = (l) => {
    root.classList.toggle('l-ar', l === 'ar'); root.classList.toggle('l-fr', l === 'fr');
    root.lang = l; root.dir = l === 'ar' ? 'rtl' : 'ltr';
    btn.textContent = l === 'ar' ? 'Français' : 'العربية';
    for (const o of document.querySelectorAll('option[data-ar]')) o.textContent = o.dataset[l];
    try { localStorage.setItem('isig-lang', l); } catch (e) {}
    const t = document.querySelector('meta[name="title-' + l + '"]'); if (t) document.title = t.content;
    hooks.forEach((h) => h());
  };
  let saved = 'ar';
  try { saved = localStorage.getItem('isig-lang') || 'ar'; } catch (e) {}
  setLang(saved === 'fr' ? 'fr' : 'ar');
  btn.addEventListener('click', () => setLang(root.lang === 'ar' ? 'fr' : 'ar'));

  /* form */
  const fEl = document.getElementById('f');
  if (fEl) {
  try { const q = new URLSearchParams(location.search).get('f'); if (q && fEl.querySelector('#fil option[value="' + q.replace(/[^a-z]/g, '') + '"]')) document.getElementById('fil').value = q; } catch (e) {}
  fEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const fr = root.lang === 'fr', v = (id) => document.getElementById(id).value.trim(), err = document.getElementById('err');
    if (!v('nom') || v('tel').replace(/\D/g, '').length < 9) {
      err.textContent = fr ? 'Merci d’indiquer votre nom et un numéro de téléphone valide.' : 'المرجو إدخال الاسم ورقم هاتف صحيح.';
      document.getElementById('ok').classList.remove('on'); return;
    }
    err.textContent = '';
    const s = (id) => document.getElementById(id).selectedOptions[0].textContent;
    const msg = fr
      ? `Bonjour ISIG, je souhaite me pré-inscrire.\nNom : ${v('nom')}\nTéléphone : ${v('tel')}\nFormation : ${s('fil')}\nNiveau : ${s('niv')}\nVille : ${v('ville') || '-'}`
      : `السلام عليكم، أرغب في التسجيل الأولي.\nالاسم: ${v('nom')}\nالهاتف: ${v('tel')}\nالتكوين: ${s('fil')}\nالمستوى: ${s('niv')}\nالمدينة: ${v('ville') || '-'}`;
    document.getElementById('wa').href = 'https://wa.me/212606878700?text=' + encodeURIComponent(msg);
    document.getElementById('ok').classList.add('on');
  });
  }

  /* annonces */
  const pos = document.getElementById('posters');
  if (pos) {
    const step = (d) => pos.scrollBy({ left: (root.dir === 'rtl' ? -d : d) * pos.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
    document.getElementById('next').addEventListener('click', () => step(1));
    document.getElementById('prev').addEventListener('click', () => step(-1));
  }

  /* chatbot */
  const WA = '212606878700';
  const N = {
    start: { fr: "Bonjour ! Je suis l'assistant de l'ISIG.\nChoisissez un sujet ou écrivez votre question.", ar: 'مرحبا! أنا المساعد الآلي لمعهد ISIG.\nاختر موضوعا أو اكتب سؤالك.', c: ['filieres', 'courtes', 'inscription', 'frais', 'adresse', 'conseiller'] },
    filieres: { fr: "Deux filières diplômantes de 2 ans, avec diplômes visés par l'État :\n• Technicien Spécialisé en Développement Informatique (accès : Bac)\n• Technicien en Gestion Informatisée (accès : niveau 2e année Bac)", ar: 'شعبتان بدبلوم مدة كل منهما سنتان، ودبلومات مؤشر عليها من طرف الدولة:\n• تقني متخصص في التنمية المعلوماتية (الولوج: الباكالوريا)\n• تقني في إعلاميات التدبير (الولوج: مستوى الثانية باكالوريا)', c: ['dev', 'gestion', 'inscription'] },
    dev: { fr: "Technicien Spécialisé en Développement Informatique\n• Programmation et développement d'applications\n• Bases de données\n• Solutions web et mobiles\n• Stage et projet de fin de formation\nDébouchés : développeur web et mobile, support informatique, freelance.", ar: 'تقني متخصص في التنمية المعلوماتية\n• البرمجة وتطوير التطبيقات\n• قواعد البيانات\n• حلول الويب والمحمول\n• تدريب ومشروع نهاية التكوين\nآفاق الشغل: مطور ويب ومحمول، دعم معلوماتي، عمل حر.', c: ['inscription', 'frais', 'conseiller'] },
    gestion: { fr: "Technicien en Gestion Informatisée\n• Comptabilité générale\n• Gestion commerciale et facturation\n• Bureautique et logiciels de gestion\n• Stage en entreprise\nDébouchés : aide-comptable, agent administratif, assistant de gestion en PME.", ar: 'تقني في إعلاميات التدبير\n• المحاسبة العامة\n• التدبير التجاري والفوترة\n• المكتبيات وبرامج التدبير\n• تدريب داخل المقاولة\nآفاق الشغل: مساعد محاسب، عون إداري، مساعد التدبير في المقاولات.', c: ['inscription', 'frais', 'conseiller'] },
    courtes: { fr: 'Formations courtes en ce moment :\n• Langue allemande (offre spéciale)\n• Digital Marketing (formation pratique)', ar: 'التكوينات القصيرة حاليا:\n• اللغة الألمانية (عرض خاص)\n• التسويق الرقمي (تكوين تطبيقي)', c: ['allemand', 'marketing', 'conseiller'] },
    allemand: { fr: "Cours d'allemand du niveau débutant aux niveaux demandés pour étudier ou travailler en Allemagne. Offre spéciale à tarif préférentiel pour les stagiaires et lauréats de l'institut.", ar: 'دروس اللغة الألمانية من المستوى المبتدئ إلى المستويات المطلوبة للدراسة أو العمل في ألمانيا. عرض خاص بثمن تفضيلي لفائدة متدربي وخريجي المعهد.', c: ['frais', 'conseiller'] },
    marketing: { fr: 'Formation Digital Marketing 100 % pratique : réseaux sociaux, création de contenu, publicité en ligne. La première séance de chaque session est gratuite.', ar: 'دورة التسويق الرقمي تطبيقية 100%: شبكات التواصل، صناعة المحتوى، الإعلان على الإنترنت. الحصة الأولى من كل دورة مجانية.', c: ['frais', 'conseiller'] },
    inscription: { fr: "L'inscription en 4 étapes :\n1. Pré-inscription (formulaire ou WhatsApp)\n2. Rendez-vous d'orientation à l'institut\n3. Dépôt du dossier : copie du Bac ou relevé de notes, copie de la CIN, 4 photos\n4. Rentrée", ar: 'التسجيل في 4 مراحل:\n1. التسجيل الأولي (الاستمارة أو واتساب)\n2. موعد التوجيه بالمعهد\n3. إيداع الملف: نسخة من الباكالوريا أو كشف النقط، نسخة من البطاقة الوطنية، 4 صور\n4. الدخول التكويني', c: ['form', 'conseiller'] },
    frais: { fr: 'Les frais dépendent de la formation choisie et des facilités de paiement. Un conseiller vous donne le tarif exact sur WhatsApp.', ar: 'الواجبات تختلف حسب التكوين وتسهيلات الأداء. سيعطيك المستشار الثمن المضبوط على واتساب.', c: ['conseiller'] },
    adresse: { fr: '100, Rue Al Hamam, Ancienne Médina, Khouribga\nTél. : 06 06 87 87 00 / 05 23 56 50 38\nAccueil : lundi au samedi, 9h à 19h', ar: '100 زنقة الحمام، المدينة القديمة، خريبكة\nالهاتف: 06 06 87 87 00 / 05 23 56 50 38\nالاستقبال: من الإثنين إلى السبت، 9:00 – 19:00', c: ['carte', 'conseiller'] },
    conseiller: { fr: 'Très bien. Appuyez sur le bouton vert : la conversation s’ouvre dans WhatsApp avec votre demande déjà écrite.', ar: 'ممتاز. اضغط على الزر الأخضر: ستفتح المحادثة في واتساب مع طلبك مكتوبا.', c: ['wa'] },
    inconnu: { fr: "Je n'ai pas de réponse exacte à cette question. Un conseiller peut vous répondre directement sur WhatsApp.", ar: 'ليس لدي جواب دقيق على هذا السؤال. يمكن لمستشار أن يجيبك مباشرة على واتساب.', c: ['wa', 'start'] }
  };
  const L = {
    filieres: { fr: 'Filières', ar: 'الشعب' }, courtes: { fr: 'Formations courtes', ar: 'تكوينات قصيرة' },
    inscription: { fr: 'Inscription', ar: 'التسجيل' }, frais: { fr: 'Frais', ar: 'الواجبات' },
    adresse: { fr: 'Adresse et horaires', ar: 'العنوان والتوقيت' }, conseiller: { fr: 'Parler à un conseiller', ar: 'التحدث مع مستشار' },
    dev: { fr: 'Développement informatique', ar: 'التنمية المعلوماتية' }, gestion: { fr: 'Gestion informatisée', ar: 'إعلاميات التدبير' },
    allemand: { fr: 'Allemand', ar: 'الألمانية' }, marketing: { fr: 'Digital Marketing', ar: 'التسويق الرقمي' },
    form: { fr: 'Remplir la pré-inscription', ar: 'ملء التسجيل الأولي' }, carte: { fr: 'Voir sur la carte', ar: 'عرض على الخريطة' },
    wa: { fr: 'Ouvrir WhatsApp', ar: 'فتح واتساب' }, start: { fr: 'Menu principal', ar: 'القائمة الرئيسية' }
  };
  const K = [
    [/prix|tarif|frais|co[uû]t|combien|paiement|ثمن|سعر|واجب|بشحال|شحال|التمن/i, 'frais'],
    [/allemand|deutsch|german|ألمان|الماني/i, 'allemand'],
    [/marketing|digital|r[ée]seaux|تسويق|ماركتينغ|ديجيتال/i, 'marketing'],
    [/informati|d[ée]velopp|programm|web|code|معلومي|برمجة|تنمية|برمج/i, 'dev'],
    [/gestion|compta|تدبير|محاسب|حسابات/i, 'gestion'],
    [/inscri|dossier|document|papiers|تسجيل|ملف|وثائق|نسجل/i, 'inscription'],
    [/adresse|o[uù] |lieu|horaire|heure|ouvert|carte|عنوان|فين|أين|وقت|ساعة|توقيت|بلاصة/i, 'adresse'],
    [/fili[eè]re|formation|bac|diplôme|شعب|تكوين|باك|دبلوم/i, 'filieres'],
    [/whatsapp|conseiller|appel|humain|واتساب|مستشار|اتصال/i, 'conseiller']
  ];
  const chat = document.getElementById('chat'), fab = document.getElementById('fab'), box = document.getElementById('msgs'), cwa = document.getElementById('cwa');
  let topic = '', question = '';
  const waHref = () => {
    const fr = root.lang === 'fr';
    let t = fr ? 'Bonjour ISIG, je viens de votre site web.' : 'السلام عليكم، أتواصل معكم من موقعكم الإلكتروني.';
    if (topic) t += (fr ? '\nSujet : ' : '\nالموضوع: ') + L[topic][root.lang];
    if (question) t += (fr ? '\nMa question : ' : '\nسؤالي: ') + question;
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t);
  };
  const scrollEnd = () => { box.scrollTop = box.scrollHeight; };
  const say = (who, text) => { const d = document.createElement('div'); d.className = 'm ' + who; d.textContent = text; box.appendChild(d); scrollEnd(); };
  const chipsFor = (list) => {
    const row = document.createElement('div'); row.className = 'chips';
    for (const id of list) {
      let el;
      if (id === 'wa' || id === 'carte') {
        el = document.createElement('a');
        el.href = id === 'wa' ? waHref() : 'https://www.google.com/maps/search/?api=1&query=100+Rue+Al+Hamam+Khouribga';
        if (id === 'wa') el.className = 'wa';
      } else {
        el = document.createElement('button'); el.type = 'button';
        el.addEventListener('click', () => pick(id, true));
      }
      el.textContent = L[id][root.lang];
      row.appendChild(el);
    }
    box.appendChild(row); scrollEnd();
  };
  const answer = (id) => {
    if (id !== 'start' && id !== 'inconnu' && id !== 'conseiller') topic = id;
    cwa.href = waHref();
    say('bot', N[id][root.lang]); chipsFor(N[id].c);
  };
  const pick = (id, fromChip) => {
    if (fromChip) say('me', L[id][root.lang]);
    if (id === 'form') { chat.classList.remove('on'); fab.setAttribute('aria-expanded', 'false'); const n = document.getElementById('nom'); if (n) { n.scrollIntoView({ block: 'center' }); n.focus(); } else { location.href = 'inscription.html'; } return; }
    const t = document.createElement('div'); t.className = 'm bot typing'; t.textContent = '…'; box.appendChild(t); scrollEnd();
    setTimeout(() => { t.remove(); answer(id); }, 450);
  };
  const reset = () => { box.textContent = ''; topic = ''; question = ''; cwa.href = waHref(); answer('start'); };
  const open = (o) => { chat.classList.toggle('on', o); fab.setAttribute('aria-expanded', String(o)); if (o) { if (!box.childElementCount) reset(); document.getElementById('cq').focus(); } };
  fab.addEventListener('click', () => open(!chat.classList.contains('on')));
  document.getElementById('cclose').addEventListener('click', () => { open(false); fab.focus(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && chat.classList.contains('on')) { open(false); fab.focus(); } });
  document.getElementById('cform').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('cq').value.trim(); if (!q) return;
    document.getElementById('cq').value = '';
    say('me', q); question = q;
    const hit = K.find(([re]) => re.test(q));
    pick(hit ? hit[1] : 'inconnu', false);
  });
  btn.addEventListener('click', () => { if (box.childElementCount) reset(); });
}
