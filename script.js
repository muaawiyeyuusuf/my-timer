const el = id => document.getElementById(id);
let workTime = 25, breakTime = 5, time = workTime * 60, isWork = true, interval, isRunning = false;
let sessions = parseInt(localStorage.getItem('sessions') || 0);
let sound = localStorage.getItem('sound') || 'beep';

const nav = (id) => {
    document.querySelectorAll('.page-Section').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    el(id).classList.add('active');
    if (el(`nav-${id}`)) el(`nav-${id}`).classList.add('active');

    // Close mobile menu on navigate
    el('hamburger').classList.remove('active');
    el('nav-menu').classList.remove('active');
};
window.showPage = nav; // Expose to HTML

// Hamburger Logic
el('hamburger').onclick = () => {
    el('hamburger').classList.toggle('active');
    el('nav-menu').classList.toggle('active');
};

const update = () => {
    const m = Math.floor(time / 60), s = time % 60;
    el('timer-display').textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    document.title = `${el('timer-display').textContent} - Pomodoro`;
};

const toggle = (run) => {
    isRunning = run;
    el('start-btn').disabled = run;
    el('pause-btn').disabled = !run;
    el('apply-btn').disabled = run;
    if (run) interval = setInterval(tick, 1000);
    else clearInterval(interval);
};

const tick = () => {
    time--;
    update();
    if (time <= 0) {
        toggle(false);
new Audio(`${sound}.mp3`).play()
        if (isWork) {
            sessions++;
            localStorage.setItem('sessions', sessions);
            el('session-count').textContent = sessions;
        }
        setTimeout(() => alert(isWork ? "Break Time!" : "Work Time!"), 500);
        isWork = !isWork;
        time = (isWork ? workTime : breakTime) * 60;
        el('mode-text').textContent = isWork ? "Work Time" : "Break Time";
        update();
    }
};

const reset = () => {
    toggle(false);
    isWork = true;
    time = workTime * 60;
    el('mode-text').textContent = "Work Time";
    update();
};

el('start-btn').onclick = () => isRunning || toggle(true);
el('pause-btn').onclick = () => isRunning && toggle(false);
el('reset-btn').onclick = reset;

el('apply-btn').onclick = () => {
    const w = parseInt(el('work-min').value), b = parseInt(el('break-min').value);
    if (w > 0 && b > 0) {
        workTime = w; breakTime = b;
        alert("Settings Saved!");
        reset();
    } else alert("Invalid input");
};

el('clear-stats-btn').onclick = () => {
    sessions = 0; localStorage.removeItem('sessions');
    el('session-count').textContent = 0;
    alert("Stats Cleared");
};

if (el('sound-select')) {
    el('sound-select').value = sound;
    el('sound-select').onchange = (e) => {
        sound = e.target.value;
        localStorage.setItem('sound', sound);
new Audio(`${sound}.mp3`).play()
    };
}

// Init
el('work-min').value = workTime;
el('break-min').value = breakTime;
el('session-count').textContent = sessions;
update();
