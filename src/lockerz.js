//LockerService class that can be instantiated with number of different types of lockers
module.exports.LockerService = function(numSmallLockers, numMediumLockers, numLargeLockers) {
    var lockers = { SMALL: {}, MEDIUM: {}, LARGE: {}, acquired: {} }; //SMALL/MEDIUM/LARGE associative arrays hold the respective lockers. acquired holds the occupied locker.

    //init function initializes all the locker types
    function init(smallCount, mediumCount, largeCount) {
        var i, lockerId;
        for(i = 0; i < smallCount; i++) {
            lockerId = 'SMALL-' + i;
            lockers.SMALL[lockerId] = { type: 'SMALL', id: lockerId };
        }

        for(i = 0; i < mediumCount; i++) {
            lockerId = 'MEDIUM-' + i;
            lockers.MEDIUM[lockerId] = { type: 'MEDIUM', id: lockerId };
        }

        for(i = 0; i < largeCount; i++) {
            lockerId = 'LARGE-' + i;
            lockers.LARGE[lockerId] = { type: 'LARGE', id: lockerId };
        }
    }

    //Private function that returns the first available locker in a given set of lockers
    function getLocker(lockers) {
        var ret = null;
        for(var locker in lockers) {
            if(lockers.hasOwnProperty(locker)) {
                ret = lockers[locker];
                delete lockers[locker];
                break;
            }
        }
        return ret;
    }

    this.acquireLocker = function(type) {
        var locker = null;
        switch (type) {
            case 'SMALL':
                locker = getLocker(lockers.SMALL);
                if(!locker) locker = getLocker(lockers.MEDIUM);
                if(!locker) locker = getLocker(lockers.LARGE);
                break;
            case 'MEDIUM':
                locker = getLocker(lockers.MEDIUM);
                if(!locker) locker = getLocker(lockers.LARGE);
                break;
            case 'LARGE':
                locker = getLocker(lockers.LARGE);
                break;
            default: locker = null; //We could throw an exception, depending on the style!!!
        }

        if(locker) lockers.acquired[locker.id] = locker;
        return locker ? locker.id : null;
    };

    this.releaseLocker = function(ticketId) {
        var locker = lockers.acquired[ticketId];
        if(!locker) {
            return false;
        }

        switch (locker.type) {
            case 'SMALL':
                lockers.SMALL[locker.id] = locker;
                break;
            case 'MEDIUM':
                lockers.MEDIUM[locker.id] = locker;
                break;
            case 'LARGE':
                lockers.LARGE[locker.id] = locker;
                break;
        }
        delete lockers.acquired[ticketId];
        return true;
    };

    this.isAcquired = function(ticketId) {
        return lockers.acquired[ticketId] ? true : false;
    };

    this.isReleased = function(ticketId) {
        return !this.isAcquired(ticketId);
    };

    init(numSmallLockers, numMediumLockers, numLargeLockers);
};
