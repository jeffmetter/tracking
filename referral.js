(function () {

	function getHash(key) {
		var query = window.location.hash.substring(1);
		var pars = query.split("&");
		for (var i = 0; i < pars.length; i++) {
			var values = pars[i].split("=");
			if (values[0] == key) return values[1];
		}
		return (false);
	}

	function getQuery(key) {
		var query = window.location.search.substring(1);
		var pars = query.split("&");
		for (var i = 0; i < pars.length; i++) {
			var values = pars[i].split("=");
			if (values[0] == key) return values[1];
		}
		return (false);
	}

	function setCookie(name, value, expires, domain) {
		var cookie = name + "=" + value + ";";
		if (expires) {
			var d = new Date();
			d.setTime(d.getTime() + (expires*24*60*60*1000));
			cookie += "expires=" + d.toUTCString() + ";";
		}
		cookie += "domain=" + domain + ";";
		cookie += "path=/";
		document.cookie = cookie;
	}

	function getCookie(name) {
		var name = name + "=";
		var ca = document.cookie.split(";");
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==" ") c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
		}
		return "";
	}

	function removeUtms() {
		var l = window.location;
		if (l.hash.indexOf("utm") != -1) {
			if (window.history.replaceState) {
				history.replaceState({}, "", l.pathname + l.search);
			} else {
				l.hash = "";
			}
		}
	}

	function Referral(source, medium, term, content, campaign) {
		this.source = source;
		this.medium = medium;
		this.term = term;
		this.content = content;
		this.campaign = campaign;
	}

	function getReferral(domain) {

		var ref = document.referrer,
			hs = getHash("utm_source"),
			hm = getHash("utm_medium"),
			ht = getHash("utm_term"),
			hc = getHash("utm_content"),
			hn = getHash("utm_campaign"),
			qs = getQuery("utm_source"),
			qm = getQuery("utm_medium"),
			qt = getQuery("utm_term"),
			qc = getQuery("utm_content"),
			qn = getQuery("utm_campaign"),
			n = false;

		if (hs || hm || ht || hc || hn) {

			if (!hs) hs = "-";
			if (!hm) hm = "-";
			if (!ht) ht = "-";
			if (!hc) hc = "-";
			if (!hn) hn = "-";
			n = new Referral(hs, hm, ht, hc, hn);

		} else if (qs || qm || qt || qc || qn) {

			if (!qs) qs = "-";
			if (!qm) qm = "-";
			if (!qt) qt = "-";
			if (!qc) qc = "-";
			if (!qn) qn = "-";
			n = new Referral(qs, qm, qt, qc, qn);

		} else if (ref && ref.indexOf(domain) == -1) {

			n = new Referral(ref, "-", "-", "-", "-");

		} else if (!ref) {

			n = new Referral("Web Form", "-", "-", "-", "-");

		}

		return n;

	}



	// get referral 

	var newReferral = getReferral(mi_td);



	// get cookies

	var	firstCookie = getCookie("mi_first_referral"),
		lastCookie = getCookie("mi_last_referral");



	// set cookies

	if (newReferral) {

		setCookie("mi_last_referral", JSON.stringify(newReferral), false, mi_td);

		if (!firstCookie) {

			setCookie("mi_first_referral", JSON.stringify(newReferral), 180, mi_td);

		}

	}



	// figure out whch values to track

	var trackFirst = false,
		trackLast = false;

	if (newReferral) {

		trackLast = newReferral;

		if (firstCookie) {

			trackFirst = JSON.parse(firstCookie);

		} else {

			trackFirst = newReferral;

		}

	} else if (firstCookie && lastCookie) {

		trackFirst = JSON.parse(firstCookie);

		trackLast = JSON.parse(lastCookie);

	}



	// add values to forms

	if (trackFirst && trackLast) {

		// populate form inputs

		function setValue(iname, ivalue) {
			var input = document.getElementsByName(iname);
			for (var i = 0; i < input.length; i++) {
				input[i].value = ivalue;
			}
		}

		setValue(mi_fs, trackFirst["source"]);
		setValue(mi_fm, trackFirst["medium"]);
		setValue(mi_ft, trackFirst["term"]);
		setValue(mi_fc, trackFirst["content"]);
		setValue(mi_fn, trackFirst["campaign"]);
		setValue(mi_ls, trackLast["source"]);
		setValue(mi_lm, trackLast["medium"]);
		setValue(mi_lt, trackLast["term"]);
		setValue(mi_lc, trackLast["content"]);
		setValue(mi_ln, trackLast["campaign"]);

		// populate pardot iframes

		function trackIframeUrl (domain) {
			var iframes = document.getElementsByTagName("iframe");
			for (var i = 0; i < iframes.length; i++) {
				if (iframes[i].src && iframes[i].src.indexOf(domain) > -1) {

					var amp = (iframes[i].src.indexOf("?") > -1 ? "&" : "?");
					var url = iframes[i].src;

					url += amp+mi_fs+"="+encodeURI(trackFirst["source"]);
					url += "&"+mi_fm+"="+encodeURI(trackFirst["medium"]);
					url += "&"+mi_ft+"="+encodeURI(trackFirst["term"]);
					url += "&"+mi_fc+"="+encodeURI(trackFirst["content"]);
					url += "&"+mi_fn+"="+encodeURI(trackFirst["campaign"]);
					url += "&"+mi_ls+"="+encodeURI(trackLast["source"]);
					url += "&"+mi_lm+"="+encodeURI(trackLast["medium"]);
					url += "&"+mi_lt+"="+encodeURI(trackLast["term"]);
					url += "&"+mi_lc+"="+encodeURI(trackLast["content"]);
					url += "&"+mi_ln+"="+encodeURI(trackLast["campaign"]);

					iframes[i].src = url;

				}
			}
		}

		if (mi_pu) {
			trackIframeUrl(mi_pu);
		}

	}

	removeUtms();

})();
