//////////////////////////////////////////
//LLib
import * as moment from 'moment';

export const LLib =
{
	// Create our number formatter.
	shortFormatter: new Intl.NumberFormat(navigator.language, {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
		minimumFractionDigits: 0
	}),
	formatter: new Intl.NumberFormat(navigator.language, {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 16,
		minimumFractionDigits: 2
	}),
	formatterNoDecimal: new Intl.NumberFormat(navigator.language, {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 16,
		minimumFractionDigits: 0
	}),
	formatDecimal: function(_value, _minDecimals = 2, _maxDecimals = 18) {
		const formatter = new Intl.NumberFormat
			(navigator.language, 
				{
					maximumFractionDigits: _maxDecimals,
					minimumFractionDigits: _minDecimals
				});

		return formatter.format(_value);
	},

	//////////////////////////////////////////
	//helper

	defaultUndefined: function(_value, _default)
	{
		return (_value === undefined ? _default : _value);
	},

	subscribeEvents: function(_events, _callback)
	{
		for (let n = 0; n < _events.length; n++)
		{
			document.addEventListener(_events[n], _callback);
		}
	},

	unsubscribeEvents: function(_events, _callback)
	{
		for (let n = 0; n < _events.length; n++)
		{
			document.removeEventListener(_events[n], _callback);
		}
	},

	//////////////////////////////////////////
	//smart format	
	
	smartFormatPercent: function(_value, _shorten, _minDecimals, _maxDecimals)
	{
		if (_value > 999)
		{
			return '> 999%'
		}

		if (_minDecimals && _minDecimals > (_maxDecimals ?? 2)) 
		{
			_maxDecimals = _minDecimals;
		}
		
		const minDecimals = _shorten ? 0 : 2;

		let val = this.formatDecimal(_value, _minDecimals ?? minDecimals, _maxDecimals ?? 2);

		return val + '%'
	},

	smartFormatFloat: function(_value, _shorten)
	{
		let val = parseFloat(_value)

		if (val < 1)
		{
			val = val.toFixed(4)
		}
		else if (val > 10000)
		{
			val = val.toFixed(1)
		}
		else
		{
			val = val.toFixed(2)
		}

		if (_shorten)
		{
			val = parseFloat(val)
		}

		return val
	},

	smartFormatFloatDisplay: function(_value, _shorten, _minDecimals, _maxDecimals) 
	{
		const raw = this.smartFormatFloat(_value);

		let maxDecimals = 16;

		if (raw < 1) 
		{
			maxDecimals = 4;
		}
		else if (raw > 10000)
		{
			maxDecimals = 1;
		}
		else
		{
			maxDecimals = 2;
		}

		const minDecimals = _shorten ? 0 : maxDecimals;
		
		return this.formatDecimal(_value, _minDecimals ?? minDecimals, _maxDecimals ?? maxDecimals);
	},

	smartFormatMultiplicator: function(_value, _shorten)
	{
		let val = parseFloat(_value / 100).toFixed(2);
		if (_shorten)
		{
			val = parseFloat(val)
		}		

		const minDecimals = _shorten ? 0 : 2;

		val = this.formatDecimal(val, minDecimals, 2);
		return 'x ' + val
	},

	//////////////////////////////////////////	

	stringKeep: function(_string, _keep)
	{
		let r = "";
		for (let n = 0; n < _string.length; n++)
		{
			if (_string[n] === _keep)
			{
				r += _string[n]
			}			
		}
		
		return r
	},
	
	fetch: async function(_url)
	{
		return await fetch(_url)
	},
	
	fetchJSON: async function(_url)
	{
		const ret = await this.fetch(_url)
		const ret_text = await ret.text()			
		try
		{
			return JSON.parse(ret_text.split("/*")[0])
		}
		catch (e)
		{
			console.log(`Can't parse JSON [${_url}]`)
			throw e
		}		
	},

	fetchFromForm: async function(_url, _formData)
	{
		return await fetch(_url,
		{
			method: 'POST',
			body: _formData
		})
	},

	fetchJSONFromForm: async function(_url, _formData,)
	{
		const ret = await this.fetchFromForm(_url, _formData)
		const ret_text = await ret.text()			
		try
		{
			return JSON.parse(ret_text.split("/*")[0])
		}
		catch (e)
		{
			console.log(`Can't parse JSON [${_url}]`)
			throw e
		}	
	},
	
	getVersion(_version)
	{
		let s = _version.split(".")		
		return {
			major: parseInt(s[0]),
			minor: parseInt((s.length >= 2 ? s[1] : 0)),
			revision: parseInt((s.length >= 3 ? s[2] : 0))
		}
	},
	
	getDateTimeFromDB(_string)
	{			
		if (isNaN(_string))
		{
			const dts = _string.split(" ")
			const dtStr = dts[0] + "T" + (dts.length > 1 ? dts[1] : "23:59:59") + ".000"
			const dt = new Date(Date.parse(dtStr))
			return dt
		} else
		{
			return new Date(parseInt(_string) * 1000);
		}
	},

	async measureTime(_topic, _action)
	{
		const tS = new Date()
		await _action()
		const tE = new Date()
		const tD = (tE.getTime() - tS.getTime())
		console.log(`${_topic}: ${tD}ms`)
	},
	
	checkRequiredVersion(_version, _major, _minor, _revision)
	{
		//default
		if (_revision === undefined)
		{
			_revision = 0
		}
		if (_minor === undefined)
		{
			_minor = 0
		}
		if (_major === undefined)
		{
			_major = 0
		}
		
		//check
		if (_version.major > _major
			|| (_version.major === _major
				&& _version.minor > _minor)
			|| (_version.major === _major
				&& _version.minor === _minor
				&& _version.revision >= _revision))
		{
			return true;
		}
		return false;		
	},
	
	removeTrailStart: function(_string, _remove)
	{
		return this.removeTrail(_string, _remove, true)
	},
	
	removeTrailEnd: function(_string, _remove)
	{
		return this.removeTrail(_string, _remove, false)
	},
	
	removeTrail: function(_string, _remove, _start)
	{
		let o = 0;
		if (!!_start)
		{
			//find first different from start
			for (let n = 0; n < _string.length; n++)
			{
				if (_string[n] !== _remove)
				{
					break
				}
				o += 1;
			}
		}
		else
		{
			//find first different from end
			for (let n = _string.length - 1; n >= 0; n--)
			{
				if (_string[n] !== _remove)
				{
					break
				}
				o += 1;			
			}			
		}

		//sbstring
		if (o >= _string.length)
		{
			return ""
		}
		return (_start ? _string.substring(o) : _string.substring(0, _string.length - o))
	},
	
	getHMS: function(_seconds, _showHMS)
	{
		let ret = "";
		
		//seconds
		let s = parseInt(_seconds) % 60
		_seconds /= 60
		
		//minutes
		let m = parseInt(_seconds) % 60
		_seconds /= 60
		
		//hours
		let h = parseInt(_seconds)
		
		//build string
		if (h > 0)
		{
			ret += h.toString() + (!!_showHMS ? "h" : "")
		}
		if (m > 0)
		{
			if (ret !== "")
			{
				ret += (!!_showHMS ? " " : ":")
			}
			ret += m.toString().padStart((ret !== "" && !_showHMS ? 2 : 1), "0") + (!!_showHMS ? "m" : "")
		}
		if (s >= 0)
		{
			if (ret !== "")
			{
				ret += (!!_showHMS ? " " : ":")
			}
			ret += s.toString().padStart((ret !== "" && !_showHMS ? 2 : 1), "0") + (!!_showHMS ? "s" : "")
		}		
		
		return ret;
	},
	
	renderLoading: function(_init, _content)
	{
		if (!!_init)
		{
			return _content
		}
		
		return (
			<>
				<span className="loading">???</span>
			</>
		)
	},

	getCookie: function(_name, _defaultValue)
	{
		const cookies = document.cookie.split(';');
		let cookiePairs = []
		cookies.forEach(c =>
		{
			const pair = c.split('=');			
			cookiePairs.push(
			{
				name: pair[0].replace(' ', ''),
				value: pair[1]
			});
		});

		const c = cookiePairs.find(cp => cp.name === _name);		
		if (!!c)
		{
			return c.value;
		}
		return _defaultValue;
	},

	setCookie: function(_name, _value, _days)
	{
		let expires = "";
    	if (_days)
		{
        	let date = new Date();
        	date.setTime(date.getTime() + (_days * 24 * 60 * 60 * 1000));
        	expires = "; expires=" + date.toUTCString();
		}
		document.cookie = _name + "=" + (_value || "")  + expires + "; path=/";		
	},

	setStorage: function(_sessionOnly, _name, _value)
	{
		if (_sessionOnly)
		{
			sessionStorage.setItem(_name, _value);
		}
		else
		{
			localStorage.setItem(_name, _value);
		}
	},

	getStorage: function(_sessionOnly, _name, _defaultValue)
	{
		let value = undefined;
		if (_sessionOnly)
		{
			value = sessionStorage.getItem(_name);
		}
		else
		{
			value = localStorage.getItem(_name);
		}

		return (value === null || value === undefined ? _defaultValue : value);
	},

	getStorage_bool: function(_sessionOnly, _name, _defaultValue)
	{
		const val = this.getStorage(_sessionOnly, _name, _defaultValue);
		return (val === _defaultValue ? val : val === "true");
	},
	
	getStorage_int: function(_sessionOnly, _name, _defaultValue)
	{
		const val = this.getStorage(_sessionOnly, _name, _defaultValue);
		return (val === _defaultValue ? val : parseInt(val));
	},

	getStorage_float: function(_sessionOnly, _name, _defaultValue)
	{
		const val = this.getStorage(_sessionOnly, _name, _defaultValue);
		return (val === _defaultValue ? val : parseFloat(val));
	},

	formatFiat: function(_amount, _useRegional = true, _smartFormat)
	{
		_amount = _amount ?? 0;

		if (_smartFormat)
		{
			let shorten = false;
			if (typeof _smartFormat.shorten === "boolean")
			{
				shorten = _smartFormat.shorten;
			}

			_amount = this.smartFormatFloat(_amount, shorten);
		}

		if (_useRegional)
		{
			if (_amount % 1 !== 0) {
				return this.formatter.format(_amount);
			} else {
				return this.formatterNoDecimal.format(_amount);
			}
		}

		return _amount;
	},

	formatDate: function(_date, _includeTime = false, _includeSeconds = false) {
		const baseFormat = this.getLocaleDateString();

		const formatString = _includeTime ?
			(_includeSeconds ? `${baseFormat} LTS` : `${baseFormat} LT`) :
			baseFormat;

		return moment(_date).format(formatString);
	},

	formatTime: function(_date, _includeSeconds = false)
	{
		const formatString = (_includeSeconds ? `LTS` : `LT`);
		return moment(_date).format(formatString);
	},

	getLocaleDateString: function() {
		const formats = {
		  "af-ZA": "yyyy/MM/dd",
		  "am-ET": "d/M/yyyy",
		  "ar-AE": "dd/MM/yyyy",
		  "ar-BH": "dd/MM/yyyy",
		  "ar-DZ": "dd-MM-yyyy",
		  "ar-EG": "dd/MM/yyyy",
		  "ar-IQ": "dd/MM/yyyy",
		  "ar-JO": "dd/MM/yyyy",
		  "ar-KW": "dd/MM/yyyy",
		  "ar-LB": "dd/MM/yyyy",
		  "ar-LY": "dd/MM/yyyy",
		  "ar-MA": "dd-MM-yyyy",
		  "ar-OM": "dd/MM/yyyy",
		  "ar-QA": "dd/MM/yyyy",
		  "ar-SA": "dd/MM/yy",
		  "ar-SY": "dd/MM/yyyy",
		  "ar-TN": "dd-MM-yyyy",
		  "ar-YE": "dd/MM/yyyy",
		  "arn-CL": "dd-MM-yyyy",
		  "as-IN": "dd-MM-yyyy",
		  "az-Cyrl-AZ": "dd.MM.yyyy",
		  "az-Latn-AZ": "dd.MM.yyyy",
		  "ba-RU": "dd.MM.yy",
		  "be-BY": "dd.MM.yyyy",
		  "bg-BG": "dd.M.yyyy",
		  "bn-BD": "dd-MM-yy",
		  "bn-IN": "dd-MM-yy",
		  "bo-CN": "yyyy/M/d",
		  "br-FR": "dd/MM/yyyy",
		  "bs-Cyrl-BA": "d.M.yyyy",
		  "bs-Latn-BA": "d.M.yyyy",
		  "ca-ES": "dd/MM/yyyy",
		  "co-FR": "dd/MM/yyyy",
		  "cs-CZ": "d.M.yyyy",
		  "cy-GB": "dd/MM/yyyy",
		  "da-DK": "dd-MM-yyyy",
		  "de-AT": "dd.MM.yyyy",
		  "de-CH": "dd.MM.yyyy",
		  "de-DE": "dd.MM.yyyy",
		  "de-LI": "dd.MM.yyyy",
		  "de-LU": "dd.MM.yyyy",
		  "dsb-DE": "d. M. yyyy",
		  "dv-MV": "dd/MM/yy",
		  "el-GR": "d/M/yyyy",
		  "en-029": "MM/dd/yyyy",
		  "en-AU": "d/MM/yyyy",
		  "en-BZ": "dd/MM/yyyy",
		  "en-CA": "dd/MM/yyyy",
		  "en-GB": "dd/MM/yyyy",
		  "en-IE": "dd/MM/yyyy",
		  "en-IN": "dd-MM-yyyy",
		  "en-JM": "dd/MM/yyyy",
		  "en-MY": "d/M/yyyy",
		  "en-NZ": "d/MM/yyyy",
		  "en-PH": "M/d/yyyy",
		  "en-SG": "d/M/yyyy",
		  "en-TT": "dd/MM/yyyy",
		  "en-US": "M/d/yyyy",
		  "en-ZA": "yyyy/MM/dd",
		  "en-ZW": "M/d/yyyy",
		  "es-AR": "dd/MM/yyyy",
		  "es-BO": "dd/MM/yyyy",
		  "es-CL": "dd-MM-yyyy",
		  "es-CO": "dd/MM/yyyy",
		  "es-CR": "dd/MM/yyyy",
		  "es-DO": "dd/MM/yyyy",
		  "es-EC": "dd/MM/yyyy",
		  "es-ES": "dd/MM/yyyy",
		  "es-GT": "dd/MM/yyyy",
		  "es-HN": "dd/MM/yyyy",
		  "es-MX": "dd/MM/yyyy",
		  "es-NI": "dd/MM/yyyy",
		  "es-PA": "MM/dd/yyyy",
		  "es-PE": "dd/MM/yyyy",
		  "es-PR": "dd/MM/yyyy",
		  "es-PY": "dd/MM/yyyy",
		  "es-SV": "dd/MM/yyyy",
		  "es-US": "M/d/yyyy",
		  "es-UY": "dd/MM/yyyy",
		  "es-VE": "dd/MM/yyyy",
		  "et-EE": "d.MM.yyyy",
		  "eu-ES": "yyyy/MM/dd",
		  "fa-IR": "MM/dd/yyyy",
		  "fi-FI": "d.M.yyyy",
		  "fil-PH": "M/d/yyyy",
		  "fo-FO": "dd-MM-yyyy",
		  "fr-BE": "d/MM/yyyy",
		  "fr-CA": "yyyy-MM-dd",
		  "fr-CH": "dd.MM.yyyy",
		  "fr-FR": "dd/MM/yyyy",
		  "fr-LU": "dd/MM/yyyy",
		  "fr-MC": "dd/MM/yyyy",
		  "fy-NL": "d-M-yyyy",
		  "ga-IE": "dd/MM/yyyy",
		  "gd-GB": "dd/MM/yyyy",
		  "gl-ES": "dd/MM/yy",
		  "gsw-FR": "dd/MM/yyyy",
		  "gu-IN": "dd-MM-yy",
		  "ha-Latn-NG": "d/M/yyyy",
		  "he-IL": "dd/MM/yyyy",
		  "hi-IN": "dd-MM-yyyy",
		  "hr-BA": "d.M.yyyy.",
		  "hr-HR": "d.M.yyyy",
		  "hsb-DE": "d. M. yyyy",
		  "hu-HU": "yyyy. MM. dd.",
		  "hy-AM": "dd.MM.yyyy",
		  "id-ID": "dd/MM/yyyy",
		  "ig-NG": "d/M/yyyy",
		  "ii-CN": "yyyy/M/d",
		  "is-IS": "d.M.yyyy",
		  "it-CH": "dd.MM.yyyy",
		  "it-IT": "dd/MM/yyyy",
		  "iu-Cans-CA": "d/M/yyyy",
		  "iu-Latn-CA": "d/MM/yyyy",
		  "ja-JP": "yyyy/MM/dd",
		  "ka-GE": "dd.MM.yyyy",
		  "kk-KZ": "dd.MM.yyyy",
		  "kl-GL": "dd-MM-yyyy",
		  "km-KH": "yyyy-MM-dd",
		  "kn-IN": "dd-MM-yy",
		  "ko-KR": "yyyy. MM. dd",
		  "kok-IN": "dd-MM-yyyy",
		  "ky-KG": "dd.MM.yy",
		  "lb-LU": "dd/MM/yyyy",
		  "lo-LA": "dd/MM/yyyy",
		  "lt-LT": "yyyy.MM.dd",
		  "lv-LV": "yyyy.MM.dd.",
		  "mi-NZ": "dd/MM/yyyy",
		  "mk-MK": "dd.MM.yyyy",
		  "ml-IN": "dd-MM-yy",
		  "mn-MN": "yy.MM.dd",
		  "mn-Mong-CN": "yyyy/M/d",
		  "moh-CA": "M/d/yyyy",
		  "mr-IN": "dd-MM-yyyy",
		  "ms-BN": "dd/MM/yyyy",
		  "ms-MY": "dd/MM/yyyy",
		  "mt-MT": "dd/MM/yyyy",
		  "nb-NO": "dd.MM.yyyy",
		  "ne-NP": "M/d/yyyy",
		  "nl-BE": "d/MM/yyyy",
		  "nl-NL": "d-M-yyyy",
		  "nn-NO": "dd.MM.yyyy",
		  "nso-ZA": "yyyy/MM/dd",
		  "oc-FR": "dd/MM/yyyy",
		  "or-IN": "dd-MM-yy",
		  "pa-IN": "dd-MM-yy",
		  "pl-PL": "dd.MM.yyyy",
		  "prs-AF": "dd/MM/yy",
		  "ps-AF": "dd/MM/yy",
		  "pt-BR": "d/M/yyyy",
		  "pt-PT": "dd-MM-yyyy",
		  "qut-GT": "dd/MM/yyyy",
		  "quz-BO": "dd/MM/yyyy",
		  "quz-EC": "dd/MM/yyyy",
		  "quz-PE": "dd/MM/yyyy",
		  "rm-CH": "dd/MM/yyyy",
		  "ro-RO": "dd.MM.yyyy",
		  "ru-RU": "dd.MM.yyyy",
		  "rw-RW": "M/d/yyyy",
		  "sa-IN": "dd-MM-yyyy",
		  "sah-RU": "MM.dd.yyyy",
		  "se-FI": "d.M.yyyy",
		  "se-NO": "dd.MM.yyyy",
		  "se-SE": "yyyy-MM-dd",
		  "si-LK": "yyyy-MM-dd",
		  "sk-SK": "d. M. yyyy",
		  "sl-SI": "d.M.yyyy",
		  "sma-NO": "dd.MM.yyyy",
		  "sma-SE": "yyyy-MM-dd",
		  "smj-NO": "dd.MM.yyyy",
		  "smj-SE": "yyyy-MM-dd",
		  "smn-FI": "d.M.yyyy",
		  "sms-FI": "d.M.yyyy",
		  "sq-AL": "yyyy-MM-dd",
		  "sr-Cyrl-BA": "d.M.yyyy",
		  "sr-Cyrl-CS": "d.M.yyyy",
		  "sr-Cyrl-ME": "d.M.yyyy",
		  "sr-Cyrl-RS": "d.M.yyyy",
		  "sr-Latn-BA": "d.M.yyyy",
		  "sr-Latn-CS": "d.M.yyyy",
		  "sr-Latn-ME": "d.M.yyyy",
		  "sr-Latn-RS": "d.M.yyyy",
		  "sv-FI": "d.M.yyyy",
		  "sv-SE": "yyyy-MM-dd",
		  "sw-KE": "M/d/yyyy",
		  "syr-SY": "dd/MM/yyyy",
		  "ta-IN": "dd-MM-yyyy",
		  "te-IN": "dd-MM-yy",
		  "tg-Cyrl-TJ": "dd.MM.yy",
		  "th-TH": "d/M/yyyy",
		  "tk-TM": "dd.MM.yy",
		  "tn-ZA": "yyyy/MM/dd",
		  "tr-TR": "dd.MM.yyyy",
		  "tt-RU": "dd.MM.yyyy",
		  "tzm-Latn-DZ": "dd-MM-yyyy",
		  "ug-CN": "yyyy-M-d",
		  "uk-UA": "dd.MM.yyyy",
		  "ur-PK": "dd/MM/yyyy",
		  "uz-Cyrl-UZ": "dd.MM.yyyy",
		  "uz-Latn-UZ": "dd/MM yyyy",
		  "vi-VN": "dd/MM/yyyy",
		  "wo-SN": "dd/MM/yyyy",
		  "xh-ZA": "yyyy/MM/dd",
		  "yo-NG": "d/M/yyyy",
		  "zh-CN": "yyyy/M/d",
		  "zh-HK": "d/M/yyyy",
		  "zh-MO": "d/M/yyyy",
		  "zh-SG": "d/M/yyyy",
		  "zh-TW": "yyyy/M/d",
		  "zu-ZA": "yyyy/MM/dd",
		};
	  
		return (formats[navigator.language] ?? "dd/MM/yyyy").toUpperCase();
	  }
}
//////////////////////////////////////////