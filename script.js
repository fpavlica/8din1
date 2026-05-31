document.addEventListener('DOMContentLoaded', () => {
    const numCreaturesInput = document.getElementById('numCreatures');
    const toHitInput = document.getElementById('toHit');
    const diceSizeInput = document.getElementById('diceSize');
    const resultsBody = document.querySelector('#resultsTable tbody');

    function comb(n, k) {
        if (k < 0 || k > n) return 0;
        let result = 1;
        for (let i = 0; i < k; i++) {
            result = result * (n - i) / (i + 1);
        }
        return result;
    }

    function calcMobHits(numMobs, toHitRoll, diceSize) {
        const hitProb = (diceSize + 1 - toHitRoll) / diceSize;
        const probNHits = [];
        for (let i = 0; i <= numMobs; i++) {
            probNHits.push(comb(numMobs, i) * Math.pow(hitProb, i) * Math.pow(1 - hitProb, numMobs - i));
        }

        const chunkSizes = probNHits.map(p => (diceSize + 1) * p);
        let accum = 0;
        const results = Array(numMobs).fill("Error");
        for (let i = 0; i < numMobs; i++) {
            accum += chunkSizes[i];
            results[i] = (Math.floor(1 + accum));
        }
        return { minRolls: results, probabilities: probNHits };
    }

    function updateResults() {
        const numMobs = Math.max(1, parseInt(numCreaturesInput.value) || 1);
        const toHit = Math.max(1, parseInt(toHitInput.value) || 1);
        const diceSize = Math.max(2, parseInt(diceSizeInput.value) || 2);

        numCreaturesInput.value = numMobs;
        toHitInput.value = toHit;
        diceSizeInput.value = diceSize;

        const { minRolls, probabilities } = calcMobHits(numMobs, toHit, diceSize);

        resultsBody.innerHTML = '';

        const zeroMaxRoll = minRolls[0] > diceSize ? diceSize : minRolls[0] - 1;
        if (1 <= zeroMaxRoll) {
            const rangeText = 1 === zeroMaxRoll ? '1' : `1-${zeroMaxRoll}`;
            resultsBody.innerHTML += `<tr><td>${rangeText}</td><td>0</td><td class="probability">${(probabilities[0] * 100).toFixed(1)}%</td></tr>`;
        }

        minRolls.forEach((roll, i) => {
            let accumProb = 0;
            for (let j = i + 1; j <= numMobs; j++) {
                accumProb += probabilities[j];
            }
            const prob = (accumProb * 100).toFixed(1);
            const minRoll = roll > diceSize ? diceSize + 1 : roll;
            const nextMinRoll = i === minRolls.length - 1 ? diceSize + 1 : (minRolls[i + 1] > diceSize ? diceSize + 1 : minRolls[i + 1]);
            const maxRoll = nextMinRoll - 1;

            if (minRoll <= diceSize && minRoll <= maxRoll) {
                const rangeText = minRoll === maxRoll ? `${minRoll}` : `${minRoll}-${maxRoll}`;
                resultsBody.innerHTML += `<tr><td>${rangeText}</td><td>${i + 1}</td><td class="probability">${prob}%</td></tr>`;
            }
        });
    }

    numCreaturesInput.addEventListener('input', updateResults);
    toHitInput.addEventListener('input', updateResults);
    diceSizeInput.addEventListener('input', updateResults);

    updateResults();
});
