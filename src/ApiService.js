export default class DbService{
	_apiBase = 'https://www.boredapi.com/api/';

	getResource = async (url) => {
		const res = await fetch(this._apiBase + url);
		if(!res.ok){
			throw new Error(`Could not fetch ${url}, received ${res.status}`);
		}
		return await res;
	};

	getTaskOfTheDay = async () => {
		const res = await this.getResource('activity');
		return res.json();
	}
	getTask = async (type, participants) => {
		const res = await this.getResource(`activity?type=${type}&participants=${participants}`);
		return res.json();
	}
	
}