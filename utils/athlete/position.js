const baseballPos = [
    {
        name: 'P',
        value: 'Pitcher'
    },
    {
        name: 'C',
        value: 'Catcher'
    },
    {
        name: '1B',
        value: 'First Baseman'
    },
    {
        name: '2B',
        value: 'Second Baseman'
    },
    {
        name: '3B',
        value: 'Third Baseman'
    },
    {
        name: 'SS',
        value: 'Short Stop'
    },
    {
        name: 'LF',
        value: 'Left Fielder'
    },
    {
        name: 'CF',
        value: 'Center Fielder'
    },
    {
        name: 'RF',
        value: 'Right Fielder'
    },
    {
        name: 'IF',
        value: 'InField'
    },
    {
        name: 'OF',
        value: 'OutField'
    },
    {
        name: 'SP',
        value: 'Starting Pitcher'
    },
    {
        name: 'MRP',
        value: 'Middle Relief Pitcher'
    },
    {
        name: 'LRP',
        value: 'Long Relief Pitcher'
    },
    {
        name: 'RP',
        value: 'Relief Pitcher'
    },
    {
        name: 'CP',
        value: 'Closing Pitcher'
    },
    {
        name: 'DH',
        value: 'Designated Hitter'
    },
    {
        name: 'PH',
        value: 'Pinch Hitter'
    },
    {
        name: 'PR',
        value: 'Pinch Runner'
    },
]

export const position = (sport, pos) => {
    if (sport === 'baseball') {
        const filteredPos = baseballPos.filter(item => item.name === pos)

        if (filteredPos.length > 0) {
            return filteredPos.value
        } else {
            return pos
        }
    } else {
        return pos
    }
}