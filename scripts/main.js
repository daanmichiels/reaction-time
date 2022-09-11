function go() {
    let nRows = 3;
    let nCols = 3;
    let tiles = [];
    let grid = document.getElementById('grid');
    let status = 'info';
    let hits = 0;
    let misses = 0;
    let previousTargetRow;
    let previousTargetCol;
    let targetRow;
    let targetCol;
    let duration;

    for (let r=0; r<nRows; ++r) {
        let row = [];
        for (let c=0; c<nCols; ++c) {
            let tile = document.createElement('div');
            tile.classList.add('tile');
            tile.addEventListener('touchstart', (ev) => {
                ev.preventDefault();
                handleClick(r, c);
            });
            tile.addEventListener('click', () => handleClick(r, c));
            row.push(tile);
            grid.appendChild(tile);
        }
        tiles.push(row);
    }

    let infoWrapper = document.getElementById('info-wrapper');
    let infoMessage = document.getElementById('info-message');
    let infoButtons = document.getElementById('info-buttons');
    let progressFill = document.getElementById('progress-fill');

    let progressBackgroundTimeout;

    let btns = infoButtons.children;
    for (let i=0; i<btns.length; ++i) {
        let btn = btns[i];
        let dur = parseInt(btn.id.split('-')[1]);
        btn.addEventListener('click', () => runGamePhase0(dur));
    }

    function stopGame() {
        status = 'info';
        tiles[targetRow][targetCol].classList.remove('active');
        infoMessage.innerHTML = `<p>You scored ${hits - misses} points!<br>Duration: ${duration} seconds.</p><p>Hits: ${hits}<br>Misses: ${misses}</p>`;
        infoWrapper.style.display = 'flex';
    }

    function runGamePhase1() {
        hits = 0;
        misses = 0;
        status = 'running';
        setTimeout(stopGame, duration * 1000);
        let r = Math.floor(Math.random() * nRows);
        let c = Math.floor(Math.random() * nCols);
        tiles[r][c].classList.add('active');
        targetRow = r;
        targetCol = c;
        previousTargetRow = -1;
        previousTargetCol = -1;
        progressFill.style.transition = `width ${duration}s linear`;
        progressFill.style.width = '100%';
    }

    function runGamePhase0(dur) {
        console.log('info click');
        duration = dur;
        status = 'getting_ready';
        setTimeout(() => runGamePhase1(), 3000);
        infoWrapper.style.display = 'none';
        progressFill.style.transition = `width 3s linear`;
        progressFill.style.width = '0';
    }

    function handleClick(r, c) {
        console.log('click', r, c);

        if (status === 'running') {
            if (targetCol === c && targetRow === r) {
                hits += 1;
                tiles[r][c].classList.remove('active');
                let r_ = r;
                let c_ = c;
                while (r_ === r && c_ === c) {
                    r_ = Math.floor(Math.random() * nRows);
                    c_ = Math.floor(Math.random() * nCols);
                }
                previousTargetRow = r;
                previousTargetCol = c;
                tiles[r_][c_].classList.add('active');
                targetRow = r_;
                targetCol = c_;

                if (progressBackgroundTimeout)
                    clearTimeout(progressBackgroundTimeout);
                progressFill.style.transition = removeBgColorTransition(progressFill.style.transition);
                progressFill.style.backgroundColor = 'green';
                progressBackgroundTimeout = setTimeout(() => {
                    progressFill.style.transition = addBgColorTransition(progressFill.style.transition);
                    progressFill.style.backgroundColor = 'orange';
                }, 0);
            } else if (previousTargetRow >= 0) {
                if (previousTargetCol === c && previousTargetRow === r)
                    return;
                misses += 1;
                progressFill.style.transition = removeBgColorTransition(progressFill.style.transition);
                progressFill.style.backgroundColor = 'red';
                progressBackgroundTimeout = setTimeout(() => {
                    progressFill.style.transition = addBgColorTransition(progressFill.style.transition);
                    progressFill.style.backgroundColor = 'orange';
                }, 0);
            }
        }
    }

    function removeBgColorTransition(transition) {
        let parts = transition.split(',');
        parts = parts.filter(item => !item.includes('background-color'));
        return parts.join(',');
    }

    function addBgColorTransition(transition) {
        let parts = transition.split(',');
        parts = parts.filter(item => !item.includes('background-color'));
        parts.push('background-color 0.3s ease');
        return parts.join(',');
    }
}