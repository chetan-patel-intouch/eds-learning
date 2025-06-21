// Modernized version of the legacy mouse-following analog clock
if (document.getElementById && !document.layers) {
    // === CONFIGURATION ===
    const dCol = 'maroon'; // Date color
    const fCol = 'magenta'; // Face color
    const sCol = 'cadetblue'; // Seconds color
    const mCol = 'blue'; // Minutes color
    const hCol = 'maroon'; // Hours color
    const del = 0.6; // Follow mouse speed
    const ref = 40;   // Run speed (ms)

    const isIE = typeof window.innerWidth !== "number";
    const compatMode = document.compatMode;
    const isCSS1Compat = compatMode && compatMode.indexOf("CSS") !== -1;
    const ieRef = isIE && isCSS1Compat ? document.documentElement : document.body;

    const theDays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const theMonths = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

    const now = new Date();
    let day = now.getDate();
    let year = now.getFullYear();

    const dateString = ` ${theDays[now.getDay()]} ${day} ${theMonths[now.getMonth()]} ${year}`;
    const D = dateString.split("");
    const N = "3 4 5 6 7 8 9 10 11 12 1 2".split(" ");
    const F = N.length;
    const H = "...".split("");
    const M = "....".split("");
    const S = ".....".split("");

    const siz = 40;
    const eqf = 360 / F;
    const eqd = 360 / D.length;
    const han = siz / 5.5;
    const ofy = -7;
    const ofx = -3;
    const ofst = -120;
    let vis = true;
    let mouseY = 200, mouseX = 100;

    const sum = D.length + F + H.length + M.length + S.length + 1;
    const dy = Array(sum).fill(0);
    const dx = Array(sum).fill(0);
    const zy = Array(sum).fill(0);
    const zx = Array(sum).fill(0);

    const tmpd = [], tmpf = [], tmph = [], tmpm = [], tmps = [], algn = [];

    function createDiv(id, className, color, fontSize, text) {
        const el = document.createElement("div");
        el.id = id;
        el.className = className;
        el.style.position = "absolute";
        el.style.color = color;
        if (fontSize) el.style.fontSize = fontSize;
        el.textContent = text;
        document.body.appendChild(el);
        return el.style;
    }

    for (let i = 0; i < D.length; i++) {
        algn[i] = isNaN(parseInt(D[i])) ? 11 : 12;
        tmpd[i] = createDiv(`_date${i}`, "css2", dCol, `${algn[i]}px`, D[i]);
    }
    for (let i = 0; i < F; i++) {
        tmpf[i] = createDiv(`_face${i}`, "css2", fCol, null, N[i]);
    }
    for (let i = 0; i < H.length; i++) {
        tmph[i] = createDiv(`_hours${i}`, "css1", hCol, null, H[i]);
    }
    for (let i = 0; i < M.length; i++) {
        tmpm[i] = createDiv(`_minutes${i}`, "css1", mCol, null, M[i]);
    }
    for (let i = 0; i < S.length; i++) {
        tmps[i] = createDiv(`_seconds${i}`, "css1", sCol, null, S[i]);
    }

    function updateMouse(e) {
        const scrollY = isIE ? 0 : window.pageYOffset;
        e = e || window.event;
        mouseY = (e.pageY || e.clientY) + ofst - scrollY;
        mouseX = (e.pageX || e.clientX) - (ofst/70);
        if (!vis) kill();
    }

    function kill() {
        document.onmousemove = vis ? updateMouse : null;
    }

    function ClockAndAssign() {
        const time = new Date();
        const sec = (Math.PI * (time.getSeconds() - 15)) / 30;
        const min = (Math.PI * (time.getMinutes() - 15)) / 30;
        const hr = (Math.PI * ((time.getHours() % 12) - 3)) / 6 + (Math.PI * time.getMinutes()) / 360;
        const scrollY = isIE ? ieRef.scrollTop : window.pageYOffset;

        for (let i = 0; i < S.length; i++) {
            const idx = D.length + F + H.length + M.length + i;
            tmps[i].top = `${dy[idx] + ofy + i * han * Math.sin(sec) + scrollY}px`;
            tmps[i].left = `${dx[idx] + ofx + i * han * Math.cos(sec)}px`;
        }
        for (let i = 0; i < M.length; i++) {
            const idx = D.length + F + H.length + i;
            tmpm[i].top = `${dy[idx] + ofy + i * han * Math.sin(min) + scrollY}px`;
            tmpm[i].left = `${dx[idx] + ofx + i * han * Math.cos(min)}px`;
        }
        for (let i = 0; i < H.length; i++) {
            const idx = D.length + F + i;
            tmph[i].top = `${dy[idx] + ofy + i * han * Math.sin(hr) + scrollY}px`;
            tmph[i].left = `${dx[idx] + ofx + i * han * Math.cos(hr)}px`;
        }
        for (let i = 0; i < F; i++) {
            const angle = (i * eqf * Math.PI) / 180;
            tmpf[i].top = `${dy[D.length + i] + siz * Math.sin(angle) + scrollY}px`;
            tmpf[i].left = `${dx[D.length + i] + siz * Math.cos(angle)}px`;
        }
        for (let i = 0; i < D.length; i++) {
            const angle = sec + (i * eqd * Math.PI) / 180;
            tmpd[i].top = `${dy[i] + siz * 1.5 * Math.sin(angle) + scrollY}px`;
            tmpd[i].left = `${dx[i] + siz * 1.5 * Math.cos(angle)}px`;
        }
    }

    function Delay() {
        const scrollY = isIE ? ieRef.scrollTop : window.pageYOffset;
        if (!vis) {
            dy[0] = dx[0] = -100;
        } else {
            zy[0] = Math.round(dy[0] += (mouseY - dy[0]) * del);
            zx[0] = Math.round(dx[0] += (mouseX - dx[0]) * del);
        }
        for (let i = 1; i < sum; i++) {
            if (!vis) {
                dy[i] = dx[i] = -100;
            } else {
                zy[i] = Math.round(dy[i] += (zy[i - 1] - dy[i]) * del);
                zx[i] = Math.round(dx[i] += (zx[i - 1] - dx[i]) * del);
            }
        }
        ClockAndAssign();
        setTimeout(Delay, ref);
    }

    document.onmousemove = updateMouse;
    window.onload = Delay;
}
