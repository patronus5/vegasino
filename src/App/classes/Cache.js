class Cache
{
	constructor(_reloadCallback, _cacheDuration)
	{	
        //init
        this.cachedData = null
        this.cacheDuration = _cacheDuration || 60
        this.reloadCallback = _reloadCallback
        this.lastReload = null        
	}

    async getData(_parameters, _forceReload)
    {
        if (_forceReload === undefined)
        {
            _forceReload = false
        }

        //reload
        if (_forceReload
            || this.lastReload === null
            || ((new Date()).getTime() - this.lastReload) / 1000 < this.cacheDuration)
        {
            this.cachedData = await this.reloadCallback(_parameters)
            this.lastReload = new Date()
        }

        return this.cachedData
    }
}

export default Cache;