function miTrackReferral() {

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

		}

		return n;

	}

	(function () {

		var newReferral = getReferral(mi_td),
			cFirst = getCookie("mi_first_referral"),
			cLast = getCookie("mi_last_referral"),
			tFirst = false,
			tLast = false;

		// Get first referral
		// Check for 'mi_first_referral' cookie
		// Check for newReferral
		// Otherwise set default values

		if (cfirst) {

			tFirst = JSON.parse(cfirst);

		} else if (newReferral) {

			tFirst = newReferral;
			setCookie("mi_first_referral", JSON.stringify(tFirst), 180, mi_td);

		} else {

			tFirst = new Referral("Web Form", "-", "-", "-", "-");
			setCookie("mi_first_referral", JSON.stringify(tFirst), 180, mi_td);

		}

		// Get last referral
		// Check for 'mi_last_referral' cookie
		// Check for newReferral
		// Otherwise set default values

		if (clast) {

			tLast = JSON.parse(clast);

		} else if (newReferral) {

			tLast = newReferral;
			setCookie("mi_last_referral", JSON.stringify(tLast), false, mi_td);

		} else {

			tLast = new Referral("Web Form", "-", "-", "-", "-");
			setCookie("mi_last_referral", JSON.stringify(tLast), false, mi_td);

		}

		if (tFirst && tLast) {

			// Populate form inputs

			function setValue(iname, ivalue) {
				var input = document.getElementsByName(iname);
				for (var i = 0; i < input.length; i++) {
					input[i].value = ivalue;
				}
			}

			setValue(mi_fs, tFirst["source"]);
			setValue(mi_fm, tFirst["medium"]);
			setValue(mi_ft, tFirst["term"]);
			setValue(mi_fc, tFirst["content"]);
			setValue(mi_fn, tFirst["campaign"]);
			setValue(mi_ls, tLast["source"]);
			setValue(mi_lm, tLast["medium"]);
			setValue(mi_lt, tLast["term"]);
			setValue(mi_lc, tLast["content"]);
			setValue(mi_ln, tLast["campaign"]);

			// Populate Pardot iframes

			function setUrl (domain) {
				var iframes = document.getElementsByTagName("iframe");
				for (var i = 0; i < iframes.length; i++) {
					if (iframes[i].src && iframes[i].src.indexOf(domain) > -1) {

						var amp = (iframes[i].src.indexOf("?") > -1 ? "&" : "?");
						var url = iframes[i].src;

						url += amp+mi_fs+"="+encodeURI(tFirst["source"]);
						url += "&"+mi_fm+"="+encodeURI(tFirst["medium"]);
						url += "&"+mi_ft+"="+encodeURI(tFirst["term"]);
						url += "&"+mi_fc+"="+encodeURI(tFirst["content"]);
						url += "&"+mi_fn+"="+encodeURI(tFirst["campaign"]);
						url += "&"+mi_ls+"="+encodeURI(tLast["source"]);
						url += "&"+mi_lm+"="+encodeURI(tLast["medium"]);
						url += "&"+mi_lt+"="+encodeURI(tLast["term"]);
						url += "&"+mi_lc+"="+encodeURI(tLast["content"]);
						url += "&"+mi_ln+"="+encodeURI(tLast["campaign"]);

						iframes[i].src = url;

					}
				}
			}

			if (mi_pu) {
				setUrl(mi_pu);
			}

		}

		// Clean url
		removeUtms();

	})();

}
