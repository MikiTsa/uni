const { User } = require('../models');

const adjustTrustScore = async (userId, delta, reason = '') => {
    try {
        const user = await User.findByPk(userId);
        if (!user) return;

        user.trustScore += delta;

        if (user.trustScore >= 10 && user.role !== 'trusted') {
            user.role = 'trusted';
            console.log(`User ${userId} is now a trusted user!`);
        }

        await user.save();

        console.log(`[trustScore] User ${userId}: ${delta > 0 ? '+' : ''}${delta} | ${reason}`);
    } catch (err) {
        console.error(`[trustScore] Error updating trustScore: ${err.message}`);
    }
};

module.exports = { adjustTrustScore };
