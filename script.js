document.addEventListener('DOMContentLoaded', () => {
    const numCreaturesInput = document.getElementById('numCreatures');
    const toHitInput = document.getElementById('toHit');
    const diceSizeInput = document.getElementById('diceSize');
    const diceSizePreset = document.getElementById('diceSizePreset');
    const resultsBody = document.querySelector('#resultsTable tbody');

    const presetValues = ['20', '12', '10', '8', '6', '4'];

    diceSizePreset.addEventListener('change', () => {
        diceSizeInput.value = diceSizePreset.value.replace('d', '');
        toHitInput.max = diceSizeInput.value;
        updateResults();
    });

    diceSizeInput.addEventListener('input', () => {
        const value = diceSizeInput.value;
        const presetIndex = presetValues.indexOf(value);
        diceSizePreset.selectedIndex = presetIndex !== -1 ? presetIndex : -1;
        toHitInput.max = value;
        updateResults();
    });

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

    function getColorForProbability(prob, maxProb) {
        const ratio = maxProb > 0 ? prob / maxProb : 0;
        const hue = 30 + ratio * 90;
        return `hsl(${hue}, 80%, 45%)`;
    }

    function buildResultRows(minRolls, probabilities, diceSize, numMobs) {
        const rows = [];

        const zeroMaxRoll = minRolls[0] > diceSize ? diceSize : minRolls[0] - 1;
        if (1 <= zeroMaxRoll) {
            const rangeText = 1 === zeroMaxRoll ? '1' : `1-${zeroMaxRoll}`;
            rows.push({ range: rangeText, hits: 0, probability: probabilities[0] });
        }

        minRolls.forEach((roll, i) => {
            const minRoll = roll > diceSize ? diceSize + 1 : roll;
            const nextMinRoll = i === minRolls.length - 1 ? diceSize + 1 : (minRolls[i + 1] > diceSize ? diceSize + 1 : minRolls[i + 1]);
            const maxRoll = nextMinRoll - 1;

            if (minRoll <= diceSize && minRoll <= maxRoll) {
                const rangeText = minRoll === maxRoll ? `${minRoll}` : `${minRoll}-${maxRoll}`;
                rows.push({ range: rangeText, hits: i + 1, probability: probabilities[i + 1] });
            }
        });

        const maxProb = Math.max(...rows.map(r => r.probability));
        rows.forEach(row => {
            row.color = getColorForProbability(row.probability, maxProb);
        });

        return rows;
    }

    function updateResults() {
        const numMobs = Math.max(1, parseInt(numCreaturesInput.value) || 1);
        const toHit = Math.max(1, parseInt(toHitInput.value) || 1);
        const diceSize = Math.max(2, parseInt(diceSizeInput.value) || 2);

        numCreaturesInput.value = numMobs;
        toHitInput.value = toHit;
        diceSizeInput.value = diceSize;

        const { minRolls, probabilities } = calcMobHits(numMobs, toHit, diceSize);
        const rows = buildResultRows(minRolls, probabilities, diceSize, numMobs);

        resultsBody.innerHTML = rows.map(row =>
            `<tr><td>${row.range}</td><td>${row.hits}</td><td class="probability" style="color: ${row.color}">${(row.probability * 100).toFixed(1)}%</td></tr>`
        ).join('');
    }

    numCreaturesInput.addEventListener('input', updateResults);
    toHitInput.addEventListener('input', updateResults);

    updateResults();
});
