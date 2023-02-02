const chooseAtRandom = (options, skipOptionId) => {
    // Find Random Option
    let result = options[Math.floor(Math.random() * options.length)];
    // If we have more than one option, check if we should skip this option
    if (options.length > 1 && skipOptionId !== null && result.id === skipOptionId) {
        // Recursively get a different option
        return chooseAtRandom(options, skipOptionId);
    }
    return result;
}

const dateDifference = (stored, current) => {
    return (current - stored) / (3600 * 24);
}

module.exports = {
    dateDifference,
    chooseAtRandom
};