# Mob Hit Dice Calculator

A web tool for calculating mob attack probabilities in tabletop RPGs. Instead of rolling dice for each creature in a mob, this calculator determines a single die roll that maps to how many creatures hit based on probability distributions.

## How It Works

Enter the number of creatures in the mob, the roll needed to hit, and the dice size. The calculator uses binomial probability to determine ranges of die results that correspond to different numbers of hits.

For example, with 8 creatures needing a 15+ to hit on a d20:
- Roll 1-10: 0 hits (most likely)
- Roll 11-14: 1 hit
- Roll 15-17: 2 hits
- Roll 18-20: 3+ hits

## Usage

Open `index.html` in a web browser. No server required.

### Inputs
- **Number of creatures**: How many creatures are attacking (1-20)
- **Creature roll needed to hit**: The minimum die roll for a single creature to hit
- **Dice size**: Select a standard die (d4, d6, d8, d10, d12, d20) or enter a custom value

### Output Table
- **Roll Range**: The range of die results
- **Hits**: Number of creatures that hit for that range
- **Probability**: Chance of that outcome (color-coded from orange/low to green/high)

## Files
- `index.html` - Main HTML structure
- `styles.css` - Styling
- `script.js` - Calculation logic and UI updates
